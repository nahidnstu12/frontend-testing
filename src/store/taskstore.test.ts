import { useTaskStore } from "./task-store";

describe("taskstore test 1", () => {
  beforeEach(() => {
    useTaskStore.setState({ tasks: [] });
  });

  // test 1
  it("add a task", () => {
    useTaskStore
      .getState()
      .addTask({ id: "1", title: "task 1", completed: false, userId: "1" });

      expect(useTaskStore.getState().tasks).toHaveLength(1);
  });

  it("update task", ()=> {
      useTaskStore.setState({ tasks: [{ id: '1', title: 'Test', completed: false, userId: "1" }] });

    useTaskStore
      .getState()
      .toggleTask({ id: "1", title: "task 1", completed: true, userId: "1" });

      expect(useTaskStore.getState().tasks).toHaveLength(1);
      expect(useTaskStore.getState().tasks[0].completed).toBe(true)
  })
});
