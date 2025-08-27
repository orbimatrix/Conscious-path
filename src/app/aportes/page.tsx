"use client"
import React, { useState } from "react";
import Image from "next/image";
import FooterSection from "../components/FooterSection";
import SignupModal from "../components/SignupModal";
import { useAuth } from "../../lib/auth";
import "./aportes.css";

export default function AportesPage() {
  const { showSignupModal, closeSignupModal } = useAuth();
  const [messageSent, setMessageSent] = useState(false);
  const [messageText, setMessageText] = useState("");

  const handleSendMessage = () => {
    // if (!requireAuth()) {
    //   return; // Show signup modal instead
    // }
    if (messageText.trim()) {
      setMessageSent(true);
      setMessageText("");
    }
  };

  // Auto-hide success message after 12 seconds
  React.useEffect(() => {
    if (messageSent) {
      const timer = setTimeout(() => {
        setMessageSent(false);
      }, 12000); // 12 seconds

      return () => clearTimeout(timer);
    }
  }, [messageSent]);

  return (
    <div className="aportes-page">
      {/* Brown Banner Section */}
      <section className="aportes-banner">
        <div className="aportes-banner-content">
          <h1 className="aportes-banner-subtitle">CONDICIONES DE USO</h1>
          <h2 className="aportes-banner-title">DONACIONES, APORTES Y PAGOS</h2>
        </div>
      </section>

      <main className="aportes-main">
        {/* Payment Information Section */}
        <section className="payment-info-section">
          <div className="payment-info-container">
            <h2 className="payment-info-title">
              FORMAS DE PAGO Y RECOMPENSAS
            </h2>
          </div>
        </section>

        {/* Credit Card Image Section - New separate section */}
        <section className="credit-card-full-section">
          <Image
            src="/fotos/credit_card.png"
            alt="Credit cards and wallet for payment methods"
            className="credit-card-full-image"
            fill
            sizes="100vw"
          />
        </section>

        {/* Payment Methods and Rewards Section */}
        <section className="payment-methods-section">
          <div className="payment-methods-container">
            <h3 className="payment-methods-title">
              Formas de pago y premios
            </h3>

            <div className="payment-methods-content">
              <p className="payment-paragraph">
                &ldquo;Senda Consciente&rdquo; agradece la colaboración y constancia. Premiamos cada aporte y pago con <strong>PUNTOS</strong>. Estos puntos serán considerados para diversas promociones, prioridades y accesos preferentes.
              </p>

              <div className="points-list-section">
                <h4 className="points-list-title">Además, algunos medios de pago tendrán un premio extra en forma de puntos:</h4>
                <ul className="points-list">
                  <li className="points-item">
                    <span className="payment-method">Tarjeta:</span> 1 punto por $
                  </li>
                  <li className="points-item">
                    <span className="payment-method">Criptomoneda:</span> 3 puntos por $
                  </li>
                  <li className="points-item">
                    <span className="payment-method">Transferencia:</span> 1 punto por $
                  </li>
                  <li className="points-item">
                    <span className="payment-method">Telegram:</span> 2 puntos por $
                  </li>
                  <li className="points-item">
                    <span className="payment-method">Efectivo:</span> 3 puntos por $
                  </li>
                  <li className="points-item">
                    <span className="payment-method">Paypal:</span> 1 punto por $
                  </li>
                  <li className="points-item">
                    <span className="payment-method">Otras:</span> consultar
                  </li>
                </ul>
              </div>

              <p className="payment-paragraph">
              Nuestro proyecto a largo plazo también aceptará donaciones y traspasos de propiedades, previa consulta.
              </p>

              <p className="payment-paragraph">
              Sabiendo que trabajamos con personas, siempre es posible considerar rebajas, plazos, modificaciones y excepciones, para ayudar en casos particulares. Póngase en contacto con nosotros y comente su caso.
              </p>
              <p className="payment-paragraph">
              Antes de usar criptomonedas o realizar transferencias, es necesario confirmar los datos, para evitar errores o pérdidas.
              </p>


            </div>
          </div>
        </section>
      </main>

      {/* Top Brown Banner - Outside main for full width */}
      <div className="top-brown-banner">
        <div className="top-brown-banner-content">
          <p className="top-brown-banner-text">
            Los aportes del grupo BENEC tendrán una recompensa superior de 2 puntos x $ o más, cualquiera que sea el método usado.
          </p>
        </div>
      </div>

      {/* Payment Buttons Section */}
      <section className="payment-buttons-section">
        <div className="payment-buttons-container">
          <a 
            href="https://buy.stripe.com/test_9B66oGaC7fBLeEJ6W0gA804" 
            target="_blank" 
            rel="noopener noreferrer"
            className="payment-button card-button"
          >
            REALIZAR APORTE CON TARJETA
          </a>
          <button className="payment-button paypal-button">
            REALIZAR APORTE CON PAYPAL
          </button>

          <p className="inquiry-text">
            Envíe su consulta sobre la forma de pago preferida, o sobre condiciones particulares.
          </p>
        </div>
      </section>

      {/* Bottom Brown Banner with Contact Form - Outside main for full width */}
      <div className="bottom-brown-banner">
        <div className="bottom-brown-banner-content">
          <div className="contact-form-container">
            <textarea
              className="contact-textarea"
              placeholder="Texto..."
              rows={4}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            ></textarea>
            <button
              className="send-message-button"
              onClick={handleSendMessage}
            >
              ENVIAR MENSAJE
            </button>


          </div>
        </div>
      </div>
      {messageSent && (
        <div className="success-message">
          <p className="success-text">
            SU CONSULTA HA SIDO ENVIADA. RECIBIRÁ RESPUESTA POR EMAIL.
          </p>

        </div>
      )}

      <FooterSection />

      {/* Signup Modal */}
      <SignupModal
        isOpen={showSignupModal}
        onClose={closeSignupModal}
        title="Inicia sesión para hacer aportes"
        message="Necesitas iniciar sesión para realizar donaciones y aportes."
      />
    </div>
  );
}
