"use client"
import React from "react";
import Image from "next/image";
import FooterSection from "../components/FooterSection";
import "./bienestar.css";

export default function BienestarPage() {
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
                    <strong>1.</strong> Recopilar la información necesaria, con una guía precisa. Le indicamos los puntos a completar, y si lo necesita le ayudamos personalmente.
                  </li>
                  <li className="process-step">
                    <strong>2.</strong> Sin presencia del cliente, estudiamos toda la información, e investigamos los eventos y significados. Con este paso garantizamos conocer todos los aspectos que le pueden afectar, al tiempo que ahorramos mucho tiempo para el consultante.
                  </li>
                  <li className="process-step">
                    <strong>3.</strong> La sesión presencial u online, de duración de 1 a 2 horas. Ya con el estudio completo preparado, conseguimos los objetivos fijados, de forma rápida y efectiva.
                  </li>
                  <li className="process-step">
                    <strong>4.</strong> Llamada posterior para verificar la eficacia de la sesión y sus resultados. Si fuera necesario, se realiza una sesión adicional, para asegurar el resultado.
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
          <button className="booking-button">
            Reservar sesión de Bienestar Integral
          </button>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
