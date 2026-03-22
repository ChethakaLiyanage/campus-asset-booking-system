import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

/**
 * AuthProvider - manages authentication state throughout the app.
 * Stores JWT token in localStorage and exposes user info + auth methods.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load saved auth state on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('sc_token')
    const savedUser = localStorage.getItem('sc_user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  /** Called after OAuth2 callback with the token from backend */
  const loginWithToken = useCallback((jwt) => {
    setToken(jwt)
    localStorage.setItem('sc_token', jwt)
    // Fetch user profile from backend
    authService.getMe(jwt).then((res) => {
      const userData = res.data.data.user
      setUser(userData)
      localStorage.setItem('sc_user', JSON.stringify(userData))
    })
  }, [])

  /** Logout - clear all auth state */
  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('sc_token')
    localStorage.removeItem('sc_user')
  }, [])

  /** Check if user has a specific role */
  const hasRole = useCallback((role) => {
    return user?.roles?.includes(role) || false
  }, [user])

  const isAuthenticated = !!token && !!user
  const isAdmin = hasRole('ADMIN')
  const isTechnician = hasRole('TECHNICIAN')

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    isTechnician,
    loginWithToken,
    logout,
    hasRole,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/** Custom hook to access auth context */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
