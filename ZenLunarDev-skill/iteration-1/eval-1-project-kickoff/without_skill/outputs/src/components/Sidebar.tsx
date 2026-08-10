import { LayoutDashboard, BarChart3, Users, FileText, Settings } from 'lucide-react'
import { sidebarItems } from '../data/mockData'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  layout: LayoutDashboard,
  'bar-chart': BarChart3,
  users: Users,
  'file-text': FileText,
  settings: Settings,
}

function Sidebar() {
  return (
    <div className="fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 hidden lg:block">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-white font-semibold text-lg">Nexus</span>
          </div>
        </div>
        
        <nav className="flex-1 space-y-1 px-3 py-4">
          {sidebarItems.map((item) => {
            const Icon = iconMap[item.icon]
            return (
              <a
                key={item.id}
                href={item.href}
                className={`
                  group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                  ${item.active
                    ? 'bg-primary-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }
                `}
              >
                {Icon && <Icon className="h-5 w-5" />}
                {item.label}
              </a>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 rounded-lg bg-slate-800/50 p-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <span className="text-white text-sm font-medium">JD</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">John Doe</p>
              <p className="text-xs text-slate-400 truncate">Engineering Manager</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
