'use client';

import { useState } from 'react';

export default function Home() {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateLove = async (e) => {
    e.preventDefault();
    if (!name1 || !name2) {
      setError('Please enter both names!');
      return;
    }
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name1, name2 }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Failed to calculate love. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setName1('');
    setName2('');
    setResult(null);
    setError('');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-pink-300/30 blur-3xl animate-pulse"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-rose-300/20 blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-pink-200/30 blur-3xl"></div>
      </div>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 transform transition-all hover:scale-[1.01] duration-300">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-600 mb-2 drop-shadow-sm">
            Love Calculator
          </h1>
          <p className="text-rose-400 font-medium">Discover your destiny together ✨</p>
        </div>

        {!result ? (
          <form onSubmit={calculateLove} className="space-y-6">
            <div className="space-y-4">
              <div className="group relative">
                <input
                  type="text"
                  value={name1}
                  onChange={(e) => setName1(e.target.value)}
                  className="w-full px-5 py-4 bg-white/50 border-2 border-pink-300 rounded-2xl focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-200 transition-all text-gray-800 placeholder-pink-400 font-medium"
                  placeholder="Your Name"
                />
                <div className="absolute right-4 top-4 text-2xl animate-bounce opacity-0 group-focus-within:opacity-100 transition-opacity">💖</div>
              </div>
              
              <div className="group relative">
                <input
                  type="text"
                  value={name2}
                  onChange={(e) => setName2(e.target.value)}
                  className="w-full px-5 py-4 bg-white/50 border-2 border-pink-300 rounded-2xl focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-200 transition-all text-gray-800 placeholder-pink-400 font-medium"
                  placeholder="Partner's Name"
                />
                 <div className="absolute right-4 top-4 text-2xl animate-bounce delay-100 opacity-0 group-focus-within:opacity-100 transition-opacity">💘</div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-500 text-sm rounded-xl text-center border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold rounded-2xl shadow-xl shadow-pink-300/50 transform transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group ring-2 ring-pink-400/20"
            >
              {loading ? (
                <span className="animate-pulse">Calculatings...</span>
              ) : (
                <>
                  <span>Calculate Love</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="relative inline-block">
              <div className="text-8xl font-black bg-clip-text text-transparent bg-gradient-to-br from-pink-500 to-rose-600 drop-shadow-sm">
                {result.percentage}%
              </div>
              <svg className="absolute -top-6 -right-8 w-16 h-16 text-pink-400 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">
                {result.names[0]} <span className="text-pink-400">&</span> {result.names[1]}
              </h2>
              <div className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-pink-400 to-transparent"></div>
              <p className="text-rose-500 font-medium text-lg italic">
                {result.percentage >= 95 ? "Soulmates! 💍" : 
                 result.percentage >= 87 ? "Perfect Match! ❤️" : 
                 "True Love! 💕"}
              </p>
            </div>

            <button
              onClick={reset}
              className="px-8 py-3 bg-white text-pink-600 font-bold rounded-xl border-2 border-pink-300 hover:bg-pink-50 hover:border-pink-400 transition-all shadow-md shadow-pink-100"
            >
              Check Another Couple
            </button>
          </div>
        )}
      </div>
      
    </main>
  );
}
