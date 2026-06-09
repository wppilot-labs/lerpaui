import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "./Tooltip";

describe("Tooltip", () => {
  it("renders the trigger", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Helpful text</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });

  it("does not display content by default", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Hidden by default</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    expect(screen.queryByText("Hidden by default")).not.toBeInTheDocument();
  });

  it("shows content when defaultOpen is true", () => {
    render(
      <TooltipProvider>
        <Tooltip defaultOpen>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Shown</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    expect(screen.getAllByText("Shown").length).toBeGreaterThan(0);
  });

  it("shows tooltip content on trigger focus", async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>Focus me</TooltipTrigger>
          <TooltipContent>Focus revealed</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    expect(screen.queryByText("Focus revealed")).not.toBeInTheDocument();
    await user.tab();
    expect(screen.getByRole("button", { name: /focus me/i })).toHaveFocus();
    expect(screen.getAllByText("Focus revealed").length).toBeGreaterThan(0);
  });

  it("hides tooltip content when trigger loses focus", async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>Focus me</TooltipTrigger>
          <TooltipContent>Focus revealed</TooltipContent>
        </Tooltip>
        <button>elsewhere</button>
      </TooltipProvider>
    );
    await user.tab();
    expect(screen.getAllByText("Focus revealed").length).toBeGreaterThan(0);
    await user.tab();
    expect(screen.queryByText("Focus revealed")).not.toBeInTheDocument();
  });

  it("forwards a custom className to the tooltip content", () => {
    render(
      <TooltipProvider>
        <Tooltip defaultOpen>
          <TooltipTrigger>t</TooltipTrigger>
          <TooltipContent className="my-tooltip">Body</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    const bodies = screen.getAllByText("Body");
    const styled = bodies.find((el) => el.className.includes("my-tooltip"));
    expect(styled).toBeDefined();
  });
});
