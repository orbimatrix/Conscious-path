"use client"
import React from "react";
import Image from "next/image";
import FooterSection from "../components/FooterSection";
import "./benec.css";

export default function BenecPage() {
  return (
    <div className="benec-page">
      {/* Dark Banner Section */}
      <section className="benec-banner">
        <div className="benec-banner-content">
          <h1 className="benec-banner-subtitle">HERRAMIENTA AVANZADA</h1>
          <h2 className="benec-banner-title">EGRÉGOR BENEC:</h2>
          <h3 className="benec-banner-main-title">BENEFICIO ECONÓMICO</h3>
        </div>
      </section>

      <main className="benec-main">
        {/* Abundance Group Section */}
        <section className="abundance-group-section">
          <div className="abundance-group-container">
            <h2 className="abundance-group-title">
              GRUPO DE PROYECCIÓN DE LA ABUNDANCIA
            </h2>
            
            {/* Graphic Section */}
            <div className="graphic-container">
              <div className="graphic-background">
                <Image
                  src="/img/1.png"
                  alt="Abundance projection group graphic with human figures, gears, and compass"
                  className="graphic-image"
                  width={600}
                  height={400}
                />
              </div>
            </div>
          </div>
        </section>

        {/* BENEC Information Section */}
        <section className="benec-info-section">
          <div className="benec-info-container">
            <h2 className="benec-info-title">
              BENEC: la energía de la Abundancia
            </h2>
            
            <div className="benec-info-content">
              <p className="benec-paragraph">
                Toda idea compartida y sostenida crea una energía condensada que toma conciencia propia, a la que se llama "egrégor". El egrégor es un ente neutro que simplemente busca sobrevivir. Para ello favorece a quienes lo apoyan, y evita o combate a quienes lo atacan.
              </p>
              
              <p className="benec-paragraph">
                Toda organización tiene un egrégor, que suele estar representado por símbolos, como banderas, iconos, himnos, nombres, uniformes, etc. Las personas también tenemos un egrégor asociado, que ha sido alimentado por otras personas. Un egrégor puede ser usado para prosperar si es adecuadamente alimentado y cuidado, siendo una herramienta extremadamente potente.
              </p>
              
              <p className="benec-paragraph">
                "BENEC" es el nombre del egrégor de la abundancia. A diferencia de otros grupos, nosotros no rendimos culto a un egrégor, si no que tenemos conciencia de que es una herramienta, y la usamos en consecuencia.
              </p>
              
              <p className="benec-paragraph">
                Nuestro egrégor "BENEC" dispone de diversos símbolos, con los que le aportamos atención positiva. La experiencia demuestra que devuelve este regalo con resultados de abundancia.
              </p>
            </div>
          </div>
        </section>

        <section className="abundance-group-section">
          <div className="abundance-group-container">
            
            
            {/* Graphic Section */}
            <div className="graphic-container">
              <div className="graphic-background">
                <Image
                  src="/img/4.png"
                  alt="Abundance projection group graphic with human figures, gears, and compass"
                  className="graphic-image"
                  width={600}
                  height={400}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contributions Section */}
        <section className="contributions-section">
          <div className="contributions-container">
            <h2 className="contributions-title">
              Aportes al grupo de proyección:
            </h2>
            
            <div className="contributions-content">
              <p className="contribution-paragraph">
                Los participantes practican el principio de "dar es igual a recibir". Se invita a los participantes a compartir <strong>VOLUNTARIAMENTE</strong> una parte del <strong>INCREMENTO</strong> de sus ganancias recibidas. Un egrégor puede favorecer la fortuna de quienes "lo alimentan con su atención", obteniendo resultados "mejores y más rápidos". No corresponder a la ayuda del egrégor "suele traer resultados negativos", ya que el egrégor ha "confiado e invertido su energía, confiando en tu respuesta como ser abundante".
              </p>
              
              <p className="contribution-paragraph">
                ¿Que parte de los éxitos conseguidos es apropiado entregar al egrégor? Un 5% del incremento de las ganancias obtenidas se considera apropiado. Es opcional cambiarlo por un 3% de las ganancias totales, si resulta más ventajoso para el usuario. Siempre es preferible realizar esta aportación lo más inmediatamente posible si el logro es puntual, o con suscripciones periódicas en el caso de logros sostenidos.
              </p>
              
              <p className="contribution-paragraph">
                Puede resultar difícil recordar la "verdadera situación" cuando se ingresó al grupo, especialmente después de que ya se han manifestado los resultados. Puede ser complicado saber realmente "cuánto hemos mejorado realmente". Para esto se recomienda "realizar una declaración económica inicial para tomar conciencia de la mejora real lograda".
              </p>
            </div>
          </div>
        </section>

        {/* Image Section */}
        <section className="benec-image-section">
          <div className="benec-image-container">
            <Image
              src="/img/3.png"
              alt="BENEC group image"
              className="benec-image"
              width={800}
              height={600}
            />
          </div>
        </section>
      </main>

      {/* Brown Banner - Outside main container for full width */}
      <div className="audio-banner">
        <div className="audio-banner-content">
          <p className="audio-banner-text">
            Este audio es una meditación guiada para BENEC. Úsela cada día mientras visualiza sus objetivos económicos.
          </p>
        </div>
      </div>

      {/* Audio Meditation Section */}
      <section className="audio-meditation-section">
        {/* Video Player Section */}
        <div className="video-player-section">
          <div className="video-player-container">
            <div className="video-player">
              <div className="play-button">
                <div className="play-icon"></div>
              </div>
            </div>
            <h3 className="video-title">
              ACTIVAR OBJETIVOS CON BENEC
            </h3>
          </div>
        </div>

        {/* Contribution Button */}
        <div className="contribution-button-section">
          <button className="contribution-button">
            <span className="button-line-1">He recibido premios y ganancias,</span>
            <span className="button-line-2">REALIZAR APORTE A BENEC</span>
          </button>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
