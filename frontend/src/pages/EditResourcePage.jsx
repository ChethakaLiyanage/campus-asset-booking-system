import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ResourceForm from '../components/ResourceForm'
import { resourceService } from '../services/resourceService'
import toast from 'react-hot-toast'

/**
 * EditResourcePage — Admin-only page to edit an existing resource.
 * Pre-fills form with existing data from API.
 */
export default function EditResourcePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [resource, setResource] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Fetch existing resource data
  useEffect(() => {
    resourceService.getById(id)
      .then(res => setResource(res.data.data))
      .catch(() => {
        toast.error('Resource not found')
        navigate('/resources')
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true)
      await resourceService.update(id, formData)
      toast.success('✅ Resource updated successfully!')
      navigate('/resources')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update resource')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="loading-container"><div className="spinner" /></div>

  return (
    <div className="fade-in">
      <div className="page-header">
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/resources')}
                style={{ marginBottom: '1rem' }}>
          ← Back to Resources
        </button>
        <h1>✏️ Edit Resource</h1>
        <p>Update details for: <strong style={{ color: 'var(--color-primary)' }}>{resource?.name}</strong></p>
      </div>

      <div className="card" style={{ maxWidth: '760px' }}>
        <ResourceForm
          initialData={{
            name: resource.name || '',
            type: resource.type || 'LECTURE_HALL',
            location: resource.location || '',
            capacity: resource.capacity || 1,
            description: resource.description || '',
            status: resource.status || 'ACTIVE',
            availableFrom: resource.availableFrom || '08:00',
            availableTo: resource.availableTo || '20:00',
            features: resource.features || [],
          }}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitLabel="Update Resource"
        />
      </div>
    </div>
  )
}
