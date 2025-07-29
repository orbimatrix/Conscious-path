"use client"
import React from "react";
import Image from "next/image";
import FooterSection from "../components/FooterSection";
import "./invitar.css";

export default function InvitarPage() {
  return (
    <div className="invitar-page">
      {/* Brown Banner Section */}
      <section className="invitar-banner">
        <div className="invitar-banner-content">
          <h1 className="invitar-banner-subtitle">INFORMACIÓN</h1>
          <h2 className="invitar-banner-title">GUÍA DE INVITACIÓN</h2>
        </div>
      </section>

      {/* White Text Section */}
      <section className="invitar-text-section">
        <div className="invitar-text-container">
          <h3 className="invitar-text-title">
            LA FORMA ADECUADA DE
          </h3>
          <h4 className="invitar-text-subtitle">
          INVITAR A LAS PERSONAS
          </h4>
        </div>
      </section>

      {/* Large Image Section */}
      <section className="invitar-image-section">
        <div className="invitar-image-container">
          <Image
            src="/fotos/vip_area.jpg"
            alt="VIP area showing exclusive content and access"
            className="invitar-image"
            width={1200}
            height={800}
            priority
          />
        </div>
      </section>

     

      {/* Questions Section */}
      <section className="invitar-questions-section">
        <div className="invitar-questions-container">
          <p className="invitar-intro-text">
            Para invitar correctamente a una persona a nuestro grupo hay que seguir un proceso sencillo. Es necesario saber si la persona invitada percibe la vida desde una etapa de conciencia compatible con nuestras herramientas. No presuponga que una persona conocida va a aceptar su invitación, pues las creencias son muy diferentes de unas a otras.
          </p>
          <p className="invitar-intro-text-followup">
            Por eso comenzaremos realizando 3 preguntas:
          </p>

          <div className="invitar-questions-box">
            <p className="invitar-question">1: ¿Puede la mente influir sobre la materia?</p>
            <p className="invitar-question">2: ¿Puede el alma superar la muerte?</p>
            <p className="invitar-question">3: ¿Estamos todos unidos de alguna forma?</p>
          </div>

          <p className="invitar-response-text">
            Si la respuesta son 3 afirmaciones, felicidades: tiene un buen candidato.
          </p>
          <p className="invitar-response-text">
            Ahora ya puede mostrarle nuestra web, y explicarle que hacemos.
          </p>
          <p className="invitar-recommendation-text">
            Es recomendable que vea alguno de los vídeos. Si todo va bien ya puede entrar a su nivel preferido. Al mismo tiempo puede enviarnos un email para presentarnos a su amigo, y de esa forma sabremos que lo ha invitado y podremos agradecerlo.
          </p>
          <p className="invitar-recommendation-text">
            También puede ayudarle a entrar en el grupo de Telegram para que reciba las novedades, suscribirse a nuestro canal de Youtube, y todo lo que le guste.
          </p>

          <h3 className="invitar-rejection-title">¿Y si no acepta?</h3>
          <p className="invitar-rejection-text">
            No es necesario insistir. Mucha gente no acepta el poder de la mente sobre la materia, y no se puede forzar un cambio de mentalidad. Simplemente acepte que no es el momento, y deje la puerta abierta.
          </p>
        </div>
      </section>

     

      <FooterSection />
    </div>
  );
}
