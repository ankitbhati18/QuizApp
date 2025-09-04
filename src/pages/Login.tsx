import React, { useState } from 'react';

export const Login: React.FC<{ onLogin: (user: string) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Username required');
      return;
    }
    localStorage.setItem('quizUser', username);
    onLogin(username);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-purple-200">
      <form className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-center">{isSignup ? 'Sign Up' : 'Login'}</h2>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
        <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition">{isSignup ? 'Create Account' : 'Login'}</button>
        <div className="mt-4 text-center">
          <button type="button" className="text-blue-500 underline" onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? 'Already have an account? Login' : 'New user? Sign Up'}
          </button>
        </div>
      </form>
    </div>
  );
};
