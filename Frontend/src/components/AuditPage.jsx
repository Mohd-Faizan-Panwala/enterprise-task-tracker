import React from 'react';

export default function AuditPage({ user, theme }) {
  const isLight = theme === 'light';
  const logs = [
    { event: 'TASK_CREATED', user: 'boss@company.com', status: 'SUCCESS', time: 'Just now' },
    { event: 'JWT_AUTH_VERIFIED', user: 'system@internal', status: 'SUCCESS', time: '5 mins ago' },
    { event: 'ROLE_PRIVILEGE_CHECK', user: 'boss@company.com', status: 'VERIFIED', time: '12 mins ago' },
    { event: 'TASK_STATUS_UPDATED', user: 'emily@company.com', status: 'SUCCESS', time: '24 mins ago' },
  ];
  return (
    <div className="space-y-4">
      <div>
        <h1 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Audit Logs & Security Telemetry</h1>
        <p className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Immutable event history and stream logs.</p>
      </div>
      <div className={`rounded-xl border divide-y ${isLight ? 'bg-white border-slate-200 divide-slate-100' : 'bg-slate-900/60 border-slate-800 divide-slate-800/60'}`}>
        {logs.map((log, idx) => (
          <div key={idx} className="p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
              <div>
                <div className="font-mono font-bold text-cyan-400 text-[11px]">{log.event}</div>
                <div className="font-mono text-[10px] opacity-70">{log.user}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {log.status}
              </span>
              <span className="font-mono text-[10px] opacity-60">{log.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}