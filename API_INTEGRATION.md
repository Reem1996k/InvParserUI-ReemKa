# Invoice Parser Backend – FINAL Backend Prompt

You are working on an EXISTING backend for an Invoice Parser system.
The backend code, database models, and endpoints already exist and are in active use by a completed frontend.

IMPORTANT CONSTRAINTS:
- Do NOT change existing endpoint paths.
- Do NOT rename existing response fields.
- Do NOT modify database schema or ORM models.
- Do NOT introduce breaking changes.
- Any suggestion must be backward-compatible with the current frontend.

The goal is to REVIEW, VALIDATE, and IMPROVE backend logic correctness, consistency, and robustness
— NOT to redesign the system.

────────────────────────────────
BACKEND CONTEXT
────────────────────────────────

The backend exposes the following endpoints:

1) POST /extract  
Purpose:
- Accept an invoice file (PDF/Image)
- Perform OCR/ML extraction
- Store extracted data into the database
- Return extraction results including confidence scores

Current Response Structure (MUST remain unchanged):

{
  "confidence": <float>,
  "data": {
    "VendorName": <string>,
    "VendorNameLogo": <string>,
    "InvoiceId": <string>,
    "InvoiceDate": <ISO datetime string>,
    "ShippingAddress": <string>,
    "CustomerName": <string | null>,
    "AmountDue": <float | null>,
    "ShippingCost": <float | null>,
    "InvoiceTotal": <float>,
    "Items": [
      {
        "Description": <string | null>,
        "Name": <string | null>,
        "Quantity": <number | null>,
        "UnitPrice": <number | null>,
        "Amount": <number>,
        "InvoiceId": <string>
      }
    ]
  },
  "dataConfidence": {
    "VendorName": <float>,
    "InvoiceId": <float>,
    "InvoiceDate": <float>,
    "ShippingAddress": <float>,
    "CustomerName": <float>,
    "AmountDue": <float>,
    "ShippingCost": <float>,
    "InvoiceTotal": <float>,
    "Items": <float>
  },
  "predictionTime": <float>
}

Notes:
- Field names and casing are strict and must not change.
- This endpoint is computational (ML/OCR) and not purely CRUD.

────────────────────────────────

2) GET /invoice/{invoice_id}  
Purpose:
- Retrieve a single invoice and its items from the database.

Response Structure (MUST remain unchanged):

{
  "invoice": {
    "InvoiceId": <string>,
    "VendorName": <string>,
    "InvoiceDate": <ISO datetime string>,
    "ShippingAddress": <string>,
    "BillingAddressRecipient": <string | null>,
    "SubTotal": <float | null>,
    "ShippingCost": <float | null>,
    "InvoiceTotal": <float>
  },
  "items": [
    {
      "id": <int>,
      "InvoiceId": <string>,
      "Name": <string | null>,
      "Description": <string | null>,
      "Quantity": <float | null>,
      "UnitPrice": <float | null>,
      "Amount": <float>
    }
  ]
}

────────────────────────────────

3) GET /invoices/vendor/{vendor_name}  
Purpose:
- Retrieve all invoices for a given vendor.

Response Structure (MUST remain unchanged):

{
  "VendorName": <string>,
  "TotalInvoices": <int>,
  "invoices": [
    {
      "invoice": { ...Invoice fields... },
      "items": [ ...Item fields... ]
    }
  ]
}

────────────────────────────────
DATABASE MODELS (EXISTING – DO NOT CHANGE)
────────────────────────────────

Invoice:
- InvoiceId (PK)
- VendorName
- InvoiceDate
- BillingAddressRecipient
- ShippingAddress
- SubTotal
- ShippingCost
- InvoiceTotal

Item:
- id (PK)
- InvoiceId (FK)
- Name
- Description
- Quantity
- UnitPrice
- Amount

Confidence:
- InvoiceId (PK, FK)
- VendorName
- InvoiceDate
- BillingAddressRecipient
- ShippingAddress
- SubTotal
- ShippingCost
- InvoiceTotal

────────────────────────────────
BACKEND TASKS / EXPECTATIONS
────────────────────────────────

Your responsibilities:

- Validate that POST /extract:
  - Correctly persists Invoice, Item, and Confidence data
  - Handles partial / missing fields safely (nulls allowed)
  - Does not duplicate invoices incorrectly
  - Maintains referential integrity between Invoice, Item, Confidence

- Validate that GET /invoice/{id}:
  - Returns correct invoice + related items
  - Handles missing invoice IDs gracefully (404)

- Validate that GET /invoices/vendor/{vendor_name}:
  - Returns correct vendor grouping
  - Returns accurate TotalInvoices
  - Handles vendors with zero invoices safely

- Improve error handling:
  - Meaningful HTTP status codes
  - Clear backend logs (not frontend-facing message changes)

- Improve code quality:
  - Clear service/repository separation
  - Clean transaction boundaries
  - Avoid duplicated logic between endpoints

────────────────────────────────
STRICT NON-GOALS
────────────────────────────────
- Do NOT modify response JSON contracts
- Do NOT add PUT/PATCH/DELETE endpoints
- Do NOT add authentication or authorization
- Do NOT refactor frontend assumptions
- Do NOT change ML/OCR output format

────────────────────────────────
OUTPUT EXPECTATION
────────────────────────────────
- Provide backend code review insights
- Suggest safe internal refactors (non-breaking)
- Identify potential bugs, edge cases, or data consistency issues
- Recommend backend-only improvements that do not affect the frontend


Backend URL: http://localhost:8080

1) For the 500: the backend returns a generic 500 ("Unexpected error during extraction.") because it catches all exceptions. The real cause is in the backend terminal stack trace at the time of failure.

2) File field name: backend expects multipart field named "file" (FastAPI: file: UploadFile = File(...)). So formData.append("file", file) is correct.

3) File type: backend currently accepts PDF only (content-type application/pdf or filename ends with .pdf). Uploading images will return 400.

4) CORS: frontend runs on http://localhost:3000, backend on http://localhost:8080 — ensure CORS allows origin http://localhost:3000 with GET/POST/OPTIONS and Content-Type.
