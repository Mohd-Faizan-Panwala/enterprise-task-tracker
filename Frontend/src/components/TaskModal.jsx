import React, { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import API from '../services/api';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';

// Helper function to assign numerical hierarchy ranks
const getRoleRank = (role) => {
  const r = role?.toLowerCase() || '';
  if (['boss', 'admin', 'owner'].includes(r)) return 4;
  if (['gm', 'director'].includes(r)) return 3;
  if (['manager', 'tl', 'teamlead', 'supervisor'].includes(r)) return 2;
  return 1; // employee, staff
};

export default function TaskModal({ user, task, onClose, onSave, theme }) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState(task?.priority || 'MEDIUM');
  const [assignedTo, setAssignedTo] = useState(task?.assignedTo?._id || task?.assignedTo || '');
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const isLight = theme === 'light';
  const currentUserRank = getRoleRank(user?.role);

  useEffect(() => {
    // If a regular employee tries to open a new task creation modal, block them
    if (!task?._id && currentUserRank === 1) {
      setError('Access Denied: Standard employees are not authorized to create tasks.');
    }

    const fetchEmployees = async () => {
      try {
        const response = await API.get('/users');
        if (Array.isArray(response.data)) {
          // Filter personnel: A user can only assign to personnel with a rank <= their own rank.
          // This naturally hides higher-ups (e.g., GM cannot see Boss, TL cannot see GM/Boss).
          const allowedEmployees = response.data.filter((emp) => {
            const empRank = getRoleRank(emp.role);
            return empRank <= currentUserRank;
          });

          setEmployees(allowedEmployees);
        }
      } catch (err) {
        console.error('Failed to fetch personnel roster:', err);
      }
    };
    fetchEmployees();
  }, [user, task, currentUserRank]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Block employees from submitting new tasks
    if (!task?._id && currentUserRank === 1) {
      setError('Standard employees do not have permission to create tasks.');
      return;
    }

    if (!title.trim() || !assignedTo) {
      setError('Title and Assigned Employee are required parameters.');
      return;
    }

    if (!user?._id) {
      setError('Active user session context is missing.');
      return;
    }

    try {
      setLoading(true);
      
      const taskData = {
        taskId: task?.taskId || `TID-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: title.trim(),
        description: description.trim(),
        priority,
        assignedTo,
        assignedBy: user._id
      };

      if (task && task._id) {
        await taskService.updateTask(task._id, taskData);
      } else {
        await taskService.createTask(taskData);
      }
      onSave();
    } catch (err) {
      console.error('Error saving task:', err);
      const status = err.response?.status;
      const errorMsg = err.response?.data?.message || err.message;
      
      if (status === 403 || status === 500) {
        setError(errorMsg.includes('permission') || status === 403 
          ? 'Access Denied: You cannot assign tasks to higher management.' 
          : errorMsg);
      } else {
        setError(errorMsg || 'Failed to commit task changes to database.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className={`w-full max-w-lg rounded-2xl border p-6 space-y-6 shadow-2xl transition-all ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
      }`}>
        <div className="flex items-center justify-between border-b pb-4 border-slate-800/60">
          <h3 className="text-base font-bold font-mono text-cyan-400">
            {task?._id ? 'MODIFY TASK PARAMETERS' : 'CREATE NEW ENTERPRISE TASK'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* If user is an employee trying to create a task, show restriction message instead of form */}
        {!task?._id && currentUserRank === 1 ? (
          <div className="py-8 text-center space-y-4">
            <p className="text-xs text-slate-400 font-mono">
              Role Restricted: You are logged in as a standard employee. You can view tasks and update their status, but you cannot create new tasks.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-5 py-2 rounded-xl text-xs font-mono transition cursor-pointer"
            >
              CLOSE WINDOW
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400 uppercase">Task Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter clear task objective..."
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs transition outline-none ${
                  isLight 
                    ? 'bg-slate-50 border-slate-200 focus:border-cyan-500 text-slate-900' 
                    : 'bg-slate-950 border-slate-800 focus:border-cyan-500 text-slate-100'
                }`}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400 uppercase">Description / Scope</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed execution instructions..."
                rows={3}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs transition outline-none resize-none ${
                  isLight 
                    ? 'bg-slate-50 border-slate-200 focus:border-cyan-500 text-slate-900' 
                    : 'bg-slate-950 border-slate-800 focus:border-cyan-500 text-slate-100'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400 uppercase">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs transition outline-none ${
                    isLight 
                      ? 'bg-slate-50 border-slate-200 text-slate-900' 
                      : 'bg-slate-950 border-slate-800 text-slate-100'
                  }`}
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="URGENT">URGENT</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400 uppercase">Assign To Personnel</label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs transition outline-none ${
                    isLight 
                      ? 'bg-slate-50 border-slate-200 text-slate-900' 
                      : 'bg-slate-950 border-slate-800 text-slate-100'
                  }`}
                  required
                >
                  <option value="">Select Employee...</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name} ({emp.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/60">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-slate-100 transition cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                {loading ? 'COMMITTING...' : 'SAVE TASK'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}