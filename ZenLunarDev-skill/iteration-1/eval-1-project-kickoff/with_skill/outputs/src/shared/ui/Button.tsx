import type { CSSProperties } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
  fullWidth?: boolean;
};

const variantStyles: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))',
    color: 'white',
    border: 'none',
    boxShadow: 'var(--shadow-glow)',
  },
  secondary: {
    background: 'var(--color-surface-hover)',
    color: 'var(--color-text)',
    border: '1px solid var(--color-border)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--color-text-muted)',
    border: '1px solid transparent',
  },
  danger: {
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    color: 'white',
    border: 'none',
  },
};

const sizeStyles: Record<ButtonSize, CSSProperties> = {
  sm: { padding: '6px 12px', fontSize: 'var(--font-sizes-sm)', borderRadius: 'var(--radius-sm)' },
  md: { padding: '10px 20px', fontSize: 'var(--font-sizes-base)', borderRadius: 'var(--radius-md)' },
  lg: { padding: '14px 28px', fontSize: 'var(--font-sizes-lg)', borderRadius: 'var(--radius-md)' },
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  type = 'button',
  icon,
  fullWidth = false,
}: ButtonProps) => {
  const baseStyle: CSSProperties = {
    ...variantStyles[variant],
    ...sizeStyles[size],
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    letterSpacing: '0.01em',
    width: fullWidth ? '100%' : 'auto',
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={baseStyle}
      whileHover={disabled ? {} : { scale: 1.02, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onMouseEnter={(e) => {
        if (!disabled) {
          if (variant === 'primary') e.currentTarget.style.boxShadow = '0 0 30px rgba(99, 102, 241, 0.4)';
          if (variant === 'ghost') {
            e.currentTarget.style.background = 'var(--color-surface-hover)';
            e.currentTarget.style.borderColor = 'var(--color-border)';
          }
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
        if (variant === 'ghost') {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.borderColor = 'transparent';
        }
      }}
    >
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </motion.button>
  );
};
