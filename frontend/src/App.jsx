import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ResourcesPage from './pages/ResourcesPage'
import ResourceDetailPage from './pages/ResourceDetailPage'
import AddResourcePage from './pages/AddResourcePage'
import EditResourcePage from './pages/EditResourcePage'
import BookingsPage from './pages/BookingsPage'
import TicketsPage from './pages/TicketsPage'
import TicketDetailPage from './pages/TicketDetailPage'
import NotificationsPage from './pages/NotificationsPage'
import AdminUsersPage from './pages/AdminUsersPage'
import OAuth2CallbackPage from './pages/OAuth2CallbackPage'
import NotFoundPage from './pages/NotFoundPage'

// Layout
import Layout from './components/Layout'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
      } />
      <Route path="/oauth2/callback" element={<OAuth2CallbackPage />} />

      {/* Protected routes (require login) */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/resources/new" element={<AddResourcePage />} />
        <Route path="/resources/:id" element={<ResourceDetailPage />} />
        <Route path="/resources/:id/edit" element={<EditResourcePage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/tickets" element={<TicketsPage />} />
        <Route path="/tickets/:id" element={<TicketDetailPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        {/* Admin only routes */}
        <Route path="/admin/users" element={<AdminUsersPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
