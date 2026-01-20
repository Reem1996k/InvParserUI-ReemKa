'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, Loader2, AlertCircle, Edit2, Save, X } from 'lucide-react'
import { toast } from 'sonner'
import { getInvoice, GetInvoiceResponse, Invoice, InvoiceItem } from '@/app/lib/api'

interface EditableInvoice extends Invoice {
  items?: InvoiceItem[]
}

export default function InvoiceDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const invoiceId = params.id as string

  const [invoice, setInvoice] = useState<GetInvoiceResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedInvoice, setEditedInvoice] = useState<EditableInvoice | null>(null)

  useEffect(() => {
    const fetchInvoice = async () => {
      setIsLoading(true)
      try {
        const data = await getInvoice(invoiceId)
        setInvoice(data)
        setEditedInvoice({ ...data.invoice, items: data.items })
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch invoice'
        toast.error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    if (invoiceId) {
      fetchInvoice()
    }
  }, [invoiceId])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    // UI-only editing, no backend submission
    if (editedInvoice) {
      setInvoice({
        invoice: {
          InvoiceId: editedInvoice.InvoiceId,
          VendorName: editedInvoice.VendorName,
          InvoiceDate: editedInvoice.InvoiceDate,
          ShippingAddress: editedInvoice.ShippingAddress,
          BillingAddressRecipient: editedInvoice.BillingAddressRecipient,
          SubTotal: editedInvoice.SubTotal,
          ShippingCost: editedInvoice.ShippingCost,
          InvoiceTotal: editedInvoice.InvoiceTotal,
        },
        items: editedInvoice.items || [],
      })
      setIsEditing(false)
      toast.success('Changes saved locally (demo mode)')
    }
  }

  const handleCancel = () => {
    if (invoice) {
      setEditedInvoice({ ...invoice.invoice, items: invoice.items })
    }
    setIsEditing(false)
  }

  const handleFieldChange = (field: string, value: any) => {
    if (editedInvoice) {
      setEditedInvoice({
        ...editedInvoice,
        [field]: value,
      })
    }
  }

  const handleDownload = () => {
    toast.info('Download feature - UI only (backend support required)')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-oracle-600" size={40} />
        </div>
      </main>
    )
  }

  if (!invoice) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/invoices"
          className="inline-flex items-center gap-2 text-oracle-600 hover:text-oracle-900 mb-6"
        >
          <ArrowLeft size={18} />
          Back to Invoices
        </Link>
        <div className="card p-12 text-center">
          <AlertCircle className="mx-auto mb-3 text-oracle-400" size={40} />
          <p className="text-oracle-700">Invoice not found</p>
        </div>
      </main>
    )
  }

  const currentInvoice = isEditing ? editedInvoice : invoice?.invoice

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            href="/invoices"
            className="inline-flex items-center gap-2 text-oracle-600 hover:text-oracle-900 mb-4"
          >
            <ArrowLeft size={18} />
            Back to Invoices
          </Link>
          <h1 className="text-4xl font-bold text-oracle-950">Invoice Details</h1>
        </div>
        <div className="flex gap-3">
          {!isEditing ? (
            <>
              <button
                onClick={handleEdit}
                className="btn-secondary flex items-center gap-2"
              >
                <Edit2 size={18} />
                Edit
              </button>
              <button
                onClick={handleDownload}
                className="btn-primary flex items-center gap-2"
              >
                <Download size={18} />
                Download
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="btn-primary flex items-center gap-2"
              >
                <Save size={18} />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="btn-secondary flex items-center gap-2"
              >
                <X size={18} />
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Invoice Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Info */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-oracle-900 mb-6">Invoice Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-oracle-600 text-sm font-medium mb-1">Invoice ID</p>
                <p className="text-oracle-900 font-mono text-sm break-all">
                  {currentInvoice?.InvoiceId}
                </p>
              </div>
              <div>
                <p className="text-oracle-600 text-sm font-medium mb-1">Invoice Date</p>
                {isEditing ? (
                  <input
                    type="date"
                    value={editedInvoice?.InvoiceDate?.split('T')[0] || ''}
                    onChange={(e) => handleFieldChange('InvoiceDate', e.target.value)}
                    className="input-field w-full"
                  />
                ) : (
                  <p className="text-oracle-900 font-semibold">
                    {formatDate(currentInvoice?.InvoiceDate || '')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Vendor Info */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-oracle-900 mb-6">Vendor Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-oracle-600 text-sm font-medium mb-1">Vendor Name</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedInvoice?.VendorName || ''}
                    onChange={(e) => handleFieldChange('VendorName', e.target.value)}
                    className="input-field w-full"
                  />
                ) : (
                  <p className="text-oracle-900 font-semibold">{currentInvoice?.VendorName}</p>
                )}
              </div>
              <div>
                <p className="text-oracle-600 text-sm font-medium mb-1">Shipping Address</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedInvoice?.ShippingAddress || ''}
                    onChange={(e) => handleFieldChange('ShippingAddress', e.target.value)}
                    className="input-field w-full"
                  />
                ) : (
                  <p className="text-oracle-900 font-semibold">{currentInvoice?.ShippingAddress}</p>
                )}
              </div>
              <div>
                <p className="text-oracle-600 text-sm font-medium mb-1">Billing Address</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedInvoice?.BillingAddressRecipient || ''}
                    onChange={(e) => handleFieldChange('BillingAddressRecipient', e.target.value)}
                    className="input-field w-full"
                  />
                ) : (
                  <p className="text-oracle-900 font-semibold">{currentInvoice?.BillingAddressRecipient || 'N/A'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Items */}
          {editedInvoice?.items && editedInvoice.items.length > 0 && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-oracle-900 mb-6">Line Items</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-oracle-100">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-oracle-900">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-oracle-900">
                        Description
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-oracle-900">
                        Qty
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-oracle-900">
                        Unit Price
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-oracle-900">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {editedInvoice.items.map((item) => (
                      <tr key={item.id} className="border-b border-oracle-200">
                        <td className="px-4 py-3 text-oracle-900">{item.Name || 'N/A'}</td>
                        <td className="px-4 py-3 text-oracle-900">{item.Description || 'N/A'}</td>
                        <td className="px-4 py-3 text-right text-oracle-900">{item.Quantity || 0}</td>
                        <td className="px-4 py-3 text-right text-oracle-900">
                          {formatCurrency(item.UnitPrice || 0)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-oracle-900">
                          {formatCurrency(item.Amount || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Summary Sidebar */}
        <div className="card p-6 h-fit">
          <h2 className="text-xl font-bold text-oracle-900 mb-6">Summary</h2>

          <div className="space-y-4">
            <div>
              <p className="text-oracle-600 text-sm font-medium mb-2">Subtotal</p>
              <p className="text-xl font-semibold text-oracle-900">
                {formatCurrency(currentInvoice?.SubTotal || 0)}
              </p>
            </div>

            <div className="border-t border-oracle-200 pt-4">
              <p className="text-oracle-600 text-sm font-medium mb-2">Shipping Cost</p>
              <p className="text-xl font-semibold text-oracle-900">
                {formatCurrency(currentInvoice?.ShippingCost || 0)}
              </p>
            </div>

            <div className="border-t border-oracle-200 pt-4">
              <p className="text-lg font-bold text-oracle-900 mb-2">Total</p>
              <p className="text-3xl font-bold text-oracle-600">
                {formatCurrency(currentInvoice?.InvoiceTotal || 0)}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-oracle-200 text-xs text-oracle-500">
            <p>Note: This is a demonstration. Editable fields are UI-only and changes are not persisted to the backend.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
