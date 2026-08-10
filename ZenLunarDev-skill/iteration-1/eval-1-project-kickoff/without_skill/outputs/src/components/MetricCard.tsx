import { DollarSign, Users, TrendingUp, Clock } from 'lucide-react'
import type { Trend } from '../types'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  dollar: DollarSign,
  users: Users,
  trending: TrendingUp,
  clock: Clock,
}

interface MetricCardProps {
  title: string
  value: string
  change: number
  trend: Trend
  icon: string
}

function MetricCard({ title, value, change, trend, icon }: MetricCardProps) {
  const Icon = iconMap[icon]
  const isPositive = trend === 'up'

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            {Icon && <Icon className="h-5 w-5" />}
          </div>
          <span className="text-sm font-medium text-slate-500">{title}</span>
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <div className="mt-1 flex items-center gap-1.5">
          <span className={`inline-flex items-center gap-0.5 text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
            <TrendingUp className={`h-3.5 w-3.5 ${!isPositive ? 'rotate-180' : ''}`} />
            {Math.abs(change)}%
          </span>
          <span className="text-sm text-slate-400">vs last month</span>
        </div>
      </div>
    </div>
  )
}

export default MetricCard
