import api from './api'

export const ticketService = {
  /** GET /api/tickets (Admin/Technician, with optional filters) */
  getAll: (params = {}) => api.get('/api/tickets', { params }),

  /** GET /api/tickets/my */
  getMy: () => api.get('/api/tickets/my'),

  /** GET /api/tickets/:id */
  getById: (id) => api.get(`/api/tickets/${id}`),

  /**
   * POST /api/tickets - Create ticket (multipart with attachments)
   * @param {object} ticketData - Ticket DTO
   * @param {File[]} attachments - Up to 3 files
   */
  create: (ticketData, attachments = []) => {
    const formData = new FormData()
    formData.append('ticket', new Blob([JSON.stringify(ticketData)], { type: 'application/json' }))
    attachments.forEach((file) => formData.append('attachments', file))
    return api.post('/api/tickets', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  /** PATCH /api/tickets/:id/status - Update ticket status */
  updateStatus: (id, status, resolutionNotes, rejectionReason) =>
    api.patch(`/api/tickets/${id}/status`, { status, resolutionNotes, rejectionReason }),

  /** PATCH /api/tickets/:id/assign - Assign to technician */
  assign: (id, technicianId, technicianName) =>
    api.patch(`/api/tickets/${id}/assign`, { technicianId, technicianName }),

  /** POST /api/tickets/:id/comments - Add a comment */
  addComment: (id, text) => api.post(`/api/tickets/${id}/comments`, { text }),

  /** DELETE /api/tickets/:id/comments/:commentId */
  deleteComment: (ticketId, commentId) =>
    api.delete(`/api/tickets/${ticketId}/comments/${commentId}`),
}
