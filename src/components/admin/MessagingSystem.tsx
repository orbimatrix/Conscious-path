'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { RealtimeChat } from '@/components/realtime-chat';
import { ChatMessage } from '@/hooks/use-realtime-chat';

export default function MessagingSystem() {
  const { user, isLoaded } = useUser();
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [messageType, setMessageType] = useState<'direct' | 'group' | 'announcement'>('direct');
  const [viewMode, setViewMode] = useState<'direct' | 'group' | 'announcement'>('direct');
  const [currentRoom, setCurrentRoom] = useState('admin-inbox');
  const [levels] = useState(['inmortal', 'renacer', 'karma', 'carisma', 'conocimiento', 'bienestar', 'abundancia']);

  const isAdmin = user?.publicMetadata?.role === 'admin';

  useEffect(() => {
    if (isLoaded && isAdmin) {
      fetchUsers();
    }
  }, [isLoaded, isAdmin]);

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

  const getUsersByLevel = (level: string) => {
    return users.filter(user => user.level === level);
  };

  const handleRoomChange = (type: 'direct' | 'group' | 'announcement', id?: string) => {
    setViewMode(type);
    setMessageType(type);
    
    let newRoom = '';
    if (type === 'direct' && id) {
      setSelectedUser(id);
      newRoom = `direct-${id}-admin`;
    } else if (type === 'group' && id) {
      setSelectedLevel(id);
      newRoom = `group-${id}`;
    } else if (type === 'announcement') {
      newRoom = 'announcements';
    }
    
    setCurrentRoom(newRoom);
  };

  const handleMessage = async (messages: ChatMessage[]) => {
    // Store messages in database if needed
    // This is where you would implement message persistence
  };

  if (!isLoaded) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!isAdmin) {
    return <div className="text-center py-8 text-red-600">Access denied. Admin privileges required.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Admin Messaging System</h1>
        
        {/* Admin Info */}
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-black">
              Connected to Supabase Realtime
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Admin ID: {user?.id} | Role: {user?.publicMetadata?.role as string}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Current Room: <span className="font-mono bg-gray-200 px-1 rounded">{currentRoom}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6 admin-messaging-grid">
          {/* Room Selection */}
          <div className="xl:col-span-1 bg-gray-50 p-4 sm:p-6 rounded-lg relative admin-room-selection">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Select Chat Room</h3>
            
            <div className="space-y-4">
              {/* Direct Messages */}
              <div className="relative admin-messaging-select">
                <h4 className="font-medium text-gray-700 mb-2">Direct Messages</h4>
                <select
                  value={selectedUser}
                  onChange={(e) => {
                    const userId = e.target.value;
                    setSelectedUser(userId);
                    if (userId) {
                      handleRoomChange('direct', userId);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm appearance-none bg-white relative z-10"
                >
                  <option value="">Choose a user...</option>
                  {users.map((user) => (
                    <option key={user.clerkId} value={user.clerkId} className="py-1">
                      {user.fullName || user.username || user.email} ({user.level})
                    </option>
                  ))}
                </select>
              </div>

              {/* Group Messages */}
              <div className="relative admin-messaging-select">
                <h4 className="font-medium text-gray-700 mb-2">Group Messages</h4>
                <select
                  value={selectedLevel}
                  onChange={(e) => {
                    const level = e.target.value;
                    setSelectedLevel(level);
                    if (level) {
                      handleRoomChange('group', level);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm appearance-none bg-white relative z-10"
                >
                  <option value="">Choose a level...</option>
                  {levels.map((level) => (
                    <option key={level} value={level} className="py-1">
                      {level} ({getUsersByLevel(level).length} users)
                    </option>
                  ))}
                </select>
              </div>

              {/* Announcements */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Announcements</h4>
                <button
                  onClick={() => handleRoomChange('announcement')}
                  className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    viewMode === 'announcement'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  General Announcements
                </button>
              </div>
            </div>
          </div>

          {/* Chat Display */}
          <div className="xl:col-span-3">
            <div className="bg-gray-50 rounded-lg min-h-[500px] h-[calc(100vh-300px)] max-h-[800px] flex flex-col">
              {viewMode === 'direct' && selectedUser ? (
                <div className="h-full flex flex-col">
                  <div className="p-3 sm:p-4 border-b bg-white rounded-t-lg flex-shrink-0">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                      Chat with {users.find(u => u.clerkId === selectedUser)?.fullName || selectedUser}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">Room: {currentRoom}</p>
                  </div>
                  <div className="flex-1 min-h-0">
                    <RealtimeChat
                      roomName={currentRoom}
                      username="admin"
                      onMessage={handleMessage}
                    />
                  </div>
                </div>
              ) : viewMode === 'group' && selectedLevel ? (
                <div className="h-full flex flex-col">
                  <div className="p-3 sm:p-4 border-b bg-white rounded-t-lg flex-shrink-0">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                      Group Chat - {selectedLevel} Level
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {getUsersByLevel(selectedLevel).length} users | Room: {currentRoom}
                    </p>
                  </div>
                  <div className="flex-1 min-h-0">
                    <RealtimeChat
                      roomName={currentRoom}
                      username="admin"
                      onMessage={handleMessage}
                    />
                  </div>
                </div>
              ) : viewMode === 'announcement' ? (
                <div className="h-full flex flex-col">
                  <div className="p-3 sm:p-4 border-b bg-white rounded-t-lg flex-shrink-0">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">General Announcements</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Room: {currentRoom}</p>
                  </div>
                  <div className="flex-1 min-h-0">
                    <RealtimeChat
                      roomName={currentRoom}
                      username="admin"
                      onMessage={handleMessage}
                    />
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-6">
                  <div className="text-center text-gray-500">
                    <p className="text-lg font-medium mb-2">Select a chat room</p>
                    <p className="text-sm">Choose a user, level, or announcement channel to start chatting</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
