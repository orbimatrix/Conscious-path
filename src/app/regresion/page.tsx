"use client"
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import FooterSection from '../components/FooterSection';
import SignupModal from '../components/SignupModal';
import { useAuth } from '@/lib/auth';
import { VimeoVideo } from '../types/vimeo';

export default function RegresionPage() {
  const { user, isLoaded, isAuthenticated, showSignupModal, requireAuth, closeSignupModal } = useAuth();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    caseInfo: "",
    availability: "",
    paymentMethod: "",
    acceptTerms: false,
    paymentAmount: "$100" // Default price for regression session
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Video state
  const [videos, setVideos] = useState<VimeoVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VimeoVideo | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);

  // Fetch videos with "regresion public" tag
  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/vimeo/videos?search=regresion public');
      const data = await response.json();
      
      if (data.success) {
        setVideos(data.videos || []);
        if (data.videos && data.videos.length === 0) {
          setError('No se encontraron videos de Regresión Origen. Intenta con otros términos de búsqueda.');
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
        const checkoutResponse = await fetch('/api/checkout_sessions/regresion', {
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
        paymentAmount: "$100"
      });
    }
  };



  return (
    <div className={styles.container}>
      {/* Banner Section */}
      <div className={styles.bannerSection}>
        <div className={styles.bannerContainer}>
          <div className={styles.bannerContent}>
            <p className={styles.infoText}>
              ASISTENCIA PERSONAL
            </p>
            <h1 className={styles.bannerTitle}>
              REGRESIÓN ORIGEN
            </h1>
          </div>
        </div>
      </div>

      {/* New Section with Checkmarks */}
      <div className={styles.checkmarkSection}>
        <div className={styles.checkmarkContainer}>
          <h2 className={styles.checkmarkTitle}>
            DESCUBRIR LOS SECRETOS DE LAS VIDAS <br/>PASADAS
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className={styles.checkmarkList}>
              <div className={styles.checkmarkItem}>
                <Image src="/img/check.png" alt="Check" className={styles.checkmarkIcon} width={20} height={20} />
                <span className={styles.checkmarkText}>Sanación emocional</span>
              </div>
              <div className={styles.checkmarkItem}>
                <Image src="/img/check.png" alt="Check" className={styles.checkmarkIcon} width={20} height={20} />
                <span className={`${styles.checkmarkText} ${styles.longText}`}>
                  Comprensión de patrones repetitivos<br />
                  y de relaciones
                </span>
              </div>
              <div className={styles.checkmarkItem}>
                <Image src="/img/check.png" alt="Check" className={styles.checkmarkIcon} width={20} height={20} />
                <span className={styles.checkmarkText}>Reducir miedo a la muerte</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className={styles.imageSectionFullWidth}>
        <div className={styles.imageContainer}>
          <Image 
            src="/fotos/reflection.jpg" 
            alt="Reflection - Regresión de Origen"
            width={800}
            height={600}
            className={styles.reflectionImage}
            priority
          />
        </div>
      </div>

      {/* Content Section */}
      <div className={styles.contentSection}>
        <div className={styles.contentContainer}>
          <div className={styles.prose}>
            <h2 className={styles.sectionTitle}>
              La regresión a vidas pasadas se usa para conocer las ataduras que trae nuestra alma, y así conocernos y liberarnos.
            </h2>
            
            <h3 className={styles.subsectionTitle}>
              Se usa principalmente en 3 casos:
            </h3>
            
            <ol className={styles.numberedList}>
              <li className={styles.listItem}>
                Exploratorio, para ganar saber más sobre la propia naturaleza, los orígenes, historias del pasado, etc.
              </li>
              <li className={styles.listItem}>
                Medio para el bienestar, identificando bloqueos que no responden a eventos de esta vida, y que nos causan molestias.
              </li>
              <li className={styles.listItem}>
                Preparación para la siguiente reencarnación. Si bien no es obligado, sí ayuda en muchos casos a liberar ataduras tóxicas, y también a preparar la mente para ese paso con mayor consciencia.
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* Service Information Section */}
      <div className={styles.serviceSection}>
        <div className={styles.serviceContainer}>
          <div className={styles.serviceContent}>
            <p className={styles.serviceParagraph}>
              Aseguramos un servicio de máxima eficacia, dentro de la atención integral.
            </p>
            <p className={styles.serviceParagraph}>
              Esta sesión no necesita preparación previa cuando es exploratoria y de conocimiento.
            </p>
            <p className={styles.serviceParagraph}>
              Si quiere encontrar el origen de un problema concreto, le solicitaremos información previa, para conseguir el mejor resultado.
            </p>
            <p className={styles.serviceParagraph}>
              Se le guiará paso a paso en todo el proceso.
            </p>
          </div>
        </div>
      </div>
      
      {/* Video Section */}
      <div className={styles.videoSection}>
        <div className={styles.videoContainer}>
          {loading ? (
            <div className={`${styles.videoPlaceholder} ${styles.loading}`}>
              <div className={styles.loadingSpinner}></div>
              <p>Buscando videos de Regresión Origen...</p>
            </div>
          ) : error ? (
            <div className={`${styles.videoPlaceholder} ${styles.error}`}>
              <p>Error al cargar videos: {error}</p>
              <button onClick={fetchVideos} className={styles.retryButton}>Reintentar</button>
            </div>
          ) : videos.length > 0 ? (
            <div 
              className={styles.videoPlaceholder} 
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
              <div className={styles.videoThumbnail}>
                <Image 
                  src={videos[0].pictures?.sizes?.[3]?.link || videos[0].pictures?.sizes?.[0]?.link || '/img/check.png'} 
                  alt={videos[0].name}
                  fill
                  className={styles.thumbnailImage}
                  sizes="(max-width: 768px) 100vw, 600px"
                  onError={(e) => {
                    // Fallback to a default image if Vimeo thumbnail fails
                    const target = e.target as HTMLImageElement;
                    target.src = '/img/check.png';
                  }}
                />
                <div className={styles.playOverlay}>
                  <div className={styles.playButton}>
                    <div className={styles.playIcon}></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`${styles.videoPlaceholder} ${styles.placeholder}`}>
              <div className={styles.playButton}>
                <div className={styles.playIcon}></div>
              </div>
              <p>No hay videos disponibles</p>
              <button onClick={fetchVideos} className={styles.retryButton}>Buscar videos</button>
            </div>
          )}
          
          {/* Title */}
          <h2 className={styles.videoTitle}>
            Presentación de Regresión Origen
          </h2>
          
          {/* Authentication Status */}
          {!isAuthenticated && (
            <div className={styles.authNotice}>
              <p>⚠️ Haz clic en el botón para iniciar sesión o registrarte</p>
            </div>
          )}
          
          {/* Booking Button */}
          <button 
            className={styles.bookingButton}
            onClick={toggleBookingForm}
          >
            {isAuthenticated ? 'Reservar Regresión Origen' : 'Inicia sesión para reservar'}
          </button>
        </div>
      </div>

      {/* Booking Form Section */}
      {showBookingForm && (
        <section className={styles.bookingFormSection}>
          <div className={styles.bookingFormContainer}>
            <div className={styles.bookingFormHeader}>
              <h3 className={styles.bookingFormTitle}>La tarifa para sesión Regresión Origen es:</h3>
              <div className={styles.bookingFormPrice}>100 $</div>
              <p className={styles.bookingFormInstruction}>
                LEA Y COMPLETE LOS SIGUIENTES CAMPOS PARA RESERVAR SU CONSULTA
              </p>
            </div>

            {!isSubmitted ? (
              <form className={styles.bookingForm} onSubmit={handleSubmit}>
                <div className={styles.bookingFormSectionGroup}>
                  <ul className={styles.bookingFormTermsList}>
                    <li>Entiendo que mis datos serán usados y almacenados para realizar el servicio solicitado.</li>
                    <li>Una vez revisado su mensaje, le contestaremos con detalles sobre la disponibilidad y forma de pago.</li>
                  </ul>
                  <div className={styles.bookingFormCheckboxGroup}>
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                      className={styles.bookingFormCheckbox}
                      required
                    />
                    <label htmlFor="acceptTerms" className={styles.bookingFormCheckboxLabel}>
                      Acepto estos términos
                    </label>
                  </div>
                </div>

                <div className={styles.bookingFormSectionGroup}>
                  <label htmlFor="email" className={styles.bookingFormLabel}>
                    Email de contacto:
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={styles.bookingFormInput}
                    required
                  />
                </div>

                <div className={styles.bookingFormSectionGroup}>
                  <h4 className={styles.bookingFormSectionTitle}>COMPLETAR INFORMACIÓN</h4>
                  <p className={styles.bookingFormInstructionText}>
                    Escriba con detalle la razón de su consulta, lo que le afecta, y desde cuando le sucede. Si dispone de un diagnóstico médico, también es recomendable incluirlo.
                  </p>
                  <label htmlFor="caseInfo" className={styles.bookingFormLabel}>
                    Información de mi caso:
                  </label>
                  <textarea
                    id="caseInfo"
                    name="caseInfo"
                    value={formData.caseInfo}
                    onChange={handleInputChange}
                    className={styles.bookingFormTextarea}
                    rows={6}
                    required
                  />
                </div>

                <div className={styles.bookingFormSectionGroup}>
                  <h4 className={styles.bookingFormSectionTitle}>CALENDARIO Y PAGO</h4>
                  <p className={styles.bookingFormInstructionText}>
                    Escriba que días y horas tiene disponibles para realizar la sesión. Será necesario que disponga de silencio sin interrupciones. Escriba su forma preferida de pago.
                  </p>
                  <label htmlFor="availability" className={styles.bookingFormLabel}>
                    Disponibilidad:
                  </label>
                  <textarea
                    id="availability"
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className={styles.bookingFormTextarea}
                    rows={4}
                    required
                  />
                  <label htmlFor="paymentMethod" className={styles.bookingFormLabel}>
                    Forma de pago:
                  </label>
                  <textarea
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className={styles.bookingFormTextarea}
                    rows={4}
                    required
                  />
                </div>

                <button type="submit" className={styles.bookingFormSubmitButton}>
                  ENVIAR MI SOLICITUD
                </button>
              </form>
            ) : (
              <div className={styles.bookingFormSuccess}>
                <p className={styles.bookingFormSuccessMessage}>
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

      {/* Footer Section */}
      <FooterSection />

      {/* Signup Modal */}
      <SignupModal
        isOpen={showSignupModal}
        onClose={closeSignupModal}
        title="Inicia sesión para continuar"
        message="Necesitas iniciar sesión para acceder a la función de reserva de regresión origen."
      />
    </div>
  );
}
