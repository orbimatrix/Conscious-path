'use client';

import React, { useState, useEffect } from 'react';

interface DailyPhrase {
  phrase: string;
  isDefault: boolean;
  phraseId?: number;
}

export default function QuoteOfTheDay() {
  const [dailyPhrase, setDailyPhrase] = useState<DailyPhrase | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyPhrase();
  }, []);

  const fetchDailyPhrase = async () => {
    try {
      const response = await fetch('/api/user/daily-phrase');
      if (response.ok) {
        const data = await response.json();
        setDailyPhrase(data);
      } else {
        // Fallback to default phrase if API fails
        setDailyPhrase({
          phrase: "RECUERDA, TÚ NO ERES TU CUERPO",
          isDefault: true
        });
      }
    } catch (error) {
      console.error('Error fetching daily phrase:', error);
      // Fallback to default phrase if API fails
      setDailyPhrase({
        phrase: "RECUERDA, TÚ NO ERES TU CUERPO",
        isDefault: true
      });
    } finally {
      setLoading(false);
    }
  };

  const displayPhrase = dailyPhrase?.phrase || "RECUERDA, TÚ NO ERES TU CUERPO";

  return (
    <section className="usuario-quote-section">
      <div className="usuario-quote-container">
        <div className="usuario-quote-header">
          <div className="usuario-quote-line"></div>
          <h2 className="usuario-quote-title">FRASE DEL DÍA</h2>
          <div className="usuario-quote-line"></div>
        </div>
        <div className="usuario-quote-text">
          {loading ? (
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
          ) : (
            `"${displayPhrase}"`
          )}
        </div>
        <div className="usuario-quote-separator"></div>
        {dailyPhrase && !dailyPhrase.isDefault && (
          <div className="text-center text-sm text-gray-500 mt-2">
            ✨ Nueva frase cada día
          </div>
        )}
      </div>
    </section>
  );
}
