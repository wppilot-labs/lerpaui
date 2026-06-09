import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ColorPicker } from "./ColorPicker";

describe("ColorPicker", () => {
  it("renders a group with color picker label", () => {
    render(<ColorPicker />);
    expect(screen.getByRole("group", { name: /color picker/i })).toBeInTheDocument();
  });

  it("renders the hex input with initial value", () => {
    render(<ColorPicker value="#22c55e" />);
    expect(screen.getByLabelText(/hex color value/i)).toHaveValue("#22c55e");
  });

  it("renders HSL sliders", () => {
    render(<ColorPicker />);
    expect(screen.getByLabelText(/H channel/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/S channel/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/L channel/i)).toBeInTheDocument();
  });

  it("renders default swatches", () => {
    render(<ColorPicker />);
    const swatches = screen.getAllByRole("option");
    expect(swatches.length).toBeGreaterThanOrEqual(6);
  });

  it("calls onChange when a swatch is clicked", async () => {
    const user = userEvent.setup();
    let last = "";
    render(<ColorPicker onChange={(hex) => (last = hex)} swatches={["#ff0000", "#00ff00"]} />);
    await user.click(screen.getByLabelText(/Swatch #ff0000/i));
    expect(last).toBe("#ff0000");
  });
});
