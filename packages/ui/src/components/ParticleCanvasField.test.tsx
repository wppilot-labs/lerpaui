import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ParticleCanvasField } from "./ParticleCanvasField";

describe("ParticleCanvasField", () => {
  it("renders a canvas element", () => {
    const { container } = render(<ParticleCanvasField />);
    expect(container.querySelector("canvas")).not.toBeNull();
  });

  it("accepts custom className", () => {
    const { container } = render(<ParticleCanvasField className="my-canvas" />);
    const canvas = container.querySelector("canvas");
    expect(canvas).toHaveClass("my-canvas");
  });
});
