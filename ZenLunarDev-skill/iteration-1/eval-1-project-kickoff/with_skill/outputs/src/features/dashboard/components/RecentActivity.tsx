import { CSSProperties } from 'react';
import { motion } from 'framer-motion';

type ActivityItem = {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: number;
  avatar?: string;
};

type RecentActivityProps = {
  items: ActivityItem[];
  maxItems?: number;
  loading?: boolean;
};

const timeAgo = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

export const RecentActivity = ({ items, maxItems = 5, loading = false }: RecentActivityProps) => {
  const displayItems = items.slice(0, maxItems);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[...Array(3)].map((_, i) => (
          <div key={i} style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            padding: '12px',
            background: 'var(--color-surface-hover)',
            borderRadius: 'var(--radius-md)',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--color-border)',
              animation: 'pulse 1.5s infinite',
            }} />
            <div style={{ flex: 1 }}>
              <div style={{
                height: '14px',
                width: '60%',
                background: 'var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '6px',
              }} />
              <div style={{
                height: '12px',
                width: '40%',
                background: 'var(--color-border)',
                borderRadius: 'var(--radius-sm)',
              }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '360px' }}>
      <AnimatePresence>
        {displayItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-surface-hover)',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(99,102,241,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--color-surface-hover)';
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'var(--font-sizes-sm)',
              fontWeight: 600,
              color: 'white',
              flexShrink: 0,
            }}>
              {item.user.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <p style={{
                fontSize: 'var(--font-sizes-sm)',
                color: 'var(--color-text)',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                <span style={{ fontWeight: 600 }}>{item.user}</span> {item.action}{' '}
                <span style={{ color: 'var(--color-accent)' }}>{item.target}</span>
              </p>
              <p style={{
                fontSize: 'var(--font-sizes-xs)',
                color: 'var(--color-text-muted)',
                marginTop: '2px',
              }}>
                {timeAgo(item.timestamp)}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
