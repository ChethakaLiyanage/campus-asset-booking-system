import { useEffect, useState } from 'react'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

const ALL_ROLES = ['USER', 'ADMIN', 'TECHNICIAN', 'MANAGER']

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authService.getAllUsers()
      .then(res => setUsers(res.data.data || []))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false))
  }, [])

  const handleRoleToggle = async (userId, currentRoles, role) => {
    const newRoles = currentRoles.includes(role)
      ? currentRoles.filter(r => r !== role)
      : [...currentRoles, role]
    if (newRoles.length === 0) { toast.error('User must have at least one role'); return }
    try {
      await authService.updateUserRoles(userId, newRoles)
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, roles: newRoles } : u))
      toast.success('Roles updated')
    } catch {
      toast.error('Failed to update roles')
    }
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>👥 Manage Users</h1>
        <p>View all registered users and manage their roles</p>
      </div>

      {loading ? (
        <div className="loading-container"><div className="spinner" /></div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Provider</th>
                <th>Roles</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      {u.profilePicture ? (
                        <img src={u.profilePicture} alt={u.name} style={{ width: 32, height: 32, borderRadius: '50%' }} />
                      ) : (
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', color: 'white' }}>
                          {u.name?.[0]}
                        </div>
                      )}
                      <span style={{ fontWeight: 500 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{u.email}</td>
                  <td><span className="badge badge-open">{u.provider || 'google'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                      {ALL_ROLES.map(role => (
                        <button key={role}
                                className={`btn btn-sm ${u.roles?.includes(role) ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => handleRoleToggle(u.id, u.roles || [], role)}>
                          {role}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
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
