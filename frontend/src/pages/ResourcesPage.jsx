import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { resourceService } from '../services/resourceService'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const RESOURCE_TYPES = ['ALL', 'LECTURE_HALL', 'LAB', 'MEETING_ROOM', 'EQUIPMENT']
const STATUSES = ['ALL', 'ACTIVE', 'OUT_OF_SERVICE', 'UNDER_MAINTENANCE']

export default function ResourcesPage() {
  const { isAdmin } = useAuth()
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('ALL')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [search, setSearch] = useState('')

  useEffect(() => { fetchResources() }, [filterType, filterStatus])

  const fetchResources = async () => {
    try {
      setLoading(true)
      const params = {}
      if (filterType !== 'ALL') params.type = filterType
      if (filterStatus !== 'ALL') params.status = filterStatus
      const res = await resourceService.getAll(params)
      setResources(res.data.data || [])
    } catch {
      toast.error('Failed to load resources')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resource?')) return
    try {
      await resourceService.delete(id)
      toast.success('Resource deleted')
      fetchResources()
    } catch {
      toast.error('Failed to delete resource')
    }
  }

  const filtered = resources.filter(r =>
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.location?.toLowerCase().includes(search.toLowerCase())
  )

  const typeEmoji = { LECTURE_HALL: '🏛️', LAB: '🔬', MEETING_ROOM: '🗣️', EQUIPMENT: '📷' }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1>🏢 Resources</h1>
            <p>Browse and book available campus facilities and equipment</p>
          </div>
          {isAdmin && (
            <Link to="/resources/new" className="btn btn-primary">+ Add Resource</Link>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input className="form-input" placeholder="🔍 Search by name or location..."
               value={search} onChange={e => setSearch(e.target.value)}
               style={{ flex: 1, minWidth: '200px' }} />
        <select className="form-select" value={filterType} onChange={e => setFilterType(e.target.value)}
                style={{ width: 'auto' }}>
          {RESOURCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className="form-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                style={{ width: 'auto' }}>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Resource Grid */}
      {loading ? (
        <div className="loading-container"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <p>No resources found matching your filters.</p>
        </div>
      ) : (
        <div className="grid-3">
          {filtered.map(r => (
            <div key={r.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ fontSize: '2.5rem' }}>{typeEmoji[r.type] || '🏢'}</div>
                <span className={`badge badge-${r.status === 'ACTIVE' ? 'approved' : r.status === 'OUT_OF_SERVICE' ? 'rejected' : 'pending'}`}>
                  {r.status?.replace('_', ' ')}
                </span>
              </div>
              <h3 style={{ marginBottom: '0.375rem' }}>{r.name}</h3>
              <p style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>📍 {r.location}</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <span className="badge badge-open">👥 {r.capacity}</span>
                <span className="badge badge-open">{r.type?.replace('_', ' ')}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to={`/resources/${r.id}`} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                  Book Now
                </Link>
                {isAdmin && (
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)}>🗑</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
