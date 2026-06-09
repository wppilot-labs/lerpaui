import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { render } from "@testing-library/react";
import { BorderBeam } from "./BorderBeam";

describe("BorderBeam", () => {
  // jsdom returns 0x0 for getBoundingClientRect by default; stub it so the SVG renders
  const originalGetRect = Element.prototype.getBoundingClientRect;
  beforeAll(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      width: 200,
      height: 100,
      top: 0,
      left: 0,
      right: 200,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    })) as typeof Element.prototype.getBoundingClientRect;
  });
  afterAll(() => {
    Element.prototype.getBoundingClientRect = originalGetRect;
  });

  it("renders without crashing", () => {
    const { container } = render(
      <div style={{ position: "relative" }}>
        <BorderBeam />
      </div>
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it("merges custom className", () => {
    const { container } = render(
      <div style={{ position: "relative" }}>
        <BorderBeam className="my-beam" />
      </div>
    );
    expect(container.querySelector(".my-beam")).not.toBeNull();
  });

  it("generates a unique gradient id per instance via useId", () => {
    const { container } = render(
      <div style={{ position: "relative" }}>
        <BorderBeam />
        <BorderBeam />
      </div>
    );
    const gradients = container.querySelectorAll("linearGradient");
    expect(gradients.length).toBe(2);
    const ids = Array.from(gradients).map((g) => g.getAttribute("id"));
    expect(ids[0]).not.toBe(ids[1]);
    expect(ids[0]).toMatch(/^border-beam-grad-/);
    expect(ids[1]).toMatch(/^border-beam-grad-/);
  });

  it("renders stops with the provided colorFrom and colorTo", () => {
    const { container } = render(
      <div style={{ position: "relative" }}>
        <BorderBeam colorFrom="#ff0000" colorTo="#00ff00" />
      </div>
    );
    const stops = container.querySelectorAll("stop");
    expect(stops.length).toBe(3);
    expect(stops[0].getAttribute("stop-color")).toBe("#ff0000");
    expect(stops[2].getAttribute("stop-color")).toBe("#00ff00");
  });
});
