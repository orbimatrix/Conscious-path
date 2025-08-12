'use client';

import { useState, useEffect } from 'react';
import { User } from '@/lib/db/schema';

export default function MessagingSystem() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'direct' | 'group' | 'announcement'>('direct');
  const [loading, setLoading] = useState(false);

  const levels = ['inmortal', 'carisma', 'benec', 'karma', 'renacer'];

  useEffect(() => {
    fetchUsers();
  }, []);

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
        setMessage('');
        setSelectedUser('');
        setSelectedLevel('');
        alert('Message sent successfully!');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const getUsersByLevel = (level: string) => {
    return users.filter(user => user.level === level);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Messaging System</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      </div>
    </div>
  );
}
