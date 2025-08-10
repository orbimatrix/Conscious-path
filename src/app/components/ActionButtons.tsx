'use client';

import React from 'react';

export default function ActionButtons() {
    return (
        <section className="usuario-actions-section">
            <button className="usuario-action-button">
                ENVIAR APORTE A BENEC
            </button>
            <button className="usuario-action-button">
                CORRECCIONES
                <div className="usuario-notification-badge">2</div>
            </button>
        </section>
    );
}
