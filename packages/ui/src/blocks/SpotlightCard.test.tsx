import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SpotlightCard } from "./SpotlightCard";

describe("SpotlightCard", () => {
  it("renders children inside the card", () => {
    render(
      <SpotlightCard>
        <div>Inner content</div>
      </SpotlightCard>
    );
    expect(screen.getByText("Inner content")).toBeInTheDocument();
  });

  it("accepts custom className", () => {
    const { container } = render(<SpotlightCard className="my-spotlight">x</SpotlightCard>);
    expect((container.firstChild as HTMLElement).className).toContain("my-spotlight");
  });

  it("renders with disabled prop", () => {
    render(
      <SpotlightCard disabled>
        <div>disabled state</div>
      </SpotlightCard>
    );
    expect(screen.getByText("disabled state")).toBeInTheDocument();
  });
});
