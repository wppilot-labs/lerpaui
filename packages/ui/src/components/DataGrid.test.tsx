import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataGrid } from "./DataGrid";

describe("DataGrid", () => {
  it("renders demo data in a grid", () => {
    render(<DataGrid />);
    expect(screen.getByRole("grid")).toBeInTheDocument();
    expect(screen.getByText(/Ada Lovelace/)).toBeInTheDocument();
  });

  it("filters rows when typing in the filter input", async () => {
    const user = userEvent.setup();
    render(<DataGrid />);
    const filter = screen.getByLabelText(/filter rows/i);
    await user.type(filter, "Linus");
    expect(screen.getByText(/Linus Torvalds/)).toBeInTheDocument();
    expect(screen.queryByText(/Ada Lovelace/)).not.toBeInTheDocument();
  });

  it("toggles sort direction when clicking a sortable column header", async () => {
    const user = userEvent.setup();
    render(<DataGrid />);
    const nameHeaderBtn = screen.getByRole("button", { name: /name/i });
    await user.click(nameHeaderBtn);
    const headers = screen.getAllByRole("columnheader");
    expect(headers[0]).toHaveAttribute("aria-sort", "ascending");
  });

  it("shows empty label when no rows match", async () => {
    const user = userEvent.setup();
    render(<DataGrid emptyLabel="Nothing matches" />);
    await user.type(screen.getByLabelText(/filter rows/i), "ZZZZZZZ-no-match");
    expect(screen.getByText(/Nothing matches/)).toBeInTheDocument();
  });

  it("shows page indicator", () => {
    render(<DataGrid />);
    expect(screen.getByText(/Page 1 of/)).toBeInTheDocument();
  });
});
