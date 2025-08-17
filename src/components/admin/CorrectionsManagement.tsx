'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';

interface User {
  id: number;
  fullName: string | null;
  email: string | null;
  username: string | null;
}

interface Correction {
  id: number;
  title: string;
  description: string;
  severity: string;
  isResolved: boolean;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  user: User;
  assignedBy: string;
}

export default function CorrectionsManagement() {
  const { user } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCorrection, setEditingCorrection] = useState<Correction | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium'
  });

  useEffect(() => {
    fetchUsers();
    fetchCorrections();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        toast.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    }
  };

  const fetchCorrections = async () => {
    try {
      const response = await fetch('/api/admin/corrections');
      if (response.ok) {
        const data = await response.json();
        setCorrections(data);
      } else {
        toast.error('Failed to fetch corrections');
      }
    } catch (error) {
      console.error('Error fetching corrections:', error);
      toast.error('Failed to fetch corrections');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !user?.id) return;

    setIsLoading(true);
    try {
      const url = editingCorrection 
        ? `/api/admin/corrections/${editingCorrection.id}`
        : '/api/admin/corrections';
      
      const method = editingCorrection ? 'PUT' : 'POST';
      const body = editingCorrection 
        ? { ...formData }
        : { ...formData, userId: selectedUserId, adminClerkId: user.id };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        setFormData({ title: '', description: '', severity: 'medium' });
        setShowForm(false);
        setEditingCorrection(null);
        setSelectedUserId('');
        fetchCorrections();
        toast.success(editingCorrection ? 'Correction updated successfully' : 'Correction created successfully');
      } else {
        toast.error('Failed to save correction');
      }
    } catch (error) {
      console.error('Error saving correction:', error);
      toast.error('Failed to save correction');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (correction: Correction) => {
    setEditingCorrection(correction);
    setFormData({
      title: correction.title,
      description: correction.description,
      severity: correction.severity
    });
    setSelectedUserId(correction.user.id.toString());
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="font-medium">Delete Correction?</p>
        <p className="text-sm text-gray-600">This action cannot be undone.</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              performDelete(id);
            }}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 0,
      position: 'top-center'
    });
  };

  const performDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/corrections/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchCorrections();
        toast.success('Correction deleted successfully');
      } else {
        toast.error('Failed to delete correction');
      }
    } catch (error) {
      console.error('Error deleting correction:', error);
      toast.error('Failed to delete correction');
    }
  };

  const handleResolve = async (correction: Correction) => {
    try {
      const response = await fetch(`/api/admin/corrections/${correction.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isResolved: !correction.isResolved })
      });

      if (response.ok) {
        fetchCorrections();
        toast.success(correction.isResolved ? 'Correction reopened successfully' : 'Correction resolved successfully');
      } else {
        toast.error('Failed to update correction');
      }
    } catch (error) {
      console.error('Error updating correction:', error);
      toast.error('Failed to update correction');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Corrections Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancel' : 'Add New Correction'}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-lg font-medium mb-4 text-black">
            {editingCorrection ? 'Edit Correction' : 'New Correction'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select User
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-black"
                required
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullName || user.username || user.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md text-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md text-black"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severity
              </label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md text-black"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : (editingCorrection ? 'Update' : 'Create')}
              </button>
              {editingCorrection && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingCorrection(null);
                    setFormData({ title: '', description: '', severity: 'medium' });
                    setSelectedUserId('');
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {corrections.map((correction) => (
            <li key={correction.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-sm font-medium text-gray-900">
                      {correction.title}
                    </h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(correction.severity)}`}>
                      {correction.severity}
                    </span>
                    {correction.isResolved && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Resolved
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{correction.description}</p>
                  <div className="text-xs text-gray-500">
                    <span>User: {correction.user.fullName || correction.user.username || correction.user.email}</span>
                    <span className="mx-2">•</span>
                    <span>Created: {new Date(correction.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleResolve(correction)}
                    className={`px-3 py-1 text-xs rounded-md ${
                      correction.isResolved
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {correction.isResolved ? 'Reopen' : 'Resolve'}
                  </button>
                  <button
                    onClick={() => handleEdit(correction)}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(correction.id)}
                    className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {corrections.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-500">
            No corrections found. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
}
