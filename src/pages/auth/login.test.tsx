import { describe, expect, it } from "vitest";
import Login from "./login";
import { render, screen } from "@testing-library/react";

const input = "Login Testing";

describe("Test Suite 1", () => {
  it("render headline", () => {
    expect(input).toBe("Login Testing");
  });
});

// Renders form with email & password inputs
describe("Login Form Test", () =>
  it("Renders form with email & password inputs", () => {
    render(<Login />);
    screen.debug();
  }));
