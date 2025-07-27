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
    <section style={{ width: "100%", maxWidth: 900, margin: "32px auto 0 auto", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.10)" }}>
      <div style={{
        width: "100%",
        aspectRatio: "16/7",
        borderRadius: 8,
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 2px 8px rgb(253, 253, 253)",
        background: "#eee"
      }}>
        <Image
          src={images[active]}
          alt={`Carousel image ${active + 1}`}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 700px) 100vw, 700px"
        />
        {/* Dots inside image container, absolutely positioned */}
        <div style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 24,
          display: "flex",
          justifyContent: "center",
          gap: 32,
          zIndex: 2
        }}>
          {images.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setActive(idx)}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "none",
                background: idx === active ? "#5A7DBE" : "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                outline: idx === active ? "2px solid #5A7DBE" : "none",
                cursor: "pointer",
                transition: "background 0.2s, outline 0.2s"
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 