import { NextRequest, NextResponse } from 'next/server';
import { sendFormConfirmationEmail, sendOwnerFormNotification, FormSubmissionData } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, caseInfo, availability, paymentMethod, acceptTerms, paymentAmount } = body;

    // Validate required fields
    if (!email || !caseInfo || !availability || !paymentMethod || !acceptTerms || !paymentAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create form data object with timestamp
    const formData: FormSubmissionData = {
      email,
      caseInfo,
      availability,
      paymentMethod,
      acceptTerms,
      paymentAmount,
      timestamp: new Date().toISOString()
    };

    // Send confirmation email to customer only
    await sendFormConfirmationEmail(formData);

    // Owner will be notified AFTER payment success via webhook
    // No need to send owner notification here

    return NextResponse.json({ 
      success: true, 
      message: 'Form submitted successfully. Check your email for confirmation. You will be redirected to payment.' 
    });

  } catch (error) {
    console.error('Error processing booking form:', error);
    return NextResponse.json(
      { error: 'Failed to process form submission' },
      { status: 500 }
    );
  }
}
