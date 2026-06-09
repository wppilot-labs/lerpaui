import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PricingTableMatrix } from "./PricingTableMatrix";

describe("PricingTableMatrix", () => {
  it("renders default title and description", () => {
    render(<PricingTableMatrix />);
    expect(screen.getByText(/One price card/i)).toBeInTheDocument();
  });

  it("renders default tiers", () => {
    render(<PricingTableMatrix />);
    expect(screen.getAllByText("Starter").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Team").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Scale").length).toBeGreaterThan(0);
  });

  it("renders price values", () => {
    render(<PricingTableMatrix />);
    expect(screen.getAllByText("$0").length).toBeGreaterThan(0);
    expect(screen.getAllByText("$29").length).toBeGreaterThan(0);
    expect(screen.getAllByText("$79").length).toBeGreaterThan(0);
  });

  it("renders custom title via prop", () => {
    render(<PricingTableMatrix title="My pricing table" />);
    expect(screen.getByText("My pricing table")).toBeInTheDocument();
  });
});
