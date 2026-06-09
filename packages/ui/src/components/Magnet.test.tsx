import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Magnet } from "./Magnet";

describe("Magnet", () => {
  it("renders children", () => {
    render(
      <Magnet>
        <button>Magnet target</button>
      </Magnet>
    );
    expect(
      screen.getByRole("button", { name: /magnet target/i })
    ).toBeInTheDocument();
  });

  it("merges custom className", () => {
    const { container } = render(
      <Magnet className="my-magnet">
        <span>x</span>
      </Magnet>
    );
    expect(container.firstChild).toHaveClass("my-magnet");
  });

  it("renders children even when active is false", () => {
    render(
      <Magnet active={false}>
        <span>inactive</span>
      </Magnet>
    );
    expect(screen.getByText("inactive")).toBeInTheDocument();
  });
});
