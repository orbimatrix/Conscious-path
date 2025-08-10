'use client';

import React from 'react';

export default function UnifiedInfoSection() {
    return (
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
    );
}
