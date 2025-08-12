'use client';

import { useState, useEffect } from 'react';
import { User, UserLevel } from '@/lib/db/schema';

export default function UserLevels() {
  const [users, setUsers] = useState<User[]>([]);
  const [userLevels, setUserLevels] = useState<UserLevel[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [expirationDate, setExpirationDate] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  const levels = ['inmortal', 'carisma', 'benec', 'karma', 'renacer'];

  useEffect(() => {
    fetchUsers();
    fetchUserLevels();
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

  const fetchUserLevels = async () => {
    try {
      const response = await fetch('/api/admin/user-levels');
      if (response.ok) {
        const data = await response.json();
        setUserLevels(data.userLevels);
      }
    } catch (error) {
      console.error('Error fetching user levels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignLevel = async () => {
    if (!selectedUser || !selectedLevel) return;

    setAssigning(true);
    try {
      const payload = {
        userId: users.find(u => u.clerkId === selectedUser)?.id,
        level: selectedLevel,
        expiresAt: expirationDate || null,
      };

      const response = await fetch('/api/admin/user-levels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSelectedUser('');
        setSelectedLevel('');
        setExpirationDate('');
        fetchUserLevels();
        alert('Level assigned successfully!');
      }
    } catch (error) {
      console.error('Error assigning level:', error);
      alert('Failed to assign level');
    } finally {
      setAssigning(false);
    }
  };

  const handleRemoveLevel = async (levelId: number) => {
    if (!confirm('Are you sure you want to remove this level?')) return;

    try {
      const response = await fetch(`/api/admin/user-levels/${levelId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchUserLevels();
        alert('Level removed successfully!');
      }
    } catch (error) {
      console.error('Error removing level:', error);
      alert('Failed to remove level');
    }
  };



  const getUserLevels = (userId: number) => {
    return userLevels.filter(ul => ul.userId === userId && ul.isActive);
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'No expiration';
    
    // Convert string to Date if needed
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isExpired = (expiresAt: Date | string | null) => {
    if (!expiresAt) return false;
    
    // Convert string to Date if needed
    const dateObj = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return false;
    }
    
    return dateObj < new Date();
  };

  if (loading) {
    return <div className="text-center py-8">Loading user levels...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">User Level Management</h2>
      
      {/* Level Assignment */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Assign New Level</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  {user.fullName || user.username || user.email} (Current: {user.level})
                </option>
              ))}
            </select>
          </div>

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
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiration Date (Optional)
            </label>
            <input
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleAssignLevel}
              disabled={assigning || !selectedUser || !selectedLevel}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {assigning ? 'Assigning...' : 'Assign Level'}
            </button>
          </div>
        </div>
      </div>

      {/* User Levels Overview */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Current User Levels</h3>
        
        <div className="space-y-6">
          {users.map((user) => {
            const userCurrentLevels = getUserLevels(user.id);
            return (
              <div key={user.id} className="bg-white p-4 rounded border">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {user.fullName || user.username || user.email}
                    </h4>
                    <p className="text-sm text-gray-600">ID: {user.id}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">Base Level:</span>
                    <div className="font-medium text-gray-900">{user.level}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  {userCurrentLevels.length > 0 ? (
                    userCurrentLevels.map((userLevel) => (
                      <div key={userLevel.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                            isExpired(userLevel.expiresAt) ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {userLevel.level.charAt(0).toUpperCase() + userLevel.level.slice(1)}
                          </span>
                          <span className="text-sm text-gray-600">
                            Expires: {formatDate(userLevel.expiresAt)}
                          </span>
                          {isExpired(userLevel.expiresAt) && (
                            <span className="text-xs text-red-600 font-medium">EXPIRED</span>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveLevel(userLevel.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-center py-4">
                      No additional levels assigned
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
