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
              <span className={styles.checkmarkText}>Comprensión de patrones repetitivos y de relaciones</span>
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

      {/* Footer Section */}
      <FooterSection />
    </div>
  );
}
