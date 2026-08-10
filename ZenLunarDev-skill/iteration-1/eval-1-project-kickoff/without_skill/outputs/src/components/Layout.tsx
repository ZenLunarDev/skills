import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import type { ConnectionStatus } from '../types'

interface LayoutProps {
  children: ReactNode
  connectionStatus: ConnectionStatus
}

function Layout({ children, connectionStatus }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="lg:pl-72">
        <Header connectionStatus={connectionStatus} />
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
