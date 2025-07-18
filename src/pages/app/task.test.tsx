import "../../test/_mocks.ts";
import { useAuth } from "@/store/authContext";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import Dashboard from "./dashboard";
import userEvent from "@testing-library/user-event";
import api from "@/store/api";

// Mock AppLayout to avoid provider issues
vi.mock("@/layouts/app-layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const mockAuth = () => ({
  user: { id: 1, username: "Test User" },
  token: "fake-token",
  login: vi.fn(),
  logout: vi.fn(),
});

const renderDashboard = () => {
  (useAuth as any).mockReturnValue(mockAuth());
  vi.mocked(api.get).mockResolvedValue({ data: [] });
  vi.mocked(api.post).mockResolvedValue({
    data: { id: 1, title: "Testing Task Added", completed: false },
  });
  return render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );
};

describe("TaskList Component", () => {
  it("Renders task input field and Add button", async () => {
    renderDashboard();

    // Wait for the component to render and async operations to complete
    await waitFor(() => {
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Add a task")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });

  it("Fills task input and submits", async () => {
    renderDashboard();

    const input = await screen.findByRole("textbox");
    const btn = await screen.findByRole("button", { name: "Add" });

    await userEvent.type(input, "Testing Task Added");
    await userEvent.click(btn);

    // Check that api.post was called, not mockFake
    expect(vi.mocked(api.post)).toHaveBeenCalledWith("/tasks", {
      title: "Testing Task Added",
    });

    // Wait for the task to appear
    await screen.findByText("Testing Task Added");
  });

  it("Test toggling a task", async () => {
    // Mock the API calls
    vi.mocked(api.get).mockResolvedValue({
      data: [
        {
          id: "1",
          userId: "1",
          title: "First Task",
          completed: false,
        },
      ],
    });

    vi.mocked(api.put).mockResolvedValueOnce({
      data: {
        id: "1",
        userId: "1",
        title: "First Task",
        completed: true,
      },
    });
    vi.mocked(api.put).mockResolvedValueOnce({
      data: {
        id: "1",
        userId: "1",
        title: "First Task",
        completed: false,
      },
    });

    (useAuth as any).mockReturnValue(mockAuth());
    
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await screen.findByText("First Task");

    const checkbox = await screen.findByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    // first toggle
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(vi.mocked(api.put)).toHaveBeenCalledWith("/tasks/1", {
      completed: true,
    });

    // second toggle
    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(vi.mocked(api.put)).toHaveBeenCalledWith("/tasks/1", {
      completed: false,
    });
  });
});
