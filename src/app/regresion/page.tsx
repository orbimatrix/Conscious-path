import React from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import FooterSection from '../components/FooterSection';

export default function RegresionPage() {
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
          <div className={styles.checkmarkList}>
            <div className={styles.checkmarkItem}>
              <span className={styles.checkmarkIcon}>✓</span>
              <span className={styles.checkmarkText}>Sanación emocional</span>
            </div>
            <div className={styles.checkmarkItem}>
              <span className={styles.checkmarkIcon}>✓</span>
              <span className={`${styles.checkmarkText} ${styles.longText}`}>Comprensión de patrones repetitivos y de relaciones</span>
            </div>
            <div className={styles.checkmarkItem}>
              <span className={styles.checkmarkIcon}>✓</span>
              <span className={styles.checkmarkText}>Reducir miedo a la muerte</span>
            </div>
          </div>
        </div>
      </div>

     

      {/* Image Section */}
      <div className={styles.imageSection}>
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
          <button className={styles.bookingButton}>
            Reservar Regresión Origen
          </button>
        </div>
      </div>

      {/* Footer Section */}
      <FooterSection />
    </div>
  );
}
