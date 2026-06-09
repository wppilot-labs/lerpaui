import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ScrollReveal } from "./ScrollReveal";

describe("ScrollReveal", () => {
  it("renders provided text by words", () => {
    const { container } = render(<ScrollReveal text="alpha beta gamma" />);
    expect(container.textContent).toContain("alpha");
    expect(container.textContent).toContain("beta");
    expect(container.textContent).toContain("gamma");
  });

  it("renders provided text by letters when splitBy='letters'", () => {
    const { container } = render(<ScrollReveal text="hey" splitBy="letters" />);
    expect(container.textContent).toContain("h");
    expect(container.textContent).toContain("e");
    expect(container.textContent).toContain("y");
  });

  it("merges custom className", () => {
    const { container } = render(
      <ScrollReveal text="x" className="my-reveal" />
    );
    expect(container.firstChild).toHaveClass("my-reveal");
  });
});
