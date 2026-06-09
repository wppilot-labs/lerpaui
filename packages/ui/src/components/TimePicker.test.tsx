import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TimePicker } from "./TimePicker";

describe("TimePicker", () => {
  it("renders a group with default ariaLabel", () => {
    render(<TimePicker />);
    expect(screen.getByRole("group", { name: /time picker/i })).toBeInTheDocument();
  });

  it("renders Hour and Minute inputs", () => {
    render(<TimePicker />);
    expect(screen.getByLabelText(/^hour$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^minute$/i)).toBeInTheDocument();
  });

  it("shows AM/PM toggle in 12h mode only", () => {
    const { rerender } = render(<TimePicker mode="24h" />);
    expect(screen.queryByText(/^AM$|^PM$/)).not.toBeInTheDocument();
    rerender(<TimePicker mode="12h" />);
    expect(screen.getByLabelText(/Period, current/i)).toBeInTheDocument();
  });

  it("calls onChange when hour is incremented", async () => {
    const user = userEvent.setup();
    let last = "";
    render(<TimePicker value="09:00" mode="24h" onChange={(v) => (last = v)} />);
    await user.click(screen.getByLabelText(/increase hour/i));
    expect(last).toBe("10:00");
  });

  it("calls onChange when minute is decremented", async () => {
    const user = userEvent.setup();
    let last = "";
    render(<TimePicker value="09:30" mode="24h" onChange={(v) => (last = v)} />);
    await user.click(screen.getByLabelText(/decrease minute/i));
    expect(last).toBe("09:29");
  });
});
