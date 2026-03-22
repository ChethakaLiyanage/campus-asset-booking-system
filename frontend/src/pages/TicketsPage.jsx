import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ticketService } from '../services/ticketService'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const CATEGORIES = ['ELECTRICAL', 'PLUMBING', 'EQUIPMENT_FAULT', 'NETWORK', 'CLEANING', 'SECURITY', 'OTHER']
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

export default function TicketsPage() {
  const { isAdmin, isTechnician } = useAuth()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [form, setForm] = useState({ title: '', description: '', category: 'OTHER', priority: 'MEDIUM', location: '' })
  const [files, setFiles] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const fileRef = useRef()

  useEffect(() => { fetchTickets() }, [])

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const res = (isAdmin || isTechnician)
        ? await ticketService.getAll()
        : await ticketService.getMy()
      setTickets(res.data.data || [])
    } catch {
      toast.error('Failed to load tickets')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (files.length > 3) { toast.error('Max 3 attachments'); return }
    try {
      setSubmitting(true)
      await ticketService.create(form, files)
      toast.success('Ticket created successfully!')
      setShowForm(false)
      setForm({ title: '', description: '', category: 'OTHER', priority: 'MEDIUM', location: '' })
      setFiles([])
      fetchTickets()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create ticket')
    } finally {
      setSubmitting(false)
    }
  }

  const priorityColors = { LOW: 'approved', MEDIUM: 'pending', HIGH: 'rejected', CRITICAL: 'rejected' }
  const statusBadge = { OPEN: 'open', IN_PROGRESS: 'progress', RESOLVED: 'resolved', CLOSED: 'closed', REJECTED: 'rejected' }

  const filtered = filterStatus === 'ALL' ? tickets : tickets.filter(t => t.status === filterStatus)

  return (
    <div className="fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1>🔧 {(isAdmin || isTechnician) ? 'All Tickets' : 'My Tickets'}</h1>
            <p>Manage maintenance requests and incident reports</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '+ New Ticket'}
          </button>
        </div>
      </div>

      {/* Create Ticket Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.25rem' }}>🔧 Report an Incident</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input className="form-input" required value={form.title}
                       onChange={e => setForm({...form, title: e.target.value})}
                       placeholder="Brief description of the issue" />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input className="form-input" value={form.location}
                       onChange={e => setForm({...form, location: e.target.value})}
                       placeholder="e.g., Block A, Room 204" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea className="form-textarea" required value={form.description}
                        onChange={e => setForm({...form, description: e.target.value})}
                        placeholder="Detailed description of the issue..." />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select className="form-select" value={form.category}
                        onChange={e => setForm({...form, category: e.target.value})}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Priority *</label>
                <select className="form-select" value={form.priority}
                        onChange={e => setForm({...form, priority: e.target.value})}>
                  {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Attachments (max 3 images)</label>
              <input type="file" accept="image/*" multiple ref={fileRef}
                     onChange={e => setFiles(Array.from(e.target.files).slice(0, 3))}
                     style={{ color: 'var(--color-text-secondary)' }} />
              {files.length > 0 && (
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.375rem' }}>
                  {files.length} file(s) selected
                </p>
              )}
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}
                    style={{ justifyContent: 'center' }}>
              {submitting ? 'Submitting...' : '🔧 Submit Ticket'}
            </button>
          </form>
        </div>
      )}

      {/* Status Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'].map(s => (
          <button key={s} className={`btn btn-sm ${filterStatus === s ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setFilterStatus(s)}>
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-container"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state"><p>No tickets found.</p></div>
      ) : (
        <div className="grid-3">
          {filtered.map(t => (
            <Link key={t.id} to={`/tickets/${t.id}`} className="card"
                  style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className={`badge badge-${statusBadge[t.status]}`}>{t.status?.replace('_', ' ')}</span>
                <span className={`badge badge-${priorityColors[t.priority]}`}>{t.priority}</span>
              </div>
              <h4 style={{ marginBottom: '0.375rem' }}>{t.title}</h4>
              <p style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                {t.description?.slice(0, 80)}...
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                <span>📂 {t.category?.replace('_', ' ')}</span>
                {t.location && <span>📍 {t.location}</span>}
              </div>
              {t.attachments?.length > 0 && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--color-primary)' }}>
                  📎 {t.attachments.length} attachment(s)
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
