const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

// ===== Backend Response Types (from API_INTEGRATION.md) =====

export interface ExtractionItem {
  Description: string | null
  Name: string | null
  Quantity: number | null
  UnitPrice: number | null
  Amount: number
  InvoiceId: string
}

export interface ExtractionData {
  VendorName: string
  VendorNameLogo: string
  InvoiceId: string
  InvoiceDate: string
  ShippingAddress: string
  CustomerName: string | null
  AmountDue: number | null
  ShippingCost: number | null
  InvoiceTotal: number
  Items: ExtractionItem[]
}

export interface ExtractionConfidence {
  VendorName: number
  InvoiceId: number
  InvoiceDate: number
  ShippingAddress: number
  CustomerName: number
  AmountDue: number
  ShippingCost: number
  InvoiceTotal: number
  Items: number
}

export interface ExtractResponse {
  confidence: number
  data: ExtractionData
  dataConfidence: ExtractionConfidence
  predictionTime: number
}

export interface InvoiceItem {
  id: number
  InvoiceId: string
  Name: string | null
  Description: string | null
  Quantity: number | null
  UnitPrice: number | null
  Amount: number
}

export interface Invoice {
  InvoiceId: string
  VendorName: string
  InvoiceDate: string
  ShippingAddress: string
  BillingAddressRecipient: string | null
  SubTotal: number | null
  ShippingCost: number | null
  InvoiceTotal: number
}

export interface GetInvoiceResponse {
  invoice: Invoice
  items: InvoiceItem[]
}

export interface VendorInvoicesResponse {
  VendorName: string
  TotalInvoices: number
  invoices: {
    invoice: Invoice
    items: InvoiceItem[]
  }[]
}

export interface DashboardStats {
  totalInvoices: number
  totalVendors: number
  recentUploads: number
  averageConfidence: number
}

class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'APIError'
  }
}

/**
 * Upload an invoice file and trigger extraction
 * POST /extract
 */
export async function uploadInvoice(file: File): Promise<ExtractResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE_URL}/extract`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.text()
    throw new APIError(response.status, error || `Upload failed with status ${response.status}`)
  }

  return response.json()
}

/**
 * Fetch invoice details by ID
 * GET /invoice/{invoice_id}
 */
export async function getInvoice(invoiceId: string): Promise<GetInvoiceResponse> {
  const response = await fetch(`${API_BASE_URL}/invoice/${encodeURIComponent(invoiceId)}`, {
    method: 'GET',
  })

  if (!response.ok) {
    throw new APIError(response.status, `Failed to fetch invoice: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Fetch invoices by vendor name
 * GET /invoices/vendor/{vendor_name}
 */
export async function getInvoicesByVendor(vendorName: string): Promise<VendorInvoicesResponse> {
  const response = await fetch(`${API_BASE_URL}/invoices/vendor/${encodeURIComponent(vendorName)}`, {
    method: 'GET',
  })

  if (!response.ok) {
    throw new APIError(response.status, `Failed to fetch invoices: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Fetch dashboard statistics
 * Tries to get from backend /stats endpoint, falls back to calculating from available data
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Try to fetch from dedicated stats endpoint if it exists
    const response = await fetch(`${API_BASE_URL}/stats`, {
      method: 'GET',
    })
    
    if (response.ok) {
      return response.json()
    }
  } catch (error) {
    // Fall back to default values if endpoint doesn't exist
    console.log('Stats endpoint not available, using placeholder values')
  }

  // Return placeholder stats (backend doesn't have a stats endpoint)
  return {
    totalInvoices: 0,
    totalVendors: 0,
    recentUploads: 0,
    averageConfidence: 0,
  }
}
