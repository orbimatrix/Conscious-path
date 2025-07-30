"use client"
import React from "react";
import Image from "next/image";
import FooterSection from "../components/FooterSection";
import "./limpiar_karma.css";

export default function LimpiarKarmaPage() {
  return (
    <div className="limpiar-karma-page">
      <main className="limpiar-karma-main">
        <section className="limpiar-karma-hero">
          <div className="limpiar-karma-hero-content">
            <h1 className="limpiar-karma-title">SESIÓN</h1>
            <h2 className="limpiar-karma-subtitle">LIMPIAR KARMA</h2>
          </div>
        </section>

        <section className="limpiar-karma-benefits">
          <div className="limpiar-karma-benefits-container">
            <ul className="limpiar-karma-benefits-list">
              <li className="limpiar-karma-benefit-item">
                <span className="benefit-icon">✓</span>
                <span className="benefit-text">Corte los lazos de la culpabilidad</span>
              </li>
              <li className="limpiar-karma-benefit-item">
                <span className="benefit-icon">✓</span>
                <span className="benefit-text">Tenga una vida más consciente y plena</span>
              </li>
              <li className="limpiar-karma-benefit-item">
                <span className="benefit-icon">✓</span>
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
                <button className="limpiar-karma-action-button">
                Reservar Sesion Limpiar Karma
                </button>
              </div>
            </section>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
}
