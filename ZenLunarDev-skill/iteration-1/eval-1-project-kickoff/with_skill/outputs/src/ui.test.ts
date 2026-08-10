import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { StatCard } from './src/shared/ui/StatCard';
import { Card } from './src/shared/ui/Card';
import { Button } from './src/shared/ui/Button';
import { Avatar } from './src/shared/ui/Avatar';
import { Sidebar } from './src/features/dashboard/components/Sidebar';
import { Header } from './src/features/dashboard/components/Header';

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('UI Components', () => {
  describe('StatCard', () => {
    it('renders title and value', () => {
      render(<StatCard title="Revenue" value="$1,234" change={12.5} icon={<span>📊</span>} />);
      expect(screen.getByText('Revenue')).toBeDefined();
      expect(screen.getByText('$1,234')).toBeDefined();
    });

    it('shows loading skeleton when loading', () => {
      render(<StatCard title="Revenue" value="" icon={<span>📊</span>} loading />);
      expect(screen.getByText('Revenue')).toBeDefined();
    });

    it('shows change percentage', () => {
      render(<StatCard title="Revenue" value="$1,234" change={12.5} icon={<span>📊</span>} />);
      expect(screen.getByText('+12.5% from last month')).toBeDefined();
    });
  });

  describe('Card', () => {
    it('renders children', () => {
      render(<Card><p>Content</p></Card>);
      expect(screen.getByText('Content')).toBeDefined();
    });

    it('renders title and subtitle', () => {
      render(<Card title="Title" subtitle="Subtitle"><p>Content</p></Card>);
      expect(screen.getByText('Title')).toBeDefined();
      expect(screen.getByText('Subtitle')).toBeDefined();
    });

    it('shows loading skeleton when loading', () => {
      render(<Card loading><p>Content</p></Card>);
      expect(screen.queryByText('Content')).toBeNull();
    });
  });

  describe('Button', () => {
    it('renders children', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByText('Click me')).toBeDefined();
    });

    it('handles click', () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Click</Button>);
      fireEvent.click(screen.getByText('Click'));
      expect(onClick).toHaveBeenCalled();
    });

    it('is disabled when disabled prop is true', () => {
      render(<Button disabled>Click</Button>);
      expect(screen.getByText('Click')).toHaveProperty('disabled', true);
    });
  });

  describe('Avatar', () => {
    it('renders initials', () => {
      render(<Avatar name="John Doe" />);
      expect(screen.getByText('JD')).toBeDefined();
    });

    it('shows status indicator when provided', () => {
      render(<Avatar name="Jane Smith" status="online" />);
      expect(screen.getByText('JS')).toBeDefined();
    });
  });

  describe('Sidebar', () => {
    it('renders navigation items', () => {
      renderWithRouter(<Sidebar />);
      expect(screen.getByText('Dashboard')).toBeDefined();
      expect(screen.getByText('Analytics')).toBeDefined();
      expect(screen.getByText('Reports')).toBeDefined();
      expect(screen.getByText('Settings')).toBeDefined();
    });

    it('shows brand name', () => {
      renderWithRouter(<Sidebar />);
      expect(screen.getByText('Lunara')).toBeDefined();
    });

    it('shows user profile', () => {
      renderWithRouter(<Sidebar />);
      expect(screen.getByText('Alex Morgan')).toBeDefined();
    });
  });

  describe('Header', () => {
    it('renders title and subtitle', () => {
      render(<Header title="Dashboard" subtitle="Welcome back" />);
      expect(screen.getByText('Dashboard')).toBeDefined();
      expect(screen.getByText('Welcome back')).toBeDefined();
    });

    it('renders breadcrumb', () => {
      render(<Header title="Page" breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Page' }]} />);
      expect(screen.getByText('Home')).toBeDefined();
      expect(screen.getByText('Page')).toBeDefined();
    });
  });
});
