'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'react-hot-toast';
import { PersistentChatMessage, usePersistentChat } from '@/hooks/use-persistent-chat';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMessageSent: () => void;
  directMessages: PersistentChatMessage[];
  announcementMessages: PersistentChatMessage[];
  groupMessages: PersistentChatMessage[];
  isConnected: boolean;
  userLevel: string;
  onMessagesRead?: () => void; // Added this prop
}

export default function MessageModal({ 
  isOpen, 
  onClose, 
  onMessageSent, 
  directMessages, 
  announcementMessages, 
  groupMessages, 
  isConnected, 
  userLevel, 
  onMessagesRead 
}: MessageModalProps) {
  const { user } = useUser();
  
  // Hook for direct messages with database persistence
  const { sendMessage: sendDirectMessage, isLoading: isDirectLoading } = usePersistentChat({
    roomName: `direct-${user?.id}-admin`,
    username: user?.fullName || user?.username || 'User',
    senderId: user?.id || ''
  });

  // Hook for group messages with database persistence
  const { sendMessage: sendGroupMessage, isLoading: isGroupLoading } = usePersistentChat({
    roomName: `group-${userLevel}`,
    username: user?.fullName || user?.username || 'User',
    senderId: user?.id || ''
  });
  
  const [messages, setMessages] = useState<PersistentChatMessage[]>([]);
  const [localMessages, setLocalMessages] = useState<PersistentChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [adminInfo, setAdminInfo] = useState<{ fullName?: string; username?: string } | null>(null);
  const [viewMode, setViewMode] = useState<'direct' | 'announcements' | 'group'>('direct');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Determine if we're currently loading messages
  const isLoading = (viewMode === 'direct' && isDirectLoading) || 
                   (viewMode === 'group' && isGroupLoading);

  // Set user level when component mounts
  useEffect(() => {
    if (user) {
      // setUserLevel('inmortal'); // Default level
    }
  }, [user]);

  // Update local messages when realtime messages change
  useEffect(() => {
    let currentMessages: PersistentChatMessage[] = [];
    
    switch (viewMode) {
      case 'direct':
        currentMessages = directMessages;
        break;
      case 'announcements':
        currentMessages = announcementMessages;
        break;
      case 'group':
        currentMessages = groupMessages;
        break;
    }
    
    // Combine real-time messages with local messages
    const allMessages = [...currentMessages, ...localMessages];
    
    // Remove duplicates based on content and user (for local messages)
    const uniqueMessages = allMessages.filter((message, index, self) => {
      if (localMessages.some(lm => lm.id === message.id)) {
        // This is a local message, keep it
        return true;
      }
      // This is a real-time message, check for duplicates
      return index === self.findIndex(m => 
        m.id === message.id || 
        (m.content === message.content && 
         m.user.name === message.user.name &&
         Math.abs(new Date(m.createdAt).getTime() - new Date(message.createdAt).getTime()) < 1000)
      );
    });
    
    // Always update messages, even if empty
    setMessages(uniqueMessages);
    
    if (uniqueMessages.length > 0) {
      setTimeout(() => scrollToBottom(), 100);
    }
  }, [directMessages, announcementMessages, groupMessages, localMessages, viewMode]);

  // Mark messages as read when modal opens
  useEffect(() => {
    if (isOpen && onMessagesRead) {
      onMessagesRead();
    }
  }, [isOpen, onMessagesRead]);

  // Get admin information for display
  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const response = await fetch('/api/admin/users');
        if (response.ok) {
          const data = await response.json();
          const adminUser = data.users.find((u: any) => u.publicMetadata?.role === 'admin');
          if (adminUser) {
            setAdminInfo({
              fullName: adminUser.fullName,
              username: adminUser.username
            });
          }
        }
      } catch (error) {
        console.error('Error fetching admin info:', error);
      }
    };

    if (isOpen) {
      fetchAdminInfo();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !isConnected) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setSending(true);

    // Create the message object
    const userMessage: PersistentChatMessage = {
      id: crypto.randomUUID(),
      content: messageContent,
      user: {
        name: user?.fullName || user?.username || 'User',
        id: user?.id || ''
      },
      createdAt: new Date().toISOString(),
      messageType: viewMode === 'direct' ? 'direct' : 'group',
      visibilityLevel: viewMode === 'group' ? userLevel : undefined
    };

    // Immediately add to local messages for instant display
    setLocalMessages(prev => [...prev, userMessage]);

    try {
      // Send via persistent chat hook (which handles both database and real-time)
      if (isConnected) {
        if (viewMode === 'direct') {
          await sendDirectMessage(messageContent);
          onMessageSent();
          toast.success('Direct message sent successfully!');
        } else if (viewMode === 'group') {
          await sendGroupMessage(messageContent);
          onMessageSent();
          toast.success('Group message sent successfully!');
        } else {
          toast.error('You can only send messages in direct or group chat mode');
        }
      } else {
        console.error('Chat not connected, cannot send message');
        toast.error('Not connected. Please try again.');
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove the message from local state if sending failed
      setLocalMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
      setNewMessage(messageContent);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long'
      });
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const groupMessagesByDate = (messages: PersistentChatMessage[]) => {
    const groups: { [key: string]: PersistentChatMessage[] } = {};
    
    messages.forEach(message => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return Object.entries(groups).map(([date, messages]) => ({
      date,
      messages: messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[80vh] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Mensajes</h2>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-xs sm:text-sm text-gray-600">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
              {isLoading && (
                <div className="flex items-center gap-2 ml-2">
                  <div className="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                  <span className="text-xs text-blue-600">Loading...</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl sm:text-2xl font-bold p-1"
            >
              ×
            </button>
          </div>
        </div>

        {/* View Mode Selector */}
        <div className="px-3 sm:px-4 py-2 border-b border-gray-200">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setViewMode('direct');
                setLocalMessages([]); // Clear local messages when switching modes
              }}
              className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium whitespace-nowrap ${
                viewMode === 'direct'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Direct Messages
            </button>
            <button
              onClick={() => {
                setViewMode('announcements');
                setLocalMessages([]); // Clear local messages when switching modes
              }}
              className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium whitespace-nowrap ${
                viewMode === 'announcements'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Announcements
            </button>
            <button
              onClick={() => {
                setViewMode('group');
                setLocalMessages([]); // Clear local messages when switching modes
              }}
              className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium whitespace-nowrap ${
                viewMode === 'group'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Group Chat ({userLevel})
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 max-h-[60vh]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-500 text-sm">Loading messages...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              {viewMode === 'direct' 
                ? 'No direct messages yet' 
                : viewMode === 'announcements' 
                ? 'No announcements yet'
                : 'No group messages yet'
              }
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {(() => {
                const groupedMessages = groupMessagesByDate(messages);
                return groupedMessages;
              })().map((dateGroup, dateIndex) => (
                <div key={dateIndex} className="space-y-3 sm:space-y-4">
                  {/* Date Separator */}
                  <div className="flex justify-center">
                    <div className="bg-gray-100 px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm text-gray-600 font-medium">
                      {formatDateHeader(dateGroup.date)}
                    </div>
                  </div>
                  
                  {/* Messages for this date */}
                  {dateGroup.messages.map((message) => {
                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.user.id === user?.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {message.user.id !== user?.id && (
                          <div className="flex flex-col items-center mr-2 sm:mr-3">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center">
                              <span className="text-gray-600 text-xs sm:text-sm font-medium">
                                {adminInfo?.fullName?.charAt(0) || adminInfo?.username?.charAt(0) || 'A'}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1 text-center hidden sm:block">
                              {adminInfo?.fullName || adminInfo?.username || 'Admin'}
                            </div>
                          </div>
                        )}
                        
                        <div
                          className={`max-w-[75%] sm:max-w-[70%] p-2 sm:p-3 rounded-2xl ${
                            message.user.id === user?.id
                              ? 'bg-orange-200 text-gray-800 rounded-br-md'
                              : 'bg-gray-100 text-gray-800 rounded-bl-md'
                          }`}
                        >
                          <div className="text-xs sm:text-sm leading-relaxed">{message.content}</div>
                          <div className="text-xs text-gray-500 mt-1 sm:mt-2 text-right flex items-center gap-1">
                            {formatTime(message.createdAt)}
                          </div>
                        </div>
                        
                        {message.user.id === user?.id && (
                          <div className="flex flex-col items-center ml-2 sm:ml-3">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center">
                              <span className="text-white text-xs sm:text-sm font-medium">
                                {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1 text-center hidden sm:block">
                              {user?.fullName || user?.username || 'You'}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area - Show for direct messages and group chat */}
        {(viewMode === 'direct' || viewMode === 'group') && (
          <div className="p-3 sm:p-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={viewMode === 'direct' ? "Escribe tu mensaje..." : "Type your group message..."}
                disabled={sending || !isConnected || isLoading}
                className="flex-1 px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-black text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={sending || !newMessage.trim() || !isConnected || isLoading}
                className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm whitespace-nowrap"
              >
                {sending ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
