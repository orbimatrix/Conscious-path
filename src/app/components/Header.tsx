"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// Custom hook to detect media query
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);
  return matches;
}

export default function Header() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = () => {
    if (isDropdownOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsDropdownOpen(false);
        setIsClosing(false);
      }, 400); // Match the animation duration
    } else {
      setIsDropdownOpen(true);
    }
  };

  const closeDropdown = () => {
    console.log('Close button clicked'); // Debug log
    setIsClosing(true);
    setTimeout(() => {
      setIsDropdownOpen(false);
      setIsClosing(false);
    }, 400); // Match the animation duration
  };

  const handleDropdownMouseEnter = (dropdownName: string) => {
    setActiveDropdown(dropdownName);
  };

  const handleDropdownMouseLeave = () => {
    setActiveDropdown(null);
  };

  if (isMobile) {
    // Mobile header (current)
    return (
      <>
        <div style={{ 
          paddingTop: 'env(safe-area-inset-top)', 
          marginTop: 'env(safe-area-inset-top)',
          position: 'relative',
          top: 'env(safe-area-inset-top)'
        }}>
          <header className="header-root">
            <div className="header-icon" onClick={toggleDropdown}>
              <Image src="/img/menu/menu200.svg" alt="Menu" width={32} height={32} />
            </div>
            <div className="header-center">
              <Image src="/dollar.png" alt="Logo" width={22} height={22} />
              <span style={{ fontWeight: 400, fontSize: 28, letterSpacing: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <span style={{ color: "#E6A14A", fontWeight: 300 }}>SENDA</span>
                <span style={{ color: "#5A5353", fontWeight: 300 }}> CONSCIENTE</span>
              </span>
            </div>
            <div className="header-icon">
              <Image src="/profile.svg" alt="User" width={32} height={32} />
            </div>
          </header>
        </div>

        {isDropdownOpen && (
          <div className={`mobile-dropdown-overlay ${isClosing ? 'mobile-dropdown-overlay-closing' : ''}`} onClick={closeDropdown}>
            <div className={`mobile-dropdown ${isClosing ? 'mobile-dropdown-closing' : ''}`} onClick={(e) => e.stopPropagation()}>
              <button className="mobile-dropdown-close-btn" onClick={closeDropdown}>
                ✕
              </button>
              
              <div className="mobile-dropdown-section">
                <Link href="/conocimiento" className="mobile-dropdown-section-title" style={{ textDecoration: 'none', color: 'inherit' }}>
                  AUDIOS y VIDEOS
                </Link>
              </div>

              <div className="mobile-dropdown-section">
                <div className="mobile-dropdown-section-title">NIVELES</div>
                <a href="/carisma" className="mobile-dropdown-menu-item">Carisma</a>
                <a href="/karma" className="mobile-dropdown-menu-item">Karma</a>
                <a href="/renacer" className="mobile-dropdown-menu-item">Renacer Consciente</a>
                <a href="/abundancia" className="mobile-dropdown-menu-item">Abundancia</a>
              </div>

              <div className="mobile-dropdown-section">
                <div className="mobile-dropdown-section-title">SERVICIOS</div>
                <a href="/bienestar" className="mobile-dropdown-menu-item">Bienestar Integral</a>
                <a href="/privado" className="mobile-dropdown-menu-item">Encuentro Privado</a>
                <a href="/limpiar_karma" className="mobile-dropdown-menu-item">Sesión Limpiar Karma</a>
                <a href="/estructural" className="mobile-dropdown-menu-item">Análisis Estructural</a>
                <a href="/regresion" className="mobile-dropdown-menu-item">Regresión Origen</a>
              </div>

              <div className="mobile-dropdown-section">
                <a href="/contenidos" className="mobile-dropdown-menu-item">Todos los contenidos</a>
              </div>

              <div className="mobile-dropdown-section">
                <Link href="/blogs" className="mobile-dropdown-menu-item">Blog</Link>
              </div>

              <div className="mobile-dropdown-section">
                <div className="mobile-dropdown-section-title">MI ESPACIO PERSONAL</div>
                <button className="mobile-dropdown-night-mode-btn">
                  <span>🌙</span>
                  modo noche
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

    // Desktop header
  return (
    <header className="desktop-header">
      <div className="desktop-header-top">
        <div className="desktop-header-brand">
          <Image src="/dollar.png" alt="Logo" width={40} height={40} className="desktop-header-logo" />
          <span className="desktop-header-text desktop-header-text-senda">SENDA</span>
          <span className="desktop-header-text desktop-header-text-consciente"> CONSCIENTE</span>
        </div>
        <button className="desktop-header-button">Entrar</button>
      </div>
      <div className="desktop-header-divider" />
      <nav className="desktop-nav">
        <a href="/conocimiento" className="desktop-nav-link">Audios y Videos</a>
        
        <div 
          className="desktop-dropdown-container" 
          data-dropdown
          onMouseEnter={() => handleDropdownMouseEnter('niveles')}
          onMouseLeave={handleDropdownMouseLeave}
        >
          <button className="desktop-dropdown-button">
            Niveles
          </button>
          {activeDropdown === 'niveles' && (
            <div className="desktop-dropdown-menu desktop-dropdown-menu-niveles">
              <a href="/carisma" className="desktop-dropdown-item">Carisma</a>
              <a href="/karma" className="desktop-dropdown-item">Karma</a>
              <a href="/renacer" className="desktop-dropdown-item">Renacer Consciente</a>
              <a href="/abundancia" className="desktop-dropdown-item">Abundancia</a>
            </div>
          )}
        </div>
        
        <div 
          className="desktop-dropdown-container" 
          data-dropdown
          onMouseEnter={() => handleDropdownMouseEnter('servicios')}
          onMouseLeave={handleDropdownMouseLeave}
        >
          <button className="desktop-dropdown-button">
            Servicios
          </button>
          {activeDropdown === 'servicios' && (
            <div className="desktop-dropdown-menu desktop-dropdown-menu-servicios">
              <a href="/bienestar" className="desktop-dropdown-item">Bienestar Integral</a>
              <a href="/privado" className="desktop-dropdown-item">Encuentro Privado</a>
              <a href="/limpiar_karma" className="desktop-dropdown-item">Sesión Limpiar Karma</a>
              <a href="/estructural" className="desktop-dropdown-item">Análisis Estructural</a>
              <a href="/regresion" className="desktop-dropdown-item">Regresión Origen</a>
            </div>
          )}
        </div>
        
        <a href="/contenidos" className="desktop-nav-link">Todos contenidos</a>
        <Link href="/blogs" className="desktop-nav-link">Blog</Link>
      </nav>
    </header>
  );
} 