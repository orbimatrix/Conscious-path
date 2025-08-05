import React from 'react';
import Image from 'next/image';
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
                    </div>
                </section>

                {/* Legal Image Section - Mobile */}
                <section className="normas-legal-image-section-mobile">
                    <Image
                        src="/legal.png"
                        alt="Legal information"
                        className="normas-legal-image"
                        width={1900}
                        height={684}
                    />
                </section>

                {/* Main Content Section - Continued */}
                <section className="normas-content-section">
                    <div className="normas-content-container">
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

                {/* Legal Image Section */}
                <section className="normas-legal-image-section">
                    <Image
                        src="/legal.png"
                        alt="Legal information"
                        className="normas-legal-image"
                        width={1900}
                        height={684}
                    />
                </section>

                <div className="normas-rules-list">
                    <div className="normas-rule-item">
                        <div className="normas-rule-content">
                            1: RESPETO, debe estar siempre presente en todas las comunicaciones, opiniones, comentarios, gestos, etc.
                        </div>
                    </div>

                    <div className="normas-rule-item">
                        <div className="normas-rule-content">
                            2: CONVENCER a los demás nunca será una prioridad, y nos preocuparemos de entender las creencias de las otras personas antes de presentarles nuevas informaciones o propuestas.
                        </div>
                    </div>

                    <div className="normas-rule-item">
                        <div className="normas-rule-content">
                            3: El MATERIAL de audios y vídeos tiene una estructura basada en creencias y niveles. Además tiene propiedad legal. No se descargará ni publicará material que no sea público.
                        </div>
                    </div>

                    <div className="normas-rule-item">
                        <div className="normas-rule-content">
                           4: EVENTOS e ideas deben estar correctamente ordenados en nuestras mentes. No asociaremos eventos negativos al hecho de participar en este proyecto positivo, ni compartiremos este pensamiento erróneo de forma pública.
                        </div>
                    </div>

                    <div className="normas-rule-item">
                        <div className="normas-rule-content">
                           5: MALENTENDIDOS y discusiones pueden ocurrir en todo grupo. No divulgaremos malentendidos a nadie más que a los organizadores para su pronta solución. Nunca apoyaremos a ninguna parte que se vea implicada en un malentendido.
                        </div>
                    </div>

                    <div className="normas-rule-item">
                        <div className="normas-rule-content">
                            6: Las DUDAS deben ir dirigidas a los administradores, que pueden resolverlas de forma completa. Nunca se enviarán consultas a otros miembros.
                        </div>
                    </div>

                    <div className="normas-rule-item">
                        <div className="normas-rule-content">
                            7: REDES SOCIALES, fuente de energía negativa. No está permitido hacer grupos en Facebook, X, etc que tengan relación con nuestro grupo u objetivos.
                        </div>
                    </div>

                    <div className="normas-rule-item">
                        <div className="normas-rule-content">
                            8: REENCARNACIÓN, la norma principal es no preguntar a otros, ni decir de uno mismo, si ha logrado el renacer consciente. Lo primero manifiesta ignorancia, lo segundo causa peligros.
                        </div>
                    </div>

                    <div className="normas-rule-item">
                        <div className="normas-rule-content">
                            9: BENEC es nuestro egrégor del beneficio económico, de uso opcional. Cuidaremos de la idea, las palabras y los símbolos usados. Solo usaremos el material en contextos de abundancia, siempre positivos. Está muy desaconsejado &ldquo;aprovecharse&rdquo; del Egrégor BENEC sin cumplir el trato convenido, pues puede causar pérdidas importantes de todo tipo.
                        </div>
                    </div>

                    <div className="normas-rule-item">
                        <div className="normas-rule-content">
                           10: LIBERTAD para venir e irse cuando se desee. Pero no para actuar con acciones opuestas a nuestro interés.
                        </div>
                    </div>

                    <div className="normas-rule-item">
                        <div className="normas-rule-content">
                           11: INFORMACIÓN, fuente de aprendizaje. Será muy valorado el compartir con nosotros informaciones, eventos, cursos, sucesos, etc de todas las esferas y territorios. Toda la información será tratada con la máxima privacidad.
                        </div>
                    </div>

                    <p className="normas-conclusion">
                        Esperamos que estas sencillas normas nos ayuden a mejorar la experiencia, y a aprender de nuestros errores. Ante cualquier duda, siéntase libre de escribirnos.
                    </p>
                </div>

            </main>

            <FooterSection />
        </>
    );
}
