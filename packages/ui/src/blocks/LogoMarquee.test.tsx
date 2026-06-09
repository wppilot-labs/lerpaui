import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LogoMarquee } from "./LogoMarquee";

describe("LogoMarquee", () => {
  it("renders default logos", () => {
    render(<LogoMarquee />);
    // Logos are duplicated 4 times for marquee effect
    expect(screen.getAllByText("SKYNET").length).toBeGreaterThan(0);
    expect(screen.getAllByText("STARK").length).toBeGreaterThan(0);
  });

  it("renders custom logos", () => {
    render(
      <LogoMarquee
        logos={[
          { name: "Acme", logo: <span>ACME</span> },
          { name: "Foo", logo: <span>FOO</span> },
        ]}
      />
    );
    expect(screen.getAllByText("ACME").length).toBeGreaterThan(0);
    expect(screen.getAllByText("FOO").length).toBeGreaterThan(0);
  });

  it("falls back to defaults when logos is empty", () => {
    render(<LogoMarquee logos={[]} />);
    expect(screen.getAllByText("SKYNET").length).toBeGreaterThan(0);
  });

  it("accepts custom className", () => {
    const { container } = render(<LogoMarquee className="logo-x" />);
    expect((container.firstChild as HTMLElement).className).toContain("logo-x");
  });
});
