'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export interface AuthContextType {
  isAuthenticated: boolean
  username: string | null
  login: (username: string, password: string) => boolean
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load auth from localStorage on mount
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedAuth = localStorage.getItem('auth')
        const storedUsername = localStorage.getItem('username')
        if (storedAuth === 'true' && storedUsername) {
          setIsAuthenticated(true)
          setUsername(storedUsername)
          // Ensure cookie is set
          document.cookie = 'auth=true; path=/; max-age=2592000'
        }
      } catch (error) {
        console.error('Failed to load auth from localStorage:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = (username: string, password: string): boolean => {
    if (username === 'admin' && password === 'admin') {
      // Sync state updates
      setIsAuthenticated(true)
      setUsername(username)
      try {
        localStorage.setItem('auth', 'true')
        localStorage.setItem('username', username)
        // Also set a cookie for middleware authentication check
        document.cookie = 'auth=true; path=/; max-age=2592000'
      } catch (error) {
        console.error('Failed to save auth:', error)
      }
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUsername(null)
    try {
      localStorage.removeItem('auth')
      localStorage.removeItem('username')
      // Clear the authentication cookie
      document.cookie = 'auth=; path=/; max-age=0'
    } catch (error) {
      console.error('Failed to remove auth:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

