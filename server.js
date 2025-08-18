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

    // Handle user authentication
    socket.on('authenticate', (userId) => {
      console.log(`=== USER AUTHENTICATION ===`);
      console.log(`User ${userId} authenticating with socket ${socket.id}`);
      
      userConnections.set(userId, socket.id);
      socket.join(`user_${userId}`);
      
      // Check if this is an admin user
      if (userId === 'admin' || userId.includes('admin')) {
        adminSocketId = socket.id;
        console.log(`✅ Admin authenticated and joined room: ${socket.id}`);
      } else {
        console.log(`✅ User ${userId} authenticated and joined room: ${socket.id}`);
      }
      
      // Log all current connections for debugging
      console.log('Current user connections:', Array.from(userConnections.entries()));
      console.log('Admin socket ID:', adminSocketId);
      console.log('Total connected users:', userConnections.size);
    });

    // Handle direct messages
    socket.on('send_message', async (data) => {
      const { content, receiverId, senderId, messageType, visibilityLevel } = data;
      
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
    });

    // Handle admin messages (new event for admin to user messages)
    socket.on('admin_message', async (data) => {
      const { content, receiverId, messageType, visibilityLevel } = data;
      console.log('=== ADMIN MESSAGE RECEIVED ===');
      console.log('Message data:', { content, receiverId, messageType, visibilityLevel });
      console.log('Current user connections:', Array.from(userConnections.entries()));
      console.log('Admin socket ID:', adminSocketId);
      
      // Emit to specific user immediately for real-time delivery
      if (receiverId && receiverId !== 'all') {
        const receiverSocketId = userConnections.get(receiverId);
        console.log(`Looking for user ${receiverId}, found socket ID: ${receiverSocketId}`);
        
        if (receiverSocketId) {
          console.log(`Sending message to user ${receiverId} via socket ${receiverSocketId}`);
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
          console.log(`✅ Admin message delivered to user ${receiverId} via Socket.IO`);
          
          // ALSO broadcast to all users for debugging
          io.emit('new_message', {
            id: Date.now(),
            content: `[DEBUG] ${content}`,
            senderId: 'admin',
            receiverId: 'DEBUG_BROADCAST',
            messageType: 'direct',
            createdAt: new Date().toISOString(),
            isRead: false,
          });
          console.log('DEBUG: Also broadcasted message to all users');
        } else {
          console.log(`❌ User ${receiverId} not connected, admin message will be stored in DB only`);
          console.log('Available user IDs:', Array.from(userConnections.keys()));
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

    });

    // Test connection event for debugging
    socket.on('test_connection', () => {
      console.log('=== TEST CONNECTION ===');
      console.log('Test connection event received from:', socket.id);
      
      // Broadcast test message to all users
      io.emit('new_message', {
        id: Date.now(),
        content: '[TEST] Admin connection test - ' + new Date().toISOString(),
        senderId: 'admin',
        receiverId: 'TEST_BROADCAST',
        messageType: 'direct',
        createdAt: new Date().toISOString(),
        isRead: false,
      });
      console.log('✅ Test message broadcasted to all users');
    });

    // List connected users for debugging
    socket.on('list_users', () => {
      console.log('=== LIST USERS REQUEST ===');
      console.log('Request from socket:', socket.id);
      console.log('All connected users:', Array.from(userConnections.entries()));
      console.log('Total users:', userConnections.size);
      
      // Send user list back to requester
      socket.emit('users_list', {
        users: Array.from(userConnections.entries()),
        total: userConnections.size,
        timestamp: new Date().toISOString()
      });
    });

    // Simple ping event to test user connectivity
    socket.on('ping_user', () => {
      console.log('=== PING RECEIVED ===');
      console.log('Ping received from user:', socket.id);
      
      // Send pong back to confirm connection
      socket.emit('pong_user', { timestamp: new Date().toISOString() });
      console.log('Pong sent to user:', socket.id);
      
      // ALSO send a test new_message event directly to this user
      socket.emit('new_message', {
        id: Date.now(),
        content: '[PING TEST] Test message from ping - ' + new Date().toISOString(),
        senderId: 'admin',
        receiverId: 'PING_TEST',
        messageType: 'direct',
        createdAt: new Date().toISOString(),
        isRead: false,
      });
      console.log('Test new_message sent directly to user via ping');
    });

    // Handle user joining level rooms
    socket.on('join_level', (level) => {
      socket.join(`level_${level}`);
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
    });
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
