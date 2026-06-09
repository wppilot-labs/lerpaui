import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CtaBookDemoEmbed } from "./CtaBookDemoEmbed";

describe("CtaBookDemoEmbed", () => {
  it("renders default title", () => {
    render(<CtaBookDemoEmbed />);
    // Just check that the section is rendered with some text content
    const root = screen.getByText(/Book a/i);
    expect(root).toBeInTheDocument();
  });

  it("renders custom title via prop", () => {
    render(<CtaBookDemoEmbed title="Schedule your call today" />);
    expect(screen.getByText("Schedule your call today")).toBeInTheDocument();
  });

  it("renders default bullets", () => {
    render(<CtaBookDemoEmbed />);
    expect(screen.getByText(/30-minute live walkthrough/)).toBeInTheDocument();
  });

  it("renders the host name and duration", () => {
    render(<CtaBookDemoEmbed />);
    expect(screen.getAllByText(/Mara Choi/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/30 min/i).length).toBeGreaterThan(0);
  });
});
