import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AnimatedGradientBackground } from "./AnimatedGradientBackground";

describe("AnimatedGradientBackground", () => {
  it("renders children inside the container", () => {
    render(
      <AnimatedGradientBackground>
        <div>My content</div>
      </AnimatedGradientBackground>
    );
    expect(screen.getByText("My content")).toBeInTheDocument();
  });

  it("respects minHeight prop", () => {
    const { container } = render(
      <AnimatedGradientBackground minHeight={600}>x</AnimatedGradientBackground>
    );
    const root = container.firstChild as HTMLElement;
    expect(root.style.minHeight).toBe("600px");
  });

  it("accepts string minHeight", () => {
    const { container } = render(
      <AnimatedGradientBackground minHeight="50vh">x</AnimatedGradientBackground>
    );
    const root = container.firstChild as HTMLElement;
    expect(root.style.minHeight).toBe("50vh");
  });

  it("accepts custom className", () => {
    const { container } = render(<AnimatedGradientBackground className="bg-x">x</AnimatedGradientBackground>);
    expect((container.firstChild as HTMLElement).className).toContain("bg-x");
  });
});
