'use client';

import React from 'react';
import { UserButton } from '@clerk/nextjs';
import { UserData } from '../types/user';

interface UserProfilePictureProps {
    userData: UserData | null;
    isEditing: boolean;
    onToggleEditing: () => void;
    onSaveProfile: () => void;
    onCancelEditing: () => void;
    onOpenModal: () => void;
}

export default function UserProfilePicture({
    userData,
    isEditing,
    onToggleEditing,
    onSaveProfile,
    onCancelEditing,
    onOpenModal
}: UserProfilePictureProps) {
    const canClaim = () => {
        if (!userData?.lastDailyClaim) return true;
        const lastClaim = new Date(userData.lastDailyClaim);
        const now = new Date();
        const timeDiff = now.getTime() - lastClaim.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        return hoursDiff >= 24;
    };

    const getClaimButtonText = () => {
        if (!userData?.lastDailyClaim) return 'Reclamar puntos de hoy';
        const lastClaim = new Date(userData.lastDailyClaim);
        const now = new Date();
        const timeDiff = now.getTime() - lastClaim.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        if (hoursDiff >= 24) {
            return 'Reclamar puntos de hoy';
        } else {
            const nextClaim = new Date(lastClaim.getTime() + 24 * 60 * 60 * 1000);
            const remainingTime = nextClaim.getTime() - now.getTime();
            const hours = Math.floor(remainingTime / (1000 * 60 * 60));
            const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            return `Próximo claim en ${hours}h ${minutes}m`;
        }
    };

    return (
        <div className="usuario-profile-picture">
            {/* Replace placeholder with Clerk UserButton */}
            <div className="usuario-profile-clerk">
                <UserButton 
                    showName={false}
                />
            </div>
            
            <button 
                className="usuario-edit-button"
                onClick={onToggleEditing}
            >
                <img src="/img/editor.png" alt="Editar" width="40" height="40" />
            </button>
            
            <div className="usuario-points">{userData?.points || 0} Puntos</div>
            
            <button 
                className={`usuario-claim-button ${canClaim() ? 'can-claim' : 'cooldown'}`}
                onClick={onOpenModal}
            >
                {getClaimButtonText()}
            </button>
            
            {/* Save/Cancel buttons only show when editing */}
            {isEditing && (
                <div className="usuario-edit-actions">
                    <button 
                        className="usuario-save-button"
                        onClick={onSaveProfile}
                    >
                        Guardar
                    </button>
                    <button 
                        className="usuario-cancel-button"
                        onClick={onCancelEditing}
                    >
                        Cancelar
                    </button>
                </div>
            )}
        </div>
    );
}
