import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Switch } from "./Switch";

describe("Switch extra cases", () => {
  it("starts unchecked by default", () => {
    render(<Switch aria-label="toggle" />);
    expect(screen.getByRole("switch")).toHaveAttribute("data-state", "unchecked");
  });

  it("respects defaultChecked", () => {
    render(<Switch defaultChecked aria-label="toggle" />);
    expect(screen.getByRole("switch")).toHaveAttribute("data-state", "checked");
  });

  it("calls onCheckedChange when toggled", async () => {
    const user = userEvent.setup();
    let last: boolean | undefined;
    render(<Switch aria-label="toggle" onCheckedChange={(v) => (last = v)} />);
    await user.click(screen.getByRole("switch"));
    expect(last).toBe(true);
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    let last: boolean | undefined;
    render(<Switch disabled aria-label="toggle" onCheckedChange={(v) => (last = v)} />);
    await user.click(screen.getByRole("switch"));
    expect(last).toBeUndefined();
    expect(screen.getByRole("switch")).toHaveAttribute("data-disabled");
  });

  it("supports keyboard space to toggle", async () => {
    const user = userEvent.setup();
    let last: boolean | undefined;
    render(<Switch aria-label="toggle" onCheckedChange={(v) => (last = v)} />);
    screen.getByRole("switch").focus();
    await user.keyboard(" ");
    expect(last).toBe(true);
  });
});
