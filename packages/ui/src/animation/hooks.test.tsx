import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePrefersReducedMotion, useInView, useShouldAnimate } from "./hooks";

describe("usePrefersReducedMotion", () => {
  it("returns false when matchMedia does not match", () => {
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);
  });

  it("returns a boolean value", () => {
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(typeof result.current).toBe("boolean");
  });
});

describe("useInView", () => {
  it("returns a ref and initial inView value", () => {
    const { result } = renderHook(() => useInView());
    expect(result.current).toHaveLength(2);
    const [ref, inView] = result.current;
    expect(ref).toBeDefined();
    expect(typeof inView).toBe("boolean");
  });

  it("accepts custom IntersectionObserver options", () => {
    const { result } = renderHook(() =>
      useInView({ rootMargin: "200px 0px", threshold: 0.5 })
    );
    expect(result.current[0]).toBeDefined();
  });
});

describe("useShouldAnimate", () => {
  it("returns a ref and an animation gate", () => {
    const { result } = renderHook(() => useShouldAnimate());
    expect(result.current).toHaveLength(2);
    const [ref, gate] = result.current;
    expect(ref).toBeDefined();
    expect(typeof gate).toBe("boolean");
  });

  it("returns false when prefers-reduced-motion is on, regardless of inView", () => {
    // We override matchMedia to indicate reduced motion preference
    const original = window.matchMedia;
    window.matchMedia = (q: string) =>
      ({ matches: true, media: q, onchange: null, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => false } as MediaQueryList);
    const { result } = renderHook(() => useShouldAnimate());
    expect(result.current[1]).toBe(false);
    window.matchMedia = original;
  });
});
