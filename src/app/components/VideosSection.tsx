import React from "react";

const contentItems = [
  { type: "video", icon: "▶" },
  { type: "video", icon: "▶" },
  { type: "video", icon: "▶" },
  { type: "video", icon: "▶" },
  { type: "audio", icon: "♪" },
  { type: "audio", icon: "♪" },
];

export default function VideosSection() {
  return (
    <section className="videos-section">
      <h2 className="videos-heading">Últimos videos y audios</h2>
      <div className="videos-grid">
        {contentItems.map((item, idx) => (
          <div className="videos-item" key={idx}>
            <div className={`videos-icon ${item.type}`}>
              <span className="videos-icon-text">{item.icon}</span>
            </div>
          </div>
        ))}
      </div>
      <button className="videos-btn">VER TODOS LOS VIDEOS</button>
    </section>
  );
} 