import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ChannelGlitchText } from "./ChannelGlitchText";

describe("ChannelGlitchText", () => {
  it("renders default text", () => {
    const { container } = render(<ChannelGlitchText />);
    expect(container.textContent).toContain("SIGNAL_LOST");
  });

  it("renders custom text", () => {
    const { container } = render(<ChannelGlitchText text="ABC" />);
    expect(container.textContent).toContain("ABC");
  });

  it("contains an SVG filter for glitch effect", () => {
    const { container } = render(<ChannelGlitchText />);
    expect(container.querySelector("svg")).not.toBeNull();
    expect(container.querySelector("filter")).not.toBeNull();
  });

  it("accepts custom className", () => {
    const { container } = render(<ChannelGlitchText className="glitch-x" />);
    expect((container.firstChild as HTMLElement).className).toContain("glitch-x");
  });
});
