import api from './api'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export const authService = {
  /** Get current user info (also triggers OAuth2 user registration on backend) */
  getMe: (token) => {
    return axios.get(`${API_BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
  },

  /** Get all users (Admin only) */
  getAllUsers: () => api.get('/api/auth/users'),

  /** Update user roles (Admin only) */
  updateUserRoles: (userId, roles) =>
    api.put(`/api/auth/users/${userId}/roles`, { roles }),

  /** Initiate Google OAuth2 login (redirects to Spring Boot) */
  googleLogin: () => {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`
  },
}
