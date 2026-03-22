import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }}>
      <div style={{ fontSize: '6rem' }}>🏗️</div>
      <h1 style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--color-primary)' }}>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn btn-primary">🏠 Go Home</Link>
    </div>
  )
}
