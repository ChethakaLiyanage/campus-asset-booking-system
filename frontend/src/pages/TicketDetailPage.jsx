import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ticketService } from '../services/ticketService'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const TICKET_STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED']

export default function TicketDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin, isTechnician } = useAuth()
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [resolutionNotes, setResolutionNotes] = useState('')

  useEffect(() => {
    ticketService.getById(id)
      .then(res => { setTicket(res.data.data); setNewStatus(res.data.data?.status) })
      .catch(() => toast.error('Ticket not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleStatusUpdate = async () => {
    try {
      const res = await ticketService.updateStatus(id, newStatus, resolutionNotes, null)
      setTicket(res.data.data)
      toast.success('Status updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status')
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    try {
      setSubmittingComment(true)
      const res = await ticketService.addComment(id, commentText)
      setTicket(res.data.data)
      setCommentText('')
    } catch {
      toast.error('Failed to add comment')
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return
    try {
      const res = await ticketService.deleteComment(id, commentId)
      setTicket(res.data.data)
      toast.success('Comment deleted')
    } catch {
      toast.error('Failed to delete comment')
    }
  }

  const statusBadge = { OPEN: 'open', IN_PROGRESS: 'progress', RESOLVED: 'resolved', CLOSED: 'closed', REJECTED: 'rejected' }

  if (loading) return <div className="loading-container"><div className="spinner" /></div>
  if (!ticket) return <div className="empty-state"><h3>Ticket not found</h3></div>

  return (
    <div className="fade-in">
      <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: '1.5rem' }}>
        ← Back to Tickets
      </button>

      <div className="grid-2">
        {/* Ticket Details */}
        <div>
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <span className={`badge badge-${statusBadge[ticket.status]}`}>{ticket.status?.replace('_', ' ')}</span>
              <span className="badge badge-pending">{ticket.priority}</span>
              <span className="badge badge-open">{ticket.category?.replace('_', ' ')}</span>
            </div>
            <h2 style={{ marginBottom: '0.75rem' }}>{ticket.title}</h2>
            <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>{ticket.description}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              {ticket.location && <div>📍 <span style={{ color: 'var(--color-text-muted)' }}>{ticket.location}</span></div>}
              <div>👤 Reported by <span style={{ color: 'var(--color-text-muted)' }}>{ticket.reportedByUserName}</span></div>
              {ticket.assignedToUserName && <div>🔧 Assigned to <span style={{ color: 'var(--color-primary)' }}>{ticket.assignedToUserName}</span></div>}
              {ticket.resolutionNotes && (
                <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(16,185,129,0.08)', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <strong style={{ color: 'var(--color-success)' }}>Resolution Notes:</strong>
                  <p style={{ margin: '0.25rem 0 0' }}>{ticket.resolutionNotes}</p>
                </div>
              )}
            </div>

            {/* Attachments */}
            {ticket.attachments?.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>📎 Attachments</h4>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {ticket.attachments.map((att, i) => (
                    <a key={i} href={`/${att}`} target="_blank" rel="noreferrer"
                       className="btn btn-secondary btn-sm">📄 Attachment {i + 1}</a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Admin/Tech Status Update */}
          {(isAdmin || isTechnician) && (
            <div className="card">
              <h4 style={{ marginBottom: '1rem' }}>⚙️ Update Status</h4>
              <div className="form-group">
                <select className="form-select" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  {TICKET_STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div className="form-group">
                <textarea className="form-textarea" placeholder="Resolution notes (optional)..."
                          value={resolutionNotes} onChange={e => setResolutionNotes(e.target.value)}
                          style={{ minHeight: '80px' }} />
              </div>
              <button className="btn btn-primary" onClick={handleStatusUpdate}>Update Status</button>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="card">
          <h3 style={{ marginBottom: '1.25rem' }}>💬 Comments ({ticket.comments?.length || 0})</h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '1.25rem' }}>
            {ticket.comments?.length === 0 && (
              <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                No comments yet. Be the first!
              </p>
            )}
            {ticket.comments?.map(c => (
              <div key={c.id} style={{ padding: '0.875rem', borderRadius: '8px', background: 'var(--color-bg-secondary)', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-primary)' }}>{c.authorName}</span>
                  {c.authorId === user?.id && (
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteComment(c.id)}>🗑</button>
                  )}
                </div>
                <p style={{ fontSize: '0.9rem', margin: 0 }}>{c.text}</p>
              </div>
            ))}
          </div>
          <form onSubmit={handleAddComment}>
            <div className="form-group">
              <textarea className="form-textarea" placeholder="Add a comment..."
                        value={commentText} onChange={e => setCommentText(e.target.value)}
                        style={{ minHeight: '80px' }} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submittingComment || !commentText.trim()}>
              {submittingComment ? 'Posting...' : '💬 Post Comment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
