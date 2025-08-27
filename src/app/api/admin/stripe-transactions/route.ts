import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/admin';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

export async function GET(request: Request) {
  try {
    // Verify admin access
    const adminUser = await getAdminUser();
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '200');
    const startingAfter = searchParams.get('starting_after') || undefined;
    const endingBefore = searchParams.get('ending_before') || undefined;

    // Build Stripe parameters - only expand essential fields for performance
    const params: Stripe.PaymentIntentListParams = {
      limit,
      expand: ['data.customer', 'data.payment_method'],
    };

    if (startingAfter) params.starting_after = startingAfter;
    if (endingBefore) params.ending_before = endingBefore;

    // Fetch payments from Stripe
    const payments = await stripe.paymentIntents.list(params);

    // Transform Stripe data to a more usable format - only essential fields
    const transformedPayments = payments.data.map(payment => {
      const customer = payment.customer as Stripe.Customer;
      const paymentMethod = payment.payment_method as Stripe.PaymentMethod;

      return {
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        created: payment.created,
        customer: customer ? {
          id: customer.id,
          email: customer.email,
          name: customer.name,
          phone: customer.phone,
          address: customer.address,
        } : null,
        paymentMethod: paymentMethod ? {
          id: paymentMethod.id,
          type: paymentMethod.type,
          card: paymentMethod.card ? {
            brand: paymentMethod.card.brand,
            last4: paymentMethod.card.last4,
            expMonth: paymentMethod.card.exp_month,
            expYear: paymentMethod.card.exp_year,
          } : null,
        } : null,
        metadata: payment.metadata,
        description: payment.description,
        receiptEmail: payment.receipt_email,
      };
    });

    return NextResponse.json({
      payments: transformedPayments,
      hasMore: payments.has_more,
      totalCount: payments.data.length,
      pagination: {
        startingAfter: payments.data[payments.data.length - 1]?.id,
        endingBefore: payments.data[0]?.id,
      }
    });

  } catch (error) {
    console.error('Error fetching Stripe transactions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
