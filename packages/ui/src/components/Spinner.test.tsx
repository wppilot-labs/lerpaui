import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("renders with role status", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("provides a default loading label for screen readers", () => {
    render(<Spinner />);
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("supports a custom label", () => {
    render(<Spinner label="Fetching data" />);
    expect(screen.getByText("Fetching data")).toBeInTheDocument();
  });

  it("applies size variant classes", () => {
    const { container } = render(<Spinner size="lg" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("h-8");
  });

  it("applies xs size variant class", () => {
    const { container } = render(<Spinner size="xs" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("h-3");
    expect(el.className).toContain("w-3");
  });

  it("sets aria-live polite for assistive tech", () => {
    render(<Spinner />);
    const el = screen.getByRole("status");
    expect(el.getAttribute("aria-live")).toBe("polite");
  });

  it("hides the label visually with sr-only", () => {
    const { container } = render(<Spinner label="Working" />);
    const labelEl = container.querySelector(".sr-only");
    expect(labelEl).not.toBeNull();
    expect(labelEl?.textContent).toBe("Working");
  });
});
