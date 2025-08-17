'use client';

import React, { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import toast from 'react-hot-toast';

export default function UnifiedInfoSection() {
    const [isRequesting, setIsRequesting] = useState(false);
    const [hasRequested, setHasRequested] = useState(false);
    const { userId } = useAuth();

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
                // You could show a success message here

            }
        } catch (error) {
            console.error('Error requesting alliance:', error);
            // You could show an error message here
        } finally {
            setIsRequesting(false);
        }
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
                    <button className="usuario-unified-button">VER</button>
                </div>
            </div>
        </section>
    );
}
