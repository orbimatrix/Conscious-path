import React from "react";
import Link from "next/link";
import Header from "./components/Header";
import ContactSection from "./components/ContactSection";
import FooterSection from "./components/FooterSection";

// Utility function to navigate to 404 page
export function navigateTo404() {
  window.location.href = '/404';
}

export default function NotFound() {
  return (
    <div>
      <Header />
      <div className="error404-container">
        <h1 className="error404-heading">
          El contenido buscado no se encuentra
        </h1>
        <div className="error404-content">
          <p className="error404-paragraph">
            Lo sentimos, el contenido que está buscando no se encuentra en esta dirección.
          </p>
          <p className="error404-paragraph">
            Puede acceder a <Link href="/">TODO EL CONTENIDO</Link> y buscar el tema de su interés.
          </p>
          <p className="error404-paragraph">
            También puede enviarnos un mensaje, y le ayudaremos a localizar la información que necesita.
          </p>
        </div>
        <div className="error404-email-center">
          Escriba su email y mensaje:
        </div>
      </div>
      <ContactSection />
      <FooterSection />
    </div>
  );
} 