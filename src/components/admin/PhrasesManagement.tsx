'use client';

import { useState, useEffect } from 'react';
import { Phrase } from '@/lib/db/schema';
import toast from 'react-hot-toast';

export default function PhrasesManagement() {
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingPhrase, setEditingPhrase] = useState<Phrase | null>(null);
  const [editContent, setEditContent] = useState('');
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchPhrases();
  }, []);

  const fetchPhrases = async () => {
    try {
      const response = await fetch('/api/admin/phrases');
      if (response.ok) {
        const data = await response.json();
        setPhrases(data.phrases);
      }
    } catch  {
      toast.error('Error fetching phrases');
    }
  };





  const handleEditPhrase = async () => {
    if (!editingPhrase || !editContent.trim()) return;

    setActionLoading(prev => ({ ...prev, [`edit-${editingPhrase.id}`]: true }));
    try {
      const payload = {
        content: editContent.trim(),
      };

      const response = await fetch(`/api/admin/phrases/${editingPhrase.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setEditingPhrase(null);
        setEditContent('');
        fetchPhrases();
        toast.success('Phrase updated successfully!');
      }
    } catch (error) {
      console.error('Error updating phrase:', error);
      toast.error('Failed to update phrase');
    } finally {
      setActionLoading(prev => ({ ...prev, [`edit-${editingPhrase.id}`]: false }));
    }
  };

  const handleDeletePhrase = async (phraseId: number) => {
    const confirmed = await new Promise<boolean>((resolve) => {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Delete Phrase
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Are you sure you want to delete this phrase? This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(false);
              }}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(true);
              }}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      ), { duration: Infinity });
    });

    if (!confirmed) return;

    setActionLoading(prev => ({ ...prev, [`delete-${phraseId}`]: true }));
    try {
      const response = await fetch(`/api/admin/phrases/${phraseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchPhrases();
        toast.success('Phrase deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting phrase:', error);
      toast.error('Failed to delete phrase');
    } finally {
      setActionLoading(prev => ({ ...prev, [`delete-${phraseId}`]: false }));
    }
  };

  const handleToggleActive = async (phraseId: number, currentStatus: boolean) => {
    setActionLoading(prev => ({ ...prev, [`toggle-${phraseId}`]: true }));
    try {
      const response = await fetch(`/api/admin/phrases/${phraseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        fetchPhrases();
      }
    } catch (error) {
      console.error('Error toggling phrase status:', error);
      toast.error('Failed to toggle phrase status');
    } finally {
      setActionLoading(prev => ({ ...prev, [`toggle-${phraseId}`]: false }));
    }
  };

  const handleBulkUpload = async () => {
    const bulkTextarea = document.getElementById('bulkPhrases') as HTMLTextAreaElement;
    const phrases = bulkTextarea.value.split('\n').filter(phrase => phrase.trim().length > 0);
    
    if (phrases.length === 0) {
      toast.error('Please enter some phrases first');
      return;
    }

    setLoading(true);
    try {
      let successCount = 0;
      for (const phrase of phrases) {
        const response = await fetch('/api/admin/phrases', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: phrase.trim() }),
        });
        if (response.ok) successCount++;
      }
      
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Bulk Upload Complete
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Successfully uploaded {successCount} out of {phrases.length} phrases!
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-green-600 hover:text-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Close
            </button>
          </div>
        </div>
      ));
      bulkTextarea.value = '';
      fetchPhrases();
    } catch (error) {
      console.error('Error bulk uploading phrases:', error);
      toast.error('Failed to upload some phrases');
    } finally {
      setLoading(false);
    }
  };

  const handleClearBulk = () => {
    const bulkTextarea = document.getElementById('bulkPhrases') as HTMLTextAreaElement;
    bulkTextarea.value = '';
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'Unknown date';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const startEditing = (phrase: Phrase) => {
    setEditingPhrase(phrase);
    setEditContent(phrase.content);
  };

  const cancelEditing = () => {
    setEditingPhrase(null);
    setEditContent('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Daily Phrases Management</h3>
        <p className="text-blue-700 text-sm">
          Add inspirational phrases that will be shown to users daily. Users will see a different phrase each day.
        </p>
      </div>

     

      {/* Bulk Upload Phrases */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Upload Phrases</h3>
        <div className="space-y-3">
          <textarea
            placeholder="Enter multiple phrases, one per line:&#10;&#10;Every day is a new beginning. Embrace the journey ahead.&#10;Your thoughts create your reality. Choose them wisely.&#10;The only way to do great work is to love what you do.&#10;Success is not final, failure is not fatal: it is the courage to continue that counts.&#10;The mind is everything. What you think you become."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-black"
            rows={8}
            id="bulkPhrases"
          />
          <div className="flex gap-2">
            <button
              onClick={handleBulkUpload}
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Uploading...' : 'Upload All Phrases'}
            </button>
            <button
              onClick={handleClearBulk}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Phrases List */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            All Phrases ({phrases.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {phrases.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No phrases added yet. Add your first phrase above.
            </div>
          ) : (
            phrases.map((phrase) => (
              <div key={phrase.id} className="p-6">
                {editingPhrase?.id === phrase.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-black"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleEditPhrase}
                        disabled={actionLoading[`edit-${editingPhrase.id}`] || !editContent.trim()}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {actionLoading[`edit-${editingPhrase.id}`] ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-gray-800 text-lg leading-relaxed">{phrase.content}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Added: {formatDate(phrase.createdAt)}</span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          phrase.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {phrase.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => startEditing(phrase)}
                        disabled={actionLoading[`edit-${phrase.id}`]}
                        className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading[`edit-${phrase.id}`] ? 'Editing...' : 'Edit'}
                      </button>
                      <button
                        onClick={() => handleToggleActive(phrase.id, phrase.isActive ?? false)}
                        disabled={actionLoading[`toggle-${phrase.id}`]}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          phrase.isActive
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {actionLoading[`toggle-${phrase.id}`] ? 'Updating...' : (phrase.isActive ? 'Deactivate' : 'Activate')}
                      </button>
                      <button
                        onClick={() => handleDeletePhrase(phrase.id)}
                        disabled={actionLoading[`delete-${phrase.id}`]}
                        className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading[`delete-${phrase.id}`] ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
