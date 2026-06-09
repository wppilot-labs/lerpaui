import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MultiStepWizard } from "./MultiStepWizard";

describe("MultiStepWizard", () => {
  it("renders region with wizard label", () => {
    render(<MultiStepWizard />);
    expect(screen.getByRole("region", { name: /multi-step wizard/i })).toBeInTheDocument();
  });

  it("starts on the first step", () => {
    render(<MultiStepWizard />);
    expect(screen.getByText(/Step 1 of/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^profile$/i })).toBeInTheDocument();
  });

  it("advances to next step when Next button clicked", async () => {
    const user = userEvent.setup();
    render(<MultiStepWizard />);
    await user.click(screen.getByRole("button", { name: /^next$/i }));
    expect(screen.getByText(/Step 2 of/)).toBeInTheDocument();
  });

  it("goes back when Back button is clicked", async () => {
    const user = userEvent.setup();
    render(<MultiStepWizard />);
    await user.click(screen.getByRole("button", { name: /^next$/i }));
    await user.click(screen.getByRole("button", { name: /^back$/i }));
    expect(screen.getByText(/Step 1 of/)).toBeInTheDocument();
  });

  it("calls onFinish when finishing the last step", async () => {
    const user = userEvent.setup();
    let finished = false;
    render(<MultiStepWizard onFinish={() => (finished = true)} />);
    // Click next 3 times to reach the last step (4 default steps)
    await user.click(screen.getByRole("button", { name: /^next$/i }));
    await user.click(screen.getByRole("button", { name: /^next$/i }));
    await user.click(screen.getByRole("button", { name: /^next$/i }));
    await user.click(screen.getByRole("button", { name: /^finish$/i }));
    expect(finished).toBe(true);
  });

  it("calls onCancel when canceling at first step", async () => {
    const user = userEvent.setup();
    let canceled = false;
    render(<MultiStepWizard onCancel={() => (canceled = true)} />);
    await user.click(screen.getByRole("button", { name: /^cancel$/i }));
    expect(canceled).toBe(true);
  });
});
