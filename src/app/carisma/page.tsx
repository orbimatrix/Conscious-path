"use client"
import React from "react";
import FooterSection from "../components/FooterSection";
import "./carisma.css";

export default function CarismaPage() {
  return (
    <div className="carisma-page">
      <main className="carisma-main">
        <section className="carisma-hero">
          <div className="carisma-hero-content">
            <h1 className="carisma-title">NIVEL</h1>
            <h2 className="carisma-subtitle">CARISMA</h2>
          </div>
        </section>

        <section className="carisma-benefits">
          <div className="carisma-benefits-container">
            <ul className="carisma-benefits-list">
              <li className="carisma-benefit-item">
                <span className="benefit-icon">✓</span>
                <span className="benefit-text">Siempre bien informado</span>
              </li>
              <li className="carisma-benefit-item">
                <span className="benefit-icon">✓</span>
                <span className="benefit-text">Viva de forma abundante</span>
              </li>
              <li className="carisma-benefit-item">
                <span className="benefit-icon">✓</span>
                <span className="benefit-text">Bienestar y energía vital</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="carisma-image-section">
          <div className="carisma-image-container">
            <img 
              src="/fotos/carisma.jpg" 
              alt="Carisma" 
              className="carisma-image"
            />
          </div>
        </section>

        <section className="carisma-info-section">
          <div className="carisma-info-container">
            <h2 className="carisma-info-title">INFORMACIÓN, ABUNDANCIA Y SALUD</h2>
            
            <div className="carisma-info-content">
              <p className="carisma-info-paragraph">
                El nivel CARISMA ofrece acceso a toda la información necesaria para conseguir un sólido avance en la vida. Logrará la capacidad de analizar y valorar aspectos que otras personas no pueden ni imaginar.
              </p>
              
              <p className="carisma-info-paragraph">
                Analizamos cuestiones que muchas veces están censuradas en la vida pública, desde puntos de vista reales y prácticos. Y comprenderá la distribución real de poder en nuestro entorno.
              </p>
              
              <p className="carisma-info-paragraph">
                El nivel CARISMA incluye:
              </p>
            </div>
          </div>
        </section>

        <section className="carisma-action-section">
          <div className="carisma-action-container">
            <h2 className="carisma-action-title">Audios y Vídeos privados de:</h2>
            
            <div className="carisma-content-list">
              <div className="carisma-content-item">
                <h3 className="content-number">1: ACTUALIDAD</h3>
                <p className="content-description">
                  geopolítica, ciencia oficial y oculta, noticias, bulos y manipulaciones, estudios varios.
                </p>
              </div>
              
              <div className="carisma-content-item">
                <h3 className="content-number">2: ABUNDANCIA</h3>
                <p className="content-description">
                  formas de lograrla y conservarla, metafísica aplicada, mentalidad abundante, tendencias y previsiones, ejemplos.
                </p>
              </div>
              
              <div className="carisma-content-item">
                <h3 className="content-number">3: BIENESTAR</h3>
                <p className="content-description">
                  físico y emocional, señales de la vida, conflictos y malestares, recurrencia, problemas heredados, conocimientos antiguos y alternativos.
                </p>
              </div>
            </div>
            
            <p className="carisma-live-info">
              Directos online mensuales, 10 al año.
            </p>
          </div>
        </section>
        
        <section className="carisma-button-section">
          <div className="carisma-button-container">
            <button className="carisma-action-button">
              Acceder
            </button>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
}
