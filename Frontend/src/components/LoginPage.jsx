import React, { useState } from 'react';
import API from '../services/api';
import { LogIn, Sparkles, ShieldAlert, Eye, EyeOff } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e, overrideEmail) => {
    if (e) e.preventDefault();
    const targetEmail = overrideEmail || email;
    if (!targetEmail) {
      setError('Please enter an email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Connects seamlessly to your live Render backend via centralized API client
      const res = await API.post('/login', { email: targetEmail, password });
      const data = res.data;
      
      localStorage.setItem('taskqueue_token', data.token);
      localStorage.setItem('token', data.token); // Safety fallback for consistency
      onLogin(data.user);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const demoUsers = [
    { name: 'Eleanor Vance (BOSS)', email: 'boss@company.com', role: 'BOSS' },
    { name: 'Marcus Sterling (GM)', email: 'gm@company.com', role: 'GM' },
    { name: 'Sarah Jenkins (MANAGER)', email: 'manager@company.com', role: 'MANAGER' },
    { name: 'David Chen (TL)', email: 'tl@company.com', role: 'TL' },
    { name: 'Alex Rivera (EMPLOYEE)', email: 'alex@company.com', role: 'EMPLOYEE' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/25">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white">Enterprise Task Workspace</h1>
          <p className="text-xs text-slate-400">Secure JWT Authentication Gateway</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/25 rounded-lg text-rose-400 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={(e) => handleLoginSubmit(e)} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1 uppercase tracking-wider">Corporate Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. boss@company.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1 uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In Securely'}
          </button>
        </form>

        <div className="border-t border-slate-800 pt-4 space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>QUICK DEMO ACCOUNTS (Click to Login)</span>
          </div>
          <div className="grid gap-2">
            {demoUsers.map((u) => (
              <button
                key={u.email}
                type="button"
                onClick={() => handleLoginSubmit(null, u.email)}
                className="w-full text-left bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 p-2.5 rounded-xl transition flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition">{u.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{u.email}</div>
                </div>
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {u.role}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}