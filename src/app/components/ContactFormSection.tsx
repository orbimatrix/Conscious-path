'use client';

import React from 'react';
import ContactSection from './ContactSection';

export default function ContactFormSection() {
    return (
        <section className="usuario-contact-form-section">
            <ContactSection />
            <button className="usuario-delete-account-button">
                Dar de baja esta cuenta
            </button>
        </section>
    );
}
