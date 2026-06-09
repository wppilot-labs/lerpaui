import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { useRef } from "react";
import { AnimatedBeam } from "./AnimatedBeam";

function Harness() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={containerRef} style={{ position: "relative", width: 200, height: 100 }}>
      <div ref={fromRef} />
      <div ref={toRef} />
      <AnimatedBeam containerRef={containerRef} fromRef={fromRef} toRef={toRef} />
    </div>
  );
}

describe("AnimatedBeam", () => {
  it("renders an SVG element", () => {
    const { container } = render(<Harness />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
  });

  it("does not crash when refs are mounted", () => {
    const { container } = render(<Harness />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders a linearGradient definition with a beam-grad id", () => {
    const { container } = render(<Harness />);
    const grad = container.querySelector("linearGradient");
    expect(grad).not.toBeNull();
    expect(grad?.getAttribute("id")).toMatch(/^beam-grad-/);
  });

  it("marks the beam SVG as pointer-events-none so it never blocks input", () => {
    const { container } = render(<Harness />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("class")).toContain("pointer-events-none");
  });
});
