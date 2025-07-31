"use client"
import React, { useState } from "react";
import Image from "next/image";
import FooterSection from "../components/FooterSection";
import "./bienestar.css";

export default function BienestarPage() {
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
      console.log('Form submitted:', formData);
    }
  };

  const toggleBookingForm = () => {
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
    <div className="bienestar-page">
      {/* Header Banner - Outside main container for full width */}
      <section className="bienestar-hero">
        <div className="bienestar-hero-content">
          <h1 className="bienestar-title">ASISTENCIA PERSONAL</h1>
          <h2 className="bienestar-subtitle">SESIÓN DE BIENESTAR INTEGRAL</h2>
        </div>
      </section>
      
      <main className="bienestar-main">
        {/* Main Content Section */}
        <section className="bienestar-content">
          <div className="bienestar-content-container">
            <h2 className="bienestar-content-title">
              RESOLVER LOS PROBLEMAS DEL CUERPO-ALMA
            </h2>
            
            {/* Benefits List */}
            <section className="bienestar-benefits">
              <div className="bienestar-benefits-container">
                <ul className="bienestar-benefits-list">
                  <li className="bienestar-benefit-item">
                    <span className="benefit-icon">✓</span>
                    <span className="benefit-text">Eficaz solución a problemas repetitivos</span>
                  </li>
                  <li className="bienestar-benefit-item">
                    <span className="benefit-icon">✓</span>
                    <span className="benefit-text">Experiencia y métodos probados</span>
                  </li>
                  <li className="bienestar-benefit-item">
                    <span className="benefit-icon">✓</span>
                    <span className="benefit-text">Mucho más que una charla</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Image Section */}
            <section className="bienestar-image-section">
              <div className="bienestar-image-container">
                <Image
                  src="/fotos/karma.jpg"
                  alt="Two women in silhouette against sunset"
                  className="bienestar-image"
                  width={800}
                  height={600}
                />
              </div>
            </section>

            {/* Introduction Paragraph */}
            <section className="bienestar-intro">
              <div className="bienestar-intro-container">
                <p className="bienestar-intro-text">
                  Completa consulta personal, organizada para ahorrar tiempo y asegurar los resultados. Nos enfocamos en resolver conflictos recurrentes y sus manifestaciones físicas. Se puede realizar en presencial y online.
                </p>
              </div>
            </section>

            {/* 4-Step Process */}
            <section className="bienestar-process">
              <div className="bienestar-process-container">
                <h3 className="process-title">Consista de 4 pasos:</h3>
                <ol className="process-steps">
                  <li className="process-step">
                    1) Recopilar la información necesaria, con una guía precisa. Le indicamos los puntos a completar, y si lo necesita le ayudamos personalmente.
                  </li>
                  <li className="process-step">
                    2) Sin presencia del cliente, estudiamos toda la información, e investigamos los eventos y significados. Con este paso garantizamos conocer todos los aspectos que le pueden afectar, al tiempo que ahorramos mucho tiempo para el consultante.
                  </li>
                  <li className="process-step">
                    3) La sesión presencial u online, de duración de 1 a 2 horas. Ya con el estudio completo preparado, conseguimos los objetivos fijados, de forma rápida y efectiva.
                  </li>
                  <li className="process-step">
                    4) Llamada posterior para verificar la eficacia de la sesión y sus resultados. Si fuera necesario, se realiza una sesión adicional, para asegurar el resultado.
                  </li>
                </ol>
              </div>
            </section>
          </div>
        </section>
      </main>

      {/* Additional Benefits Section - Outside main for full width */}
      <section className="bienestar-additional-benefits">
        <div className="bienestar-additional-benefits-container">
          <ul className="additional-benefits-list">
            <li className="additional-benefit-item">
              Aseguramos un servicio de máxima eficacia, mejor que simples sesiones improvisadas.
            </li>
            <li className="additional-benefit-item">
              Ahorramos tiempo y esfuerzo al consultante.
            </li>
            <li className="additional-benefit-item">
              Es habitual que se resuelvan varios problemas al mismo tiempo.
            </li>
            <li className="additional-benefit-item">
              Se le guiará paso a paso en todo el proceso.
            </li>
          </ul>
        </div>
      </section>

      {/* Video Presentation Section - Outside main for full width */}
      <section className="bienestar-video-section">
        <div className="bienestar-video-container">
          <div className="video-player">
            <div className="play-button">
              <div className="play-icon"></div>
            </div>
          </div>
          <h3 className="video-title">
          Presentación de la sesión de bienestar integral
          </h3>
          <button 
            className="booking-button"
            onClick={toggleBookingForm}
          >
            Reservar sesión de Bienestar Integral
          </button>
        </div>
      </section>

      {/* Booking Form Section */}
      {showBookingForm && (
        <section className="booking-form-section">
          <div className="booking-form-container">
            <div className="booking-form-header">
              <h3 className="booking-form-title">La tarifa por Bienestar integral es:</h3>
              <div className="booking-form-price">250 $</div>
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

      <FooterSection />
    </div>
  );
}
