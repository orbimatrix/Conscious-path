'use client';

import React from 'react';

export default function MessagesSection() {
    return (
        <section className="usuario-messages-section">
            <div className="usuario-messages-display">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span>MENSAJES</span>
                    <div className="usuario-notification-badge">2</div>
                </div>
            </div>
        </section>
    );
}
