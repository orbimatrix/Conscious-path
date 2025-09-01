"use client"
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import FooterSection from "../components/FooterSection";
import SignupModal from "../components/SignupModal";
import { useAuth } from "@/lib/auth";
import { VimeoVideo } from "../types/vimeo";
import "./bienestar.css";

export default function BienestarPage() {
  const { user, isLoaded, isAuthenticated, showSignupModal, requireAuth, closeSignupModal } = useAuth();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    caseInfo: "",
    availability: "",
    paymentMethod: "",
    acceptTerms: false,
    paymentAmount: "$250" // Default price for bienestar integral session
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Video state
  const [videos, setVideos] = useState<VimeoVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VimeoVideo | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);

  // Fetch videos with "bienestar public" tag
  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/vimeo/videos?search=bienestar public');
      const data = await response.json();
      
      if (data.success) {
        setVideos(data.videos || []);
        if (data.videos && data.videos.length === 0) {
          setError('No se encontraron videos de Bienestar Integral. Intenta con otros términos de búsqueda.');
        }
      } else {
        setError(data.error || 'Error al buscar videos');
      }
    } catch {
      setError('Error de red al buscar videos');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch videos on component mount
  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleVideoClick = (video: VimeoVideo) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
    setVideoLoading(true);
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
    setSelectedVideo(null);
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showVideoModal) {
        closeVideoModal();
      }
    };

    if (showVideoModal) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      // Focus the close button for accessibility
      setTimeout(() => {
        const closeButton = document.querySelector('.video-modal-close') as HTMLButtonElement;
        if (closeButton) closeButton.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showVideoModal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.acceptTerms && formData.email && formData.caseInfo && formData.availability && formData.paymentMethod) {
      try {
        // First, submit the form data to our booking API
        const formResponse = await fetch('/api/booking-form', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!formResponse.ok) {
          throw new Error('Failed to submit form');
        }

        // Then, redirect to Stripe checkout with form data
        const checkoutResponse = await fetch('/api/checkout_sessions/bienestar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!checkoutResponse.ok) {
          throw new Error('Failed to create checkout session');
        }

        // Redirect to Stripe checkout
        const checkoutData = await checkoutResponse.json();
        if (checkoutData.url) {
          window.location.href = checkoutData.url;
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Error submitting form. Please try again.');
      }
    }
  };

  const toggleBookingForm = () => {
    // Toggle the booking form regardless of authentication status
    setShowBookingForm(!showBookingForm);
    if (showBookingForm) {
      setIsSubmitted(false);
      setFormData({
        email: "",
        caseInfo: "",
        availability: "",
        paymentMethod: "",
        acceptTerms: false,
        paymentAmount: "$250"
      });
    }
  };



  return (
    <div className="bienestar-page">
      {/* Header Banner - Outside main container for full width */}
      <section className="bienestar-hero">
        <div className="bienestar-hero-content">
          <h1 className="bienestar-title">ASISTENCIA PERSONAL</h1>
          <h2 className="bienestar-subtitle">SESIÓN DE BIENESTAR INTEGRAL</h2>
        </div>
      </section>

      <main className="bienestar-main">
        {/* Main Content Section */}
        <section className="bienestar-content">
          <div className="bienestar-content-container">
            <h2 className="bienestar-content-title">
              RESOLVER LOS PROBLEMAS DEL CUERPO-ALMA
            </h2>

            {/* Benefits List */}
            <section className="bienestar-benefits">
              <div className="bienestar-benefits-container">
                <div className="bienestar-benefits-wrapper">
                  <ul className="bienestar-benefits-list">
                    <li className="bienestar-benefit-item">
                      <Image src="/img/check.png" alt="Check" className="benefit-icon" width={20} height={20} />
                      <span className="benefit-text">Eficaz solución a problemas repetitivos</span>
                    </li>
                    <li className="bienestar-benefit-item">
                      <Image src="/img/check.png" alt="Check" className="benefit-icon" width={20} height={20} />
                      <span className="benefit-text">Experiencia y métodos probados</span>
                    </li>
                    <li className="bienestar-benefit-item">
                      <Image src="/img/check.png" alt="Check" className="benefit-icon" width={20} height={20} />
                      <span className="benefit-text">Mucho más que una charla</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

          </div>
        </section>
      </main>

      {/* Image Section - Outside main container for full width */}
      <section className="bienestar-image-section">
        <div className="bienestar-image-container">
          <Image
            src="/fotos/karma.jpg"
            alt="Two women in silhouette against sunset"
            className="bienestar-image"
            width={800}
            height={600}
          />
        </div>
      </section>

      {/* Introduction Paragraph */}
      <section className="bienestar-intro">
        <div className="bienestar-intro-container">
          <p className="bienestar-intro-text">
            Completa consulta personal, organizada para ahorrar tiempo y asegurar los resultados. Nos enfocamos en resolver conflictos recurrentes y sus manifestaciones físicas. Se puede realizar en presencial y online.
          </p>
        </div>
      </section>

      {/* 4-Step Process */}
      <section className="bienestar-process">
        <div className="bienestar-process-container">
          <h3 className="process-title">Consista de 4 pasos:</h3>
          <ol className="process-steps">
            <li className="process-step">
              1) Recopilar la información necesaria, con una guía precisa. Le indicamos los puntos a completar, y si lo necesita le ayudamos personalmente.
            </li>
            <li className="process-step">
              2) Sin presencia del cliente, estudiamos toda la información, e investigamos los eventos y significados. Con este paso garantizamos conocer todos los aspectos que le pueden afectar, al tiempo que ahorramos mucho tiempo para el consultante.
            </li>
            <li className="process-step">
              3) La sesión presencial u online, de duración de 1 a 2 horas. Ya con el estudio completo preparado, conseguimos los objetivos fijados, de forma rápida y efectiva.
            </li>
            <li className="process-step">
              4) Llamada posterior para verificar la eficacia de la sesión y sus resultados. Si fuera necesario, se realiza una sesión adicional, para asegurar el resultado.
            </li>
          </ol>
        </div>
      </section>

      {/* Additional Benefits Section - Outside main for full width */}
      <section className="bienestar-additional-benefits">
        <div className="bienestar-additional-benefits-container">
          <ul className="additional-benefits-list">
            <li className="additional-benefit-item">
              Aseguramos un servicio de máxima eficacia, mejor que simples sesiones improvisadas.
            </li>
            <li className="additional-benefit-item">
              Ahorramos tiempo y esfuerzo al consultante.
            </li>
            <li className="additional-benefit-item">
              Es habitual que se resuelvan varios problemas al mismo tiempo.
            </li>
            <li className="additional-benefit-item">
              Se le guiará paso a paso en todo el proceso.
            </li>
          </ul>
        </div>
      </section>

      {/* Video Presentation Section - Outside main for full width */}
      <section className="bienestar-video-section">
        <div className="bienestar-video-container">
          {loading ? (
            <div className="video-player loading">
              <div className="loading-spinner"></div>
              <p>Buscando videos de Bienestar Integral...</p>
            </div>
          ) : error ? (
            <div className="video-player error">
              <p>Error al cargar videos: {error}</p>
              <button onClick={fetchVideos} className="retry-button">Reintentar</button>
            </div>
          ) : videos.length > 0 ? (
            <div 
              className="video-player" 
              onClick={() => handleVideoClick(videos[0])}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleVideoClick(videos[0]);
                }
              }}
              aria-label={`Reproducir video: ${videos[0].name}`}
            >
              <div className="video-thumbnail">
                <Image 
                  src={videos[0].pictures?.sizes?.[3]?.link || videos[0].pictures?.sizes?.[0]?.link || '/img/check.png'} 
                  alt={videos[0].name}
                  fill
                  className="thumbnail-image"
                  sizes="(max-width: 768px) 100vw, 600px"
                  onError={(e) => {
                    // Fallback to a default image if Vimeo thumbnail fails
                    const target = e.target as HTMLImageElement;
                    target.src = '/img/check.png';
                  }}
                />
                <div className="play-overlay">
                  <div className="play-button">
                    <div className="play-icon"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="video-player placeholder">
              <div className="play-button">
                <div className="play-icon"></div>
              </div>
              <p>No hay videos disponibles</p>
              <button onClick={fetchVideos} className="retry-button">Buscar videos</button>
            </div>
          )}
          <h3 className="video-title">
            Presentación de la sesión de bienestar integral
          </h3>
          
          {/* Authentication Status */}
          {!isAuthenticated && (
            <div className="auth-notice">
              <p>⚠️ Haz clic en el botón para iniciar sesión o registrarte</p>
            </div>
          )}
          
          <button
            className="booking-button"
            onClick={toggleBookingForm}
          >
            Inicia sesión para reservar
          </button>
        </div>
      </section>

      {/* Booking Form Section */}
      {showBookingForm && (
        <section className="booking-form-section">
          <div className="booking-form-container">
            <div className="booking-form-header">
              <h3 className="booking-form-title">La tarifa por Bienestar integral es:</h3>
              <div className="booking-form-price">250 $</div>
              <p className="booking-form-instruction">
                LEA Y COMPLETE LOS SIGUIENTES CAMPOS PARA RESERVAR SU CONSULTA.
              </p>
            </div>
            {!isSubmitted ? (
              <form className="booking-form" onSubmit={handleSubmit}>
                <div className="booking-form-section-group">
                  <ul className="booking-form-terms-list">
                    <li>Entiendo que mis datos serán usados y almacenados para realizar el servicio solicitado.</li>
                    <li>Una vez revisado su mensaje, le contestaremos con detalles sobre la disponibilidad y forma de pago.</li>
                  </ul>
                  <div className="booking-form-checkbox-group">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                      className="booking-form-checkbox"
                      required
                    />
                    <label htmlFor="acceptTerms" className="booking-form-checkbox-label">
                      Acepto estos términos
                    </label>
                  </div>
                </div>
                <div className="booking-form-section-group">
                  <label htmlFor="email" className="booking-form-label">
                    Email de contacto:
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="booking-form-input"
                    required
                  />
                </div>
                <div className="booking-form-section-group">
                  <h4 className="booking-form-section-title">COMPLETAR INFORMACIÓN</h4>
                  <p className="booking-form-instruction-text">
                    Escriba con detalle la razón de su consulta, lo que le afecta, y desde cuando le sucede. Si dispone de un diagnóstico médico, también es recomendable incluirlo.
                  </p>
                  <label htmlFor="caseInfo" className="booking-form-label">
                    Información de mi caso:
                  </label>
                  <textarea
                    id="caseInfo"
                    name="caseInfo"
                    value={formData.caseInfo}
                    onChange={handleInputChange}
                    className="booking-form-textarea"
                    rows={6}
                    required
                  />
                </div>
                <div className="booking-form-section-group">
                  <h4 className="booking-form-section-title">CALENDARIO Y PAGO</h4>
                  <p className="booking-form-instruction-text">
                    Escriba que días y horas tiene disponibles para realizar la sesión. Será necesario que disponga de silencio sin interrupciones. Escriba su forma preferida de pago.
                  </p>
                  <label htmlFor="availability" className="booking-form-label">
                    Disponibilidad:
                  </label>
                  <textarea
                    id="availability"
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className="booking-form-textarea"
                    rows={4}
                    required
                  />
                  <label htmlFor="paymentMethod" className="booking-form-label">
                    Forma de pago:
                  </label>
                  <textarea
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="booking-form-textarea"
                    rows={4}
                    required
                  />
                </div>
                <button type="submit" className="booking-form-submit-button">
                  ENVIAR MI SOLICITUD
                </button>
              </form>
            ) : (
              <div className="booking-form-success">
                <p className="booking-form-success-message">
                  SU SOLICITUD HA SIDO ENVIADA. RECIBIRÁ UN MENSAJE CON LAS INSTRUCCIONES A SEGUIR.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Video Modal */}
      {showVideoModal && selectedVideo && (
        <div 
          className="video-modal-overlay" 
          onClick={closeVideoModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="video-modal-title"
        >
          <div className="video-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="video-modal-close" 
              onClick={closeVideoModal}
              aria-label="Cerrar video"
            >
              ×
            </button>
            <div className="video-modal-content">
              <h3 id="video-modal-title" className="video-modal-title">{selectedVideo.name}</h3>
              <div className="video-modal-player">
                {videoLoading && (
                  <div className="video-loading">
                    <div className="loading-spinner"></div>
                    <p>Cargando video...</p>
                  </div>
                )}
                {error && !videoLoading && (
                  <div className="video-error">
                    <p>Error al cargar el video</p>
                    <button onClick={() => {
                      setError(null);
                      setVideoLoading(true);
                    }} className="retry-button">
                      Reintentar
                    </button>
                  </div>
                )}
                <iframe
                  src={`https://player.vimeo.com/video/${selectedVideo.uri.split('/').pop() || '0'}?h=auto&autoplay=1`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="video-iframe"
                  title={`Video: ${selectedVideo.name}`}
                  onLoad={() => setVideoLoading(false)}
                  onError={() => {
                    setVideoLoading(false);
                    setError('Error al cargar el video');
                  }}
                  style={{ display: videoLoading || error ? 'none' : 'block' }}
                ></iframe>
              </div>
              {selectedVideo.description && (
                <div className="video-modal-description">
                  <p>{selectedVideo.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <FooterSection />

      {/* Signup Modal */}
      <SignupModal
        isOpen={showSignupModal}
        onClose={closeSignupModal}
        title="Inicia sesión para continuar"
        message="Necesitas iniciar sesión para acceder a la función de reserva de sesiones de bienestar."
      />
    </div>
  );
}
