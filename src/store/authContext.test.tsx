import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "./authContext";

function TestComponent() {
  const { user, login, logout } = useAuth();
  const mockUser = {
    username: "Nahid",
  };
  const mockToken = "mock-jwt-token";
  return (
    <div>
      <p>{user?.username || "Guest"}</p>
      <button onClick={() => login(mockUser, mockToken)}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe("Mock AuthContext", () => {
  it("should log in and out correctly", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText("Guest"));
    const loginBtn = screen.getByRole("button", { name: "Login" });
    const logoutBtn = screen.getByRole("button", { name: "Logout" });
    await userEvent.click(loginBtn);
    expect(await screen.findByText("Nahid")).toBeInTheDocument();

    // logout
    fireEvent.click(logoutBtn);
    expect(await screen.findByText("Guest")).toBeInTheDocument();
  });
});


