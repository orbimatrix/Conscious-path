"use client"
import React from "react";
import { useRouter } from "next/navigation";

export default function ExclusiveContentSection() {
  const router = useRouter();
  return (
    <section className="exclusive-content-section">
      <p>Aquí dispone de las soluciones y los conocimientos más  exclusivos, de forma inmediata:</p>
      <p>Atención personalizada para solucionar sus conflictos y problemas personales.</p>
      <p>Vídeos y Audios para su crecimiento personal y espiritual con información oculta o censurada.</p>
      <p>Asistencia exclusiva para limpiar las cargas Kármicas y lograr la Reencarnación Exitosa.</p>
      <button 
        className="exclusive-content-btn"
        onClick={() => router.push('/conocimiento')}
      >
        Conozca todo el contenido
      </button>
    </section>
  );
} 