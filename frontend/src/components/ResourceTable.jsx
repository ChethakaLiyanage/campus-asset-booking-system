import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const TYPE_EMOJI = {
  LECTURE_HALL: '🏛️',
  LAB: '🔬',
  MEETING_ROOM: '🗣️',
  EQUIPMENT: '📷',
}

const STATUS_BADGE = {
  ACTIVE: 'approved',
  OUT_OF_SERVICE: 'rejected',
  UNDER_MAINTENANCE: 'pending',
}

/**
 * ResourceTable — Displays resources in a table view with edit/delete/status actions.
 * Used by ResourcesPage.
 */
export default function ResourceTable({ resources, onDelete, onStatusChange }) {
  const { isAdmin } = useAuth()

  if (resources.length === 0) {
    return (
      <div className="empty-state">
        <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🏢</div>
        <h3>No resources found</h3>
        <p>Try adjusting your search or filters.</p>
      </div>
    )
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Resource</th>
            <th>Type</th>
            <th>Location</th>
            <th>Capacity</th>
            <th>Available Hours</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {resources.map(r => (
            <tr key={r.id}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{TYPE_EMOJI[r.type] || '🏢'}</span>
                  <div>
                    <div style={{ fontWeight: 600 }}>{r.name}</div>
                    {r.description && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {r.description.slice(0, 40)}...
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td>
                <span className="badge badge-open">{r.type?.replace('_', ' ')}</span>
              </td>
              <td style={{ color: 'var(--color-text-secondary)' }}>📍 {r.location}</td>
              <td>
                <span style={{ fontWeight: 600 }}>👥 {r.capacity}</span>
              </td>
              <td style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                {r.availableFrom && r.availableTo
                  ? `${r.availableFrom} – ${r.availableTo}`
                  : '—'}
              </td>
              <td>
                {isAdmin ? (
                  <select
                    value={r.status}
                    onChange={e => onStatusChange(r.id, e.target.value)}
                    style={{
                      background: 'var(--color-bg-secondary)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-text-primary)',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="OUT_OF_SERVICE">OUT OF SERVICE</option>
                    <option value="UNDER_MAINTENANCE">UNDER MAINTENANCE</option>
                  </select>
                ) : (
                  <span className={`badge badge-${STATUS_BADGE[r.status]}`}>
                    {r.status?.replace('_', ' ')}
                  </span>
                )}
              </td>
              <td>
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <Link to={`/resources/${r.id}`} className="btn btn-primary btn-sm">
                    📅 Book
                  </Link>
                  {isAdmin && (
                    <>
                      <Link to={`/resources/${r.id}/edit`} className="btn btn-secondary btn-sm">
                        ✏️
                      </Link>
                      <button className="btn btn-danger btn-sm" onClick={() => onDelete(r.id)}
                              title="Delete resource">
                        🗑
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
