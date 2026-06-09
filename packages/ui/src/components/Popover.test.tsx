import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Popover, PopoverTrigger, PopoverContent } from "./Popover";

describe("Popover", () => {
  it("renders trigger and hides content by default", () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Body</PopoverContent>
      </Popover>
    );
    expect(screen.getByRole("button", { name: /open/i })).toBeInTheDocument();
    expect(screen.queryByText("Body")).not.toBeInTheDocument();
  });

  it("opens content on click", async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Body content</PopoverContent>
      </Popover>
    );
    await user.click(screen.getByRole("button", { name: /open/i }));
    expect(screen.getByText("Body content")).toBeInTheDocument();
  });

  it("opens when defaultOpen is true", () => {
    render(
      <Popover defaultOpen>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Already open</PopoverContent>
      </Popover>
    );
    expect(screen.getByText("Already open")).toBeInTheDocument();
  });
});
