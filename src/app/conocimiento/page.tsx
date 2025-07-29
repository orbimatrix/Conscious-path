import React from "react";
import FooterSection from "../components/FooterSection";
import "./conocimiento.css";

export default function AudioVideoPage() {
  return (
    <div>
      <section className="audio-video-hero">
        <img 
          src="/girl.png" 
          alt="Girl" 
          className="hero-image"
        />
      </section>
      
      <section className="button-section">
        <div className="button-grid">
          <button className="filter-button">Todo</button>
          <button className="filter-button active">Público</button>
          <button className="filter-button">Inmortal</button>
          <button className="filter-button">Carisma</button>
          <button className="filter-button">Abundancia</button>
          <button className="filter-button">Karma</button>
        </div>
      </section>
      
      <FooterSection />
    </div>
  );
}
