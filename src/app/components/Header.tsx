import React from "react";
import Image from "next/image";

const Header = () => (
  <header style={{
    background: "#fff",
    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.10)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 2rem",
    height: 64,
    position: "relative",
    zIndex: 10,
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <Image src="/window.svg" alt="Menu" width={32} height={32} />
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Image src="/file.svg" alt="Logo" width={32} height={32} />
      <span style={{ fontWeight: 400, fontSize: 28, letterSpacing: 1 }}>
        <span style={{ color: "#E6A14A", fontWeight: 300 }}>SENDA</span>
        <span style={{ color: "#5A5353", fontWeight: 300 }}> CONSCIENTE</span>
      </span>
    </div>
    <div>
      <Image src="/profile.svg" alt="User" width={32} height={32} />
    </div>
  </header>
);

export default Header; 