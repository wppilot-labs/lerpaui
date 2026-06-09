import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("renders with role status", () => {
    render(<Skeleton data-testid="sk" />);
    expect(screen.getByTestId("sk")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("exposes aria-busy true", () => {
    render(<Skeleton data-testid="sk" />);
    expect(screen.getByTestId("sk")).toHaveAttribute("aria-busy", "true");
  });

  it("merges custom className", () => {
    render(<Skeleton data-testid="sk" className="my-skeleton" />);
    expect(screen.getByTestId("sk")).toHaveClass("my-skeleton");
  });
});
