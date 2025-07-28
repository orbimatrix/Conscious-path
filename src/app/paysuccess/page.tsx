import React from "react";
import ContactSection from "../components/ContactSection";
import FooterSection from "../components/FooterSection";

export default function PaySuccessPage() {
  return (
    <div>
      <div className="paysuccess-container">
        <h1 className="paysuccess-heading">Gracias por su compra</h1>
        <div className="paysuccess-content">
          <p className="paysuccess-paragraph">
            El pago se ha realizado con éxito.<br />
            Recibirá en su email información sobre la operación realizada.
          </p>
          <p className="paysuccess-paragraph">
            Si lo desea puede ir al <a href="/">INICIO</a> para explorar nuevos conocimientos y productos.
          </p>
          <p className="paysuccess-paragraph">
            También puede <a href="/">VER TODO EL CONTENIDO</a> y descubrir un mundo de posibilidades.
          </p>
          <p className="paysuccess-paragraph">
            Si tiene alguna duda, puedes escribirnos:
          </p>
        </div>
        <div className="paysuccess-email-center">
          Escriba su email y mensaje:
        </div>
      </div>
      <ContactSection />
      <FooterSection />
    </div>
  );
}
