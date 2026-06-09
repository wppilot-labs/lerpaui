import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MagneticCursorButton } from "./MagneticCursorButton";

describe("MagneticCursorButton", () => {
  it("renders children", () => {
    render(<MagneticCursorButton>Click me</MagneticCursorButton>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("renders default fallback label when no children", () => {
    render(<MagneticCursorButton />);
    expect(screen.getByRole("button", { name: /hover me/i })).toBeInTheDocument();
  });

  it("fires onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<MagneticCursorButton onClick={onClick}>Go</MagneticCursorButton>);
    await user.click(screen.getByRole("button", { name: /go/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
