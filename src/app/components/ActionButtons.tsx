'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import CorrectionsModal from './CorrectionsModal';
import toast from 'react-hot-toast';
import { Correction } from '@/lib/db/schema';


export default function ActionButtons() {
    const router = useRouter();
    const { user } = useUser();
    const [correctionsCount, setCorrectionsCount] = useState(0);
    const [showCorrectionsModal, setShowCorrectionsModal] = useState(false);

    const handleAporteClick = () => {
        router.push('/aportes');
    };

    const handleCorrectionsClick = () => {
        setShowCorrectionsModal(true);
    };

    const fetchCorrectionsCount = useCallback(async () => {
        try {
            const response = await fetch('/api/user/corrections');
            if (response.ok) {
                const corrections = await response.json();
                const unresolvedCount = corrections.filter((c: Correction ) => !c.isResolved).length;
                setCorrectionsCount(unresolvedCount);
            } else {
                toast.error('Error fetching corrections');

                console.log('Response not ok:', response.status);
            }
        } catch (error) {
            toast.error('Error fetching corrections');
            console.log('Error fetching corrections count:', error);
        }
    }, [user?.id]);

    useEffect(() => {
        if (user) {
            fetchCorrectionsCount();
        }
    }, [user, fetchCorrectionsCount]);

    return (
        <>
            <section className="usuario-actions-section">
                <button className="usuario-action-button"
                    onClick={handleAporteClick}
                >
                    ENVIAR APORTE A BENEC
                </button>
                <button 
                    className="usuario-action-button"
                    onClick={handleCorrectionsClick}
                >
                    CORRECCIONES
                    {correctionsCount > 0 ? (
                        <div className="usuario-notification-badge">{correctionsCount}</div>
                    ) : (
                        <div className="usuario-ok-badge">OK</div>
                    )}
                </button>
            </section>

            <CorrectionsModal 
                isOpen={showCorrectionsModal}
                onClose={() => setShowCorrectionsModal(false)}
            />
        </>
    );
}
