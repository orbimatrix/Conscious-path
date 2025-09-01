'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { RealtimeChat } from '@/components/realtime-chat';
import { PersistentChatMessage } from '@/hooks/use-persistent-chat';
import { usePersistentChat } from '@/hooks/use-persistent-chat';

interface UnreadCounts {
  direct: number;
  group: number;
  announcement: number;
  byLevel: Record<string, number>;
  total: number;
}

interface UserUnreadCounts {
  [userId: string]: number;
}

export default function MessagingSystem() {
  const { user, isLoaded } = useUser();
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [messageType, setMessageType] = useState<'direct' | 'group' | 'announcement'>('direct');
  const [viewMode, setViewMode] = useState<'direct' | 'group' | 'announcement'>('direct');
  const [currentRoom, setCurrentRoom] = useState(`admin-direct-${user?.id || ''}`);
  const [levels] = useState(['inmortal', 'renacer', 'karma', 'carisma', 'conocimiento', 'bienestar', 'abundancia']);
  const [unreadCounts, setUnreadCounts] = useState<UnreadCounts>({
    direct: 0,
    group: 0,
    announcement: 0,
    byLevel: {},
    total: 0
  });
  const [userUnreadCounts, setUserUnreadCounts] = useState<UserUnreadCounts>({});
  
  // Track last read time for each type separately
  const [lastReadTimes, setLastReadTimes] = useState<{
    direct: number;
    group: number;
    announcement: number;
  }>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('admin-last-read-times');
      if (stored) {
        return JSON.parse(stored);
      }
    }
    const defaultTime = Date.now() - (24 * 60 * 60 * 1000);
    return {
      direct: defaultTime,
      group: defaultTime,
      announcement: defaultTime
    };
  });

  // Use refs to track previous message counts for comparison
  const prevDirectCount = useRef(0);
  const prevGroupCount = useRef(0);
  const prevAnnouncementCount = useRef(0);

  const isAdmin = user?.publicMetadata?.role === 'admin';

  // Admin needs to listen to ALL user rooms to see unread messages
  // This is the key difference from user system - admin monitors multiple rooms
  const { messages: directMessages } = usePersistentChat({
    roomName: 'admin-inbox', // This room gets ALL direct messages for admin
    username: 'admin',
    senderId: user?.id || ''
  });

  const { messages: announcementMessages } = usePersistentChat({
    roomName: 'announcements',
    username: 'admin',
    senderId: user?.id || ''
  });

  // Listen to one representative group chat for now
  const { messages: groupMessages } = usePersistentChat({
    roomName: 'group-inmortal',
    username: 'admin',
    senderId: user?.id || ''
  });

  useEffect(() => {
    if (isLoaded && isAdmin) {
      fetchUsers();
    }
  }, [isLoaded, isAdmin]);

  // Function to immediately update unread counts when new messages arrive
  const updateUnreadCounts = useCallback(() => {
    if (!user) return;

    // For direct messages, calculate per-user unread counts
    const newUserUnreadCounts: UserUnreadCounts = {};
    let totalDirectUnread = 0;

    directMessages.forEach(msg => {
      if (msg.user.id !== user.id) { // Messages from other users
        const messageTime = new Date(msg.createdAt).getTime();
        if (messageTime > lastReadTimes.direct) {
          const userId = msg.user.id;
          newUserUnreadCounts[userId] = (newUserUnreadCounts[userId] || 0) + 1;
          totalDirectUnread++;
        }
      }
    });

    setUserUnreadCounts(newUserUnreadCounts);

    // Calculate other unread counts using their respective last read times
    const announcementUnread = announcementMessages.filter(msg => 
      msg.user.id !== user.id && 
      new Date(msg.createdAt).getTime() > lastReadTimes.announcement
    ).length;

    const groupUnread = groupMessages.filter(msg => 
      msg.user.id !== user.id && 
      new Date(msg.createdAt).getTime() > lastReadTimes.group
    ).length;

    // Initialize level counts
    const levelCounts: Record<string, number> = {};
    levels.forEach(level => {
      levelCounts[level] = 0; // For now, set to 0
    });

    const total = totalDirectUnread + groupUnread + announcementUnread;

    const newUnreadCounts = {
      direct: totalDirectUnread,
      group: groupUnread,
      announcement: announcementUnread,
      byLevel: levelCounts,
      total: total
    };

    setUnreadCounts(newUnreadCounts);


  }, [directMessages, announcementMessages, groupMessages, lastReadTimes, user, levels]);

  // Watch for new messages and immediately update unread counts
  useEffect(() => {
    // Check if we have new messages
    const hasNewDirectMessages = directMessages.length > prevDirectCount.current;
    const hasNewGroupMessages = groupMessages.length > prevGroupCount.current;
    const hasNewAnnouncementMessages = announcementMessages.length > prevAnnouncementCount.current;

         if (hasNewDirectMessages || hasNewGroupMessages || hasNewAnnouncementMessages) {
       // Update unread counts immediately
       updateUnreadCounts();
      
      // Update previous counts
      prevDirectCount.current = directMessages.length;
      prevGroupCount.current = groupMessages.length;
      prevAnnouncementCount.current = announcementMessages.length;
    }
  }, [directMessages.length, groupMessages.length, announcementMessages.length, updateUnreadCounts]);

  // Initial calculation when component mounts
  useEffect(() => {
    if (user && directMessages.length > 0) {
      updateUnreadCounts();
      prevDirectCount.current = directMessages.length;
      prevGroupCount.current = groupMessages.length;
      prevAnnouncementCount.current = announcementMessages.length;
    }
  }, [user, updateUnreadCounts]);

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

  const markMessagesAsRead = useCallback((type: 'direct' | 'group' | 'announcement', userId?: string) => {
    const now = Date.now();
    
    // Update only the specific type's last read time
    setLastReadTimes(prev => {
      const newTimes = { ...prev };
      newTimes[type] = now;
      
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin-last-read-times', JSON.stringify(newTimes));
      }
      
      return newTimes;
    });
    
    // If marking specific user as read, clear their unread count
    if (type === 'direct' && userId) {
      setUserUnreadCounts(prev => {
        const newCounts = { ...prev };
        delete newCounts[userId];
        return newCounts;
      });
    }
    
    // Immediately recalculate unread counts after marking as read
    setTimeout(() => {
      updateUnreadCounts();
    }, 100);
    

  }, [updateUnreadCounts]);

  const getUsersByLevel = (level: string) => {
    return users.filter(user => user.level === level);
  };

  const handleRoomChange = (type: 'direct' | 'group' | 'announcement', id?: string) => {
    setViewMode(type);
    setMessageType(type);
    
    let newRoom = '';
    if (type === 'direct' && id) {
      setSelectedUser(id);
      // For admin-user chat, use format: direct-{userId}-admin
      newRoom = `direct-${id}-admin`;
      // Mark messages as read for this specific user only
      markMessagesAsRead('direct', id);
    } else if (type === 'group' && id) {
      setSelectedLevel(id);
      newRoom = `group-${id}`;
      // Mark group messages as read
      markMessagesAsRead('group');
    } else if (type === 'announcement') {
      newRoom = 'announcements';
      // Mark announcement messages as read
      markMessagesAsRead('announcement');
    }
    
    setCurrentRoom(newRoom);
  };

  const handleMessage = async (messages: PersistentChatMessage[]) => {
    // Store messages in database if needed
    // This is where you would implement message persistence
    
    // Immediately update unread counts when new messages arrive
    setTimeout(() => {
      updateUnreadCounts();
    }, 100);
  };

  if (!isLoaded) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!isAdmin) {
    return <div className="text-center py-8 text-red-600">Access denied. Admin privileges required.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4 sm:gap-6">
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
          <p className="text-xs text-gray-600 mt-1">
            View Mode: {viewMode} | Selected User: {selectedUser} | Selected Level: {selectedLevel}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Unread counts: Direct: {unreadCounts.direct}, Group: {unreadCounts.group}, Announcements: {unreadCounts.announcement}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Total Unread: {unreadCounts.total} | Last Read Times: Direct: {new Date(lastReadTimes.direct).toLocaleString()}, Group: {new Date(lastReadTimes.group).toLocaleString()}, Announcements: {new Date(lastReadTimes.announcement).toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Message Counts: Direct: {directMessages.length}, Group: {groupMessages.length}, Announcements: {announcementMessages.length}
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6 admin-messaging-grid">
          {/* Room Selection */}
          <div className="xl:col-span-1 bg-gray-50 p-4 sm:p-6 rounded-lg relative admin-room-selection">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Select Chat Room</h3>
            
            <div className="space-y-4">
              {/* Direct Messages */}
              <div className="relative admin-messaging-select">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-700">Direct Messages</h4>
                  {unreadCounts.direct > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {unreadCounts.direct}
                    </span>
                  )}
                </div>
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
                  {users.map((userItem) => (
                    <option key={userItem.clerkId} value={userItem.clerkId} className="py-1">
                      {userItem.fullName || userItem.username || userItem.email} ({userItem.level})
                      {userUnreadCounts[userItem.clerkId] > 0 && ` - ${userUnreadCounts[userItem.clerkId]} unread`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Group Messages */}
              <div className="relative admin-messaging-select">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-700">Group Messages</h4>
                  {unreadCounts.group > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {unreadCounts.group}
                    </span>
                  )}
                </div>
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
                      {unreadCounts.byLevel[level] > 0 && ` - ${unreadCounts.byLevel[level]} unread`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Announcements */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-700">Announcements</h4>
                  {unreadCounts.announcement > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {unreadCounts.announcement}
                    </span>
                  )}
                </div>
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

              {/* Total Unread Count */}
              {unreadCounts.total > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-red-800">Total Unread</span>
                    <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full font-bold">
                      {unreadCounts.total}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chat Display */}
          <div className="xl:col-span-3">
            <div className="bg-gray-50 rounded-lg min-h-[500px] h-[calc(100vh-300px)] max-h-[800px] flex flex-col">
              {viewMode === 'direct' && selectedUser ? (
                <div className="h-full flex flex-col">
                  <div className="p-3 sm:p-4 border-b bg-white rounded-t-lg flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                          Chat with {users.find(u => u.clerkId === selectedUser)?.fullName || selectedUser}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">Room: {currentRoom}</p>
                      </div>
                      {userUnreadCounts[selectedUser] > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {userUnreadCounts[selectedUser]} unread
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-h-0">
                    <RealtimeChat
                      roomName={currentRoom}
                      username="admin"
                      senderId={user?.id || ''}
                      onMessage={handleMessage}
                    />
                  </div>
                </div>
              ) : viewMode === 'group' && selectedLevel ? (
                <div className="h-full flex flex-col">
                  <div className="p-3 sm:p-4 border-b bg-white rounded-t-lg flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                          Group Chat - {selectedLevel} Level
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {getUsersByLevel(selectedLevel).length} users | Room: {currentRoom}
                        </p>
                      </div>
                      {unreadCounts.byLevel[selectedLevel] > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {unreadCounts.byLevel[selectedLevel]} unread
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-h-0">
                    <RealtimeChat
                      roomName={currentRoom}
                      username="admin"
                      senderId={user?.id || ''}
                      onMessage={handleMessage}
                    />
                  </div>
                </div>
              ) : viewMode === 'announcement' ? (
                <div className="h-full flex flex-col">
                  <div className="p-3 sm:p-4 border-b bg-white rounded-t-lg flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm sm:text-base">General Announcements</h3>
                        <p className="text-xs sm:text-sm text-gray-600">Room: {currentRoom}</p>
                      </div>
                      {unreadCounts.announcement > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {unreadCounts.announcement} unread
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-h-0">
                    <RealtimeChat
                      roomName={currentRoom}
                      username="admin"
                      senderId={user?.id || ''}
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
