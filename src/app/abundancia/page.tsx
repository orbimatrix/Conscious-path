"use client"
import React from "react";
import Image from "next/image";
import FooterSection from "../components/FooterSection";
import "./abundancia.css";

export default function AbundanciaPage() {
  return (
    <div className="abundancia-page">
      <main className="abundancia-main">
        {/* Hero Section */}
        <section className="abundancia-hero">
          <div className="abundancia-hero-content">
            <h1 className="abundancia-title">NIVEL</h1>
            <h2 className="abundancia-subtitle">PROYECCIÓN DE LA ABUNDANCIA</h2>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="abundancia-benefits">
          <div className="abundancia-benefits-container">
            <ul className="abundancia-benefits-list">
              <li className="abundancia-benefit-item">
                <span className="benefit-icon">✓</span>
                <span className="benefit-text">Cambiar la suerte en positivo</span>
              </li>
              <li className="abundancia-benefit-item">
                <span className="benefit-icon">✓</span>
                <span className="benefit-text">Llegada de dinero y regalos</span>
              </li>
              <li className="abundancia-benefit-item">
                <span className="benefit-icon">✓</span>
                <span className="benefit-text">Adiós a la escased</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Image Section */}
        <section className="abundancia-image-section">
          <div className="abundancia-image-container">
            <Image
              src="/fotos/model.jpg"
              alt="Model in luxury setting"
              className="abundancia-image"
              width={800}
              height={600}
            />
          </div>
        </section>

        {/* Content Section */}
        <section className="abundancia-content">
          <div className="abundancia-content-container">
            <h2 className="abundancia-content-title">
              EL EGRÉGOR DEL BENEFICIO ECONÓMICO
            </h2>
            
            <div className="abundancia-content-text">
              <p className="abundancia-paragraph">
                El egrégor del beneficio económico BENEC es un grupo creado por mentes enfocadas en la abundancia y la mejora personal. Tiene una larga trayectoria y ha demostrado su efectividad en mejorar la economía de sus miembros.
              </p>
              
              <p className="abundancia-paragraph">
                Para acceder es necesario participar en el nivel CARISMA o KARMA, realizar visualizaciones específicas, tener objetivos claros, y realizar una contribución del 5% de los ingresos aumentados para los socios, quienes también deben mantener secretos.
              </p>
              
              <p className="abundancia-final-text">
                En el grupo de la abundacia BENEC:
              </p>
            </div>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
}
