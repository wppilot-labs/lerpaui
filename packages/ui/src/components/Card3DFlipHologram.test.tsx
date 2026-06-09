import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Card3DFlipHologram } from "./Card3DFlipHologram";

describe("Card3DFlipHologram", () => {
  it("renders without crashing", () => {
    const { container } = render(<Card3DFlipHologram />);
    expect(container.firstChild).not.toBeNull();
  });

  it("renders front and back nodes", () => {
    const { getByText } = render(
      <Card3DFlipHologram front={<div>FRONT</div>} back={<div>BACK</div>} />
    );
    expect(getByText("FRONT")).toBeInTheDocument();
    expect(getByText("BACK")).toBeInTheDocument();
  });

  it("accepts a custom className", () => {
    const { container } = render(<Card3DFlipHologram className="my-card" />);
    expect((container.firstChild as HTMLElement).className).toContain("my-card");
  });

  it("respects width and height props", () => {
    const { container } = render(<Card3DFlipHologram width={400} height={500} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe("400px");
    expect(el.style.height).toBe("500px");
  });
});
