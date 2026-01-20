import type { Metadata } from 'next'
import { AuthProvider } from '@/app/context/AuthContext'
import './globals.css'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'Invoice Parser',
  description: 'Modern Invoice Parser Frontend',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  )
}
