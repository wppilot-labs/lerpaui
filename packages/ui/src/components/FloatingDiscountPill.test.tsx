import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { FloatingDiscountPill } from "./FloatingDiscountPill";

describe("FloatingDiscountPill", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("is hidden initially before its appearance timer fires", () => {
    render(<FloatingDiscountPill discountCode="ABC" />);
    expect(screen.queryByText("ABC")).not.toBeInTheDocument();
  });

  it("renders the discount code after the timer elapses", () => {
    render(<FloatingDiscountPill discountCode="ABC" />);
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(screen.getByText("ABC")).toBeInTheDocument();
  });

  it("renders the percentage value", () => {
    render(<FloatingDiscountPill percentage={30} discountCode="SAVE" />);
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(screen.getByText(/-30%/)).toBeInTheDocument();
  });

  it("uses default discount code and percentage when none provided", () => {
    render(<FloatingDiscountPill />);
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(screen.getByText("SUMMER26")).toBeInTheDocument();
    expect(screen.getByText(/-20%/)).toBeInTheDocument();
  });

  it("includes the 'Limited discount' eyebrow label after appearing", () => {
    render(<FloatingDiscountPill discountCode="XYZ" />);
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(screen.getByText(/limited discount/i)).toBeInTheDocument();
  });

  it("merges custom className onto the floating pill wrapper", () => {
    const { container } = render(
      <FloatingDiscountPill discountCode="ABC" className="my-pill" />
    );
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(container.querySelector(".my-pill")).not.toBeNull();
  });
});
