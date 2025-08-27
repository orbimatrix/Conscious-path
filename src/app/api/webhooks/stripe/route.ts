import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { updateUserLevel, addUserPoints, calculatePointsFromAmount } from '@/lib/subscription-utils';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature || !webhookSecret) {
      console.error('Missing Stripe signature or webhook secret');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log('Webhook event received:', event.type);
    console.log('Event data:', JSON.stringify(event.data.object, null, 2));

    // Handle different event types
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleSubscriptionChange(subscription: any) {
  try {
    const customerId = subscription.customer;
    const productId = subscription.items.data[0]?.price?.product;
    const status = subscription.status;
    
    if (!customerId || !productId) {
      console.error('Missing customer or product ID in subscription');
      return;
    }

    // Try to get Clerk ID from subscription metadata first, then customer metadata
    let clerkId = subscription.metadata?.clerkId;
    
    if (!clerkId) {
      // Fallback: Get customer details from Stripe to get Clerk ID from metadata
      const customer = await stripe.customers.retrieve(customerId as string);
      if (!customer || customer.deleted) {
        console.error('Customer not found or deleted');
        return;
      }
      clerkId = customer.metadata?.clerkId;
    }

    if (!clerkId) {
      console.error('Customer has no Clerk ID in metadata');
      console.log('Subscription metadata:', subscription.metadata);
      console.log('Customer ID:', customerId);
      return;
    }

    // Get product details
    const product = await stripe.products.retrieve(productId as string);
    if (!product) {
      console.error('Product not found');
      return;
    }

    // Find user by Clerk ID
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId)
    });

    if (!user) {
      console.error('User not found for Clerk ID:', clerkId);
      return;
    }

    // Calculate subscription tier based on product name and amount
    const tier = calculateSubscriptionTier(subscription, product);
    
    // Update user level if subscription is active
    if (status === 'active' && tier !== 'basic') {
      await updateUserLevel(user.id, tier);
    }

    console.log(`Updated user ${user.id} level for subscription: ${product.name}`);
  } catch (error) {
    console.error('Error handling subscription change:', error);
  }
}

async function handlePaymentSuccess(invoice: any) {
  try {
    const customerId = invoice.customer;
    const amount = invoice.amount_paid; // Amount in cents
    
    // Try to get Clerk ID from multiple sources in order of preference
    let clerkId = invoice.metadata?.clerkId;
    
    if (!clerkId) {
      // Check invoice line items metadata
      clerkId = invoice.lines?.data?.[0]?.metadata?.clerkId;
    }
    
    if (!clerkId) {
      // Check parent subscription details metadata
      clerkId = invoice.parent?.subscription_details?.metadata?.clerkId;
    }
    
    if (!clerkId) {
      // Fallback: Get customer details from Stripe to get Clerk ID from metadata
      const customer = await stripe.customers.retrieve(customerId as string);
      if (!customer || customer.deleted) {
        console.error('Customer not found or deleted');
        return;
      }
      clerkId = customer.metadata?.clerkId;
    }

    if (!clerkId) {
      console.error('Customer has no Clerk ID in metadata');
      console.log('Invoice metadata:', invoice.metadata);
      console.log('Invoice line items metadata:', invoice.lines?.data?.[0]?.metadata);
      console.log('Parent subscription metadata:', invoice.parent?.subscription_details?.metadata);
      console.log('Customer ID:', customerId);
      return;
    }
    
    // Find user by Clerk ID
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId)
    });

    if (!user) {
      console.error('User not found for Clerk ID:', clerkId);
      return;
    }

    // Calculate points: $1 = 1 point
    const pointsToAdd = calculatePointsFromAmount(amount);
    
    // Add points to user account
    await addUserPoints(user.id, pointsToAdd);

    console.log(`Added ${pointsToAdd} points to user ${user.id}`);
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

function calculateSubscriptionTier(subscription: any, product: any) {
  const item = subscription.items.data[0];
  const price = item.price;
  const amount = price.unit_amount || 0;
  
  // Determine subscription tier based on product name and amount
  let tier = 'basic';
  
  if (product.name.toLowerCase().includes('karma')) {
    if (amount >= 150000) { // $1500/year
      tier = 'karma_yearly';
    } else if (amount >= 15000) { // $150/month
      tier = 'karma_monthly';
    }
  } else if (product.name.toLowerCase().includes('carisma')) {
    if (amount >= 15000) { // $150/year
      tier = 'carisma_yearly';
    } else if (amount >= 1500) { // $15/month
      tier = 'carisma_monthly';
    }
  }
  
  return tier;
}
