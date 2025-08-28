import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate required field
    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: 'El email es requerido' },
        { status: 400 }
      );
    }

    // Send email to owner
    const ownerEmail = process.env.OWNER_EMAIL || 'owner@yourdomain.com';
    
    const { data, error } = await resend.emails.send({
      from: 'Conscious Path <onboarding@resend.dev>',
      to: [ownerEmail],
      subject: 'Nueva Suscripción de Email - Conscious Path',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Nueva Suscripción de Email</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #555;">Email del Suscriptor:</h3>
            <p><strong>${email}</strong></p>
          </div>
          
          <p>Este usuario se ha suscrito para recibir novedades desde la página de contenidos de tu sitio web.</p>
          <p>Puedes agregar este email a tu lista de distribución para enviar actualizaciones.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending subscription email:', error);
      return NextResponse.json(
        { error: 'Error al procesar la suscripción' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Suscripción exitosa' });
  } catch (error) {
    console.error('Failed to process email subscription:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
