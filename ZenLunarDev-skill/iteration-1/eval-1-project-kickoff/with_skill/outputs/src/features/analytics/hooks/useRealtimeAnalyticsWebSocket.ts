import { useWebSocket } from '../../../../shared/hooks/useWebSocket';
import { useRealtimeAnalytics } from '../types/analytics';
import { WS_URL } from '../../../config/constants';

export function useRealtimeAnalyticsWebSocket() {
  const analytics = useRealtimeAnalytics(WS_URL);

  useWebSocket({
    url: WS_URL,
    onMessage: analytics.handleMessage,
    onConnect: () => console.log('Analytics WebSocket connected'),
    onDisconnect: () => console.log('Analytics WebSocket disconnected'),
    onError: (error) => console.error('Analytics WebSocket error:', error),
  });

  return analytics;
}
