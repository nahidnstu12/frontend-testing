import "../test/_mocks.ts";
import api from "@/store/api.ts";
import { useTaskStore } from "@/store/task-store";
import { expect, type vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useTasks } from "./useTasks.ts";

describe("UseTask hook 1", () => {
  beforeEach(() => {
    useTaskStore.setState({ tasks: [] });
  });
  it("fetches tasks and updates store", async() => {
    const mockData = [
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
        completed: true,
      },
    ];
    (api.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      mockData,
    });
    const {result} = renderHook(()=> useTasks());

    // expect(result.current.loading).toBe(true);
    // expect(result.current.tasks).toEqual([]);

    await act(async()=> {
        await result.current.fetchTasks();
    });
    await waitFor(()=> {
        expect(useTaskStore.getState().tasks).toHaveLength(2);
    })
  });
});
