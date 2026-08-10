import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Avatar } from '../../../../shared/ui/Avatar';

const navItems = [
  { label: 'Dashboard', path: '/', icon: '◆' },
  { label: 'Analytics', path: '/analytics', icon: '◈' },
  { label: 'Reports', path: '/reports', icon: '▣' },
  { label: 'Settings', path: '/settings', icon: '⚙' },
];

type SidebarProps = {
  collapsed?: boolean;
  onToggle?: () => void;
};

export const Sidebar = ({ collapsed = false, onToggle }: SidebarProps) => {
  const [activePath, setActivePath] = useState('/');

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        width: collapsed ? '72px' : '260px',
        background: 'var(--color-bg)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <div style={{
        padding: collapsed ? '20px 12px' : '20px 20px',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 700,
          fontSize: '14px',
          flexShrink: 0,
        }}>
          L
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              fontSize: 'var(--font-sizes-lg)',
              fontWeight: 700,
              color: 'var(--color-text)',
              letterSpacing: '-0.02em',
            }}
          >
            Lunara
          </motion.div>
        )}
      </div>

      <nav style={{
        padding: '16px 12px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        overflowY: 'auto',
      }}>
        {navItems.map((item) => {
          const isActive = activePath === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setActivePath(item.path)}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <motion.div
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: collapsed ? '12px' : '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(6,182,212,0.1))'
                    : 'transparent',
                  color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
                  border: isActive ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                }}
              >
                <span style={{
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  color: isActive ? 'var(--color-accent)' : 'currentColor',
                }}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <span style={{
                    fontSize: 'var(--font-sizes-sm)',
                    fontWeight: isActive ? 600 : 500,
                  }}>
                    {item.label}
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div style={{
        padding: collapsed ? '12px' : '16px 20px',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <Avatar name="Alex Morgan" size={32} status="online" />
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <p style={{
              fontSize: 'var(--font-sizes-sm)',
              fontWeight: 600,
              color: 'var(--color-text)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              Alex Morgan
            </p>
            <p style={{
              fontSize: 'var(--font-sizes-xs)',
              color: 'var(--color-text-muted)',
              whiteSpace: 'nowrap',
            }}>
              Product Manager
            </p>
          </div>
        )}
      </div>
    </motion.aside>
  );
};
