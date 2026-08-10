import { ReactNode, CSSProperties } from 'react';
import { motion } from 'framer-motion';

type CardProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  loading?: boolean;
  style?: CSSProperties;
  className?: string;
};

export const Card = ({ children, title, subtitle, action, loading = false, style, className }: CardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        ...style,
      }}
      className={className}
    >
      {(title || action) && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '8px',
          borderBottom: '1px solid var(--color-border)',
        }}>
          <div>
            {title && (
              <h3 style={{
                fontSize: 'var(--font-sizes-lg)',
                fontWeight: 600,
                color: 'var(--color-text)',
                letterSpacing: '-0.01em',
              }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p style={{
                fontSize: 'var(--font-sizes-sm)',
                color: 'var(--color-text-muted)',
                marginTop: '2px',
              }}>
                {subtitle}
              </p>
            )}
          </div>
          {action && <div style={{ flexShrink: 0 }}>{action}</div>}
        </div>
      )}
      {loading ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              style={{
                height: '20px',
                background: 'linear-gradient(90deg, var(--color-surface-hover) 25%, var(--color-border) 50%, var(--color-surface-hover) 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
                borderRadius: 'var(--radius-sm)',
                width: `${70 + Math.random() * 30}%`,
              }}
            />
          ))}
        </div>
      ) : (
        children
      )}
    </motion.div>
  );
};
