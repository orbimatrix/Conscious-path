import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@clerk/nextjs/server'
import { stripe } from '../../../lib/stripe'

export async function POST(request: Request) {
  try {
    // Get authenticated user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get form data from request body
    const body = await request.json();
    const { email, caseInfo, availability, paymentMethod, paymentAmount } = body;

    const headersList = await headers()
    const origin = headersList.get('origin')

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: 'price_1S17DxDq7sTN0VRGwGoGfPrX',
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        clerkId: userId, // Store Clerk ID in session metadata
        customerEmail: email,
        caseInfo: caseInfo,
        availability: availability,
        paymentMethod: paymentMethod,
        paymentAmount: paymentAmount
      },
      success_url: `${origin}/paysuccess?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payfail`,
    });

    if (!session.url) {
        throw new Error('Failed to create checkout session');
      }

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const error = err as Error;
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}