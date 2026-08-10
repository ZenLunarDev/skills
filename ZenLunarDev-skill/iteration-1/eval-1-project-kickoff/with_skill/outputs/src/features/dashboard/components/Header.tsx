import { motion } from 'framer-motion';
import { useWindowSize } from '../../../../shared/hooks/useWindowSize';

type HeaderProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumb?: { label: string; href?: string }[];
};

export const Header = ({ title, subtitle, actions, breadcrumb }: HeaderProps) => {
  const { width } = useWindowSize();
  const isMobile = width < 768;

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: isMobile ? '16px' : '24px 32px',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        background: 'var(--color-bg)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backdropFilter: 'blur(12px)',
      }}
    >
      <div style={{ overflow: 'hidden' }}>
        {breadcrumb && breadcrumb.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '4px',
          }}>
            {breadcrumb.map((item, index) => (
              <span key={index} style={{
                fontSize: 'var(--font-sizes-xs)',
                color: 'var(--color-text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                {item.href ? (
                  <a href={item.href} style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>
                    {item.label}
                  </a>
                ) : (
                  <span style={{ color: 'var(--color-text)' }}>{item.label}</span>
                )}
                {index < breadcrumb.length - 1 && (
                  <span style={{ opacity: 0.5 }}>/</span>
                )}
              </span>
            ))}
          </div>
        )}
        <h1 style={{
          fontSize: isMobile ? 'var(--font-sizes-xl)' : 'var(--font-sizes-2xl)',
          fontWeight: 700,
          color: 'var(--color-text)',
          letterSpacing: '-0.02em',
          margin: 0,
          lineHeight: 1.2,
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{
            fontSize: 'var(--font-sizes-sm)',
            color: 'var(--color-text-muted)',
            marginTop: '4px',
          }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexShrink: 0,
        }}>
          {actions}
        </div>
      )}
    </motion.header>
  );
};
