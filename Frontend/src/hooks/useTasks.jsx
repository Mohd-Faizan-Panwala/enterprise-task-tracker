import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';

export function useTasks(user) {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = useCallback(async () => {
    if (!user?._id) return;
    try {
      const data = await taskService.getTasks({ userId: user._id });
      
      if (Array.isArray(data)) {
        setTasks(data);
      } else if (data && Array.isArray(data.tasks)) {
        setTasks(data.tasks);
      } else {
        setTasks([]);
        console.error('Failed to fetch tasks: Invalid data format received');
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
      await taskService.updateTaskStatus(taskId, newStatus);
      fetchTasks();
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to purge this task?')) return;
    try {
      await taskService.deleteTask(taskId);
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const safeTasks = Array.isArray(tasks) ? tasks : [];

  const filteredTasks = safeTasks.filter((task) => {
    if (filter === 'ALL') return true;
    return task.status === filter;
  });

  const metrics = {
    total: safeTasks.length,
    pending: safeTasks.filter((t) => t.status === 'PENDING').length,
    processing: safeTasks.filter((t) => t.status === 'IN_PROGRESS' || t.status === 'INPROGRESS' || t.status === 'PROCESSING').length,
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

export default useTasks;