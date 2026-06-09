import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { TrueChromaticAberration } from "./TrueChromaticAberration";

describe("TrueChromaticAberration", () => {
  it("renders default text", () => {
    const { container } = render(<TrueChromaticAberration />);
    expect(container.textContent).toContain("CHROMATIC");
  });

  it("renders custom text", () => {
    const { container } = render(<TrueChromaticAberration text="HELLO" />);
    expect(container.textContent).toContain("HELLO");
  });

  it("includes SVG filters for color channels", () => {
    const { container } = render(<TrueChromaticAberration />);
    const filters = container.querySelectorAll("filter");
    expect(filters.length).toBeGreaterThanOrEqual(3);
  });

  it("accepts custom className", () => {
    const { container } = render(<TrueChromaticAberration className="cab-x" />);
    expect((container.firstChild as HTMLElement).className).toContain("cab-x");
  });
});
