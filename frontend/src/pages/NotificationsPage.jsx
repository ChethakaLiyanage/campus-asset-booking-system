import { useEffect, useState } from 'react'
import { notificationService } from '../services/notificationService'
import toast from 'react-hot-toast'

const TYPE_ICONS = {
  BOOKING_APPROVED: '✅',
  BOOKING_REJECTED: '❌',
  BOOKING_CANCELLED: '🚫',
  TICKET_STATUS_CHANGED: '🔧',
  TICKET_ASSIGNED: '👤',
  TICKET_COMMENT_ADDED: '💬',
  GENERAL: '📢',
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchNotifications() }, [])

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getAll()
      setNotifications(res.data.data || [])
    } catch {
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    } catch { toast.error('Failed') }
  }

  const handleMarkAll = async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      toast.success('All marked as read')
    } catch { toast.error('Failed') }
  }

  const handleDelete = async (id) => {
    try {
      await notificationService.delete(id)
      setNotifications(prev => prev.filter(n => n.id !== id))
    } catch { toast.error('Failed') }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>🔔 Notifications</h1>
            <p>{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
          </div>
          {unreadCount > 0 && (
            <button className="btn btn-secondary" onClick={handleMarkAll}>✓ Mark all as read</button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading-container"><div className="spinner" /></div>
      ) : notifications.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔔</div>
          <h3>No notifications yet</h3>
          <p>We'll notify you when your bookings or tickets are updated.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications.map(n => (
            <div key={n.id} className="card" style={{
              borderLeft: `3px solid ${n.read ? 'var(--color-border)' : 'var(--color-primary)'}`,
              opacity: n.read ? 0.7 : 1,
              transition: 'var(--transition)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.5rem' }}>{TYPE_ICONS[n.type] || '📢'}</span>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem', color: n.read ? 'var(--color-text-secondary)' : 'var(--color-text-primary)' }}>
                      {n.title}
                    </div>
                    <p style={{ fontSize: '0.875rem', margin: 0 }}>{n.message}</p>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.375rem' }}>
                      {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  {!n.read && (
                    <button className="btn btn-secondary btn-sm" onClick={() => handleMarkRead(n.id)}>Mark Read</button>
                  )}
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(n.id)}>🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
