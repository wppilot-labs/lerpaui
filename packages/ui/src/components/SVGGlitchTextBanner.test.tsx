import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { SVGGlitchTextBanner } from "./SVGGlitchTextBanner";

describe("SVGGlitchTextBanner", () => {
  it("renders default text", () => {
    const { getAllByText } = render(<SVGGlitchTextBanner />);
    expect(getAllByText("GLITCH").length).toBeGreaterThan(0);
  });

  it("renders custom text", () => {
    const { getAllByText } = render(<SVGGlitchTextBanner text="HELLO" />);
    expect(getAllByText("HELLO").length).toBeGreaterThan(0);
  });

  it("accepts custom className", () => {
    const { container } = render(<SVGGlitchTextBanner className="banner-x" />);
    expect((container.firstChild as HTMLElement).className).toContain("banner-x");
  });

  it("renders without crashing with zero slices", () => {
    const { container } = render(<SVGGlitchTextBanner slices={0} />);
    expect(container.firstChild).not.toBeNull();
  });
});
