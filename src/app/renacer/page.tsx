"use client"
import React from "react";
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
                <span className="benefit-icon">✓</span>
                <span className="benefit-text">Evitar ser ignorante otra vez</span>
              </li>
              <li className="renacer-benefit-item">
                <span className="benefit-icon">✓</span>
                <span className="benefit-text">Conservar su experiencia y frutos</span>
              </li>
              <li className="renacer-benefit-item">
                <span className="benefit-icon">✓</span>
                <span className="benefit-text">Vivir sin miedo a morir</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="renacer-image-section">
          <div className="renacer-image-container">
            <img
              src="/fotos/renacer.jpg"
              alt="Renacer Consciente"
              className="renacer-image"
            />
          </div>
        </section>

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
      </main>
      <FooterSection />
    </div>
  );
}
