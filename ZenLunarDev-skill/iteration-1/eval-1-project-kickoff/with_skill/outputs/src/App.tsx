import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Dashboard } from './features/dashboard/components/Dashboard';
import { AnalyticsDashboard } from './features/analytics/components/AnalyticsDashboard';
import { Sidebar } from './features/dashboard/components/Sidebar';
import { Spinner } from './shared/ui/Spinner';
import type { DashboardMetric } from './features/dashboard/types/dashboard';

const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: '12px',
    color: 'var(--color-text-muted)',
  }}>
    <Spinner size={32} />
    <span style={{ fontSize: 'var(--font-sizes-sm)' }}>Loading...</span>
  </div>
);

type AppProps = {
  initialMetrics?: DashboardMetric[];
  loading?: boolean;
};

const defaultMetrics: DashboardMetric[] = [
  {
    id: '1',
    title: 'Total Revenue',
    value: 145320,
    previousValue: 128500,
    unit: 'USD',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    id: '2',
    title: 'Active Users',
    value: 8542,
    previousValue: 7890,
    unit: 'users',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: '3',
    title: 'Conversion Rate',
    value: 3.42,
    previousValue: 2.91,
    unit: '%',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: '4',
    title: 'Avg. Session',
    value: 8.5,
    previousValue: 7.2,
    unit: 'min',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    id: '5',
    title: 'Bounce Rate',
    value: 24.8,
    previousValue: 28.1,
    unit: '%',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
  },
  {
    id: '6',
    title: 'New Signups',
    value: 142,
    previousValue: 98,
    unit: 'users',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" y1="8" x2="19" y2="14" />
        <line x1="22" y1="11" x2="16" y2="11" />
      </svg>
    ),
  },
];

export const App = ({ initialMetrics, loading = false }: AppProps) => {
  const metrics = initialMetrics ?? defaultMetrics;

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      background: 'var(--color-bg)',
    }}>
      <Sidebar />
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <Routes>
          <Route path="/" element={<Dashboard metrics={metrics} loading={loading} />} />
          <Route path="/analytics" element={
            <Suspense fallback={<LoadingFallback />}>
              <AnalyticsDashboard />
            </Suspense>
          } />
          <Route path="*" element={
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--color-text-muted)',
            }}>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: 'var(--font-sizes-4xl)', marginBottom: '16px' }}>404</h2>
                <p>Page not found</p>
              </div>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
};
