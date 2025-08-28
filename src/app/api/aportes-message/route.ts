import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    // Validate required field
    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'El mensaje es requerido' },
        { status: 400 }
      );
    }

    // Send email to owner
    const ownerEmail = process.env.OWNER_EMAIL || 'owner@yourdomain.com';
    
    const { data, error } = await resend.emails.send({
      from: 'Conscious Path <onboarding@resend.dev>',
      to: [ownerEmail],
      subject: 'Nuevo Mensaje de Aportes - Conscious Path',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Nuevo Mensaje de Aportes</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #555;">Mensaje del Usuario:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          
          <p>Este mensaje fue enviado desde la página de aportes de tu sitio web.</p>
          <p>El usuario está consultando sobre formas de pago o condiciones particulares.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending aportes message email:', error);
      return NextResponse.json(
        { error: 'Error al enviar el mensaje' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Mensaje enviado correctamente' });
  } catch (error) {
    console.error('Failed to process aportes message:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
