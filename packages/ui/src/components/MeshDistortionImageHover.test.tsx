import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MeshDistortionImageHover } from "./MeshDistortionImageHover";

describe("MeshDistortionImageHover", () => {
  it("renders an img element with provided src", () => {
    const { container } = render(<MeshDistortionImageHover src="/test.jpg" alt="Test image" />);
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute("src", "/test.jpg");
    expect(img).toHaveAttribute("alt", "Test image");
  });

  it("includes an SVG filter for distortion", () => {
    const { container } = render(<MeshDistortionImageHover src="/test.jpg" />);
    expect(container.querySelector("svg")).not.toBeNull();
    expect(container.querySelector("filter")).not.toBeNull();
  });

  it("accepts custom className", () => {
    const { container } = render(<MeshDistortionImageHover src="/x.jpg" className="my-mesh" />);
    expect((container.firstChild as HTMLElement).className).toContain("my-mesh");
  });

  it("applies width and height", () => {
    const { container } = render(<MeshDistortionImageHover src="/x.jpg" width={500} height={300} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe("500px");
    expect(el.style.height).toBe("300px");
  });
});
