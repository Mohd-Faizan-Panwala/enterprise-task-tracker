import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { 
  LayoutDashboard, CheckSquare, Users, BarChart3, 
  Activity, Workflow, Bell, Puzzle, Settings, LogOut, X 
} from 'lucide-react';

export default function Sidebar({ activeTab, user, onLogout, theme, mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    // { id: 'tasks', label: 'Tasks Control', icon: CheckSquare },
    { id: 'team', label: 'Team Directory', icon: Users },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'audit', label: 'Audit Logs', icon: Activity },
    { id: 'workflows', label: 'Workflows & SLAs', icon: Workflow },
    { id: 'notifications', label: 'Notifications Hub', icon: Bell },
    { id: 'integrations', label: 'Integrations', icon: Puzzle },
    { id: 'settings', label: 'Settings & Security', icon: Settings },
  ];

  const isLight = theme === 'light';

  return (
    <>
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      <aside className={`
        fixed md:sticky top-0 left-0 z-50 w-72 md:w-64 border-r flex flex-col h-screen select-none shrink-0 
        transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isLight 
          ? 'bg-white/95 backdrop-blur-md border-slate-200/80 text-slate-800 shadow-2xl md:shadow-none' 
          : 'bg-slate-900 border-slate-800 text-slate-200 shadow-2xl md:shadow-none'
        }
      `}>
        {/* Top Header & Glowing Hexagon Logo */}
        <div className="p-5 space-y-6 overflow-y-auto flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              {/* Original Hexagon Shape with Intense Neon Glow */}
              <div className="relative shrink-0 flex items-center justify-center">
                <img 
                  src={logo} 
                  alt="TaskQueue Logo" 
                  className="w-11 h-11 object-contain drop-shadow-[0_0_12px_rgba(6,182,212,0.85)] hover:drop-shadow-[0_0_18px_rgba(6,182,212,1)] transition-all"
                />
              </div>

              <div>
                <h1 className={`font-black tracking-wider text-xs uppercase font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Task<span className="text-cyan-500">Queue</span>
                </h1>
                <p className={`text-[10px] mt-0.5 ${isLight ? 'text-slate-500 font-medium' : 'text-slate-400'}`}>
                  Role: <strong className={`uppercase ${isLight ? 'text-slate-900 font-semibold' : 'text-white'}`}>{user?.role || 'EMPLOYEE'}</strong>
                </p>
              </div>
            </div>

            <button 
              onClick={() => setMobileOpen(false)}
              className={`md:hidden p-1.5 rounded-lg transition cursor-pointer ${
                isLight ? 'text-slate-500 hover:bg-slate-100 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(`/${item.id}`);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                    isActive 
                      ? isLight 
                        ? 'bg-cyan-50/90 text-cyan-700 font-bold border border-cyan-200/80 shadow-sm shadow-cyan-100' 
                        : 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20' 
                      : isLight
                        ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Anchored Bottom User Profile & Logout Footer */}
        <div className={`p-4 border-t shrink-0 mt-auto space-y-3 ${
          isLight ? 'border-slate-200/80 bg-slate-50/90' : 'border-slate-800 bg-slate-950/60'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 font-mono shadow-xs ${
              isLight 
                ? 'bg-cyan-600/10 border border-cyan-600/30 text-cyan-700' 
                : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
            }`}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="truncate flex-1">
              <div className={`text-xs font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{user?.name}</div>
              <div className={`text-[10px] font-mono truncate ${isLight ? 'text-slate-500 font-medium' : 'text-slate-400'}`}>{user?.email}</div>
            </div>
          </div>
          
          <button
            onClick={onLogout}
            className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium transition cursor-pointer border ${
              isLight 
                ? 'bg-white hover:bg-rose-50/80 text-slate-700 hover:text-rose-600 border-slate-200/90 shadow-xs' 
                : 'bg-slate-900 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 border-slate-800 hover:border-rose-500/30'
            }`}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Workspace</span>
          </button>
        </div>
      </aside>
    </>
  );
}