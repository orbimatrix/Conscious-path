"use client"
import React, { useState } from "react";
import Image from "next/image";
import FooterSection from "../components/FooterSection";
import "./conocimiento.css";

export default function AudioVideoPage() {
  const [checkedItems, setCheckedItems] = useState<boolean[]>([false, false, false, false, false, false]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const handleCheckboxClick = (index: number) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
  };

  const handlePlusClick = (index: number) => {
    setSelectedCard(index);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCard(null);
  };

  const handleModalCheckboxClick = () => {
    // Handle modal checkbox logic here
  };

  const videoData = [
    { title: "The tittle of the vídeo", level: "Carisma", description: "This is the extended audio/video description, with more details and keywords." },
    { title: "The tittle of the vídeo", level: "Carisma", description: "This is the extended audio/video description, with more details and keywords." },
    { title: "The tittle of the vídeo", level: "Carisma", description: "This is the extended audio/video description, with more details and keywords." },
    { title: "The tittle of the vídeo", level: "Carisma", description: "This is the extended audio/video description, with more details and keywords." },
    { title: "The tittle of the vídeo", level: "Carisma", description: "This is the extended audio/video description, with more details and keywords." },
    { title: "The tittle of the vídeo", level: "Carisma", description: "This is the extended audio/video description, with more details and keywords." }
  ];

  return (
    <div>
      <section className="audio-video-hero">
        {/* Responsive images for different screen sizes */}
        <picture>
          {/* For screens 960px and above */}
          <source media="(min-width: 960px)" srcSet="/fotos/g_960.png" />
          {/* For screens 768px to 959px */}
          <source media="(min-width: 768px)" srcSet="/fotos/g_768.png" />
          {/* For screens 480px to 767px */}
          <source media="(min-width: 480px)" srcSet="/fotos/g_480.png" />
          {/* For screens 360px to 479px */}
          <source media="(min-width: 360px)" srcSet="/fotos/g_360.png" />
          {/* Fallback for screens below 360px */}
          <img 
            src="/fotos/girl.png" 
            alt="Hero Image" 
            className="hero-image"
          />
        </picture>
      </section>
      
      <section className="button-section">
        <div className="button-grid">
          <button className="filter-button">Todo</button>
          <button className="filter-button active">Público</button>
          <button className="filter-button">Inmortal</button>
          <button className="filter-button">Carisma</button>
          <button className="filter-button">Abundancia</button>
          <button className="filter-button">Karma</button>
        </div>
      </section>
      
      <section className="videos-section">
        <h2 className="videos-title">Vídeos y Audios Públicos</h2>
        <div className="videos-grid">
          {/* Video Card 1 */}
          <div className="video-card">
            <div className="video-thumbnail">
              <div className="video-icon">▶</div>
            </div>
            <div className="video-info">
              <div className="video-title">Abundancia y enfermedades</div>
              <div className="video-status">
                <div 
                  className={`status-checkbox ${checkedItems[0] ? 'checked' : ''}`}
                  onClick={() => handleCheckboxClick(0)}
                ></div>
                <div className="status-plus-circle" onClick={() => handlePlusClick(0)}>
                  <span className="plus-icon">+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Video Card 2 */}
          <div className="video-card">
            <div className="video-thumbnail">
              <div className="video-icon">▶</div>
            </div>
            <div className="video-info">
              <div className="video-title">Abundancia y enfermedades</div>
              <div className="video-status">
                <div 
                  className={`status-checkbox ${checkedItems[1] ? 'checked' : ''}`}
                  onClick={() => handleCheckboxClick(1)}
                ></div>
                <div className="status-plus-circle" onClick={() => handlePlusClick(1)}>
                  <span className="plus-icon">+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Video Card 3 */}
          <div className="video-card">
            <div className="video-thumbnail">
              <div className="video-icon">▶</div>
            </div>
            <div className="video-info">
              <div className="video-title">Abundancia y enfermedades</div>
              <div className="video-status">
                <div 
                  className={`status-checkbox ${checkedItems[2] ? 'checked' : ''}`}
                  onClick={() => handleCheckboxClick(2)}
                ></div>
                <div className="status-plus-circle" onClick={() => handlePlusClick(2)}>
                  <span className="plus-icon">+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Video Card 4 */}
          <div className="video-card">
            <div className="video-thumbnail">
              <div className="video-icon">▶</div>
            </div>
            <div className="video-info">
              <div className="video-title">Abundancia y enfermedades</div>
              <div className="video-status">
                <div 
                  className={`status-checkbox ${checkedItems[3] ? 'checked' : ''}`}
                  onClick={() => handleCheckboxClick(3)}
                ></div>
                <div className="status-plus-circle" onClick={() => handlePlusClick(3)}>
                  <span className="plus-icon">+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Video Card 5 */}
          <div className="video-card">
            <div className="video-thumbnail">
              <div className="video-icon">▶</div>
            </div>
            <div className="video-info">
              <div className="video-title">Abundancia y enfermedades</div>
              <div className="video-status">
                <div 
                  className={`status-checkbox ${checkedItems[4] ? 'checked' : ''}`}
                  onClick={() => handleCheckboxClick(4)}
                ></div>
                <div className="status-plus-circle" onClick={() => handlePlusClick(4)}>
                  <span className="plus-icon">+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Audio Card 6 */}
          <div className="video-card">
            <div className="video-thumbnail">
              <div className="audio-icon">♪</div>
            </div>
            <div className="video-info">
              <div className="video-title">Abundancia y enfermedades</div>
              <div className="video-status">
                <div 
                  className={`status-checkbox ${checkedItems[5] ? 'checked' : ''}`}
                  onClick={() => handleCheckboxClick(5)}
                ></div>
                <div className="status-plus-circle" onClick={() => handlePlusClick(5)}>
                  <span className="plus-icon">+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Overlay */}
      {showModal && selectedCard !== null && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeModal}>×</button>
            <h3 className="modal-title">Abundancia y enfermedades</h3>
            <p className="modal-level">Nivel: Público</p>
            <p className="modal-description">
              Este video explora la relación entre la abundancia y las enfermedades, 
              proporcionando insights valiosos sobre cómo mantener la salud física y mental.
            </p>
            <div className="modal-actions">
              <div className="modal-checkbox-container">
                <div 
                  className="modal-checkbox"
                  onClick={handleModalCheckboxClick}
                ></div>
                <span className="modal-checkbox-text">Marcar como completado</span>
              </div>
              <div className="modal-minus"></div>
            </div>
          </div>
        </div>
      )}
      
      <FooterSection />
    </div>
  );
}
