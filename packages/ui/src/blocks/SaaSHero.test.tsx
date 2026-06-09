import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SaaSHero } from "./SaaSHero";

describe("SaaSHero", () => {
  it("renders default title", () => {
    render(<SaaSHero />);
    expect(screen.getByRole("heading", { name: /Build beautiful interfaces/i })).toBeInTheDocument();
  });

  it("renders custom title and description", () => {
    render(<SaaSHero title="My SaaS" description="My description here" />);
    expect(screen.getByRole("heading", { name: /My SaaS/i })).toBeInTheDocument();
    expect(screen.getByText("My description here")).toBeInTheDocument();
  });

  it("renders default primary and secondary action buttons", () => {
    render(<SaaSHero />);
    expect(screen.getByRole("button", { name: /Get Started/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Watch Video/i })).toBeInTheDocument();
  });

  it("calls primary action onClick", async () => {
    const user = userEvent.setup();
    let clicked = false;
    render(
      <SaaSHero
        primaryAction={{ label: "Go now", onClick: () => (clicked = true) }}
      />
    );
    await user.click(screen.getByRole("button", { name: /Go now/i }));
    expect(clicked).toBe(true);
  });
});
