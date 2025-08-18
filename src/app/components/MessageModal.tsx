'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'react-hot-toast';
import { Message } from '@/lib/socket-client';
import { useSocket } from '@/lib/socket-client';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMessageSent: () => void;
}

export default function MessageModal({ isOpen, onClose, onMessageSent }: MessageModalProps) {
  const { user } = useUser();
  const { socket, isConnected, sendMessage: sendSocketMessage, joinLevel, startTyping, stopTyping, subscribeToMessages, messages: socketMessages } = useSocket(user?.id);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [userLevel, setUserLevel] = useState<string | null>(null);
  const [adminInfo, setAdminInfo] = useState<{ fullName?: string; username?: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const announcementsSubscribedRef = useRef(false);

  // Join user's level room when connected
  useEffect(() => {
    if (isConnected && user) {
      if (!userLevel) {
        console.log('Joining default level room: inmortal');
        setUserLevel('inmortal');
        joinLevel('inmortal');
      }
    }
  }, [isConnected, user, joinLevel, userLevel]);

  // Subscribe to messages when component mounts
  useEffect(() => {
    if (isConnected && user?.id) {
      console.log('Setting up Ably message subscription for user:', user.id);
      
      const isAdmin = user?.publicMetadata?.role === 'admin';
      
      if (isAdmin) {
        console.log('Admin user - will subscribe to user messages when selected');
      } else {
        subscribeToMessages('admin');
        
        // Subscribe to announcements channel (only once)
        if (socket && !announcementsSubscribedRef.current) {
          const announcementsChannel = socket.channels.get('announcements');
          announcementsSubscribedRef.current = true;
          announcementsChannel.subscribe('announcement', (message: any) => {
            console.log('Announcement received:', message);
            const newMessage: Message = {
              id: Date.now() + Math.random(),
              content: message.data.content,
              messageType: 'announcement',
              isRead: false,
              createdAt: message.data.timestamp,
              senderId: 'admin',
              receiverId: 'all',
            };
            
            // Prevent duplicates
            setMessages(prev => {
              const messageExists = prev.some(msg => 
                msg.content === newMessage.content && 
                msg.senderId === newMessage.senderId && 
                msg.messageType === newMessage.messageType &&
                Math.abs(new Date(msg.createdAt).getTime() - new Date(newMessage.createdAt).getTime()) < 1000
              );
              
              if (messageExists) {
                console.log(`Duplicate announcement detected, not adding: ${newMessage.content}`);
                return prev;
              }
              
              console.log(`Adding new announcement: ${newMessage.content}`);
              return [...prev, newMessage];
            });
          });
          console.log('Subscribed to announcements channel');
        }
      }
    }
    
    return () => {
      if (socket) {
        const announcementsChannel = socket.channels.get('announcements');
        if (announcementsChannel && announcementsChannel.state === 'attached') {
          console.log('Cleaning up announcements subscription');
        }
      }
    };
  }, [isConnected, user?.id, subscribeToMessages, socket]);

  // Update local messages when socket messages change
  useEffect(() => {
    if (socketMessages.length > 0) {
      console.log('Socket messages updated:', socketMessages);
      setMessages(socketMessages);
      setTimeout(() => scrollToBottom(), 100);
    }
  }, [socketMessages]);

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

  const sendMessage = async () => {
    if (!newMessage.trim() || !isConnected) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setSending(true);

    // Optimistically add message to UI
    const tempMessage: Message = {
      id: Date.now(),
      content: messageContent,
      messageType: 'direct',
      isRead: false,
      createdAt: new Date().toISOString(),
      senderId: user?.id || '',
      receiverId: 'admin',
    };

    setMessages(prev => [...prev, tempMessage]);
    setTimeout(() => scrollToBottom(), 100);

    try {
      // Send via Ably
      if (isConnected) {
        await sendSocketMessage({
          content: messageContent,
          receiverId: 'admin',
          messageType: 'direct',
        });
        console.log('User message sent via Ably');
      } else {
        console.error('Socket not connected, cannot send real-time message');
      }
      
      onMessageSent();
      toast.success('Message sent successfully!');
      
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      setNewMessage(messageContent);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    if (isConnected) {
      startTyping('admin');
      
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      
      const timeout = setTimeout(() => {
        stopTyping('admin');
      }, 1000);
      
      setTypingTimeout(timeout);
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

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-gray-900">Mensajes</h2>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 max-h-[60vh]">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No hay mensajes</div>
          ) : (
            <div className="space-y-6">
              {groupMessagesByDate(messages).map((dateGroup, dateIndex) => (
                <div key={dateIndex} className="space-y-4">
                  {/* Date Separator */}
                  <div className="flex justify-center">
                    <div className="bg-gray-100 px-4 py-1 rounded-full text-sm text-gray-600 font-medium">
                      {formatDateHeader(dateGroup.date)}
                    </div>
                  </div>
                  
                  {/* Messages for this date */}
                  {dateGroup.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderId === user?.id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.senderId !== user?.id && (
                        <div className="flex flex-col items-center mr-3">
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center">
                            <span className="text-gray-600 text-sm font-medium">
                              {adminInfo?.fullName?.charAt(0) || adminInfo?.username?.charAt(0) || 'A'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 text-center">
                            {adminInfo?.fullName || adminInfo?.username || 'Admin'}
                          </div>
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[70%] p-3 rounded-2xl ${
                          message.senderId === user?.id
                            ? 'bg-orange-200 text-gray-800 rounded-br-md'
                            : 'bg-gray-100 text-gray-800 rounded-bl-md'
                        }`}
                      >
                        <div className="text-sm leading-relaxed">{message.content}</div>
                        <div className="text-xs text-gray-500 mt-2 text-right flex items-center gap-1">
                          {message.id > 1000000000000 && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" title="Sending..."></div>
                          )}
                          {formatTime(message.createdAt)}
                        </div>
                      </div>
                      
                      {message.senderId === user?.id && (
                        <div className="flex flex-col items-center ml-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 text-center">
                            {user?.fullName || user?.username || 'You'}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Typing indicator */}
        {isTyping && (
          <div className="px-4 py-2 text-sm text-gray-500 italic">
            Admin está escribiendo...
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={handleTyping}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Escribe tu mensaje..."
              disabled={sending || !isConnected}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-black"
            />
            <button
              onClick={sendMessage}
              disabled={sending || !newMessage.trim() || !isConnected}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {sending ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
