"use client"
import React, { useState } from "react";
import Image from "next/image";

const images = [
  "/fotos/tomb.jpg",
  "/fotos/tomb.jpg",
  "/fotos/tomb.jpg"

];

export default function CarouselSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="carousel-section">
      <div className="carousel-image-container">
        <Image
          src={images[active]}
          alt={`Carousel image ${active + 1}`}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 900px) 100vw, 900px"
        />
        {/* Dots inside image container, absolutely positioned */}
        <div className="carousel-dots">
          {images.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setActive(idx)}
              className="carousel-dot"
              style={{
                background: idx === active ? "#5A7DBE" : "#fff",
                outline: idx === active ? "2px solid #5A7DBE" : "none"
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 