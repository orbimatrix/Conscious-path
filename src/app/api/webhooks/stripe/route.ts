import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { updateUserLevel, addUserPoints, calculatePointsFromAmount } from '@/lib/subscription-utils';
import { sendOwnerPaymentNotification, FormSubmissionData } from '@/lib/email';

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



    // Handle different event types
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
      
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      
      default:
        // Unhandled event type
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

    // User level updated for subscription
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

    // Points added to user account
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

async function handleCheckoutSessionCompleted(session: any) {
  try {
    // Extract Clerk ID and form data from session metadata
    const { clerkId, customerEmail, caseInfo, availability, paymentMethod, paymentAmount } = session.metadata;
    
    // Only store points if clerkId is available (user is authenticated)
    if (clerkId) {
      // Calculate points based on payment amount ($1 = 1 point)
      let paymentAmountInDollars = 0;
      
      if (paymentAmount) {
        // Handle different payment amount formats
        if (typeof paymentAmount === 'string') {
          // Remove $ and any non-numeric characters, then parse
          paymentAmountInDollars = parseFloat(paymentAmount.replace(/[^0-9.]/g, ''));
        } else if (typeof paymentAmount === 'number') {
          paymentAmountInDollars = paymentAmount;
        }
      }
      
      // Fallback: if we can't parse the payment amount, use the session amount
      if (!paymentAmountInDollars || isNaN(paymentAmountInDollars)) {
        paymentAmountInDollars = (session.amount_total / 100);
      }
      
      const pointsToAdd = Math.floor(paymentAmountInDollars);
      
      if (pointsToAdd > 0) {
        try {
          // Find user by Clerk ID
          const userData = await db.select().from(users).where(eq(users.clerkId, clerkId));
          
          if (userData.length > 0) {
            const user = userData[0];
            const currentPoints = user.points || 0;
            const newPoints = currentPoints + pointsToAdd;
            
            // Update user points and last points update timestamp
            await db.update(users)
              .set({ 
                points: newPoints,
                lastPointsUpdate: new Date(),
                lastUpdated: new Date()
              })
              .where(eq(users.clerkId, clerkId));
          }
        } catch (dbError) {
          console.error('Database error updating user points:', dbError);
        }
      }
    }
    
    if (customerEmail && caseInfo && availability && paymentMethod && paymentAmount) {
      // Create form data object for email
      const formData: FormSubmissionData = {
        email: customerEmail,
        caseInfo,
        availability,
        paymentMethod,
        acceptTerms: true,
        paymentAmount,
        timestamp: new Date().toISOString()
      };

      // Send payment notification to owner with form details
      await sendOwnerPaymentNotification({
        customerEmail: customerEmail,
        amount: `$${(session.amount_total / 100).toFixed(2)}`,
        sessionId: session.id,
        formData
      });
    }
    
  } catch (error) {
    console.error('Error handling checkout session completion:', error);
  }
}
