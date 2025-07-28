import React from "react";
import ContactSection from "../components/ContactSection";
import FooterSection from "../components/FooterSection";

export default function RegistrationPage() {
  return (
    <div>
      <div className="registration-container">
        <h1 className="registration-heading">
          Iniciar la Senda Consciente
        </h1>
        <div className="registration-details">
          <p className="registration-option">
            STANDARD REGISTRATION WEB, WITH MANY OPTIONS.
          </p>
          <p className="registration-option">
            INCLUDE USER + PASSWORD
          </p>
          <p className="registration-option">
            INCLUDE GOOGLE, FACEBOOK, ETC
          </p>
        </div>
        <div className="registration-assistance">
          Si necesita asistencia, escriba su email y mensaje:
        </div>
      </div>
      <ContactSection />
      <FooterSection />
    </div>
  );
}
