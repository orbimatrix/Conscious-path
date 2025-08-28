"use client"
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import FooterSection from "../components/FooterSection";
import SignupModal from "../components/SignupModal";
import { useAuth } from "@/lib/auth";
import { VimeoVideo } from "../types/vimeo";

export default function PrivadoPage() {
    const { user, isLoaded, isAuthenticated, showSignupModal, requireAuth, closeSignupModal } = useAuth();
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        caseInfo: "",
        availability: "",
        paymentMethod: "",
        acceptTerms: false,
        paymentAmount: "$75" // Default price for private session
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    // Video state
    const [videos, setVideos] = useState<VimeoVideo[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<VimeoVideo | null>(null);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [videoLoading, setVideoLoading] = useState(false);

    // Fetch videos with "privado public" tag
    const fetchVideos = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch('/api/vimeo/videos?search=privado public');
            const data = await response.json();
            
            if (data.success) {
                setVideos(data.videos || []);
                if (data.videos && data.videos.length === 0) {
                    setError('No se encontraron videos de Encuentro Privado. Intenta con otros términos de búsqueda.');
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
        <div className="privado-page">
            {/* Top Banner Section */}
            <section className="privado-banner">
                <div className="privado-banner-content">
                    <h3 className="privado-banner-subtitle">ASISTENCIA PERSONAL</h3>
                    <h1 className="privado-banner-title">ENCUENTRO PRIVADO ONLINE</h1>
                </div>
            </section>

            {/* Main Content Section */}
            <section className="privado-content">
                <div className="privado-content-wrapper">
                    <h2 className="privado-content-title">
                        ENTREVISTA PERSONAL CON TODO DETALLE
                    </h2>

                    <div className="privado-features-container">
                        <div className="privado-features">
                            <div className="privado-feature-item">
                                <Image src="/img/check.png" alt="Check" className="privado-check-icon" width={20} height={20} />
                                <span className="privado-feature-text">Atención exclusiva</span>
                            </div>

                            <div className="privado-feature-item">
                                <Image src="/img/check.png" alt="Check" className="privado-check-icon" width={20} height={20} />
                                <span className="privado-feature-text">Máxima privacidad</span>
                            </div>

                            <div className="privado-feature-item">
                                <Image src="/img/check.png" alt="Check" className="privado-check-icon" width={20} height={20} />
                                <span className="privado-feature-text">Identificar problemas y soluciones</span>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </section>

            <div className="privado-image-container">
                <Image
                    src="/fotos/armchair.jpg"
                    alt="Armchair - Encuentro Privado"
                    width={800}
                    height={450}
                    className="privado-image"
                    priority
                />
            </div>

            {/* Additional Content Section */}
            <section className="privado-additional-content">
                <div className="privado-additional-wrapper">
                    <p>Reserve un encuentro personal privado para resolver todo tipo de dudas. Tendremos una conversación profunda enfocada en sus inquietudes, para aportar claridad.</p>
                    <p>Descubra las soluciones a sus bloqueos actuales, cualquiera que sea la naturaleza. Y examinaremos los posibles caminos para avanzar en las mejoras que desea obtener.</p>
                </div>
            </section>

            {/* Middle Highlight Section */}
            <section className="privado-highlight">
                <div className="privado-highlight-content">
                    <p>Entorno de máxima discreción, en función de sus necesidades.</p>
                    <p>Trato personal, con calma y atención.</p>
                    <p>Orientación en todo tipo de temáticas.</p>
                </div>
            </section>

            {/* Video and CTA Section */}
            <section className="privado-video-section">
                <div className="privado-video-container">
                    {loading ? (
                        <div className="privado-video-player loading">
                            <div className="loading-spinner"></div>
                            <p>Buscando videos de Encuentro Privado...</p>
                        </div>
                    ) : error ? (
                        <div className="privado-video-player error">
                            <p>Error al cargar videos: {error}</p>
                            <button onClick={fetchVideos} className="retry-button">Reintentar</button>
                        </div>
                    ) : videos.length > 0 ? (
                        <div 
                            className="privado-video-player" 
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
                                    <div className="privado-play-button">
                                        <div className="privado-play-icon">▶</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="privado-video-player placeholder">
                            <div className="privado-play-button">
                                <div className="privado-play-icon">▶</div>
                            </div>
                            <p>No hay videos disponibles</p>
                            <button onClick={fetchVideos} className="retry-button">Buscar videos</button>
                        </div>
                    )}
                    <h3 className="privado-video-title">Presentación del Encuentro privado</h3>
                    
                    {/* Authentication Status */}
                    {!isAuthenticated && (
                        <div className="auth-notice">
                            <p>⚠️ Haz clic en el botón para iniciar sesión o registrarte</p>
                        </div>
                    )}
                    
                    <button
                        className="privado-cta-button"
                        onClick={toggleBookingForm}
                    >
                        {isAuthenticated ? 'Reservar el Encuentro' : 'Inicia sesión para reservar'}
                    </button>
                </div>
            </section>

            {/* Booking Form Section */}
            {showBookingForm && (
                <section className="booking-form-section">
                    <div className="booking-form-container">
                        <div className="booking-form-header">
                            <h3 className="booking-form-title">La tarifa para Encuentro Privado es:</h3>
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
                                        Escriba que dias y horas tiene disponibles para realizar la sesión. Será necesario que disponga de silencio sin interrupciones. Escriba su forma preferida de pago.
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
                    message="Necesitas iniciar sesión para acceder a la función de reserva de encuentro privado."
                  />
    </div>
  );
}
