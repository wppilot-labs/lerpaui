import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HolographicShineBadge } from "./HolographicShineBadge";

describe("HolographicShineBadge", () => {
  it("renders default label when no children are provided", () => {
    render(<HolographicShineBadge />);
    expect(screen.getByText(/premium/i)).toBeInTheDocument();
  });

  it("renders custom children", () => {
    render(<HolographicShineBadge>Limited</HolographicShineBadge>);
    expect(screen.getByText(/limited/i)).toBeInTheDocument();
  });

  it("merges custom className", () => {
    const { container } = render(
      <HolographicShineBadge className="my-badge">x</HolographicShineBadge>
    );
    expect(container.firstChild).toHaveClass("my-badge");
  });
});
