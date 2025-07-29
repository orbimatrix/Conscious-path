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
      </main>

      <FooterSection />
    </div>
  );
}
