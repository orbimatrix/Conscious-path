"use client"
import React, { useState } from "react";
import Image from "next/image";
import FooterSection from "../components/FooterSection";
import "./contenidos.css";
import { useRouter } from "next/navigation";

export default function ContenidosPage() {
  const router = useRouter();
  const [subscriptionEmail, setSubscriptionEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleEmailSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriptionEmail.trim()) {
      setSubmitStatus({ type: 'error', message: 'Por favor ingrese un email' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/email-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: subscriptionEmail }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: result.message });
        setSubscriptionEmail("");
      } else {
        setSubmitStatus({ type: 'error', message: result.error || 'Error al procesar la suscripción' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Error de conexión' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contenidos-page">
      {/* Brown Banner Section */}
      <section className="contenidos-banner">
        <div className="contenidos-banner-content">
          <h1 className="contenidos-banner-subtitle">INFORMACIÓN</h1>
          <h2 className="contenidos-banner-title">TODOS LOS CONTENIDOS</h2>
        </div>
      </section>

      {/* White Text Section */}
      <section className="contenidos-text-section">
        <div className="contenidos-text-container">
          <h3 className="contenidos-text-title">
            ÍNDICE RÁPIDO PARA ENCONTRAR LO
          </h3>
          <h4 className="contenidos-text-subtitle">
            QUE NECESITA
          </h4>
        </div>
      </section>

      {/* Large Image Section */}
      <section className="contenidos-image-section">
        <div className="contenidos-image-container">
          <Image
            src="/fotos/cms.jpg"
            alt="Digital interface showing Media, Posts, and Library options"
            className="contenidos-image"
            width={1200}
            height={800}
            priority
          />
        </div>
      </section>

     

      {/* Bottom Button Section */}
      <section className="contenidos-button-section">
        <div className="contenidos-button-container">
            <button 
              className="contenidos-register-button"
              onClick={() => router.push('/registration')}
            >
              <span className="button-line-1">Regístrese ahora</span>
              <span className="button-line-2">y descubra los secretos</span>
            </button>
        </div>
      </section>


       {/* Information Services Section */}
       <section className="contenidos-services-section">
        <div className="contenidos-services-container">
          <p className="contenidos-intro-text">
            Conozca todo el contenido y servicios a su disposición, siempre a su alcance:
          </p>
          
          <h2 className="contenidos-services-title">SERVICIOS DE INFORMACIÓN</h2>
          
          <div className="contenidos-services-list">
            <div className="contenidos-service-item">
              <h3 className="contenidos-service-level">Nivel Renacer Consciente</h3>
              <p className="contenidos-service-description">
                El servicio más exclusivo, para retener la memoria actual en la siguiente reencarnación
              </p>
            </div>
            
            <div className="contenidos-service-item">
              <h3 className="contenidos-service-level">Nivel Carisma</h3>
              <p className="contenidos-service-description">
                Audios y vídeos enfocados en conocer los secretos del mundo y la ciencia
              </p>
            </div>
            
            <div className="contenidos-service-item">
              <h3 className="contenidos-service-level">Nivel Karma</h3>
              <p className="contenidos-service-description">
                Material avanzado, con los misterios más censurados y ocultos
              </p>
            </div>
            
            <div className="contenidos-service-item">
              <h3 className="contenidos-service-level">Nivel Abundancia y Grupo BENEC</h3>
              <p className="contenidos-service-description">
                Metafísica para lograr el éxito económico, con la opción de usar nuestro egrégor grupal
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Attention Section */}
      <section className="contenidos-personal-section">
        <div className="contenidos-personal-container">
          <h2 className="contenidos-personal-title">ATENCIÓN PERSONAL</h2>
          
          <div className="contenidos-personal-list">
            <div className="contenidos-personal-item">
              <h3 className="contenidos-personal-service">Bienestar Integral</h3>
              <p className="contenidos-personal-description">
                Resuelva conflictos y problemas con las técnicas más avanzadas y completas
              </p>
            </div>
            
            <div className="contenidos-personal-item">
              <h3 className="contenidos-personal-service">Encuentro Privado</h3>
              <p className="contenidos-personal-description">
                Reunión discreta para conocer su caso y aconsejarle de forma directa
              </p>
            </div>
            
            <div className="contenidos-personal-item">
              <h3 className="contenidos-personal-service">Sesiones Limpiar Karma</h3>
              <p className="contenidos-personal-description">
                Libere las cargas que arrastra de esta y otras vidas de forma guiada
              </p>
            </div>
            
            <div className="contenidos-personal-item">
              <h3 className="contenidos-personal-service">Análisis Estructural Esencial</h3>
              <p className="contenidos-personal-description">
                Conozca sus verdaderas capacidades y carencias, lejos de su autoimagen actual
              </p>
            </div>
            
            <div className="contenidos-personal-item">
              <h3 className="contenidos-personal-service">Regresión Origen</h3>
              <p className="contenidos-personal-description">
                Sesiones de Hipnoterapia para obtener información de sus vidas pasadas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contents Section */}
      <section className="contenidos-contents-section">
        <div className="contenidos-contents-container">
          <h2 className="contenidos-contents-title">CONTENIDOS</h2>
          
          <div className="contenidos-contents-list">
            <div className="contenidos-content-item">
              <h3 className="contenidos-content-heading">Audios y Vídeos</h3>
              <p className="contenidos-content-description">
                Todo el conocimiento a su alcance
              </p>
            </div>
            
            <div className="contenidos-content-item">
              <h3 className="contenidos-content-heading">Sobre la Mente Única</h3>
              <p className="contenidos-content-description">
                Principios esenciales sobre la realidad
              </p>
            </div>
            
            <div className="contenidos-content-item">
              <h3 className="contenidos-content-heading">Guía de Invitación</h3>
              <p className="contenidos-content-description">
                La forma correcta de invitar a un amigo
              </p>
            </div>
            
            <div className="contenidos-content-item">
              <h3 className="contenidos-content-heading">Normas</h3>
              <p className="contenidos-content-description">
                Guía básica de comportamiento
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About This Web Section */}
      <section className="contenidos-about-section">
        <div className="contenidos-about-container">
          <h2 className="contenidos-about-title">SOBRE ESTA WEB</h2>
          
          <div className="contenidos-about-list">
            <div className="contenidos-about-item">
              <a href="#" className="contenidos-about-link">Condiciones de uso</a>
            </div>
            
            <div className="contenidos-about-item">
              <a href="#" className="contenidos-about-link">Privacidad</a>
            </div>
            
            <div className="contenidos-about-item">
              <a href="#" className="contenidos-about-link">Donaciones y Aportes</a>
            </div>
            
            <div className="contenidos-about-item">
              <a href="#" className="contenidos-about-link">Contacto</a>
            </div>
          </div>
        </div>
      </section>

      {/* Email Subscription Section */}
      <section className="contenidos-subscription-section">
        <div className="contenidos-subscription-container">
          <div className="contenidos-subscription-form">
            <p className="contenidos-subscription-text">
              Reciba en su email todas las novedades.
            </p>
            
            <form className="contenidos-email-form" onSubmit={handleEmailSubscription}>
              <input 
                type="email" 
                placeholder="Su Email" 
                className="contenidos-email-input"
                value={subscriptionEmail}
                onChange={(e) => setSubscriptionEmail(e.target.value)}
                required
              />
              {submitStatus.type && (
                <div className={`subscription-status ${submitStatus.type}`}>
                  {submitStatus.message}
                </div>
              )}
              <button 
                type="submit" 
                className="contenidos-submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
