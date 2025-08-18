'use client';

import { useState, useEffect, useRef } from 'react';
import { User } from '@/lib/db/schema';
import { useSocket, Message } from '@/lib/socket-client';
import { useUser } from '@clerk/nextjs';

export default function MessagingSystem() {
  const { user, isLoaded } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'direct' | 'group' | 'announcement'>('direct');
  const [loading, setLoading] = useState(false);
  const [cleanupLoading, setCleanupLoading] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [showConversation, setShowConversation] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null);

  // Check if user is admin
  const isAdmin = user?.publicMetadata?.role === 'admin';

  // Initialize Socket.IO
  const {
    socket,
    isConnected,
    sendMessage,
    sendGroupMessage,
    sendAnnouncement,
    joinLevel,
    startTyping,
    stopTyping,
    markAsRead,
  } = useSocket(isAdmin ? 'admin' : user?.id); // Connect as 'admin' if user is admin

  const levels = ['inmortal', 'carisma', 'benec', 'karma'];

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!isAdmin) {
      console.error('User is not admin:', user?.publicMetadata);
      return;
    }
    
    fetchUsers();
  }, [isLoaded, isAdmin]);

  useEffect(() => {
    if (selectedUser && messageType === 'direct') {
      fetchConversation(selectedUser);
    }
  }, [selectedUser, messageType]);

  useEffect(() => {
    // Scroll to bottom when conversation updates
    scrollToBottom();
  }, [conversation]);

  useEffect(() => {
    if (!socket) return;

    // Listen for new messages
    socket.on('new_message', (newMessage: Message) => {
      if (selectedUser && messageType === 'direct' && 
          (newMessage.senderId === selectedUser || newMessage.receiverId === selectedUser)) {
        // Add user sender info if it's from a user
        if (newMessage.senderId !== 'admin') {
          const user = users.find(u => u.clerkId === newMessage.senderId);
          if (user) {
            newMessage.sender = {
              clerkId: user.clerkId,
              fullName: user.fullName || user.username || user.email || 'Unknown User',
              username: user.username || undefined,
              email: user.email || undefined,
            };
          }
        }
        setConversation(prev => [...prev, newMessage]);
      }
    });

    // Listen for group messages
    socket.on('new_group_message', (newMessage: Message) => {
      if (messageType === 'group' && newMessage.visibilityLevel === selectedLevel) {
        // Add user sender info if it's from a user
        if (newMessage.senderId !== 'admin') {
          const user = users.find(u => u.clerkId === newMessage.senderId);
          if (user) {
            newMessage.sender = {
              clerkId: user.clerkId,
              fullName: user.fullName || user.username || user.email || 'Unknown User',
              username: user.username || undefined,
              email: user.email || undefined,
            };
          }
        }
        // Add to conversation if viewing group messages
        setConversation(prev => [...prev, newMessage]);
      }
    });

    // Listen for announcements
    socket.on('new_announcement', (newMessage: Message) => {
      if (messageType === 'announcement') {
        // Add user sender info if it's from a user
        if (newMessage.senderId !== 'admin') {
          const user = users.find(u => u.clerkId === newMessage.senderId);
          if (user) {
            newMessage.sender = {
              clerkId: user.clerkId,
              fullName: user.fullName || user.username || user.email || 'Unknown User',
              username: user.username || undefined,
              email: user.email || undefined,
            };
          }
        }
        setConversation(prev => [...prev, newMessage]);
      }
    });

    // Listen for message confirmations
    socket.on('message_sent', (sentMessage: Message) => {
      // Message was sent successfully
    });

    socket.on('admin_message_sent', (sentMessage: Message) => {
      // Admin message was sent successfully
    });

    socket.on('group_message_sent', (sentMessage: Message) => {
    });

    socket.on('announcement_sent', (sentMessage: Message) => {
    });

    // Listen for typing indicators
    socket.on('user_typing', (data: { senderId: string }) => {
      if (data.senderId === selectedUser) {
        setIsTyping(true);
      }
    });

    socket.on('user_stopped_typing', (data: { senderId: string }) => {
      if (data.senderId === selectedUser) {
        setIsTyping(false);
      }
    });

    // Listen for read receipts
    socket.on('message_read', (data: { messageId: number }) => {
      setConversation(prev => 
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
      socket.off('admin_message_sent');
      socket.off('group_message_sent');
      socket.off('announcement_sent');
      socket.off('user_typing');
      socket.off('user_stopped_typing');
      socket.off('message_read');
    };
  }, [socket, selectedUser, messageType, selectedLevel, users]);

  if (!isLoaded) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!isAdmin) {
    return <div className="text-center py-8 text-red-600">Access denied. Admin privileges required.</div>;
  }

  const scrollToBottom = () => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchConversation = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/conversations/${userId}`);
      if (response.ok) {
        const data = await response.json();
        // Sort messages by creation date (oldest first, like WhatsApp)
        const sortedMessages = (data.messages || []).sort((a: Message, b: Message) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        setConversation(sortedMessages);
      } else {
        console.error('Failed to fetch conversation:', response.status);
        setConversation([]);
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
      setConversation([]);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    try {
      if (messageType === 'direct' && selectedUser) {
        // Send real-time message using admin_message event

        
        if (socket && isConnected) {
          socket.emit('admin_message', {
            content: message,
            receiverId: selectedUser,
            messageType: 'direct',
          });
        } else {
          console.error('Socket not connected, cannot send real-time message');
        }
        
        // Add message to conversation immediately for instant feedback
        const newMessage: Message = {
          id: Date.now(),
          content: message,
          senderId: 'admin',
          receiverId: selectedUser,
          messageType: 'direct',
          createdAt: new Date().toISOString(),
          isRead: false,
        };
        setConversation(prev => [...prev, newMessage]);
        
        // Store message in database via API
        try {
          const response = await fetch('/api/admin/messages', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              content: message,
              receiverId: selectedUser,
              messageType: 'direct',
            }),
          });
          
          if (!response.ok) {
            console.error('Failed to store message in database:', response.status, response.statusText);
            const errorData = await response.text();
            console.error('Error response:', errorData);
          } else {
            console.log('Message stored in database successfully');
          }
        } catch (error) {
          console.error('Error storing message in database:', error);
        }
        
      } else if (messageType === 'group' && selectedLevel) {
        // Send group message using admin_message event
        socket?.emit('admin_message', {
          content: message,
          messageType: 'group',
          visibilityLevel: selectedLevel,
        });
        
        // Add message to conversation immediately
        const newMessage: Message = {
          id: Date.now(),
          content: message,
          senderId: 'admin',
          messageType: 'group',
          visibilityLevel: selectedLevel,
          createdAt: new Date().toISOString(),
          isRead: false,
        };
        setConversation(prev => [...prev, newMessage]);
        
        // Store group message in database via API
        try {
          const response = await fetch('/api/admin/messages', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              content: message,
              messageType: 'group',
              visibilityLevel: selectedLevel,
            }),
          });
          
          if (!response.ok) {
            console.error('Failed to store group message in database:', response.status, response.statusText);
            const errorData = await response.text();
            console.error('Error response:', errorData);
          } else {
            console.log('Group message stored in database successfully');
          }
        } catch (error) {
          console.error('Error storing group message in database:', error);
        }
        
      } else if (messageType === 'announcement') {
        // Send announcement using admin_message event
        socket?.emit('admin_message', {
          content: message,
          messageType: 'announcement',
        });
        
        // Add message to conversation immediately
        const newMessage: Message = {
          id: Date.now(),
          content: message,
          senderId: 'admin',
          messageType: 'announcement',
          createdAt: new Date().toISOString(),
          isRead: false,
        };
        setConversation(prev => [...prev, newMessage]);
        
        // Store announcement in database via API
        try {
          const response = await fetch('/api/admin/messages', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              content: message,
              messageType: 'announcement',
            }),
          });
          
          if (!response.ok) {
            console.error('Failed to store announcement in database:', response.status, response.statusText);
            const errorData = await response.text();
            console.error('Error response:', errorData);
          } else {
            console.log('Announcement stored in database successfully');
          }
        } catch (error) {
          console.error('Error storing announcement in database:', error);
        }
      }

      setMessage('');
      
      // Stop typing indicator
      if (messageType === 'direct' && selectedUser) {
        stopTyping(selectedUser);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Handle typing indicators for direct messages
    if (messageType === 'direct' && selectedUser) {
      startTyping(selectedUser);
      
      // Clear existing timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      
      // Set new timeout to stop typing indicator
      const timeout = setTimeout(() => {
        stopTyping(selectedUser);
      }, 1000);
      
      setTypingTimeout(timeout);
    }
  };

  const handleCleanupMessages = async () => {
    // First check how many messages would be deleted
    try {
      const checkResponse = await fetch('/api/admin/cleanup-messages');
      if (checkResponse.ok) {
        const checkData = await checkResponse.json();
        if (checkData.count === 0) {
          alert('No old messages to clean up');
          return;
        }
        
        if (!confirm(`This will delete ${checkData.count} messages older than 7 days. Continue?`)) {
          return;
        }
      }
    } catch (error) {
      console.error('Error checking old messages:', error);
    }

    setCleanupLoading(true);
    try {
      const response = await fetch('/api/admin/cleanup-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        // Refresh conversations if any user is selected
        if (selectedUser && messageType === 'direct') {
          fetchConversation(selectedUser);
        }
      }
    } catch (error) {
      console.error('Error cleaning up messages:', error);
      alert('Failed to cleanup messages');
    } finally {
      setCleanupLoading(false);
    }
  };

  const getUsersByLevel = (level: string) => {
    return users.filter(user => user.level === level);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Messaging System</h2>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-600">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
         
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message Composition */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Compose Message</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Type
              </label>
              <select
                value={messageType}
                onChange={(e) => setMessageType(e.target.value as 'direct' | 'group' | 'announcement')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              >
                <option value="direct">Direct Message</option>
                <option value="group">Group Message (by Level)</option>
                <option value="announcement">General Announcement</option>
              </select>
            </div>

            {messageType === 'direct' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select User
                </label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                >
                  <option value="">Choose a user...</option>
                  {users.map((user) => (
                    <option key={user.clerkId} value={user.clerkId}>
                      {user.fullName || user.username || user.email} ({user.level})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {messageType === 'group' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Level
                </label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a level...</option>
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level} ({getUsersByLevel(level).length} users)
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Content
              </label>
              <textarea
                value={message}
                onChange={handleTyping}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Type your message here..."
              />
            </div>

            <button
              onClick={handleSendMessage}
              disabled={loading || !message.trim() || !isConnected || (messageType === 'direct' && !selectedUser) || (messageType === 'group' && !selectedLevel)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>


            {/* Test Connection Broadcast */}
          

          
            {/* List Connected Users */}
          
            <button
              onClick={handleCleanupMessages}
              disabled={cleanupLoading}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed mt-2"
            >
              {cleanupLoading ? 'Cleaning...' : 'Cleanup Old Messages (7+ days)'}
            </button>
          </div>
        </div>

        {/* Message Preview */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Message Preview</h3>
          
          {/* Debug Information */}
          <div className="mb-4 p-3 bg-yellow-100 rounded border">
            <h4 className="font-semibold text-sm text-yellow-800 mb-2">Debug Info:</h4>
            <div className="text-xs text-yellow-700 space-y-1">
              <div>Socket Connected: {isConnected ? 'Yes' : 'No'}</div>
              <div>Selected User: {selectedUser || 'None'}</div>
              <div>Message Type: {messageType}</div>
              <div>Total Users: {users.length}</div>
              <div>Admin Role: {isAdmin ? 'Yes' : 'No'}</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              <strong>Type:</strong> {messageType.charAt(0).toUpperCase() + messageType.slice(1)}
            </div>
            
            {messageType === 'direct' && selectedUser && (
              <div className="text-sm text-gray-600">
                <strong>To:</strong> {users.find(u => u.clerkId === selectedUser)?.fullName || 'Unknown User'}
              </div>
            )}
            
            {messageType === 'group' && selectedLevel && (
              <div className="text-sm text-gray-600">
                <strong>To Level:</strong> {selectedLevel} ({getUsersByLevel(selectedLevel).length} users)
              </div>
            )}
            
            {messageType === 'announcement' && (
              <div className="text-sm text-gray-600">
                <strong>To:</strong> All Users
              </div>
            )}
            
            {message && (
              <div className="bg-white p-3 rounded border">
                <div className="text-sm text-gray-600 mb-2">Preview:</div>
                <div className="text-gray-900">{message}</div>
              </div>
            )}
          </div>
        </div>

        {/* Conversation History */}
        {messageType === 'direct' && selectedUser && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Conversation with {users.find(u => u.clerkId === selectedUser)?.fullName || 'User'}
            </h3>
            
            {isTyping && (
              <div className="text-sm text-gray-500 mb-3 italic">
                {users.find(u => u.clerkId === selectedUser)?.fullName || 'User'} is typing...
              </div>
            )}
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {conversation.length === 0 ? (
                <div className="text-sm text-gray-500 text-center">No messages yet</div>
              ) : (
                conversation.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.senderId === 'admin' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.senderId !== 'admin' && (
                      <div className="w-8 h-8 rounded-full bg-gray-300 mr-3 flex-shrink-0 flex items-center justify-center">
                        <span className="text-gray-600 text-sm font-medium">
                          {msg.sender?.fullName?.[0] || msg.sender?.username?.[0] || 'U'}
                        </span>
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[70%] p-3 rounded-2xl ${
                        msg.senderId === 'admin' 
                          ? 'bg-blue-100 text-gray-800 rounded-br-md' 
                          : 'bg-gray-100 text-gray-800 rounded-bl-md'
                      }`}
                    >
                      <div className="text-sm text-gray-600 mb-1">
                        {msg.senderId === 'admin' ? 'Admin' : msg.sender?.fullName || msg.sender?.username || 'User'}
                      </div>
                      <div className="text-gray-900 mb-1">{msg.content}</div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          {formatTime(msg.createdAt)}
                        </div>
                        {msg.senderId === 'admin' && (
                          <div className="text-xs text-gray-500 ml-2">
                            {msg.isRead ? '✓✓' : '✓'}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {msg.senderId === 'admin' && (
                      <div className="w-8 h-8 rounded-full bg-blue-500 ml-3 flex-shrink-0 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">A</span>
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={conversationEndRef} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}