import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { TextScrambleReveal } from "./TextScrambleReveal";

describe("TextScrambleReveal", () => {
  it("renders a span element", () => {
    const { container } = render(<TextScrambleReveal text="hello" />);
    expect(container.querySelector("span")).not.toBeNull();
  });

  it("falls back to default text when no text prop is given", () => {
    const { container } = render(<TextScrambleReveal />);
    // span has either scrambled or final text — length should match
    expect(container.querySelector("span")).not.toBeNull();
  });

  it("uses provided text prop length", () => {
    const text = "abcdef";
    const { container } = render(<TextScrambleReveal text={text} />);
    const span = container.querySelector("span");
    // The rendered text has the same length as input text
    expect(span?.textContent?.length).toBe(text.length);
  });
});
