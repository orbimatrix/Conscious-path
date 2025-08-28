"use client"
import React, { useState } from "react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    email: "",
    nombre: "",
    mensaje: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: result.message });
        setFormData({ email: "", nombre: "", mensaje: "" });
      } else {
        setSubmitStatus({ type: 'error', message: result.error || 'Error al enviar el mensaje' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Error de conexión' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact-us-section">
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="contact-field">
          <label className="contact-label">Email:</label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="invitado@email.com" 
            className="contact-input"
            required
          />
        </div>
        <div className="contact-field">
          <label className="contact-label">Nombre:</label>
          <input 
            type="text" 
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            placeholder="" 
            className="contact-input"
            required
          />
        </div>
        <div className="contact-field">
          <label className="contact-label">Mensaje:</label>
          <textarea 
            name="mensaje"
            value={formData.mensaje}
            onChange={handleInputChange}
            placeholder="Hola, quisiera..." 
            className="contact-textarea"
            required
          />
        </div>
        {submitStatus.type && (
          <div className={`submit-status ${submitStatus.type}`}>
            {submitStatus.message}
          </div>
        )}
        <button 
          type="submit" 
          className="contact-submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </section>
  );
} 