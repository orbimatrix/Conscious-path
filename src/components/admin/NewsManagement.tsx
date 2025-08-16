'use client';

import { useState, useEffect } from 'react';
import { User, News } from '@/lib/db/schema';

export default function NewsManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isGeneral, setIsGeneral] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchNews();
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

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/admin/news');
      if (response.ok) {
        const data = await response.json();
        setNews(data.news);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const handlePublishNews = async () => {
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    try {
      const payload = {
        title: title.trim(),
        content: content.trim(),
        targetUserId: isGeneral ? null : selectedUser,
      };

      const response = await fetch('/api/admin/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setTitle('');
        setContent('');
        setSelectedUser('');
        setIsGeneral(false);
        fetchNews();
        alert('News published successfully!');
      }
    } catch (error) {
      console.error('Error publishing news:', error);
      alert('Failed to publish news');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNews = async (newsId: number) => {
    if (!confirm('Are you sure you want to delete this news item?')) return;

    try {
      const response = await fetch(`/api/admin/news/${newsId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchNews();
        alert('News deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting news:', error);
      alert('Failed to delete news');
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'Unknown date';
    
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">News Management</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* News Creation */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Publish News</h3>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isGeneral}
                  onChange={(e) => setIsGeneral(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">General News (for all users)</span>
              </label>
            </div>

            {!isGeneral && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target User (Optional)
                </label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                >
                  <option value="">All Users</option>
                  {users.map((user) => (
                    <option key={user.clerkId} value={user.clerkId}>
                      {user.fullName || user.username || user.email} ({user.level})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                News Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Enter news title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                News Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Enter news content..."
              />
            </div>

            <button
              onClick={handlePublishNews}
              disabled={loading || !title.trim() || !content.trim()}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Publishing...' : 'Publish News'}
            </button>
          </div>
        </div>

        {/* News Preview */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">News Preview</h3>
          
          {title || content ? (
            <div className="bg-white p-4 rounded border">
              <div className="text-sm text-gray-500 mb-2">
                {isGeneral ? 'General News' : selectedUser ? `Targeted to: ${users.find(u => u.clerkId === selectedUser)?.fullName || 'Unknown User'}` : 'All Users'}
              </div>
              {title && <h4 className="text-lg font-semibold text-gray-900 mb-2">{title}</h4>}
              {content && <p className="text-gray-700 whitespace-pre-wrap">{content}</p>}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">
              Start typing to see a preview...
            </div>
          )}
        </div>
      </div>

      {/* Published News List */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Published News</h3>
        
        <div className="space-y-4">
          {news.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded border">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.targetUserId ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {item.targetUserId ? 'Targeted' : 'General'}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{item.content}</p>
                  <div className="text-sm text-gray-500">
                    Published: {formatDate(item.createdAt)}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteNews(item.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          
          {news.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No news published yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
