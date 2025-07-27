import React from "react";
import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="about-section">
      <div className="about-container">
        <div className="about-image-wrapper">
          <Image 
            src="/verfractal.png" 
            alt="Ramón" 
            width={120} 
            height={120} 
            className="about-image"
          />
        </div>
        <div className="about-content">
          <h3 className="about-greeting">Hola, soy Ramón</h3>
          <p className="about-description">
            Como buscador de la verdad y la conciencia, he recorrido un camino de aprendizaje oculto. Ahora, te ofrezco este espacio exclusivo y seguro para que tú también experimentes la transformación y el crecimiento. Únete a mí en este viaje de superación.
          </p>
        </div>
      </div>
    </section>
  );
} 