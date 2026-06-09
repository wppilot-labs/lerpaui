import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Container } from "./Container";

describe("Container", () => {
  it("renders children", () => {
    render(
      <Container>
        <span>Hello world</span>
      </Container>
    );
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("applies default container classes when not clean", () => {
    const { container } = render(<Container>x</Container>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("max-w-7xl");
  });

  it("omits default classes when clean is true", () => {
    const { container } = render(<Container clean>x</Container>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).not.toContain("max-w-7xl");
  });

  it("uses custom element via 'as' prop", () => {
    const { container } = render(<Container as="section">x</Container>);
    expect(container.firstChild?.nodeName).toBe("SECTION");
  });

  it("forwards extra className", () => {
    const { container } = render(<Container className="extra-class">x</Container>);
    expect((container.firstChild as HTMLElement).className).toContain("extra-class");
  });
});
