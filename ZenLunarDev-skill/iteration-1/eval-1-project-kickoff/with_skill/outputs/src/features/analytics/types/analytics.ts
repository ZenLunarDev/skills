import { useState, useCallback } from 'react';

export type AnalyticsMetric = {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
};

export type RealtimeEvent = {
  id: string;
  type: 'page_view' | 'conversion' | 'revenue' | 'user_signup';
  timestamp: number;
  metadata: Record<string, unknown>;
};

export type TimeSeriesPoint = {
  timestamp: number;
  value: number;
  label?: string;
};

export function useRealtimeAnalytics(wsUrl: string) {
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([]);
  const [events, setEvents] = useState<RealtimeEvent[]>([]);
  const [timeSeries, setTimeSeries] = useState<TimeSeriesPoint[]>([]);
  const [isLive, setIsLive] = useState(true);

  const handleMessage = useCallback((message: { type: string; payload: unknown; timestamp: number }) => {
    switch (message.type) {
      case 'metrics_update': {
        const updates = message.payload as AnalyticsMetric[];
        setMetrics((prev) =>
          prev.map((m) => {
            const updated = updates.find((u) => u.id === m.id);
            return updated ?? m;
          })
        );
        break;
      }
      case 'new_event': {
        const event = message.payload as RealtimeEvent;
        setEvents((prev) => [event, ...prev].slice(0, 100));
        break;
      }
      case 'time_series_update': {
        const points = message.payload as TimeSeriesPoint[];
        setTimeSeries((prev) => [...prev, ...points].slice(-60));
        break;
      }
      case 'connection_status':
        setIsLive(message.payload === 'connected');
        break;
    }
  }, []);

  const toggleLive = useCallback(() => {
    setIsLive((prev) => !prev);
  }, []);

  return {
    metrics,
    events,
    timeSeries,
    isLive,
    handleMessage,
    toggleLive,
  };
}
