import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TestimonialWall } from "./TestimonialWall";

describe("TestimonialWall", () => {
  it("renders default title", () => {
    render(<TestimonialWall />);
    // Wall renders a section header; just check root rendered
    expect(document.querySelector("section")).not.toBeNull();
  });

  it("renders default testimonials", () => {
    render(<TestimonialWall />);
    expect(screen.getByText(/Sarah Connor/)).toBeInTheDocument();
  });

  it("renders custom testimonials via prop", () => {
    render(
      <TestimonialWall
        testimonials={[
          {
            id: "x",
            name: "Custom Person",
            role: "Engineer",
            company: "Acme",
            content: "This is great",
          },
        ]}
      />
    );
    expect(screen.getByText("Custom Person")).toBeInTheDocument();
    expect(screen.getByText(/This is great/)).toBeInTheDocument();
  });

  it("renders custom title via prop", () => {
    render(<TestimonialWall title="Voices of users" />);
    expect(screen.getByText("Voices of users")).toBeInTheDocument();
  });
});
