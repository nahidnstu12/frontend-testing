import api from '@/store/api';
import { useTaskStore } from '@/store/task-store';
import { toast } from 'sonner';

export const useTasks = () => {
  const {
    tasks, setTasks, addTask, toggleTask, loading, setLoading
  } = useTaskStore();

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to fetch tasks');
    }
  };

  const createTask = async (title: string) => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      const res = await api.post('/tasks', { title });
      addTask(res.data);
      toast.success('Task added');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Add task failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (id: string) => {
    try {
      const current = tasks.find((t) => t.id === id);
      if (!current) return;
      const res = await api.put(`/tasks/${id}`, {
        completed: !current.completed,
      });
      toggleTask(res.data);
      toast.success('Task updated');
    } catch (err: any) {
      console.log("err", err);
      toast.error(err?.response?.data?.error || 'Update task failed');
    }
  };

  return { tasks, loading, fetchTasks, createTask, toggleComplete };
};
