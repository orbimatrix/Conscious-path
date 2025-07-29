"use client"
import React, { useState } from "react";
import FooterSection from "../components/FooterSection";
import "./conocimiento.css";

export default function AudioVideoPage() {
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>({});

  const handleCheckboxClick = (index: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div>
      <section className="audio-video-hero">
        <img 
          src="/girl.png" 
          alt="Girl" 
          className="hero-image"
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
                <div className="status-plus">+</div>
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
                <div className="status-plus">+</div>
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
                <div className="status-plus">+</div>
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
                <div className="status-plus">+</div>
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
                <div className="status-plus">+</div>
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
                <div className="status-plus">+</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <FooterSection />
    </div>
  );
}
