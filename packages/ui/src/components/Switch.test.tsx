import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Switch } from "./Switch";

describe("Switch", () => {
  it("renders an unchecked switch by default", () => {
    render(<Switch />);
    const switchEl = screen.getByRole("switch");
    expect(switchEl).toBeInTheDocument();
    expect(switchEl).not.toBeChecked();
  });

  it("renders a checked switch when checked is true", () => {
    render(<Switch checked />);
    const switchEl = screen.getByRole("switch");
    expect(switchEl).toBeChecked();
  });

  it("toggles state when clicked", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Switch onCheckedChange={handleChange} />);

    const switchEl = screen.getByRole("switch");
    await user.click(switchEl);

    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it("is disabled when disabled prop is true", () => {
    render(<Switch disabled />);
    const switchEl = screen.getByRole("switch");
    expect(switchEl).toBeDisabled();
  });

  it("has an accessible label when provided", () => {
    render(
      <div>
        <label htmlFor="airplane-mode">Airplane Mode</label>
        <Switch id="airplane-mode" />
      </div>
    );
    const switchEl = screen.getByRole("switch", { name: /airplane mode/i });
    expect(switchEl).toBeInTheDocument();
  });
});
