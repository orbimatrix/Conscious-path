import React from "react";
import Link from "next/link";
import { redirect } from 'next/navigation';
import ContactSection from "../components/ContactSection";
import FooterSection from "../components/FooterSection";
import { stripe } from '../../lib/stripe'

interface SearchParams {
  session_id?: string;
}

export default async function PaySuccessPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    console.log('No session_id provided');
    return redirect('/');
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent']
  });

  const { status, customer_details } = session;

  if (status === 'open') {
    return redirect('/')
  }

  if (status === 'complete') {
    const customerEmail = customer_details?.email || 'su email registrado';
    
    return (
      <div>
        <div className="paysuccess-container">
          <h1 className="paysuccess-heading">Gracias por su compra</h1>
          <div className="paysuccess-content">
            <p className="paysuccess-paragraph">
              El pago se ha realizado con éxito.<br />
              Recibirá en su email ({customerEmail}) información sobre la operación realizada.
            </p>
            <p className="paysuccess-paragraph">
              Si lo desea puede ir al <Link href="/">INICIO</Link> para explorar nuevos conocimientos y productos.
            </p>
            <p className="paysuccess-paragraph">
              También puede <Link href="/">VER TODO EL CONTENIDO</Link> y descubrir un mundo de posibilidades.
            </p>
            <p className="paysuccess-paragraph">
              Si tiene alguna duda, puedes escribirnos:
            </p>
          </div>
        </div>
        <div className="paysuccess-email-center">
          Escriba su email y mensaje:
        </div>
        <ContactSection />
        <FooterSection />
      </div>
    );
  }

  // Handle other statuses
  return (
    <div>
      <div className="paysuccess-container">
        <h1 className="paysuccess-heading">Estado del pago</h1>
        <div className="paysuccess-content">
          <p className="paysuccess-paragraph">
            El estado de su pago es: {status}
          </p>
          <p className="paysuccess-paragraph">
            Si tiene alguna duda, puede escribirnos:
          </p>
        </div>
      </div>
      <div className="paysuccess-email-center">
        Escriba su email y mensaje:
      </div>
      <ContactSection />
      <FooterSection />
    </div>
  );
}
