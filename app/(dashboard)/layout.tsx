import { ReactNode } from 'react'
import { Navbar } from '@/app/components/Navbar'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-oracle-50">
      <Navbar />
      {children}
    </div>
  )
}
