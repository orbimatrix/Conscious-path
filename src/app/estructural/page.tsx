"use client"
import React from "react";
import Image from "next/image";
import FooterSection from "../components/FooterSection";
import "./es_karma.css";

export default function EstructuralPage() {
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
                <span className="benefit-icon">✓</span>
                <span className="benefit-text">Aproveche bien su energía y tiempo
                </span>
              </li>
              <li className="estructural-benefit-item">
                <span className="benefit-icon">✓</span>
                <span className="benefit-text">Evite frustaciones vitales y profesionales
                </span>
              </li>
              <li className="estructural-benefit-item">
                <span className="benefit-icon">✓</span>
                <span className="benefit-text">Tenga amistades adecuadas</span>
              </li>
            </ul>
          </div>
        </section>

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
                <button className="estructural-action-button">
                RESERVAR
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
