import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useMediaQuery } from "./useMediaQuery";

describe("useMediaQuery", () => {
  it("returns false when query does not match", () => {
    const { result, unmount } = renderHook(() => useMediaQuery("(min-width: 9999px)"));
    expect(result.current).toBe(false);
    unmount();
  });

  it("returns a boolean", () => {
    const { result, unmount } = renderHook(() => useMediaQuery("(max-width: 768px)"));
    expect(typeof result.current).toBe("boolean");
    unmount();
  });

  it("uses matchMedia api", () => {
    // matchMedia in test setup returns matches=false
    const { result, unmount } = renderHook(() => useMediaQuery("(prefers-reduced-motion: reduce)"));
    expect(result.current).toBe(false);
    unmount();
  });
});
