'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileUp, Search, List, TrendingUp } from 'lucide-react'
import { getDashboardStats, DashboardStats } from '@/app/lib/api'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalInvoices: 0,
    totalVendors: 0,
    recentUploads: 0,
    averageConfidence: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats()
        setStats(data)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const formatPercentage = (value: number) => {
    return (value * 100).toFixed(1)
  }
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-oracle-950 mb-2">Dashboard</h1>
        <p className="text-oracle-600">Welcome to your invoice management system</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-oracle-600 text-sm font-medium">Total Invoices</p>
              <p className="text-3xl font-bold text-oracle-900 mt-2">
                {isLoading ? '--' : stats.totalInvoices}
              </p>
            </div>
            <div className="bg-oracle-100 p-3 rounded-lg">
              <List className="text-oracle-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-oracle-600 text-sm font-medium">Recent Uploads</p>
              <p className="text-3xl font-bold text-oracle-900 mt-2">
                {isLoading ? '--' : stats.recentUploads}
              </p>
            </div>
            <div className="bg-oracle-100 p-3 rounded-lg">
              <FileUp className="text-oracle-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-oracle-600 text-sm font-medium">Vendors</p>
              <p className="text-3xl font-bold text-oracle-900 mt-2">
                {isLoading ? '--' : stats.totalVendors}
              </p>
            </div>
            <div className="bg-oracle-100 p-3 rounded-lg">
              <Search className="text-oracle-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-oracle-600 text-sm font-medium">Avg Confidence</p>
              <p className="text-3xl font-bold text-oracle-900 mt-2">
                {isLoading ? '--' : `${formatPercentage(stats.averageConfidence)}%`}
              </p>
            </div>
            <div className="bg-oracle-100 p-3 rounded-lg">
              <TrendingUp className="text-oracle-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
        <h2 className="text-2xl font-bold text-oracle-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/upload"
            className="flex items-center gap-4 p-6 border-2 border-oracle-200 rounded-lg hover:border-oracle-500 hover:bg-oracle-50 transition-all"
          >
            <div className="bg-oracle-100 p-3 rounded-lg">
              <FileUp className="text-oracle-600" size={28} />
            </div>
            <div>
              <h3 className="font-semibold text-oracle-900">Upload Invoice</h3>
              <p className="text-oracle-600 text-sm">Upload a new invoice for extraction</p>
            </div>
          </Link>

          <Link
            href="/invoices"
            className="flex items-center gap-4 p-6 border-2 border-oracle-200 rounded-lg hover:border-oracle-500 hover:bg-oracle-50 transition-all"
          >
            <div className="bg-oracle-100 p-3 rounded-lg">
              <Search className="text-oracle-600" size={28} />
            </div>
            <div>
              <h3 className="font-semibold text-oracle-900">Search by Vendor</h3>
              <p className="text-oracle-600 text-sm">Find invoices from a specific vendor</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Information Section */}
      <div className="bg-oracle-100 border border-oracle-200 rounded-lg p-8">
        <h2 className="text-lg font-semibold text-oracle-900 mb-4">Getting Started</h2>
        <ul className="space-y-3 text-oracle-700">
          <li className="flex gap-3">
            <span className="text-oracle-600 font-bold">1.</span>
            <span>Upload invoice documents in PDF format</span>
          </li>
          <li className="flex gap-3">
            <span className="text-oracle-600 font-bold">2.</span>
            <span>The system will automatically extract invoice data</span>
          </li>
          <li className="flex gap-3">
            <span className="text-oracle-600 font-bold">3.</span>
            <span>Search invoices by vendor name or view individual details</span>
          </li>
        </ul>
      </div>
    </main>
  )
}
