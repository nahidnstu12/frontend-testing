import AppLayout from '@/layouts/app-layout';
import api from '@/store/api';
import { useAuth } from '@/store/authContext';
import { type BreadcrumbItem } from '@/types/shared';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    setLoading(true);
    try {
      const response = await api.post('/tasks', { title: newTask });
      setTasks([...tasks, response.data]);
      setNewTask('');
      toast.success('Task added successfully');
    } catch (error: any) {
      console.error('Failed to add task:', error);
      toast.error(error?.response?.data?.error || 'Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/tasks');
        setTasks(response.data);
      } catch (error: any) {
        console.error('Failed to fetch tasks:', error);
        toast.error(error?.response?.data?.error || 'Failed to fetch tasks');
      }
    };
    fetchTasks();
  }, []);

  const handleToggleTask = async (id: string) => {
    try {
      const currentTask = tasks.find((task) => task.id === id);
      if (!currentTask) return;

      const response = await api.put(`/tasks/${id}`, {
        completed: !currentTask.completed,
      });

      // Update with server response to ensure consistency
      setTasks(tasks.map((task) => (task.id === id ? response.data : task)));
      toast.success('Task updated successfully');
    } catch (error: any) {
      console.error('Failed to toggle task:', error);
      toast.error(error?.response?.data?.error || 'Failed to update task');
    }
  };


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      {/* <Head title="Dashboard" /> */}
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <h1>Dashboard</h1>
        <p>Welcome, {user?.username}</p>

        {/* Add Task Form */}
        <form onSubmit={handleAddTask} className="flex gap-2">
          <input
            type="text"
            placeholder="Add a task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !newTask.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </form>

        {/* Render tasks with checkboxes */}
        <h1>Task Lists ({tasks.length})</h1>
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-2 p-2 border rounded"
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleTask(task.id)}
              className="w-4 h-4"
            />
            <span
              className={task.completed ? 'line-through text-gray-500' : ''}
            >
              {task.title}
            </span>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
