import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TreeView } from "./TreeView";

describe("TreeView", () => {
  it("renders a role=tree element", () => {
    render(<TreeView />);
    expect(screen.getByRole("tree")).toBeInTheDocument();
  });

  it("shows expanded default nodes", () => {
    render(<TreeView />);
    expect(screen.getByText("workspace")).toBeInTheDocument();
    expect(screen.getByText("src")).toBeInTheDocument();
  });

  it("selects a node when clicked", async () => {
    const user = userEvent.setup();
    render(<TreeView />);
    const indexNode = screen.getByText("index.ts");
    await user.click(indexNode);
    const item = indexNode.closest('[role="treeitem"]');
    expect(item).toHaveAttribute("aria-selected", "true");
  });

  it("calls onSelect callback", async () => {
    const user = userEvent.setup();
    let selectedId: string | null = null;
    render(<TreeView onSelect={(id) => (selectedId = id)} />);
    await user.click(screen.getByText("package.json"));
    expect(selectedId).toBe("package.json");
  });

  it("collapses a folder when clicked", async () => {
    const user = userEvent.setup();
    render(<TreeView />);
    const folderRow = screen.getByText("src").closest("div");
    if (folderRow) {
      await user.click(folderRow);
    }
    // After collapsing, child should be hidden
    expect(screen.queryByText("index.ts")).not.toBeInTheDocument();
  });
});
