'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import MessageModal from './MessageModal';
import { useSocket } from '@/lib/socket-client';

interface Message {
  id: number;
  content: string;
  messageType: string;
  visibilityLevel?: string;
  isRead: boolean;
  createdAt: string;
  sender: {
    clerkId: string;
    fullName?: string;
    username?: string;
    email?: string;
  };
}

export default function MessagesSection() {
  const { user } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize Socket.IO for real-time messaging
  const { isConnected } = useSocket(user?.id);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('/api/user/messages');
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleMessageClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    // Refresh unread count when modal closes
    fetchUnreadCount();
  };

  return (
    <>
      <section className="usuario-messages-section">
        <div className="usuario-messages-display" onClick={handleMessageClick}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <span>MENSAJES</span>
            {unreadCount > 0 && (
              <div className="usuario-notification-badge">{unreadCount}</div>
            )}
            {/* Connection status indicator */}
            <div 
              className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}
              title={isConnected ? 'Connected' : 'Disconnected'}
            />
          </div>
        </div>
      </section>

      <MessageModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose}
        onMessageSent={fetchUnreadCount}
      />
    </>
  );
}
