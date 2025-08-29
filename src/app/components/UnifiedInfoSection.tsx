'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';
import toast from 'react-hot-toast';

export default function UnifiedInfoSection() {
    const { user } = useUser();
    const [isRequesting, setIsRequesting] = useState(false);
    const [hasRequested, setHasRequested] = useState(false);
    const [isEditingBiography, setIsEditingBiography] = useState(false);
    const [biography, setBiography] = useState('');
    const [isSavingBiography, setIsSavingBiography] = useState(false);
    const { userId } = useAuth();

    // Load user biography on component mount
    useEffect(() => {
        if (user?.id) {
            loadUserBiography();
        }
    }, [user?.id]);

    const loadUserBiography = async () => {
        try {
            const response = await fetch(`/api/user/profile?clerkId=${user?.id}`);
            if (response.ok) {
                const userData = await response.json();
                setBiography(userData.biography || '');
            }
        } catch (error) {
            console.error('Error loading biography:', error);
        }
    };

    const handleAllianceRequest = async () => {
        if (!userId || hasRequested) return;
        
        setIsRequesting(true);
        try {
            const response = await fetch('/api/user/alliance-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (response.ok) {
                setHasRequested(true);
                toast.success('Alianza solicitada correctamente');
            }
        } catch (error) {
            console.error('Error requesting alliance:', error);
        } finally {
            setIsRequesting(false);
        }
    };

    const handleSaveBiography = async () => {
        if (!user?.id) return;
        
        setIsSavingBiography(true);
        try {
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clerkId: user.id,
                    biography: biography
                }),
            });
            
            if (response.ok) {
                setIsEditingBiography(false);
                toast.success('Biografía guardada correctamente');
            } else {
                toast.error('Error al guardar la biografía');
            }
        } catch (error) {
            console.error('Error saving biography:', error);
            toast.error('Error al guardar la biografía');
        } finally {
            setIsSavingBiography(false);
        }
    };

    const handleCancelBiography = () => {
        setIsEditingBiography(false);
        loadUserBiography(); // Reset to original content
    };

    return (
        <section className="usuario-unified-section">
            <div className="usuario-unified-content">
                <div className="usuario-unified-row">
                    <div className="usuario-unified-text">
                        Alianza por la <br/>Razón, ser parte <br/>activa del cambio
                    </div>
                    <button 
                        className={`usuario-unified-button ${hasRequested ? 'usuario-unified-button-activo' : ''}`}
                        onClick={handleAllianceRequest}
                        disabled={isRequesting || hasRequested}
                    >
                        {isRequesting ? 'SOLICITANDO...' : hasRequested ? 'ACTIVO' : 'SOLICITAR'}
                    </button>
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
                    {isEditingBiography ? (
                        <div className="biography-edit-controls">
                            <button 
                                className="usuario-unified-button save-button"
                                onClick={handleSaveBiography}
                                disabled={isSavingBiography}
                            >
                                {isSavingBiography ? 'GUARDANDO...' : 'GUARDAR'}
                            </button>
                            <button 
                                className="usuario-unified-button cancel-button"
                                onClick={handleCancelBiography}
                                disabled={isSavingBiography}
                            >
                                CANCELAR
                            </button>
                        </div>
                    ) : (
                        <button 
                            className="usuario-unified-button"
                            onClick={() => setIsEditingBiography(true)}
                        >
                            {biography ? 'EDITAR' : 'ESCRIBIR'}
                        </button>
                    )}
                </div>
                
                {/* Biography Text Area */}
                {isEditingBiography && (
                    <div className="biography-section">
                        <textarea
                            className="biography-textarea"
                            value={biography}
                            onChange={(e) => setBiography(e.target.value)}
                            placeholder="Cuéntanos sobre ti: tus estudios, ciudad donde planeas vivir, planes económicos, metas personales, etc..."
                            rows={6}
                            maxLength={1000}
                        />
                        <div className="biography-character-count">
                            {biography.length}/1000 caracteres
                        </div>
                    </div>
                )}
                
                {/* Display Biography (read-only) */}
                {!isEditingBiography && biography && (
                    <div className="biography-display">
                        <div className="biography-content">
                            {biography}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
