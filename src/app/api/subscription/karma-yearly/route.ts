import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@clerk/nextjs/server'
import { stripe } from '../../../../lib/stripe'

export async function POST() {
  try {
    // Get authenticated user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const headersList = await headers()
    const origin = headersList.get('origin')

    // Create Checkout Sessions for Karma Yearly subscription
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: 'price_1S179ADq7sTN0VRG2W2ypgp8', // Karma 1500$/year
          quantity: 1,
        },
      ],
      mode: 'subscription',
      metadata: {
        clerkId: userId // Store Clerk ID in session metadata
      },
      subscription_data: {
        metadata: {
          clerkId: userId // Store Clerk ID in subscription metadata
        }
      },
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
