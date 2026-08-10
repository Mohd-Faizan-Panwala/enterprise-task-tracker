import { useState, useEffect, useCallback } from 'react';

export function useTasks(user) {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = useCallback(async () => {
    if (!user?._id) return;
    try {
      const token = localStorage.getItem('taskqueue_token');
      const res = await fetch(`http://localhost:5001/api/tasks?userId=${user._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      
      // Safety check: ensure data is an array before setting state
      if (res.ok && Array.isArray(data)) {
        setTasks(data);
      } else {
        setTasks([]);
        console.error('Failed to fetch tasks:', data.message);
      }
    } catch (err) {
      console.error('Network error fetching tasks:', err);
      setTasks([]);
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('taskqueue_token');
      const res = await fetch(`http://localhost:5001/api/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to purge this task?')) return;
    try {
      const token = localStorage.getItem('taskqueue_token');
      const res = await fetch(`http://localhost:5001/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // Safe fallback to prevent .filter crashes
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  const filteredTasks = safeTasks.filter((task) => {
    if (filter === 'ALL') return true;
    return task.status === filter;
  });

  const metrics = {
    total: safeTasks.length,
    pending: safeTasks.filter((t) => t.status === 'PENDING').length,
    processing: safeTasks.filter((t) => t.status === 'IN_PROGRESS').length,
    completed: safeTasks.filter((t) => t.status === 'COMPLETED').length,
  };

  return {
    tasks: safeTasks,
    filteredTasks,
    filter,
    setFilter,
    editingTask,
    setEditingTask,
    metrics,
    handleStatusChange,
    handleDeleteTask,
    fetchTasks
  };
}