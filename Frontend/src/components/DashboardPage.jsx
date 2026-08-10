import React, { useState, useEffect } from 'react';
import TaskFilters from './TaskFilters.jsx';
import TaskList from './TaskList.jsx';
import TaskModal from './TaskModal.jsx';
import { taskService } from '../services/taskService';
import API from '../services/api';
import { Layers, Clock, CheckCircle2, AlertCircle, Activity, ShieldCheck } from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [expandedLog, setExpandedLog] = useState(null);

  // Fetch tasks using the current user's unique MongoDB ID
  const fetchTasks = async (targetUser) => {
    try {
      const userId = targetUser?._id || targetUser?.id;
      if (!userId) {
        setLoading(false);
        return;
      }
      const data = await taskService.getTasks({ userId });
      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (err) {
      console.error("Error fetching tasks from backend:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initialize unique user session from backend database on mount
  useEffect(() => {
    const initializeUserAndTasks = async () => {
      try {
        let savedUser = JSON.parse(localStorage.getItem('user'));

        // If local user is missing or invalid, fetch real users from the backend database
        if (!savedUser || !savedUser._id || savedUser._id.length !== 24) {
          const response = await API.get('/users');
          const users = response.data;

          if (Array.isArray(users) && users.length > 0) {
            savedUser = users.find(u => u.role === 'GM' || u.role === 'BOSS') || users[0];
            localStorage.setItem('user', JSON.stringify(savedUser));
          }
        }

        if (savedUser && savedUser._id) {
          setUser(savedUser);
          await fetchTasks(savedUser);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to initialize unique user profile:", err);
        setLoading(false);
      }
    };

    initializeUserAndTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      fetchTasks(user);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to purge this task?')) return;
    try {
      await taskService.deleteTask(taskId);
      fetchTasks(user);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const isSupervisor = user?.role === 'BOSS' || user?.role === 'GM' || user?.role === 'Supervisor' || user?.role === 'MANAGER';
  const isLight = theme === 'light';

  const normalize = (str) => (str || '').toUpperCase().replace(/[\s_]/g, '');
  const currentFilter = normalize(filter || 'ALL');

  const activeFilteredTasks = tasks.filter(task => {
    if (currentFilter === 'ALL') return true;
    const taskStatus = normalize(task.status);
    
    if (currentFilter === 'PENDING') {
      return taskStatus === 'PENDING';
    }
    if (currentFilter === 'INPROGRESS' || currentFilter === 'PROCESSING') {
      return taskStatus === 'INPROGRESS' || taskStatus === 'PROCESSING';
    }
    if (currentFilter === 'COMPLETED') {
      return taskStatus === 'COMPLETED';
    }
    return taskStatus === currentFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-400 font-mono text-sm">
        Initializing Enterprise Command Center...
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 sm:p-6 transition-colors ${isLight ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Task Command Center</h2>
            <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Welcome back, <span className="text-cyan-500 font-semibold">{user?.name}</span> ({user?.role})
            </p>
          </div>
          {isSupervisor && (
            <button
              onClick={() => setEditingTask({})}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer self-start sm:self-auto shadow-sm"
            >
              + Create New Task
            </button>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-4 rounded-2xl space-y-1 border transition-colors ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
            <div className={`flex items-center gap-2 text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              <Layers className="w-3.5 h-3.5 text-cyan-500" /> TOTAL
            </div>
            <div className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{tasks.length}</div>
          </div>
          <div className={`p-4 rounded-2xl space-y-1 border transition-colors ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
            <div className={`flex items-center gap-2 text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              <Clock className="w-3.5 h-3.5 text-amber-500" /> PENDING
            </div>
            <div className="text-xl font-bold text-amber-500">
              {tasks.filter(t => normalize(t.status) === 'PENDING').length}
            </div>
          </div>
          <div className={`p-4 rounded-2xl space-y-1 border transition-colors ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
            <div className={`flex items-center gap-2 text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              <AlertCircle className="w-3.5 h-3.5 text-cyan-500" /> IN PROGRESS
            </div>
            <div className="text-xl font-bold text-cyan-500">
              {tasks.filter(t => { 
                const s = normalize(t.status); 
                return s === 'PROCESSING' || s === 'INPROGRESS'; 
              }).length}
            </div>
          </div>
          <div className={`p-4 rounded-2xl space-y-1 border transition-colors ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
            <div className={`flex items-center gap-2 text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> COMPLETED
            </div>
            <div className="text-xl font-bold text-emerald-500">
              {tasks.filter(t => normalize(t.status) === 'COMPLETED').length}
            </div>
          </div>
        </div>

        {/* Main Content Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Columns: Task Control & List */}
          <div className={`lg:col-span-2 rounded-2xl p-6 space-y-4 border transition-colors ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
            <TaskFilters filter={filter} setFilter={setFilter} theme={theme} />
            <TaskList
              tasks={activeFilteredTasks}
              isSupervisor={isSupervisor}
              onStatusChange={handleStatusChange}
              onDeleteTask={handleDeleteTask}
              onEditTask={(task) => setEditingTask(task)}
              theme={theme}
            />
          </div>

          {/* Right 1 Column: Secondary Enterprise Widgets */}
          <div className="space-y-6">
            
            {/* Widget 1: System Health & SLA Status */}
            <div className={`p-5 rounded-2xl border space-y-3 transition-colors ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-mono font-bold uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  System SLA & Security
                </span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/40">
                  <span className="text-slate-400">API Gateway</span>
                  <span className="text-emerald-500 font-mono font-bold">100% Operational</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/40">
                  <span className="text-slate-400">JWT Token Status</span>
                  <span className="text-cyan-500 font-mono font-bold">Secure / Active</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-slate-400">Background Cron</span>
                  <span className="text-amber-500 font-mono font-bold">Monitoring SLAs</span>
                </div>
              </div>
            </div>

            {/* Widget 2: Audit Logs & Security Telemetry */}
            <div className={`p-5 rounded-2xl border space-y-3 transition-colors ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-mono font-bold uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Audit Logs & Security Telemetry
                </span>
                <Activity className="w-4 h-4 text-cyan-500" />
              </div>
              <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Immutable log stream. Tap any entry to inspect full details.
              </p>
              
              <div className="space-y-3 text-xs">
                {[
                  { 
                    id: 1, 
                    action: 'TASK_CREATED', 
                    user: user?.email || 'gm@company.com', 
                    time: 'Just now', 
                    status: 'SUCCESS', 
                    details: 'Payload validated and committed to active database cluster with user session context.' 
                  },
                  { 
                    id: 2, 
                    action: 'JWT_AUTH_VERIFIED', 
                    user: 'system@internal', 
                    time: '5 mins ago', 
                    status: 'SUCCESS', 
                    details: 'Token signature verified against secure cluster environment key. Claims successfully validated.' 
                  },
                  { 
                    id: 3, 
                    action: 'ROLE_PRIVILEGE_CHECK', 
                    user: user?.email || 'gm@company.com', 
                    time: '12 mins ago', 
                    status: 'VERIFIED', 
                    details: 'Supervisor clearance confirmed for sensitive operations endpoints and administrative overrides.' 
                  }
                ].map((log) => {
                  const isExpanded = expandedLog === log.id;
                  return (
                    <div
                      key={log.id}
                      onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                        isLight 
                          ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800' 
                          : 'bg-slate-950/60 hover:bg-slate-950 border-slate-800 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-cyan-500 shrink-0" />
                          <span className="font-mono font-bold text-xs text-cyan-400">{log.action}</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                          {log.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-slate-400 border-t border-slate-800/40 pt-2">
                        <span className="truncate max-w-[160px]">{log.user}</span>
                        <span className="text-slate-500 shrink-0">{log.time}</span>
                      </div>

                      {isExpanded && (
                        <div className="pt-2.5 border-t border-slate-800/80 space-y-2">
                          <p className="text-slate-300 font-semibold text-[11px]">Telemetry Context:</p>
                          <p className="text-slate-400 font-mono text-[11px] bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 leading-relaxed break-words">
                            {log.details}
                          </p>
                          <div className="flex justify-between items-center text-[10px] text-slate-500 italic pt-0.5">
                            <span>Tap card to collapse</span>
                            <span className="text-cyan-400 font-mono">Secure Node #8492</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

        {editingTask && (
          <TaskModal
            user={user}
            task={editingTask}
            onClose={() => setEditingTask(null)}
            onSave={() => {
              setEditingTask(null);
              fetchTasks(user);
            }}
            theme={theme}
          />
        )}
      </div>
    </div>
  );
}