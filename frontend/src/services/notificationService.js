import api from './api'

export const notificationService = {
  /** GET /api/notifications - All notifications for current user */
  getAll: () => api.get('/api/notifications'),

  /** GET /api/notifications/unread */
  getUnread: () => api.get('/api/notifications/unread'),

  /** GET /api/notifications/count - Unread badge count */
  getCount: () => api.get('/api/notifications/count'),

  /** PATCH /api/notifications/:id/read */
  markAsRead: (id) => api.patch(`/api/notifications/${id}/read`),

  /** PATCH /api/notifications/read-all */
  markAllAsRead: () => api.patch('/api/notifications/read-all'),

  /** DELETE /api/notifications/:id */
  delete: (id) => api.delete(`/api/notifications/${id}`),
}
