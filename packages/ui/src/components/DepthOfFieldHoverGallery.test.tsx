import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { DepthOfFieldHoverGallery } from "./DepthOfFieldHoverGallery";

describe("DepthOfFieldHoverGallery", () => {
  it("renders default items as buttons", () => {
    const { container } = render(<DepthOfFieldHoverGallery />);
    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBe(9); // defaultItems length = 9
  });

  it("renders custom items", () => {
    const { container } = render(
      <DepthOfFieldHoverGallery items={[{ label: "Item 1" }, { label: "Item 2" }, { label: "Item 3" }]} />
    );
    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBe(3);
  });

  it("applies custom className", () => {
    const { container } = render(<DepthOfFieldHoverGallery className="gallery-x" />);
    expect((container.firstChild as HTMLElement).className).toContain("gallery-x");
  });

  it("uses given columns count via grid template", () => {
    const { container } = render(<DepthOfFieldHoverGallery columns={4} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.gridTemplateColumns).toContain("4");
  });
});
