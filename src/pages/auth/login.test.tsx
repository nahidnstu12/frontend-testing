import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import "../../test/_mocks.ts";
import { useAuth } from "@/store/authContext";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import "../../test/_mocks.ts";
import Login from "./login";
import api from "@/store/api";
import { toast } from "sonner";

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

// Renders form with email & password inputs
describe("Login Component", () => {
  it("Renders form with email & password inputs", () => {
    const loginMock = vi.fn();

    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      login: loginMock,
    });

    renderLogin();
    // screen.debug();

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log in" }));
  });

  it("Shows error if fields are empty and user clicks Login", async () => {
    const loginMock = vi.fn();

    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      login: loginMock,
    });

    renderLogin();

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

  it("Fills in email and password fields", async () => {
    const loginMock = vi.fn();

    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      login: loginMock,
    });
    renderLogin();

    // Click the submit button
    const username = screen.getByLabelText("Username");
    const password = screen.getByLabelText("Password");

    await userEvent.type(username, "test-user");
    await userEvent.type(password, "pass123");

    expect(username).toHaveValue("test-user");
    expect(password).toHaveValue("pass123");
  });

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

    renderLogin();

    await renderFillForm("test-user", "pass123");

    expect(loginMock).toHaveBeenCalled();
  });

  it("Calls login() function. rejected", async () => {
    const loginMock = vi.fn();

    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      login: loginMock,
    });

    (api.post as unknown as ReturnType<typeof vi.fn>).mockRejectedValue({
      error: "Invalid Credentials",
    });

    renderLogin();

    // Click the submit button
    await renderFillForm("test-user", "pass123");

    expect(loginMock).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith("Invalid Credentials");
  });
});
