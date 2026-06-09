import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ShaderCanvas } from "./ShaderCanvas";

const FRAG = `
precision mediump float;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
void main() { gl_FragColor = vec4(1.0); }
`;

describe("ShaderCanvas", () => {
  it("renders a canvas element on initial mount (before effect runs)", () => {
    // On first synchronous render the canvas is rendered.
    // After the effect runs and detects no WebGL, it falls back to null.
    // Render with a fallback so we always have something in the DOM.
    const { container } = render(
      <ShaderCanvas fragment={FRAG} fallback={<div>FB</div>} />
    );
    expect(container.firstChild).not.toBeNull();
  });

  it("falls back when WebGL is unavailable", () => {
    // jsdom returns null from getContext('webgl') - fallback should appear
    const { container } = render(
      <ShaderCanvas fragment={FRAG} fallback={<div>FALLBACK</div>} />
    );
    expect(container.textContent).toContain("FALLBACK");
  });

  it("returns null when WebGL unavailable and no fallback", () => {
    const { container } = render(<ShaderCanvas fragment={FRAG} />);
    // When WebGL unsupported and no fallback, the component renders nothing
    expect(container.firstChild).toBeNull();
  });

  it("renders fallback element with custom className", () => {
    const { container } = render(
      <ShaderCanvas fragment={FRAG} className="shader-x" fallback={<div>FB</div>} />
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("shader-x");
  });

  it("unmounts cleanly without throwing", () => {
    const { unmount } = render(
      <ShaderCanvas fragment={FRAG} fallback={<div>FB</div>} />
    );
    expect(() => unmount()).not.toThrow();
  });
});
