import React from "react";

export default function ContactSection() {
  return (
    <section className="contact-us-section">
      <div className="contact-form">
        <div className="contact-field">
          <label className="contact-label">Email:</label>
          <input 
            type="email" 
            placeholder="invitado@email.com" 
            className="contact-input"
          />
        </div>
        <div className="contact-field">
          <label className="contact-label">Nombre:</label>
          <input 
            type="text" 
            placeholder="" 
            className="contact-input"
          />
        </div>
        <div className="contact-field">
          <label className="contact-label">Mensaje:</label>
          <textarea 
            placeholder="Hola, quisiera..." 
            className="contact-textarea"
          />
        </div>
        <button className="contact-submit-btn">Enviar</button>
      </div>
    </section>
  );
} 