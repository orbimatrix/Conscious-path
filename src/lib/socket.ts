import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

export interface SocketServer {
  io: SocketIOServer;
}

export interface NextApiResponseServerIO {
  socket: {
    server: NetServer & SocketServer;
  };
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export const initSocket = (res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    const io = new SocketIOServer(res.socket.server, {
      path: '/api/socketio',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    });

    // Store user connections
    const userConnections = new Map<string, string>();

    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      // Handle user authentication
      socket.on('authenticate', (userId: string) => {
        userConnections.set(userId, socket.id);
        socket.join(`user_${userId}`);
        console.log(`User ${userId} authenticated and joined room`);
      });

      // Handle direct messages
      socket.on('send_message', async (data) => {
        const { content, receiverId, senderId, messageType, visibilityLevel } = data;
        
        // Emit to receiver immediately for real-time delivery
        const receiverSocketId = userConnections.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('new_message', {
            id: Date.now(), // Temporary ID until DB storage
            content,
            senderId,
            receiverId,
            messageType,
            visibilityLevel,
            createdAt: new Date().toISOString(),
            isRead: false,
          });
        }

        // Emit back to sender for confirmation
        socket.emit('message_sent', {
          id: Date.now(),
          content,
          senderId,
          receiverId,
          messageType,
          visibilityLevel,
          createdAt: new Date().toISOString(),
          isRead: false,
        });

        // Store message in database (this will happen in the API route)
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              content,
              receiverId,
              messageType,
              visibilityLevel,
            }),
          });
          
          if (!response.ok) {
            console.error('Failed to store message in database');
          }
        } catch (error) {
          console.error('Error storing message in database:', error);
        }
      });

      // Handle group messages
      socket.on('send_group_message', async (data) => {
        const { content, level, senderId, messageType } = data;
        
        // Emit to all users in the level group
        io.to(`level_${level}`).emit('new_group_message', {
          id: Date.now(),
          content,
          senderId,
          messageType,
          visibilityLevel: level,
          createdAt: new Date().toISOString(),
          isRead: false,
        });

        // Emit back to sender for confirmation
        socket.emit('group_message_sent', {
          id: Date.now(),
          content,
          senderId,
          messageType,
          visibilityLevel: level,
          createdAt: new Date().toISOString(),
        });

        // Store group message in database
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              content,
              messageType: 'group',
              visibilityLevel: level,
            }),
          });
          
          if (!response.ok) {
            console.error('Failed to store group message in database');
          }
        } catch (error) {
          console.error('Error storing group message in database:', error);
        }
      });

      // Handle announcement messages
      socket.on('send_announcement', async (data) => {
        const { content, senderId } = data;
        
        // Emit to all connected users
        io.emit('new_announcement', {
          id: Date.now(),
          content,
          senderId,
          messageType: 'announcement',
          createdAt: new Date().toISOString(),
          isRead: false,
        });

        // Emit back to sender for confirmation
        socket.emit('announcement_sent', {
          id: Date.now(),
          content,
          senderId,
          messageType: 'announcement',
          createdAt: new Date().toISOString(),
        });

        // Store announcement in database
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              content,
              messageType: 'announcement',
            }),
          });
          
          if (!response.ok) {
            console.error('Failed to store announcement in database');
          }
        } catch (error) {
          console.error('Error storing announcement in database:', error);
        }
      });

      // Handle user joining level rooms
      socket.on('join_level', (level: string) => {
        socket.join(`level_${level}`);
        console.log(`User joined level room: ${level}`);
      });

      // Handle typing indicators
      socket.on('typing_start', (data) => {
        const { receiverId, senderId } = data;
        const receiverSocketId = userConnections.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('user_typing', { senderId });
        }
      });

      socket.on('typing_stop', (data) => {
        const { receiverId, senderId } = data;
        const receiverSocketId = userConnections.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('user_stopped_typing', { senderId });
        }
      });

      // Handle read receipts
      socket.on('mark_read', (data) => {
        const { messageId, senderId } = data;
        const senderSocketId = userConnections.get(senderId);
        if (senderSocketId) {
          io.to(senderSocketId).emit('message_read', { messageId });
        }
      });

      socket.on('disconnect', () => {
        // Remove user from connections
        for (const [userId, socketId] of userConnections.entries()) {
          if (socketId === socket.id) {
            userConnections.delete(userId);
            break;
          }
        }
        console.log('User disconnected:', socket.id);
      });
    });

    res.socket.server.io = io;
  }
  return res.socket.server.io;
};
