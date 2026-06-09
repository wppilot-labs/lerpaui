import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { KanbanBoard, type KanbanColumn } from "./KanbanBoard";

describe("KanbanBoard", () => {
  it("renders default demo columns", () => {
    render(<KanbanBoard />);
    expect(screen.getByLabelText(/kanban board/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /to do/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /in progress/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /done/i })).toBeInTheDocument();
  });

  it("renders cards within columns", () => {
    render(<KanbanBoard />);
    expect(screen.getByText(/Spec dashboard primitives/)).toBeInTheDocument();
    expect(screen.getByText(/Audit a11y rules/)).toBeInTheDocument();
  });

  it("renders custom columns via props", () => {
    const columns: KanbanColumn[] = [
      {
        id: "x",
        title: "Backlog",
        cards: [{ id: "x1", title: "Custom card" }],
      },
    ];
    render(<KanbanBoard columns={columns} />);
    expect(screen.getByRole("heading", { name: /backlog/i })).toBeInTheDocument();
    expect(screen.getByText(/Custom card/)).toBeInTheDocument();
  });

  it("shows tag chip when provided", () => {
    render(<KanbanBoard />);
    const tags = screen.getAllByText(/design/i);
    expect(tags.length).toBeGreaterThan(0);
  });
});
