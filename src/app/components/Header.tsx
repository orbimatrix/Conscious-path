import React from "react";
import Image from "next/image";

const headerStyle: React.CSSProperties = {
  background: "#fff",
  boxShadow: "0 4px 8px 0 rgba(0,0,0,0.10)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 2rem",
  height: 64,
  position: "relative",
  zIndex: 10,
};

const centerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flex: 1,
  justifyContent: "center",
  minWidth: 0,
};

const iconStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  minWidth: 32,
};

export default function Header() {
  return (
    <header className="header-root" style={headerStyle}>
      <div className="header-icon" style={iconStyle}>
        <Image src="/img/menu/menu200.svg" alt="Menu" width={32} height={32} />
      </div>
      <div className="header-center" style={centerStyle}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
          <text x="8" y="25" fontSize="28" fontWeight="bold" fill="#B8860B">$</text>
        </svg>
        <span style={{ fontWeight: 400, fontSize: 28, letterSpacing: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <span style={{ color: "#E6A14A", fontWeight: 300 }}>SENDA</span>
          <span style={{ color: "#5A5353", fontWeight: 300 }}> CONSCIENTE</span>
        </span>
      </div>
      <div className="header-icon" style={iconStyle}>
        <Image src="/profile.svg" alt="User" width={32} height={32} />
      </div>
    </header>
  );
} 