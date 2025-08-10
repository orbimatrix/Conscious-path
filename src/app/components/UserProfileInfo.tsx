'use client';

import React from 'react';
import { UserResource } from '@clerk/nextjs';
import { UserData } from '../types/user';

interface UserProfileInfoProps {
    user: UserResource;
    userData: UserData | null;
    isEditing: boolean;
    currentTime: string;
    onUserDataChange: (updates: Partial<UserData>) => void;
}

export default function UserProfileInfo({ 
    user, 
    userData, 
    isEditing, 
    currentTime, 
    onUserDataChange 
}: UserProfileInfoProps) {
    return (
        <div className="usuario-info-container">
            <div className="usuario-info">
                <div className="usuario-info-item">
                    <span className="usuario-info-label">Nombre:</span>
                    <span className="usuario-info-value">{user.fullName}</span>
                </div>
                <div className="usuario-info-item">
                    <span className="usuario-info-label">Email:</span>
                    <span className="usuario-info-value">{user.primaryEmailAddress?.emailAddress}</span>
                </div>
                <div className="usuario-info-item">
                    <span className="usuario-info-label">Fecha de nacimiento:</span>
                    {isEditing ? (
                        <input
                            type="text"
                            className="usuario-info-input"
                            defaultValue={userData?.birthDate || ''}
                            placeholder="DD/MM/YYYY"
                            onChange={(e) => onUserDataChange({ birthDate: e.target.value })}
                        />
                    ) : (
                        <span className="usuario-info-value">{userData?.birthDate || 'No especificado'}</span>
                    )}
                </div>
                <div className="usuario-info-item">
                    <span className="usuario-info-label">Ciudad:</span>
                    {isEditing ? (
                        <input
                            type="text"
                            className="usuario-info-input"
                            defaultValue={userData?.city || ''}
                            onChange={(e) => onUserDataChange({ city: e.target.value })}
                        />
                    ) : (
                        <span className="usuario-info-value">{userData?.city || 'No especificado'}</span>
                    )}
                </div>
            </div>

            <div className="usuario-info-item">
                <span className="usuario-info-label">Time zone / Real time:</span>
                <div className="usuario-time-display">{currentTime}</div>
            </div>

            <div className="usuario-contact">
                <div className="usuario-info-item">
                    <span className="usuario-info-label">Telegram:</span>
                    {isEditing ? (
                        <input
                            type="text"
                            className="usuario-info-input"
                            defaultValue={userData?.telegram || ''}
                            onChange={(e) => onUserDataChange({ telegram: e.target.value })}
                        />
                    ) : (
                        <span className="usuario-info-value">{userData?.telegram || 'No especificado'}</span>
                    )}
                </div>
                <div className="usuario-info-item">
                    <span className="usuario-info-label">Signal:</span>
                    {isEditing ? (
                        <input
                            type="text"
                            className="usuario-info-input"
                            defaultValue={userData?.signal || ''}
                            onChange={(e) => onUserDataChange({ signal: e.target.value })}
                        />
                    ) : (
                        <span className="usuario-info-value">{userData?.signal || 'No especificado'}</span>
                    )}
                </div>
            </div>

            <div className="usuario-credentials">
                <div className="usuario-info-item">
                    <span className="usuario-info-label">Usuario:</span>
                    <span className="usuario-info-value">{userData?.username || 'No especificado'}</span>
                </div>
            </div>

            <div className="usuario-info-item">
                <span className="usuario-info-label">Tu nivel:</span>
                <span className="usuario-info-value">{userData?.level || 'Inmortal'}</span>
            </div>
        </div>
    );
}
