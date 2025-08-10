"use client"
import React, { useState } from "react";
import Image from "next/image";
import FooterSection from "../components/FooterSection";
import SignupModal from "../components/SignupModal";
import { useAuth } from "../../lib/auth";
import "./limpiar_karma.css";

export default function LimpiarKarmaPage() {
  const { showSignupModal, requireAuth, closeSignupModal } = useAuth();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    caseInfo: "",
    availability: "",
    paymentMethod: "",
    acceptTerms: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.acceptTerms && formData.email && formData.caseInfo && formData.availability && formData.paymentMethod) {
      setIsSubmitted(true);
      // Here you would typically send the data to your backend
      console.log('Form submitted:', formData);
    }
  };

  const toggleBookingForm = () => {
    if (!requireAuth()) {
      return; // Show signup modal instead
    }
    setShowBookingForm(!showBookingForm);
    if (showBookingForm) {
      setIsSubmitted(false);
      setFormData({
        email: "",
        caseInfo: "",
        availability: "",
        paymentMethod: "",
        acceptTerms: false
      });
    }
  };



  return (
    <div className="limpiar-karma-page">
      <main className="limpiar-karma-main">
        <section className="limpiar-karma-hero">
          <div className="limpiar-karma-hero-content">
            <h3 className="limpiar-karma-category">ASISTENCIA PERSONAL</h3>
            <h1 className="limpiar-karma-title">SESIÓN</h1>
            <h2 className="limpiar-karma-subtitle">LIMPIAR KARMA</h2>
          </div>
        </section>

        <section className="limpiar-karma-benefits">
          <div className="limpiar-karma-benefits-container">
            <h2 className="limpiar-karma-benefits-title">LIBERE LAS CARGAS DE SU ALMA</h2>
            <ul className="limpiar-karma-benefits-list">
              <li className="limpiar-karma-benefit-item">
                <img src="/img/check.png" alt="Check" className="benefit-icon" />
                <span className="benefit-text">Corte los lazos de la culpabilidad</span>
              </li>
              <li className="limpiar-karma-benefit-item">
                <img src="/img/check.png" alt="Check" className="benefit-icon" />
                <span className="benefit-text">Tenga una vida más consciente y plena</span>
              </li>
              <li className="limpiar-karma-benefit-item">
                <img src="/img/check.png" alt="Check" className="benefit-icon" />
                <span className="benefit-text">Asegure una buena reencarnación</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="limpiar-karma-image-section">
          <div className="limpiar-karma-image-container">
            <Image 
              src="/fotos/limpiar.jpg" 
              alt="Limpiar Karma" 
              className="limpiar-karma-image"
              width={1000}
              height={600}
            />
          </div>
        </section>

        <section className="limpiar-karma-info-section">
          <div className="limpiar-karma-info-container">
            
            <div className="limpiar-karma-info-content">
              <p className="limpiar-karma-info-paragraph">
              Sesiones personales en las que eliminamos todos los viejos conflictos arrastrados durante la existencia del alma. Permite mayor paz interior, mejores relaciones, claridad mental, menos obstáculos, y más sabiduría.
              </p>
              
              <p className="limpiar-karma-info-paragraph">

              Ayuda a romper los ciclos negativos, empoderar a uno mismo, y a disfrutar de las bendiciones de la vida. Además evita el peligro de la disolución del alma por caer en ciclos que no aportan nada al espíritu.
              </p>
              
              
            </div>
          </div>
        </section>

        <section className="limpiar-karma-following-section">
          <div className="limpiar-karma-following-container">
            
            <div className="limpiar-karma-following-content">
              <p className="limpiar-karma-following-paragraph">
              Trabajo imprescindible en el camino para la ascención espiritual.
              </p>
              
              <p className="limpiar-karma-following-paragraph">
              Horario ideal para usted.
              </p>
              
              <p className="limpiar-karma-following-paragraph">
              Siempre un futuro más positivo.
              </p>
            </div>
          </div>
        </section>


        <section className="limpiar-karma-video-section">
          <div className="limpiar-karma-video-container">
            <div className="video-player">
              <div className="play-button">
                <div className="play-icon"></div>
              </div>
            </div>
            <h3 className="video-title">Presentación de las sesiones Limpiar Karma</h3>
            <section className="limpiar-karma-button-section">
              <div className="limpiar-karma-button-container">
                <button 
                  className="limpiar-karma-action-button"
                  onClick={toggleBookingForm}
                >
                Reservar Sesion Limpiar Karma
                </button>
              </div>
            </section>
          </div>
        </section>

        {/* Booking Form Section */}
        {showBookingForm && (
          <section className="booking-form-section">
            <div className="booking-form-container">
              <div className="booking-form-header">
                <h3 className="booking-form-title">La tarifa por Bienestar Integral es:</h3>
                <div className="booking-form-price">75 $</div>
                <p className="booking-form-instruction">
                  LEA Y COMPLETE LOS SIGUIENTES CAMPOS PARA RESERVAR SU CONSULTA.
                </p>
              </div>

              {!isSubmitted ? (
                <form className="booking-form" onSubmit={handleSubmit}>
                  <div className="booking-form-section-group">
                    <ul className="booking-form-terms-list">
                      <li>Entiendo que mis datos serán usados y almacenados para realizar el servicio solicitado.</li>
                      <li>Una vez revisado su mensaje, le contestaremos con detalles sobre la disponibilidad y forma de pago.</li>
                    </ul>
                    <div className="booking-form-checkbox-group">
                      <input
                        type="checkbox"
                        id="acceptTerms"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleInputChange}
                        className="booking-form-checkbox"
                      />
                      <label htmlFor="acceptTerms" className="booking-form-checkbox-label">
                        Acepto estos términos
                      </label>
                    </div>
                  </div>

                  <div className="booking-form-section-group">
                    <label htmlFor="email" className="booking-form-label">
                      Email de contacto:
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="booking-form-input"
                      required
                    />
                  </div>

                  <div className="booking-form-section-group">
                    <h4 className="booking-form-section-title">COMPLETAR INFORMACIÓN</h4>
                    <p className="booking-form-instruction-text">
                      Escriba con detalle la razón de su consulta, lo que le afecta, y desde cuando le sucede. Si dispone de un diagnóstico médico, también es recomendable incluirlo.
                    </p>
                    <label htmlFor="caseInfo" className="booking-form-label">
                      Información de mi caso:
                    </label>
                    <textarea
                      id="caseInfo"
                      name="caseInfo"
                      value={formData.caseInfo}
                      onChange={handleInputChange}
                      className="booking-form-textarea"
                      rows={6}
                      required
                    />
                  </div>

                  <div className="booking-form-section-group">
                    <h4 className="booking-form-section-title">CALENDARIO Y PAGO</h4>
                    <p className="booking-form-instruction-text">
                      Escriba que días y horas tiene disponibles para realizar la sesión. Será necesario que disponga de silencio sin interrupciones. Escriba su forma preferida de pago.
                    </p>
                    <label htmlFor="availability" className="booking-form-label">
                      Disponibilidad:
                    </label>
                    <textarea
                      id="availability"
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      className="booking-form-textarea"
                      rows={4}
                      required
                    />
                    <label htmlFor="paymentMethod" className="booking-form-label">
                      Forma de pago:
                    </label>
                    <textarea
                      id="paymentMethod"
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      className="booking-form-textarea"
                      rows={4}
                      required
                    />
                  </div>

                  <button type="submit" className="booking-form-submit-button">
                    ENVIAR MI SOLICITUD
                  </button>
                </form>
              ) : (
                <div className="booking-form-success">
                  <p className="booking-form-success-message">
                    SU SOLICITUD HA SIDO ENVIADA. RECIBIRÁ UN MENSAJE CON LAS INSTRUCCIONES A SEGUIR.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <FooterSection />
      
      {/* Signup Modal */}
      <SignupModal
        isOpen={showSignupModal}
        onClose={closeSignupModal}
        title="Inicia sesión para reservar"
        message="Necesitas iniciar sesión para reservar una sesión de limpiar karma."
      />
    </div>
  );
}
