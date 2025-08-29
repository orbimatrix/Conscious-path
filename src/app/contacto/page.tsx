"use client"
import React, { useState } from "react";
import FooterSection from "../components/FooterSection";
import "./contacto.css";
import ContactFormSection from "../components/ContactFormSection";
import ContactSection from "../components/ContactSection";

export default function ContactoPage() {
  return (
    <div className="contacto-page">
      
      {/* Contact Banner Section */}
      <section className="contacto-banner">
        <div className="contacto-banner-content">
          <h1 className="contacto-banner-title">Contacte con nosotros</h1>
        </div>
      </section>

      {/* Contact Content Section */}
      <section className="contacto-content">
        <div className="contacto-content-container">
          <p className="contacto-intro-text">
            Estamos encantados de recibir sus mensajes y ayudarle en todo lo posible.
          </p>
          
          {/* Telegram Contact Section */}
          <div className="contacto-telegram-section">
            <p className="contacto-telegram-text">
              Puede escribirnos de forma rápida a través de Telegram:
            </p>
            <div className="contacto-telegram-icon">
              <img 
                src="/telegram.png" 
                alt="Telegram" 
                className="telegram-icon"
                width={80}
                height={80}
              />
            </div>
          </div>
          
          {/* Email Contact Section */}
          <div className="contacto-email-section">
            <p className="contacto-email-text">
              También puede enviarnos un email:
            </p>
            <p className="contacto-email-instruction">
              <span className="desktop-text">Si necesita asistencia, escriba su email y mensaje:</span>
              <span className="mobile-text">Escriba su email y mensaje:</span>
            </p>
            
            {/* Contact Form Component */}
            <ContactSection />
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
