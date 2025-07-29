"use client"
import React, { useState } from "react";
import Image from "next/image";
import FooterSection from "../components/FooterSection";
import "./conocimiento.css";

export default function AudioVideoPage() {
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>({});
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const handleCheckboxClick = (index: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
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
    if (selectedCard !== null) {
      setCheckedItems(prev => ({
        ...prev,
        [selectedCard]: !prev[selectedCard]
      }));
    }
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
        <Image 
          src="/girl.png" 
          alt="Girl" 
          className="hero-image"
          width={800}
          height={600}
        />
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
                <div className="status-plus" onClick={() => handlePlusClick(0)}>+</div>
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
                <div className="status-plus" onClick={() => handlePlusClick(1)}>+</div>
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
                <div className="status-plus" onClick={() => handlePlusClick(2)}>+</div>
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
                <div className="status-plus" onClick={() => handlePlusClick(3)}>+</div>
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
                <div className="status-plus" onClick={() => handlePlusClick(4)}>+</div>
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
                <div className="status-plus" onClick={() => handlePlusClick(5)}>+</div>
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
            <div className="modal-title">{videoData[selectedCard].title}</div>
            <div className="modal-level">Nivel: {videoData[selectedCard].level}</div>
            <div className="modal-description">{videoData[selectedCard].description}</div>
            <div className="modal-actions">
              <div className="modal-checkbox-container">
                <div className="modal-checkbox" onClick={handleModalCheckboxClick}></div>
                <div className="modal-checkbox-text">Marcar como visto</div>
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
