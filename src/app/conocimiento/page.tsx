"use client"
import React, { useState, useEffect, useCallback } from "react";
import FooterSection from "../components/FooterSection";
import SignupModal from "../components/SignupModal";
import { useAuth } from "../../lib/auth";
import { useRouter } from "next/navigation";
import { VimeoVideo } from "../types/vimeo";
import Image from "next/image";
import "./conocimiento.css";

interface AudioFile {
  name: string;
  url: string;
  size: number;
}

interface ContentItem {
  id: string;
  title: string;
  level: string;
  description: string;
  type: string;
  accessLevel: number;
  thumbnail?: string;
  duration?: number;
  createdTime?: string;
  url?: string;
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
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [userLevels, setUserLevels] = useState<UserLevel[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState("");
  const [upgradeAction, setUpgradeAction] = useState<"login" | "upgrade" | "abundancia">("login");
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [isLoadingLevels, setIsLoadingLevels] = useState(false);
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [videos, setVideos] = useState<VimeoVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  const fetchUserLevels = useCallback(async () => {
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
  }, [lastFetchTime]);

  const fetchAudios = useCallback(async () => {
    setLoading(true);
    try {
      const username = "admin";
      const password = "6cG59n4C4rNw7LAdHy";
  
      const res = await fetch("https://audio.sendaconsciente.com/list-audios", {
        headers: {
          "Authorization": "Basic " + btoa(`${username}:${password}`),
        },
      });
  
      const data = await res.json();
  
      if (data.success) {
        const filesWithUrl = data.files.map((f: { name: string; url: string; size: number }) => ({
          ...f,
          url: `https://audio.sendaconsciente.com${f.url}` // full URL
        }));
        setAudioFiles(filesWithUrl);
      }
    } catch (err) {
      console.error("Error fetching audios:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/vimeo/videos');
      const data = await response.json();
      
      if (data.success) {
        setVideos(data.videos || []);
      } else {
        setError(data.error || 'Failed to fetch videos');
      }
    } catch {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch user levels from database
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserLevels();
    }
  }, [isAuthenticated, user, fetchUserLevels]);

  // Fetch audios and videos
  useEffect(() => {
    fetchAudios();
    fetchVideos();
  }, [fetchAudios, fetchVideos]);

  // Transform API data to ContentItem format
  const getContentData = useCallback((): ContentItem[] => {
    const contentItems: ContentItem[] = [];
    
    // Add videos
    videos.forEach((video) => {
      // Extract meaningful title from video name
      let title = video.name;
      let accessLevel = 1; // Default public level
      
      // Determine access level based on video name/content
      if (title.toLowerCase().includes('karma')) {
        accessLevel = 5; // Karma level
      } else if (title.toLowerCase().includes('carisma')) {
        accessLevel = 3; // Carisma level
      } else if (title.toLowerCase().includes('abundancia')) {
        accessLevel = 4; // Abundancia level
      } else if (title.toLowerCase().includes('inmortal') || title.toLowerCase().includes('public')) {
        accessLevel = 2; // Inmortal level
      }
      
      if (title.includes('_')) {
        // Convert snake_case to Title Case and remove file extensions
        title = title
          .replace(/\.(mp4|mov|avi|mkv)$/i, '') // Remove video extensions
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      }
      
      contentItems.push({
        id: video.uri,
        title: title,
        level: getLevelName(accessLevel),
        description: video.description || "Video content",
        type: "video",
        accessLevel: accessLevel,
        thumbnail: video.pictures?.sizes?.[3]?.link || video.pictures?.sizes?.[0]?.link,
        duration: video.duration,
        createdTime: video.created_time,
        url: video.link
      });
    });

    // Add audios
    audioFiles.forEach((audio, index) => {
      // Extract meaningful title from audio filename
      let title = audio.name;
      let accessLevel = 1; // Default public level
      
      // Determine access level based on audio name/content
      if (title.toLowerCase().includes('karma')) {
        accessLevel = 5; // Karma level
      } else if (title.toLowerCase().includes('carisma')) {
        accessLevel = 3; // Carisma level
      } else if (title.toLowerCase().includes('abundancia')) {
        accessLevel = 4; // Abundancia level
      } else if (title.toLowerCase().includes('inmortal') || title.toLowerCase().includes('public')) {
        accessLevel = 2; // Inmortal level
      }
      
      if (title.includes('_')) {
        // Convert snake_case to Title Case and remove file extensions
        title = title
          .replace(/\.(mp3|wav|aac|ogg|m4a)$/i, '') // Remove audio extensions
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      } else if (title.includes('.')) {
        // Just remove file extension if no underscores
        title = title.replace(/\.(mp3|wav|aac|ogg|m4a)$/i, '');
      }
      
      contentItems.push({
        id: `audio-${index}`,
        title: title,
        level: getLevelName(accessLevel),
        description: "Audio content",
        type: "audio",
        accessLevel: accessLevel,
        url: audio.url
      });
    });

    return contentItems;
  }, [videos, audioFiles]);

  // Helper function to get level name
  const getLevelName = useCallback((level: number): string => {
    switch (level) {
      case 1: return "public";
      case 2: return "inmortal";
      case 3: return "carisma";
      case 4: return "abundancia";
      case 5: return "karma";
      default: return "public";
    }
  }, []);

  // Check user access level based on client specifications
  const getUserAccessLevel = useCallback(() => {
    if (!isAuthenticated) return 1; // PUBLIC only
    
    // Check if user has specific levels from database
    const hasCarisma = userLevels.some(ul => ul.level === 'carisma' && ul.isActive);
    const hasKarma = userLevels.some(ul => ul.level === 'karma' && ul.isActive);
    
    // Level 5 (Karma) - highest access
    if (hasKarma) return 5;
    
    // Level 3 (Carisma) - medium access
    if (hasCarisma) return 3;
    
    // Level 2 (Inmortal) - basic registered user (default for all registered users)
    // All authenticated users without premium levels are considered Inmortal level
    const userLevel = 2;
    return userLevel;
  }, [isAuthenticated, userLevels]);

  // Check if user can access specific content level
  const canAccessLevel = useCallback((contentLevel: number) => {
    const userLevel = getUserAccessLevel();
    
    // Level 1 (Public) - always accessible to everyone
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
  }, [getUserAccessLevel, userLevels]);

  // Get upgrade message based on content level and user status
  const getUpgradeMessage = useCallback((contentLevel: number) => {
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
    
    if (contentLevel === 2 && userLevel < 2) {
      setUpgradeAction("upgrade");
      return "Para acceder al contenido Inmortal, necesitas estar registrado. Haz clic en 'Iniciar Sesión' para continuar.";
    }
    
    setUpgradeAction("upgrade");
    return "Para acceder a este contenido, necesitas adquirir el acceso premium correspondiente.";
  }, [isAuthenticated, getUserAccessLevel, setUpgradeAction]);

  // Filter content based on active filter and user access
  useEffect(() => {
    const contentData = getContentData();
    let filtered = contentData.filter(() => {
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
  }, [activeFilter, isAuthenticated, user, isLoaded, userLevels, videos, audioFiles, getContentData]);

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
      // Redirect to registration page instead of just requiring auth
      router.push("/registration");
    } else if (upgradeAction === "upgrade") {
      // For Inmortal level, redirect to login/registration
      // For other premium levels, redirect to upgrade page
      const contentItem = selectedCard !== null ? filteredContent[selectedCard] : null;
      if (contentItem && contentItem.accessLevel === 2) {
        router.push("/registration");
      } else {
        router.push("/aportes");
      }
    } else if (upgradeAction === "abundancia") {
      // Redirect to contact/support page
      router.push("/bienestar");
    }
    closeUpgradeModal();
  };



  const getContentIcon = useCallback((type: string) => {
    return type === "video" ? "▶" : "♪";
  }, []);

  const getLockIcon = useCallback((accessLevel: number) => {
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
  }, [isAuthenticated, user, getUserAccessLevel]);

  const getLevelDisplayName = useCallback((level: string) => {
    switch (level) {
      case "public": return "Público";
      case "inmortal": return "Inmortal";
      case "carisma": return "Carisma";
      case "abundancia": return "Abundancia";
      case "karma": return "Karma";
      default: return level;
    }
  }, []);



  const getContentCardClass = useCallback((): string => {
    // All content cards are visually accessible since everyone can see them
    // Access control happens when they try to interact with the content
    return "video-card accessible";
  }, []);

  const getUpgradeButtonText = useCallback(() => {
    switch (upgradeAction) {
      case "login": return "Iniciar Sesión";
      case "upgrade": 
        // Check if it's for Inmortal level (level 2)
        const contentItem = selectedCard !== null ? filteredContent[selectedCard] : null;
        if (contentItem && contentItem.accessLevel === 2) {
          return "Iniciar Sesión";
        }
        return "Comprar Acceso";
      case "abundancia": return "Contactar Soporte";
      default: return "Continuar";
    }
  }, [upgradeAction, selectedCard, filteredContent]);

  const formatDuration = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);



  // Get level badge color
  const getLevelBadgeColor = useCallback((level: string) => {
    switch (level) {
      case 'public': return 'bg-green-100 text-green-800';
      case 'inmortal': return 'bg-blue-100 text-blue-800';
      case 'carisma': return 'bg-purple-100 text-purple-800';
      case 'abundancia': return 'bg-yellow-100 text-yellow-800';
      case 'karma': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);

  // if (loading) return <div className="loading-indicator">Loading content...</div>;

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Content</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => {
              fetchVideos();
              fetchAudios();
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
          <Image 
            src="/fotos/girl.png" 
            alt="Hero Image" 
            className="hero-image"
            width={800}
            height={600}
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
                            <div key={item.id} className={getContentCardClass()}>
              {item.thumbnail ? (
                <div className="video-thumbnail relative">
                  <Image 
                    src={item.thumbnail} 
                    alt={item.title}
                    className="w-full h-32 object-cover rounded-t-lg"
                    width={400}
                    height={128}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-video.jpg';
                    }}
                  />
                  {item.duration && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded">
                      {formatDuration(item.duration)}
                    </div>
                  )}
                  {/* Level Badge */}
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${getLevelBadgeColor(item.level)}`}>
                    {item.level.toUpperCase()}
                  </div>
                  {getLockIcon(item.accessLevel) && (
                    <div className="lock-icon">
                      {getLockIcon(item.accessLevel)}
                    </div>
                  )}
                </div>
              ) : (
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
              )}
              <div className="video-info">
                <div className="video-title">{item.title}</div>
                <div className="video-level text-black">{getLevelDisplayName(item.level)}</div>
                {item.description && (
                  <div className="video-description text-black">{item.description}</div>
                )}
               
                <div className="video-status">
                  <div 
                    className={`status-checkbox ${checkedItems[index] ? 'checked' : ''}`}
                    onClick={() => handleCheckboxClick(index)}
                  ></div>
                  <div className="status-plus-circle" onClick={() => handlePlusClick(index)}>
                    <Image src="/fotos/circle.svg" alt="Plus circle" className="circle-icon" width={24} height={24} />
                    <span className="plus-icon">+</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Content Modal */}
      {showModal && selectedCard !== null && (
        <div className="modal-overlay" onClick={closeModal}>
          <div 
            className="modal-card" 
            style={{ 
              maxWidth: '90vw', 
              width: '90vw', 
              maxHeight: window.innerWidth < 768 ? '75vh' : '95vh',
              padding: window.innerWidth < 768 ? '0.75rem' : '1.5rem'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-modal" onClick={closeModal}>×</button>
            <h3 className="modal-title">{filteredContent[selectedCard]?.title}</h3>
            
            {/* Content Player */}
            <div className="modal-player">
              {filteredContent[selectedCard]?.type === "video" && filteredContent[selectedCard]?.url ? (
                <div className="video-player">
                  {filteredContent[selectedCard]?.url.includes('vimeo.com') ? (
                    // Vimeo video player - responsive height for mobile
                    <iframe
                      src={`https://player.vimeo.com/video/${filteredContent[selectedCard]?.id.split('/').pop()}?h=auto&autoplay=1`}
                      width="100%"
                      height={window.innerWidth < 768 ? '200' : '500'}
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      className="rounded-lg"
                    ></iframe>
                  ) : (
                    // Direct video player
                    <video
                      controls
                      className="w-full rounded-lg"
                      autoPlay
                    >
                      <source src={filteredContent[selectedCard]?.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              ) : filteredContent[selectedCard]?.type === "audio" && filteredContent[selectedCard]?.url ? (
                // Enhanced audio player
                <div className="audio-player bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">♪</span>
                    </div>
                  </div>
                  <audio
                    controls
                    className="w-full"
                    autoPlay
                    controlsList="nodownload"
                    preload="metadata"
                    onError={(e) => {
                      console.error('Audio playback error:', e);
                    }}
                    onLoadStart={() => {
                      console.log('Audio loading started');
                    }}
                    onCanPlay={() => {
                      console.log('Audio can start playing');
                    }}
                  >
                    <source src={filteredContent[selectedCard]?.url} type="audio/mpeg" />
                    <source src={filteredContent[selectedCard]?.url} type="audio/mp3" />
                    <source src={filteredContent[selectedCard]?.url} type="audio/wav" />
                    <source src={filteredContent[selectedCard]?.url} type="audio/aac" />
                    <source src={filteredContent[selectedCard]?.url} type="audio/ogg" />
                    Your browser does not support the audio tag.
                  </audio>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Content player not available
                </div>
              )}
            </div>
            
            <div className="modal-actions">
              <button 
                className="content-play-button"
                onClick={() => {
                  // The content is already playing in the embedded player above
                  // This button can be used for additional actions if needed
                }}
              >
                {filteredContent[selectedCard]?.type === "video" ? "▶ Reproduciendo Video" : "♪ Reproduciendo Audio"}
              </button>
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
              {upgradeAction === "login" ? "Iniciar Sesión" : "Contenido Premium"}
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
