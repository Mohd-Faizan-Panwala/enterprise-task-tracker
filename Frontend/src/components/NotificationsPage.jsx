import React from 'react';

export default function NotificationsPage({ user, theme }) {
  const isLight = theme === 'light';
  return (
    <div className="space-y-4">
      <div>
        <h1 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Notifications Hub</h1>
        <p className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Real-time alerts and system broadcasts.</p>
      </div>
      <div className={`rounded-xl border divide-y ${isLight ? 'bg-white border-slate-200 divide-slate-100' : 'bg-slate-900/60 border-slate-800 divide-slate-800/60'}`}>
        <div className="p-3 flex items-center justify-between text-xs">
          <div>
            <div className="font-bold">New Task Assigned</div>
            <div className="font-mono text-[10px] opacity-70">Bug #104 has been assigned to Emily Watson.</div>
          </div>
          <span className="font-mono text-[10px] opacity-60">10m ago</span>
        </div>
        <div className="p-3 flex items-center justify-between text-xs">
          <div>
            <div className="font-bold">System Cron Synchronized</div>
            <div className="font-mono text-[10px] opacity-70">Background telemetry cron job completed successfully.</div>
          </div>
          <span className="font-mono text-[10px] opacity-60">1h ago</span>
        </div>
      </div>
    </div>
  );
}