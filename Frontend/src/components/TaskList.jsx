import React from 'react';
import { PlayCircle, CheckCircle2, Trash2, Edit3 } from 'lucide-react';

export default function TaskList({ 
  tasks, 
  isSupervisor, 
  onStatusChange, 
  onDeleteTask, 
  onEditTask 
}) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 text-xs font-mono">
        // NO_TASKS_MATCHING_FILTER
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div 
          key={task._id} 
          className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">{task.title}</span>
              <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase border ${
                task.priority === 'URGENT' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                task.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                {task.priority}
              </span>
            </div>
            <p className="text-xs text-slate-400">{task.description}</p>
            <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono">
              <span>Assigned to: <strong className="text-slate-300">{task.assignedTo?.name || 'Unassigned'}</strong></span>
              <span>Status: <strong className="text-cyan-400">{task.status}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            {task.status !== 'IN_PROGRESS' && task.status !== 'COMPLETED' && (
              <button
                onClick={() => onStatusChange(task._id, 'IN_PROGRESS')}
                className="p-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg transition cursor-pointer"
                title="Start Task"
              >
                <PlayCircle className="w-4 h-4" />
              </button>
            )}
            {task.status !== 'COMPLETED' && (
              <button
                onClick={() => onStatusChange(task._id, 'COMPLETED')}
                className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition cursor-pointer"
                title="Complete Task"
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
            {isSupervisor && (
              <button
                onClick={() => onEditTask(task)}
                className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition cursor-pointer"
                title="Edit Task"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onDeleteTask(task._id)}
              className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition cursor-pointer"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}