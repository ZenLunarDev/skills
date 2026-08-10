import { CSSProperties } from 'react';
import { motion } from 'framer-motion';

type AvatarProps = {
  name: string;
  size?: number;
  status?: 'online' | 'away' | 'busy' | 'offline';
};

export const Avatar = ({ name, size = 40, status }: AvatarProps) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const statusColors = {
    online: '#10b981',
    away: '#f59e0b',
    busy: '#ef4444',
    offline: '#64748b',
  };

  const style: CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontSize: `${size * 0.4}px`,
    flexShrink: 0,
    position: 'relative',
    letterSpacing: '0.05em',
  };

  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <motion.div
        style={style}
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        {initials}
      </motion.div>
      {status && (
        <span
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: `${size * 0.3}px`,
            height: `${size * 0.3}px`,
            borderRadius: '50%',
            background: statusColors[status],
            border: `2px solid var(--color-surface)`,
          }}
        />
      )}
    </div>
  );
};
