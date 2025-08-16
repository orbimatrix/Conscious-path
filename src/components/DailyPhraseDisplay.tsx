'use client';

import { useState, useEffect } from 'react';

interface DailyPhrase {
  phrase: string;
  isDefault: boolean;
  phraseId?: number;
}

export default function DailyPhraseDisplay() {
  const [dailyPhrase, setDailyPhrase] = useState<DailyPhrase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDailyPhrase();
  }, []);

  const fetchDailyPhrase = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/daily-phrase');
      
      if (response.ok) {
        const data = await response.json();
        setDailyPhrase(data);
        setError(null);
      } else {
        setError('Failed to fetch daily phrase');
      }
    } catch (error) {
      console.error('Error fetching daily phrase:', error);
      setError('Failed to fetch daily phrase');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 animate-pulse">
        <div className="h-4 bg-blue-200 rounded w-1/4 mb-3"></div>
        <div className="h-6 bg-blue-200 rounded w-3/4"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-2 text-red-700">
          <span className="text-lg">⚠️</span>
          <span className="font-medium">Daily Phrase</span>
        </div>
        <p className="text-red-600 mt-2">{error}</p>
        <button
          onClick={fetchDailyPhrase}
          className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!dailyPhrase) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-center gap-2 text-blue-700 mb-3">
        <span className="text-lg">💭</span>
        <span className="font-medium">Daily Phrase</span>
        {dailyPhrase.isDefault && (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            Default
          </span>
        )}
      </div>
      
      <blockquote className="text-gray-800 text-lg leading-relaxed italic">
        &ldquo;{dailyPhrase.phrase}&rdquo;
      </blockquote>
      
      <div className="mt-4 text-sm text-blue-600">
        <p>✨ This phrase changes every day to inspire your journey</p>
      </div>
    </div>
  );
}
