'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import MessageModal from './MessageModal';
import { useSocket } from '@/lib/socket-client';

export default function MessagesSection() {
  const { user } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initialize Socket.IO for real-time messaging
  const { isConnected, messages } = useSocket(user?.id);

  useEffect(() => {
    if (messages && user) {
      // Count unread messages that are not from the current user
      const unreadMessages = messages.filter(msg => 
        !msg.isRead && msg.senderId !== user.id
      );
      setUnreadCount(unreadMessages.length);
    }
  }, [messages, user]);

 

  const handleMessageClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    // Refresh unread count when modal closes
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
        onMessageSent={() => {}} // No need for callback since it's real-time
      />
    </>
  );
}
