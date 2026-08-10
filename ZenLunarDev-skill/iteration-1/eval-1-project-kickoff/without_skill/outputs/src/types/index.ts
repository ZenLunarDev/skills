export interface DashboardMetrics {
  totalRevenue: number
  revenueChange: number
  revenueTrend: 'up' | 'down'
  activeUsers: number
  usersChange: number
  usersTrend: 'up' | 'down'
  conversionRate: number
  conversionChange: number
  conversionTrend: 'up' | 'down'
  avgSession: number
  sessionChange: number
  sessionTrend: 'up' | 'down'
}

export interface RevenueDataPoint {
  month: string
  revenue: number
  target: number
}

export interface ActivityDataPoint {
  hour: string
  active: number
  new: number
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected'
