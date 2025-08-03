"use client"
import React from "react";
import Image from "next/image";
import FooterSection from "../components/FooterSection";
import "./renacer.css";

export default function RenacerPage() {
  return (
    <div className="renacer-page">
      <main className="renacer-main">
        <section className="renacer-hero">
          <div className="renacer-hero-content">
            <h1 className="renacer-title">NIVEL</h1>
            <h2 className="renacer-subtitle">RENACER CONSCIENTE</h2>
          </div>
        </section>

        <section className="renacer-benefits">
          <div className="renacer-benefits-container">
              <ul className="renacer-benefits-list">
                <li className="renacer-benefit-item">
                  <img src="/img/check.png" alt="Check" className="benefit-icon" />
                  <span className="benefit-text">Evitar ser ignorante otra vez</span>
                </li>
                <li className="renacer-benefit-item">
                  <img src="/img/check.png" alt="Check" className="benefit-icon" />
                  <span className="benefit-text">Conservar la experiencia y frutos conseguidos en esta vida</span>
                </li>
                <li className="renacer-benefit-item">
                  <img src="/img/check.png" alt="Check" className="benefit-icon" />
                  <span className="benefit-text">Vivir sin miedo a morir</span>
                </li>
              </ul>
          </div>
        </section>

      </main>

      {/* Image Section - Outside main container for full width */}
      <section className="renacer-image-section">
        <div className="renacer-image-container">
          <Image
            src="/fotos/renacer.jpg"
            alt="Renacer Consciente"
            className="renacer-image"
            width={1600}
            height={1200}
            sizes="(max-width: 1920px) 100vw, 1200px"
          />
        </div>
      </section>

      <main className="renacer-main">
        <section className="renacer-info-section">
          <div className="renacer-info-container">
            <h2 className="renacer-info-title">CONSERVAR LA MEMORIA PARA LA SIGUIENTE VIDA</h2>
            <div className="renacer-info-content">
              <p className="renacer-info-paragraph">
                Se trata del procedimiento más secreto para lograr la preservación de la memoria actual para las siguientes vidas, después de la reencarnación. Se evita la pérdida de todos los aprendizajes y recuerdos valiosos, y se evita una siguiente vida en la ignorancia.
              </p>
              <p className="renacer-info-paragraph">
                Es una forma de evolucionar rápido y de superar las lecciones del espíritu. También ayuda a evitar la disolución del alma por el estancamiento en problemas irresolubles. Además ayuda a conservar recursos y recuerdos para mejorar la siguiente vida.
              </p>
            </div>
          </div>
        </section>

        <section className="renacer-banner-section">
          <div className="renacer-banner-container">
            <h2 className="renacer-banner-title">
              Se realizan un máximo de<br />
              3 procedimientos al año
            </h2>
          </div>
        </section>

        <section className="renacer-options-section">
          <div className="renacer-options-container">
            <p className="renacer-options-intro">
              El paso RENACER CONSCIENTE ofrece 2 opciones:
            </p>
            
            <div className="renacer-option-card">
              <h3 className="option-title">Asistentes al Nivel KARMA:</h3>
              <ul className="option-features">
                <li>Preparación completa para el proceso y los siguientes pasos despúes de la reencarnación.</li>
                <li>Evaluación y mejora de las fortalezas y de los conocimientos necesarios, durante el tiempo que sea necesario.</li>
                <li>Precio de referencia revisado cada año.</li>
                <li>Posibilidad de acceso gratuito.</li>
              </ul>
            </div>
            
            <div className="renacer-divider"></div>
            
            <div className="renacer-option-card">
              <h3 className="option-title">Acceso EXPRESS:</h3>
              <ul className="option-features">
                <li>Realización urgente del proceso, sin necesidad de preparación previa obligatoria.</li>
                <li>Mínimos requisitos necesarios.</li>
                <li>Precio personalizado.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="renacer-video-section">
          <div className="renacer-video-container">
            <div className="video-player">
              <div className="play-button">
                <div className="play-icon"></div>
              </div>
            </div>
            <h3 className="video-title">Presentación del Nivel Renacer Consciente</h3>
            <button className="video-cta-button">
              ACCEDER
            </button>
            <div className="secondary-buttons">
              <button className="secondary-button">Nivel Carisma</button>
              <button className="secondary-button">Nivel Karma</button>
            </div>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  );
}
