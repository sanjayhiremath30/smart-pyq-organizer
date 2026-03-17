'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';

export default function AdminSignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role: 'ADMIN' })
      });

      if (res.ok) {
        router.push('/admin/login');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create admin account');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20 rotate-3">
            <ShieldCheck size={40} className="text-white -rotate-3" />
          </div>
          <h1 className="text-3xl font-bold font-display text-white tracking-tight">Register New Admin Portal</h1>
          <p className="text-slate-400 mt-2">Secure account creation for system administrators</p>
        </div>

        <div className="bg-slate-800 rounded-3xl p-8 border border-white/10 shadow-xl shadow-black/50">
          {error && <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 text-red-400 rounded-xl text-sm font-medium">{error}</div>}
          
          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">New Admin Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-slate-900 text-white transition-all"
                  placeholder="e.g. sysadmin"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Secure Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-slate-900 text-white transition-all"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2 group transition-all disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                <>
                  Create Admin Account
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-700 text-center">
            <p className="text-sm text-slate-400 mb-2">
              Already an admin? <button onClick={() => router.push('/admin/login')} className="font-bold text-emerald-500 hover:underline">Log in</button>
            </p>
            <button onClick={() => router.push('/login')} className="text-sm text-slate-500 hover:text-slate-300 hover:underline transition-colors mt-2">
              Return to Student Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
