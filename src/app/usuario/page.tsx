'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import ContactSection from '../components/ContactSection';
import FooterSection from '../components/FooterSection';
import './usuario.css';

interface UserData {
  birthDate?: string;
  city?: string;
  telegram?: string;
  signal?: string;
  username?: string;
  points?: number;
  level?: string;
}

export default function UsuarioPage() {
    const { user, isLoaded } = useUser();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTime, setCurrentTime] = useState('18:38:17');
    const [loading, setLoading] = useState(true);

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

    // Fetch user data from your database
    useEffect(() => {
        if (isLoaded && user) {
            fetchUserData();
        }
    }, [isLoaded, user]);

    const fetchUserData = async () => {
        try {
            console.log('Fetching user data for clerkId:', user?.id);
            const response = await fetch(`/api/user/profile?clerkId=${user?.id}`);
            console.log('Response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('User data received:', data);
                setUserData(data);
            } else {
                const errorData = await response.json();
                console.error('API error:', errorData);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async (updatedData: Partial<UserData>) => {
        try {
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    clerkId: user?.id,
                    ...updatedData
                }),
            });

            if (response.ok) {
                await fetchUserData();
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (!isLoaded || loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                fontSize: '18px',
                color: '#666'
            }}>
                Cargando perfil...
            </div>
        );
    }

    if (!user) {
        return <div>Please sign in to view your profile.</div>;
    }

    return (
        <div className="usuario-page">
            <main className="usuario-main">
                {/* Profile Section */}
                <section className="usuario-profile-section">
                    {/* Left Column - Personal Information */}
                    <div className="usuario-info-container">
                        <div className="usuario-info">
                            <div className="usuario-info-item">
                                <span className="usuario-info-label">Nombre:</span>
                                <span className="usuario-info-value">{user.fullName}</span>
                            </div>
                            <div className="usuario-info-item">
                                <span className="usuario-info-label">Email:</span>
                                <span className="usuario-info-value">{user.primaryEmailAddress?.emailAddress}</span>
                            </div>
                            <div className="usuario-info-item">
                                <span className="usuario-info-label">Fecha de nacimiento:</span>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        className="usuario-info-input"
                                        defaultValue={userData?.birthDate || ''}
                                        placeholder="DD/MM/YYYY"
                                        onChange={(e) => setUserData(prev => prev ? ({ ...prev, birthDate: e.target.value }) : null)}
                                    />
                                ) : (
                                    <span className="usuario-info-value">{userData?.birthDate || 'No especificado'}</span>
                                )}
                            </div>
                            <div className="usuario-info-item">
                                <span className="usuario-info-label">Ciudad:</span>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        className="usuario-info-input"
                                        defaultValue={userData?.city || ''}
                                        onChange={(e) => setUserData(prev => prev ? ({ ...prev, city: e.target.value }) : null)}
                                    />
                                ) : (
                                    <span className="usuario-info-value">{userData?.city || 'No especificado'}</span>
                                )}
                            </div>
                        </div>

                        <div className="usuario-info-item">
                            <span className="usuario-info-label">Time zone / Real time:</span>
                            <div className="usuario-time-display">{currentTime}</div>
                        </div>

                        <div className="usuario-contact">
                            <div className="usuario-info-item">
                                <span className="usuario-info-label">Telegram:</span>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        className="usuario-info-input"
                                        defaultValue={userData?.telegram || ''}
                                        onChange={(e) => setUserData(prev => prev ? ({ ...prev, telegram: e.target.value }) : null)}
                                    />
                                ) : (
                                    <span className="usuario-info-value">{userData?.telegram || 'No especificado'}</span>
                                )}
                            </div>
                            <div className="usuario-info-item">
                                <span className="usuario-info-label">Signal:</span>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        className="usuario-info-input"
                                        defaultValue={userData?.signal || ''}
                                        onChange={(e) => setUserData(prev => prev ? ({ ...prev, signal: e.target.value }) : null)}
                                    />
                                ) : (
                                    <span className="usuario-info-value">{userData?.signal || 'No especificado'}</span>
                                )}
                            </div>
                        </div>

                        <div className="usuario-credentials">
                            <div className="usuario-info-item">
                                <span className="usuario-info-label">Usuario:</span>
                                <span className="usuario-info-value">{userData?.username || 'No especificado'}</span>
                            </div>
                        </div>

                        <div className="usuario-info-item">
                            <span className="usuario-info-label">Tu nivel:</span>
                            <span className="usuario-info-value">{userData?.level || 'Inmortal'}</span>
                        </div>

                    </div>

                    {/* Right Column - Profile Picture and Points */}
                    <div className="usuario-profile-picture">
                        <div className="usuario-profile-placeholder"></div>
                        <button 
                            className="usuario-edit-button"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            <img src="/img/editor.png" alt="Editar" width="40" height="40" />
                        </button>
                        <div className="usuario-points">{userData?.points || 0} Puntos</div>
                        <button className="usuario-claim-button">Reclamar puntos de hoy</button>
                        
                        {/* Save/Cancel buttons only show when editing */}
                        {isEditing && (
                            <div className="usuario-edit-actions">
                                <button 
                                    className="usuario-save-button"
                                    onClick={() => handleSaveProfile(userData || {})}
                                >
                                    Guardar
                                </button>
                                <button 
                                    className="usuario-cancel-button"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        )}
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
                        <div className="usuario-quote-text">&ldquo;RECUERDA, TÚ NO ERES TU CUERPO&rdquo;</div>
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
