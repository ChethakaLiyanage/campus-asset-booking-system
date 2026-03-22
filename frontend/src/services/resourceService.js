import api from './api'

export const resourceService = {
  /** GET /api/resources - Get all resources with optional filters */
  getAll: (params = {}) => api.get('/api/resources', { params }),

  /** GET /api/resources/:id */
  getById: (id) => api.get(`/api/resources/${id}`),

  /** POST /api/resources (Admin only) */
  create: (data) => api.post('/api/resources', data),

  /** PUT /api/resources/:id (Admin only) */
  update: (id, data) => api.put(`/api/resources/${id}`, data),

  /** DELETE /api/resources/:id (Admin only) */
  delete: (id) => api.delete(`/api/resources/${id}`),
}
