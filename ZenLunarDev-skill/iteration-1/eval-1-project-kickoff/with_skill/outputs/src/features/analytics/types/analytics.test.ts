import { describe, it, expect } from 'vitest';
import { useRealtimeAnalytics } from './src/features/analytics/types/analytics';

describe('useRealtimeAnalytics', () => {
  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useRealtimeAnalytics('ws://localhost'));

    expect(result.current.metrics).toEqual([]);
    expect(result.current.events).toEqual([]);
    expect(result.current.timeSeries).toEqual([]);
    expect(result.current.isLive).toBe(true);
  });

  it('should update metrics on metrics_update message', () => {
    const { result } = renderHook(() => useRealtimeAnalytics('ws://localhost'));

    act(() => {
      result.current.handleMessage({
        type: 'metrics_update',
        payload: [
          { id: '1', name: 'Revenue', value: 1000, previousValue: 900, unit: '$', trend: 'up' as const },
        ],
        timestamp: Date.now(),
      });
    });

    expect(result.current.metrics).toHaveLength(1);
    expect(result.current.metrics[0].value).toBe(1000);
  });

  it('should add new events to the list', () => {
    const { result } = renderHook(() => useRealtimeAnalytics('ws://localhost'));

    act(() => {
      result.current.handleMessage({
        type: 'new_event',
        payload: { id: '1', type: 'page_view', timestamp: Date.now(), metadata: {} },
        timestamp: Date.now(),
      });
    });

    expect(result.current.events).toHaveLength(1);
    expect(result.current.events[0].type).toBe('page_view');
  });

  it('should append and cap time series data at 60 points', () => {
    const { result } = renderHook(() => useRealtimeAnalytics('ws://localhost'));

    const points = Array.from({ length: 100 }, (_, i) => ({
      timestamp: Date.now() - i * 1000,
      value: Math.random() * 100,
    }));

    act(() => {
      result.current.handleMessage({
        type: 'time_series_update',
        payload: points,
        timestamp: Date.now(),
      });
    });

    expect(result.current.timeSeries).toHaveLength(60);
  });

  it('should toggle live state', () => {
    const { result } = renderHook(() => useRealtimeAnalytics('ws://localhost'));

    expect(result.current.isLive).toBe(true);

    act(() => {
      result.current.toggleLive();
    });

    expect(result.current.isLive).toBe(false);

    act(() => {
      result.current.toggleLive();
    });

    expect(result.current.isLive).toBe(true);
  });
});
