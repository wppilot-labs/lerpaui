import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { NoiseGrainOverlay } from "./NoiseGrainOverlay";

describe("NoiseGrainOverlay", () => {
  it("renders an SVG with a turbulence filter", () => {
    const { container } = render(<NoiseGrainOverlay />);
    expect(container.querySelector("svg")).not.toBeNull();
    expect(container.querySelector("feTurbulence")).not.toBeNull();
  });

  it("applies custom className", () => {
    const { container } = render(<NoiseGrainOverlay className="grain-x" />);
    expect((container.firstChild as HTMLElement).className).toContain("grain-x");
  });

  it("respects opacity from intensity prop", () => {
    const { container } = render(<NoiseGrainOverlay intensity={0.5} />);
    const root = container.firstChild as HTMLElement;
    expect(root.style.opacity).toBe("0.5");
  });

  it("applies aria-hidden for decorative overlay", () => {
    const { container } = render(<NoiseGrainOverlay />);
    const root = container.firstChild as HTMLElement;
    expect(root.getAttribute("aria-hidden")).toBe("true");
  });
});
