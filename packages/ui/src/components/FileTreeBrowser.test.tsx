import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FileTreeBrowser } from "./FileTreeBrowser";

describe("FileTreeBrowser", () => {
  it("renders a role=tree element with accessible label", () => {
    render(<FileTreeBrowser />);
    expect(screen.getByRole("tree", { name: /file browser/i })).toBeInTheDocument();
  });

  it("renders default expanded folders' children", () => {
    render(<FileTreeBrowser />);
    expect(screen.getByText("project")).toBeInTheDocument();
    expect(screen.getByText("src")).toBeInTheDocument();
    expect(screen.getByText("app.tsx")).toBeInTheDocument();
  });

  it("calls onOpen when a file is clicked", async () => {
    const user = userEvent.setup();
    let opened: string | null = null;
    render(<FileTreeBrowser onOpen={(node) => (opened = node.id)} />);
    await user.click(screen.getByText("app.tsx"));
    expect(opened).toBe("app.tsx");
  });

  it("displays file size when present", () => {
    render(<FileTreeBrowser />);
    expect(screen.getByText("4.2 KB")).toBeInTheDocument();
  });
});
