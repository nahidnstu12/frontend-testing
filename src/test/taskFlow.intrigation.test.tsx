import { Toaster } from "@/components/ui/sonner";
import Dashboard from "@/pages/app/dashboard";
import Login from "@/pages/auth/login";
import { AuthProvider } from "@/store/authContext";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { handlers } from "./msw.handler";

vi.mock("@/hooks/use-mobile", () => ({
  useIsMobile: () => false,
}));

const server = setupServer(...handlers);

beforeAll(() => {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
  server.listen();
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const renderApp = (initialRoute = "/login") => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <Toaster
          position="top-right"
          expand={false}
          richColors
          closeButton
          theme="dark"
        />
      </AuthProvider>
    </MemoryRouter>
  );
};

// test("user logs in and sees task dashboard", async () => {
//   renderApp();
//   // screen.debug();

//   const usernameInput = await screen.findByLabelText("Username");
//   const passwordInput = await screen.findByLabelText("Password");
//   const loginBtn = await screen.findByRole("button", { name: "Log in" });

//   await userEvent.type(usernameInput, "jhon");
//   await userEvent.type(passwordInput, "password");
//   await userEvent.click(loginBtn);

//   // ADD THIS: Debug what happens after login click
//   // await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
//   // screen.debug(); // See what's rendered now

//   // Check for any error messages
//   // const errorMessage = screen.queryByText(/error/i);
//   // if (errorMessage) {
//   //   console.log("Found error:", errorMessage.textContent);
//   // }

//   await waitFor(() => {
//     // expect(screen.getByText("Dashboard")).toBeInTheDocument();
//     expect(
//       screen.getByRole("heading", { name: "Dashboard" })
//     ).toBeInTheDocument();
//     expect(screen.getByText("Welcome, jhon")).toBeInTheDocument();
//   });
// });

// test("fetched tasks are shown after login", async () => {
//   renderApp();

//   const usernameInput = await screen.findByLabelText("Username");
//   const passwordInput = await screen.findByLabelText("Password");
//   const loginBtn = await screen.findByRole("button", { name: "Log in" });

//   await userEvent.type(usernameInput, "jhon");
//   await userEvent.type(passwordInput, "password");
//   await userEvent.click(loginBtn);

//   await waitFor(() => {
//     expect(screen.getByText("test task")).toBeInTheDocument();
//   });
// });
// test("adds a new task", async () => {
//   renderApp();

//   const usernameInput = await screen.findByLabelText("Username");
//   const passwordInput = await screen.findByLabelText("Password");
//   const loginBtn = await screen.findByRole("button", { name: "Log in" });

//   await userEvent.type(usernameInput, "jhon");
//   await userEvent.type(passwordInput, "password");
//   await userEvent.click(loginBtn);

//   await waitFor(() => {
//     expect(screen.getByText("test task")).toBeInTheDocument();
//   });

//   const input = await screen.findByRole("textbox");
//   const btn = await screen.findByRole("button", { name: "Add" });

//   await userEvent.type(input, "test task 2");
//   await userEvent.click(btn);

//   await waitFor(() => {
//     expect(screen.getByText("test task 2")).toBeInTheDocument();
//   });
// });

// test("toggles task completion", async () => {
//   renderApp();

//   const usernameInput = await screen.findByLabelText("Username");
//   const passwordInput = await screen.findByLabelText("Password");
//   const loginBtn = await screen.findByRole("button", { name: "Log in" });

//   await userEvent.type(usernameInput, "jhon");
//   await userEvent.type(passwordInput, "password");
//   await userEvent.click(loginBtn);

//   const taskItem = await screen.findByText("test task");
//   const taskCheckbox = await screen.findAllByRole("checkbox");

//   await waitFor(() => {
//     expect(taskItem).toBeInTheDocument();
//     expect(taskCheckbox[0]).not.toBeChecked();
//   });

//   await userEvent.click(taskCheckbox[0]);

//   await waitFor(() => {
//     expect(taskCheckbox[0]).toBeChecked();
//   });
// });
test("Complete task completion at once", async () => {
  renderApp();

  const usernameInput = await screen.findByLabelText("Username");
  const passwordInput = await screen.findByLabelText("Password");
  const loginBtn = await screen.findByRole("button", { name: "Log in" });

  await userEvent.type(usernameInput, "jhon");
  await userEvent.type(passwordInput, "password");
  await userEvent.click(loginBtn);

  const taskItem = await screen.findByText("test task");
  let checkboxes = await screen.findAllByRole("checkbox");

  await waitFor(() => {
    expect(taskItem).toBeInTheDocument();
    expect(checkboxes[0]).not.toBeChecked();
  });

  // add task
  const input = await screen.findByRole("textbox");
  const btn = await screen.findByRole("button", { name: "Add" });

  await userEvent.type(input, "test task 2");
  await userEvent.click(btn);

  await waitFor(async () => {
    expect(screen.getByText("test task 2")).toBeInTheDocument();
    checkboxes = await screen.findAllByRole("checkbox");
    expect(checkboxes).toHaveLength(2);
  });

  // toggle task
  await userEvent.click(checkboxes[0]);

  await waitFor(async () => {
    checkboxes = await screen.findAllByRole("checkbox");
    expect(checkboxes[0]).toBeChecked();
  });

  // screen.debug();

  // check another task
  checkboxes = await screen.findAllByRole("checkbox");
  await userEvent.click(checkboxes[1]);
  await waitFor(async () => {
    checkboxes = await screen.findAllByRole("checkbox");
    expect(checkboxes[1]).toBeChecked();
  });

  // again click
  await userEvent.click(checkboxes[0]);
  await waitFor(async () => {
    checkboxes = await screen.findAllByRole("checkbox");
    expect(checkboxes[0]).not.toBeChecked();
  });
});
//
