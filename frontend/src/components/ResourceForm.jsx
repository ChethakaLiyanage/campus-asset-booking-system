import { useState } from 'react'

const RESOURCE_TYPES = ['LECTURE_HALL', 'LAB', 'MEETING_ROOM', 'EQUIPMENT']
const STATUSES = ['ACTIVE', 'OUT_OF_SERVICE', 'UNDER_MAINTENANCE']
const FEATURES_OPTIONS = ['Projector', 'Whiteboard', 'AC', 'WiFi', 'Video Conferencing', 'Smart Board', 'PA System']

/**
 * ResourceForm — Reusable form for Add and Edit resource pages.
 * Handles both create (no initialData) and edit (with initialData) modes.
 */
export default function ResourceForm({ initialData = {}, onSubmit, submitting, submitLabel = 'Save' }) {
  const [form, setForm] = useState({
    name: '',
    type: 'LECTURE_HALL',
    location: '',
    capacity: 1,
    description: '',
    status: 'ACTIVE',
    availableFrom: '08:00',
    availableTo: '20:00',
    features: [],
    ...initialData,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleFeatureToggle = (feature) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature],
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ ...form, capacity: parseInt(form.capacity) })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Resource Name *</label>
          <input
            id="resource-name"
            name="name"
            className="form-input"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="e.g., Computer Lab A101"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Type *</label>
          <select id="resource-type" name="type" className="form-select"
                  value={form.type} onChange={handleChange}>
            {RESOURCE_TYPES.map(t => (
              <option key={t} value={t}>{t.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Location *</label>
          <input
            id="resource-location"
            name="location"
            className="form-input"
            required
            value={form.location}
            onChange={handleChange}
            placeholder="e.g., Block A, Floor 1"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Capacity * (max persons)</label>
          <input
            id="resource-capacity"
            name="capacity"
            type="number"
            min={1}
            max={500}
            className="form-input"
            required
            value={form.capacity}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          id="resource-description"
          name="description"
          className="form-textarea"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the resource, equipment available, special notes..."
        />
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Available From</label>
          <input id="resource-from" name="availableFrom" type="time"
                 className="form-input" value={form.availableFrom} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Available To</label>
          <input id="resource-to" name="availableTo" type="time"
                 className="form-input" value={form.availableTo} onChange={handleChange} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Status</label>
        <select id="resource-status" name="status" className="form-select"
                value={form.status} onChange={handleChange}>
          {STATUSES.map(s => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      {/* Features */}
      <div className="form-group">
        <label className="form-label">Features / Amenities</label>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          {FEATURES_OPTIONS.map(feature => (
            <button
              key={feature}
              type="button"
              className={`btn btn-sm ${form.features.includes(feature) ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleFeatureToggle(feature)}
            >
              {form.features.includes(feature) ? '✓ ' : ''}{feature}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <button
          id="resource-submit-btn"
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
          style={{ minWidth: '160px', justifyContent: 'center' }}
        >
          {submitting ? '⏳ Saving...' : `💾 ${submitLabel}`}
        </button>
      </div>
    </form>
  )
}
