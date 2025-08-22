"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth";

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

export default function VideosSection() {
  const router = useRouter();
  const { user, isLoaded, isAuthenticated, showSignupModal, requireAuth, closeSignupModal } = useAuth();
  const [userLevels, setUserLevels] = useState<UserLevel[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState("");
  const [upgradeAction, setUpgradeAction] = useState<"login" | "upgrade" | "abundancia">("login");
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);

  // Latest published content (6 items for index page)
  const latestContent = [
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
    
    // Level 3 (CARISMA) - First paid level
    { 
      id: 6, 
      title: "Leyes del universo", 
      level: "carisma", 
      description: "Descubre las leyes universales que rigen la abundancia y el éxito.",
      type: "video",
      accessLevel: 3
    },
    
    // Level 5 (KARMA) - Second paid level
    { 
      id: 9, 
      title: "Karma y reencarnación", 
      level: "karma", 
      description: "Explora la naturaleza del karma y su relación con la reencarnación.",
      type: "video",
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
    try {
      const response = await fetch('/api/user/user-levels');
      if (response.ok) {
        const data = await response.json();
        setUserLevels(data.userLevels || []);
      }
    } catch (error) {
      console.error('Error fetching user levels:', error);
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
    return 2;
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
      return "Necesitas iniciar sesión para acceder a este contenido.";
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

  const handleContentClick = (contentItem: ContentItem) => {
    if (!canAccessLevel(contentItem.accessLevel)) {
      setUpgradeMessage(getUpgradeMessage(contentItem.accessLevel));
      setSelectedContent(contentItem);
      setShowUpgradeModal(true);
      return;
    }
    
    if (!isAuthenticated) {
      requireAuth();
      return;
    }
    
    // User has access, show content in modal
    setSelectedContent(contentItem);
    setShowContentModal(true);
  };

  const closeUpgradeModal = () => {
    setShowUpgradeModal(false);
    setUpgradeMessage("");
    setSelectedContent(null);
  };

  const closeContentModal = () => {
    setShowContentModal(false);
    setSelectedContent(null);
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

  const getUpgradeButtonText = () => {
    switch (upgradeAction) {
      case "login": return "Iniciar Sesión";
      case "upgrade": return "Comprar Acceso";
      case "abundancia": return "Contactar Soporte";
      default: return "Continuar";
    }
  };

  const getContentIcon = (type: string) => {
    return type === "video" ? "▶" : "♪";
  };

  const isContentAccessible = (contentLevel: number) => {
    return canAccessLevel(contentLevel);
  };

  const getContentCardClass = (contentLevel: number) => {
    if (contentLevel === 1) return "videos-item accessible";
    if (isContentAccessible(contentLevel)) return "videos-item accessible";
    return "videos-item restricted";
  };

  return (
    <>
      <section className="videos-section">
        <h2 className="videos-heading">Últimos videos y audios</h2>
        <div className="videos-grid">
          {latestContent.map((item) => (
            <div 
              key={item.id} 
              className={getContentCardClass(item.accessLevel)}
              onClick={() => handleContentClick(item)}
              style={{ cursor: 'pointer' }}
            >
              <div className={`videos-icon ${item.type}`}>
                <span className="videos-icon-text">{getContentIcon(item.type)}</span>
              </div>
              <div className="videos-content-info">
                <div className="videos-title">{item.title}</div>
              </div>
            </div>
          ))}
        </div>
        <button className="videos-btn" onClick={() => router.push('/conocimiento')}>
          VER TODOS LOS VIDEOS
        </button>
      </section>

      {/* Upgrade Modal */}
      {showUpgradeModal && selectedContent && (
        <div className="modal-overlay" onClick={closeUpgradeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeUpgradeModal}>×</button>
            <h3 className="modal-title">Acceso Restringido</h3>
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

      {/* Content Modal */}
      {showContentModal && selectedContent && (
        <div className="modal-overlay" onClick={closeContentModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeContentModal}>×</button>
            <h3 className="modal-title">{selectedContent.title}</h3>
            <div className="modal-content-type">
              <span className="content-type-icon">{getContentIcon(selectedContent.type)}</span>
              <span className="content-type-text">
                {selectedContent.type === "video" ? "Video" : "Audio"}
              </span>
            </div>
            <p className="modal-description">{selectedContent.description}</p>
            <div className="modal-actions">
              <button 
                className="content-play-button"
                onClick={() => {
                  // Here you would implement the actual content player
                  // For now, just close the modal
                  closeContentModal();
                }}
              >
                {selectedContent.type === "video" ? "▶ Reproducir Video" : "♪ Reproducir Audio"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 