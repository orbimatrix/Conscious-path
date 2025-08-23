"use client"
import React, { useState, useEffect } from "react";
import FooterSection from "../components/FooterSection";
import SignupModal from "../components/SignupModal";
import { useAuth } from "../../lib/auth";
import { useRouter } from "next/navigation";
import "./conocimiento.css";

interface ContentItem {
  id: number;
  title: string;
  level: string;
  description: string;
  type: string;
  accessLevel: number;
}

interface UserLevel {
  level: string;
  isActive: boolean;
  expiresAt?: string;
}

export default function ConocimientoPage() {
  const { user, isLoaded, isAuthenticated, showSignupModal, requireAuth, closeSignupModal } = useAuth();
  const [checkedItems, setCheckedItems] = useState<boolean[]>([false, false, false, false, false, false]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("public");
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [userLevels, setUserLevels] = useState<UserLevel[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState("");
  const [upgradeAction, setUpgradeAction] = useState<"login" | "upgrade" | "abundancia">("login");
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [isLoadingLevels, setIsLoadingLevels] = useState(false);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
  const router = useRouter();

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
    
    // Level 4 (ABUNDANCIA) - Special admin-activated level
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

  // Fetch user levels from database
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserLevels();
    }
  }, [isAuthenticated, user]);

  const fetchUserLevels = async () => {
    // Check if we have cached data that's still valid
    const now = Date.now();
    if (lastFetchTime > 0 && (now - lastFetchTime) < CACHE_DURATION) {
      return;
    }

    try {
      setIsLoadingLevels(true);
      const response = await fetch('/api/user/user-levels');
      if (response.ok) {
        const data = await response.json();
        setUserLevels(data.userLevels || []);
        setLastFetchTime(Date.now());
      }
    } catch (error) {
      console.error('Error fetching user levels:', error);
    } finally {
      setIsLoadingLevels(false);
    }
  };

  // Check user access level based on client specifications
  const getUserAccessLevel = () => {
    if (!isAuthenticated) return 1; // PUBLIC only
    
    
    // Check if user has specific levels from database
    const hasCarisma = userLevels.some(ul => ul.level === 'carisma' && ul.isActive);
    const hasKarma = userLevels.some(ul => ul.level === 'karma' && ul.isActive);
    const hasAbundancia = userLevels.some(ul => ul.level === 'abundancia' && ul.isActive);
    
    
    // Level 5 (Karma) - highest access
    if (hasKarma) return 5;
    
    // Level 3 (Carisma) - medium access
    if (hasCarisma) return 3;
    
    // Level 2 (Inmortal) - basic registered user (default for all registered users)
    // All authenticated users without premium levels are considered Inmortal level
    const userLevel = 2;
    return userLevel;
  };

  // Check if user can access specific content level
  const canAccessLevel = (contentLevel: number) => {
    const userLevel = getUserAccessLevel();
    
    // Level 1 (Public) - always accessible
    if (contentLevel === 1) return true;
    
    // Level 2 (Inmortal) - accessible to registered users
    if (contentLevel === 2) return userLevel >= 2;
    
    // Level 3 (Carisma) - accessible to Carisma users
    if (contentLevel === 3) return userLevel >= 3;
    
    // Level 4 (Abundancia) - special case: manually activated by admin
    if (contentLevel === 4) {
      return userLevels.some(ul => ul.level === 'abundancia' && ul.isActive);
    }
    
    // Level 5 (Karma) - accessible to Karma users
    if (contentLevel === 5) return userLevel >= 5;
    
    return false;
  };

  // Get upgrade message based on content level and user status
  const getUpgradeMessage = (contentLevel: number) => {
    if (!isAuthenticated) {
      setUpgradeAction("login");
      if (contentLevel === 1) {
        return "Necesitas iniciar sesión para acceder a este contenido.";
      } else {
        return "Necesitas iniciar sesión para acceder a este contenido. Regístrate para obtener acceso a niveles superiores.";
      }
    }
    
    const userLevel = getUserAccessLevel();
    
    if (contentLevel === 4) {
      setUpgradeAction("abundancia");
      return "El nivel Abundancia es contenido especial que debe ser activado manualmente por un administrador. Contacta con soporte para solicitar acceso.";
    }
    
    if (contentLevel === 5 && userLevel < 5) {
      setUpgradeAction("upgrade");
      return "Para acceder al contenido Karma, necesitas adquirir el acceso premium. Haz clic en 'Comprar Acceso' para continuar.";
    }
    
    if (contentLevel === 3 && userLevel < 3) {
      setUpgradeAction("upgrade");
      return "Para acceder al contenido Carisma, necesitas adquirir el acceso premium. Haz clic en 'Comprar Acceso' para continuar.";
    }
    
    setUpgradeAction("upgrade");
    return "Para acceder a este contenido, necesitas adquirir el acceso premium correspondiente.";
  };

  // Filter content based on active filter and user access
  useEffect(() => {
    let filtered = contentData.filter(item => {
      // Show ALL content to everyone - this is the key change
      // The access control happens when they try to interact with the content
      return true;
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
  }, [activeFilter, isAuthenticated, user, isLoaded, userLevels]);

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
    const contentItem = filteredContent[index];
  
    
    // For non-authenticated users, show login prompt for any restricted content
    if (!isAuthenticated && contentItem.accessLevel > 1) {
      const message = getUpgradeMessage(contentItem.accessLevel);
      setUpgradeMessage(message);
      setShowUpgradeModal(true);
      return;
    }
    
    if (!canAccessLevel(contentItem.accessLevel)) {
      const message = getUpgradeMessage(contentItem.accessLevel);
      setUpgradeMessage(message);
      setShowUpgradeModal(true);
      return;
    }
    
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

  const closeUpgradeModal = () => {
    setShowUpgradeModal(false);
    setUpgradeMessage("");
  };

  const handleUpgradeAction = () => {
    if (upgradeAction === "login") {
      requireAuth();
    } else if (upgradeAction === "upgrade") {
      // Redirect to upgrade page or payment
      router.push("/aportes");
    } else if (upgradeAction === "abundancia") {
      // Redirect to contact/support page
      router.push("/bienestar");
    }
    closeUpgradeModal();
  };

  const handleModalCheckboxClick = () => {
    // Handle modal checkbox logic here
  };

  const getContentIcon = (type: string) => {
    return type === "video" ? "▶" : "♪";
  };

  const getLockIcon = (accessLevel: number) => {
    // Don't show lock icon for public content (level 1)
    if (accessLevel === 1) {
      return null;
    }
    
    // For authenticated users, check their access level
    if (isAuthenticated && user) {
      const userLevel = getUserAccessLevel();
      
      // Inmortal users (level 2) can access Inmortal content (level 2) - no lock needed
      if (accessLevel === 2 && userLevel >= 2) {
        return null;
      }
      
      // Show lock for content the user doesn't have access to
      if (accessLevel > userLevel) {
        return "🔒";
      }
      
      // User has access to this level - no lock needed
      return null;
    }
    
    // For non-authenticated users, show lock for all restricted content
    if (accessLevel > 1) {
      return "🔒";
    }
    
    return null;
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

  const isContentAccessible = (contentLevel: number) => {
    return canAccessLevel(contentLevel);
  };

  const getContentCardClass = (contentLevel: number) => {
    // All content cards are visually accessible since everyone can see them
    // Access control happens when they try to interact with the content
    return "video-card accessible";
  };

  const getUpgradeButtonText = () => {
    switch (upgradeAction) {
      case "login": return "Iniciar Sesión";
      case "upgrade": return "Comprar Acceso";
      case "abundancia": return "Contactar Soporte";
      default: return "Continuar";
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
        
        {isLoadingLevels && (
          <div className="loading-indicator">
            <div className="loading-spinner"></div>
            <p>Cargando niveles de usuario...</p>
          </div>
        )}
        
        <div className="videos-grid">
          {filteredContent.map((item, index) => (
            <div key={item.id} className={getContentCardClass(item.accessLevel)}>
              <div className="video-thumbnail">
                <div className={item.type === "video" ? "video-icon" : "audio-icon"}>
                  {getContentIcon(item.type)}
                </div>
                {getLockIcon(item.accessLevel) && (
                  <div className="lock-icon">
                    {getLockIcon(item.accessLevel)}
                  </div>
                )}
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

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="modal-overlay" onClick={closeUpgradeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeUpgradeModal}>×</button>
            <h3 className="modal-title">
              {upgradeAction === "login" ? "Iniciar Sesión" : "Acceso Restringido"}
            </h3>
            <p className="modal-description">{upgradeMessage}</p>
            <div className="modal-actions">
              <button 
                className="upgrade-button"
                onClick={handleUpgradeAction}
              >
                {getUpgradeButtonText()}
              </button>
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
