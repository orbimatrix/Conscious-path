'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'react-hot-toast';

interface Message {
  id: number;
  content: string;
  messageType: string;
  visibilityLevel?: string;
  isRead: boolean;
  createdAt: string;
  senderId: string;
  sender: {
    clerkId: string;
    fullName?: string;
    username?: string;
    email?: string;
  };
}

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
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      toast.success('Messages loaded!');
      
      // Set up periodic refresh for new messages (every 10 seconds)
      const interval = setInterval(() => {
        if (messages.length > 0) {
          // Silent refresh - don't show loading state
          silentRefresh();
        }
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [isOpen]);

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

  const silentRefresh = async () => {
    try {
      const response = await fetch('/api/user/messages');
      if (response.ok) {
        const data = await response.json();
                 // Only update if there are new messages
         if (data.messages.length > messages.length) {
           setMessages(data.messages);
           setHasNewMessages(true);
           toast.success(`New message${data.messages.length - messages.length > 1 ? 's' : ''} received!`);
          // Mark new messages as read silently
          const newMessages = data.messages.slice(messages.length);
          const unreadNewMessages = newMessages.filter((msg: Message) => !msg.isRead);
          if (unreadNewMessages.length > 0) {
            Promise.all(
              unreadNewMessages.map((msg: Message) => 
                fetch('/api/user/messages', {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ messageId: msg.id }),
                }).catch(err => console.error('Error marking message as read:', err))
              )
            ).catch(err => console.error('Error in silent mark as read:', err));
          }
        }
      }
         } catch (error) {
       console.error('Error in silent refresh:', error);
       toast.error('Error checking for new messages');
     }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

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
      sender: {
        clerkId: user?.id || '',
        fullName: user?.fullName || '',
        username: user?.username || '',
        email: user?.emailAddresses?.[0]?.emailAddress || '',
      }
    };

    // Add message to UI immediately for instant feedback
    setMessages(prev => [...prev, tempMessage]);
    
    // Scroll to bottom to show new message
    setTimeout(() => scrollToBottom(), 100);

    try {
      const response = await fetch('/api/user/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: messageContent }),
      });

             if (response.ok) {
         const data = await response.json();
         onMessageSent();
         
         // Replace temporary message with real one from server
         if (data.message) {
           setMessages(prev => prev.map(msg => 
             msg.id === tempMessage.id ? data.message : msg
           ));
         }
         
         // Show success toast
         toast.success('Message sent successfully!');
             } else {
         // If failed, remove the temporary message and show error
         setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
         setNewMessage(messageContent); // Restore the message content
         toast.error('Failed to send message. Please try again.');
       }
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
            {hasNewMessages && (
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="New messages available"></div>
            )}
          </div>
          <div className="flex items-center gap-2">
                         <button
               onClick={() => {
                 fetchMessages();
                 setHasNewMessages(false);
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

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Escribe tu mensaje..."
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                disabled={sending}
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.586-6.586a2 2 0 00-2.828-2.828z" />
                </svg>
              </button>
            </div>
            <button
              onClick={sendMessage}
              disabled={sending || !newMessage.trim()}
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
