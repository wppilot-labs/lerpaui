import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuroraBackground } from "./AuroraBackground";

describe("AuroraBackground", () => {
  it("renders children", () => {
    render(
      <AuroraBackground>
        <span>aurora child</span>
      </AuroraBackground>
    );
    expect(screen.getByText("aurora child")).toBeInTheDocument();
  });

  it("renders as a main landmark", () => {
    render(
      <AuroraBackground>
        <span>x</span>
      </AuroraBackground>
    );
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("respects showRadialGradient={false}", () => {
    const { container } = render(
      <AuroraBackground showRadialGradient={false}>
        <span>x</span>
      </AuroraBackground>
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders the radial gradient overlay when showRadialGradient is true (default)", () => {
    const { container } = render(
      <AuroraBackground>
        <span>x</span>
      </AuroraBackground>
    );
    const overlay = container.querySelector(".z-10");
    expect(overlay).not.toBeNull();
    expect((overlay as HTMLElement)?.style.background).toContain("radial-gradient");
  });

  it("omits the radial gradient overlay when showRadialGradient is false", () => {
    const { container } = render(
      <AuroraBackground showRadialGradient={false}>
        <span>x</span>
      </AuroraBackground>
    );
    const overlays = container.querySelectorAll(".z-10");
    const hasRadial = Array.from(overlays).some((el) =>
      (el as HTMLElement).style.background?.includes("radial-gradient")
    );
    expect(hasRadial).toBe(false);
  });

  it("applies extra className to the content wrapper", () => {
    const { container } = render(
      <AuroraBackground className="my-aurora-wrap">
        <span>x</span>
      </AuroraBackground>
    );
    expect(container.querySelector(".my-aurora-wrap")).not.toBeNull();
  });
});
