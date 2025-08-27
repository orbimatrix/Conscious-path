"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";
import FooterSection from "../components/FooterSection";
import "./karma.css";

interface Video {
  uri: string;
  name: string;
  description?: string;
  link: string;
  pictures?: {
    sizes: Array<{
      link: string;
      width: number;
      height: number;
    }>;
  };
  duration: number;
  created_time: string;
  accessLevel?: number;
}

export default function KarmaPage() {
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
        // Find a public video or karma-related video
        const publicVid = result.videos.find((video: Video) => 
          video.name.toLowerCase().includes('public') || 
          video.name.toLowerCase().includes('karma') ||
          video.name.toLowerCase().includes('nivel') ||
          video.description?.toLowerCase().includes('public') ||
          video.description?.toLowerCase().includes('karma')
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
    <div className="carisma-page">
      <main className="carisma-main">
        <section className="carisma-hero">
          <div className="carisma-hero-content">
            <h1 className="carisma-title">NIVEL</h1>
            <h2 className="carisma-subtitle">KARMA</h2>
          </div>
        </section>

        <section className="carisma-benefits">
          <div className="carisma-benefits-container">
            <ul className="carisma-benefits-list">
              <li className="carisma-benefit-item">
                <Image src="/img/check.png" alt="Check" className="benefit-icon" width={20} height={20} />
                <span className="benefit-text">El conocimiento más censurado</span>
              </li>
              <li className="carisma-benefit-item">
                <Image src="/img/check.png" alt="Check" className="benefit-icon" width={20} height={20} />
                <span className="benefit-text">Evite ser esclavo del mal</span>
              </li>
              <li className="carisma-benefit-item">
                <Image src="/img/check.png" alt="Check" className="benefit-icon" width={20} height={20} />
                <span className="benefit-text">Libere su siguiente vida</span>
              </li>
            </ul>
          </div>
        </section>

      </main>

      {/* Image Section - Outside main container for full width */}
      <section className="carisma-image-section">
        <div className="carisma-image-container">
          <Image 
            src="/fotos/karma.png" 
            alt="Carisma" 
            className="carisma-image"
            width={1000}
            height={600}
          />
        </div>
      </section>

      <main className="carisma-main">
        <section className="carisma-info-section">
          <div className="carisma-info-container">
            <h2 className="carisma-info-title">ADIÓS A LOS DEMONIOS, <br /> TRANCENDE LA MUERTE


            </h2>
            
            <div className="carisma-info-content">
              <p className="carisma-info-paragraph">
              El nivel KARMA borra las limitaciones del mundo físico y del mal para avanzar en lo espiritual. Podrá identificar los múltiples obstáculos que le impiden ser libre en mente y espíritu.

</p>
              
              <p className="carisma-info-paragraph">
              Descubrirá las manipulaciones en su propia personalidad, y podrá superarlas. Conocerá acciones concretas para elevar su salud, energía y conciencia. Verá el mundo y la historia real. También conocerá la realidad de la reencarnación, y las posibilidades que ofrece.              </p>
              
              <p className="carisma-info-paragraph">
                El nivel KARMA incluye:
              </p>
            </div>
          </div>
        </section>

        <section className="carisma-action-section">
          <div className="carisma-action-container">
            <h2 className="carisma-action-title">Todo el material y directos de CARISMA,</h2>
            
            <div className="carisma-content-list">
              <div className="carisma-content-item">
                <p className="content-description">
                4: INFLUENCIAS Y POSESIONES habituales, manipulaciones químicas y energéticas, afecciones extrañas del bienestar, campos psíquicos, distorsiones de la realidad individual y colectiva.
                </p>
              </div>
              
              <div className="carisma-content-item">
                <p className="content-description">
                5: REENCARNACIÓN Y KARMA memoria más allá de la muerte, avance rápido en el camino de la ascensión, trascendencia, disolución del alma, gestión del Karma, fortaleza mental, valores espirituales y materiales.
                </p>
              </div>
            </div>
            
            <p className="carisma-live-info">
              Directos online KARMA, 10 al año.
            </p>
            
            <p className="karma-renacer-text">
              Pasado 1 año, posibilidad de acceso al nivel del RENACER CONSCIENTE.
            </p>
          </div>
        </section>

        
        
        <section className="carisma-video-section">
          <div className="carisma-video-container">
            <div className={`video-player ${!publicVideo ? 'no-video' : ''}`} onClick={publicVideo ? openVideoModal : undefined}>
              {loading ? (
                <div className="video-loading">Cargando...</div>
              ) : error ? (
                <div className="video-error">
                  <p className="error-text">{error}</p>
                </div>
              ) : publicVideo && getVideoThumbnail() ? (
                <div className="video-thumbnail">
                  <Image
                    src={getVideoThumbnail()!}
                    alt={publicVideo.name}
                    fill
                    className="thumbnail-image"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="play-button">
                    <div className="play-icon"></div>
                  </div>
                </div>
              ) : (
                <div className="video-placeholder">
                  <div className="play-button">
                    <div className="play-icon"></div>
                  </div>
                  <p className="placeholder-text">Video no disponible</p>
                </div>
              )}
            </div>
            <h3 className="video-title">
            Presentación del Nivel KARMA
            </h3>
            <section className="carisma-button-section">
          <div className="carisma-button-container">
            <button className="carisma-action-button">
              Acceder
            </button>
          </div>
        </section>
            
          </div>
        </section>
        
       
      </main>

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
