import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export interface Message {
  id: number;
  content: string;
  messageType: string;
  visibilityLevel?: string;
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
  socket: Socket | null;
  isConnected: boolean;
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
}

export const useSocket = (userId?: string): UseSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    console.log('Initializing Socket.IO connection for user:', userId);

    // Initialize Socket.IO connection
    const newSocket = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
      path: '/api/socketio',
      addTrailingSlash: false,
    });

    newSocket.on('connect', () => {
      console.log('Connected to Socket.IO server, socket ID:', newSocket.id);
      setIsConnected(true);
      
      // Authenticate user
      newSocket.emit('authenticate', userId);
      console.log('Sent authentication for user:', userId);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
      setIsConnected(false);
    });

    setSocket(newSocket);
    socketRef.current = newSocket;

    return () => {
      console.log('Cleaning up Socket.IO connection for user:', userId);
      newSocket.close();
    };
  }, [userId]);

  const sendMessage = (data: {
    content: string;
    receiverId: string;
    messageType: 'direct' | 'group' | 'announcement';
    visibilityLevel?: string;
  }) => {
    if (socket && userId) {
      socket.emit('send_message', {
        ...data,
        senderId: userId,
      });
    }
  };

  const sendGroupMessage = (data: {
    content: string;
    level: string;
    messageType: 'group';
  }) => {
    if (socket && userId) {
      socket.emit('send_group_message', {
        ...data,
        senderId: userId,
      });
    }
  };

  const sendAnnouncement = (data: {
    content: string;
    messageType: 'announcement';
  }) => {
    if (socket && userId) {
      socket.emit('send_announcement', {
        ...data,
        senderId: userId,
      });
    }
  };

  const joinLevel = (level: string) => {
    if (socket) {
      socket.emit('join_level', level);
    }
  };

  const startTyping = (receiverId: string) => {
    if (socket && userId) {
      socket.emit('typing_start', { receiverId, senderId: userId });
    }
  };

  const stopTyping = (receiverId: string) => {
    if (socket && userId) {
      socket.emit('typing_stop', { receiverId, senderId: userId });
    }
  };

  const markAsRead = (messageId: number, senderId: string) => {
    if (socket && userId) {
      socket.emit('mark_read', { messageId, senderId });
    }
  };

  return {
    socket,
    isConnected,
    sendMessage,
    sendGroupMessage,
    sendAnnouncement,
    joinLevel,
    startTyping,
    stopTyping,
    markAsRead,
  };
};
