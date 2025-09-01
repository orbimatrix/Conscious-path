import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@clerk/nextjs/server'
import { stripe } from '../../../../lib/stripe'

export async function POST(request: Request) {
  try {
    // Get authenticated user (optional)
    const { userId } = await auth();
    
    // Get form data from request body
    const body = await request.json();
    const { email, caseInfo, availability, paymentMethod, paymentAmount } = body;

    const headersList = await headers()
    const origin = headersList.get('origin')

    // Create metadata object with optional clerkId
    const metadata: any = {
      customerEmail: email,
      caseInfo: caseInfo,
      availability: availability,
      paymentMethod: paymentMethod,
      paymentAmount: paymentAmount
    };

    // Only add clerkId if user is authenticated
    if (userId) {
      metadata.clerkId = userId;
    }

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: 'price_1S17B7Dq7sTN0VRGLx6IeG6P',
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: metadata,
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