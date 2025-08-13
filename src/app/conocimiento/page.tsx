"use client"
import React, { useState, useEffect } from "react";
import FooterSection from "../components/FooterSection";
import SignupModal from "../components/SignupModal";
import { useAuth } from "../../lib/auth";
import "./conocimiento.css";

interface ContentItem {
  id: number;
  title: string;
  level: string;
  description: string;
  type: string;
  accessLevel: number;
}

export default function ConocimientoPage() {
  const { user, isLoaded, isAuthenticated, showSignupModal, requireAuth, closeSignupModal } = useAuth();
  const [checkedItems, setCheckedItems] = useState<boolean[]>([false, false, false, false, false, false]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("public");
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);

  // Content data with access levels
  const contentData = [
    // Level 1 (PUBLIC) - No login required
    { 
      id: 1, 
      title: "Abundancia y enfermedades", 
      level: "public", 
      description: "Este video explora la relación entre la abundancia y las enfermedades, proporcionando insights valiosos sobre cómo mantener la salud física y mental.",
      type: "video",
      accessLevel: 1
    },
    { 
      id: 2, 
      title: "Bienestar y prosperidad", 
      level: "public", 
      description: "Descubre cómo el bienestar mental está conectado con la prosperidad financiera y personal.",
      type: "video",
      accessLevel: 1
    },
    { 
      id: 3, 
      title: "Meditación para principiantes", 
      level: "public", 
      description: "Una guía completa para comenzar tu práctica de meditación diaria.",
      type: "audio",
      accessLevel: 1
    },
    
    // Level 2 (INMORTAL) - Requires registration
    { 
      id: 4, 
      title: "Técnicas avanzadas de respiración", 
      level: "inmortal", 
      description: "Aprende técnicas avanzadas de respiración para mejorar tu concentración y energía.",
      type: "video",
      accessLevel: 2
    },
    { 
      id: 5, 
      title: "Manejo del estrés", 
      level: "inmortal", 
      description: "Estrategias efectivas para manejar el estrés en la vida diaria.",
      type: "video",
      accessLevel: 2
    },
    
    // Level 3 (CARISMA) - First paid level
    { 
      id: 6, 
      title: "Leyes del universo", 
      level: "carisma", 
      description: "Descubre las leyes universales que rigen la abundancia y el éxito.",
      type: "video",
      accessLevel: 3
    },
    { 
      id: 7, 
      title: "Manifestación consciente", 
      level: "carisma", 
      description: "Aprende a manifestar tus deseos de manera consciente y efectiva.",
      type: "audio",
      accessLevel: 3
    },
    
    // Level 4 (ABUNDANCIA) - Free with admin auth
    { 
      id: 8, 
      title: "Secretos de la abundancia", 
      level: "abundancia", 
      description: "Contenido exclusivo sobre los secretos de la abundancia financiera.",
      type: "video",
      accessLevel: 4
    },
    
    // Level 5 (KARMA) - Second paid level
    { 
      id: 9, 
      title: "Karma y reencarnación", 
      level: "karma", 
      description: "Explora la naturaleza del karma y su relación con la reencarnación.",
      type: "video",
      accessLevel: 5
    },
    { 
      id: 10, 
      title: "Limpieza kármica", 
      level: "karma", 
      description: "Técnicas avanzadas para limpiar karma negativo y crear karma positivo.",
      type: "audio",
      accessLevel: 5
    }
  ];

  // Check user access level
  const getUserAccessLevel = () => {
    if (!isAuthenticated) return 1; // PUBLIC only
    
    // Check user level from database or subscription
    // For now, we'll use a simple check - in real implementation, 
    // you'd query the user's actual level from the database
    if (user?.publicMetadata?.level) {
      const level = user.publicMetadata.level as string;
      switch (level) {
        case 'inmortal': return 2;
        case 'carisma': return 3;
        case 'abundancia': return 4;
        case 'karma': return 5;
        default: return 2; // Default to inmortal for registered users
      }
    }
    
    return 2; // Default to inmortal for registered users
  };

  // Filter content based on active filter and user access
  useEffect(() => {
    const userLevel = getUserAccessLevel();
    
    let filtered = contentData.filter(item => {
      // Always show PUBLIC content
      if (item.accessLevel === 1) return true;
      
      // Check if user has access to this level
      if (item.accessLevel <= userLevel) return true;
      
      return false;
    });

    // Apply additional filter if not showing all content
    if (activeFilter !== "all") {
      filtered = filtered.filter(item => {
        if (activeFilter === "public") return item.accessLevel === 1;
        if (activeFilter === "inmortal") return item.accessLevel === 2;
        if (activeFilter === "carisma") return item.accessLevel === 3;
        if (activeFilter === "abundancia") return item.accessLevel === 4;
        if (activeFilter === "karma") return item.accessLevel === 5;
        return true;
      });
    }

    setFilteredContent(filtered);
  }, [activeFilter, isAuthenticated, user, isLoaded]);

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleCheckboxClick = (index: number) => {
    if (!isAuthenticated) {
      requireAuth();
      return;
    }
    
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
  };

  const handlePlusClick = (index: number) => {
    if (!isAuthenticated) {
      requireAuth();
      return;
    }
    
    setSelectedCard(index);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCard(null);
  };

  const handleModalCheckboxClick = () => {
    // Handle modal checkbox logic here
  };

  const getContentIcon = (type: string) => {
    return type === "video" ? "▶" : "♪";
  };

  const getLevelDisplayName = (level: string) => {
    switch (level) {
      case "public": return "Público";
      case "inmortal": return "Inmortal";
      case "carisma": return "Carisma";
      case "abundancia": return "Abundancia";
      case "karma": return "Karma";
      default: return level;
    }
  };

  return (
    <div>
      <section className="audio-video-hero">
        {/* Responsive images for different screen sizes */}
        <picture>
          {/* For screens 960px and above */}
          <source media="(min-width: 960px)" srcSet="/fotos/g_960.png" />
          {/* For screens 768px to 959px */}
          <source media="(min-width: 768px)" srcSet="/fotos/g_768.png" />
          {/* For screens 480px to 767px */}
          <source media="(min-width: 480px)" srcSet="/fotos/g_480.png" />
          {/* For screens 360px to 479px */}
          <source media="(min-width: 360px)" srcSet="/fotos/g_360.png" />
          {/* Fallback for screens below 360px */}
          <img 
            src="/fotos/girl.png" 
            alt="Hero Image" 
            className="hero-image"
          />
        </picture>
      </section>
      
      <section className="button-section">
        <div className="button-grid">
          <button 
            className={`filter-button ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => handleFilterClick("all")}
          >
            Todo
          </button>
          <button 
            className={`filter-button ${activeFilter === "public" ? "active" : ""}`}
            onClick={() => handleFilterClick("public")}
          >
            Público
          </button>
          <button 
            className={`filter-button ${activeFilter === "inmortal" ? "active" : ""}`}
            onClick={() => handleFilterClick("inmortal")}
          >
            Inmortal
          </button>
          <button 
            className={`filter-button ${activeFilter === "carisma" ? "active" : ""}`}
            onClick={() => handleFilterClick("carisma")}
          >
            Carisma
          </button>
          <button 
            className={`filter-button ${activeFilter === "abundancia" ? "active" : ""}`}
            onClick={() => handleFilterClick("abundancia")}
          >
            Abundancia
          </button>
          <button 
            className={`filter-button ${activeFilter === "karma" ? "active" : ""}`}
            onClick={() => handleFilterClick("karma")}
          >
            Karma
          </button>
        </div>
      </section>
      
      <section className="videos-section">
        <h2 className="videos-title">
          {activeFilter === "all" 
            ? "Todo el Contenido Disponible" 
            : `Contenido ${getLevelDisplayName(activeFilter)}`
          }
        </h2>
        <div className="videos-grid">
          {filteredContent.map((item, index) => (
            <div key={item.id} className="video-card">
              <div className="video-thumbnail">
                <div className={item.type === "video" ? "video-icon" : "audio-icon"}>
                  {getContentIcon(item.type)}
                </div>
              </div>
              <div className="video-info">
                <div className="video-title">{item.title}</div>
                <div className="video-level">{getLevelDisplayName(item.level)}</div>
                <div className="video-status">
                  <div 
                    className={`status-checkbox ${checkedItems[index] ? 'checked' : ''}`}
                    onClick={() => handleCheckboxClick(index)}
                  ></div>
                  <div className="status-plus-circle" onClick={() => handlePlusClick(index)}>
                    <img src="/fotos/circle.svg" alt="Plus circle" className="circle-icon" />
                    <span className="plus-icon">+</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal Overlay */}
      {showModal && selectedCard !== null && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeModal}>×</button>
            <h3 className="modal-title">{filteredContent[selectedCard]?.title}</h3>
            <p className="modal-level">Nivel: {getLevelDisplayName(filteredContent[selectedCard]?.level)}</p>
            <p className="modal-description">
              {filteredContent[selectedCard]?.description}
            </p>
            <div className="modal-actions">
              <div className="modal-checkbox-container">
                <div 
                  className="modal-checkbox"
                  onClick={handleModalCheckboxClick}
                ></div>
                <span className="modal-checkbox-text">Marcar como completado</span>
              </div>
              <div className="modal-minus"></div>
            </div>
          </div>
        </div>
      )}
      
      <FooterSection />
      
      {/* Signup Modal */}
      <SignupModal
        isOpen={showSignupModal}
        onClose={closeSignupModal}
        title="Inicia sesión para acceder al contenido"
        message="Necesitas iniciar sesión para acceder a este contenido y marcarlo como completado."
      />
    </div>
  );
}
