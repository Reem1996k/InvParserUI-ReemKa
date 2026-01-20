# Invoice Parser Frontend

A modern, production-quality Next.js application that serves as the frontend for an existing Invoice Parser backend API. Built with TypeScript, Tailwind CSS, and shadcn/ui components for an enterprise-grade user experience.

## Features

- **Authentication**: Frontend-only dummy authentication (admin/admin) with localStorage persistence across browser restarts
- **Invoice Upload**: Drag-and-drop file upload with support for PDF and image formats
- **Invoice Search**: Vendor-driven invoice search and filtering
- **Invoice Details**: View detailed invoice information with UI-only editable fields
- **Responsive Design**: Modern, clean UI with Oracle-inspired color palette
- **Toast Notifications**: Real-time feedback on upload and search operations using Sonner

## Project Structure

```
app/
├── (auth)/
│   └── login/
│       └── page.tsx              # Login page (admin/admin)
├── (dashboard)/
│   ├── layout.tsx                # Dashboard layout with navbar
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard overview
│   ├── upload/
│   │   └── page.tsx              # Invoice upload page with drag-and-drop
│   ├── invoices/
│   │   └── page.tsx              # Invoices list with vendor search
│   └── invoice/
│       └── [id]/
│           └── page.tsx          # Invoice details page
├── context/
│   └── AuthContext.tsx           # Authentication context with localStorage
├── lib/
│   ├── api.ts                    # Backend API client utilities
│   └── constants.ts              # Constants and configuration
├── components/
│   └── Navbar.tsx                # Navigation bar component
├── globals.css                   # Global Tailwind styles
├── layout.tsx                    # Root layout with AuthProvider
└── page.tsx                      # Root page (redirects to login/dashboard)
```

## Technical Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with Oracle-inspired color palette
- **Components**: Built with semantic HTML and Tailwind classes
- **State Management**: React Context API
- **Notifications**: Sonner
- **Icons**: Lucide React
- **HTTP Client**: Fetch API with custom utilities

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The app will automatically redirect to `/login`.

### Demo Credentials

- **Username**: `admin`
- **Password**: `admin`

## Backend API Integration

The frontend connects to a backend API running at `http://localhost:8080`.

### Available Endpoints

- **POST `/extract`**
  - Upload an invoice file using multipart/form-data
  - Returns extracted invoice data with `invoiceId`

- **GET `/invoice/{invoice_id}`**
  - Retrieve details of a specific invoice
  - Used on the invoice details page

- **GET `/invoices/vendor/{vendor_name}`**
  - Retrieve invoices filtered by vendor name
  - Used for vendor-driven search on the invoices page

### Environment Configuration

The backend URL is configured in `.env.local`:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## Pages & Features

### 1. Login Page (`/login`)
- Dummy authentication (frontend-only)
- Valid credentials: admin/admin
- Authentication state persists in localStorage across browser restarts
- Redirects to `/dashboard` on successful login

### 2. Dashboard (`/dashboard`)
- Overview of invoice management system
- Statistics cards (placeholder data)
- Quick action buttons for upload and vendor search
- Navigation links to all features
- Logout button in navbar

### 3. Upload Invoice (`/upload`)
- Drag-and-drop file upload area
- Click-to-select file support
- File type validation (PDF, JPEG, PNG, GIF, WebP)
- File size limit: 10 MB
- Loading spinner during upload
- Toast notifications for success/error
- Sidebar with format requirements

### 4. Invoices List (`/invoices`)
- Vendor name input for filtering (UI-level, not route parameter)
- Displays results in a responsive table
- Sorting by invoice date or amount
- Status filtering (pending/processed)
- Pagination with configurable items per page
- Click to navigate to invoice details

### 5. Invoice Details (`/invoice/[id]`)
- Dynamic route parameter: `[id]` represents the invoice ID
- Fetches fresh data from `/invoice/{invoice_id}` on each render
- Displays structured invoice information
- Editable fields (UI-only demonstration, no backend submission)
- Edit/Save/Cancel buttons for field modification
- Back navigation to invoices list
- Download button (UI placeholder)
- Summary sidebar with totals and status

## Authentication

### How It Works

1. User enters credentials on login page
2. Frontend validates against hardcoded credentials (admin/admin)
3. Authentication state is stored in `AuthContext`
4. Auth flag is persisted in `localStorage`
5. On page refresh, auth state is restored from localStorage
6. Logout clears localStorage and redirects to login page

### State Persistence

- Auth state persists across browser restarts via localStorage
- Logout requires explicit action from user
- No backend authentication integration (frontend-only demo)

## Data Handling

- **Invoice Data**: Stateless - always fetched fresh from backend API
- **No Persistence**: Invoice data is NOT stored in localStorage or sessionStorage
- **UI-Only Editing**: Editable fields on details page are demonstration only
- **Backend as Source of Truth**: All invoice data comes directly from backend API

## Development

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## UI/UX Design

### Color Palette (Oracle-Inspired)

- **Primary**: `oracle-600` (#6f82b3) - Professional blue
- **Dark**: `oracle-950` (#1f2333) - Deep navy
- **Light**: `oracle-50` (#f5f7fa) - Off-white background
- **Accent**: Gradient from oracle-600 to oracle-800

### Component Design

- Consistent spacing using Tailwind's scale
- Clear typography hierarchy
- Accessible form inputs with labels
- Responsive grid layouts
- Hover states and transitions
- Clear error and success states

## Notes

- This is a **FRONTEND-ONLY** implementation
- Backend API must be running at `http://localhost:8080`
- No backend code or modifications are included
- Mock data is not generated; all data comes from the backend API
- Editable fields on invoice details are UI demonstration only

## Testing the Application

1. **Login**: Use admin/admin credentials
2. **Upload**: Try uploading a PDF or image file (mock backend responses)
3. **Search**: Enter a vendor name to search for invoices
4. **View Details**: Click on an invoice to view full details
5. **Edit**: Click Edit button to modify invoice fields (UI only)

## Future Enhancements

- Integration with real backend authentication
- Excel export for invoices
- Advanced filtering and search capabilities
- Multi-file batch upload
- Invoice approval workflow
- User profile management
- Dark mode theme support

## License

MIT
