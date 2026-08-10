import type { DashboardMetrics, RevenueDataPoint, ActivityDataPoint } from '../types'

export const initialMetrics: DashboardMetrics = {
  totalRevenue: 284500,
  revenueChange: 12.5,
  revenueTrend: 'up',
  activeUsers: 12453,
  usersChange: 8.2,
  usersTrend: 'up',
  conversionRate: 3.24,
  conversionChange: -1.4,
  conversionTrend: 'down',
  avgSession: 4.5,
  sessionChange: 5.1,
  sessionTrend: 'up',
}

export const initialRevenueData: RevenueDataPoint[] = [
  { month: 'Jan', revenue: 32000, target: 30000 },
  { month: 'Feb', revenue: 35000, target: 32000 },
  { month: 'Mar', revenue: 28000, target: 34000 },
  { month: 'Apr', revenue: 42000, target: 36000 },
  { month: 'May', revenue: 48000, target: 40000 },
  { month: 'Jun', revenue: 52000, target: 45000 },
  { month: 'Jul', revenue: 49000, target: 48000 },
]

export const initialActivityData: ActivityDataPoint[] = [
  { hour: '00:00', active: 120, new: 12 },
  { hour: '04:00', active: 80, new: 5 },
  { hour: '08:00', active: 450, new: 45 },
  { hour: '12:00', active: 680, new: 78 },
  { hour: '16:00', active: 520, new: 62 },
  { hour: '20:00', active: 380, new: 41 },
]

export const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'layout', href: '#', active: true },
  { id: 'analytics', label: 'Analytics', icon: 'bar-chart', href: '#', active: false },
  { id: 'customers', label: 'Customers', icon: 'users', href: '#', active: false },
  { id: 'reports', label: 'Reports', icon: 'file-text', href: '#', active: false },
  { id: 'settings', label: 'Settings', icon: 'settings', href: '#', active: false },
]
