import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./Input";

describe("Input", () => {
  it("renders a text input by default", () => {
    render(<Input aria-label="name" />);
    const input = screen.getByLabelText("name");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
  });

  it("accepts user typing", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input aria-label="name" onChange={onChange} />);
    const input = screen.getByLabelText("name") as HTMLInputElement;
    await user.type(input, "hi");
    expect(input.value).toBe("hi");
    expect(onChange).toHaveBeenCalled();
  });

  it("marks aria-invalid when error is provided", () => {
    render(<Input aria-label="name" error />);
    const input = screen.getByLabelText("name");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("renders the error message as an alert when error is a string", () => {
    render(<Input id="email" aria-label="email" error="Email is required" />);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Email is required");
  });

  it("disables the input when disabled is true", () => {
    render(<Input aria-label="name" disabled />);
    expect(screen.getByLabelText("name")).toBeDisabled();
  });
});
