import { renderHook } from '@testing-library/react';
import { useSwipe } from './useSwipe';

describe('useSwipe', () => {
  test('returns ref for element', () => {
    const { result } = renderHook(() => useSwipe({}));
    expect(result.current).toBeDefined();
    expect(result.current.current).toBeNull();
  });

  test('returns ref when callbacks are provided', () => {
    const onSwipeLeft = jest.fn();
    const { result } = renderHook(() => useSwipe({ onSwipeLeft, threshold: 50 }));
    expect(result.current).toBeDefined();
    expect(typeof result.current).toBe('object');
  });
});
