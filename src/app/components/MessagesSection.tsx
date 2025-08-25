'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import MessageModal from './MessageModal';
import { useRealtimeChat } from '@/hooks/use-realtime-chat';

export default function MessagesSection() {
  const { user } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userLevel, setUserLevel] = useState<string>('inmortal'); // Default level

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

  // Initialize Supabase real-time chat for user messages
  const { isConnected: directConnected, messages: directMessages } = useRealtimeChat({
    roomName: `direct-${user?.id}-admin`,
    username: user?.fullName || user?.username || 'User'
  });

  // Subscribe to announcements channel
  const { isConnected: announcementConnected, messages: announcementMessages } = useRealtimeChat({
    roomName: 'announcements',
    username: user?.fullName || user?.username || 'User'
  });

  // Subscribe to user's level group chat (dynamic based on user's actual level)
  const { isConnected: groupConnected, messages: groupMessages } = useRealtimeChat({
    roomName: `group-${userLevel}`,
    username: user?.fullName || user?.username || 'User'
  });

  // Debug group connection and messages
  useEffect(() => {
    if (userLevel) {
      console.log(`🔍 MessagesSection Group Debug:`, {
        userLevel,
        groupRoom: `group-${userLevel}`,
        groupConnected,
        groupMessagesCount: groupMessages.length,
        groupMessages: groupMessages.map(m => ({ id: m.id, content: m.content, user: m.user.name, time: m.createdAt }))
      });
    }
  }, [userLevel, groupConnected, groupMessages]);

  // Combine all messages and calculate unread count
  useEffect(() => {
    if (user) {
      const allMessages = [...directMessages, ...announcementMessages, ...groupMessages];
      
      console.log(`📊 MessagesSection: All messages updated:`, {
        directCount: directMessages.length,
        announcementCount: announcementMessages.length,
        groupCount: groupMessages.length,
        totalCount: allMessages.length,
        directMessages: directMessages.map(m => ({ content: m.content, user: m.user.name, time: m.createdAt })),
        announcementMessages: announcementMessages.map(m => ({ content: m.content, user: m.user.name, time: m.createdAt })),
        groupMessages: groupMessages.map(m => ({ content: m.content, user: m.user.name, time: m.createdAt }))
      });
      
      // Count unread messages that are not from the current user
      const unreadMessages = allMessages.filter(msg => 
        msg.user.name !== (user?.fullName || user?.username || 'User')
      );
      setUnreadCount(unreadMessages.length);
    }
  }, [directMessages, announcementMessages, groupMessages, user]);

  const handleMessageClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

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
      />
    </>
  );
}
