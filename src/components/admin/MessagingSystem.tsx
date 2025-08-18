'use client';

import { useState, useEffect, useRef } from 'react';
import { User } from '@/lib/db/schema';

interface Message {
  id: number;
  content: string;
  messageType: string;
  visibilityLevel?: string;
  isRead: boolean;
  createdAt: string;
  senderId: string;
  receiverId: string;
  sender?: {
    clerkId: string;
    fullName?: string;
    username?: string;
    email?: string;
  };
}

export default function MessagingSystem() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'direct' | 'group' | 'announcement'>('direct');
  const [loading, setLoading] = useState(false);
  const [cleanupLoading, setCleanupLoading] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [showConversation, setShowConversation] = useState(false);
  const conversationEndRef = useRef<HTMLDivElement>(null);

  const levels = ['inmortal', 'carisma', 'benec', 'karma'];

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser && messageType === 'direct') {
      fetchConversation(selectedUser);
    }
  }, [selectedUser, messageType]);

  useEffect(() => {
    // Scroll to bottom when conversation updates
    scrollToBottom();
  }, [conversation]);

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
      const payload = {
        content: message,
        messageType,
        receiverId: messageType === 'direct' ? selectedUser : undefined,
        visibilityLevel: messageType === 'group' ? selectedLevel : undefined,
      };

      const response = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('');
        if (messageType === 'direct') {
          // Refresh conversation and scroll to bottom
          await fetchConversation(selectedUser);
        }
        alert(`Message sent successfully to ${data.recipients} recipient(s)!`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setLoading(false);
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
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Messaging System</h2>
      
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
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Type your message here..."
              />
            </div>

            <button
              onClick={handleSendMessage}
              disabled={loading || !message.trim() || (messageType === 'direct' && !selectedUser) || (messageType === 'group' && !selectedLevel)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>

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
                      <div className="text-xs text-gray-500 text-right">
                        {formatTime(msg.createdAt)}
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