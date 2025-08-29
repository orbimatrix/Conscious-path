"use client"
import React from "react";
import { useRouter } from "next/navigation";

export default function ConsciousLifeSection() {
  const router = useRouter();
  return (
    <section className="conscious-life-section">
      <h2 className="conscious-life-heading">SU VIDA CONSCIENTE</h2>
      <button 
        className="conscious-life-btn"
        onClick={() => router.push('/registration')}
      >
        <span className="conscious-life-btn-main">Acceda ahora</span>
        <br />
        <span className="conscious-life-btn-sub">y descubra los secretos</span>
      </button>
    </section>
  );
} 