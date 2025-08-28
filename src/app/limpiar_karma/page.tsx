"use client"
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import FooterSection from "../components/FooterSection";
import SignupModal from "../components/SignupModal";
import { useAuth } from "@/lib/auth";
import { VimeoVideo } from "../types/vimeo";
import "./limpiar_karma.css";

export default function LimpiarKarmaPage() {
  const { user, isLoaded, isAuthenticated, showSignupModal, requireAuth, closeSignupModal } = useAuth();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    caseInfo: "",
    availability: "",
    paymentMethod: "",
    acceptTerms: false,
    paymentAmount: "$75" // Default price for karma cleaning session
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Video state
  const [videos, setVideos] = useState<VimeoVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VimeoVideo | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);

  // Fetch videos with "limpiar karma" tag
  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/vimeo/videos?search=limpiar karma public');
      const data = await response.json();
      
      if (data.success) {
        setVideos(data.videos || []);
        if (data.videos && data.videos.length === 0) {
          setError('No se encontraron videos de Limpiar Karma. Intenta con otros términos de búsqueda.');
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
    
    // Check authentication before submitting
    if (!requireAuth()) {
      return;
    }
    
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
        const checkoutResponse = await fetch('/api/checkout_sessions', {
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
    // If not authenticated, show signup modal instead
    if (!isAuthenticated) {
      // This will automatically show the signup modal via requireAuth()
      requireAuth();
      return;
    }
    
    // If authenticated, toggle the booking form
    setShowBookingForm(!showBookingForm);
    if (showBookingForm) {
      setIsSubmitted(false);
      setFormData({
        email: "",
        caseInfo: "",
        availability: "",
        paymentMethod: "",
        acceptTerms: false,
        paymentAmount: "$75"
      });
    }
  };



  return (
    <div className="limpiar-karma-page">
      <main className="limpiar-karma-main">
        <section className="limpiar-karma-hero">
          <div className="limpiar-karma-hero-content">
            <h3 className="limpiar-karma-category">ASISTENCIA PERSONAL</h3>
            <h1 className="limpiar-karma-title">SESIÓN</h1>
            <h2 className="limpiar-karma-subtitle">LIMPIAR KARMA</h2>
          </div>
        </section>

        <section className="limpiar-karma-benefits">
          <div className="limpiar-karma-benefits-container">
            <h2 className="limpiar-karma-benefits-title">LIBERE LAS CARGAS DE SU ALMA</h2>
            <ul className="limpiar-karma-benefits-list">
              <li className="limpiar-karma-benefit-item">
                <Image src="/img/check.png" alt="Check" className="benefit-icon" width={20} height={20} />
                <span className="benefit-text">Corte los lazos de la culpabilidad</span>
              </li>
              <li className="limpiar-karma-benefit-item">
                <Image src="/img/check.png" alt="Check" className="benefit-icon" width={20} height={20} />
                <span className="benefit-text">Tenga una vida más consciente y plena</span>
              </li>
              <li className="limpiar-karma-benefit-item">
                <Image src="/img/check.png" alt="Check" className="benefit-icon" width={20} height={20} />
                <span className="benefit-text">Asegure una buena reencarnación</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="limpiar-karma-image-section">
          <div className="limpiar-karma-image-container">
            <Image 
              src="/fotos/limpiar.jpg" 
              alt="Limpiar Karma" 
              className="limpiar-karma-image"
              width={1000}
              height={600}
            />
          </div>
        </section>

        <section className="limpiar-karma-info-section">
          <div className="limpiar-karma-info-container">
            
            <div className="limpiar-karma-info-content">
              <p className="limpiar-karma-info-paragraph">
              Sesiones personales en las que eliminamos todos los viejos conflictos arrastrados durante la existencia del alma. Permite mayor paz interior, mejores relaciones, claridad mental, menos obstáculos, y más sabiduría.
              </p>
              
              <p className="limpiar-karma-info-paragraph">

              Ayuda a romper los ciclos negativos, empoderar a uno mismo, y a disfrutar de las bendiciones de la vida. Además evita el peligro de la disolución del alma por caer en ciclos que no aportan nada al espíritu.
              </p>
              
              
            </div>
          </div>
        </section>

        <section className="limpiar-karma-following-section">
          <div className="limpiar-karma-following-container">
            
            <div className="limpiar-karma-following-content">
              <p className="limpiar-karma-following-paragraph">
              Trabajo imprescindible en el camino para la ascención espiritual.
              </p>
              
              <p className="limpiar-karma-following-paragraph">
              Horario ideal para usted.
              </p>
              
              <p className="limpiar-karma-following-paragraph">
              Siempre un futuro más positivo.
              </p>
            </div>
          </div>
        </section>


        <section className="limpiar-karma-video-section">
          <div className="limpiar-karma-video-container">
            {loading ? (
              <div className="video-player loading">
                <div className="loading-spinner"></div>
                <p>Buscando videos de Limpiar Karma...</p>
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
            <h3 className="video-title">Presentación de las sesiones Limpiar Karma</h3>
            
            {/* Authentication Status */}
            {!isAuthenticated && (
              <div className="auth-notice">
                <p>⚠️ Haz clic en el botón para iniciar sesión o registrarte</p>
              </div>
            )}
            
            <section className="limpiar-karma-button-section">
              <div className="limpiar-karma-button-container">
                <button 
                  className="limpiar-karma-action-button"
                  onClick={toggleBookingForm}
                >
                  {isAuthenticated ? 'Reservar Sesion Limpiar Karma' : 'Inicia sesión para reservar'}
                </button>
              </div>
            </section>
          </div>
        </section>

        {/* Booking Form Section */}
        {showBookingForm && (
          <section className="booking-form-section">
            <div className="booking-form-container">
              <div className="booking-form-header">
                <h3 className="booking-form-title">La tarifa por Bienestar Integral es:</h3>
                <div className="booking-form-price">75 $</div>
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
      </main>

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
        message="Necesitas iniciar sesión para acceder a la función de reserva de sesión Limpiar Karma."
      />
    </div>
  );
}
