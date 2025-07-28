"use client";
import React, { useState } from "react";
import Image from "next/image";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <>
      <header className="header-root">
        <div className="header-icon" onClick={toggleDropdown}>
          <Image src="/img/menu/menu200.svg" alt="Menu" width={32} height={32} />
        </div>
        <div className="header-center">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
            <text x="8" y="25" fontSize="28" fontWeight="bold" fill="#B8860B">$</text>
          </svg>
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
              <a href="#" className="mobile-dropdown-menu-item">Blog</a>
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