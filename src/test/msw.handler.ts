import { http, HttpResponse } from "msw";

let tasks = [
  {
    id: 1,
    title: "test task",
    userId: "1",
    completed: false,
  },
];

export const handlers = [
  http.post("/api/login", () => {
    return HttpResponse.json({
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6Impob24iLCJpYXQiOjE3NTMwOTQ5MjksImV4cCI6MTc1MzE4MTMyOX0.p6uBoZhed9rItGmdtbe3IvGattTN51nojd0keEQm2og",
    });
  }),
  http.get("/api/tasks", () => {
    return HttpResponse.json(tasks);
  }),
  http.post("/api/tasks", () => {
    let newTask = {
      id: 2,
      title: "test task 2",
      userId: "1",
      completed: false,
    };

    tasks.push(newTask);
    return HttpResponse.json(newTask);
  }),
  http.put("/api/tasks/:id", ({ params }) => {
    const { id } = params;
    
    let taskIdx = tasks.findIndex((i) => i.id == Number(id));
    
    if (taskIdx !== -1) {
      tasks[taskIdx] = {
        ...tasks[taskIdx],
        completed: !tasks[taskIdx].completed,
      };
      return HttpResponse.json(tasks[taskIdx]);
    }

    return HttpResponse.json({ error: "Task not found" }, { status: 404 });
  }),
];
