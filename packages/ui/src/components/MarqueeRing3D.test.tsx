import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MarqueeRing3D } from "./MarqueeRing3D";

describe("MarqueeRing3D", () => {
  it("renders default text characters", () => {
    const { container } = render(<MarqueeRing3D />);
    expect(container.firstChild).not.toBeNull();
    expect(container.textContent).toContain("L");
    expect(container.textContent).toContain("U");
    expect(container.textContent).toContain("I");
  });

  it("renders custom text", () => {
    const { container } = render(<MarqueeRing3D text="ABC " />);
    expect(container.textContent).toContain("A");
    expect(container.textContent).toContain("B");
    expect(container.textContent).toContain("C");
  });

  it("accepts custom className", () => {
    const { container } = render(<MarqueeRing3D className="ring-x" />);
    expect((container.firstChild as HTMLElement).className).toContain("ring-x");
  });

  it("respects custom radius and fontSize", () => {
    const { container } = render(<MarqueeRing3D radius={100} fontSize={20} />);
    expect(container.firstChild).not.toBeNull();
  });
});
