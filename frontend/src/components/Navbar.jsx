import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { notificationService } from '../services/notificationService'
import './Navbar.css'

export default function Navbar() {
  const { user } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchCount = () => {
      notificationService.getCount()
        .then(res => setUnreadCount(res.data.data?.unreadCount || 0))
        .catch(() => {})
    }
    fetchCount()
    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchCount, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h2 className="navbar-title">Smart Campus Operations Hub</h2>
      </div>
      <div className="navbar-right">
        <Link to="/notifications" className="navbar-notification-btn">
          🔔
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
          )}
        </Link>
        <div className="navbar-user">
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt={user.name} className="navbar-avatar" />
          ) : (
            <div className="navbar-avatar-placeholder">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
          <span className="navbar-user-name">{user?.name}</span>
        </div>
      </div>
    </header>
  )
}
