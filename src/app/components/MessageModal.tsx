'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'react-hot-toast';
import { useSocket, Message } from '@/lib/socket-client';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMessageSent: () => void;
}

export default function MessageModal({ isOpen, onClose, onMessageSent }: MessageModalProps) {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Socket.IO for real-time messaging
  const {
    socket,
    isConnected,
    sendMessage: sendSocketMessage,
    startTyping,
    stopTyping,
    markAsRead,
    joinLevel,
  } = useSocket(user?.id);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      toast.success('Messages loaded!');
    }
  }, [isOpen]);

  // Join user's level room when connected
  useEffect(() => {
    if (isConnected && user) {
      // Fetch user's level and join the room
      fetch('/api/user/profile')
        .then(response => response.json())
        .then(data => {
          if (data.user?.level) {
            joinLevel(data.user.level);
            console.log(`User joined level room: ${data.user.level}`);
          } else {
            // Default to 'inmortal' if no level found
            joinLevel('inmortal');
            console.log('User joined default level room: inmortal');
          }
        })
        .catch(error => {
          console.error('Error fetching user level:', error);
          // Default to 'inmortal' if error
          joinLevel('inmortal');
          console.log('User joined default level room: inmortal (fallback)');
        });
    }
  }, [isConnected, user, joinLevel]);

  useEffect(() => {
    if (!socket) return;

    // Listen for new messages
    socket.on('new_message', (newMessage: Message) => {
      // Add admin sender info if it's from admin
      if (newMessage.senderId === 'admin') {
        newMessage.sender = {
          clerkId: 'admin',
          fullName: 'Admin',
          username: 'admin',
          email: 'admin@conscious.com',
        };
      }
      
      setMessages(prev => [...prev, newMessage]);
      toast.success('New message received!');
      
      // Mark as read automatically
      if (newMessage.senderId !== user?.id) {
        markAsRead(newMessage.id, newMessage.senderId);
      }
    });

    // Listen for group messages
    socket.on('new_group_message', (newMessage: Message) => {
      // Add admin sender info if it's from admin
      if (newMessage.senderId === 'admin') {
        newMessage.sender = {
          clerkId: 'admin',
          fullName: 'Admin',
          username: 'admin',
          email: 'admin@conscious.com',
        };
      }
      
      setMessages(prev => [...prev, newMessage]);
      toast.success('New group message received!');
      
      // Mark as read automatically
      markAsRead(newMessage.id, newMessage.senderId);
    });

    // Listen for announcements
    socket.on('new_announcement', (newMessage: Message) => {
      // Add admin sender info if it's from admin
      if (newMessage.senderId === 'admin') {
        newMessage.sender = {
          clerkId: 'admin',
          fullName: 'Admin',
          username: 'admin',
          email: 'admin@conscious.com',
        };
      }
      
      setMessages(prev => [...prev, newMessage]);
      toast.success('New announcement received!');
      
      // Mark as read automatically
      markAsRead(newMessage.id, newMessage.senderId);
    });

    // Listen for message confirmations
    socket.on('message_sent', (sentMessage: Message) => {
      // Message was sent successfully
      console.log('Message sent:', sentMessage);
    });

    // Listen for typing indicators
    socket.on('user_typing', (data: { senderId: string }) => {
      if (data.senderId !== user?.id) {
        setIsTyping(true);
      }
    });

    socket.on('user_stopped_typing', (data: { senderId: string }) => {
      if (data.senderId !== user?.id) {
        setIsTyping(false);
      }
    });

    // Listen for read receipts
    socket.on('message_read', (data: { messageId: number }) => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === data.messageId ? { ...msg, isRead: true } : msg
        )
      );
    });

    return () => {
      socket.off('new_message');
      socket.off('new_group_message');
      socket.off('new_announcement');
      socket.off('message_sent');
      socket.off('user_typing');
      socket.off('user_stopped_typing');
      socket.off('message_read');
    };
  }, [socket, user?.id, markAsRead]);

  useEffect(() => {
    // Scroll to bottom when conversation updates, but only if it's a new message
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length]);

  const fetchMessages = async () => {
    if (messages.length > 0) {
      // Don't show loading if we already have messages
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/user/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
        
        // Mark messages as read in background (don't wait for this)
        const unreadMessages = data.messages.filter((msg: Message) => !msg.isRead);
        if (unreadMessages.length > 0) {
          // Mark as read in background without blocking UI
          Promise.all(
            unreadMessages.map((msg: Message) => 
              fetch('/api/user/messages', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messageId: msg.id }),
              }).catch(err => console.error('Error marking message as read:', err))
            )
          ).then(() => {
            if (unreadMessages.length > 0) {
              toast.success(`${unreadMessages.length} message${unreadMessages.length > 1 ? 's' : ''} marked as read`);
            }
          }).catch(err => console.error('Error in batch mark as read:', err));
        }
      } else {
        console.error('Failed to fetch messages:', response.status);
        toast.error('Failed to load messages. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Error loading messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !isConnected) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setSending(true);

    // Optimistically add the message to the UI immediately
    const tempMessage: Message = {
      id: Date.now(), // Temporary ID
      content: messageContent,
      messageType: 'direct',
      isRead: false,
      createdAt: new Date().toISOString(),
      senderId: user?.id || '',
      receiverId: 'admin', // Send to admin
    };

    // Add message to UI immediately for instant feedback
    setMessages(prev => [...prev, tempMessage]);
    
    // Scroll to bottom to show new message
    setTimeout(() => scrollToBottom(), 100);

    try {
      // Send real-time message
      console.log('Sending user message:', {
        content: messageContent,
        receiverId: 'admin',
        messageType: 'direct',
        socketConnected: !!socket,
        isConnected,
      });
      
      if (socket && isConnected) {
        sendSocketMessage({
          content: messageContent,
          receiverId: 'admin',
          messageType: 'direct',
        });
        console.log('User message sent via Socket.IO');
      } else {
        console.error('Socket not connected, cannot send real-time message');
      }

      // Stop typing indicator
      stopTyping('admin');
      
      // Store message in database via API
      try {
        const response = await fetch('/api/user/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: messageContent }),
        });
        
        if (!response.ok) {
          console.error('Failed to store message in database:', response.status);
        } else {
          console.log('Message stored in database successfully');
        }
      } catch (error) {
        console.error('Error storing message in database:', error);
      }
      
      onMessageSent();
      toast.success('Message sent successfully!');
      
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove temporary message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      setNewMessage(messageContent); // Restore the message content
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    // Handle typing indicators
    if (isConnected) {
      startTyping('admin');
      
      // Clear existing timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      
      // Set new timeout to stop typing indicator
      const timeout = setTimeout(() => {
        stopTyping('admin');
      }, 1000);
      
      setTypingTimeout(timeout);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const getMessageTypeLabel = (messageType: string, visibilityLevel?: string) => {
    switch (messageType) {
      case 'direct':
        return 'Mensaje Directo';
      case 'group':
        return `Mensaje Grupal (${visibilityLevel})`;
      case 'announcement':
        return 'Anuncio General';
      default:
        return 'Mensaje';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-gray-900">Mensajes</h2>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
              <span className="text-xs text-gray-500">
                (User - {user?.id})
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                fetchMessages();
                toast.success('Messages refreshed!');
              }}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              title="Refresh messages"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
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
          {loading ? (
            <div className="text-center text-gray-500 py-8">Cargando mensajes...</div>
          ) : messages.length === 0 ? (
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
                        <div className="w-8 h-8 rounded-full bg-gray-300 mr-3 flex-shrink-0 flex items-center justify-center">
                          <span className="text-gray-600 text-sm font-medium">A</span>
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
                        <div className="w-8 h-8 rounded-full bg-blue-500 ml-3 flex-shrink-0 flex items-center justify-center">
                          <span className="text-white text-sm font-medium">T</span>
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
            Admin is typing...
          </div>
        )}

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={handleTyping}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Escribe tu mensaje..."
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                disabled={sending || !isConnected}
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.586-6.586a2 2 0 00-2.828-2.828z" />
                </svg>
              </button>
            </div>
            <button
              onClick={sendMessage}
              disabled={sending || !newMessage.trim() || !isConnected}
              className="w-12 h-12 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              {sending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
