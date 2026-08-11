import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns initial value when localStorage is empty', () => {
    const { result, unmount } = renderHook(() => useLocalStorage('test-key-1', 'default'));
    expect(result.current[0]).toBe('default');
    unmount();
  });

  it('persists a new value', () => {
    const { result, unmount } = renderHook(() => useLocalStorage('test-key-2', 'initial'));
    act(() => {
      result.current[1]('updated');
    });
    expect(result.current[0]).toBe('updated');
    expect(window.localStorage.getItem('test-key-2')).toBe('"updated"');
    unmount();
  });

  it('reads existing string value from localStorage', () => {
    window.localStorage.setItem('preexist', JSON.stringify('hello'));
    const { result, unmount } = renderHook(() => useLocalStorage('preexist', 'default'));
    expect(result.current[0]).toBe('hello');
    unmount();
  });

  it('supports updater function for number values', () => {
    const { result, unmount } = renderHook(() => useLocalStorage<number>('counter', 0));
    act(() => {
      result.current[1]((prev) => prev + 1);
    });
    expect(result.current[0]).toBe(1);
    unmount();
  });

  it('does not lose consecutive functional updates', () => {
    const { result, unmount } = renderHook(() => useLocalStorage<number>('counter-batch', 0));
    act(() => {
      result.current[1]((prev) => prev + 1);
      result.current[1]((prev) => prev + 1);
    });
    expect(result.current[0]).toBe(2);
    expect(window.localStorage.getItem('counter-batch')).toBe('2');
    unmount();
  });

  it('falls back to initialValue on parse errors', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    window.localStorage.setItem('bad-json', '{not json');
    const { result, unmount } = renderHook(() => useLocalStorage('bad-json', 'fallback'));
    expect(result.current[0]).toBe('fallback');
    expect(warn).toHaveBeenCalledWith(
      'Error reading localStorage key "bad-json":',
      expect.any(SyntaxError)
    );
    unmount();
    warn.mockRestore();
  });
});
