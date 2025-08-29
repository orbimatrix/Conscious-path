import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function FooterSection() {
  return (
    <footer className="footer-section">
      <div className="footer-content">
        {/* Top Section - Title and Social Media */}
        <div className="footer-top">
          <h2 className="footer-title">Comparta el Conocimiento</h2>
          <div className="footer-social-icons">
            <div className="social-icon">
              <Image src="/facebook.png" alt="Facebook" width={40} height={20} />
            </div>
            <div className="social-icon">
              <Image src="/instagram.png" alt="Instagram" width={40} height={20} />
            </div>
            <div className="social-icon">
              <Image src="/twitter.png" alt="X (Twitter)" width={40} height={20} />
            </div>
            <div className="social-icon">
              <Image src="/telegram.png" alt="Telegram" width={40} height={20} />
            </div>
            <div className="social-icon">
              <Image src="/whatsapp.png" alt="WhatsApp" width={40} height={20} />
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Navigation Sections */}
          <div className="footer-navigation">
            <div className="footer-nav-section">
              <a href="/conocimiento" className="footer-section-title-link">
                <h3 className="footer-section-title">AUDIOS Y VIDEOS</h3>
                <div className="footer-divider"></div>
              </a>
            </div>

            <div className="footer-nav-section">
              <h3 className="footer-section-title">NIVELES</h3>
              <div className="footer-divider"></div>
              <ul className="footer-links-list">
                <li><a href="/carisma" className="footer-link">Carisma</a></li>
                <li><a href="/karma" className="footer-link">Karma</a></li>
                <li><a href="/renacer" className="footer-link">Renacer Consciente</a></li>
                <li><a href="/abundancia" className="footer-link">Abundancia</a></li>
              </ul>
            </div>

            <div className="footer-nav-section">
              <h3 className="footer-section-title">SERVICIOS</h3>
              <div className="footer-divider"></div>
              <ul className="footer-links-list">
                <li><a href="/bienestar" className="footer-link">Bienestar Integral</a></li>
                <li><a href="/privado" className="footer-link">Encuentro Privado</a></li>
                <li><a href="/limpiar_karma" className="footer-link">Sesión Limpiar Karma</a></li>
                <li><a href="/estructural" className="footer-link">Análisis Estructural</a></li>
              </ul>
            </div>

            <div className="footer-nav-section">
              <a href="/contenidos" className="footer-section-title-link">
                <h3 className="footer-section-title">Todos los contenidos</h3>
                <div className="footer-divider"></div>
              </a>
            </div>

            <div className="footer-nav-section">
              <Link href="/blogs" className="footer-section-title-link">
                <h3 className="footer-section-title">Blog</h3>
                <div className="footer-divider"></div>
              </Link>
            </div>

            <div className="footer-nav-section">
              <Link href="/usuario" className="footer-section-title-link">
                <h3 className="footer-section-title">MI ESPACIO PERSONAL</h3>
                <div className="footer-divider"></div>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Right - Legal Information */}
        <div className="footer-legal">
          <Link href="/privacidad" className="footer-legal-link">
            <p>Privacidad</p>
          </Link>
          <Link href="/aviso_legal" className="footer-legal-link">
            <p>Aviso legal</p>
          </Link>
          <p>Agradecimiento especial Icons8 y Pixabay</p>
          <p>© DIGITALMAPS OÜ</p>
        </div>
      </div>
    </footer>
  );
} 