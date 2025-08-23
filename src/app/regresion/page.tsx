"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import FooterSection from '../components/FooterSection';

export default function RegresionPage() {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    caseInfo: "",
    availability: "",
    paymentMethod: "",
    acceptTerms: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.acceptTerms && formData.email && formData.caseInfo && formData.availability && formData.paymentMethod) {
      setIsSubmitted(true);
      // Here you would typically send the data to your backend
      console.log('Form submitted:', formData);
    }
  };

  const toggleBookingForm = () => {
    setShowBookingForm(!showBookingForm);
    if (showBookingForm) {
      setIsSubmitted(false);
      setFormData({
        email: "",
        caseInfo: "",
        availability: "",
        paymentMethod: "",
        acceptTerms: false
      });
    }
  };



  return (
    <div className={styles.container}>
      {/* Banner Section */}
      <div className={styles.bannerSection}>
        <div className={styles.bannerContainer}>
          <div className={styles.bannerContent}>
            <p className={styles.infoText}>
              ASISTENCIA PERSONAL
            </p>
            <h1 className={styles.bannerTitle}>
              REGRESIÓN ORIGEN
            </h1>
          </div>
        </div>
      </div>

      {/* New Section with Checkmarks */}
      <div className={styles.checkmarkSection}>
        <div className={styles.checkmarkContainer}>
          <h2 className={styles.checkmarkTitle}>
            DESCUBRIR LOS SECRETOS DE LAS VIDAS <br/>PASADAS
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className={styles.checkmarkList}>
              <div className={styles.checkmarkItem}>
                <Image src="/img/check.png" alt="Check" className={styles.checkmarkIcon} width={20} height={20} />
                <span className={styles.checkmarkText}>Sanación emocional</span>
              </div>
              <div className={styles.checkmarkItem}>
                <Image src="/img/check.png" alt="Check" className={styles.checkmarkIcon} width={20} height={20} />
                <span className={`${styles.checkmarkText} ${styles.longText}`}>
                  Comprensión de patrones repetitivos<br />
                  y de relaciones
                </span>
              </div>
              <div className={styles.checkmarkItem}>
                <Image src="/img/check.png" alt="Check" className={styles.checkmarkIcon} width={20} height={20} />
                <span className={styles.checkmarkText}>Reducir miedo a la muerte</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className={styles.imageSectionFullWidth}>
        <div className={styles.imageContainer}>
          <Image 
            src="/fotos/reflection.jpg" 
            alt="Reflection - Regresión de Origen"
            width={800}
            height={600}
            className={styles.reflectionImage}
            priority
          />
        </div>
      </div>

      {/* Content Section */}
      <div className={styles.contentSection}>
        <div className={styles.contentContainer}>
          <div className={styles.prose}>
            <h2 className={styles.sectionTitle}>
              La regresión a vidas pasadas se usa para conocer las ataduras que trae nuestra alma, y así conocernos y liberarnos.
            </h2>
            
            <h3 className={styles.subsectionTitle}>
              Se usa principalmente en 3 casos:
            </h3>
            
            <ol className={styles.numberedList}>
              <li className={styles.listItem}>
                Exploratorio, para ganar saber más sobre la propia naturaleza, los orígenes, historias del pasado, etc.
              </li>
              <li className={styles.listItem}>
                Medio para el bienestar, identificando bloqueos que no responden a eventos de esta vida, y que nos causan molestias.
              </li>
              <li className={styles.listItem}>
                Preparación para la siguiente reencarnación. Si bien no es obligado, sí ayuda en muchos casos a liberar ataduras tóxicas, y también a preparar la mente para ese paso con mayor consciencia.
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* Service Information Section */}
      <div className={styles.serviceSection}>
        <div className={styles.serviceContainer}>
          <div className={styles.serviceContent}>
            <p className={styles.serviceParagraph}>
              Aseguramos un servicio de máxima eficacia, dentro de la atención integral.
            </p>
            <p className={styles.serviceParagraph}>
              Esta sesión no necesita preparación previa cuando es exploratoria y de conocimiento.
            </p>
            <p className={styles.serviceParagraph}>
              Si quiere encontrar el origen de un problema concreto, le solicitaremos información previa, para conseguir el mejor resultado.
            </p>
            <p className={styles.serviceParagraph}>
              Se le guiará paso a paso en todo el proceso.
            </p>
          </div>
        </div>
      </div>
      
      {/* Video Section */}
      <div className={styles.videoSection}>
        <div className={styles.videoContainer}>
          {/* Video Player Placeholder */}
          <div className={styles.videoPlaceholder}>
            <div className={styles.playButton}>
              <div className={styles.playIcon}></div>
            </div>
          </div>
          
          {/* Title */}
          <h2 className={styles.videoTitle}>
            Presentación de Regresión Origen
          </h2>
          
          {/* Booking Button */}
          <button 
            className={styles.bookingButton}
            onClick={toggleBookingForm}
          >
            Reservar Regresión Origen
          </button>
        </div>
      </div>

      {/* Booking Form Section */}
      {showBookingForm && (
        <section className={styles.bookingFormSection}>
          <div className={styles.bookingFormContainer}>
            <div className={styles.bookingFormHeader}>
              <h3 className={styles.bookingFormTitle}>La tarifa para sesión Regresión Origen es:</h3>
              <div className={styles.bookingFormPrice}>100 $</div>
              <p className={styles.bookingFormInstruction}>
                LEA Y COMPLETE LOS SIGUIENTES CAMPOS PARA RESERVAR SU CONSULTA
              </p>
            </div>

            {!isSubmitted ? (
              <form className={styles.bookingForm} onSubmit={handleSubmit}>
                <div className={styles.bookingFormSectionGroup}>
                  <ul className={styles.bookingFormTermsList}>
                    <li>Entiendo que mis datos serán usados y almacenados para realizar el servicio solicitado.</li>
                    <li>Una vez revisado su mensaje, le contestaremos con detalles sobre la disponibilidad y forma de pago.</li>
                  </ul>
                  <div className={styles.bookingFormCheckboxGroup}>
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                      className={styles.bookingFormCheckbox}
                    />
                    <label htmlFor="acceptTerms" className={styles.bookingFormCheckboxLabel}>
                      Acepto estos términos
                    </label>
                  </div>
                </div>

                <div className={styles.bookingFormSectionGroup}>
                  <label htmlFor="email" className={styles.bookingFormLabel}>
                    Email de contacto:
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={styles.bookingFormInput}
                    required
                  />
                </div>

                <div className={styles.bookingFormSectionGroup}>
                  <h4 className={styles.bookingFormSectionTitle}>COMPLETAR INFORMACIÓN</h4>
                  <p className={styles.bookingFormInstructionText}>
                    Escriba con detalle la razón de su consulta, lo que le afecta, y desde cuando le sucede. Si dispone de un diagnóstico médico, también es recomendable incluirlo.
                  </p>
                  <label htmlFor="caseInfo" className={styles.bookingFormLabel}>
                    Información de mi caso:
                  </label>
                  <textarea
                    id="caseInfo"
                    name="caseInfo"
                    value={formData.caseInfo}
                    onChange={handleInputChange}
                    className={styles.bookingFormTextarea}
                    rows={6}
                    required
                  />
                </div>

                <div className={styles.bookingFormSectionGroup}>
                  <h4 className={styles.bookingFormSectionTitle}>CALENDARIO Y PAGO</h4>
                  <p className={styles.bookingFormInstructionText}>
                    Escriba que días y horas tiene disponibles para realizar la sesión. Será necesario que disponga de silencio sin interrupciones. Escriba su forma preferida de pago.
                  </p>
                  <label htmlFor="availability" className={styles.bookingFormLabel}>
                    Disponibilidad:
                  </label>
                  <textarea
                    id="availability"
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className={styles.bookingFormTextarea}
                    rows={4}
                    required
                  />
                  <label htmlFor="paymentMethod" className={styles.bookingFormLabel}>
                    Forma de pago:
                  </label>
                  <textarea
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className={styles.bookingFormTextarea}
                    rows={4}
                    required
                  />
                </div>

                <button type="submit" className={styles.bookingFormSubmitButton}>
                  ENVIAR MI SOLICITUD
                </button>
              </form>
            ) : (
              <div className={styles.bookingFormSuccess}>
                <p className={styles.bookingFormSuccessMessage}>
                  SU SOLICITUD HA SIDO ENVIADA. RECIBIRÁ UN MENSAJE CON LAS INSTRUCCIONES A SEGUIR.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Footer Section */}
      <FooterSection />
    </div>
  );
}
