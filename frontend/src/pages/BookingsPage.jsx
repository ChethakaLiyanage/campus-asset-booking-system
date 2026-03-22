import { useEffect, useState } from 'react'
import { bookingService } from '../services/bookingService'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
  PENDING: 'pending', APPROVED: 'approved', REJECTED: 'rejected', CANCELLED: 'cancelled'
}

export default function BookingsPage() {
  const { isAdmin } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('ALL')

  useEffect(() => { fetchBookings() }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const res = isAdmin
        ? await bookingService.getAll()
        : await bookingService.getMy()
      setBookings(res.data.data || [])
    } catch {
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (id, action, extraData = {}) => {
    try {
      if (action === 'approve') await bookingService.approve(id, extraData.note)
      else if (action === 'reject') {
        const reason = prompt('Enter rejection reason:')
        if (!reason) return
        await bookingService.reject(id, reason)
      } else if (action === 'cancel') await bookingService.cancel(id)
      toast.success('Booking updated successfully')
      fetchBookings()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed')
    }
  }

  const filtered = filterStatus === 'ALL' ? bookings
    : bookings.filter(b => b.status === filterStatus)

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>📅 {isAdmin ? 'All Bookings' : 'My Bookings'}</h1>
        <p>{isAdmin ? 'Review and manage booking requests from all users' : 'Track your booking requests and status'}</p>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map(s => (
          <button key={s} className={`btn btn-sm ${filterStatus === s ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setFilterStatus(s)}>
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-container"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state"><p>No bookings found.</p></div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                {isAdmin && <th>User</th>}
                <th>Resource ID</th>
                <th>Date</th>
                <th>Time</th>
                <th>Purpose</th>
                <th>Attendees</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id}>
                  {isAdmin && <td>{b.userName}</td>}
                  <td style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{b.resourceId}</td>
                  <td>{b.bookingDate}</td>
                  <td>{b.startTime} – {b.endTime}</td>
                  <td>{b.purpose}</td>
                  <td>{b.expectedAttendees}</td>
                  <td><span className={`badge badge-${STATUS_COLORS[b.status]}`}>{b.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                      {isAdmin && b.status === 'PENDING' && (
                        <>
                          <button className="btn btn-success btn-sm" onClick={() => handleAction(b.id, 'approve')}>✓ Approve</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleAction(b.id, 'reject')}>✗ Reject</button>
                        </>
                      )}
                      {(b.status === 'PENDING' || b.status === 'APPROVED') && (
                        <button className="btn btn-secondary btn-sm" onClick={() => handleAction(b.id, 'cancel')}>Cancel</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
