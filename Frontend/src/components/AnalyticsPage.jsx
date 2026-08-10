import React from 'react';

export default function AnalyticsPage({ user, theme }) {
  const isLight = theme === 'light';
  return (
    <div className="space-y-4">
      <div>
        <h1 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Analytics & Reports</h1>
        <p className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Workspace performance telemetry and throughput.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className={`p-3.5 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
          <div className="text-[10px] font-mono text-slate-400 uppercase">Completion Rate</div>
          <div className="text-xl font-black font-mono text-cyan-400 mt-1">94.2%</div>
          <div className="text-[10px] text-emerald-400 font-mono mt-0.5">+4.1% vs last week</div>
        </div>
        <div className={`p-3.5 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
          <div className="text-[10px] font-mono text-slate-400 uppercase">Avg Resolution</div>
          <div className="text-xl font-black font-mono text-cyan-400 mt-1">2.4 hrs</div>
          <div className="text-[10px] text-emerald-400 font-mono mt-0.5">-18m speed improvement</div>
        </div>
        <div className={`p-3.5 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
          <div className="text-[10px] font-mono text-slate-400 uppercase">Active Workflows</div>
          <div className="text-xl font-black font-mono text-cyan-400 mt-1">12 / 12</div>
          <div className="text-[10px] text-emerald-400 font-mono mt-0.5">100% operational</div>
        </div>
        <div className={`p-3.5 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
          <div className="text-[10px] font-mono text-slate-400 uppercase">SLA Compliance</div>
          <div className="text-xl font-black font-mono text-cyan-400 mt-1">99.8%</div>
          <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Optimal standing</div>
        </div>
      </div>
    </div>
  );
}