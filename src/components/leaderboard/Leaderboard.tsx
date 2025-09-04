import React, { useEffect, useState } from 'react';
import { Crown, User } from 'lucide-react';

interface LeaderboardEntry {
  name: string;
  score: number;
}

export const Leaderboard: React.FC<{ user?: string }> = ({ user }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    setEntries(stored);
  }, []);

  return (
    <div className="bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 rounded-2xl p-6 shadow-xl max-w-lg mx-auto mt-8">
      <h2 className="text-3xl font-bold text-center mb-4 flex items-center justify-center gap-2">
        <Crown className="text-yellow-400 w-8 h-8 animate-bounce" /> Leaderboard
      </h2>
      <ul className="divide-y divide-purple-200">
        {entries.map((entry, idx) => (
          <li key={entry.name} className={`flex items-center justify-between py-3 ${entry.name === user ? 'bg-blue-100' : ''}`}>
            <span className="flex items-center gap-2">
              <User className="w-6 h-6 text-purple-500" />
              <span className={`font-bold text-lg ${idx === 0 ? 'text-yellow-500' : idx === 2 ? 'text-blue-500' : 'text-gray-700'}`}>{entry.name}</span>
            </span>
            <span className="text-xl font-mono">{entry.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
// Add logic to filter and show only active scheduled quizzes if needed
