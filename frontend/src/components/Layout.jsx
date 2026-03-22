import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

/**
 * Layout - Main app shell with sidebar + top navbar.
 * All authenticated pages render inside the <Outlet />.
 */
export default function Layout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main className="main-content fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
