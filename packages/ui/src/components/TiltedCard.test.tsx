import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TiltedCard } from "./TiltedCard";

describe("TiltedCard", () => {
  it("renders children", () => {
    render(
      <TiltedCard>
        <span>tilted child</span>
      </TiltedCard>
    );
    expect(screen.getByText("tilted child")).toBeInTheDocument();
  });

  it("merges custom className", () => {
    const { container } = render(
      <TiltedCard className="my-tilted">
        <span>x</span>
      </TiltedCard>
    );
    // The className is applied to the inner motion div, search anywhere
    expect(container.querySelector(".my-tilted")).not.toBeNull();
  });

  it("can disable the glare", () => {
    render(
      <TiltedCard showGlare={false}>
        <span>no-glare</span>
      </TiltedCard>
    );
    expect(screen.getByText("no-glare")).toBeInTheDocument();
  });

  it("applies the perspective transform on the outer wrapper", () => {
    const { container } = render(
      <TiltedCard perspective={1500}>
        <span>x</span>
      </TiltedCard>
    );
    const outer = container.firstChild as HTMLElement;
    // jsdom retains the inline style we set
    expect(outer.style.perspective).toBe("1500px");
  });

  it("does not render the glare overlay when showGlare is false", () => {
    const { container } = render(
      <TiltedCard showGlare={false}>
        <span>x</span>
      </TiltedCard>
    );
    const overlay = container.querySelector(".pointer-events-none.z-20");
    expect(overlay).toBeNull();
  });

  it("renders the glare overlay by default", () => {
    const { container } = render(
      <TiltedCard>
        <span>x</span>
      </TiltedCard>
    );
    const overlay = container.querySelector(".pointer-events-none.z-20");
    expect(overlay).not.toBeNull();
  });
});
