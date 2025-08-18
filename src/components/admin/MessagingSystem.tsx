'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useSocket } from '@/lib/socket-client';
import { Message } from '@/lib/socket-client';

export default function MessagingSystem() {
  const { user, isLoaded } = useUser();
  const [users, setUsers] = useState<any[]>([]);

  const isAdmin = user?.publicMetadata?.role === 'admin';


  const { socket, isConnected, sendMessage, sendGroupMessage, sendAnnouncement, joinLevel, subscribeToUserMessages, messages: socketMessages, setMessages } = useSocket(isAdmin ? 'admin' : user?.id);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'direct' | 'group' | 'announcement'>('direct');
  const [loading, setLoading] = useState(false);
  const [cleanupLoading, setCleanupLoading] = useState(false);
  const [levels] = useState(['inmortal', 'renacer', 'karma', 'carisma', 'conocimiento', 'bienestar', 'abundancia']);
  const [viewMode, setViewMode] = useState<'direct' | 'group' | 'announcement'>('direct');

  // Check if user is admin

  useEffect(() => {
    if (isLoaded && isAdmin) {
      fetchUsers();
    }
  }, [isLoaded, isAdmin]);

  // Subscribe to admin inbox when connected
  useEffect(() => {
    if (isConnected && isAdmin) {
      console.log('Admin subscribing to inbox to receive user messages');
      subscribeToUserMessages('admin');
      
      // Also manually subscribe to announcements channel to ensure we receive them
      const announcementsChannel = socket?.channels.get('announcements');
      if (announcementsChannel) {
        console.log('Setting up manual announcements subscription');
        announcementsChannel.attach().then(() => {
          announcementsChannel.subscribe('announcement', (message: any) => {
            console.log('Admin manually received announcement:', message);
            const newMessage: Message = {
              id: Date.now() + Math.random(),
              content: message.data.content,
              messageType: 'announcement',
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
      
      // Subscribe to all group levels with a single handler to avoid duplicates
      levels.forEach(level => {
        console.log(`Setting up subscription for level: ${level}`);
        const levelChannel = socket?.channels.get(`group-${level}`);
        if (levelChannel) {
          levelChannel.attach().then(() => {
            levelChannel.subscribe('group_message', (message: any) => {
              console.log(`Admin received group message from level ${level}:`, message);
              const newMessage: Message = {
                id: Date.now() + Math.random(), // Ensure unique ID
                content: message.data.content,
                messageType: 'group',
                level: level,
                isRead: false,
                createdAt: message.data.timestamp,
                senderId: message.data.senderId,
              };
              // Add to socketMessages to avoid duplication
              setMessages(prev => {
                // Check if this message already exists to prevent duplicates
                const messageExists = prev.some(msg => 
                  msg.content === newMessage.content && 
                  msg.senderId === newMessage.senderId && 
                  msg.messageType === newMessage.messageType &&
                  msg.level === newMessage.level &&
                  Math.abs(new Date(msg.createdAt).getTime() - new Date(newMessage.createdAt).getTime()) < 1000 // Within 1 second
                );
                
                if (messageExists) {
                  console.log(`Duplicate message detected, not adding: ${newMessage.content}`);
                  return prev;
                }
                
                console.log(`Adding new group message: ${newMessage.content} from level ${newMessage.level}`);
                return [...prev, newMessage];
              });
            });
          });
        }
      });
    }
      }, [isConnected, isAdmin, subscribeToUserMessages, levels, socket]);

  // Clear conversation when user selection changes
  useEffect(() => {
    setConversation([]);
  }, [selectedUser]);

  // Don't clear conversation when view mode changes - just filter the display

  // Update conversation when socket messages change
  useEffect(() => {
    console.log('Socket messages updated:', socketMessages);
    
    // Remove duplicates before updating conversation
    const uniqueMessages = socketMessages.filter((msg, index, self) => 
      index === self.findIndex(m => 
        m.content === msg.content && 
        m.senderId === msg.senderId && 
        m.messageType === msg.messageType &&
        m.level === msg.level &&
        Math.abs(new Date(m.createdAt).getTime() - new Date(msg.createdAt).getTime()) < 1000 // Within 1 second
      )
    );
    
    if (uniqueMessages.length !== socketMessages.length) {
      console.log(`Removed ${socketMessages.length - uniqueMessages.length} duplicate messages automatically`);
      // Update the messages state to remove duplicates
      setMessages(uniqueMessages);
    }
    
    // Always update conversation with deduplicated messages
    setConversation(uniqueMessages);
  }, [socketMessages]);

  // Auto-scroll to bottom when conversation updates
  useEffect(() => {
    const conversationContainer = document.querySelector('.overflow-y-auto');
    if (conversationContainer) {
      conversationContainer.scrollTop = conversationContainer.scrollHeight;
    }
  }, [conversation]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        console.error('Failed to fetch users:', response.status);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

 

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    try {
      if (messageType === 'direct' && selectedUser) {
        // Send real-time message using Ably
        console.log('Sending admin message via Ably:', {
          content: message,
          receiverId: selectedUser,
          messageType: 'direct',
          socketConnected: !!socket,
          isConnected,
          selectedUserType: typeof selectedUser,
          selectedUserValue: selectedUser,
        });
        
        if (isConnected) {
          await sendMessage({
            content: message,
            receiverId: selectedUser,
            messageType: 'direct',
          });
          console.log('Admin message sent via Ably to user:', selectedUser);
        } else {
          console.error('Socket not connected, cannot send real-time message');
        }
        
        // Message sent via Ably - no need to store in database for real-time chat
        
      } else if (messageType === 'group' && selectedLevel) {
        // Send group message using Ably
        if (isConnected) {
          await sendGroupMessage({
            content: message,
            level: selectedLevel,
            messageType: 'group',
          });
          console.log('Group message sent via Ably to level:', selectedLevel);
          
          // Also add to local conversation for immediate display
          const newMessage: Message = {
            id: Date.now() + Math.random(),
            content: message,
            messageType: 'group',
            level: selectedLevel,
            isRead: false,
            createdAt: new Date().toISOString(),
            senderId: 'admin',
          };
          setMessages(prev => [...prev, newMessage]);
        }
        
        // Group message sent via Ably - no need to store in database for real-time chat
        
      } else if (messageType === 'announcement') {
        // Send announcement to announcements channel only (no individual messages)
        if (isConnected && socket) {
          console.log('Sending announcement to announcements channel');
          
          try {
            // Publish directly to announcements channel
            const announcementsChannel = socket.channels.get('announcements');
            await announcementsChannel.publish('announcement', {
              content: message,
              messageType: 'announcement',
              senderId: 'admin',
              timestamp: new Date().toISOString(),
            });
            
            console.log('Announcement sent via Ably to announcements channel');
          } catch (error) {
            console.error('Error sending announcement:', error);
          }
        }
        
        // Announcement sent via Ably - no need to store in database for real-time chat
      }

      // Clear message input
      setMessage('');
      
    } catch (error) {
      console.error('Error sending message:', error);
      // toast.error('Failed to send message. Please try again.'); // toast is not defined in this file
    } finally {
      setLoading(false);
    }
  };

  const handleCleanupMessages = async () => {
    setCleanupLoading(true);
    try {
      const response = await fetch('/api/admin/cleanup-messages', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        // toast.success(`Cleanup completed! ${data.deletedCount} messages deleted.`); // toast is not defined in this file
        alert(`Cleanup completed! ${data.deletedCount} messages deleted.`);
        // No need to refresh conversations when using Ably
      } else {
        console.error('Failed to cleanup messages:', response.status);
        // toast.error('Failed to cleanup messages. Please try again.'); // toast is not defined in this file
        alert('Failed to cleanup messages. Please try again.');
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
      // toast.error('Error during cleanup. Please try again.'); // toast is not defined in this file
      alert('Error during cleanup. Please try again.');
    } finally {
      setCleanupLoading(false);
    }
  };

  const getUsersByLevel = (level: string) => {
    return users.filter(user => user.level === level);
  };

  if (!isLoaded) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!isAdmin) {
    return <div className="text-center py-8 text-red-600">Access denied. Admin privileges required.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Messaging System</h1>
        
        {/* Connection Status */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium">
              {isConnected ? 'Connected to Ably' : 'Disconnected from Ably'}
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
          Admin ID: {user?.id} | Role: {user?.publicMetadata?.role as string}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compose Message */}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
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
                  onChange={(e) => setMessage(e.target.value)}
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

              {/* Send Announcement Button */}
              {messageType === 'announcement' && (
                <button
                  onClick={async () => {
                    if (isConnected && message.trim()) {
                      setLoading(true);
                      try {
                        // Send to announcements channel for broadcast
                        const channel = socket?.channels.get('announcements');
                        if (channel) {
                          await channel.publish('announcement', {
                            content: message,
                            messageType: 'announcement',
                            senderId: 'admin',
                            timestamp: new Date().toISOString(),
                          });
                          console.log('Announcement sent to announcements channel');
                          
                          // Also add to local conversation for immediate display
                          const newMessage: Message = {
                            id: Date.now() + Math.random(),
                            content: message,
                            messageType: 'announcement',
                            isRead: false,
                            createdAt: new Date().toISOString(),
                            senderId: 'admin',
                          };
                          setMessages(prev => [...prev, newMessage]);
                          
                          setMessage('');
                          alert('Announcement sent to all users!');
                        }
                      } catch (error) {
                        console.error('Error sending announcement:', error);
                        alert('Failed to send announcement');
                      } finally {
                        setLoading(false);
                      }
                    }
                  }}
                  disabled={loading || !message.trim() || !isConnected}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Announcement'}
                </button>
              )}

              {/* Test Ably Connection */}
              {/* <button
                onClick={() => {
                  if (isConnected) {
                    console.log('Testing Ably connection...');
                    // Send a test message to verify connection
                    sendMessage({
                      content: 'TEST MESSAGE - ' + new Date().toISOString(),
                      receiverId: selectedUser || 'test',
                      messageType: 'direct',
                    });
                    console.log('Test message sent via Ably');
                  } else {
                    console.error('Chat client not connected for test message');
                  }
                }}
                disabled={!isConnected || !selectedUser}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Test Ably Connection
              </button> */}

              {/* <button
                onClick={handleCleanupMessages}
                disabled={cleanupLoading}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed mt-2"
              >
                {cleanupLoading ? 'Cleaning...' : 'Cleanup Old Messages (7+ days)'}
              </button> */}


            </div>
          </div>

          {/* Message Preview */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Message Preview</h3>
            
            {/* Debug Information */}
            <div className="mb-4 p-3 bg-yellow-100 rounded border">
              <h4 className="font-semibold text-sm text-yellow-800 mb-2">Debug Info:</h4>
              <div className="text-xs text-yellow-700 space-y-1">
                <div>Ably Connected: {isConnected ? 'Yes' : 'No'}</div>
                <div>Selected User: {selectedUser || 'None'}</div>
                <div>Message Type: {messageType}</div>
                <div>Total Users: {users.length}</div>
                <div>Admin Role: {isAdmin ? 'Yes' : 'No'}</div>
                <div>Total Messages: {conversation.length}</div>
                <div>Socket Messages: {socketMessages.length}</div>
                <div>View Mode: {viewMode}</div>
                <div>Selected Level: {selectedLevel || 'None'}</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="text-sm text-gray-600">
                <strong>Type:</strong> {messageType.charAt(0).toUpperCase() + messageType.slice(1)}
              </div>
              
              {messageType === 'direct' && selectedUser && (
                <div className="text-sm text-gray-600">
                  <strong>To:</strong> {users.find(u => u.clerkId === selectedUser)?.fullName || selectedUser}
                </div>
              )}
              
              {messageType === 'group' && selectedLevel && (
                <div className="text-sm text-gray-600">
                  <strong>Level:</strong> {selectedLevel} ({getUsersByLevel(selectedLevel).length} users)
                </div>
              )}
              
              {message && (
                <div className="text-sm text-gray-600">
                  <strong>Content:</strong> {message}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Conversation Display */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          {/* View Mode Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              View Messages By:
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setViewMode('direct');
                  setSelectedUser('');
                  setSelectedLevel('');
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  viewMode === 'direct'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Direct Messages
              </button>
              <button
                onClick={() => {
                  setViewMode('group');
                  setSelectedUser('');
                  setSelectedLevel('');
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  viewMode === 'group'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Group Messages
              </button>
              <button
                onClick={() => {
                  setViewMode('announcement');
                  setSelectedUser('');
                  setSelectedLevel('');
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  viewMode === 'announcement'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Announcements
              </button>
            </div>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {viewMode === 'direct' && selectedUser 
              ? `Conversation with ${users.find(u => u.clerkId === selectedUser)?.fullName || selectedUser}`
              : viewMode === 'group' && selectedLevel
              ? `Group Messages - ${selectedLevel} Level`
              : viewMode === 'announcement'
              ? 'General Announcements'
              : 'All Messages (Admin Inbox)'
            }
          </h3>
          
          <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto">
            {(() => {
              // Filter messages based on view mode
              let filteredMessages = conversation;
              
              if (viewMode === 'direct' && selectedUser) {
                filteredMessages = conversation.filter(msg => 
                  (msg.senderId === selectedUser && msg.receiverId === 'admin') ||
                  (msg.senderId === 'admin' && msg.receiverId === selectedUser)
                );
              } else if (viewMode === 'group' && selectedLevel) {
                filteredMessages = conversation.filter(msg => 
                  msg.messageType === 'group' && msg.level === selectedLevel
                );
              } else if (viewMode === 'announcement') {
                filteredMessages = conversation.filter(msg => 
                  msg.messageType === 'announcement'
                );
              }
              
              console.log('Filtering messages:', {
                totalMessages: conversation.length,
                filteredMessages: filteredMessages.length,
                viewMode,
                selectedUser,
                selectedLevel,
                messages: conversation.map(m => ({ id: m.id, type: m.messageType, sender: m.senderId, content: m.content.substring(0, 50) }))
              });
              
              // Debug: Show all announcements in conversation
              const allAnnouncements = conversation.filter(msg => msg.messageType === 'announcement');
              console.log('All announcements in conversation:', allAnnouncements.map(m => ({ id: m.id, content: m.content, sender: m.senderId })));
              
              if (filteredMessages.length === 0) {
                return (
                  <div className="text-center text-gray-500 py-8">
                    {viewMode === 'direct' && selectedUser 
                      ? 'No messages yet. Start the conversation!' 
                      : viewMode === 'group' && selectedLevel
                      ? `No group messages for ${selectedLevel} level yet`
                      : viewMode === 'announcement'
                      ? 'No announcements yet'
                      : 'No messages received yet'
                    }
                  </div>
                );
              }
              
              return (
                <div className="space-y-3">
                  {filteredMessages.map((msg, index) => (
                    <div
                      key={msg.id || index}
                      className={`flex ${msg.senderId === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.senderId === 'admin'
                            ? 'bg-blue-500 text-white rounded-br-none'
                            : 'bg-gray-300 text-gray-800 rounded-bl-none'
                        }`}
                      >
                        <div className="text-sm font-medium mb-1">
                          {msg.senderId === 'admin' ? 'You' : 
                            users.find(u => u.clerkId === msg.senderId)?.fullName || 
                            users.find(u => u.clerkId === msg.senderId)?.username || 
                            msg.senderId
                          }
                          {msg.messageType === 'group' && msg.level && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {msg.level}
                            </span>
                          )}
                          {msg.messageType === 'announcement' && (
                            <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                              Announcement
                            </span>
                          )}
                        </div>
                        <div className="text-sm">{msg.content}</div>
                        <div className={`text-xs mt-1 ${
                          msg.senderId === 'admin' ? 'text-blue-100' : 'text-gray-600'
                        }`}>
                          {new Date(msg.createdAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}