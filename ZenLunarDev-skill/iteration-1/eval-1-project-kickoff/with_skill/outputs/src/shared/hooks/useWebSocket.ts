import { useState, useEffect, useCallback, useRef } from 'react';

type WebSocketMessage = {
  type: string;
  payload: unknown;
  timestamp: number;
};

type UseWebSocketOptions = {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
};

export function useWebSocket({
  url,
  reconnectInterval = 3000,
  maxReconnectAttempts = 10,
  onMessage,
  onConnect,
  onDisconnect,
  onError,
}: UseWebSocketOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const shouldReconnectRef = useRef(true);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        reconnectCountRef.current = 0;
        onConnect?.();
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WebSocketMessage;
          setLastMessage(data);
          onMessage?.(data);
        } catch {
          console.error('Failed to parse WebSocket message');
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        onDisconnect?.();
        if (shouldReconnectRef.current && reconnectCountRef.current < maxReconnectAttempts) {
          reconnectCountRef.current += 1;
          reconnectTimeoutRef.current = setTimeout(connect, reconnectInterval);
        }
      };

      ws.onerror = (error) => {
        onError?.(error);
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  }, [url, reconnectInterval, maxReconnectAttempts, onMessage, onConnect, onDisconnect, onError]);

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    wsRef.current?.close();
    wsRef.current = null;
  }, []);

  const sendMessage = useCallback((message: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return { isConnected, lastMessage, sendMessage, connect, disconnect };
}
