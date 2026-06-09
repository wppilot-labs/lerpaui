import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GestureSwipeCardStack } from "./GestureSwipeCardStack";

describe("GestureSwipeCardStack", () => {
  it("renders default cards", () => {
    render(<GestureSwipeCardStack />);
    expect(screen.getByText(/Aurora Nights/)).toBeInTheDocument();
  });

  it("renders custom cards", () => {
    render(
      <GestureSwipeCardStack
        cards={[
          { id: 1, title: "First card", subtitle: "subtitle 1" },
          { id: 2, title: "Second card" },
        ]}
      />
    );
    expect(screen.getByText("First card")).toBeInTheDocument();
  });

  it("renders custom content inside card", () => {
    render(
      <GestureSwipeCardStack cards={[{ id: "x", content: <div>Custom inner</div> }]} />
    );
    expect(screen.getByText("Custom inner")).toBeInTheDocument();
  });

  it("accepts className on root", () => {
    const { container } = render(
      <GestureSwipeCardStack className="my-stack" cards={[{ id: 1, title: "A" }]} />
    );
    expect((container.firstChild as HTMLElement).className).toContain("my-stack");
  });
});
