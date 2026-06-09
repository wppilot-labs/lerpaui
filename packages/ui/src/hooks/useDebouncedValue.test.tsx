import { describe, it, expect } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useDebouncedValue } from "./useDebouncedValue";

describe("useDebouncedValue", () => {
  it("returns the initial value immediately", () => {
    const { result, unmount } = renderHook(() => useDebouncedValue("hello", 100));
    expect(result.current).toBe("hello");
    unmount();
  });

  it("updates after delay", async () => {
    const { result, rerender, unmount } = renderHook(
      ({ v }: { v: string }) => useDebouncedValue(v, 50),
      { initialProps: { v: "a" } }
    );
    expect(result.current).toBe("a");
    act(() => {
      rerender({ v: "b" });
    });
    expect(result.current).toBe("a"); // not yet updated
    await waitFor(() => expect(result.current).toBe("b"), { timeout: 500 });
    unmount();
  });

  it("works with numbers", () => {
    const { result, unmount } = renderHook(() => useDebouncedValue(42, 100));
    expect(result.current).toBe(42);
    unmount();
  });
});
