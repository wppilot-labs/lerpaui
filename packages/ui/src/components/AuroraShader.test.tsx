import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { AuroraShader } from "./AuroraShader";

describe("AuroraShader", () => {
  it("renders without throwing", () => {
    // In jsdom WebGL is unavailable so ShaderCanvas returns null when there's no fallback.
    // We just check that render doesn't throw.
    expect(() => render(<AuroraShader />)).not.toThrow();
  });

  it("renders without throwing with custom className", () => {
    expect(() => render(<AuroraShader className="aurora-x" />)).not.toThrow();
  });

  it("unmounts cleanly", () => {
    const { unmount } = render(<AuroraShader />);
    expect(() => unmount()).not.toThrow();
  });
});
