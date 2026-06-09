import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AlertBanner } from "./AlertBanner";

describe("AlertBanner", () => {
  it("renders with role=alert", () => {
    render(<AlertBanner />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("renders default title and description", () => {
    render(<AlertBanner />);
    expect(screen.getByText(/New API version available/i)).toBeInTheDocument();
  });

  it("renders dismiss button by default", () => {
    render(<AlertBanner />);
    expect(screen.getByLabelText(/dismiss/i)).toBeInTheDocument();
  });

  it("hides after clicking dismiss", async () => {
    const user = userEvent.setup();
    render(<AlertBanner />);
    await user.click(screen.getByLabelText(/dismiss/i));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("calls onAction when action button clicked", async () => {
    const user = userEvent.setup();
    let clicked = false;
    render(<AlertBanner actionLabel="Click me" onAction={() => (clicked = true)} />);
    await user.click(screen.getByRole("button", { name: /click me/i }));
    expect(clicked).toBe(true);
  });

  it("does not render dismiss button when dismissible=false", () => {
    render(<AlertBanner dismissible={false} />);
    expect(screen.queryByLabelText(/dismiss/i)).not.toBeInTheDocument();
  });
});
