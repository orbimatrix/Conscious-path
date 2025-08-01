import React from "react";
import ContactSection from "../components/ContactSection";
import FooterSection from "../components/FooterSection";
import Image from "next/image";

export default function PayFailPage() {
  return (
    <div>
      <div className="payfail-container">
        <h1 className="payfail-heading">
          Error en la compra
        </h1>

        <div className="payfail-content">
          <p className="payfail-paragraph">
            El pago NO se ha realizado con éxito.
          </p>

          <p className="payfail-paragraph">
            Motivo del error:
          </p>

          <p className="payfail-error-reason">
            &lt;INSERT HERE FAIL REASON&gt;
          </p>

          <p className="payfail-paragraph">
            Estamos a su disposición para resolver la incidencia.
          </p>

          <p className="payfail-paragraph">
            Puede contactarnos de forma inmediata a través de Telegram:
          </p>

          <button className="payfail-telegram-button">
            <Image src="/telegram.png" alt="Telegram" width={50} height={50} />
          </button>

          <p className="payfail-paragraph">
            También puede enviarnos un email:
          </p>


        </div>
      </div>

      <div>
        <p className="payfail-paragraph paragraph-email">
          Escriba su email y mensaje:
        </p>
      </div>

      <ContactSection />
      <FooterSection />
    </div>
  );
}
