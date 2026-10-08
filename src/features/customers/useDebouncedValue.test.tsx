// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, renderHook } from '@testing-library/react';
import { useDebouncedValue } from './useDebouncedValue';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('useDebouncedValue', () => {
  it('uses only the latest value and clears its timer on unmount', () => {
    vi.useFakeTimers();
    const { result, rerender, unmount } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: 'first' }
    });
    rerender({ value: 'second' });
    act(() => vi.advanceTimersByTime(150));
    rerender({ value: 'third' });
    act(() => vi.advanceTimersByTime(299));
    expect(result.current).toBe('first');
    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe('third');
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
