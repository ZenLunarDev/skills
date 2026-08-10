import { Search, Bell, Wifi, WifiOff } from 'lucide-react'
import type { ConnectionStatus } from '../types'

const statusConfig: Record<ConnectionStatus, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  connected: { label: 'Live', icon: Wifi, color: 'text-emerald-600 bg-emerald-50' },
  connecting: { label: 'Connecting', icon: WifiOff, color: 'text-amber-600 bg-amber-50' },
  disconnected: { label: 'Offline', icon: WifiOff, color: 'text-red-600 bg-red-50' },
}

interface HeaderProps {
  connectionStatus: ConnectionStatus
}

function Header({ connectionStatus }: HeaderProps) {
  const status = statusConfig[connectionStatus]
  const StatusIcon = status.icon

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-slate-200">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search analytics, reports, customers..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
            <StatusIcon className="h-3.5 w-3.5" />
            {status.label}
          </div>

          <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-primary-600 rounded-full ring-2 ring-white" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
