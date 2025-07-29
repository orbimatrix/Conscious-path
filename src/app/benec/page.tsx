"use client"
import React from "react";
import FooterSection from "../components/FooterSection";
import "./benec.css";

export default function BenecPage() {
  return (
    <div className="benec-page">
      {/* Dark Banner Section */}
      <section className="benec-banner">
        <div className="benec-banner-content">
          <h1 className="benec-banner-subtitle">HERRAMIENTA AVANZADA</h1>
          <h2 className="benec-banner-title">EGRÉGOR BENEC:</h2>
          <h3 className="benec-banner-main-title">BENEFICIO ECONÓMICO</h3>
        </div>
      </section>

     

      <FooterSection />
    </div>
  );
}
