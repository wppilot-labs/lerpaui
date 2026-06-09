import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShinyButton } from "./ShinyButton";

describe("ShinyButton", () => {
  it("renders children inside a button", () => {
    render(<ShinyButton>Press</ShinyButton>);
    expect(screen.getByRole("button", { name: /press/i })).toBeInTheDocument();
  });

  it("fires onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<ShinyButton onClick={onClick}>Press</ShinyButton>);
    await user.click(screen.getByRole("button", { name: /press/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("has type='button'", () => {
    render(<ShinyButton>Press</ShinyButton>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });
});
