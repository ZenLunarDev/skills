import { describe, it, expect } from 'vitest';
import { useWebSocket } from './src/shared/hooks/useWebSocket';

describe('useWebSocket', () => {
  it('should initialize with disconnected state', () => {
    const mockConnect = vi.fn();
    const mockDisconnect = vi.fn();

    const { result } = renderHook(() =>
      useWebSocket({
        url: 'ws://localhost:1234',
        onConnect: mockConnect,
        onDisconnect: mockDisconnect,
      })
    );

    expect(result.current.isConnected).toBe(false);
    expect(mockConnect).toHaveBeenCalled();
  });

  it('should attempt reconnection on close', async () => {
    vi.useFakeTimers();

    const { result } = renderHook(() =>
      useWebSocket({
        url: 'ws://localhost:1234',
        reconnectInterval: 100,
        maxReconnectAttempts: 2,
      })
    );

    expect(result.current.isConnected).toBe(false);

    await vi.advanceTimersByTimeAsync(500);

    vi.useRealTimers();
  });

  it('should stop reconnecting after max attempts', async () => {
    vi.useFakeTimers();

    const { result } = renderHook(() =>
      useWebSocket({
        url: 'ws://invalid-url.test',
        reconnectInterval: 50,
        maxReconnectAttempts: 1,
      })
    );

    await vi.advanceTimersByTimeAsync(200);

    expect(result.current.isConnected).toBe(false);

    vi.useRealTimers();
  });

  it('should call disconnect when unmounting', async () => {
    const { result, unmount } = renderHook(() =>
      useWebSocket({
        url: 'ws://localhost:1234',
      })
    );

    unmount();

    expect(result.current.isConnected).toBe(false);
  });
});
