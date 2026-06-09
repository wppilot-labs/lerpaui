import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SplitterPane } from "./SplitterPane";

describe("SplitterPane", () => {
  it("renders both panes", () => {
    render(
      <SplitterPane>
        <div>Left pane</div>
        <div>Right pane</div>
      </SplitterPane>
    );
    expect(screen.getByText("Left pane")).toBeInTheDocument();
    expect(screen.getByText("Right pane")).toBeInTheDocument();
  });

  it("renders a slider with default ratio aria-valuenow=50", () => {
    render(
      <SplitterPane>
        <div>L</div>
        <div>R</div>
      </SplitterPane>
    );
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-valuenow", "50");
  });

  it("uses defaultRatio prop", () => {
    render(
      <SplitterPane defaultRatio={0.3}>
        <div>L</div>
        <div>R</div>
      </SplitterPane>
    );
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "30");
  });

  it("sets aria-orientation based on direction", () => {
    render(
      <SplitterPane direction="vertical">
        <div>Top</div>
        <div>Bottom</div>
      </SplitterPane>
    );
    expect(screen.getByRole("slider")).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("uses custom ariaLabel", () => {
    render(
      <SplitterPane ariaLabel="Drag to resize panes">
        <div>L</div>
        <div>R</div>
      </SplitterPane>
    );
    expect(screen.getByLabelText("Drag to resize panes")).toBeInTheDocument();
  });
});
