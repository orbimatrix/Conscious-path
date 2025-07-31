import React from "react";
import Image from "next/image";

const items = [
  { icon: <Image src="/img/verdad.png" alt="Verdad" width={32} height={32} />, text: "Descubrir la verdad" },
  { icon: <Image src="/img/dinero.png" alt="Dinero" width={32} height={32} />, text: "Atraer la abundancia" },
  { icon: <Image src="/img/salud.png" alt="Salud" width={32} height={32} />, text: "Bienestar esencial" },
  { icon: <Image src="/img/demonios.png" alt="Demonios" width={32} height={32} />, text: "Adiós a sus demonios" },
  { icon: <Image src="/img/reencarnar.png" alt="Reencarnación" width={32} height={32} />, text: "Reencarnación" },
];

export default function PathAwakeningSection() {
  return (
    <section className="path-awakening-section">
      <h2 className="path-awakening-heading">SIGA LA SENDA</h2>
      <div className="path-awakening-subheading">del despertar consciente</div>
      <div className="path-awakening-underline" />
      <div className="path-awakening-list-container">
        <ul className="path-awakening-list">
          {items.map((item, idx) => (
            <li className="path-awakening-item" key={idx}>
              <span className="path-awakening-icon-bg"><span className="path-awakening-icon">{item.icon}</span></span>
              <span className="path-awakening-text">{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
} 