import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ResourceForm from '../components/ResourceForm'
import { resourceService } from '../services/resourceService'
import toast from 'react-hot-toast'

/**
 * AddResourcePage — Admin-only page to add a new resource.
 * Navigates back to /resources on success.
 */
export default function AddResourcePage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true)
      await resourceService.create(formData)
      toast.success('✅ Resource created successfully!')
      navigate('/resources')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create resource')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/resources')}
                style={{ marginBottom: '1rem' }}>
          ← Back to Resources
        </button>
        <h1>🏢 Add New Resource</h1>
        <p>Create a new facility or asset in the campus catalogue</p>
      </div>

      <div className="card" style={{ maxWidth: '760px' }}>
        <ResourceForm
          onSubmit={handleSubmit}
          submitting={submitting}
          submitLabel="Create Resource"
        />
      </div>
    </div>
  )
}
