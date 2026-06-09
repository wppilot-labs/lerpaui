import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CtaWaitlistGlow } from "./CtaWaitlistGlow";

describe("CtaWaitlistGlow", () => {
  it("renders default heading", () => {
    render(<CtaWaitlistGlow />);
    expect(screen.getByText(/Be first when we open/i)).toBeInTheDocument();
  });

  it("renders an email input field", () => {
    render(<CtaWaitlistGlow />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders submit button with default label", () => {
    render(<CtaWaitlistGlow />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("calls onSubmit when a valid email is submitted", async () => {
    const user = userEvent.setup();
    let received = "";
    render(<CtaWaitlistGlow onSubmit={(email) => { received = email; }} />);
    await user.type(screen.getByRole("textbox"), "test@example.com");
    await user.click(screen.getByRole("button"));
    expect(received).toBe("test@example.com");
  });
});
