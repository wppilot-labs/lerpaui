import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TrueFocusScope } from "./TrueFocusScope";

const targets = [
  { id: "step-1", title: "Step 1", description: "First" },
  { id: "step-2", title: "Step 2", description: "Second" },
];

describe("TrueFocusScope", () => {
  it("renders children", () => {
    render(
      <TrueFocusScope
        targets={targets}
        activeTargetId={null}
        onTargetChange={() => {}}
      >
        <div data-focus-id="step-1">Element A</div>
        <div data-focus-id="step-2">Element B</div>
      </TrueFocusScope>
    );
    expect(screen.getByText("Element A")).toBeInTheDocument();
    expect(screen.getByText("Element B")).toBeInTheDocument();
  });

  it("does not render guided dialog when activeTargetId is null", () => {
    render(
      <TrueFocusScope
        targets={targets}
        activeTargetId={null}
        onTargetChange={() => {}}
      >
        <div data-focus-id="step-1">Element A</div>
      </TrueFocusScope>
    );
    expect(screen.queryByText(/step 1 of/i)).not.toBeInTheDocument();
  });

  it("renders the guided dialog with the active step indicator", () => {
    render(
      <TrueFocusScope
        targets={targets}
        activeTargetId="step-1"
        onTargetChange={() => {}}
      >
        <div data-focus-id="step-1">Element A</div>
        <div data-focus-id="step-2">Element B</div>
      </TrueFocusScope>
    );
    expect(screen.getByText(/step 1 of 2/i)).toBeInTheDocument();
    expect(screen.getByText("Step 1")).toBeInTheDocument();
    expect(screen.getByText("First")).toBeInTheDocument();
  });

  it("advances to the next target when Next is clicked", async () => {
    const user = userEvent.setup();
    const onTargetChange = vi.fn();
    render(
      <TrueFocusScope
        targets={targets}
        activeTargetId="step-1"
        onTargetChange={onTargetChange}
      >
        <div data-focus-id="step-1">Element A</div>
        <div data-focus-id="step-2">Element B</div>
      </TrueFocusScope>
    );
    await user.click(screen.getByRole("button", { name: /^next$/i }));
    expect(onTargetChange).toHaveBeenCalledWith("step-2");
  });

  it("calls onTargetChange(null) when Finish is clicked on the last step", async () => {
    const user = userEvent.setup();
    const onTargetChange = vi.fn();
    render(
      <TrueFocusScope
        targets={targets}
        activeTargetId="step-2"
        onTargetChange={onTargetChange}
      >
        <div data-focus-id="step-1">Element A</div>
        <div data-focus-id="step-2">Element B</div>
      </TrueFocusScope>
    );
    await user.click(screen.getByRole("button", { name: /finish/i }));
    expect(onTargetChange).toHaveBeenCalledWith(null);
  });

  it("disables Back on the first step", () => {
    render(
      <TrueFocusScope
        targets={targets}
        activeTargetId="step-1"
        onTargetChange={() => {}}
      >
        <div data-focus-id="step-1">Element A</div>
        <div data-focus-id="step-2">Element B</div>
      </TrueFocusScope>
    );
    const backBtn = screen.getByRole("button", { name: /back/i }) as HTMLButtonElement;
    expect(backBtn.disabled).toBe(true);
  });
});
