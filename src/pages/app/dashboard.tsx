import { useTasks } from "@/hooks/useTasks";
import AppLayout from "@/layouts/app-layout";
import { useAuth } from "@/store/authContext";
import { type BreadcrumbItem } from "@/types/shared";
import { useEffect, useState } from "react";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [newTask, setNewTask] = useState("");
  const {
    tasks,
    fetchTasks,
    createTask,
    toggleComplete,
    loading,
    isTaskActionLoading,
  } = useTasks();

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    createTask(newTask);
    setNewTask("");
  };
  if (loading) {
    return <div>Fetching Task</div>;
  }

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
            disabled={isTaskActionLoading}
          />
          <button
            type="submit"
            disabled={isTaskActionLoading || !newTask.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTaskActionLoading ? "Adding..." : "Add"}
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
              onChange={() => toggleComplete(task.id)}
              className="w-4 h-4"
            />
            <span
              className={task.completed ? "line-through text-gray-500" : ""}
            >
              {task.title}
            </span>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
