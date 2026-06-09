import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { LiquidBlobMenu } from "./LiquidBlobMenu";

describe("LiquidBlobMenu", () => {
  it("renders the SVG goo filter", () => {
    const { container } = render(<LiquidBlobMenu />);
    expect(container.querySelector("svg")).not.toBeNull();
    expect(container.querySelector("filter")).not.toBeNull();
  });

  it("accepts custom className", () => {
    const { container } = render(<LiquidBlobMenu className="blob-x" />);
    expect((container.firstChild as HTMLElement).className).toContain("blob-x");
  });

  it("respects size and radius props", () => {
    const { container } = render(<LiquidBlobMenu size={80} radius={150} />);
    const el = container.firstChild as HTMLElement;
    // width = radius * 2 + size = 380
    expect(el.style.width).toBe("380px");
    expect(el.style.height).toBe("380px");
  });

  it("renders with default items", () => {
    const { container } = render(<LiquidBlobMenu />);
    expect(container.firstChild).not.toBeNull();
  });
});
