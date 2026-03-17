'use client';

import React, { useState, useEffect } from 'react';
import QuestionCard from '@/components/QuestionCard';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetch('/api/favorites')
      .then(res => res.json())
      .then(data => setFavorites(data))
      .catch(err => console.error("Error fetching favorites:", err));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Favorite Questions</h1>
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favorites.map((q: any) => (
            <QuestionCard 
              key={q.id}
              id={q.id}
              text={q.text}
              marks={q.marks}
              frequency={q.frequency}
              answer={q.answer}
            />
          ))}
        </div>
      ) : (
        <div className="dashboard-card p-10 text-center text-slate-400">
          No favorite questions yet.
        </div>
      )}
    </div>
  );
}
