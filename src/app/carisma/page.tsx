"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import FooterSection from "../components/FooterSection";
import "./carisma.css";

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
  accessLevel?: number; // Added for filtering
}

export default function CarismaPage() {
  const [publicVideo, setPublicVideo] = useState<Video | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
        // Find a public video or carisma-related video
        const publicVid = result.videos.find((video: Video) => 
          video.name.toLowerCase().includes('public') || 
          video.name.toLowerCase().includes('carisma') ||
          video.name.toLowerCase().includes('nivel')
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
            <h2 className="carisma-subtitle">CARISMA</h2>
          </div>
        </section>

        <section className="carisma-benefits">
          <div className="carisma-benefits-container">
            <ul className="carisma-benefits-list">
              <li className="carisma-benefit-item">
                <Image src="/img/check.png" alt="Check" className="benefit-icon" width={20} height={20} />
                <span className="benefit-text">Siempre bien informado</span>
              </li>
              <li className="carisma-benefit-item">
                <Image src="/img/check.png" alt="Check" className="benefit-icon" width={20} height={20} />
                <span className="benefit-text">Viva d forma abundante</span>
              </li>
              <li className="carisma-benefit-item">
                <Image src="/img/check.png" alt="Check" className="benefit-icon" width={20} height={20} />
                <span className="benefit-text">Bienestar y energía vital</span>
              </li>
            </ul>
          </div>
        </section>

      </main>

      {/* Image Section - Outside main container for full width */}
      <section className="carisma-image-section">
        <div className="carisma-image-container">
          <Image
            src="/fotos/carisma.jpg"
            alt="Carisma"
            className="carisma-image"
            width={800}
            height={600}
          />
        </div>
      </section>

      <main className="carisma-main">
        <section className="carisma-info-section">
          <div className="carisma-info-container">
            <h2 className="carisma-info-title">INFORMACIÓN, ABUNDANCIA Y SALUD</h2>

            <div className="carisma-info-content">
              <p className="carisma-info-paragraph">
                El nivel CARISMA ofrece acceso a toda la información necesaria para conseguir un sólido avance en la vida. Logrará la capacidad de analizar y valorar aspectos que otras personas no pueden ni imaginar.
              </p>

              <p className="carisma-info-paragraph">
                Analizamos cuestiones que muchas veces están censuradas en la vida pública, desde puntos de vista reales y prácticos. Y comprenderá la distribución real de poder en nuestro entorno.
              </p>

              <p className="carisma-info-paragraph">
                El nivel CARISMA incluye:
              </p>
            </div>
          </div>
        </section>

        <section className="carisma-action-section">
          <div className="carisma-action-container">
            <h2 className="carisma-action-title">Audios y Vídeos privados de:</h2>

            <div className="carisma-content-list">
              <div className="carisma-content-item">
                <p className="content-description">
                1: ACTUALIDAD geopolítica, ciencia oficial y oculta, noticias, bulos y manipulaciones, estudios varios.
                </p>
              </div>

              <div className="carisma-content-item">
                <p className="content-description">
                2: ABUNDANCIA formas de lograrla y conservarla, metafísica aplicada, mentalidad abundante, tendencias y previsiones, ejemplos.
                </p>
              </div>

              <div className="carisma-content-item">
                <p className="content-description">
                3: BIENESTAR físico y emocional, señales de la vida, conflictos y malestares, recurrencia, problemas heredados, conocimientos antiguos y alternativos.
                </p>
              </div>

              <p className="carisma-live-info">
                Directos online mensuales, 10 al año.
              </p>
            </div>
          </div>
        </section>

        <section className="carisma-button-section">
          <div className="carisma-button-container">
            <button className="carisma-action-button" onClick={() => router.push('/acceder')}>
              Acceder
            </button>
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
            Presentación del Nivel Carisma
            </h3>
            <button 
              className="video-cta-button"
              onClick={() => router.push('/karma')}
            >
              VER EL NIVEL SUPERIOR KARMA
            </button>
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
