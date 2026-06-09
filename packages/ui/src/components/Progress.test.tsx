import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Progress } from "./Progress";

describe("Progress", () => {
  it("renders with progressbar role", () => {
    render(<Progress value={50} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("exposes aria-valuemax and a loading data-state for a numeric value", () => {
    render(<Progress value={70} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
    expect(bar).toHaveAttribute("data-state");
  });

  it("merges custom className", () => {
    const { container } = render(
      <Progress value={10} className="my-progress" />
    );
    expect(container.firstChild).toHaveClass("my-progress");
  });
});
