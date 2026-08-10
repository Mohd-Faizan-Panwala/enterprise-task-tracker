import React from 'react';

export default function IntegrationsPage({ user, theme }) {
  const isLight = theme === 'light';
  return (
    <div className="space-y-4">
      <div>
        <h1 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Workspace Integrations</h1>
        <p className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Connect external services and webhooks.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {['GitHub Webhooks', 'Slack Notifications', 'Jira Sync'].map((item, idx) => (
          <div key={idx} className={`p-4 rounded-xl border flex flex-col justify-between space-y-4 ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
            <div>
              <div className="text-xs font-bold">{item}</div>
              <div className="text-[10px] font-mono opacity-70 mt-1">Connected & syncing securely.</div>
            </div>
            <span className="self-start text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Active
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}