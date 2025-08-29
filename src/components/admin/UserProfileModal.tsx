'use client';

import { useState, useEffect } from 'react';
import { User } from '@/lib/db/schema';

interface UserProfileModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedUser: User) => void;
}

interface TimezoneData {
  timezone: string;
  timezoneOffset: number;
  timezoneUpdatedAt: string;
  previousTimezone?: string;
  timezoneHistory?: Array<{
    timezone: string;
    timestamp: string;
    previousTimezone?: string;
  }>;
}

export default function UserProfileModal({ user, isOpen, onClose, onUpdate }: UserProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [timezoneData, setTimezoneData] = useState<TimezoneData | null>(null);
  const [loadingTimezone, setLoadingTimezone] = useState(false);

  // Fetch timezone data when modal opens
  useEffect(() => {
    if (isOpen && user) {
      // Use Clerk ID instead of database ID
      fetchUserTimezoneData(user.clerkId || user.id.toString());
    }
  }, [isOpen, user]);

  const fetchUserTimezoneData = async (userId: string) => {
    setLoadingTimezone(true);
    try {
      // Fetch user's Clerk metadata to get timezone info
      const response = await fetch(`/api/admin/users/${userId}/timezone`);
      if (response.ok) {
        const data = await response.json();
        setTimezoneData(data.timezoneData);
      }
    } catch (error) {
      console.error('Error fetching timezone data:', error);
    } finally {
      setLoadingTimezone(false);
    }
  };

  // Get current time in user's timezone
  const getUserCurrentTime = (timezone: string) => {
    try {
      return new Date().toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour12: true,
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return 'Invalid timezone';
    }
  };

  // Get timezone offset from admin time
  const getTimezoneOffset = (timezone: string) => {
    try {
      const now = new Date();
      const userTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
      const localTime = new Date(now.toLocaleString('en-US'));
      const diffMs = userTime.getTime() - localTime.getTime();
      const diffHours = Math.round(diffMs / (1000 * 60 * 60));
      
      if (diffHours > 0) {
        return `+${diffHours}h ahead`;
      } else if (diffHours < 0) {
        return `${Math.abs(diffHours)}h behind`;
      } else {
        return 'Same time';
      }
    } catch {
      return 'Unknown';
    }
  };
  

  if (!isOpen || !user) return null;

  const handleEdit = () => {
    setEditedUser({ ...user });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedUser) {
      onUpdate(editedUser);
      setIsEditing(false);
      setEditedUser(null);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(null);
  };

  const currentUser = isEditing ? editedUser! : user;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-3xl sm:max-w-4xl lg:max-w-5xl max-h-[90vh] sm:max-h-[85vh] overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#A3926B] to-[#8B7355] px-4 sm:px-6 py-4 sm:py-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">User Profile</h2>
                <p className="text-[#F5F5F5] text-xs sm:text-sm lg:text-base opacity-90">Manage user information and settings</p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
                {!isEditing && (
                  <button
                    onClick={handleEdit}
                    className="px-3 sm:px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 flex items-center gap-2 backdrop-blur-sm border border-white/30 hover:scale-105 transform text-xs sm:text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 flex items-center justify-center backdrop-blur-sm border border-white/30 hover:scale-110 transform"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 lg:p-6 overflow-y-auto max-h-[calc(90vh-200px)] sm:max-h-[calc(85vh-220px)] bg-[#F5F5F5]">
          {/* User Avatar & Basic Info */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6 p-3 sm:p-4 lg:p-6 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#A3926B] to-[#8B7355] rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-lg self-center sm:self-auto">
              {currentUser.fullName?.charAt(0) || currentUser.username?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">{currentUser.fullName || 'No Name'}</h3>
              <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">{currentUser.email || 'No Email'}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3">
                <span className={`px-2 py-1 sm:px-3 sm:py-1.5 text-xs font-semibold rounded-lg sm:rounded-xl ${
                  currentUser.isActive ? 'bg-[#059669]/10 text-[#059669] border border-[#059669]/20' : 'bg-[#dc2626]/10 text-[#dc2626] border border-[#dc2626]/20'
                }`}>
                  {currentUser.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs font-semibold rounded-lg sm:rounded-xl bg-[#2563eb]/10 text-[#2563eb] border border-[#2563eb]/20">
                  {currentUser.level || 'No Level'}
                </span>
                <span className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs font-semibold rounded-lg sm:rounded-xl bg-[#A3926B]/10 text-[#A3926B] border border-[#A3926B]/20">
                  {currentUser.points || 0} Points
                </span>
              </div>
            </div>
          </div>

          {/* Timezone Section - NEW! */}
          <div className="mb-4 sm:mb-6">
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:p-4 lg:p-6 shadow-lg">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Timezone Information
              </h4>
              
              {loadingTimezone ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                  <span className="ml-3 text-gray-600">Loading timezone data...</span>
                </div>
              ) : timezoneData ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Live Clock */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                    <div className="text-center">
                      <div className="text-3xl font-mono font-bold text-blue-900 mb-2">
                        {getUserCurrentTime(timezoneData.timezone)}
                      </div>
                      <div className="text-sm text-blue-600 mb-1">
                        {timezoneData.timezone}
                      </div>
                      <div className="text-xs text-blue-500 bg-blue-100 px-2 py-1 rounded">
                        {getTimezoneOffset(timezoneData.timezone)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Timezone Details */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                        Current Timezone
                      </label>
                      <p className="text-gray-900 text-sm sm:text-base px-3 py-2 bg-gray-50 rounded-lg">
                        {timezoneData.timezone}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                        Time Difference
                      </label>
                      <p className="text-gray-900 text-sm sm:text-base px-3 py-2 bg-gray-50 rounded-lg">
                        {getTimezoneOffset(timezoneData.timezone)}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                        Last Updated
                      </label>
                      <p className="text-gray-900 text-xs sm:text-sm px-3 py-2 bg-gray-50 rounded-lg">
                        {timezoneData.timezoneUpdatedAt 
                          ? new Date(timezoneData.timezoneUpdatedAt).toLocaleString() 
                          : 'Never updated'}
                      </p>
                    </div>

                    {timezoneData.previousTimezone && (
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                          Previous Timezone
                        </label>
                        <p className="text-gray-900 text-xs sm:text-sm px-3 py-2 bg-gray-50 rounded-lg">
                          {timezoneData.previousTimezone}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>No timezone data available</p>
                  <p className="text-sm">User hasn&apos;t visited the app yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            {/* Basic Information */}
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:p-4 lg:p-6 shadow-lg">
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#2563eb]/10 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#2563eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  Basic Information
                </h4>
                
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={currentUser.fullName || ''}
                        onChange={(e) => setEditedUser({ ...currentUser, fullName: e.target.value })}
                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-xs sm:text-sm"
                        placeholder="Enter full name"
                      />
                    ) : (
                      <p className="text-gray-900 text-sm sm:text-base px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-50 rounded-lg sm:rounded-xl">{currentUser.fullName || 'N/A'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Username</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={currentUser.username || ''}
                        onChange={(e) => setEditedUser({ ...currentUser, username: e.target.value })}
                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-xs sm:text-sm"
                        placeholder="Enter username"
                      />
                    ) : (
                      <p className="text-gray-900 text-sm sm:text-base px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-50 rounded-lg sm:rounded-xl">{currentUser.username || 'N/A'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={currentUser.email || ''}
                        onChange={(e) => setEditedUser({ ...currentUser, email: e.target.value })}
                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-xs sm:text-sm"
                        placeholder="Enter email"
                      />
                    ) : (
                      <p className="text-gray-900 text-sm sm:text-base px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-50 rounded-lg sm:rounded-xl">{currentUser.email || 'N/A'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Birth Date</label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={currentUser.birthDate || ''}
                        onChange={(e) => setEditedUser({ ...currentUser, birthDate: e.target.value })}
                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-xs sm:text-sm"
                      />
                    ) : (
                      <p className="text-gray-900 text-sm sm:text-base px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-50 rounded-lg sm:rounded-xl">
                        {currentUser.birthDate ? new Date(currentUser.birthDate).toLocaleDateString() : 'N/A'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">City</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={currentUser.city || ''}
                        onChange={(e) => setEditedUser({ ...currentUser, city: e.target.value })}
                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-xs sm:text-sm"
                        placeholder="Enter city"
                      />
                    ) : (
                      <p className="text-gray-900 text-sm sm:text-base px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-50 rounded-lg sm:rounded-xl">{currentUser.city || 'N/A'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Account & Status */}
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:p-4 lg:p-6 shadow-lg">
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#059669]/10 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#059669]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Account & Status
                </h4>
                
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">User ID</label>
                    <p className="text-gray-900 font-mono text-xs sm:text-sm bg-gray-100 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl">{currentUser.id}</p>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Status</label>
                    {isEditing ? (
                      <select
                        value={currentUser.isActive ? 'true' : 'false'}
                        onChange={(e) => setEditedUser({ ...currentUser, isActive: e.target.value === 'true' })}
                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-xs sm:text-sm"
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    ) : (
                      <span className={`inline-flex px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold rounded-lg sm:rounded-xl ${
                        currentUser.isActive ? 'bg-[#059669]/10 text-[#059669] border border-[#059669]/20' : 'bg-[#dc2626]/10 text-[#dc2626] border border-[#dc2626]/20'
                      }`}>
                        {currentUser.isActive ? 'Active' : 'Inactive'}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Level</label>
                    {isEditing ? (
                      <select
                        value={currentUser.level || ''}
                        onChange={(e) => setEditedUser({ ...currentUser, level: e.target.value })}
                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-xs sm:text-sm"
                      >
                        <option value="inmortal">Inmortal</option>
                        <option value="carisma">Carisma</option>
                        <option value="benec">Benec</option>
                        <option value="karma">Karma</option>
                        <option value="renacer">Renacer</option>
                      </select>
                    ) : (
                      <span className="inline-flex px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold rounded-lg sm:rounded-xl bg-[#2563eb]/10 text-[#2563eb] border border-[#2563eb]/20">
                        {currentUser.level || 'N/A'}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Points</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={currentUser.points || 0}
                        onChange={(e) => setEditedUser({ ...currentUser, points: parseInt(e.target.value) || 0 })}
                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-xs sm:text-sm"
                      />
                    ) : (
                      <p className="text-gray-900 font-bold text-lg sm:text-xl px-2 sm:px-3 py-1.5 sm:py-2 bg-[#A3926B]/10 rounded-lg sm:rounded-xl text-[#A3926B]">{currentUser.points || 0}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Created At</label>
                    <p className="text-gray-900 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-50 rounded-lg sm:rounded-xl">
                      {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Communication & Social */}
          <div className="mt-4 sm:mt-6">
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:p-4 lg:p-6 shadow-lg">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#A3926B]/10 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#A3926B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                Communication & Social
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Telegram</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentUser.telegram || ''}
                      onChange={(e) => setEditedUser({ ...currentUser, telegram: e.target.value })}
                      placeholder="@username"
                      className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-xs sm:text-sm"
                    />
                  ) : (
                    <div className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-50 rounded-lg sm:rounded-xl">
                      {currentUser.telegram ? (
                        <a href={`https://t.me/${currentUser.telegram}`} target="_blank" rel="noopener noreferrer" className="text-[#2563eb] hover:text-[#1d4ed8] flex items-center gap-2 transition-colors duration-200 text-xs sm:text-sm">
                          @{currentUser.telegram}
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ) : 'N/A'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Signal</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentUser.signal || ''}
                      onChange={(e) => setEditedUser({ ...currentUser, signal: e.target.value })}
                      placeholder="Signal username"
                      className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-xs sm:text-sm"
                    />
                  ) : (
                    <p className="text-gray-900 text-sm sm:text-base px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-50 rounded-lg sm:rounded-xl">{currentUser.signal || 'N/A'}</p>
                  )}
                </div>

                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Last Daily Claim</label>
                  <p className="text-gray-900 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-50 rounded-lg sm:rounded-xl">
                    {currentUser.lastDailyClaim ? new Date(currentUser.lastDailyClaim).toLocaleString() : 'Never claimed'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Biography Section */}
          <div className="mt-4 sm:mt-6">
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:p-4 lg:p-6 shadow-lg">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#dc2626]/10 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#dc2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                Esta es mi historia
              </h4>
              
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Biografía del Usuario</label>
                {isEditing ? (
                  <textarea
                    value={currentUser.biography || ''}
                    onChange={(e) => setEditedUser({ ...currentUser, biography: e.target.value })}
                    placeholder="El usuario aún no ha escrito su biografía..."
                    rows={6}
                    maxLength={1000}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-xs sm:text-sm resize-vertical"
                  />
                ) : (
                  <div className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-50 rounded-lg sm:rounded-xl min-h-[120px]">
                    {currentUser.biography ? (
                      <div className="text-gray-900 text-sm sm:text-base whitespace-pre-wrap">
                        {currentUser.biography}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm sm:text-base italic">
                        El usuario aún no ha escrito su biografía.
                      </p>
                    )}
                  </div>
                )}
                
                {isEditing && (
                  <div className="text-right mt-2">
                    <span className="text-xs text-gray-500">
                      {(currentUser.biography?.length || 0)}/1000 caracteres
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 bg-white border-t border-gray-100">
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg sm:rounded-xl transition-all duration-300 font-semibold hover:scale-105 transform text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-[#059669] hover:bg-[#047857] text-white rounded-lg sm:rounded-xl transition-all duration-300 font-semibold flex items-center justify-center gap-2 hover:scale-105 transform shadow-lg text-xs sm:text-sm"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-[#A3926B] hover:bg-[#8B7355] text-white rounded-lg sm:rounded-xl transition-all duration-300 font-semibold hover:scale-105 transform shadow-lg text-xs sm:text-sm"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
