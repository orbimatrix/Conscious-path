import React from "react";
import Image from "next/image";
import FooterSection from "../components/FooterSection";

export default function PrivadoPage() {
    return (
        <div className="privado-page">
            {/* Top Banner Section */}
            <section className="privado-banner">
                <div className="privado-banner-content">
                    <h3 className="privado-banner-subtitle">ASISTENCIA PERSONAL</h3>
                    <h1 className="privado-banner-title">ENCUENTRO PRIVADO ONLINE</h1>
                </div>
            </section>

                         {/* Main Content Section */}
             <section className="privado-content">
                 <div className="privado-content-wrapper">
                     <h2 className="privado-content-title">
                         ENTREVISTA PERSONAL CON TODO DETALLE
                     </h2>
 
                     <div className="privado-description">
                         <p>Reserve un encuentro personal privado para resolver todo tipo de dudas. Tendremos una conversación profunda enfocada en sus inquietudes, para aportar claridad.</p>
                         <p>Descubra las soluciones a sus bloqueos actuales, cualquiera que sea la naturaleza. Y examinaremos los posibles caminos para avanzar en las mejoras que desea obtener.</p>
                     </div>
 
                     <div className="privado-features">
                         <div className="privado-feature-item">
                             <div className="privado-check-icon">✓</div>
                             <span className="privado-feature-text">Atención exclusiva</span>
                         </div>
 
                         <div className="privado-feature-item">
                             <div className="privado-check-icon">✓</div>
                             <span className="privado-feature-text">Máxima privacidad</span>
                         </div>
 
                         <div className="privado-feature-item">
                             <div className="privado-check-icon">✓</div>
                             <span className="privado-feature-text">Identificar problemas y soluciones</span>
                         </div>
                     </div>
                 </div>
             </section>

             <div className="privado-image-container">
                                 <Image
                     src="/fotos/armchair.jpg"
                     alt="Armchair - Encuentro Privado"
                     width={600}
                     height={450}
                     className="privado-image"
                     priority
                 />
            </div>
 
             {/* Middle Highlight Section */}
             <section className="privado-highlight">
                 <div className="privado-highlight-content">
                     <p>Entorno de máxima discreción, en función de sus necesidades.</p>
                     <p>Trato personal, con calma y atención.</p>
                     <p>Orientación en todo tipo de temáticas.</p>
                 </div>
             </section>
 
             {/* Video and CTA Section */}
             <section className="privado-video-section">
                 <div className="privado-video-container">
                     <div className="privado-video-player">
                         <div className="privado-play-button">
                             <div className="privado-play-icon">▶</div>
                         </div>
                     </div>
                     <h3 className="privado-video-title">Presentación del Encuentro privado</h3>
                     <button className="privado-cta-button">Reservar el Encuentro</button>
                 </div>
             </section>
           




            <FooterSection />
        </div>
    );
}
