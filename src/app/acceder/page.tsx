"use client"
import React, { useState } from "react";
import FooterSection from "../components/FooterSection";
import ContactSection from "../components/ContactSection";
import "./acceder.css";

export default function AccederPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  const plans = [
    {
      id: "carisma",
      name: "NIVEL CARISMA",
      price: "$15",
      period: "por mes",
      features: [
        "10 Directos al año",
        "Actualidad real",
        "Tecnología y ciencia",
        "Abundancia",
        "Bienestar",
        "Acceso nivel BENEC",
        "X",
        "X",
        "X",
        "X",
        "X",
        "X",
        "X"
      ],
      popular: true
    },
    {
      id: "karma",
      name: "NIVEL KARMA",
      price: "$150",
      period: "por mes",
      features: [
        "20 Directos al año",
        "Actualidad real",
        "Tecnología y ciencia",
        "Abundancia",
        "Bienestar",
        "Acceso nivel BENEC",
        "Posesión y demonios",
        "Bienestar avanzado",
        "Karma",
        "Reencarnación",
        "Acceso a Renacer Consciente",
        "Posibilidad de ser seleccionado para Renacer Consciente de forma gratuita",
        "Atención preferente"
      ],
      popular: false
    }
  ];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    if (planId === "carisma") {
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSelect = (paymentType: string) => {
    setSelectedPayment(paymentType);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedPayment(null);
  };

  return (
    <div className="acceder-page">
      <main className="acceder-main">
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">DECIDA SU NIVEL</h1>
            <p className="hero-subtitle">
              Felicidades por dar el gran paso. Ahora puede seleccionar el nivel de conocimientos que tendrá en su mano. Estas son las opciones:
            </p>
          </div>
        </section>

        <section className="plans-section">
          <div className="plans-container">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`plan-card ${plan.popular ? 'popular' : ''} ${selectedPlan === plan.id ? 'selected' : ''}`}
                onClick={() => handlePlanSelect(plan.id)}
              >
                {plan.popular && (
                  <div className="popular-badge">Recomendado</div>
                )}
                
                <div className="plan-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  <div className="plan-price">
                    <span className="price-amount">{plan.price}</span>
                    <span className="price-period">{plan.period}</span>
                  </div>
                </div>

                <ul className="plan-features">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="plan-feature">
                      <span className="feature-icon">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button 
                  className={`plan-button ${selectedPlan === plan.id ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlanSelect(plan.id);
                  }}
                >
                  {selectedPlan === plan.id ? 'Seleccionado' : `Entrar en el nivel ${plan.name.split(' ')[1]}`}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="contact-options-section">
          <div className="contact-options-container">
            <h2 className="contact-options-title">Envíe un mensaje si desea:</h2>
            <div className="contact-options-list">
              <div className="contact-option">
                <span className="option-label">A.</span>
                <span className="option-text">
                  Pagar con criptomonedas. Son recomendables USDT, USDC y BTC. Consultar para otras. Recibirá la dirección del monedero adecuado.
                </span>
              </div>
              <div className="contact-option">
                <span className="option-label">B.</span>
                <span className="option-text">
                  Usar otras formas de pago.
                </span>
              </div>
              <div className="contact-option">
                <span className="option-label">C.</span>
                <span className="option-text">
                  Solicitudes especiales para su caso.
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="contact-instruction">
          <p>Escriba su email y mensaje:</p>
        </div>

        <ContactSection />

        {/* Payment Selection Modal */}
        {showPaymentModal && (
          <div className="payment-modal-overlay" onClick={closePaymentModal}>
            <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
              <button className="payment-modal-close" onClick={closePaymentModal}>×</button>
              
              <div className="payment-sections">
                {/* Monthly Plan Section */}
                <div className="payment-section">
                  <h3 className="payment-section-title">Seleccione su preferencia:</h3>
                  <div className="monthly-plan">
                    <div className="monthly-price">
                      <span className="price-large">15$</span>
                      <span className="price-period">/mes</span>
                    </div>
                    <button 
                      className={`payment-option ${selectedPayment === 'monthly-single' ? 'selected' : ''}`}
                      onClick={() => handlePaymentSelect('monthly-single')}
                    >
                      <div>Pago único</div>
                      <div className="payment-subtitle">con Tarjeta, Paypal, etc</div>
                    </button>
                  </div>
                </div>

                <div className="payment-divider"></div>

                {/* Annual Plan Section */}
                <div className="payment-section">
                  <div className="annual-plan">
                    <div className="annual-price">
                      <span className="price-large">150$</span>
                      <span className="price-period">/año</span>
                    </div>
                    <div className="discount-badge">20% de descuento</div>
                    
                    <div className="annual-payment-options">
                      <button 
                        className={`payment-option ${selectedPayment === 'annual-single' ? 'selected' : ''}`}
                        onClick={() => handlePaymentSelect('annual-single')}
                      >
                        <div>Pago único</div>
                        <div className="payment-subtitle">con Tarjeta, Paypal, etc</div>
                      </button>
                      
                      <button 
                        className={`payment-option ${selectedPayment === 'annual-3months' ? 'selected' : ''}`}
                        onClick={() => handlePaymentSelect('annual-3months')}
                      >
                        <div>Pago en 3 meses con Paypal</div>
                      </button>
                      
                      <button 
                        className={`payment-option ${selectedPayment === 'annual-telegram' ? 'selected' : ''}`}
                        onClick={() => handlePaymentSelect('annual-telegram')}
                      >
                        <div>Pago con Telegram</div>
                        <div className="points-badge">100% Más de PUNTOS</div>
                      </button>
                      
                      <button 
                        className={`payment-option ${selectedPayment === 'annual-crypto' ? 'selected' : ''}`}
                        onClick={() => handlePaymentSelect('annual-crypto')}
                      >
                        <div>Pago con Criptomoneda</div>
                        <div className="points-badge">200% Más de PUNTOS</div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {selectedPayment && (
                <button className="proceed-payment-btn">
                  Continuar con el Pago
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      <FooterSection />
    </div>
  );
}
