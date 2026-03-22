import api from './api'

export const bookingService = {
  /** GET /api/bookings (Admin only, with optional status filter) */
  getAll: (params = {}) => api.get('/api/bookings', { params }),

  /** GET /api/bookings/my - Current user's bookings */
  getMy: () => api.get('/api/bookings/my'),

  /** GET /api/bookings/:id */
  getById: (id) => api.get(`/api/bookings/${id}`),

  /** POST /api/bookings - Create booking request */
  create: (data) => api.post('/api/bookings', data),

  /** PATCH /api/bookings/:id/approve (Admin only) */
  approve: (id, note = '') => api.patch(`/api/bookings/${id}/approve`, { note }),

  /** PATCH /api/bookings/:id/reject (Admin only) */
  reject: (id, reason) => api.patch(`/api/bookings/${id}/reject`, { reason }),

  /** PATCH /api/bookings/:id/cancel */
  cancel: (id) => api.patch(`/api/bookings/${id}/cancel`),
}
