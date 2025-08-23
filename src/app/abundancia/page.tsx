"use client"
import React, { useState } from "react";
import Image from "next/image";
import FooterSection from "../components/FooterSection";
import "./abundancia.css";

export default function AbundanciaPage() {
  // Simulate user login status - in real app this would come from auth context
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleLoginStatus = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <div className="abundancia-page">
      {/* Hero Section - Outside main container for full width */}
      <section className="abundancia-hero">
        <div className="abundancia-hero-content">
          <h1 className="abundancia-title">NIVEL</h1>
          <h2 className="abundancia-subtitle">PROYECCIÓN DE LA ABUNDANCIA</h2>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="abundancia-benefits">
        <div className="abundancia-benefits-container">
          <div className="abundancia-benefits-wrapper">
            <ul className="abundancia-benefits-list">
              <li className="abundancia-benefit-item">
                <Image src="/img/check.png" alt="Check" className="benefit-icon" width={20} height={20} />
                <span className="benefit-text">Cambiar la suerte en positivo</span>
              </li>
              <li className="abundancia-benefit-item">
                <Image src="/img/check.png" alt="Check" className="benefit-icon" width={20} height={20} />
                <span className="benefit-text">Llegada de dinero y regalos</span>
              </li>
              <li className="abundancia-benefit-item">
                <Image src="/img/check.png" alt="Check" className="benefit-icon" width={20} height={20} />
                <span className="benefit-text">Adiós a la escased</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Image Section - Outside main container for full width */}
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

      {/* Benefits Block Section */}
      <section className="abundancia-benefits-block">
        <div className="benefits-block-container">
          <div className="benefits-block-content">
            <p className="benefit-item">Dispondrá de nuevas oportunidades y retos.</p>
            <p className="benefit-item">Las &quot;casualidades&quot; positivas serán habituales.</p>
            <p className="benefit-item">La economía siempre tenderá a mejorar.</p>
            <p className="benefit-item">Dispondrá de la evaluación personalizada para identificar y eliminar bloqueos mentales, familiares y transgeneracionales.</p>
          </div>
        </div>
      </section>

      {/* Video Presentation Section */}
      <section className="abundancia-video-section">
        <div className="video-section-container">
          <div className="video-player">
            <div className="play-button">
              <div className="play-icon"></div>
            </div>
          </div>
          <h3 className="video-title">Presentación del Grupo de Proyección</h3>
          
          {/* Conditional content based on login status */}
          {isLoggedIn ? (
            <div className="logged-in-content">
              <div className="logged-in-message">
                YA PARTICIPAS EN EL GRUPO DE<br />
                PROYECCIÓN DE LA ABUNDANCIA<br />
                &quot;BENEC&quot;
              </div>
              <button className="video-cta-button logged-in">
                ENTRAR EN BENEC
              </button>
            </div>
          ) : (
            <button className="video-cta-button">
              ENTRAR / REGISTRARSE
            </button>
          )}
          
          <div className="secondary-buttons">
            <button className="secondary-button">Volver a Carisma</button>
            <button className="secondary-button">Volver a Karma</button>
          </div>
          
          {/* Debug toggle button - remove in production */}
          <button 
            className="debug-toggle" 
            onClick={toggleLoginStatus}
            style={{ 
              marginTop: '20px', 
              padding: '8px 16px', 
              background: '#666', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              fontSize: '12px'
            }}
          >
            {isLoggedIn ? 'Logout' : 'Login'} (Debug)
          </button>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
