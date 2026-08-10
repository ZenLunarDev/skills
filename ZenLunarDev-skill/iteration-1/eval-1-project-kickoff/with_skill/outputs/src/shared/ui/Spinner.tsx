import { CSSProperties } from 'react';
import { motion } from 'framer-motion';

type SpinnerProps = {
  size?: number;
  color?: string;
};

export const Spinner = ({ size = 24, color = 'var(--color-primary)' }: SpinnerProps) => {
  return (
    <motion.div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        border: `2px solid transparent`,
        borderTop: `2px solid ${color}`,
        borderRadius: '50%',
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    />
  );
};
