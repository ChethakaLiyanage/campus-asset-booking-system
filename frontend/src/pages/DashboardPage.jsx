import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { resourceService } from '../services/resourceService'
import { bookingService } from '../services/bookingService'
import { ticketService } from '../services/ticketService'
import { notificationService } from '../services/notificationService'

export default function DashboardPage() {
  const { user, isAdmin } = useAuth()
  const [stats, setStats] = useState({ resources: 0, bookings: 0, tickets: 0, notifications: 0 })
  const [myBookings, setMyBookings] = useState([])
  const [myTickets, setMyTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resourcesRes, bookingsRes, ticketsRes, notifCount] = await Promise.all([
          resourceService.getAll(),
          bookingService.getMy(),
          ticketService.getMy(),
          notificationService.getCount(),
        ])
        setStats({
          resources: resourcesRes.data.data?.length || 0,
          bookings: bookingsRes.data.data?.length || 0,
          tickets: ticketsRes.data.data?.length || 0,
          notifications: notifCount.data.data?.unreadCount || 0,
        })
        setMyBookings((bookingsRes.data.data || []).slice(0, 4))
        setMyTickets((ticketsRes.data.data || []).slice(0, 4))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const statCards = [
    { label: 'Available Resources', value: stats.resources, icon: '🏢', color: 'var(--color-primary)', link: '/resources' },
    { label: 'My Bookings', value: stats.bookings, icon: '📅', color: 'var(--color-secondary)', link: '/bookings' },
    { label: 'My Tickets', value: stats.tickets, icon: '🔧', color: 'var(--color-warning)', link: '/tickets' },
    { label: 'Unread Notifications', value: stats.notifications, icon: '🔔', color: 'var(--color-danger)', link: '/notifications' },
  ]

  if (loading) return <div className="loading-container"><div className="spinner" /></div>

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Welcome back, {user?.name?.split(' ')[0] || 'User'} 👋</h1>
        <p>Here's what's happening on campus today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {statCards.map((stat) => (
          <Link to={stat.link} key={stat.label} className="card" style={{ textDecoration: 'none', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="card-title">{stat.label}</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
              </div>
              <div style={{ fontSize: '2rem', opacity: 0.8 }}>{stat.icon}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid-2">
        {/* Recent Bookings */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3>Recent Bookings</h3>
            <Link to="/bookings" className="btn btn-secondary btn-sm">View All</Link>
          </div>
          {myBookings.length === 0 ? (
            <div className="empty-state">
              <p>No bookings yet.</p>
              <Link to="/resources" className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem' }}>
                Book a Resource
              </Link>
            </div>
          ) : (
            myBookings.map((b) => (
              <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--color-border)' }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{b.purpose}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{b.bookingDate}</div>
                </div>
                <span className={`badge badge-${b.status?.toLowerCase()}`}>{b.status}</span>
              </div>
            ))
          )}
        </div>

        {/* Recent Tickets */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3>Recent Tickets</h3>
            <Link to="/tickets" className="btn btn-secondary btn-sm">View All</Link>
          </div>
          {myTickets.length === 0 ? (
            <div className="empty-state">
              <p>No tickets yet.</p>
              <Link to="/tickets" className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem' }}>
                Report an Issue
              </Link>
            </div>
          ) : (
            myTickets.map((t) => (
              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--color-border)' }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{t.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{t.category} · {t.priority}</div>
                </div>
                <span className={`badge badge-${t.status === 'IN_PROGRESS' ? 'progress' : t.status?.toLowerCase()}`}>{t.status}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/resources" className="btn btn-primary">🏢 Book a Resource</Link>
          <Link to="/tickets" className="btn btn-secondary">🔧 Report an Issue</Link>
          <Link to="/notifications" className="btn btn-secondary">🔔 View Notifications</Link>
          {isAdmin && <Link to="/admin/users" className="btn btn-secondary">👥 Manage Users</Link>}
        </div>
      </div>
    </div>
  )
}
