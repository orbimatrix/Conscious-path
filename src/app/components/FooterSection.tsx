import React from "react";
import Image from "next/image";

export default function FooterSection() {
  return (
    <footer className="footer-section">
      <div className="footer-content">
        <h2 className="footer-title">Comparta el Conocimiento</h2>
        
        <div className="footer-social-icons">
          <div className="social-icon">
            <Image src="/facebook.png" alt="Facebook" width={20} height={20} />
          </div>
          <div className="social-icon">
            <Image src="/instagram.png" alt="Instagram" width={20} height={20} />
          </div>
          <div className="social-icon">
            <Image src="/twitter.png" alt="X (Twitter)" width={20} height={20} />
          </div>
          <div className="social-icon">
            <Image src="/telegram.png" alt="Telegram" width={20} height={20} />
          </div>
          <div className="social-icon">
            <Image src="/whatsapp.png" alt="WhatsApp" width={20} height={20} />
          </div>
        </div>

        <div className="footer-sections">
          <div className="footer-section-item">
            <h3 className="footer-section-title">AUDIOS Y VIDEOS</h3>
            <div className="footer-divider"></div>
          </div>

          <div className="footer-section-item">
            <h3 className="footer-section-title">NIVELES</h3>
            <div className="footer-divider"></div>
            <ul className="footer-links-list">
              <li><a href="#" className="footer-link">Carisma</a></li>
              <li><a href="#" className="footer-link">Karma</a></li>
              <li><a href="#" className="footer-link">Renacer Consciente</a></li>
              <li><a href="#" className="footer-link">Abundancia</a></li>
            </ul>
          </div>

          <div className="footer-section-item">
            <h3 className="footer-section-title">SERVICIOS</h3>
            <div className="footer-divider"></div>
            <ul className="footer-links-list">
              <li><a href="#" className="footer-link">Bienestar Integral</a></li>
              <li><a href="#" className="footer-link">Encuentro Privado</a></li>
              <li><a href="#" className="footer-link">Sesión Limpiar Karma</a></li>
              <li><a href="#" className="footer-link">Análisis Estructural</a></li>
            </ul>
          </div>

          <div className="footer-section-item">
            <h3 className="footer-section-title">Todos los contenidos</h3>
            <div className="footer-divider"></div>
          </div>

          <div className="footer-section-item">
            <h3 className="footer-section-title">Blog</h3>
            <div className="footer-divider"></div>
          </div>

          <div className="footer-section-item">
            <h3 className="footer-section-title">MI ESPACIO PERSONAL</h3>
            <div className="footer-divider"></div>
          </div>
        </div>

        <div className="footer-legal">
          <p>Privacidad</p>
          <p>Aviso legal</p>
          <p>Agradecimiento especial Icons8 y Pixabay</p>
          <p>© DIGITALMAPS OÜ</p>
        </div>
      </div>
    </footer>
  );
} 