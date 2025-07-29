import React from 'react';
import FooterSection from '../components/FooterSection';
import './normas.css';

export default function NormasPage() {
  return (
    <>
      <main className="normas-main">
        {/* Top Brown Banner */}
        <section className="normas-banner">
          <div className="normas-banner-container">
            <h3 className="normas-banner-subtitle">INFORMACIÓN</h3>
            <h2 className="normas-banner-title">NORMAS DEL GRUPO</h2>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="normas-content-section">
          <div className="normas-content-container">
            <h2 className="normas-content-title">
              CONSEJOS BÁSICOS
            </h2>
            <h3 className="normas-content-subtitle">
              PARA PARTICIPAR
            </h3>
            
            <p className="normas-paragraph">
              Para que pueda funcionar cualquier grupo es preciso que todos sus miembros cuiden su comportamiento. Nuestro grupo tiene objetivos de abundancia y bienestar, y nuestras acciones deben ir encaminadas a estos objetivos. Además, al manejar energías muy potentes, es imprescindible un correcto uso de ciertos elementos, pues el no hacerlo ocasiona perjuicios a quienes no actúan con cuidado.
            </p>
          </div>
        </section>

        {/* Bottom Brown Banner */}
        <section className="normas-bottom-banner">
          <div className="normas-bottom-banner-container">
            <h3 className="normas-bottom-title">RECUERDE:</h3>
            <p className="normas-bottom-text">
              Estas normas son para cuidar de los que participan en nuestras actividades, y son coherentes con los objetivos que busca.
            </p>
          </div>
        </section>
      </main>

      <FooterSection />
    </>
  );
}
