import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Slider } from "./Slider";

describe("Slider", () => {
  it("renders a slider with a single thumb", () => {
    render(<Slider value={[40]} max={100} step={1} aria-label="volume" />);
    const slider = screen.getByRole("slider");
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute("aria-valuenow", "40");
  });

  it("respects max bound", () => {
    render(<Slider value={[75]} max={100} step={1} aria-label="volume" />);
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuemax", "100");
  });

  it("supports range with two thumbs", () => {
    render(<Slider value={[20, 80]} max={100} step={1} />);
    const sliders = screen.getAllByRole("slider");
    expect(sliders).toHaveLength(2);
  });

  it("can be disabled", () => {
    render(<Slider value={[10]} max={100} aria-label="volume" disabled />);
    expect(screen.getByRole("slider")).toHaveAttribute("data-disabled");
  });
});
