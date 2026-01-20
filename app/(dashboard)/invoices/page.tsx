'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Loader2, AlertCircle, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { getInvoicesByVendor, Invoice, VendorInvoicesResponse } from '@/app/lib/api'

export default function InvoicesPage() {
  const [vendorName, setVendorName] = useState('')
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!vendorName.trim()) {
      toast.error('Please enter a vendor name')
      return
    }

    setIsLoading(true)
    setHasSearched(true)
    setCurrentPage(1)

    try {
      const data: VendorInvoicesResponse = await getInvoicesByVendor(vendorName)
      // Extract invoices from the response structure
      const invoicesList = data.invoices.map((item) => item.invoice)
      setInvoices(invoicesList)
      toast.success(`Found ${data.TotalInvoices} invoice(s) for ${data.VendorName}`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch invoices'
      toast.error(errorMessage)
      setInvoices([])
    } finally {
      setIsLoading(false)
    }
  }

  const sortedInvoices = [...invoices].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.InvoiceDate).getTime() - new Date(a.InvoiceDate).getTime()
    } else {
      return (b.InvoiceTotal || 0) - (a.InvoiceTotal || 0)
    }
  })

  const paginatedInvoices = sortedInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(sortedInvoices.length / itemsPerPage)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-oracle-950 mb-2">Invoices</h1>
        <p className="text-oracle-600">Search and view invoices by vendor</p>
      </div>

      {/* Search Section */}
      <div className="card p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="vendor" className="label-text">
                Vendor Name
              </label>
              <input
                id="vendor"
                type="text"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                placeholder="Enter vendor name..."
                className="input-field w-full"
                disabled={isLoading}
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    Search
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {hasSearched && invoices.length > 0 && (
        <>
          {/* Filters & Sorting */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label htmlFor="sortBy" className="label-text">
                Sort By
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
                className="input-field w-full"
              >
                <option value="date">Invoice Date (Newest)</option>
                <option value="amount">Amount (Highest)</option>
              </select>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="card overflow-hidden mb-6">
            {sortedInvoices.length === 0 ? (
              <div className="p-8 text-center text-oracle-600">
                <AlertCircle className="mx-auto mb-3 text-oracle-400" size={32} />
                <p>No invoices found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-oracle-100 border-b border-oracle-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-oracle-900">
                          Invoice ID
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-oracle-900">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-oracle-900">
                          Shipping Address
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-oracle-900">
                          Total
                        </th>
                        <th className="px-6 py-3 text-right"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedInvoices.map((invoice) => (
                        <tr
                          key={invoice.InvoiceId}
                          className="border-b border-oracle-200 hover:bg-oracle-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-oracle-900">
                            {invoice.InvoiceId}
                          </td>
                          <td className="px-6 py-4 text-sm text-oracle-600">
                            {formatDate(invoice.InvoiceDate)}
                          </td>
                          <td className="px-6 py-4 text-sm text-oracle-600">
                            {invoice.ShippingAddress}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-oracle-900">
                            {formatCurrency(invoice.InvoiceTotal)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link
                              href={`/invoice/${invoice.InvoiceId}`}
                              className="inline-flex items-center gap-1 text-oracle-600 hover:text-oracle-900 font-medium transition-colors"
                            >
                              View <ChevronRight size={16} />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-oracle-200 flex items-center justify-between">
                    <p className="text-sm text-oracle-600">
                      Page {currentPage} of {totalPages} ({sortedInvoices.length} total)
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 border border-oracle-300 rounded-lg hover:bg-oracle-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 border border-oracle-300 rounded-lg hover:bg-oracle-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {hasSearched && invoices.length === 0 && !isLoading && (
        <div className="card p-12 text-center">
          <AlertCircle className="mx-auto mb-3 text-oracle-400" size={40} />
          <p className="text-oracle-700">No invoices found for vendor: <span className="font-semibold">{vendorName}</span></p>
          <p className="text-oracle-600 text-sm mt-2">Try searching with a different vendor name</p>
        </div>
      )}

      {!hasSearched && (
        <div className="card p-12 text-center">
          <Search className="mx-auto mb-3 text-oracle-400" size={40} />
          <p className="text-oracle-700">Enter a vendor name to search for invoices</p>
        </div>
      )}
    </main>
  )
}
