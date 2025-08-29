'use client';

import React, { useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import ContactSection from './ContactSection';
import './ContactFormSection.css';

export default function ContactFormSection() {
    const { user } = useUser();
    const { signOut } = useClerk();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [deleteStatus, setDeleteStatus] = useState<{
        type: 'success' | 'error' | null;
        message: string;
    }>({ type: null, message: '' });

    const handleDeleteAccount = async () => {
        if (!user) return;
        
        setIsDeleting(true);
        setDeleteStatus({ type: null, message: '' });

        try {
            // Delete user data from database and Clerk via API
            const response = await fetch('/api/user/delete-account', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id
                }),
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Error al eliminar la cuenta');
            }

            setDeleteStatus({ type: 'success', message: 'Cuenta eliminada exitosamente' });
            
            // Sign out and redirect after successful deletion
            setTimeout(async () => {
                await signOut();
                window.location.href = '/';
            }, 2000);

        } catch (error) {
            console.error('Error deleting account:', error);
            setDeleteStatus({ 
                type: 'error', 
                message: error instanceof Error ? error.message : 'Error al eliminar la cuenta' 
            });
        } finally {
            setIsDeleting(false);
            setShowConfirmation(false);
        }
    };

    const confirmDelete = () => {
        setShowConfirmation(true);
    };

    const cancelDelete = () => {
        setShowConfirmation(false);
        setDeleteStatus({ type: null, message: '' });
    };

    return (
        <section className="usuario-contact-form-section">
            <ContactSection />
            
            {user && (
                <div className="delete-account-section">
                    <button 
                        className="usuario-delete-account-button"
                        onClick={confirmDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Eliminando...' : 'Dar de baja esta cuenta'}
                    </button>
                    
                    {deleteStatus.type && (
                        <div className={`delete-status ${deleteStatus.type}`}>
                            {deleteStatus.message}
                        </div>
                    )}
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="confirmation-overlay">
                    <div className="confirmation-modal">
                        <h3>Confirmar eliminación de cuenta</h3>
                        <p>¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.</p>
                        <p><strong>Todos tus datos, mensajes y configuraciones serán eliminados permanentemente.</strong></p>
                        
                        <div className="confirmation-actions">
                            <button 
                                className="cancel-button"
                                onClick={cancelDelete}
                                disabled={isDeleting}
                            >
                                Cancelar
                            </button>
                            <button 
                                className="delete-button"
                                onClick={handleDeleteAccount}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Eliminando...' : 'Sí, eliminar mi cuenta'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
