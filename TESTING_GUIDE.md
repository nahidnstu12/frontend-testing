# Testing Guide for Beginners

This guide will teach you how to write effective tests using the examples from our TaskHub project. We'll cover different types of testing from basic component tests to complex integration tests.

## Table of Contents

1. [Testing Setup](#testing-setup)
2. [Basic Component Testing](#basic-component-testing)
3. [User Interaction Testing](#user-interaction-testing)
4. [API Mocking](#api-mocking)
5. [Custom Hook Testing](#custom-hook-testing)
6. [Integration Testing](#integration-testing)
7. [Best Practices](#best-practices)
8. [Common Patterns](#common-patterns)

## Testing Setup

### Required Dependencies

```json
{
  "devDependencies": {
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^14.4.3",
    "@testing-library/jest-dom": "^5.16.5",
    "vitest": "^0.34.0",
    "msw": "^1.3.0"
  }
}
```

### Basic Test Structure

Every test file should follow this structure:

```typescript
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Component Name", () => {
  it("should do something specific", () => {
    // Arrange - Set up test data and render component
    // Act - Perform actions
    // Assert - Check results
  });
});
```

## Basic Component Testing

### 1. Rendering Tests

Test that your component renders correctly with required elements.

**Example from `login.test.tsx`:**

```typescript
it("Renders form with email & password inputs", () => {
  // Mock dependencies
  const loginMock = vi.fn();
  (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    login: loginMock,
  });

  // Render component
  renderLogin();

  // Assert elements exist
  expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Log in" }));
});
```

**Key Concepts:**
- Use `screen.getByLabelText()` for form inputs
- Use `screen.getByRole()` for buttons, links, etc.
- Use `toBeInTheDocument()` matcher to verify presence

### 2. Form Validation Tests

Test that your forms show appropriate validation errors.

```typescript
it("Shows error if fields are empty and user clicks Login", async () => {
  renderLogin();
  
  const loginBtn = screen.getByRole("button", { name: "Log in" });
  await userEvent.click(loginBtn);
  
  // Wait for validation errors to appear
  const userNameErr = await screen.findByText(
    "String must contain at least 2 character(s)"
  );
  const passwordErr = await screen.findByText(
    "String must contain at least 3 character(s)"
  );
  
  expect(userNameErr).toBeInTheDocument();
  expect(passwordErr).toBeInTheDocument();
});
```

**Key Concepts:**
- Use `findByText()` for async content that appears after actions
- Test validation messages appear correctly
- Always use `await` with user interactions

## User Interaction Testing

### 1. Form Input Testing

Test that users can type in form fields and values are stored correctly.

```typescript
it("Fills in email and password fields", async () => {
  renderLogin();
  
  const username = screen.getByLabelText("Username");
  const password = screen.getByLabelText("Password");
  
  await userEvent.type(username, "test-user");
  await userEvent.type(password, "pass123");
  
  expect(username).toHaveValue("test-user");
  expect(password).toHaveValue("pass123");
});
```

### 2. Button Click Testing

Test that clicking buttons triggers the correct actions.

```typescript
it("Fills task input and submits", async () => {
  renderDashboard();
  
  const input = await screen.findByRole("textbox");
  const btn = await screen.findByRole("button", { name: "Add" });
  
  await userEvent.type(input, "Testing Task Added");
  await userEvent.click(btn);
  
  // Verify API was called
  expect(vi.mocked(api.post)).toHaveBeenCalledWith("/tasks", {
    title: "Testing Task Added",
  });
});
```

**Key Concepts:**
- Always use `await` with `userEvent` actions
- Use `userEvent` instead of `fireEvent` for more realistic interactions
- Test both the action and its effects

## API Mocking

### 1. Basic API Mocking

Mock API calls to control test data and avoid real network requests.

```typescript
// Mock successful API response
vi.mocked(api.post).mockResolvedValue({
  data: { id: 1, title: "Testing Task Added", completed: false },
});

// Mock API error
vi.mocked(api.post).mockRejectedValue({
  error: "Invalid Credentials",
});
```

### 2. Testing API Integration

Test that components handle API responses correctly.

```typescript
it("Calls login() function. rejected", async () => {
  const loginMock = vi.fn();
  
  (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    login: loginMock,
  });
  
  // Mock API rejection
  (api.post as unknown as ReturnType<typeof vi.fn>).mockRejectedValue({
    error: "Invalid Credentials",
  });
  
  renderLogin();
  await renderFillForm("test-user", "pass123");
  
  // Verify error handling
  expect(loginMock).not.toHaveBeenCalled();
  expect(toast.error).toHaveBeenCalledWith("Invalid Credentials");
});
```

## Custom Hook Testing

### 1. Basic Hook Testing

Test custom hooks using `renderHook` from Testing Library.

**Example from `useTask.test.ts`:**

```typescript
const renderUseTasks = () => {
  useTaskStore.setState({ tasks: [], loading: false, isTaskActionLoading: false });
  return renderHook(() => useTasks());
};

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
```

### 2. Testing Loading States

Test that loading states work correctly during async operations.

```typescript
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
```

**Key Concepts:**
- Use `act()` wrapper for state updates
- Use `waitFor()` for async state changes
- Test both loading and completed states

### 3. Error Handling in Hooks

```typescript
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
```

## Integration Testing

### 1. Full User Flow Testing

Test complete user workflows from start to finish.

**Example from `taskFlow.intrigation.test.tsx`:**

```typescript
test("Complete task completion at once", async () => {
  renderApp();
  
  // Login flow
  const usernameInput = await screen.findByLabelText("Username");
  const passwordInput = await screen.findByLabelText("Password");
  const loginBtn = await screen.findByRole("button", { name: "Log in" });
  
  await userEvent.type(usernameInput, "jhon");
  await userEvent.type(passwordInput, "password");
  await userEvent.click(loginBtn);
  
  // Verify login success
  const taskItem = await screen.findByText("test task");
  let checkboxes = await screen.findAllByRole("checkbox");
  
  await waitFor(() => {
    expect(taskItem).toBeInTheDocument();
    expect(checkboxes[0]).not.toBeChecked();
  });
  
  // Add new task
  const input = await screen.findByRole("textbox");
  const btn = await screen.findByRole("button", { name: "Add" });
  
  await userEvent.type(input, "test task 2");
  await userEvent.click(btn);
  
  await waitFor(async () => {
    expect(screen.getByText("test task 2")).toBeInTheDocument();
    checkboxes = await screen.findAllByRole("checkbox");
    expect(checkboxes).toHaveLength(2);
  });
  
  // Toggle task completion
  await userEvent.click(checkboxes[0]);
  
  await waitFor(async () => {
    checkboxes = await screen.findAllByRole("checkbox");
    expect(checkboxes[0]).toBeChecked();
  });
});
```

### 2. MSW (Mock Service Worker) Setup

For integration tests, use MSW to mock entire API endpoints.

```typescript
// Setup MSW server
const server = setupServer(...handlers);

beforeAll(() => {
  server.listen();
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Best Practices

### 1. Test Structure

- **Arrange**: Set up test data and render components
- **Act**: Perform user actions
- **Assert**: Check the results

### 2. What to Test

✅ **DO Test:**
- Component renders correctly
- User interactions work
- API calls are made with correct data
- Error states are handled
- Loading states work
- Form validation works

❌ **DON'T Test:**
- Implementation details
- Third-party libraries
- CSS styles (unless critical to functionality)

### 3. Test Naming

Use descriptive test names that explain what is being tested:

```typescript
✅ Good: "should show error message when login fails"
❌ Bad: "test login error"
```

### 4. Mocking Guidelines

- Mock external dependencies (APIs, third-party libraries)
- Don't mock the code you're testing
- Reset mocks between tests

### 5. Async Testing

Always use proper async/await patterns:

```typescript
// ✅ Good
await userEvent.click(button);
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument();
});

// ❌ Bad
userEvent.click(button);
expect(screen.getByText('Success')).toBeInTheDocument();
```

## Common Patterns

### 1. Helper Functions

Create reusable helper functions for common operations:

```typescript
const renderLogin = () => {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
};

const renderFillForm = async (username: string, password: string) => {
  const usernameInput = screen.getByLabelText("Username");
  const passwordInput = screen.getByLabelText("Password");
  const loginBtn = screen.getByRole("button", { name: "Log in" });

  await userEvent.type(usernameInput, username);
  await userEvent.type(passwordInput, password);
  await userEvent.click(loginBtn);

  return { usernameInput, passwordInput, loginBtn };
};
```

### 2. Test Data

Create mock data objects for reuse:

```typescript
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
```

### 3. Setup and Teardown

Use beforeEach/afterEach for consistent test state:

```typescript
beforeEach(() => {
  vi.clearAllMocks();
  useTaskStore.setState({ tasks: [], loading: false });
});
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test login.test.tsx
```

## Debugging Tests

### 1. Use screen.debug()

```typescript
it("should render correctly", () => {
  render(<Component />);
  screen.debug(); // Prints the current DOM
});
```

### 2. Use logRoles()

```typescript
import { logRoles } from '@testing-library/dom';

it("should have accessible roles", () => {
  const { container } = render(<Component />);
  logRoles(container); // Shows all available roles
});
```

### 3. Query Debugging

```typescript
// Find what queries are available
screen.getByRole(''); // Will show available roles in error message
```

Remember: Good tests make your code more reliable and easier to refactor. Start simple and gradually add more complex test scenarios as you become comfortable with the basics! 