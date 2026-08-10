import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import DashboardPage from './components/DashboardPage';
import TeamDirectory from './components/TeamDirectory';
import AnalyticsPage from './components/AnalyticsPage';
import AuditPage from './components/AuditPage';
import WorkflowsPage from './components/WorkflowsPage';
import NotificationsPage from './components/NotificationsPage';
import IntegrationsPage from './components/IntegrationsPage';
import SettingsPage from './components/SettingsPage';
import ThemeToggle from './components/ThemeToggle';
import { useTasks } from './hooks/useTasks';
import { Menu } from 'lucide-react';

export default function App() {
  const [showSplash, setShowSplash] = useState(false);
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTabFromPath = (pathname) => {
    if (pathname === '/' || pathname === '/dashboard') return 'dashboard';
    return pathname.replace('/', '');
  };
  const activeTab = getActiveTabFromPath(location.pathname);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('taskqueue_theme') || 'dark';
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('taskqueue_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setShowSplash(true);
      } catch (e) {
        localStorage.removeItem('taskqueue_user');
      }
    }
  }, []);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    localStorage.setItem('taskqueue_user', JSON.stringify(loggedInUser));
    setShowSplash(true);
    navigate('/dashboard', { replace: true });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('taskqueue_user');
    localStorage.removeItem('taskqueue_token');
    navigate('/', { replace: true });
  };

  const {
    tasks,
    filteredTasks,
    filter,
    setFilter,
    editingTask,
    setEditingTask,
    metrics,
    handleStatusChange,
    handleDeleteTask,
    fetchTasks
  } = useTasks(user);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (!user) {
    return (
      <div className={theme === 'light' ? 'bg-slate-100 text-slate-900 min-h-screen' : 'bg-slate-950 text-white min-h-screen'}>
        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
        <LoginPage onLogin={handleLogin} />
      </div>
    );
  }

  const isSupervisor = user.role !== 'EMPLOYEE';
  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen flex flex-col md:flex-row transition-colors duration-300 overflow-x-hidden ${isLight ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'}`}>
      
      <Sidebar 
        user={user} 
        activeTab={activeTab} 
        onLogout={handleLogout} 
        theme={theme}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className={`h-16 border-b px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md ${isLight ? 'bg-white/80 border-slate-200' : 'bg-slate-900/80 border-slate-800'}`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className={`md:hidden p-2 rounded-xl border transition cursor-pointer ${
                isLight ? 'bg-white border-slate-200 text-slate-700 shadow-sm' : 'bg-slate-800 border-slate-700 text-slate-200'
              }`}
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-[11px] sm:text-xs font-mono uppercase px-2.5 py-1 rounded-lg border font-bold"
              style={{
                backgroundColor: isLight ? '#f1f5f9' : '#020617',
                borderColor: isLight ? '#cbd5e1' : '#334155',
                color: isLight ? '#0284c7' : '#38bdf8'
              }}
            >
              {user.role} Workspace
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle theme={theme} setTheme={setTheme} />
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold">{user.name}</div>
              <div className="text-[10px] opacity-70 font-mono">{user.email}</div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route 
              path="/dashboard" 
              element={
                <DashboardPage
                  user={user}
                  tasks={tasks}
                  filter={filter}
                  setFilter={setFilter}
                  editingTask={editingTask}
                  setEditingTask={setEditingTask}
                  metrics={metrics}
                  filteredTasks={filteredTasks}
                  handleStatusChange={handleStatusChange}
                  handleDeleteTask={handleDeleteTask}
                  fetchTasks={fetchTasks}
                  isSupervisor={isSupervisor}
                  theme={theme}
                />
              } 
            />
            <Route 
              path="/tasks" 
              element={
                <DashboardPage
                  user={user}
                  tasks={tasks}
                  filter={filter}
                  setFilter={setFilter}
                  editingTask={editingTask}
                  setEditingTask={setEditingTask}
                  metrics={metrics}
                  filteredTasks={filteredTasks}
                  handleStatusChange={handleStatusChange}
                  handleDeleteTask={handleDeleteTask}
                  fetchTasks={fetchTasks}
                  isSupervisor={isSupervisor}
                  theme={theme}
                />
              } 
            />
            <Route path="/team" element={<TeamDirectory user={user} theme={theme} />} />
            <Route path="/analytics" element={<AnalyticsPage user={user} theme={theme} />} />
            <Route path="/audit" element={<AuditPage user={user} theme={theme} />} />
            <Route path="/workflows" element={<WorkflowsPage user={user} theme={theme} />} />
            <Route path="/notifications" element={<NotificationsPage user={user} theme={theme} />} />
            <Route path="/integrations" element={<IntegrationsPage user={user} theme={theme} />} />
            <Route path="/settings" element={<SettingsPage user={user} theme={theme} />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}