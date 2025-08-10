"use client"
import React, { useState } from "react";
import Image from "next/image";
import FooterSection from "../components/FooterSection";
import AnimatedButton from "../components/AnimatedButton";
import SignupModal from "../components/SignupModal";
import { useAuth } from "../../lib/auth";
import "./es_karma.css";

export default function EstructuralPage() {
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
    <div className="estructural-page">
      <main className="estructural-main">
        <section className="estructural-hero">
          <div className="estructural-hero-content">
            <h1 className="estructural-title">ASISTENCIA PERSONAL</h1>
            <h2 className="estructural-subtitle">ANÁLISIS ESTRUCTURAL ESENCIAL</h2>
          </div>
        </section>

        <section className="estructural-benefits">
          <div className="estructural-benefits-container">
            <h2 className="estructural-benefits-title">DESCUBRA SUS CAPACIDADES REALES</h2>
            <ul className="estructural-benefits-list">
              <li className="estructural-benefit-item">
                <img src="/img/check.png" alt="Check" className="benefit-icon" />
                <span className="benefit-text">Aproveche bien su energía y tiempo
                </span>
              </li>
              <li className="estructural-benefit-item">
                <img src="/img/check.png" alt="Check" className="benefit-icon" />
                <span className="benefit-text">Evite frustaciones vitales y profesionales
                </span>
              </li>
              <li className="estructural-benefit-item">
                <img src="/img/check.png" alt="Check" className="benefit-icon" />
                <span className="benefit-text">Tenga amistades adecuadas</span>
              </li>
            </ul>
          </div>
        </section>

      </main>

      {/* Image Section - Outside main container for full width */}
      <section className="estructural-image-section">
        <div className="estructural-image-container">
          <Image 
            src="/fotos/white.jpg" 
            alt="Limpiar Karma" 
            className="estructural-image"
            width={1000}
            height={600}
          />
        </div>
      </section>

      <main className="estructural-main">
        <section className="estructural-info-section">
          <div className="estructural-info-container">
            
            <div className="estructural-info-content">
              <p className="estructural-info-paragraph">
              Conozca lo que su programación esencial le permite hacer, de forma diferentes a las demás personas. Descubra sus capacidades y carencias.

              </p>
              <p className="estructural-info-paragraph">
              Sepa dónde enfocar sus energías.


              </p>
              
              <p className="estructural-info-paragraph">
              Estudiamos decenas de aspectos de su vida, ayudando a aprovechar su tiempo, enfocándose en los caminos para los que tiene habilidades naturales.

              </p>
              
              
            </div>
          </div>
        </section>

        <section className="estructural-following-section">
          <div className="estructural-following-container">
            
            <div className="estructural-following-content">
              <p className="estructural-following-paragraph">
              Ideal para decidir la profesión o estudios.

              </p>
              
              <p className="estructural-following-paragraph">
              Evitará pérdidas de tiempo y esfuerzo.

              </p>
              
              <p className="estructural-following-paragraph">
              Recibirá orientación del sentido de su vida.
              </p>
            </div>
          </div>
        </section>


        <section className="estructural-video-section">
          <div className="estructural-video-container">
            <div className="video-player">
              <div className="play-button">
                <div className="play-icon"></div>
              </div>
            </div>
            <h3 className="video-title">Presentación del Análisis Estructural</h3>
            <section className="estructural-button-section">
              <div className="estructural-button-container">
                <AnimatedButton
                  className="estructural-action-button"
                  onClick={toggleBookingForm}
                >
                  RESERVAR
                </AnimatedButton>
              </div>
            </section>
          </div>
        </section>

        {/* Booking Form Section */}
        {showBookingForm && (
          <section className="booking-form-section">
            <div className="booking-form-container">
              <div className="booking-form-header">
                <h3 className="booking-form-title">El precio del Análisis Estructural Esencial es:</h3>
                <div className="booking-form-price">130 $</div>
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
        message="Necesitas iniciar sesión para reservar un análisis estructural."
      />
    </div>
  );
}
