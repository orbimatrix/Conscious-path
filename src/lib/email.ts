import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface FormSubmissionData {
  email: string;
  caseInfo: string;
  availability: string;
  paymentMethod: string;
  acceptTerms: boolean;
  timestamp: string;
  paymentAmount: string;
}

export interface PaymentNotificationData {
  customerEmail: string;
  amount: string;
  sessionId: string;
  formData: FormSubmissionData;
}

// Send confirmation email to customer after form submission
export async function sendFormConfirmationEmail(formData: FormSubmissionData) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Conscious Path <onboarding@resend.dev>',
      to: [formData.email],
      subject: 'Confirmación de Solicitud - Conscious Path',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Confirmación de Solicitud</h2>
          <p>Hola,</p>
          <p>Hemos recibido su solicitud para una sesión privada. Aquí están los detalles:</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #555;">Información de su caso:</h3>
            <p>${formData.caseInfo}</p>
            
            <h3 style="color: #555;">Disponibilidad:</h3>
            <p>${formData.availability}</p>
            
            <h3 style="color: #555;">Método de pago preferido:</h3>
            <p>${formData.paymentMethod}</p>
            
            <h3 style="color: #555;">Precio de la sesión:</h3>
            <p><strong>${formData.paymentAmount}</strong></p>
          </div>
          
          <p>Nuestro equipo revisará su solicitud y se pondrá en contacto con usted en las próximas 24-48 horas para confirmar la disponibilidad y proceder con el pago.</p>
          
          <p>Si tiene alguna pregunta, no dude en contactarnos.</p>
          
          <p>Saludos cordiales,<br>Equipo Conscious Path</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending form confirmation email:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to send form confirmation email:', error);
    throw error;
  }
}

// Send notification email to owner when form is submitted
export async function sendOwnerFormNotification(formData: FormSubmissionData) {
  try {
    const ownerEmail = process.env.OWNER_EMAIL || 'owner@yourdomain.com';
    
    const { data, error } = await resend.emails.send({
      from: 'Conscious Path <onboarding@resend.dev>',
      to: [ownerEmail],
      subject: 'Nueva Solicitud de Sesión Privada',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Nueva Solicitud de Sesión Privada</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #555;">Información del Cliente:</h3>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Fecha de solicitud:</strong> ${formData.timestamp}</p>
            
            <h3 style="color: #555;">Detalles del caso:</h3>
            <p>${formData.caseInfo}</p>
            
            <h3 style="color: #555;">Disponibilidad:</h3>
            <p>${formData.availability}</p>
            
            <h3 style="color: #555;">Método de pago preferido:</h3>
            <p>${formData.paymentMethod}</p>
            
            <h3 style="color: #555;">Precio de la sesión:</h3>
            <p><strong>${formData.paymentAmount}</strong></p>
          </div>
          
          <p>Esta solicitud está pendiente de revisión y confirmación de disponibilidad.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending owner form notification:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to send owner form notification:', error);
    throw error;
  }
}

// Send notification email to owner when payment is received
export async function sendOwnerPaymentNotification(paymentData: PaymentNotificationData) {
  try {
    const ownerEmail = process.env.OWNER_EMAIL || 'owner@yourdomain.com';
    
    const { data, error } = await resend.emails.send({
      from: 'Conscious Path <onboarding@resend.dev>',
      to: [ownerEmail],
      subject: 'Pago Recibido - Nueva Sesión Confirmada',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Pago Recibido - Nueva Sesión Confirmada</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #555;">Información del Pago:</h3>
            <p><strong>Email del cliente:</strong> ${paymentData.customerEmail}</p>
            
            <h3 style="color: #555;">Detalles de la solicitud original:</h3>
            <p><strong>Email:</strong> ${paymentData.formData.email}</p>
            <p><strong>Fecha de solicitud:</strong> ${paymentData.formData.timestamp}</p>
            <p><strong>Información del caso:</strong> ${paymentData.formData.caseInfo}</p>
            <p><strong>Disponibilidad:</strong> ${paymentData.formData.availability}</p>
            <p><strong>Método de pago preferido:</strong> ${paymentData.formData.paymentMethod}</p>
            <p><strong>Precio de la sesión:</strong> ${paymentData.formData.paymentAmount}</p>
          </div>
          
          <p>El cliente ha completado el pago. Proceda a coordinar la sesión según la disponibilidad indicada.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending owner payment notification:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to send owner payment notification:', error);
    throw error;
  }
}
