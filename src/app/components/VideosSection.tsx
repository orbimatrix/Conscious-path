"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth";
import { VimeoVideo } from "../types/vimeo";
import Image from "next/image";

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

export default function VideosSection() {
  const router = useRouter();
  const { user,  isAuthenticated,  requireAuth } = useAuth();
  const [userLevels, setUserLevels] = useState<UserLevel[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState("");
  const [upgradeAction, setUpgradeAction] = useState<"login" | "upgrade" | "abundancia">("login");
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [videos, setVideos] = useState<VimeoVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user levels from database
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserLevels();
    }
  }, [isAuthenticated, user]);

  // Fetch audios and videos
  useEffect(() => {
    fetchAudios();
    fetchVideos();
  }, []);

  const fetchUserLevels = useCallback(async () => {
    try {
      const response = await fetch('/api/user/user-levels');
      if (response.ok) {
        const data = await response.json();
        setUserLevels(data.userLevels || []);
      }
    } catch (error) {
      console.error('Error fetching user levels:', error);
    }
  }, []);

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
        const filesWithUrl = data.files.map((f: any) => ({
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
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  // Transform API data to ContentItem format
  const getLatestContent = (): ContentItem[] => {
    const contentItems: ContentItem[] = [];
    
    // Add videos (limit to 4 for homepage to fill the grid)
    videos.slice(0, 4).forEach((video, index) => {
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

    // Add audios with proper access control
    audioFiles.slice(0, 2).forEach((audio, index) => {
      // Extract meaningful title from audio filename
      let title = audio.name;
      let accessLevel = 1; // Default public level
      
      // Determine access level based on audio filename/content
      if (title.toLowerCase().includes('karma')) {
        accessLevel = 5; // Karma level - requires karma subscription
      } else if (title.toLowerCase().includes('carisma')) {
        accessLevel = 3; // Carisma level - requires carisma subscription
      } else if (title.toLowerCase().includes('abundancia')) {
        accessLevel = 4; // Abundancia level - requires abundancia subscription
      } else if (title.toLowerCase().includes('inmortal') || title.toLowerCase().includes('registrado')) {
        accessLevel = 2; // Inmortal level - requires login
      } else {
        accessLevel = 1; // Public level - no login required
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
  };

  // Helper function to get level name
  const getLevelName = (level: number): string => {
    switch (level) {
      case 1: return "public";
      case 2: return "inmortal";
      case 3: return "carisma";
      case 4: return "abundancia";
      case 5: return "karma";
      default: return "public";
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
  };

  // Get upgrade message based on content level and user status
  const getUpgradeMessage = (contentLevel: number) => {
    if (!isAuthenticated) {
      setUpgradeAction("login");
      if (contentLevel === 1) {
        return "Este contenido es público y accesible para todos.";
      } else if (contentLevel === 2) {
        return "Necesitas iniciar sesión para acceder a este contenido.";
      } else {
        return "Necesitas iniciar sesión y tener el nivel correspondiente para acceder a este contenido.";
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
      setUpgradeAction("login");
      return "Necesitas iniciar sesión para acceder a este contenido.";
    }
    
    setUpgradeAction("upgrade");
    return "Para acceder a este contenido, necesitas adquirir el acceso premium correspondiente.";
  };

  const handleContentClick = (contentItem: ContentItem) => {
    // Public content (level 1) is always accessible
    if (contentItem.accessLevel === 1) {
      setSelectedContent(contentItem);
      setShowContentModal(true);
      return;
    }
    
    // Check access for restricted content
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
      // Redirect to registration page instead of just requiring auth
      router.push("/registration");
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

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get level badge color
  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'public': return 'bg-green-100 text-green-800';
      case 'inmortal': return 'bg-blue-100 text-blue-800';
      case 'carisma': return 'bg-purple-100 text-purple-800';
      case 'abundancia': return 'bg-yellow-100 text-yellow-800';
      case 'karma': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="videos-section">Loading content...</div>;

  if (error) {
    return (
      <div className="videos-section">
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
      </div>
    );
  }

  const latestContent = getLatestContent();

  if (latestContent.length === 0) {
    return (
      <div className="videos-section">
        <div className="text-center py-20">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Content Found</h3>
            <p className="text-gray-600">No videos or audios are available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

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
              {item.thumbnail ? (
                <div className="videos-thumbnail relative">
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
                </div>
              ) : (
                <div className={`videos-icon ${item.type} relative`}>
                  <span className="videos-icon-text">{getContentIcon(item.type)}</span>
                  {/* Level Badge for Audio - removed for cleaner look */}
                </div>
              )}
              <div className="videos-content-info">
                <div className="videos-title">{item.title}</div>
                {item.description && (
                  <div className="videos-description text-black">{item.description}</div>
                )}
               
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
            <h3 className="modal-title">Contenido Premium</h3>
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
            <button className="close-modal" onClick={closeContentModal}>×</button>
            <h3 className="modal-title">{selectedContent.title}</h3>
            
            {/* Content Player */}
            <div className="modal-player">
              {selectedContent.type === "video" && selectedContent.url ? (
                <div className="video-player">
                  {selectedContent.url.includes('vimeo.com') ? (
                    // Vimeo video player - much shorter height for mobile
                    <iframe
                      src={`https://player.vimeo.com/video/${selectedContent.id.split('/').pop()}?h=auto&autoplay=1`}
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
                      <source src={selectedContent.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              ) : selectedContent.type === "audio" && selectedContent.url ? (
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
                    controlsList="nodownload"
                    autoPlay
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
                    <source src={selectedContent.url} type="audio/mpeg" />
                    <source src={selectedContent.url} type="audio/mp3" />
                    <source src={selectedContent.url} type="audio/wav" />
                    <source src={selectedContent.url} type="audio/aac" />
                    <source src={selectedContent.url} type="audio/ogg" />
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
                {selectedContent.type === "video" ? "▶ Reproduciendo Video" : "♪ Reproduciendo Audio"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 