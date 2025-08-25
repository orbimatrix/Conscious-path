'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import type { News } from '@/lib/db/schema';

export default function NotificationsSection() {
    const { user } = useUser();
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNews = useCallback(async () => {
        try {
            const response = await fetch('/api/admin/news');
            if (response.ok) {
                const data = await response.json();
                // Filter news: show general news + news targeted to current user
                const relevantNews = data.news.filter((item: News) => 
                    !item.targetUserId || // General news
                    item.targetUserId === user?.id // News targeted to current user
                );
                setNews(relevantNews);
            }
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        if (user) {
            fetchNews();
        }
    }, [user]);

    if (loading) {
        return (
            <section className="usuario-notifications-section">
                <div className="usuario-notifications-container">
                    <div className="usuario-notifications-bar">
                        <span className="usuario-notifications-label">AVISOS:</span>
                    </div>
                </div>
            </section>
        );
    }

    if (news.length === 0) {
        return (
            <section className="usuario-notifications-section">
                <div className="usuario-notifications-container">
                    <div className="usuario-notifications-bar">
                        <span className="usuario-notifications-label">AVISOS:</span>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="usuario-notifications-section">
            <div className="usuario-notifications-container">
                <div className="usuario-notifications-bar">
                    <span className="usuario-notifications-label">AVISOS:</span>
                </div>
                {news.map((item, index) => (
                    <div key={item.id} className="usuario-notifications-news-item">
                        <div className="usuario-notifications-center">
                            <div className="usuario-notifications-content">
                                <span className="usuario-notifications-title">{item.title}</span>
                                <span className="usuario-notifications-text">{item.content}</span>
                               
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
