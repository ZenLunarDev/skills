import { useMemo } from 'react';
import { Card } from '../../../../shared/ui/Card';
import { useRealtimeAnalytics } from '../types/analytics';
import { MetricsPanel } from '../components/MetricsPanel';
import { WS_URL } from '../../../config/constants';

type AnalyticsDashboardProps = {
  className?: string;
};

export const AnalyticsDashboard = ({ className }: AnalyticsDashboardProps) => {
  const { metrics, events, timeSeries, isLive, toggleLive, handleMessage } = useRealtimeAnalytics(WS_URL);

  const dummyMetrics = useMemo(() => ({
    revenue: { value: 145320, previous: 128500 },
    users: { value: 8542, previous: 7890 },
    conversion: { value: 3.42, previous: 2.91 },
    retention: { value: 68.5, previous: 71.2 },
  }), []);

  const dummyEvents = useMemo(() => [
    { id: '1', user: 'Sarah Chen', action: 'updated', target: 'Q3 Revenue Forecast', timestamp: Date.now() - 120000 },
    { id: '2', user: 'James Wilson', action: 'created', target: 'New Campaign Analysis', timestamp: Date.now() - 300000 },
    { id: '3', user: 'Maria Garcia', action: 'shared', target: 'Monthly Report', timestamp: Date.now() - 600000 },
    { id: '4', user: 'David Kim', action: 'exported', target: 'User Metrics CSV', timestamp: Date.now() - 900000 },
    { id: '5', user: 'Lisa Park', action: 'commented on', target: 'Dashboard Design', timestamp: Date.now() - 1200000 },
  ], []);

  const dummyTimeSeries = useMemo(() => {
    const points: { timestamp: number; value: number }[] = [];
    const now = Date.now();
    for (let i = 30; i >= 0; i--) {
      points.push({
        timestamp: now - i * 60000,
        value: 1000 + Math.sin(i / 3) * 200 + Math.random() * 100,
      });
    }
    return points;
  }, []);

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <h2 style={{
          fontSize: 'var(--font-sizes-xl)',
          fontWeight: 700,
          color: 'var(--color-text)',
          letterSpacing: '-0.01em',
        }}>
          Real-time Analytics
        </h2>
        <motion.button
          onClick={toggleLive}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            background: isLive ? 'rgba(16, 185, 129, 0.1)' : 'var(--color-surface-hover)',
            border: `1px solid ${isLive ? 'rgba(16, 185, 129, 0.3)' : 'var(--color-border)'}`,
            color: isLive ? '#10b981' : 'var(--color-text-muted)',
            fontSize: 'var(--font-sizes-sm)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isLive ? '#10b981' : 'var(--color-text-muted)',
            animation: isLive ? 'pulse 2s infinite' : 'none',
          }} />
          {isLive ? 'Live' : 'Paused'}
        </motion.button>
      </div>

      <MetricsPanel metrics={dummyMetrics} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '20px',
      }}>
        <Card title="Revenue Trend" subtitle="Last 30 minutes" action={null}>
          <div style={{ height: '250px' }}>
            <RealtimeChart data={dummyTimeSeries} title="Revenue" color="#6366f1" height={250} />
          </div>
        </Card>

        <Card title="Recent Activity" subtitle="Team updates">
          <RecentActivity items={dummyEvents} />
        </Card>
      </div>
    </div>
  );
};
