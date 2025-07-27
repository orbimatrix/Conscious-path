"use client"
import React, { useState } from "react";
import Image from "next/image";

const testimonials = [
  {
    img: "/lisa1.png",
    quote: "Me ha gustado mucho",
    name: "Lisa",
  },
  {
    img: "/lisa2.png",
    quote: "Me ha gustado mucho",
    name: "Misa",
  },
  {
    img: "/lisa3.png",
    quote: "Me ha gustado mucho",
    name: "Wisa",
  },
  {
    img: "/lisa1.png",
    quote: "Me ha gustado mucho",
    name: "Risa",
  },
  {
    img: "/lisa2.png",
    quote: "Me ha gustado mucho",
    name: "Tisa",
  },
  {
    img: "/lisa3.png",
    quote: "Me ha gustado mucho",
    name: "Yisa",
  },
  {
    img: "/lisa1.png",
    quote: "Me ha gustado mucho",
    name: "Pisa",
  },
  {
    img: "/lisa2.png",
    quote: "Me ha gustado mucho",
    name: "Lisa",
  },
  {
    img: "/lisa3.png",
    quote: "Me ha gustado mucho",
    name: "Lisa",
  },
];

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);

  // Get current set of 3 testimonials for desktop
  const getCurrentSet = () => {
    const startIndex = active * 3;
    return testimonials.slice(startIndex, startIndex + 3);
  };

  return (
    <section className="testimonials-section">
      <h2 className="testimonials-heading">Testimonios</h2>
      <div className="testimonials-cards-row">
        {getCurrentSet().map((t, idx) => (
          <div className="testimonials-card" key={idx}>
            <div className="testimonials-img-wrapper">
              <Image src={t.img} alt={t.name} width={96} height={96} className="testimonials-img" />
            </div>
            <div className="testimonials-quote">"{t.quote}"</div>
            <div className="testimonials-name">{t.name}</div>
          </div>
        ))}
      </div>
      <div className="testimonials-dots">
        {[0, 1, 2].map((idx) => (
          <button
            key={idx}
            className="testimonials-dot"
            style={{ background: idx === active ? "#7a93b8" : "#fff" }}
            aria-label={`Go to testimonial set ${idx + 1}`}
            onClick={() => setActive(idx)}
          />
        ))}
      </div>
    </section>
  );
} 