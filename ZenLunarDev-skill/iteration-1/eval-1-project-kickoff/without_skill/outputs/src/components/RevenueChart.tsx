import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { RevenueDataPoint } from '../types'

interface RevenueChartProps {
  data: RevenueDataPoint[]
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; color: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg text-sm">
        <p className="font-medium mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-xs">
            {entry.value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
          </p>
        ))}
      </div>
    )
  }
  return null
}

function RevenueChart({ data }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis 
          dataKey="month" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#64748b', fontSize: 12 }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#64748b', fontSize: 12 }}
          tickFormatter={(value) => `$${(value / 1000)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area 
          type="monotone" 
          dataKey="target" 
          stroke="#94a3b8" 
          strokeWidth={2}
          fill="url(#colorTarget)" 
        />
        <Area 
          type="monotone" 
          dataKey="revenue" 
          stroke="#4f46e5" 
          strokeWidth={2}
          fill="url(#colorRevenue)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default RevenueChart
