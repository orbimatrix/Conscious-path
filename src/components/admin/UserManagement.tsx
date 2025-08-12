'use client';

import { useState, useEffect } from 'react';
import { User } from '@/lib/db/schema';
import UserProfileModal from './UserProfileModal';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [profileModal, setProfileModal] = useState<{ isOpen: boolean; user: User | null }>({
    isOpen: false,
    user: null
  });

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
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleViewProfile = (user: User) => {
    setProfileModal({ isOpen: true, user });
  };

  const handleSaveUser = async (updatedUser: User) => {
    try {
      const response = await fetch(`/api/admin/users/${updatedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
        setEditingUser(null);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };



  const closeProfileModal = () => {
    setProfileModal({ isOpen: false, user: null });
  };

  const filteredUsers = users.filter(user =>
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#A3926B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#A3926B]/5 to-[#8B7355]/5 rounded-2xl p-6 border border-[#A3926B]/10">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#A3926B]/10 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-[#A3926B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          User Management
        </h2>
        
        {/* Search and Refresh */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search users by name, email, or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A3926B] focus:border-transparent transition-all duration-200 bg-white hover:bg-gray-50 placeholder-black"
            />
          </div>
          <button
            onClick={fetchUsers}
            className="px-6 py-3 bg-[#A3926B] hover:bg-[#8B7355] text-white rounded-xl transition-all duration-300 font-semibold flex items-center justify-center gap-2 hover:scale-105 transform shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:inline">Refresh</span>
            <span className="sm:hidden">↻</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
        {/* Mobile Cards View */}
        <div className="block sm:hidden">
          {filteredUsers.map((user) => (
            <div key={user.id} className="p-4 border-b border-gray-100 last:border-b-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#A3926B] to-[#8B7355] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user.fullName?.charAt(0) || user.username?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.fullName || 'N/A'}</h3>
                      <p className="text-sm text-gray-500">{user.email || user.username || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#2563eb]/10 text-[#2563eb] border border-[#2563eb]/20">
                      {user.level || 'No Level'}
                    </span>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      user.isActive ? 'bg-[#059669]/10 text-[#059669] border border-[#059669]/20' : 'bg-[#dc2626]/10 text-[#dc2626] border border-[#dc2626]/20'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#A3926B]/10 text-[#A3926B] border border-[#A3926B]/20">
                      {user.points || 0} Points
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2">
                {editingUser?.id === user.id ? (
                  <>
                    <button
                      onClick={() => handleSaveUser(editingUser)}
                      className="flex-1 px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white rounded-lg transition-all duration-200 font-medium text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingUser(null)}
                      className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 font-medium text-sm"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleViewProfile(user)}
                      className="flex-1 px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg transition-all duration-200 font-medium text-sm"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => handleEditUser(user)}
                      className="flex-1 px-4 py-2 bg-[#A3926B] hover:bg-[#8B7355] text-white rounded-lg transition-all duration-200 font-medium text-sm"
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
              
              {/* Points Edit */}
              {editingUser?.id === user.id && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                  <input
                    type="number"
                    value={editingUser.points ?? 0}
                    onChange={(e) => setEditingUser({ ...editingUser, points: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#A3926B] focus:border-transparent transition-all duration-200"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-[#A3926B]/5 to-[#8B7355]/5">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#A3926B] to-[#8B7355] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {user.fullName?.charAt(0) || user.username?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {user.fullName || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email || user.username || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#2563eb]/10 text-[#2563eb] border border-[#2563eb]/20">
                      {user.level || 'No Level'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingUser?.id === user.id ? (
                      <input
                        type="number"
                        value={editingUser.points ?? 0}
                        onChange={(e) => setEditingUser({ ...editingUser, points: parseInt(e.target.value) || 0 })}
                        className="w-24 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#A3926B] focus:border-transparent transition-all duration-200"
                      />
                    ) : (
                      <span className="font-semibold text-[#A3926B]">{user.points || 0}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      user.isActive ? 'bg-[#059669]/10 text-[#059669] border border-[#059669]/20' : 'bg-[#dc2626]/10 text-[#dc2626] border border-[#dc2626]/20'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingUser?.id === user.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveUser(editingUser)}
                          className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white rounded-lg transition-all duration-200 font-medium text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 font-medium text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewProfile(user)}
                          className="px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg transition-all duration-200 font-medium text-sm"
                        >
                          View Profile
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="px-4 py-2 bg-[#A3926B] hover:bg-[#8B7355] text-white rounded-lg transition-all duration-200 font-medium text-sm"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500">
              {searchTerm ? `No users match "${searchTerm}"` : 'No users available'}
            </p>
          </div>
        )}
      </div>

      {/* User Profile Modal */}
      <UserProfileModal
        user={profileModal.user}
        isOpen={profileModal.isOpen}
        onClose={closeProfileModal}
        onUpdate={handleSaveUser}
      />
    </div>
  );
}
