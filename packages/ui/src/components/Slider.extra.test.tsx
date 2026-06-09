import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Slider } from "./Slider";

describe("Slider edge cases", () => {
  it("respects custom min value", () => {
    render(<Slider value={[10]} min={5} max={50} aria-label="vol" />);
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuemin", "5");
  });

  it("increments value when user presses ArrowRight on focused thumb", async () => {
    const user = userEvent.setup();
    let last = 0;
    function Wrapper() {
      const [val, setVal] = React.useState([10]);
      return (
        <Slider
          value={val}
          max={100}
          step={1}
          aria-label="vol"
          onValueChange={(v) => {
            setVal(v);
            last = v[0];
          }}
        />
      );
    }
    render(<Wrapper />);
    const slider = screen.getByRole("slider");
    slider.focus();
    await user.keyboard("{ArrowRight}");
    expect(last).toBeGreaterThan(10);
  });

  it("handles range with three thumbs", () => {
    render(<Slider value={[10, 50, 90]} max={100} step={1} />);
    expect(screen.getAllByRole("slider")).toHaveLength(3);
  });

  it("renders with custom step prop", () => {
    render(<Slider value={[50]} max={100} step={5} aria-label="vol" />);
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "50");
  });
});
