import { useState, useEffect, useCallback } from 'react'
import Layout from './components/Layout'
import MetricCard from './components/MetricCard'
import RevenueChart from './components/RevenueChart'
import UserActivityChart from './components/UserActivityChart'
import { useWebSocket } from './hooks/useWebSocket'
import { initialMetrics, initialRevenueData, initialActivityData } from './data/mockData'
import type { DashboardMetrics, RevenueDataPoint, ActivityDataPoint } from './types'

function App() {
  const [metrics, setMetrics] = useState<DashboardMetrics>(initialMetrics)
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>(initialRevenueData)
  const [activityData, setActivityData] = useState<ActivityDataPoint[]>(initialActivityData)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting')

  const handleMessage = useCallback((data: unknown) => {
    const message = data as { type: string; payload?: unknown }
    
    switch (message.type) {
      case 'METRICS_UPDATE':
        setMetrics(message.payload as DashboardMetrics)
        break
      case 'REVENUE_UPDATE':
        setRevenueData(message.payload as RevenueDataPoint[])
        break
      case 'ACTIVITY_UPDATE':
        setActivityData(message.payload as ActivityDataPoint[])
        break
      default:
        break
    }
  }, [])

  const { lastMessage } = useWebSocket({
    url: 'wss://api.example.com/ws/dashboard',
    onMessage: handleMessage,
    onStatusChange: setConnectionStatus,
  })

  useEffect(() => {
    if (lastMessage) {
      handleMessage(lastMessage)
    }
  }, [lastMessage, handleMessage])

  return (
    <Layout connectionStatus={connectionStatus}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Real-time analytics and performance metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Revenue"
            value={`$${metrics.totalRevenue.toLocaleString()}`}
            change={metrics.revenueChange}
            trend={metrics.revenueTrend}
            icon="dollar"
          />
          <MetricCard
            title="Active Users"
            value={metrics.activeUsers.toLocaleString()}
            change={metrics.usersChange}
            trend={metrics.usersTrend}
            icon="users"
          />
          <MetricCard
            title="Conversion Rate"
            value={`${metrics.conversionRate}%`}
            change={metrics.conversionChange}
            trend={metrics.conversionTrend}
            icon="trending"
          />
          <MetricCard
            title="Avg. Session"
            value={`${metrics.avgSession}m`}
            change={metrics.sessionChange}
            trend={metrics.sessionTrend}
            icon="clock"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Revenue Trend</h3>
            <RevenueChart data={revenueData} />
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">User Activity</h3>
            <UserActivityChart data={activityData} />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default App
