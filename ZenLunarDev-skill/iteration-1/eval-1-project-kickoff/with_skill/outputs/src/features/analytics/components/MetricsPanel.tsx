import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type MetricsPanelProps = {
  metrics: {
    revenue: { value: number; previous: number };
    users: { value: number; previous: number };
    conversion: { value: number; previous: number };
    retention: { value: number; previous: number };
  };
  loading?: boolean;
};

export const MetricsPanel = ({ metrics, loading = false }: MetricsPanelProps) => {
  const items = useMemo(
    () => [
      {
        label: 'Total Revenue',
        value: metrics.revenue.value,
        previous: metrics.revenue.previous,
        format: 'currency' as const,
        color: '#6366f1',
      },
      {
        label: 'Active Users',
        value: metrics.users.value,
        previous: metrics.users.previous,
        format: 'number' as const,
        color: '#06b6d4',
      },
      {
        label: 'Conversion Rate',
        value: metrics.conversion.value,
        previous: metrics.conversion.previous,
        format: 'percentage' as const,
        color: '#10b981',
      },
      {
        label: 'Retention Rate',
        value: metrics.retention.value,
        previous: metrics.retention.previous,
        format: 'percentage' as const,
        color: '#f59e0b',
      },
    ],
    [metrics]
  );

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      default:
        return new Intl.NumberFormat('en-US').format(value);
    }
  };

  const getChange = (current: number, previous: number) => {
    if (previous === 0) return null;
    const change = ((current - previous) / previous) * 100;
    return change;
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '16px',
    }}>
      <AnimatePresence>
        {items.map((item, index) => {
          const change = getChange(item.value, item.previous);
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: `linear-gradient(90deg, ${item.color}, transparent)`,
              }} />
              <p style={{
                fontSize: 'var(--font-sizes-sm)',
                color: 'var(--color-text-muted)',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '8px',
              }}>
                {item.label}
              </p>
              {loading ? (
                <div style={{
                  height: '28px',
                  width: '60%',
                  background: 'linear-gradient(90deg, var(--color-surface-hover) 25%, var(--color-border) 50%, var(--color-surface-hover) 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                  borderRadius: 'var(--radius-sm)',
                }} />
              ) : (
                <>
                  <motion.p
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                      fontSize: 'var(--font-sizes-2xl)',
                      fontWeight: 700,
                      color: 'var(--color-text)',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {formatValue(item.value, item.format)}
                  </motion.p>
                  {change !== null && (
                    <p style={{
                      fontSize: 'var(--font-sizes-sm)',
                      marginTop: '8px',
                      color: change >= 0 ? '#10b981' : '#ef4444',
                      fontWeight: 600,
                    }}>
                      {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(1)}% vs last period
                    </p>
                  )}
                </>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
