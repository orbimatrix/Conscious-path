const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

// Prepare the Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Initialize Socket.IO
  const io = new Server(server, {
    path: '/api/socketio',
    addTrailingSlash: false,
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  // Store user connections
  const userConnections = new Map();
  const levelRooms = new Map();
  let adminSocketId = null; // Track admin socket

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle user authentication
    socket.on('authenticate', (userId) => {
      userConnections.set(userId, socket.id);
      socket.join(`user_${userId}`);
      
      // Check if this is an admin user
      if (userId === 'admin' || userId.includes('admin')) {
        adminSocketId = socket.id;
        console.log(`Admin authenticated and joined room: ${socket.id}`);
      } else {
        console.log(`User ${userId} authenticated and joined room`);
      }
    });

    // Handle direct messages
    socket.on('send_message', async (data) => {
      const { content, receiverId, senderId, messageType, visibilityLevel } = data;
      console.log('Received send_message:', { content, receiverId, senderId, messageType });
      
      // Emit to receiver immediately for real-time delivery
      if (receiverId === 'admin') {
        // Message to admin - emit to admin socket
        if (adminSocketId) {
          io.to(adminSocketId).emit('new_message', {
            id: Date.now(),
            content,
            senderId,
            receiverId,
            messageType,
            visibilityLevel,
            createdAt: new Date().toISOString(),
            isRead: false,
          });
          console.log('Message delivered to admin via Socket.IO');
        } else {
          console.log('Admin not connected, message will be stored in DB only');
        }
      } else {
        // Message to user - emit to user socket
        const receiverSocketId = userConnections.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('new_message', {
            id: Date.now(),
            content,
            senderId,
            receiverId,
            messageType,
            visibilityLevel,
            createdAt: new Date().toISOString(),
            isRead: false,
          });
          console.log('Message delivered to user via Socket.IO');
        } else {
          console.log('User not connected, message will be stored in DB only');
        }
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

      // Note: Database storage will be handled by the API routes
      console.log('Message sent via Socket.IO, database storage handled by API');
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

      // Note: Database storage will be handled by the API routes
      console.log('Group message sent via Socket.IO, database storage handled by API');
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

      // Note: Database storage will be handled by the API routes
      console.log('Announcement sent via Socket.IO, database storage handled by API');
    });

    // Handle admin messages (new event for admin to user messages)
    socket.on('admin_message', async (data) => {
      const { content, receiverId, messageType, visibilityLevel } = data;
      console.log('Received admin_message:', { content, receiverId, messageType, visibilityLevel });
      
      // Emit to specific user immediately for real-time delivery
      if (receiverId && receiverId !== 'all') {
        const receiverSocketId = userConnections.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('new_message', {
            id: Date.now(),
            content,
            senderId: 'admin',
            receiverId,
            messageType,
            visibilityLevel,
            createdAt: new Date().toISOString(),
            isRead: false,
          });
          console.log(`Admin message delivered to user ${receiverId} via Socket.IO`);
        } else {
          console.log(`User ${receiverId} not connected, admin message will be stored in DB only`);
        }
      } else if (messageType === 'group' && visibilityLevel) {
        // Emit to all users in the level group
        io.to(`level_${visibilityLevel}`).emit('new_group_message', {
          id: Date.now(),
          content,
          senderId: 'admin',
          messageType,
          visibilityLevel,
          createdAt: new Date().toISOString(),
          isRead: false,
        });
        console.log(`Admin group message delivered to level ${visibilityLevel} via Socket.IO`);
      } else if (messageType === 'announcement') {
        // Emit to all connected users
        io.emit('new_announcement', {
          id: Date.now(),
          content,
          senderId: 'admin',
          messageType: 'announcement',
          createdAt: new Date().toISOString(),
          isRead: false,
        });
        console.log('Admin announcement delivered to all users via Socket.IO');
      }

      // Emit back to admin for confirmation
      socket.emit('admin_message_sent', {
        id: Date.now(),
        content,
        senderId: 'admin',
        receiverId,
        messageType,
        visibilityLevel,
        createdAt: new Date().toISOString(),
      });

      // Note: Database storage will be handled by the API routes
      console.log('Admin message sent via Socket.IO, database storage handled by API');
    });

    // Handle user joining level rooms
    socket.on('join_level', (level) => {
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

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
