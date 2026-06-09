import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MorphingBlobShape } from "./MorphingBlobShape";

describe("MorphingBlobShape", () => {
  it("renders an SVG element", () => {
    const { container } = render(<MorphingBlobShape />);
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("respects the size prop", () => {
    const { container } = render(<MorphingBlobShape size={200} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "200");
    expect(svg).toHaveAttribute("height", "200");
  });

  it("is marked aria-hidden", () => {
    const { container } = render(<MorphingBlobShape />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden");
  });
});
