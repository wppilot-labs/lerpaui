import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { VirtualizedListTable } from "./VirtualizedListTable";

describe("VirtualizedListTable", () => {
  it("renders a grid with row count", () => {
    render(<VirtualizedListTable />);
    const grid = screen.getByRole("grid");
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveAttribute("aria-rowcount", "2000");
  });

  it("renders only a subset of rows (windowed)", () => {
    render(<VirtualizedListTable />);
    const rows = screen.getAllByRole("row");
    // height 360 / itemHeight 36 = 10 visible + overscan 8 = ~18 max
    expect(rows.length).toBeLessThan(50);
  });

  it("accepts custom items and renderRow", () => {
    const items = [{ id: 1, label: "Alpha" }, { id: 2, label: "Bravo" }];
    render(
      <VirtualizedListTable
        items={items}
        renderRow={(item) => <span>{(item as { label: string }).label}</span>}
      />
    );
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Bravo")).toBeInTheDocument();
  });

  it("respects aria-label prop", () => {
    render(<VirtualizedListTable ariaLabel="Custom list" />);
    expect(screen.getByLabelText("Custom list")).toBeInTheDocument();
  });
});
