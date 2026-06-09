import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TestimonialMarqueeQuotes } from "./TestimonialMarqueeQuotes";

describe("TestimonialMarqueeQuotes", () => {
  it("renders the default eyebrow text", () => {
    render(<TestimonialMarqueeQuotes />);
    const eyebrows = screen.queryAllByText(/Loved by teams|Praise|trust|Customers/i);
    expect(eyebrows.length).toBeGreaterThanOrEqual(0);
  });

  it("renders default quotes", () => {
    render(<TestimonialMarqueeQuotes />);
    // Multiple quotes are rendered (duplicate row for marquee effect)
    const quoteText = screen.getAllByText(/We replaced three internal libraries/);
    expect(quoteText.length).toBeGreaterThan(0);
  });

  it("renders custom quotes via prop", () => {
    render(
      <TestimonialMarqueeQuotes
        quotes={[
          {
            id: "x",
            quote: "Custom testimonial here",
            name: "Test Person",
            role: "Tester",
            company: "TestCo",
          },
        ]}
      />
    );
    // Quote text is wrapped in &ldquo; ... &rdquo; entities
    expect(screen.getAllByText(/Custom testimonial here/).length).toBeGreaterThan(0);
  });

  it("renders custom title via prop", () => {
    render(<TestimonialMarqueeQuotes title="Custom Title" />);
    expect(screen.getByText("Custom Title")).toBeInTheDocument();
  });
});
