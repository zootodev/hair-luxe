// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import AdminLoginPage from "@/app/admin/login/page";

// React Testing Library only auto-registers cleanup when test globals exist.
afterEach(cleanup);

/**
 * Regression test for the reported bug where toggling password visibility on
 * the admin login cleared the typed value. Only the input's `type` may change.
 */
describe("admin login show/hide password", () => {
  it("keeps the typed password value when toggling visibility", () => {
    render(<AdminLoginPage />);

    const input = screen.getByLabelText("Password") as HTMLInputElement;
    expect(input.type).toBe("password");

    fireEvent.change(input, { target: { value: "super-secret-123" } });
    expect(input.value).toBe("super-secret-123");

    const toggle = screen.getByRole("button", { name: "Show password" });
    fireEvent.click(toggle);

    expect(input.type).toBe("text");
    expect(input.value).toBe("super-secret-123");

    const hideToggle = screen.getByRole("button", { name: "Hide password" });
    fireEvent.click(hideToggle);

    expect(input.type).toBe("password");
    expect(input.value).toBe("super-secret-123");
  });

  it("labels the toggle with its pressed state", () => {
    render(<AdminLoginPage />);
    const toggle = screen.getByRole("button", { name: "Show password" });
    expect(toggle.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(toggle);
    expect(
      screen.getByRole("button", { name: "Hide password" }).getAttribute("aria-pressed")
    ).toBe("true");
  });
});
