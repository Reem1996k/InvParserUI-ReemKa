'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'

export const Navbar = () => {
  const { username, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <nav className="bg-white border-b border-oracle-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-xl font-bold text-oracle-700">
              Invoice Parser
            </Link>
            <div className="hidden md:flex gap-6">
              <Link
                href="/dashboard"
                className="text-oracle-600 hover:text-oracle-900 font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/upload"
                className="text-oracle-600 hover:text-oracle-900 font-medium transition-colors"
              >
                Upload
              </Link>
              <Link
                href="/invoices"
                className="text-oracle-600 hover:text-oracle-900 font-medium transition-colors"
              >
                Invoices
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-oracle-700 font-medium">{username}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-oracle-600 text-white font-medium rounded-lg hover:bg-oracle-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
