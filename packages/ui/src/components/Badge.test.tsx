import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("applies default variant classes", () => {
    const { container } = render(<Badge>Default</Badge>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("bg-primary");
  });

  it("supports a destructive variant", () => {
    const { container } = render(<Badge variant="destructive">!</Badge>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("bg-destructive");
  });

  it("merges custom className", () => {
    const { container } = render(<Badge className="my-badge">tag</Badge>);
    expect(container.firstChild).toHaveClass("my-badge");
  });
});
