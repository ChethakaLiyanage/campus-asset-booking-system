import api from './api'

export const resourceService = {
  /** GET /api/resources - Get all resources with optional filters */
  getAll: (params = {}) => api.get('/api/resources', { params }),

  /** GET /api/resources/search?keyword= */
  search: (keyword) => api.get('/api/resources/search', { params: { keyword } }),

  /** GET /api/resources/:id */
  getById: (id) => api.get(`/api/resources/${id}`),

  /** POST /api/resources (Admin only) */
  create: (data) => api.post('/api/resources', data),

  /** PUT /api/resources/:id (Admin only) */
  update: (id, data) => api.put(`/api/resources/${id}`, data),

  /** PATCH /api/resources/:id/status (Admin only) */
  updateStatus: (id, status) => api.patch(`/api/resources/${id}/status`, null, { params: { status } }),

  /** DELETE /api/resources/:id (Admin only) */
  delete: (id) => api.delete(`/api/resources/${id}`),
}

