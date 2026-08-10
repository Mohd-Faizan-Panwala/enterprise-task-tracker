import React from 'react';

export default function WorkflowsPage({ user, theme }) {
  const isLight = theme === 'light';
  return (
    <div className="space-y-4">
      <div>
        <h1 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Workflows & SLAs</h1>
        <p className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Automated routing rules and SLA thresholds.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className={`p-4 rounded-xl border space-y-2 ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
          <div className="text-xs font-bold">API Gateway SLA</div>
          <div className="text-[11px] font-mono opacity-70">Target response time: &lt; 150ms</div>
          <div className="text-xs font-mono text-emerald-400 font-bold pt-1">Status: 100% Operational</div>
        </div>
        <div className={`p-4 rounded-xl border space-y-2 ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
          <div className="text-xs font-bold">JWT Token Security</div>
          <div className="text-[11px] font-mono opacity-70">Rotation interval: 24 hours</div>
          <div className="text-xs font-mono text-cyan-400 font-bold pt-1">Status: Secure / Active</div>
        </div>
      </div>
    </div>
  );
}