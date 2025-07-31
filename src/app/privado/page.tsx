"use client"
import React, { useState } from "react";
import Image from "next/image";
import FooterSection from "../components/FooterSection";

export default function PrivadoPage() {
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        caseInfo: "",
        availability: "",
        paymentMethod: "",
        acceptTerms: false
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.acceptTerms && formData.email && formData.caseInfo && formData.availability && formData.paymentMethod) {
            setIsSubmitted(true);
            // Here you would typically send the data to your backend
            console.log('Form submitted:', formData);
        }
    };

    const toggleBookingForm = () => {
        setShowBookingForm(!showBookingForm);
        if (showBookingForm) {
            setIsSubmitted(false);
            setFormData({
                email: "",
                caseInfo: "",
                availability: "",
                paymentMethod: "",
                acceptTerms: false
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
 
                     <div className="privado-description">
                         <p>Reserve un encuentro personal privado para resolver todo tipo de dudas. Tendremos una conversación profunda enfocada en sus inquietudes, para aportar claridad.</p>
                         <p>Descubra las soluciones a sus bloqueos actuales, cualquiera que sea la naturaleza. Y examinaremos los posibles caminos para avanzar en las mejoras que desea obtener.</p>
                     </div>
 
                     <div className="privado-features">
                         <div className="privado-feature-item">
                             <div className="privado-check-icon">✓</div>
                             <span className="privado-feature-text">Atención exclusiva</span>
                         </div>
 
                         <div className="privado-feature-item">
                             <div className="privado-check-icon">✓</div>
                             <span className="privado-feature-text">Máxima privacidad</span>
                         </div>
 
                         <div className="privado-feature-item">
                             <div className="privado-check-icon">✓</div>
                             <span className="privado-feature-text">Identificar problemas y soluciones</span>
                         </div>
                     </div>
                 </div>
             </section>

             <div className="privado-image-container">
                                 <Image
                     src="/fotos/armchair.jpg"
                     alt="Armchair - Encuentro Privado"
                     width={600}
                     height={450}
                     className="privado-image"
                     priority
                 />
            </div>
 
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
                     <div className="privado-video-player">
                         <div className="privado-play-button">
                             <div className="privado-play-icon">▶</div>
                         </div>
                     </div>
                     <h3 className="privado-video-title">Presentación del Encuentro privado</h3>
                     <button 
                         className="privado-cta-button"
                         onClick={toggleBookingForm}
                     >
                         Reservar el Encuentro
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

            <FooterSection />
        </div>
    );
}
