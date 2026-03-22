import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { resourceService } from '../services/resourceService'
import { useAuth } from '../context/AuthContext'
import SearchBar from '../components/SearchBar'
import ResourceTable from '../components/ResourceTable'
import toast from 'react-hot-toast'

const RESOURCE_TYPES = ['ALL', 'LECTURE_HALL', 'LAB', 'MEETING_ROOM', 'EQUIPMENT']
const STATUSES = ['ALL', 'ACTIVE', 'OUT_OF_SERVICE', 'UNDER_MAINTENANCE']

const TYPE_EMOJI = {
  LECTURE_HALL: '🏛️', LAB: '🔬', MEETING_ROOM: '🗣️', EQUIPMENT: '📷'
}
const STATUS_BADGE = {
  ACTIVE: 'approved', OUT_OF_SERVICE: 'rejected', UNDER_MAINTENANCE: 'pending'
}

/**
 * ResourcesPage — Module A: Facilities & Assets Catalogue
 * Features: Search, Filter by Type/Status, Card/Table view toggle, Admin CRUD
 * Author: Member 1
 */
export default function ResourcesPage() {
  const { isAdmin } = useAuth()
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('ALL')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [viewMode, setViewMode] = useState('card') // 'card' | 'table'

  // Fetch from API whenever filter changes
  const fetchResources = useCallback(async () => {
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
  }, [filterType, filterStatus])

  useEffect(() => { fetchResources() }, [fetchResources])

  // Keyword search is client-side after API returns
  const filtered = resources.filter(r =>
    !search ||
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.location?.toLowerCase().includes(search.toLowerCase()) ||
    r.description?.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return
    try {
      await resourceService.delete(id)
      toast.success('Resource deleted')
      fetchResources()
    } catch {
      toast.error('Failed to delete resource')
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await resourceService.updateStatus(id, status)
      toast.success(`Status updated to ${status.replace('_', ' ')}`)
      fetchResources()
    } catch {
      toast.error('Failed to update status')
    }
  }

  // Summary stats
  const total = resources.length
  const active = resources.filter(r => r.status === 'ACTIVE').length
  const outOfService = resources.filter(r => r.status === 'OUT_OF_SERVICE').length

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1>🏢 Facilities & Assets</h1>
            <p>Browse and book campus resources — rooms, labs, equipment</p>
          </div>
          {isAdmin && (
            <Link to="/resources/new" className="btn btn-primary" id="add-resource-btn">
              + Add Resource
            </Link>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Resources', value: total, icon: '🏢', color: 'var(--color-primary)' },
          { label: 'Active', value: active, icon: '✅', color: 'var(--color-success)' },
          { label: 'Out of Service', value: outOfService, icon: '❌', color: 'var(--color-danger)' },
          { label: 'Under Maintenance', value: total - active - outOfService, icon: '🔧', color: 'var(--color-warning)' },
        ].map(stat => (
          <div key={stat.label} className="card" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
              </div>
              <span style={{ fontSize: '1.75rem' }}>{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters + Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Keyword Search */}
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="🔍 Search by name, location, description..."
          />

          {/* Type Filter */}
          <select
            id="filter-type"
            className="form-select"
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            style={{ width: 'auto' }}
          >
            {RESOURCE_TYPES.map(t => (
              <option key={t} value={t}>{t === 'ALL' ? 'All Types' : t.replace('_', ' ')}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            id="filter-status"
            className="form-select"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{ width: 'auto' }}
          >
            {STATUSES.map(s => (
              <option key={s} value={s}>{s === 'ALL' ? 'All Statuses' : s.replace('_', ' ')}</option>
            ))}
          </select>

          {/* View Toggle */}
          <div style={{ display: 'flex', gap: '0.25rem', marginLeft: 'auto' }}>
            <button
              id="view-card-btn"
              className={`btn btn-sm ${viewMode === 'card' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('card')}
              title="Card view"
            >
              ⊞
            </button>
            <button
              id="view-table-btn"
              className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('table')}
              title="Table view"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Active Filter Tags */}
        {(search || filterType !== 'ALL' || filterStatus !== 'ALL') && (
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.875rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Active filters:</span>
            {search && (
              <span className="badge badge-open">
                🔍 "{search}" <button onClick={() => setSearch('')}
                  style={{ marginLeft: '0.25rem', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>×</button>
              </span>
            )}
            {filterType !== 'ALL' && (
              <span className="badge badge-open">
                Type: {filterType} <button onClick={() => setFilterType('ALL')}
                  style={{ marginLeft: '0.25rem', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>×</button>
              </span>
            )}
            {filterStatus !== 'ALL' && (
              <span className="badge badge-open">
                Status: {filterStatus} <button onClick={() => setFilterStatus('ALL')}
                  style={{ marginLeft: '0.25rem', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>×</button>
              </span>
            )}
            <button className="btn btn-secondary btn-sm" onClick={() => {
              setSearch(''); setFilterType('ALL'); setFilterStatus('ALL')
            }}>Clear all</button>
          </div>
        )}
      </div>

      {/* Results count */}
      <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
        Showing <strong style={{ color: 'var(--color-text-primary)' }}>{filtered.length}</strong> of {total} resources
      </div>

      {/* ======================== */}
      {/* CONTENT */}
      {/* ======================== */}
      {loading ? (
        <div className="loading-container"><div className="spinner" /></div>

      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <ResourceTable
          resources={filtered}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />

      ) : (
        /* CARD VIEW */
        filtered.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏢</div>
            <h3>No resources found</h3>
            <p>Try adjusting your search or filters.</p>
            {isAdmin && (
              <Link to="/resources/new" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                + Add First Resource
              </Link>
            )}
          </div>
        ) : (
          <div className="grid-3">
            {filtered.map(r => (
              <div key={r.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Card Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2.5rem' }}>{TYPE_EMOJI[r.type] || '🏢'}</span>
                  <span className={`badge badge-${STATUS_BADGE[r.status]}`}>
                    {r.status?.replace('_', ' ')}
                  </span>
                </div>

                {/* Name + Location */}
                <h3 style={{ marginBottom: '0.25rem' }}>{r.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                  📍 {r.location}
                </p>

                {/* Description */}
                {r.description && (
                  <p style={{ fontSize: '0.85rem', marginBottom: '0.75rem', flexGrow: 1, lineHeight: 1.5 }}>
                    {r.description.slice(0, 80)}{r.description.length > 80 ? '...' : ''}
                  </p>
                )}

                {/* Badges */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <span className="badge badge-open">👥 Cap: {r.capacity}</span>
                  <span className="badge badge-open">{r.type?.replace('_', ' ')}</span>
                  {r.availableFrom && <span className="badge badge-open">🕐 {r.availableFrom}–{r.availableTo}</span>}
                </div>

                {/* Feature chips */}
                {r.features?.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {r.features.slice(0, 3).map(f => (
                      <span key={f} style={{
                        fontSize: '0.7rem', padding: '0.2rem 0.5rem',
                        background: 'rgba(59,130,246,0.1)', borderRadius: '4px',
                        color: 'var(--color-primary)', border: '1px solid rgba(59,130,246,0.2)',
                      }}>
                        {f}
                      </span>
                    ))}
                    {r.features.length > 3 && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                        +{r.features.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                  {r.status === 'ACTIVE' ? (
                    <Link to={`/resources/${r.id}`} className="btn btn-primary btn-sm"
                          style={{ flex: 1, justifyContent: 'center' }}>
                      📅 Book Now
                    </Link>
                  ) : (
                    <button className="btn btn-secondary btn-sm"
                            style={{ flex: 1, justifyContent: 'center' }} disabled>
                      Unavailable
                    </button>
                  )}
                  {isAdmin && (
                    <>
                      <Link to={`/resources/${r.id}/edit`} className="btn btn-secondary btn-sm"
                            title="Edit resource">✏️</Link>
                      <button className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(r.id)} title="Delete resource">🗑</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}
