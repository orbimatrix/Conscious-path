"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import FooterSection from "../components/FooterSection";
import "./abundancia.css";

interface Video {
  uri: string;
  name: string;
  description?: string;
  duration: number;
  created_time: string;
  modified_time: string;
  release_time: string;
  pictures: {
    sizes: Array<{
      width: number;
      height: number;
      link: string;
    }>;
  };
  player_embed_url: string;
  link: string;
  embed: {
    html: string;
  };
  stats: {
    plays: number;
    likes: number;
    comments: number;
  };
  accessLevel?: number;
}

export default function AbundanciaPage() {
  const router = useRouter();
  // Simulate user login status - in real app this would come from auth context
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Video modal state
  const [publicVideo, setPublicVideo] = useState<Video | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPublicVideo();
  }, []);

  const fetchPublicVideo = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch videos from Vimeo API
      const response = await fetch('/api/vimeo/videos');
      const result = await response.json();
      
      if (result.success && result.videos && result.videos.length > 0) {
        // Find a public video or abundancia-related video
        const publicVid = result.videos.find((video: Video) => 
          video.name.toLowerCase().includes('public') || 
          video.name.toLowerCase().includes('abundancia') ||
          video.name.toLowerCase().includes('benec') ||
          video.name.toLowerCase().includes('nivel') ||
          video.description?.toLowerCase().includes('public') ||
          video.description?.toLowerCase().includes('abundancia') ||
          video.description?.toLowerCase().includes('benec')
        );
        
        setPublicVideo(publicVid || result.videos[0]); // Fallback to first video if no public one found
      } else {
        setError('No se encontraron videos disponibles');
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError('Error al cargar los videos');
    } finally {
      setLoading(false);
    }
  };

  const toggleLoginStatus = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  const openVideoModal = () => {
    if (publicVideo) {
      setShowVideoModal(true);
    }
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
  };

  const getVideoThumbnail = () => {
    if (publicVideo?.pictures?.sizes) {
      // Get the best quality thumbnail available
      const bestThumbnail = publicVideo.pictures.sizes.find(size => size.width >= 640) || 
                           publicVideo.pictures.sizes[publicVideo.pictures.sizes.length - 1];
      return bestThumbnail?.link;
    }
    return null;
  };

  return (
    <div className="abundancia-page">
      {/* Hero Section - Outside main container for full width */}
      <section className="abundancia-hero">
        <div className="abundancia-hero-content">
          <h1 className="abundancia-title">NIVEL</h1>
          <h2 className="abundancia-subtitle">PROYECCIÓN DE LA ABUNDANCIA</h2>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="abundancia-benefits">
        <div className="abundancia-benefits-container">
          <div className="abundancia-benefits-wrapper">
            <ul className="abundancia-benefits-list">
              <li className="abundancia-benefit-item">
                <Image src="/img/check.png" alt="Check" className="benefit-icon" width={20} height={20} />
                <span className="benefit-text">Cambiar la suerte en positivo</span>
              </li>
              <li className="abundancia-benefit-item">
                <Image src="/img/check.png" alt="Check" className="benefit-icon" width={20} height={20} />
                <span className="benefit-text">Llegada de dinero y regalos</span>
              </li>
              <li className="abundancia-benefit-item">
                <Image src="/img/check.png" alt="Check" className="benefit-icon" width={20} height={20} />
                <span className="benefit-text">Adiós a la escased</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Image Section - Outside main container for full width */}
      <section className="abundancia-image-section">
        <div className="abundancia-image-container">
          <Image
            src="/fotos/model.jpg"
            alt="Model in luxury setting"
            className="abundancia-image"
            width={800}
            height={600}
          />
        </div>
      </section>

      {/* Content Section */}
      <section className="abundancia-content">
        <div className="abundancia-content-container">
          <h2 className="abundancia-content-title">
            EL EGRÉGOR DEL BENEFICIO ECONÓMICO
          </h2>
          
          <div className="abundancia-content-text">
            <p className="abundancia-paragraph">
              El egrégor del beneficio económico BENEC es un grupo creado por mentes enfocadas en la abundancia y la mejora personal. Tiene una larga trayectoria y ha demostrado su efectividad en mejorar la economía de sus miembros.
            </p>
            
            <p className="abundancia-paragraph">
              Para acceder es necesario participar en el nivel CARISMA o KARMA, realizar visualizaciones específicas, tener objetivos claros, y realizar una contribución del 5% de los ingresos aumentados para los socios, quienes también deben mantener secretos.
            </p>
            
            <p className="abundancia-final-text">
              En el grupo de la abundacia BENEC:
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Block Section */}
      <section className="abundancia-benefits-block">
        <div className="benefits-block-container">
          <div className="benefits-block-content">
            <p className="benefit-item">Dispondrá de nuevas oportunidades y retos.</p>
            <p className="benefit-item">Las &quot;casualidades&quot; positivas serán habituales.</p>
            <p className="benefit-item">La economía siempre tenderá a mejorar.</p>
            <p className="benefit-item">Dispondrá de la evaluación personalizada para identificar y eliminar bloqueos mentales, familiares y transgeneracionales.</p>
          </div>
        </div>
      </section>

      {/* Video Presentation Section */}
      <section className="abundancia-video-section">
        <div className="video-section-container">
          {loading ? (
            <div className="video-player">
              <div className="video-loading">Cargando video...</div>
            </div>
          ) : error ? (
            <div className="video-player">
              <div className="video-error">
                <div className="error-text">{error}</div>
              </div>
            </div>
          ) : publicVideo ? (
            <div className="video-player" onClick={openVideoModal}>
              {getVideoThumbnail() ? (
                <div className="video-thumbnail">
                  <Image
                    src={getVideoThumbnail()!}
                    alt={publicVideo.name}
                    fill
                    className="thumbnail-image"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ) : (
                <div className="video-placeholder">
                  <div className="placeholder-text">Video no disponible</div>
                </div>
              )}
              <div className="play-button">
                <div className="play-icon"></div>
              </div>
            </div>
          ) : (
            <div className="video-player no-video">
              <div className="video-placeholder">
                <div className="placeholder-text">No hay videos disponibles</div>
              </div>
            </div>
          )}
          
          <h3 className="video-title">
            {publicVideo ? publicVideo.name : 'Presentación del Grupo de Proyección'}
          </h3>
          
          {/* Conditional content based on login status */}
          {isLoggedIn ? (
            <div className="logged-in-content">
              <div className="logged-in-message">
                YA PARTICIPAS EN EL GRUPO DE<br />
                PROYECCIÓN DE LA ABUNDANCIA<br />
                &quot;BENEC&quot;
              </div>
              <button className="video-cta-button logged-in">
                ENTRAR EN BENEC
              </button>
            </div>
          ) : (
            <button 
              className="video-cta-button" 
              onClick={() => router.push('/registration')}
            >
              ENTRAR / REGISTRARSE
            </button>
          )}
          
          <div className="secondary-buttons">
            <button className="secondary-button" onClick={() => router.push('/carisma')}>Volver a Carisma</button>
            <button className="secondary-button" onClick={() => router.push('/karma')}>Volver a Karma</button>
          </div>
          
          {/* Debug toggle button - remove in production */}
          <button 
            className="debug-toggle" 
            onClick={toggleLoginStatus}
            style={{ 
              marginTop: '20px', 
              padding: '8px 16px', 
              background: '#666', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              fontSize: '12px'
            }}
          >
            {isLoggedIn ? 'Logout' : 'Login'} (Debug)
          </button>
        </div>
      </section>

      {/* Video Modal */}
      {showVideoModal && publicVideo && (
        <div className="video-modal-overlay" onClick={closeVideoModal}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="video-modal-close" onClick={closeVideoModal}>×</button>
            <div className="video-modal-player">
              {publicVideo.link.includes('vimeo.com') ? (
                <iframe
                  src={`https://player.vimeo.com/video/${publicVideo.uri.split('/').pop()}?h=auto&autoplay=1`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="video-iframe"
                ></iframe>
              ) : (
                <video
                  controls
                  className="video-element"
                  autoPlay
                  src={publicVideo.link}
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>
        </div>
      )}

      <FooterSection />
    </div>
  );
}
