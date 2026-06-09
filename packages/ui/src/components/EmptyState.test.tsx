import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders title and description", () => {
    render(<EmptyState title="Nothing here" description="Add an item" />);
    expect(
      screen.getByRole("heading", { name: /nothing here/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Add an item")).toBeInTheDocument();
  });

  it("does not render a button when no action is provided", () => {
    render(<EmptyState title="t" description="d" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("calls onActionClick when primary action is clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <EmptyState
        title="t"
        description="d"
        actionLabel="Add"
        onActionClick={onClick}
      />
    );
    await user.click(screen.getByRole("button", { name: /add/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders both primary and secondary actions", () => {
    render(
      <EmptyState
        title="t"
        description="d"
        actionLabel="Primary"
        onActionClick={() => {}}
        secondaryActionLabel="Secondary"
        onSecondaryActionClick={() => {}}
      />
    );
    expect(screen.getByRole("button", { name: /primary/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /secondary/i })).toBeInTheDocument();
  });
});
