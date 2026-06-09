import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BreadcrumbDropdown } from "./BreadcrumbDropdown";

describe("BreadcrumbDropdown", () => {
  it("renders nav with breadcrumb label", () => {
    render(<BreadcrumbDropdown />);
    expect(screen.getByRole("navigation", { name: /breadcrumb/i })).toBeInTheDocument();
  });

  it("renders demo segments", () => {
    render(<BreadcrumbDropdown />);
    expect(screen.getByText("Workspace")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("opens menu when chevron button is clicked", async () => {
    const user = userEvent.setup();
    render(<BreadcrumbDropdown />);
    const triggers = screen.getAllByRole("button", { name: /switch/i });
    await user.click(triggers[0]);
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("shows sibling menu items when opened", async () => {
    const user = userEvent.setup();
    render(<BreadcrumbDropdown />);
    const triggers = screen.getAllByRole("button", { name: /switch workspace/i });
    await user.click(triggers[0]);
    expect(screen.getByRole("menuitem", { name: /personal/i })).toBeInTheDocument();
  });
});
