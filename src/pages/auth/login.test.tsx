import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import "../../test/_mocks";
import { useAuth } from "@/store/authContext";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import "../../test/_mocks";
import Login from "./login";
import api from "@/store/api";
import { toast } from 'sonner';

// const input = "Login Testing";

// describe("Test Suite 1", () => {
//   it("render headline", () => {
//     expect(input).toBe("Login Testing");
//   });
// });

// Renders form with email & password inputs
describe("Login Test 1", () =>
  it("Renders form with email & password inputs", () => {
    const loginMock = vi.fn();

    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      login: loginMock,
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    // screen.debug();

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log in" }));
  }));

describe("Login Test 3", () => {
  it("Shows error if fields are empty and user clicks Login", async () => {
    const loginMock = vi.fn();

    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      login: loginMock,
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Click the submit button
    const loginBtn = screen.getByRole("button", { name: "Log in" });
    await userEvent.click(loginBtn);

    // Wait for validation error messages to appear
    const userNameErr = await screen.findByText(
      "String must contain at least 2 character(s)"
    );
    const passwordErr = await screen.findByText(
      "String must contain at least 3 character(s)"
    );

    expect(userNameErr).toBeInTheDocument();
    expect(passwordErr).toBeInTheDocument();
  });
});

describe("Login Test 4", () => {
  it("Fills in email and password fields", async () => {
    const loginMock = vi.fn();

    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      login: loginMock,
    });
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Click the submit button
    const username = screen.getByLabelText("Username");
    const password = screen.getByLabelText("Password");

    await userEvent.type(username, "test-user");
    await userEvent.type(password, "pass123");

    expect(username).toHaveValue("test-user");
    expect(password).toHaveValue("pass123");
  });
});

describe("Login Test 5", () => {
  it("Calls login() function", async () => {
    const loginMock = vi.fn();

    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      login: loginMock,
    });
    (api.post as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: {
        token:
          "header." +
          btoa(JSON.stringify({ id: 1, name: "Test User" })) +
          ".signature",
      },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Click the submit button
    const username = screen.getByLabelText("Username");
    const password = screen.getByLabelText("Password");
    const loginBtn = screen.getByRole("button", { name: "Log in" });

    await userEvent.type(username, "test-user");
    await userEvent.type(password, "pass123");
    await userEvent.click(loginBtn);

    expect(loginMock).toHaveBeenCalled();
  });
});

describe("Login Test 6", () => {
  it("Calls login() function. rejected", async () => {
    const loginMock = vi.fn();

    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      login: loginMock,
    });

    (api.post as unknown as ReturnType<typeof vi.fn>).mockRejectedValue({
      error: "Invalid Credentials"
    })

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Click the submit button
    const username = screen.getByLabelText("Username");
    const password = screen.getByLabelText("Password");
    const loginBtn = screen.getByRole("button", { name: "Log in" });

    await userEvent.type(username, "test-user");
    await userEvent.type(password, "pass123");
    await userEvent.click(loginBtn);

    expect(loginMock).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith('Invalid Credentials');
  });
});
