import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, nombre, mensaje } = await request.json();

    // Validate required fields
    if (!email || !nombre || !mensaje) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Send email to owner
    const ownerEmail = process.env.OWNER_EMAIL || 'owner@yourdomain.com';
    
    const { data, error } = await resend.emails.send({
      from: 'Conscious Path <onboarding@resend.dev>',
      to: [ownerEmail],
      subject: 'Nuevo Mensaje de Contacto - Conscious Path',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Nuevo Mensaje de Contacto</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #555;">Información del Contacto:</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>Mensaje:</strong></p>
            <p style="white-space: pre-wrap;">${mensaje}</p>
          </div>
          
          <p>Este mensaje fue enviado desde el formulario de contacto de tu sitio web.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending contact email:', error);
      return NextResponse.json(
        { error: 'Error al enviar el mensaje' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Mensaje enviado correctamente' });
  } catch (error) {
    console.error('Failed to process contact form:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
