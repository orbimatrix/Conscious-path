"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  if (isMobile) {
    // Mobile header (current)
    return (
      <>
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

        {isDropdownOpen && (
          <div className="mobile-dropdown-overlay" onClick={closeDropdown}>
            <div className="mobile-dropdown" onClick={(e) => e.stopPropagation()}>
              <button className="mobile-dropdown-close-btn" onClick={closeDropdown}>
                ✕
              </button>
              
              <div className="mobile-dropdown-section">
                <div className="mobile-dropdown-section-title">AUDIOS y VIDEOS</div>
              </div>

              <div className="mobile-dropdown-section">
                <div className="mobile-dropdown-section-title">NIVELES</div>
                <a href="#" className="mobile-dropdown-menu-item">Carisma</a>
                <a href="#" className="mobile-dropdown-menu-item">Karma</a>
                <a href="#" className="mobile-dropdown-menu-item">Renacer Consciente</a>
                <a href="#" className="mobile-dropdown-menu-item">Abundancia</a>
              </div>

              <div className="mobile-dropdown-section">
                <div className="mobile-dropdown-section-title">SERVICIOS</div>
                <a href="#" className="mobile-dropdown-menu-item">Bienestar Integral</a>
                <a href="#" className="mobile-dropdown-menu-item">Encuentro Privado</a>
                <a href="#" className="mobile-dropdown-menu-item">Sesión Limpiar Karma</a>
                <a href="#" className="mobile-dropdown-menu-item">Análisis Estructural</a>
                <a href="#" className="mobile-dropdown-menu-item">Regresión Origen</a>
              </div>

              <div className="mobile-dropdown-section">
                <a href="#" className="mobile-dropdown-menu-item">Todos los contenidos</a>
              </div>

              <div className="mobile-dropdown-section">
                <a href="/blogs" className="mobile-dropdown-menu-item">Blog</a>
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
    <header style={{ background: '#fff', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.10)', position: 'relative', zIndex: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', height: 90 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Image src="/dollar.png" alt="Logo" width={40} height={40} style={{ marginRight: 16 }} />
          <span style={{ fontWeight: 300, fontSize: 48, letterSpacing: 1, color: '#E6A14A', fontFamily: 'inherit' }}>SENDA</span>
          <span style={{ fontWeight: 300, fontSize: 48, letterSpacing: 1, color: '#5A5353', fontFamily: 'inherit' }}> CONSCIENTE</span>
        </div>
        <button style={{ background: '#F9D264', color: '#fff', fontWeight: 400, fontSize: 22, border: 'none', borderRadius: 8, padding: '12px 36px', cursor: 'pointer', marginLeft: 24 }}>Entrar</button>
      </div>
      <div style={{ borderBottom: '1px solid #d9d9d9', margin: '0 0 0 0' }} />
      <nav style={{ display: 'flex', justifyContent: 'center', gap: 64, padding: '18px 0', background: '#fff' }}>
        <a href="#" style={{ color: '#8B4C00', fontWeight: 500, fontSize: 22, textDecoration: 'none' }}>Audios y Videos</a>
        <a href="#" style={{ color: '#8B4C00', fontWeight: 500, fontSize: 22, textDecoration: 'none' }}>Niveles</a>
        <a href="#" style={{ color: '#8B4C00', fontWeight: 500, fontSize: 22, textDecoration: 'none' }}>Servicios</a>
        <a href="#" style={{ color: '#8B4C00', fontWeight: 500, fontSize: 22, textDecoration: 'none' }}>Todos contenidos</a>
        <a href="/blogs" style={{ color: '#8B4C00', fontWeight: 500, fontSize: 22, textDecoration: 'none' }}>Blog</a>
      </nav>
    </header>
  );
} 