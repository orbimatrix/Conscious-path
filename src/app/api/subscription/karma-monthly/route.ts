import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { stripe } from '../../../../lib/stripe'

export async function POST() {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')

    // Create Checkout Sessions for Karma Monthly subscription
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: 'price_1S0gLcCVRRyLCIRPt60GKeWG', // Karma 150$/month
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/paysuccess?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payfail`,
    });

    if (!session.url) {
        throw new Error('Failed to create checkout session');
      }

    return NextResponse.redirect(session.url, 303)
  } catch (err) {
    const error = err as Error;
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
