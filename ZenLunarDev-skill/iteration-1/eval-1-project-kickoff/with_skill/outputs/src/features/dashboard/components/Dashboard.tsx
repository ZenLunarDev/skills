import { DashboardGrid } from './components/DashboardGrid';
import { Header } from './components/Header';
import type { DashboardMetric } from '../dashboard/types/dashboard';

type DashboardProps = {
  metrics: DashboardMetric[];
  loading?: boolean;
  title?: string;
  subtitle?: string;
};

export const Dashboard = ({ metrics, loading = false, title = 'Dashboard', subtitle = 'Welcome back, Alex' }: DashboardProps) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px', overflowY: 'auto', flex: 1 }}>
      <Header
        title={title}
        subtitle={subtitle}
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-surface-hover)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-muted)',
              fontSize: 'var(--font-sizes-sm)',
            }}>
              Last 7 days ▾
            </div>
          </div>
        }
      />
      <DashboardGrid metrics={metrics} loading={loading} />
    </div>
  );
};
