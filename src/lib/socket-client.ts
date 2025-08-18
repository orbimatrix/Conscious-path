import { useEffect, useRef, useState } from 'react';
import * as Ably from 'ably';
import { ChatClient, ChatMessageEvent } from '@ably/chat';

export interface Message {
  id: number;
  content: string;
  messageType: string;
  visibilityLevel?: string;
  level?: string;
  isRead: boolean;
  createdAt: string;
  senderId: string;
  receiverId?: string;
  sender?: {
    clerkId: string;
    fullName?: string;
    username?: string;
    email?: string;
  };
}

export interface UseSocketReturn {
  socket: Ably.Realtime | null;
  chatClient: ChatClient | null;
  isConnected: boolean;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  sendMessage: (data: {
    content: string;
    receiverId: string;
    messageType: 'direct' | 'group' | 'announcement';
    visibilityLevel?: string;
  }) => void;
  sendGroupMessage: (data: {
    content: string;
    level: string;
    messageType: 'group';
  }) => void;
  sendAnnouncement: (data: {
    content: string;
    messageType: 'announcement';
  }) => void;
  joinLevel: (level: string) => void;
  startTyping: (receiverId: string) => void;
  stopTyping: (receiverId: string) => void;
  markAsRead: (messageId: number, senderId: string) => void;
  subscribeToMessages: (receiverId: string) => void;
  subscribeToUserMessages: (userId: string) => void;
}

export const useSocket = (userId?: string): UseSocketReturn => {
  const [socket, setSocket] = useState<Ably.Realtime | null>(null);
  const [chatClient, setChatClient] = useState<ChatClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<Ably.Realtime | null>(null);
  const chatClientRef = useRef<ChatClient | null>(null);
  const subscriptionsRef = useRef<Map<string, any>>(new Map());

  // Helper function to safely unsubscribe
  const safeUnsubscribe = (channel: any, key: string) => {
    if (channel && typeof channel.unsubscribe === 'function') {
      try {
        channel.unsubscribe();
        console.log(`Successfully unsubscribed from ${key}`);
        return true;
      } catch (error) {
        console.error(`Error unsubscribing from ${key}:`, error);
        return false;
      }
    } else if (channel && typeof channel.detach === 'function') {
      try {
        channel.detach();
        console.log(`Successfully detached from ${key}`);
        return true;
      } catch (error) {
        console.error(`Error detaching from ${key}:`, error);
        return false;
      }
    } else {
      console.warn(`Invalid channel found for ${key}:`, channel);
      return false;
    }
  };

  useEffect(() => {
    if (!userId) return;

    console.log('Initializing Ably connection for user:', userId);

    // Initialize Ably connection
    const ably = new Ably.Realtime({
      key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
      clientId: userId,
    });

    // Create Chat client
    const chat = new ChatClient(ably);

    ably.connection.on('connected', () => {
      console.log('Connected to Ably, client ID:', ably.auth.clientId);
      setIsConnected(true);
    });

    ably.connection.on('disconnected', () => {
      console.log('Disconnected from Ably');
      setIsConnected(false);
    });

    ably.connection.on('failed', (error) => {
      console.error('Ably connection failed:', error);
      setIsConnected(false);
    });

    setSocket(ably);
    setChatClient(chat);
    socketRef.current = ably;
    chatClientRef.current = chat;

    return () => {
      console.log('Cleaning up Ably connection for user:', userId);
      // Clean up all subscriptions
      subscriptionsRef.current.forEach((subscription, key) => {
        safeUnsubscribe(subscription, key);
      });
      subscriptionsRef.current.clear();
      ably.close();
    };
  }, [userId]);

  const sendMessage = async (data: {
    content: string;
    receiverId: string;
    messageType: 'direct' | 'group' | 'announcement';
    visibilityLevel?: string;
  }) => {
    if (socket && userId) {
      try {
        // Use Ably channel for real-time messaging
        const channel = socket.channels.get(`chat-${data.receiverId}`);
        channel.publish('message', {
          content: data.content,
          messageType: data.messageType,
          senderId: userId,
          receiverId: data.receiverId,
          visibilityLevel: data.visibilityLevel,
          timestamp: new Date().toISOString(),
        });
        
        console.log('Message sent via Ably channel');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const sendGroupMessage = async (data: {
    content: string;
    level: string;
    messageType: 'group';
  }) => {
    if (socket && userId) {
      try {
        const channel = socket.channels.get(`group-${data.level}`);
        channel.publish('group_message', {
          content: data.content,
          messageType: 'group',
          senderId: userId,
          level: data.level,
          timestamp: new Date().toISOString(),
        });
        
        console.log('Group message sent via Ably channel');
      } catch (error) {
        console.error('Error sending group message:', error);
      }
    }
  };

  const sendAnnouncement = async (data: {
    content: string;
    messageType: 'announcement';
  }) => {
    if (socket && userId) {
      try {
        const channel = socket.channels.get('announcements');
        channel.publish('announcement', {
          content: data.content,
          messageType: 'announcement',
          senderId: userId,
          timestamp: new Date().toISOString(),
        });
        
        console.log('Announcement sent via Ably channel');
      } catch (error) {
        console.error('Error sending announcement:', error);
      }
    }
  };

  const joinLevel = async (level: string) => {
    if (socket) {
      try {
        const channel = socket.channels.get(`group-${level}`);
        
        // Subscribe to messages in this level
        channel.subscribe('group_message', (message: any) => {
          console.log('Group message received:', message);
          const newMessage: Message = {
            id: Date.now() + Math.random(), // Ensure unique ID
            content: message.data.content,
            messageType: 'group',
            level: level,
            isRead: false,
            createdAt: message.data.timestamp,
            senderId: message.data.senderId,
          };
          
          // Prevent duplicates by checking if message already exists
          setMessages(prev => {
            const messageExists = prev.some(msg => 
              msg.content === newMessage.content && 
              msg.senderId === newMessage.senderId && 
              msg.messageType === newMessage.messageType &&
              msg.level === newMessage.level &&
              Math.abs(new Date(msg.createdAt).getTime() - new Date(newMessage.createdAt).getTime()) < 1000 // Within 1 second
            );
            
            if (messageExists) {
              console.log(`Duplicate group message detected, not adding: ${newMessage.content}`);
              return prev;
            }
            
            console.log(`Adding new group message: ${newMessage.content}`);
            return [...prev, newMessage];
          });
        });
        
        console.log(`Joined level channel: ${level}`);
      } catch (error) {
        console.error('Error joining level channel:', error);
      }
    }
  };

  const startTyping = (receiverId: string) => {
    if (socket && userId) {
      const channel = socket.channels.get(`typing-${receiverId}`);
      channel.publish('typing_start', { receiverId, senderId: userId });
    }
  };

  const stopTyping = (receiverId: string) => {
    if (socket && userId) {
      const channel = socket.channels.get(`typing-${receiverId}`);
      channel.publish('typing_stop', { receiverId, senderId: userId });
    }
  };

  const markAsRead = (messageId: number, senderId: string) => {
    if (socket && userId) {
      const channel = socket.channels.get(`read-${senderId}`);
      channel.publish('mark_read', { messageId, senderId: userId });
    }
  };

  const subscribeToMessages = async (receiverId: string) => {
    if (socket && userId) {
      try {
        // Unsubscribe from previous subscription if exists
        const existingChannel = subscriptionsRef.current.get(`chat-${userId}`);
        if (existingChannel) {
          safeUnsubscribe(existingChannel, `chat-${userId}`);
          subscriptionsRef.current.delete(`chat-${userId}`);
        }

        // Subscribe to user's personal channel for receiving messages
        const channel = socket.channels.get(`chat-${userId}`);
        
        // For Ably, we need to attach the channel first, then subscribe
        await channel.attach();
        
        // Store the channel reference for cleanup instead of subscription
        subscriptionsRef.current.set(`chat-${userId}`, channel);
        console.log(`Subscribed to messages on channel chat-${userId}`);
        
        // Listen for messages
        channel.subscribe('message', (message: any) => {
          console.log('Message received on channel:', message);
          const newMessage: Message = {
            id: Date.now() + Math.random(), // Ensure unique ID
            content: message.data.content,
            messageType: message.data.messageType,
            isRead: false,
            createdAt: message.data.timestamp,
            senderId: message.data.senderId,
            receiverId: message.data.receiverId,
            visibilityLevel: message.data.visibilityLevel,
          };
          
          // Prevent duplicates by checking if message already exists
          setMessages(prev => {
            const messageExists = prev.some(msg => 
              msg.content === newMessage.content && 
              msg.senderId === newMessage.senderId && 
              msg.messageType === newMessage.messageType &&
              Math.abs(new Date(msg.createdAt).getTime() - new Date(newMessage.createdAt).getTime()) < 1000 // Within 1 second
            );
            
            if (messageExists) {
              console.log(`Duplicate message detected, not adding: ${newMessage.content}`);
              return prev;
            }
            
            console.log(`Adding new message: ${newMessage.content}`);
            return [...prev, newMessage];
          });
        });
      } catch (error) {
        console.error('Error subscribing to messages:', error);
      }
    }
  };

  const subscribeToUserMessages = async (userId: string) => {
    if (socket && userId) {
      try {
        // Unsubscribe from previous subscription if exists
        const existingChannel = subscriptionsRef.current.get(`admin-inbox`);
        if (existingChannel) {
          safeUnsubscribe(existingChannel, 'admin-inbox');
          subscriptionsRef.current.delete(`admin-inbox`);
        }

        // Admin subscribes to admin channel to receive messages from users
        const channel = socket.channels.get('chat-admin');
        
        // For Ably, we need to attach the channel first, then subscribe
        await channel.attach();
        
        // Store the channel reference for cleanup
        subscriptionsRef.current.set(`admin-inbox`, channel);
        console.log(`Admin subscribed to receive messages on chat-admin channel`);
        
        // Listen for messages
        channel.subscribe('message', (message: any) => {
          console.log('Admin received message from user:', message);
          const newMessage: Message = {
            id: Date.now() + Math.random(), // Ensure unique ID
            content: message.data.content,
            messageType: message.data.messageType,
            isRead: false,
            createdAt: message.data.timestamp,
            senderId: message.data.senderId,
            receiverId: message.data.receiverId,
            visibilityLevel: message.data.visibilityLevel,
          };
          setMessages(prev => {
            // Check if this message already exists to prevent duplicates
            const messageExists = prev.some(msg => 
              msg.content === newMessage.content && 
              msg.senderId === newMessage.senderId && 
              msg.messageType === newMessage.messageType &&
              Math.abs(new Date(msg.createdAt).getTime() - new Date(newMessage.createdAt).getTime()) < 1000 // Within 1 second
            );
            
            if (messageExists) {
              console.log(`Duplicate message detected, not adding: ${newMessage.content}`);
              return prev;
            }
            
            console.log(`Adding new message: ${newMessage.content}`);
            return [...prev, newMessage];
          });
        });

        // Also subscribe to announcements channel to receive all announcements
        const announcementsChannel = socket.channels.get('announcements');
        if (announcementsChannel) {
          announcementsChannel.attach().then(() => {
            announcementsChannel.subscribe('announcement', (message: any) => {
              console.log('Admin received announcement from announcements channel:', message);
              const newMessage: Message = {
                id: Date.now() + Math.random(), // Ensure unique ID
                content: message.data.content,
                messageType: 'announcement',
                isRead: false,
                createdAt: message.data.timestamp,
                senderId: message.data.senderId,
              };
              setMessages(prev => {
                // Check if this announcement already exists to prevent duplicates
                const messageExists = prev.some(msg => 
                  msg.content === newMessage.content && 
                  msg.senderId === newMessage.senderId && 
                  msg.messageType === newMessage.messageType &&
                  Math.abs(new Date(msg.createdAt).getTime() - new Date(newMessage.createdAt).getTime()) < 1000 // Within 1 second
                );
                
                if (messageExists) {
                  console.log(`Duplicate announcement detected, not adding: ${newMessage.content}`);
                  return prev;
                }
                
                console.log(`Adding new announcement: ${newMessage.content}`);
                return [...prev, newMessage];
              });
            });
          });
        }
      } catch (error) {
        console.error('Error subscribing to admin inbox:', error);
      }
    }
  };

  return {
    socket,
    chatClient,
    isConnected,
    messages,
    setMessages,
    sendMessage,
    sendGroupMessage,
    sendAnnouncement,
    joinLevel,
    startTyping,
    stopTyping,
    markAsRead,
    subscribeToMessages,
    subscribeToUserMessages,
  };
};
