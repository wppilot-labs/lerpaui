import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DoubleBorderPricingCard } from "./DoubleBorderPricingCard";

describe("DoubleBorderPricingCard", () => {
  it("renders the default plan name and CTA", () => {
    render(<DoubleBorderPricingCard />);
    expect(screen.getByText(/enterprise suite/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /deploy plan now/i })
    ).toBeInTheDocument();
  });

  it("renders a custom plan name", () => {
    render(<DoubleBorderPricingCard planName="Pro" ctaText="Subscribe" />);
    expect(screen.getByText("Pro")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /subscribe/i })).toBeInTheDocument();
  });

  it("calls onCtaClick when clicked", async () => {
    const user = userEvent.setup();
    const onCtaClick = vi.fn();
    render(
      <DoubleBorderPricingCard ctaText="Buy" onCtaClick={onCtaClick} />
    );
    await user.click(screen.getByRole("button", { name: /buy/i }));
    expect(onCtaClick).toHaveBeenCalledTimes(1);
  });

  it("renders feature list", () => {
    render(<DoubleBorderPricingCard features={["F1", "F2"]} />);
    expect(screen.getByText("F1")).toBeInTheDocument();
    expect(screen.getByText("F2")).toBeInTheDocument();
  });
});
