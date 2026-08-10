import React from 'react';

export default function SettingsPage({ user, theme }) {
  const isLight = theme === 'light';
  return (
    <div className="space-y-4">
      <div>
        <h1 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Settings & Security</h1>
        <p className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Configure preferences and authentication settings.</p>
      </div>
      <div className="space-y-3 max-w-xl">
        <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
          <div>
            <div className="font-bold">Workspace Name</div>
            <div className="font-mono text-[10px] opacity-70">TaskQueue Enterprise Edition</div>
          </div>
          <span className="font-mono text-[10px] px-2 py-1 rounded bg-cyan-500 text-slate-950 font-bold">Locked</span>
        </div>
        <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
          <div>
            <div className="font-bold">Two-Factor Authentication</div>
            <div className="font-mono text-[10px] opacity-70">Enforced for all supervisor accounts.</div>
          </div>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Enabled</span>
        </div>
      </div>
    </div>
  );
}