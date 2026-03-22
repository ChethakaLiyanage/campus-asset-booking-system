import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'

export default function HomePage() {
  const { isAuthenticated } = useAuth()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary)' }}>

      {/* Hero Section */}
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        background: 'radial-gradient(ellipse at top, rgba(59,130,246,0.08) 0%, transparent 60%)',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Decorative grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(30,48,87,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(30,48,87,0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          zIndex: 0,
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.375rem 1rem', borderRadius: '20px', marginBottom: '1.5rem',
            background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)',
            color: 'var(--color-primary)', fontSize: '0.8rem', fontWeight: 600,
          }}>
            🎓 SLIIT Faculty of Computing — IT3030 PAF 2026
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800, lineHeight: 1.15,
            background: 'linear-gradient(135deg, #f1f5f9 30%, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: '1.25rem',
          }}>
            Smart Campus<br />Operations Hub
          </h1>

          <p style={{
            fontSize: '1.125rem', color: 'var(--color-text-secondary)',
            maxWidth: '540px', margin: '0 auto 2.5rem', lineHeight: 1.7,
          }}>
            A unified platform to manage facility bookings, assets, and maintenance
            incidents for your university. Fast, secure, and role-based.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                🚀 Go to Dashboard
              </Link>
            ) : (
              <button className="btn btn-primary btn-lg" onClick={authService.googleLogin}>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                     alt="Google" width="20" height="20" />
                Sign in with Google
              </button>
            )}
            <Link to="/resources" className="btn btn-secondary btn-lg">
              🏢 Browse Resources
            </Link>
          </div>

          {/* Feature grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem', marginTop: '4rem', textAlign: 'left',
          }}>
            {[
              { icon: '🏢', title: 'Facility Catalogue', desc: 'Browse lecture halls, labs, meeting rooms & equipment' },
              { icon: '📅', title: 'Booking System', desc: 'Request, approve and manage facility bookings' },
              { icon: '🔧', title: 'Incident Ticketing', desc: 'Report and track maintenance issues with attachments' },
              { icon: '🔔', title: 'Notifications', desc: 'Real-time updates on booking and ticket status' },
            ].map((f) => (
              <div key={f.title} className="card" style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{f.icon}</div>
                <h4 style={{ marginBottom: '0.375rem' }}>{f.title}</h4>
                <p style={{ fontSize: '0.875rem' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
