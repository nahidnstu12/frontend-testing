import "../test/_mocks.ts";
import api from "@/store/api.ts";
import { useTaskStore } from "@/store/task-store";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTasks } from "./useTasks.ts";

const mockTasks = [
  {
    id: "1",
    userId: "1",
    title: "First Task",
    completed: true,
  },
  {
    id: "2",
    userId: "1",
    title: "Second Task",
    completed: false,
  },
];

// Helper function to render hook with clean state
const renderUseTasks = () => {
  useTaskStore.setState({ tasks: [], loading: false, isTaskActionLoading: false });
  return renderHook(() => useTasks());
};

// Helper function to create a delayed promise for testing loading states
const createDelayedPromise = () => {
  let resolvePromise: any;
  const promise = new Promise((resolve) => {
    resolvePromise = resolve;
  });
  return { promise, resolve: resolvePromise };
};

describe("useTasks Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useTaskStore.setState({ tasks: [], loading: false, isTaskActionLoading: false });
  });

  describe("fetchTasks", () => {
    it("should fetch tasks and update store", async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockTasks });
      const { result } = renderUseTasks();

      expect(result.current.loading).toBe(false);
      expect(result.current.tasks).toEqual([]);

      await act(async () => {
        await result.current.fetchTasks();
      });

      await waitFor(() => {
        expect(useTaskStore.getState().tasks).toHaveLength(2);
        expect(useTaskStore.getState().tasks).toEqual(mockTasks);
      });
    });

    it("should handle loading state during fetch", async () => {
      const { promise, resolve } = createDelayedPromise();
      vi.mocked(api.get).mockReturnValue(promise);
      
      const { result } = renderUseTasks();
      expect(useTaskStore.getState().loading).toBe(false);

      const fetchPromise = act(async () => {
        await result.current.fetchTasks();
      });

      // Check loading state is active
      expect(useTaskStore.getState().loading).toBe(true);

      // Resolve the API call
      resolve({ data: mockTasks });
      await fetchPromise;

      // Check loading state is false after completion
      expect(useTaskStore.getState().loading).toBe(false);
    });

    it("should handle fetch errors", async () => {
      vi.mocked(api.get).mockRejectedValue({
        response: { data: { error: "Network error" } }
      });
      
      const { result } = renderUseTasks();

      await act(async () => {
        await result.current.fetchTasks();
      });

      expect(useTaskStore.getState().tasks).toEqual([]);
      expect(useTaskStore.getState().loading).toBe(false);
    });
  });

  describe("createTask", () => {
    it("should create task successfully", async () => {
      const newTask = {
        id: "3",
        userId: "1",
        title: "New Task",
        completed: false,
      };
      
      vi.mocked(api.post).mockResolvedValue({ data: newTask });
      const { result } = renderUseTasks();

      expect(result.current.tasks).toEqual([]);

      await act(async () => {
        await result.current.createTask("New Task");
      });

      await waitFor(() => {
        expect(useTaskStore.getState().tasks).toHaveLength(1);
        expect(useTaskStore.getState().tasks[0]).toEqual(newTask);
      });
    });

    it("should handle create task errors", async () => {
      vi.mocked(api.post).mockRejectedValue({
        response: { data: { error: "Creation failed" } }
      });
      
      const { result } = renderUseTasks();

      await act(async () => {
        await result.current.createTask("New Task");
      });

      await waitFor(() => {
        expect(useTaskStore.getState().tasks).toHaveLength(0);
      });
    });

    it("should not create task with empty title", async () => {
      const { result } = renderUseTasks();

      await act(async () => {
        await result.current.createTask("");
      });

      expect(vi.mocked(api.post)).not.toHaveBeenCalled();
      expect(useTaskStore.getState().tasks).toHaveLength(0);
    });

    it("should not create task with whitespace-only title", async () => {
      const { result } = renderUseTasks();

      await act(async () => {
        await result.current.createTask("   ");
      });

      expect(vi.mocked(api.post)).not.toHaveBeenCalled();
      expect(useTaskStore.getState().tasks).toHaveLength(0);
    });

    it("should handle isTaskActionLoading during task creation", async () => {
      const { promise, resolve } = createDelayedPromise();
      vi.mocked(api.post).mockReturnValue(promise);
      
      const { result } = renderUseTasks();
      expect(result.current.isTaskActionLoading).toBe(false);

      const createPromise = act(async () => {
        await result.current.createTask("New Task");
      });

      // Check loading state is active
      expect(useTaskStore.getState().isTaskActionLoading).toBe(true);

      // Resolve the API call
      resolve({ data: { id: "3", title: "New Task", completed: false } });
      await createPromise;

      // Check loading state is false after completion
      expect(useTaskStore.getState().isTaskActionLoading).toBe(false);
    });
  });

  describe("toggleComplete", () => {
    it("should toggle task completion", async () => {
      const initialTasks = [{ ...mockTasks[0], completed: false }];
      const updatedTask = { ...mockTasks[0], completed: true };
      
      vi.mocked(api.get).mockResolvedValue({ data: initialTasks });
      vi.mocked(api.put).mockResolvedValue({ data: updatedTask });
      
      const { result } = renderUseTasks();

      await act(async () => {
        await result.current.fetchTasks();
        await result.current.toggleComplete("1");
      });

      await waitFor(() => {
        expect(useTaskStore.getState().tasks).toHaveLength(1);
        expect(useTaskStore.getState().tasks[0].completed).toBe(true);
      });

      expect(vi.mocked(api.put)).toHaveBeenCalledWith("/tasks/1", {
        completed: true,
      });
    });

    it("should handle toggle errors", async () => {
      const initialTasks = [{ ...mockTasks[0], completed: false }];
      
      vi.mocked(api.get).mockResolvedValue({ data: initialTasks });
      vi.mocked(api.put).mockRejectedValue({
        response: { data: { error: "Toggle failed" } }
      });
      
      const { result } = renderUseTasks();

      await act(async () => {
        await result.current.fetchTasks();
        await result.current.toggleComplete("1");
      });

      // Task should remain unchanged after error
      expect(useTaskStore.getState().tasks[0].completed).toBe(false);
    });

    it("should not toggle non-existent task", async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockTasks });
      
      const { result } = renderUseTasks();

      await act(async () => {
        await result.current.fetchTasks();
        await result.current.toggleComplete("non-existent-id");
      });

      expect(vi.mocked(api.put)).not.toHaveBeenCalled();
    });
  });

  describe("Store Integration", () => {
    it("should return current store state", () => {
      useTaskStore.setState({ tasks: mockTasks, loading: true });
      
      const { result } = renderHook(() => useTasks());

      expect(result.current.tasks).toEqual(mockTasks);
      expect(result.current.loading).toBe(true);
    });

    it("should handle multiple operations in sequence", async () => {
      const newTask = { id: "3", userId: "1", title: "New Task", completed: false };
      
      vi.mocked(api.get).mockResolvedValue({ data: mockTasks });
      vi.mocked(api.post).mockResolvedValue({ data: newTask });
      vi.mocked(api.put).mockResolvedValue({ 
        data: { ...newTask, completed: true } 
      });
      
      const { result } = renderUseTasks();

      await act(async () => {
        await result.current.fetchTasks();
        await result.current.createTask("New Task");
        await result.current.toggleComplete("3");
      });

      await waitFor(() => {
        expect(useTaskStore.getState().tasks).toHaveLength(3);
        expect(useTaskStore.getState().tasks[2].completed).toBe(true);
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle API returning null data", async () => {
      vi.mocked(api.get).mockResolvedValue({ data: null });
      
      const { result } = renderUseTasks();

      await act(async () => {
        await result.current.fetchTasks();
      });

      expect(useTaskStore.getState().tasks).toEqual([]);
    });

    it("should handle malformed API response", async () => {
      vi.mocked(api.get).mockResolvedValue({});
      
      const { result } = renderUseTasks();

      await act(async () => {
        await result.current.fetchTasks();
      });

      expect(useTaskStore.getState().tasks).toEqual([]);
    });
  });
});
