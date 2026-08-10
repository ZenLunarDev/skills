import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type StatCardProps = {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  loading?: boolean;
  delay?: number;
};

export const StatCard = ({ title, value, change, icon, loading = false, delay = 0 }: StatCardProps) => {
  const formattedChange = useMemo(() => {
    if (change === undefined) return null;
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change}%`;
  }, [change]);

  const changeColor = change && change >= 0 ? '#10b981' : '#ef4444';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100px',
        height: '100px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{
            fontSize: 'var(--font-sizes-sm)',
            color: 'var(--color-text-muted)',
            fontWeight: 500,
            letterSpacing: '0.025em',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}>
            {title}
          </p>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  width: '80px',
                  height: '32px',
                  background: 'linear-gradient(90deg, var(--color-surface-hover) 25%, var(--color-border) 50%, var(--color-surface-hover) 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                  borderRadius: 'var(--radius-sm)',
                }}
              />
            ) : (
              <motion.p
                key="value"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{
                  fontSize: 'var(--font-sizes-3xl)',
                  fontWeight: 700,
                  color: 'var(--color-text)',
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                }}
              >
                {value}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(6,182,212,0.1))',
          border: '1px solid rgba(99,102,241,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-accent)',
          flexShrink: 0,
        }}>
          {icon}
        </div>
      </div>
      {formattedChange && !loading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
          style={{
            marginTop: '12px',
            fontSize: 'var(--font-sizes-sm)',
            color: changeColor,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: change >= 0 ? 'none' : 'rotate(180deg)' }}>
            <path d="M6 9L1 4H11L6 9Z" fill={changeColor} />
          </svg>
          {formattedChange} from last month
        </motion.p>
      )}
    </motion.div>
  );
};
