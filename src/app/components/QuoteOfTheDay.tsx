'use client';

import React from 'react';

export default function QuoteOfTheDay() {
    return (
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
    );
}
