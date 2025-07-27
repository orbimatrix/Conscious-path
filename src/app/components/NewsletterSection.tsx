import React from "react";

export default function NewsletterSection() {
  return (
    <section className="newsletter-section">
      <div className="newsletter-block">
        <h3 className="newsletter-title">Reciba en su email todas las novedades.</h3>
        <div className="newsletter-form">
          <input 
            type="email" 
            placeholder="Su Email" 
            className="newsletter-input"
          />
          <button className="newsletter-btn">Enviar</button>
        </div>
      </div>
      <div className="contact-section">
        <p className="contact-text">¿Tiene preguntas? Le respondemos</p>
        <button className="telegram-btn">Telegram</button>
      </div>
    </section>
  );
} 