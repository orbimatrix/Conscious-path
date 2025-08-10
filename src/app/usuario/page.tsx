'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '../components/LoadingSpinner';
import UserProfileInfo from '../components/UserProfileInfo';
import UserProfilePicture from '../components/UserProfilePicture';
import NotificationsSection from '../components/NotificationsSection';
import QuoteOfTheDay from '../components/QuoteOfTheDay';
import MessagesSection from '../components/MessagesSection';
import UnifiedInfoSection from '../components/UnifiedInfoSection';
import ActionButtons from '../components/ActionButtons';
import ContactFormSection from '../components/ContactFormSection';
import FooterSection from '../components/FooterSection';
import DailyPointsModal from '../components/DailyPointsModal';
import { UserData } from '../types/user';
import './usuario.css';

export default function UsuarioPage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTime, setCurrentTime] = useState('18:38:17');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Redirect to registration if no user exists (after Clerk has loaded)
    useEffect(() => {
        if (isLoaded && !user) {
            router.push('/registration');
        }
    }, [isLoaded, user, router]);

    // Update time every second
    React.useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
            setCurrentTime(timeString);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Fetch user data from your database
    const fetchUserData = useCallback(async () => {
        try {
            console.log('Fetching user data for clerkId:', user?.id);
            const response = await fetch(`/api/user/profile?clerkId=${user?.id}`);
            console.log('Response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('User data received:', data);
                setUserData(data);
            } else {
                const errorData = await response.json();
                console.error('API error:', errorData);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (isLoaded && user) {
            fetchUserData();
        }
    }, [isLoaded, user, fetchUserData]);

    const handleSaveProfile = async (updatedData: Partial<UserData>) => {
        try {
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    clerkId: user?.id,
                    ...updatedData
                }),
            });

            if (response.ok) {
                await fetchUserData();
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handlePointsEarned = async (points: number) => {
        try {
            const now = new Date().toISOString();
            // Update points and lastDailyClaim in the database
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    clerkId: user?.id,
                    points: (userData?.points || 0) + points,
                    lastDailyClaim: now
                }),
            });

            if (response.ok) {
                // Update local state
                setUserData(prev => prev ? { 
                    ...prev, 
                    points: (prev.points || 0) + points,
                    lastDailyClaim: now
                } : null);
            }
        } catch (error) {
            console.error('Error updating points:', error);
        }
    };

    // Show loading state only while Clerk is loading
    if (!isLoaded) {
        return <LoadingSpinner message="Cargando perfil..." />;
    }

    // Show loading state while fetching user data
    if (loading) {
        return <LoadingSpinner message="Cargando perfil..." />;
    }

    if (!user) {
        return <div>Please sign in to view your profile.</div>;
    }

    return (
        <div className="usuario-page">
            <main className="usuario-main">
                {/* Profile Section */}
                <section className="usuario-profile-section">
                    {/* Left Column - Personal Information */}
                    <UserProfileInfo
                        user={user}
                        userData={userData}
                        isEditing={isEditing}
                        currentTime={currentTime}
                        onUserDataChange={(updates) => setUserData(prev => prev ? { ...prev, ...updates } : null)}
                    />

                    {/* Right Column - Profile Picture and Points */}
                    <UserProfilePicture
                        userData={userData}
                        isEditing={isEditing}
                        onToggleEditing={() => setIsEditing(!isEditing)}
                        onSaveProfile={() => handleSaveProfile(userData || {})}
                        onCancelEditing={() => setIsEditing(false)}
                        onOpenModal={handleOpenModal}
                    />
                </section>

                {/* Notifications Section */}
                <NotificationsSection />

                {/* Quote of the Day */}
                <QuoteOfTheDay />

                {/* Messages Section */}
                <MessagesSection />

                {/* Unified Info Section */}
                <UnifiedInfoSection />

                {/* Action Buttons */}
                <ActionButtons />

                {/* Contact Form Section */}
                <ContactFormSection />

            </main>

            <FooterSection />

            {/* Daily Points Modal */}
            <DailyPointsModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onPointsEarned={handlePointsEarned}
                currentPoints={userData?.points || 0}
                lastDailyClaim={userData?.lastDailyClaim}
            />
        </div>
    );
}
