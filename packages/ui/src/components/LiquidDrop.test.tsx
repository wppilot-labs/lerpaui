import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { LiquidDrop } from "./LiquidDrop";

describe("LiquidDrop", () => {
  it("renders without throwing", () => {
    const { container } = render(<LiquidDrop />);
    expect(container.firstChild).not.toBeNull();
  });

  it("sets aria-label from label prop", () => {
    const { container } = render(<LiquidDrop label="Click me" />);
    const root = container.firstChild as HTMLElement;
    expect(root.getAttribute("aria-label")).toBe("Click me");
  });

  it("renders an SVG gooey filter", () => {
    const { container } = render(<LiquidDrop />);
    expect(container.querySelector("svg")).not.toBeNull();
    expect(container.querySelector("filter")).not.toBeNull();
  });

  it("accepts custom className", () => {
    const { container } = render(<LiquidDrop className="drop-x" />);
    expect((container.firstChild as HTMLElement).className).toContain("drop-x");
  });
});
