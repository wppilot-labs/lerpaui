import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CompareMask } from "./CompareMask";

describe("CompareMask", () => {
  it("renders before and after labels", () => {
    render(
      <CompareMask
        before={<div>Before content</div>}
        after={<div>After content</div>}
      />
    );
    expect(screen.getByText("Before")).toBeInTheDocument();
    expect(screen.getByText("After")).toBeInTheDocument();
  });

  it("renders before and after children", () => {
    render(
      <CompareMask
        before={<div>Before content</div>}
        after={<div>After content</div>}
      />
    );
    expect(screen.getByText("Before content")).toBeInTheDocument();
    expect(screen.getByText("After content")).toBeInTheDocument();
  });

  it("supports custom labels", () => {
    render(
      <CompareMask
        before={<span>X</span>}
        after={<span>Y</span>}
        beforeLabel="Old"
        afterLabel="New"
      />
    );
    expect(screen.getByText("Old")).toBeInTheDocument();
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("renders an image element when before is a string URL", () => {
    const { container } = render(
      <CompareMask before="/before.jpg" after={<div>After content</div>} />
    );
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img?.getAttribute("src")).toBe("/before.jpg");
    expect(img?.getAttribute("draggable")).toBe("false");
  });

  it("applies custom className to the root wrapper", () => {
    const { container } = render(
      <CompareMask
        before={<div>b</div>}
        after={<div>a</div>}
        className="my-compare-root"
      />
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("my-compare-root");
  });

  it("uses the supplied aspectRatio class", () => {
    const { container } = render(
      <CompareMask
        before={<div>b</div>}
        after={<div>a</div>}
        aspectRatio="aspect-square"
      />
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("aspect-square");
  });
});
