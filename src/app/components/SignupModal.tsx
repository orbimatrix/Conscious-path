'use client';

import React from 'react';
import Link from 'next/link';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export default function SignupModal({ 
  isOpen, 
  onClose, 
  title = "Inicia sesión para continuar",
  message = "Necesitas iniciar sesión para acceder a esta función."
}: SignupModalProps) {
  if (!isOpen) return null;

  return (
    <div className="signup-modal-overlay" onClick={onClose}>
      <div className="signup-modal" onClick={(e) => e.stopPropagation()}>
        <button className="signup-modal-close" onClick={onClose}>×</button>
        
        <div className="signup-modal-content">
          <h2 className="signup-modal-title">{title}</h2>
          <p className="signup-modal-message">{message}</p>
          
                     <div className="signup-modal-actions">
             <Link href="/registration" className="signup-modal-button primary">
               Registrarse
             </Link>
             <button className="signup-modal-button secondary" onClick={onClose}>
               Cancelar
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}
