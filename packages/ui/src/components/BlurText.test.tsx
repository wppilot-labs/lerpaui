import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { BlurText } from "./BlurText";

describe("BlurText", () => {
  it("renders all words of the provided text", () => {
    const { container } = render(<BlurText text="hello world" />);
    expect(container.textContent).toContain("hello");
    expect(container.textContent).toContain("world");
  });

  it("renders as a paragraph element", () => {
    const { container } = render(<BlurText text="abc def" />);
    expect(container.querySelector("p")).not.toBeNull();
  });

  it("supports animateBy='letters'", () => {
    const { container } = render(<BlurText text="hi" animateBy="letters" />);
    expect(container.textContent).toContain("h");
    expect(container.textContent).toContain("i");
  });
});
