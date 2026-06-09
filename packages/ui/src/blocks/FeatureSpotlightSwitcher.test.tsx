import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FeatureSpotlightSwitcher } from "./FeatureSpotlightSwitcher";

describe("FeatureSpotlightSwitcher", () => {
  it("renders default tabs", () => {
    render(<FeatureSpotlightSwitcher />);
    expect(screen.getByRole("tab", { name: /compose/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /motion/i })).toBeInTheDocument();
  });

  it("renders first tab as selected by default", () => {
    render(<FeatureSpotlightSwitcher />);
    expect(screen.getByRole("tab", { name: /compose/i, selected: true })).toBeInTheDocument();
  });

  it("switches active tab when clicked", async () => {
    const user = userEvent.setup();
    render(<FeatureSpotlightSwitcher />);
    await user.click(screen.getByRole("tab", { name: /motion/i }));
    expect(screen.getByRole("tab", { name: /motion/i, selected: true })).toBeInTheDocument();
  });

  it("uses defaultId prop for initial active tab", () => {
    render(<FeatureSpotlightSwitcher defaultId="motion" />);
    expect(screen.getByRole("tab", { name: /motion/i, selected: true })).toBeInTheDocument();
  });
});
