import { describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import Login from "./login";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AuthProvider } from "@/store/authContext";

// const input = "Login Testing";

// describe("Test Suite 1", () => {
//   it("render headline", () => {
//     expect(input).toBe("Login Testing");
//   });
// });

// Renders form with email & password inputs
describe("Login Test 1", () =>
  it("Renders form with email & password inputs", () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthProvider>
    );
    // screen.debug();

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log in" }));
  }));

describe("Login Test 3", () => {
  it("Shows error if fields are empty and user clicks Login", async () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthProvider>
    );

    // Click the submit button
    const loginBtn = screen.getByRole("button", { name: "Log in" });
    await userEvent.click(loginBtn);

    // Wait for validation error messages to appear
    const userNameErr = await screen.findByText("String must contain at least 2 character(s)");
    const passwordErr = await screen.findByText("String must contain at least 3 character(s)");

    expect(userNameErr).toBeInTheDocument();
    expect(passwordErr).toBeInTheDocument();
  });
});

describe("Login Test 4", () => {
  it("Shows error if fields are empty and user clicks Login", async () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthProvider>
    );

    // Click the submit button
    const loginBtn = screen.getByRole("button", { name: "Log in" });
    await userEvent.click(loginBtn);

    // Wait for validation error messages to appear
    const userNameErr = await screen.findByText("String must contain at least 2 character(s)");
    const passwordErr = await screen.findByText("String must contain at least 3 character(s)");

    expect(userNameErr).toBeInTheDocument();
    expect(passwordErr).toBeInTheDocument();
  });
});
