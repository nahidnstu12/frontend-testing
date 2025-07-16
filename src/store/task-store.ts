import { create } from 'zustand';

type Task = {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
};

type TaskStore = {
  tasks: Task[];
  loading: boolean;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  toggleTask: (task: Task) => void;
  setLoading: (val: boolean) => void;
};

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  loading: false,
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  toggleTask: (updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === updatedTask.id ? updatedTask : t
      ),
    })),
  setLoading: (val) => set({ loading: val }),
}));
