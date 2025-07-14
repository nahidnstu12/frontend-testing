import { useAuth } from "@/store/authContext";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import Dashboard from "./dashboard";
import userEvent from "@testing-library/user-event";
import api from "@/store/api";

// Global mocks
vi.mock("@/store/authContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/store/api", () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
    }
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock AppLayout to avoid provider issues
vi.mock('@/layouts/app-layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));



describe("TaskList Suite 1", () => {
  it("Renders task input field and Add button", async () => {
    const mockFake = vi.fn();
    // Mock the API calls
    vi.mocked(api.get).mockResolvedValue({ data: [] });
    vi.mocked(api.post).mockResolvedValue({ data: { id: 1, title: "Test Task" } });
    vi.mocked(api.put).mockResolvedValue({ data: { id: 1, title: "Test Task", completed: true } });

    // Mock useAuth
    (useAuth as any).mockReturnValue({
      user: { id: 1, username: "Test User" },
      token: "fake-token",
      login: mockFake,
      logout: mockFake,
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Wait for the component to render and async operations to complete
    await waitFor(() => {
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Add a task")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });
});


describe("TaskList Suite 2", () => {
  it("Fills task input and submits", async () => {
    const mockFake = vi.fn();

    // Mock the API calls
    vi.mocked(api.get).mockResolvedValue({ data: [] });
    vi.mocked(api.post).mockResolvedValue({ 
      data: { id: 1, title: "Testing Task Added", completed: false } 
    });

    // Mock useAuth
    (useAuth as any).mockReturnValue({
      user: { id: 1, username: "Test User" },
      token: "fake-token",
      login: mockFake,
      logout: mockFake,
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

   const input = screen.getByRole("textbox");
   const btn = screen.getByRole("button", {name: "Add"});

   await userEvent.type(input, "Testing Task Added");
   await userEvent.click(btn);

   // Check that api.post was called, not mockFake
   expect(vi.mocked(api.post)).toHaveBeenCalledWith('/tasks', { title: "Testing Task Added" });
   
   // Wait for the task to appear
   await screen.findByText("Testing Task Added");
  });
});
