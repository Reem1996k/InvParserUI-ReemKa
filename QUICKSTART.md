# Quick Start Guide

Get the Invoice Parser Frontend running in minutes!

## 5-Minute Setup

### Step 1: Clone & Install
```bash
cd InvParserUI-ReemKa
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open Browser
Navigate to `http://localhost:3000`

### Step 4: Login
- **Username**: `admin`
- **Password**: `admin`

**Done!** You're now on the dashboard.

## Testing Features

### 1. Upload an Invoice
1. Click "Upload" in the navbar or dashboard quick actions
2. Drag & drop or click to select a PDF/image file
3. Watch the upload progress
4. See success notification with invoice ID

### 2. Search for Invoices
1. Click "Invoices" in the navbar
2. Enter a vendor name (e.g., "Acme Corp")
3. Click "Search"
4. See matching invoices in the table

### 3. View Invoice Details
1. From the invoices table, click "View"
2. See all invoice details and line items
3. Click "Edit" to modify fields (UI-only demo)
4. Try the "Download" button

### 4. Test Logout
1. Click "Logout" button in top right
2. Get redirected to login page
3. Login again with admin/admin

## Project Structure Explained

```
app/                          # Next.js App Router folder
├── (auth)/login/             # Login page
├── (dashboard)/              # Protected pages grouped
│   ├── dashboard/            # Overview page
│   ├── upload/               # File upload
│   ├── invoices/             # Invoice search/list
│   └── invoice/[id]/         # Invoice details
├── context/AuthContext.tsx   # Authentication state
├── lib/api.ts                # Backend API client
├── components/Navbar.tsx     # Navigation component
└── globals.css               # Global styles
```

## Key Technologies

| Technology | Purpose |
|-----------|---------|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Responsive styling |
| **React Context** | State management |
| **Sonner** | Toast notifications |
| **Lucide Icons** | Beautiful icons |

## Configuration

### Backend URL
Edit `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### Change to Production Backend
```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
```

## Common Tasks

### Add a New Page
1. Create folder in `app/(dashboard)/newpage/`
2. Add `page.tsx` file
3. Import components and add content
4. Add navigation link in Navbar

### Modify Styles
- Global styles: `app/globals.css`
- Tailwind config: `tailwind.config.ts`
- Use oracle color palette (oracle-50 to oracle-950)

### Change Authentication
Edit `app/context/AuthContext.tsx`:
- Credentials hardcoded to admin/admin
- localStorage key: 'auth' and 'username'

### Add New API Endpoint
Edit `app/lib/api.ts`:
```typescript
export async function newEndpoint() {
  const response = await fetch(`${API_BASE_URL}/endpoint`)
  return response.json()
}
```

## Development Workflow

### 1. Daily Development
```bash
npm run dev
# Edit files, auto-reload
# Test in browser
```

### 2. Before Committing
```bash
npm run lint
npm run build
```

### 3. Deploy
```bash
git push origin main
# Auto-deploys on Vercel (or your platform)
```

## API Integration Checklist

- [ ] Backend API running at http://localhost:8080
- [ ] POST /extract endpoint working
- [ ] GET /invoice/{id} endpoint working
- [ ] GET /invoices/vendor/{name} endpoint working
- [ ] CORS headers configured
- [ ] Error responses properly formatted

## Troubleshooting Quick Fixes

### "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

### Build errors
```bash
npm run lint
npm run build
```

### Backend connection failed
- Check API URL in `.env.local`
- Ensure backend is running
- Check browser console for errors

## Browser Testing

### Test on Different Browsers
- Chrome/Edge: `npm run dev`
- Firefox: Open http://localhost:3000
- Safari: Open http://localhost:3000

### Test Responsive Design
- DevTools: Press F12
- Toggle device toolbar (Ctrl+Shift+M)
- Test mobile, tablet, desktop sizes

### Test Edge Cases
- Login with wrong credentials
- Upload unsupported file type
- Search with non-existent vendor
- Try editing invoice fields

## Performance Check

### Check Bundle Size
```bash
npm run build
# .next/static/ folder contains bundles
```

### Analyze Page Performance
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Click "Analyze page load"
4. Review suggestions

## Next Steps

1. **Connect Real Backend**: Update `.env.local` with your backend URL
2. **Customize Branding**: Update logo, colors, and text
3. **Add Features**: Build on top of this foundation
4. **Deploy**: Follow [DEPLOYMENT.md](./DEPLOYMENT.md)
5. **Monitor**: Set up analytics and error tracking

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

## Support

For issues:
1. Check console for error messages
2. Review [API_INTEGRATION.md](./API_INTEGRATION.md)
3. Check [README.md](./README.md) for detailed information
4. Review code comments in source files

## Tips & Tricks

- **Auto-format code**: `npm run lint --fix`
- **View build output**: `npx serve .next`
- **Debug authentication**: Check localStorage in DevTools
- **Check API calls**: DevTools Network tab
- **Learn components**: Check existing page implementations

---

**Ready to build?** Start with `npm run dev` and open http://localhost:3000! 🚀
