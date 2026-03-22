import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * OAuth2CallbackPage
 * Spring Boot redirects here after Google login with ?token=JWT
 */
export default function OAuth2CallbackPage() {
  const [searchParams] = useSearchParams()
  const { loginWithToken } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      loginWithToken(token)
      navigate('/dashboard', { replace: true })
    } else {
      navigate('/login', { replace: true })
    }
  }, [])

  return (
    <div className="loading-container" style={{ minHeight: '100vh' }}>
      <div className="spinner" />
      <p>Completing sign-in...</p>
    </div>
  )
}
