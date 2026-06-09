import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CommandPalette } from "./CommandPalette";

describe("CommandPalette", () => {
  it("does not render anything when closed", () => {
    render(<CommandPalette open={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders dialog and listbox when open", () => {
    render(<CommandPalette open={true} />);
    expect(screen.getByRole("dialog", { name: /command palette/i })).toBeInTheDocument();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("renders demo commands when open", () => {
    render(<CommandPalette open={true} />);
    expect(screen.getByText(/Create new file/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign out/i)).toBeInTheDocument();
  });

  it("filters commands when typing in the input", async () => {
    const user = userEvent.setup();
    render(<CommandPalette open={true} />);
    const input = screen.getByRole("combobox");
    await user.type(input, "sign");
    expect(screen.getByText(/Sign out/i)).toBeInTheDocument();
    expect(screen.queryByText(/Create new file/i)).not.toBeInTheDocument();
  });

  it("shows no-results message when no commands match", async () => {
    const user = userEvent.setup();
    render(<CommandPalette open={true} />);
    await user.type(screen.getByRole("combobox"), "xyzqwerty");
    expect(screen.getByText(/no results/i)).toBeInTheDocument();
  });
});
