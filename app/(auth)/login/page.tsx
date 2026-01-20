'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import { toast } from 'sonner'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated, login } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard')
    }
  }, [isAuthenticated, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username || !password) {
      toast.error('Please enter username and password')
      return
    }

    setIsLoading(true)
    console.log('Login attempt with:', { username })

    // Validate credentials
    if (username !== 'admin' || password !== 'admin') {
      console.log('Invalid credentials')
      toast.error('Invalid credentials. Use admin/admin')
      setPassword('')
      setIsLoading(false)
      return
    }

    // Perform login
    console.log('Credentials valid, performing login')
    const isLoginSuccessful = login(username, password)
    console.log('Login result:', isLoginSuccessful, 'Auth state:', isAuthenticated)
    
    if (isLoginSuccessful) {
      console.log('Login successful')
      toast.success('Login successful! Redirecting...')
      
      // Wait a moment for state to update and then redirect
      setTimeout(() => {
        console.log('Redirecting to dashboard')
        // Force redirect using window.location
        window.location.href = '/dashboard'
      }, 600)
    } else {
      console.log('Login failed')
      toast.error('Login failed. Please try again.')
      setPassword('')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-oracle-600 to-oracle-800 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-oracle-900 text-center mb-2">Invoice Parser</h1>
        <p className="text-oracle-600 text-center mb-8">Welcome back</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="label-text">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="input-field w-full"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="label-text">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field w-full"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-oracle-600 text-sm mt-6">
          Demo credentials: <br />
          <span className="font-mono text-oracle-700">admin / admin</span>
        </p>
      </div>
    </div>
  )
}
