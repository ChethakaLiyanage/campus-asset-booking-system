import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Sidebar.css'

const navItems = [
  { to: '/dashboard',      icon: '🏠', label: 'Dashboard' },
  { to: '/resources',      icon: '🏢', label: 'Resources' },
  { to: '/bookings',       icon: '📅', label: 'Bookings' },
  { to: '/tickets',        icon: '🔧', label: 'Tickets' },
  { to: '/notifications',  icon: '🔔', label: 'Notifications' },
]

const adminItems = [
  { to: '/admin/users',    icon: '👥', label: 'Manage Users' },
]

export default function Sidebar() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🎓</div>
        <div>
          <div className="sidebar-logo-title">Smart Campus</div>
          <div className="sidebar-logo-sub">Operations Hub</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Menu</div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}

        {isAdmin && (
          <>
            <div className="sidebar-section-label" style={{ marginTop: '1.5rem' }}>Admin</div>
            {adminItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* User footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt={user.name} className="sidebar-avatar" />
          ) : (
            <div className="sidebar-avatar-placeholder">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name || 'User'}</div>
            <div className="sidebar-user-role">
              {user?.roles?.join(', ') || 'USER'}
            </div>
          </div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={handleLogout}
                style={{ width: '100%', marginTop: '0.75rem', justifyContent: 'center' }}>
          🚪 Logout
        </button>
      </div>
    </aside>
  )
}
