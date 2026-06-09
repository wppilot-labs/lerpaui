import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChromaticAberrationHero } from "./ChromaticAberrationHero";

describe("ChromaticAberrationHero", () => {
  it("renders default heading text", () => {
    render(<ChromaticAberrationHero />);
    expect(screen.getByRole("heading", { name: /beyond reality/i })).toBeInTheDocument();
  });

  it("renders custom heading text", () => {
    render(<ChromaticAberrationHero text="Custom Hero" />);
    expect(screen.getByRole("heading", { name: /custom hero/i })).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(<ChromaticAberrationHero subtitle="With a tagline" />);
    expect(screen.getByText("With a tagline")).toBeInTheDocument();
  });

  it("omits subtitle when not provided", () => {
    const { container } = render(<ChromaticAberrationHero />);
    expect(container.querySelector("p")).toBeNull();
  });
});
