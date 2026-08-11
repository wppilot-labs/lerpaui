import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCopyToClipboard } from './useCopyToClipboard';

describe('useCopyToClipboard', () => {
  it('starts with copied=false and copiedText=null', () => {
    const { result, unmount } = renderHook(() => useCopyToClipboard());
    expect(result.current.copied).toBe(false);
    expect(result.current.copiedText).toBeNull();
    unmount();
  });

  it('exposes a copy function', () => {
    const { result, unmount } = renderHook(() => useCopyToClipboard());
    expect(typeof result.current.copy).toBe('function');
    unmount();
  });

  it('sets copied=true after successful copy', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    const { result, unmount } = renderHook(() => useCopyToClipboard(99999));
    await act(async () => {
      await result.current.copy('Hello world');
    });
    expect(result.current.copied).toBe(true);
    expect(result.current.copiedText).toBe('Hello world');
    expect(writeText).toHaveBeenCalledWith('Hello world');
    unmount();
  });

  it('returns false when clipboard is unavailable', async () => {
    const original = (navigator as Navigator & { clipboard?: unknown }).clipboard;
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      configurable: true,
    });
    const { result, unmount } = renderHook(() => useCopyToClipboard(99999));
    let ret: boolean | undefined;
    await act(async () => {
      ret = await result.current.copy('nope');
    });
    expect(ret).toBe(false);
    expect(result.current.copied).toBe(false);
    expect(warning).toHaveBeenCalledWith('Clipboard not supported');
    Object.defineProperty(navigator, 'clipboard', { value: original, configurable: true });
    warning.mockRestore();
    unmount();
  });
});
