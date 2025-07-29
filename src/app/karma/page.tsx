"use client"
import React from "react";
import Image from "next/image";
import FooterSection from "../components/FooterSection";
import "./karma.css";

export default function KarmaPage() {
  return (
    <div className="carisma-page">
      <main className="carisma-main">
        <section className="carisma-hero">
          <div className="carisma-hero-content">
            <h1 className="carisma-title">NIVEL</h1>
            <h2 className="carisma-subtitle">KARMA</h2>
          </div>
        </section>

        <section className="carisma-benefits">
          <div className="carisma-benefits-container">
            <ul className="carisma-benefits-list">
              <li className="carisma-benefit-item">
                <span className="benefit-icon">✓</span>
                <span className="benefit-text">El conocimiento más censurado</span>
              </li>
              <li className="carisma-benefit-item">
                <span className="benefit-icon">✓</span>
                <span className="benefit-text">Evite ser esclavo del mal</span>
              </li>
              <li className="carisma-benefit-item">
                <span className="benefit-icon">✓</span>
                <span className="benefit-text">Libere su siguiente vida</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="carisma-image-section">
          <div className="carisma-image-container">
            <Image 
              src="/fotos/karma.png" 
              alt="Carisma" 
              className="carisma-image"
              width={800}
              height={600}
            />
          </div>
        </section>

        <section className="carisma-info-section">
          <div className="carisma-info-container">
            <h2 className="carisma-info-title">ADIÓS A LOS DEMONIOS, TRANCENDE LA MUERTE


            </h2>
            
            <div className="carisma-info-content">
              <p className="carisma-info-paragraph">
              El nivel KARMA borra las limitaciones del mundo físico y del mal para avanzar en lo espiritual. Podrá identificar los múltiples obstáculos que le impiden ser libre en mente y espíritu.

</p>
              
              <p className="carisma-info-paragraph">
              Descubrirá las manipulaciones en su propia personalidad, y podrá superarlas. Conocerá acciones concretas para elevar su salud, energía y conciencia. Verá el mundo y la historia real. También conocerá la realidad de la reencarnación, y las posibilidades que ofrece.              </p>
              
              <p className="carisma-info-paragraph">
                El nivel KARMA incluye:
              </p>
            </div>
          </div>
        </section>

        <section className="carisma-action-section">
          <div className="carisma-action-container">
            <h2 className="carisma-action-title">Todo el material y directos de CARISMA,</h2>
            
            <div className="carisma-content-list">
              <div className="carisma-content-item">
                <p className="content-description">
                4: INFLUENCIAS Y POSESIONES habituales, manipulaciones químicas y energéticas, afecciones extrañas del bienestar, campos psíquicos, distorsiones de la realidad individual y colectiva.
                </p>
              </div>
              
              <div className="carisma-content-item">
                <p className="content-description">
                5: REENCARNACIÓN Y KARMA memoria más allá de la muerte, avance rápido en el camino de la ascensión, trascendencia, disolución del alma, gestión del Karma, fortaleza mental, valores espirituales y materiales.
                </p>
              </div>
            </div>
            
            <p className="carisma-live-info">
              Directos online KARMA, 10 al año.
            </p>
            
            <p className="karma-renacer-text">
              Pasado 1 año, posibilidad de acceso al nivel del RENACER CONSCIENTE.
            </p>
          </div>
        </section>

        
        
        <section className="carisma-video-section">
          <div className="carisma-video-container">
            <div className="video-player">
              <div className="play-button">
                <div className="play-icon"></div>
              </div>
            </div>
            <h3 className="video-title">Presentación del Nivel KARMA</h3>
            <section className="carisma-button-section">
          <div className="carisma-button-container">
            <button className="carisma-action-button">
              Acceder
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
