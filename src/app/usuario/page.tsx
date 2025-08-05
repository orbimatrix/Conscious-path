'use client';

import React, { useState } from 'react';
import ContactSection from '../components/ContactSection';
import FooterSection from '../components/FooterSection';
import './usuario.css';

export default function UsuarioPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [currentTime, setCurrentTime] = useState('18:38:17');

    // Update time every second
    React.useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
            setCurrentTime(timeString);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="usuario-page">


            {/* Main Content */}
            <main className="usuario-main">
                {/* Profile Section */}
                <section className="usuario-profile-section">
                    {/* Left Column - Personal Information */}
                    <div className="usuario-info-container">
                        <div className="usuario-info">
                            <div className="usuario-info-item">
                                <span className="usuario-info-label">Nombre:</span>
                                <span className="usuario-info-value">Javier Manuel Navarro Fernandez</span>
                            </div>
                            <div className="usuario-info-item">
                                <span className="usuario-info-label">Fecha de nacimiento:</span>
                                <span className="usuario-info-value">17/9/1998</span>
                            </div>
                            <div className="usuario-info-item">
                                <span className="usuario-info-label">Ciudad:</span>
                                <span className="usuario-info-value">España</span>
                            </div>
                        </div>

                        <div className="usuario-time">
                            <span className="usuario-time-label">Time zone / Real time:</span>
                            <div className="usuario-time-display">{currentTime}</div>
                        </div>

                        <div className="usuario-contact">
                            <div className="usuario-info-item">
                                <span className="usuario-info-label">Email:</span>
                                <span className="usuario-info-value">javiernavarro@gmail.com</span>
                            </div>
                            <div className="usuario-info-item">
                                <span className="usuario-info-label">Telegram:</span>
                                <span className="usuario-info-value">@javiermanuel</span>
                            </div>
                            <div className="usuario-info-item">
                                <span className="usuario-info-label">Signal:</span>
                                <span className="usuario-info-value">JavierManuel</span>
                            </div>
                        </div>

                        <div className="usuario-credentials">
                            <div className="usuario-info-item">
                                <span className="usuario-info-label">Usuario:</span>
                                <span className="usuario-info-value">JVMANUEL</span>
                            </div>
                            <div className="usuario-info-item">
                                <span className="usuario-info-label">Contraseña:</span>
                                <span className="usuario-info-value">
                                    {showPassword ? 'password123' : '***********'}
                                </span>
                                <button
                                    className="usuario-password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        {showPassword ? (
                                            <>
                                                <path d="M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C1 12 4.243 6.06 8.06 4.06" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M14.12 14.12C13.8454 14.4148 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1747 15.0074 10.8019 14.8565C10.4291 14.7056 10.0827 14.4811 9.79669 14.1962C9.51067 13.9113 9.28626 13.5654 9.13544 13.193C8.98462 12.8206 8.91045 12.4202 8.91755 12.0174C8.92465 11.6146 9.01287 11.2173 9.17688 10.8493C9.34089 10.4814 9.57724 10.1501 9.872 9.875" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M9.12 9.12C9.39456 8.82524 9.72588 8.58888 10.0938 8.42487C10.4618 8.26086 10.8591 8.17264 11.2619 8.16554C11.6647 8.15844 12.0653 8.23261 12.4381 8.38343C12.8109 8.53425 13.1573 8.75866 13.4433 9.04367C13.7293 9.32868 13.9537 9.67456 14.1046 10.047C14.2554 10.4194 14.3296 10.8198 14.3225 11.2226C14.3154 11.6254 14.2271 12.0227 14.0631 12.3907C13.8991 12.7586 13.6628 13.0899 13.368 13.365" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M1 1L23 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </>
                                        ) : (
                                            <>
                                                <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                                            </>
                                        )}
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="usuario-level">
                            <span className="usuario-info-label">Tu nivel:</span>
                            <div className="usuario-level-list">Inmortal, Carisma, Benec, Karma, Renacer</div>
                        </div>
                    </div>

                    {/* Right Column - Profile Picture and Points */}
                    <div className="usuario-profile-picture">
                        <div className="usuario-profile-placeholder"></div>
                        <button className="usuario-edit-button">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M18.5 2.50023C18.8978 2.1025 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1025 21.5 2.50023C21.8978 2.89795 22.1214 3.43757 22.1214 4.00023C22.1214 4.56289 21.8978 5.10251 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <div className="usuario-points">XXXX Puntos</div>
                        <button className="usuario-claim-button">Reclamar puntos de hoy</button>
                    </div>
                </section>

                {/* Notifications Section */}
                <section className="usuario-notifications-section">
                    <div className="usuario-notifications-container">
                        <div className="usuario-notifications-bar">
                            <span className="usuario-notifications-label">AVISOS:</span>
                            <div className="usuario-notifications-center">
                                <span className="usuario-notifications-text">ya está disponible la APP</span>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Quote of the Day */}
                <section className="usuario-quote-section">
                    <div className="usuario-quote-container">
                        <div className="usuario-quote-header">
                            <div className="usuario-quote-line"></div>
                            <h2 className="usuario-quote-title">FRASE DEL DÍA</h2>
                            <div className="usuario-quote-line"></div>
                        </div>
                        <div className="usuario-quote-text">"RECUERDA, TÚ NO ERES TU CUERPO"</div>
                        <div className="usuario-quote-separator"></div>

                    </div>
                </section>

                {/* Messages Section */}
                <section className="usuario-messages-section">
                    <div className="usuario-messages-display">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span>MENSAJES</span>
                            <div className="usuario-notification-badge">2</div>
                        </div>
                    </div>
                </section>

                {/* Unified Info Section */}
                <section className="usuario-unified-section">
                    <div className="usuario-unified-content">
                        <div className="usuario-unified-row">
                            <div className="usuario-unified-text">
                                Alianza por la <br/>Razón, ser parte <br/>activa del cambio
                            </div>
                            <button className="usuario-unified-button">SOLICITAR</button>
                        </div>
                        <div className="usuario-unified-row">
                            <div className="usuario-unified-text">
                                Socios recomendados por mí:
                            </div>
                            <span className="usuario-unified-count">3</span>
                        </div>
                        <div className="usuario-unified-row">
                            <div className="usuario-unified-text">
                                Esta es mi historia
                            </div>
                            <button className="usuario-unified-button">VER</button>
                        </div>
                    </div>
                </section>

                {/* Action Buttons */}
                <section className="usuario-actions-section">
                    <button className="usuario-action-button">
                        ENVIAR APORTE A BENEC
                    </button>
                    <button className="usuario-action-button">
                        CORRECCIONES
                        <div className="usuario-notification-badge">2</div>
                    </button>
                </section>

                {/* Contact Form Section */}
                <section className="usuario-contact-form-section">
                    <ContactSection />
                    <button className="usuario-delete-account-button">
                        Dar de baja esta cuenta
                    </button>
                </section>

            </main>

            <FooterSection />

        </div>
    );
}
