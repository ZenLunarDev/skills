import { useState, useEffect, useRef, useCallback } from 'react'
import type { ConnectionStatus } from '../types'

interface UseWebSocketOptions {
  url: string
  onMessage: (data: unknown) => void
  onStatusChange?: (status: ConnectionStatus) => void
  reconnectInterval?: number
  maxReconnectAttempts?: number
}

interface UseWebSocketReturn {
  lastMessage: unknown | null
  connectionStatus: ConnectionStatus
  sendMessage: (message: unknown) => void
}

export function useWebSocket({
  url,
  onMessage,
  onStatusChange,
  reconnectInterval = 3000,
  maxReconnectAttempts = 5,
}: UseWebSocketOptions): UseWebSocketReturn {
  const [lastMessage, setLastMessage] = useState<unknown | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting')
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectCountRef = useRef(0)
  const reconnectTimerRef = useRef<number | null>(null)
  const shouldReconnectRef = useRef(true)

  const clearReconnectTimer = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current)
      reconnectTimerRef.current = null
    }
  }, [])

  const connect = useCallback(() => {
    if (!shouldReconnectRef.current) return

    clearReconnectTimer()
    
    try {
      const ws = new WebSocket(url)
      wsRef.current = ws

      ws.onopen = () => {
        setConnectionStatus('connected')
        reconnectCountRef.current = 0
        onStatusChange?.('connected')
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          setLastMessage(data)
          onMessage(data)
        } catch {
          console.error('Failed to parse WebSocket message')
        }
      }

      ws.onerror = () => {
        setConnectionStatus('disconnected')
        onStatusChange?.('disconnected')
      }

      ws.onclose = () => {
        setConnectionStatus('disconnected')
        onStatusChange?.('disconnected')
        wsRef.current = null

        if (
          shouldReconnectRef.current &&
          reconnectCountRef.current < maxReconnectAttempts
        ) {
          reconnectCountRef.current += 1
          reconnectTimerRef.current = window.setTimeout(() => {
            connect()
          }, reconnectInterval)
        }
      }
    } catch {
      setConnectionStatus('disconnected')
      onStatusChange?.('disconnected')
    }
  }, [url, onMessage, onStatusChange, reconnectInterval, maxReconnectAttempts, clearReconnectTimer])

  useEffect(() => {
    shouldReconnectRef.current = true
    connect()

    return () => {
      shouldReconnectRef.current = false
      clearReconnectTimer()
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
    }
  }, [connect, clearReconnectTimer])

  const sendMessage = useCallback((message: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    }
  }, [])

  return {
    lastMessage,
    connectionStatus,
    sendMessage,
  }
}
