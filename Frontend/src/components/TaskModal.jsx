import React, { useState, useEffect } from 'react';
import { X, CheckSquare } from 'lucide-react';

export default function TaskModal({ user, task, onClose, onSave, theme }) {
  const isLight = theme === 'light';

  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState(task?.priority || 'MEDIUM');
  const [assignedTo, setAssignedTo] = useState(task?.assignedTo?._id || task?.assignedTo || '');
  const [team, setTeam] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTeam() {
      const token = localStorage.getItem('taskqueue_token');
      try {
        const res = await fetch(`http://localhost:5001/api/users?assignerRole=${user.role}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        setTeam(data);
        if (Array.isArray(data) && data.length > 0 && !assignedTo) {
          setAssignedTo(data[0]._id);
        }
      } catch (err) {
        console.error(err);
      }
    }
    if (user) {
      fetchTeam();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('taskqueue_token');

    try {
      const url = task?._id 
        ? `http://localhost:5001/api/tasks/${task._id}` 
        : 'http://localhost:5001/api/tasks';
      
      const method = task?._id ? 'PUT' : 'POST';
      
      const payload = {
        title,
        description,
        priority,
        assignedTo,
        assignedBy: user._id || user.id,
        status: task?.status || 'PENDING'
      };

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save task');

      onSave();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className={`max-w-md w-full border rounded-2xl p-6 shadow-2xl space-y-6 transition-colors ${
        isLight 
          ? 'bg-white/95 backdrop-blur-xl border-slate-200/90 text-slate-900 shadow-slate-900/10' 
          : 'bg-slate-900 border-slate-800 text-white shadow-slate-950/80'
      }`}>
        <div className={`flex items-center justify-between border-b pb-4 ${
          isLight ? 'border-slate-200/80' : 'border-slate-800'
        }`}>
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-xs uppercase font-mono">
            <CheckSquare className="w-4 h-4" />
            <span>{task?._id ? 'Edit Task Assignment' : 'Create New Task'}</span>
          </div>
          <button 
            onClick={onClose} 
            className={`transition cursor-pointer p-1 rounded-lg ${
              isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-[11px] font-mono mb-1 uppercase font-semibold ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}>
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Q3 Server Optimization"
              required
              className={`w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none transition ${
                isLight 
                  ? 'bg-slate-50/70 border-slate-200 text-slate-900 focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/10' 
                  : 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500'
              }`}
            />
          </div>

          <div>
            <label className={`block text-[11px] font-mono mb-1 uppercase font-semibold ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed task instructions..."
              rows={3}
              className={`w-full border rounded-xl px-4 py-2 text-xs focus:outline-none transition ${
                isLight 
                  ? 'bg-slate-50/70 border-slate-200 text-slate-900 focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/10' 
                  : 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-[11px] font-mono mb-1 uppercase font-semibold ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              }`}>
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2.5 text-xs focus:outline-none transition ${
                  isLight 
                    ? 'bg-slate-50/70 border-slate-200 text-slate-900 focus:border-cyan-500 focus:bg-white' 
                    : 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500'
                }`}
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </select>
            </div>

            <div>
              <label className={`block text-[11px] font-mono mb-1 uppercase font-semibold ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              }`}>
                Assign To
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                required
                className={`w-full border rounded-xl px-3 py-2.5 text-xs focus:outline-none transition ${
                  isLight 
                    ? 'bg-slate-50/70 border-slate-200 text-slate-900 focus:border-cyan-500 focus:bg-white' 
                    : 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500'
                }`}
              >
                {team.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name} ({member.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={`flex justify-end gap-3 pt-3 border-t ${
            isLight ? 'border-slate-200/80' : 'border-slate-800'
          }`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                isLight 
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs transition cursor-pointer disabled:opacity-50 shadow-md shadow-cyan-500/20"
            >
              {loading ? 'Saving...' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}