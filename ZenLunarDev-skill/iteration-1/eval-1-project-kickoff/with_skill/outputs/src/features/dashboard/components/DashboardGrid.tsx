import type { DashboardMetric } from '../types/dashboard';
import { StatCard } from '../../../../shared/ui/StatCard';

type DashboardGridProps = {
  metrics: DashboardMetric[];
  loading?: boolean;
};

export const DashboardGrid = ({ metrics, loading = false }: DashboardGridProps) => {
  if (!loading && metrics.length === 0) {
    return (
      <div style={{
        padding: '48px',
        textAlign: 'center',
        color: 'var(--color-text-muted)',
      }}>
        No metrics available. Connect to a data source to view analytics.
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '20px',
    }}>
      {metrics.map((metric, index) => (
        <StatCard
          key={metric.id}
          title={metric.title}
          value={metric.value}
          change={metric.previousValue ? ((metric.value - metric.previousValue) / metric.previousValue) * 100 : undefined}
          icon={metric.icon}
          loading={loading}
          delay={index * 0.05}
        />
      ))}
    </div>
  );
};
