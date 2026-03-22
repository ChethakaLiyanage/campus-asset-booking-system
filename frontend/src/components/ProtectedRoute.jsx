import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * ProtectedRoute - Redirects unauthenticated users to /login.
 * Optionally checks for a required role.
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, loading, hasRole } = useAuth()

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
