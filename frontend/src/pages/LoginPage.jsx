import { authService } from '../services/authService'

export default function LoginPage() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.06) 0%, transparent 70%)',
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', textAlign: 'center', padding: '3rem 2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
        <p style={{ marginBottom: '2rem', color: 'var(--color-text-muted)' }}>
          Sign in to access the Smart Campus Operations Hub
        </p>

        <button
          className="btn btn-primary"
          onClick={authService.googleLogin}
          style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '0.875rem' }}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
               alt="Google" width="22" height="22" />
          Continue with Google
        </button>

        <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          By signing in you agree to the university's IT usage policy.
        </p>
      </div>
    </div>
  )
}
