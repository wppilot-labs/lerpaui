import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Switch } from "./Switch";

describe("Switch accessibility", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<Switch aria-label="Airplane mode" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when checked", async () => {
    const { container } = render(<Switch checked aria-label="Airplane mode" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when disabled", async () => {
    const { container } = render(<Switch disabled aria-label="Airplane mode" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
