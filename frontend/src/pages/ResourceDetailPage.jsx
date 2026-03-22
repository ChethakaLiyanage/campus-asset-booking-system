import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { resourceService } from '../services/resourceService'
import { bookingService } from '../services/bookingService'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function ResourceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [resource, setResource] = useState(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState({
    bookingDate: '', startTime: '', endTime: '', purpose: '', expectedAttendees: 1
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    resourceService.getById(id)
      .then(res => setResource(res.data.data))
      .catch(() => toast.error('Resource not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleBook = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) { navigate('/login'); return }
    try {
      setSubmitting(true)
      await bookingService.create({ ...booking, resourceId: id })
      toast.success('Booking request submitted! Awaiting admin approval.')
      navigate('/bookings')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Check for conflicts.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="loading-container"><div className="spinner" /></div>
  if (!resource) return <div className="empty-state"><h3>Resource not found</h3></div>

  return (
    <div className="fade-in">
      <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: '1.5rem' }}>
        ← Back
      </button>
      <div className="grid-2">
        {/* Resource Details */}
        <div className="card">
          <h2 style={{ marginBottom: '1rem' }}>{resource.name}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div><span style={{ color: 'var(--color-text-muted)' }}>Type: </span>{resource.type?.replace('_', ' ')}</div>
            <div><span style={{ color: 'var(--color-text-muted)' }}>Location: </span>{resource.location}</div>
            <div><span style={{ color: 'var(--color-text-muted)' }}>Capacity: </span>{resource.capacity} people</div>
            <div><span style={{ color: 'var(--color-text-muted)' }}>Available: </span>
              {resource.availableFrom} – {resource.availableTo}</div>
            <div><span style={{ color: 'var(--color-text-muted)' }}>Status: </span>
              <span className={`badge badge-${resource.status === 'ACTIVE' ? 'approved' : 'rejected'}`}>{resource.status}</span>
            </div>
            {resource.description && <p>{resource.description}</p>}
            {resource.features?.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {resource.features.map(f => <span key={f} className="badge badge-open">{f}</span>)}
              </div>
            )}
          </div>
        </div>

        {/* Booking Form */}
        {resource.status === 'ACTIVE' && (
          <div className="card">
            <h3 style={{ marginBottom: '1.25rem' }}>📅 Book This Resource</h3>
            <form onSubmit={handleBook}>
              <div className="form-group">
                <label className="form-label">Date *</label>
                <input type="date" className="form-input" required
                       min={new Date().toISOString().split('T')[0]}
                       value={booking.bookingDate}
                       onChange={e => setBooking({...booking, bookingDate: e.target.value})} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Start Time *</label>
                  <input type="time" className="form-input" required
                         value={booking.startTime}
                         onChange={e => setBooking({...booking, startTime: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">End Time *</label>
                  <input type="time" className="form-input" required
                         value={booking.endTime}
                         onChange={e => setBooking({...booking, endTime: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Purpose *</label>
                <input className="form-input" required placeholder="e.g., Team meeting, Lecture..."
                       value={booking.purpose}
                       onChange={e => setBooking({...booking, purpose: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Expected Attendees *</label>
                <input type="number" className="form-input" min={1} max={resource.capacity}
                       value={booking.expectedAttendees}
                       onChange={e => setBooking({...booking, expectedAttendees: parseInt(e.target.value)})} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting}
                      style={{ width: '100%', justifyContent: 'center' }}>
                {submitting ? 'Submitting...' : '📅 Submit Booking Request'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
