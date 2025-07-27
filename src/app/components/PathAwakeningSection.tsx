import React from "react";

const items = [
  { icon: <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="#fff" /><rect x="10" y="10" width="12" height="12" stroke="#222" strokeWidth="2" fill="none" /></svg>, text: "Descubrir la verdad" },
  { icon: <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="#fff" /><circle cx="16" cy="16" r="6" stroke="#222" strokeWidth="2" fill="none" /></svg>, text: "Atraer la abundancia" },
  { icon: <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="#fff" /><path d="M16 10a6 6 0 1 1 0 12a6 6 0 0 1 0-12z" stroke="#222" strokeWidth="2" fill="none" /></svg>, text: "Bienestar esencial" },
  { icon: <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="#fff" /><path d="M12 20c2-2 6-2 8 0" stroke="#222" strokeWidth="2" fill="none" /><circle cx="12" cy="14" r="1" fill="#222" /><circle cx="20" cy="14" r="1" fill="#222" /></svg>, text: "Adiós a sus demonios" },
  { icon: <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="#fff" /><path d="M12 16h8m-4-4v8" stroke="#222" strokeWidth="2" fill="none" /></svg>, text: "Reencarnación" },
];

export default function PathAwakeningSection() {
  return (
    <section className="path-awakening-section">
      <h2 className="path-awakening-heading">SIGA LA SENDA</h2>
      <div className="path-awakening-subheading">del despertar consciente</div>
      <div className="path-awakening-underline" />
      <ul className="path-awakening-list">
        {items.map((item, idx) => (
          <li className="path-awakening-item" key={idx}>
            <span className="path-awakening-icon">{item.icon}</span>
            <span className="path-awakening-text">{item.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
} 