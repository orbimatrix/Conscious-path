'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import MessageModal from './MessageModal';
import { usePersistentChat } from '@/hooks/use-persistent-chat';

export default function MessagesSection() {
  const { user } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userLevel, setUserLevel] = useState<string>('inmortal'); // Default level
  const [lastReadTime, setLastReadTime] = useState<number>(Date.now());

  // Fetch user's level when component mounts
  useEffect(() => {
    const fetchUserLevel = async () => {
      if (user?.id) {
        try {
          const response = await fetch('/api/user/user-levels');
          if (response.ok) {
            const data = await response.json();
            if (data.userLevels && data.userLevels.length > 0) {
              // Use the first active level, or fall back to user's base level
              const activeLevel = data.userLevels.find((ul: any) => ul.isActive)?.level || data.userLevels[0]?.level;
              setUserLevel(activeLevel || 'inmortal');
            }
          }
        } catch (error) {
          console.error('Error fetching user level:', error);
          // Keep default level
        }
      }
    };

    fetchUserLevel();
  }, [user?.id]);

  // Initialize Supabase real-time chat for user messages with database persistence
  const { isConnected: directConnected, messages: directMessages } = usePersistentChat({
    roomName: `direct-${user?.id}-admin`,
    username: user?.fullName || user?.username || 'User',
    senderId: user?.id || ''
  });

  // Subscribe to announcements channel with database persistence
  const { isConnected: announcementConnected, messages: announcementMessages } = usePersistentChat({
    roomName: 'announcements',
    username: user?.fullName || user?.username || 'User',
    senderId: user?.id || ''
  });

  // Subscribe to user's level group chat with database persistence (dynamic based on user's actual level)
  const { isConnected: groupConnected, messages: groupMessages } = usePersistentChat({
    roomName: `group-${userLevel}`,
    username: user?.fullName || user?.username || 'User',
    senderId: user?.id || ''
  });

  // Calculate unread count based on last read time
  useEffect(() => {
    if (!user) return;

    const allMessages = [...directMessages, ...announcementMessages, ...groupMessages];
    
    // Count messages from other users that are newer than last read time
    const unreadMessages = allMessages.filter(msg => 
      msg.user.id !== user.id && 
      new Date(msg.createdAt).getTime() > lastReadTime
    );

    setUnreadCount(unreadMessages.length);
  }, [directMessages, announcementMessages, groupMessages, lastReadTime, user]);

  // Debug group connection and messages
  useEffect(() => {
    if (userLevel) {
      // Group connection and messages tracking (no console output)
    }
  }, [userLevel, groupConnected, groupMessages]);

  // Handle modal open - mark messages as read
  const handleMessageClick = () => {
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // Mark messages as read
  const markMessagesAsRead = useCallback(() => {
    const now = Date.now();
    setLastReadTime(now);
  }, []);

  // Check if any connection is active
  const isAnyConnected = directConnected || announcementConnected || groupConnected;

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
                isAnyConnected ? 'bg-green-500' : 'bg-red-500'
              }`}
              title={isAnyConnected ? 'Connected' : 'Disconnected'}
            />
          </div>
        </div>
      </section>

      <MessageModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose}
        onMessageSent={() => {}}
        directMessages={directMessages}
        announcementMessages={announcementMessages}
        groupMessages={groupMessages}
        isConnected={isAnyConnected}
        userLevel={userLevel}
        onMessagesRead={markMessagesAsRead}
      />
    </>
  );
}
