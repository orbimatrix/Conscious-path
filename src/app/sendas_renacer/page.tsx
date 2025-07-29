"use client"
import React, { useState } from "react";
import FooterSection from "../components/FooterSection";
import ContactSection from "../components/ContactSection";
import "./sendas_renacer.css";

export default function SendasRenacerPage() {
  const [showModal, setShowModal] = useState(false);
  const [showDirectModal, setShowDirectModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const openDirectModal = () => {
    setShowDirectModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const closeDirectModal = () => {
    setShowDirectModal(false);
  };

  return (
    <div className="sendas-renacer-page">
      <main className="sendas-renacer-main">
        

        {/* Main Title Section */}
        <section className="sendas-hero">
          <div className="sendas-hero-content">
            <h1 className="sendas-title">
              RENACER CONSCIENTE, <br />CONSERVE SUS <br />RECUERDOS Y BIENES
            </h1>
            <p className="sendas-description">
              Su alma ha decidido superar la muerte, y vivir de nuevo conservando sus experiencias, conocimientos, incluso sus riquezas. Podrá decir adiós a la ignorancia y al miedo. Esta es la senda más exclusiva del mundo.
            </p>
            <p className="sendas-requirements-intro">
              Conozca los requisitos para acceder:
            </p>
          </div>
        </section>

        {/* Requirements Comparison Section */}
        <section className="sendas-requirements">
          <div className="requirements-container">
            {/* Left Column - Karma Level */}
            <div className="requirement-column">
              <h2 className="requirement-title">POR EL NIVEL<br />KARMA</h2>
              <div className="requirement-box">
                <h3 className="requirement-subtitle">REQUISITOS AMPLIOS</h3>
                <ul className="requirement-list">
                  <li>Encuentro privado</li>
                  <li>1 Año de estudio</li>
                  <li>Examen personalidad</li>
                  <li>Leyes Karma</li>
                  <li>Orientación Básica</li>
                  <li>Análisis Estructural</li>
                  <li>Precio de referencia</li>
                </ul>
              </div>
            </div>

            {/* Right Column - Direct Access */}
            <div className="requirement-column">
              <h2 className="requirement-title">ACCESO<br />DIRECTO</h2>
              <div className="requirement-box">
                <h3 className="requirement-subtitle">REQUISITOS MÍNIMOS</h3>
                <ul className="requirement-list">
                  <li>Encuentro privado</li>
                  <li>INMEDIATO</li>
                  <li className="requirement-x">X </li>
                  <li className="requirement-x">X </li>
                  <li className="requirement-x">X </li>
                  <li className="requirement-x">X </li>
                  <li>Precio personalizado</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Call-to-Action Buttons */}
        <section className="sendas-cta-buttons">
          <div className="cta-buttons-container">
            <button className="cta-button karma-button" onClick={openModal}>
              Acceder por NIVEL KARMA
            </button>
            <button className="cta-button direct-button" onClick={openDirectModal}>
              Acceder de forma DIRECTA
            </button>
          </div>
        </section>

        {/* Free Access Information */}
        <section className="sendas-free-access">
          <div className="free-access-container">
            <h2 className="free-access-title">
              ACCESO GRATUITO EN EL NIVEL KARMA
            </h2>
            <div className="free-access-content">
              <p className="free-access-paragraph">
                De forma excepcional, se podrá seleccionar a una persona del nivel KARMA para acceder al nivel DESPERTAR CONSCIENTE de forma gratuita, con excepción de los gastos de desplazamiento y alojamiento.
              </p>
              <p className="free-access-paragraph">
                Será como máximo 1 persona al año, entre las personas que muestren más interés, constancia, participación, y puntuación.
              </p>
              <p className="free-access-paragraph">
                Esta posibilidad se decidirá a discreción, y puede quedar vacante, sin derecho a reclamación.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom CTA Button */}
        <section className="sendas-bottom-cta">
          <div className="bottom-cta-container">
            <button className="bottom-cta-button">
              Entrar en el NIVEL KARMA
            </button>
          </div>
        </section>
      </main>

      {/* Renacer Consciente Modal */}
      {showModal && (
        <div className="renacer-modal-overlay" onClick={closeModal}>
          <div className="renacer-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            
            {/* Top Section - Light Gray */}
            <div className="modal-top-section">
              <h2 className="modal-title">La tarifa de referencia para el año 2025 es:</h2>
              <div className="modal-price">180,000$</div>
              <p className="modal-instruction">Envíe un mensaje si desea:</p>
              <ul className="modal-options">
                <li><strong>A)</strong> Iniciar el proceso &quot;Renacer Consciente&quot;.</li>
                <li><strong>B)</strong> Consultar si cumple con los requisitos.</li>
                <li><strong>C)</strong> Conocer las formas de pago.</li>
                <li><strong>D)</strong> Preguntar sobre la disponibilidad de plazas</li>
              </ul>
              <div className="modal-separator"></div>
              <p className="contact-instruction">Escriba su email y mensaje:</p>
            </div>

            {/* Bottom Section - Brownish Background */}
            <div className="modal-bottom-section">
              <ContactSection />
            </div>
          </div>
        </div>
      )}

      {/* Direct Access Modal */}
      {showDirectModal && (
        <div className="renacer-modal-overlay" onClick={closeDirectModal}>
          <div className="renacer-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeDirectModal}>×</button>
            
            {/* Top Section - Light Gray */}
            <div className="modal-top-section">
              <h2 className="modal-title">La tarifa para el nivel RENACER CONSCIENTE es calculado para cada aspirante de forma independiente.</h2>
              <p className="modal-note">Seré necesario realizar un depósito no reembolsable para iniciar el proceso.</p>
              <p className="modal-instruction">Envíe un mensaje si desea:</p>
              <ul className="modal-options">
                <li><strong>A)</strong> Iniciar el proceso &quot;Renacer Consciente&quot;.</li>
                <li><strong>B)</strong> Consultar si cumple con los requisitos.</li>
                <li><strong>C)</strong> Conocer las formas de pago.</li>
                <li><strong>D)</strong> Preguntar sobre la disponibilidad de plazas</li>
                <li><strong>E)</strong> Realizar el depósito para iniciar el paso.</li>
                <li><strong>F)</strong> Realizar otras consultas.</li>
              </ul>
              <div className="modal-separator"></div>
              <p className="contact-instruction">Escriba su email y mensaje:</p>
            </div>

            {/* Bottom Section - Brownish Background */}
            <div className="modal-bottom-section">
              <ContactSection />
            </div>
          </div>
        </div>
      )}

      <FooterSection />
    </div>
  );
}
