import { useState } from 'react'
import InfoCard from './InfoCard'
import UserManagement from './UserManagement'
import CourseManagement from './CourseManagement'

function AdminDashboard({ user, token, onUnauthorized }) {
  const [view, setView] = useState('home')

  return <div className="dashboard-layout">
    <aside className="sidebar">
      <p className="sidebar-label">WORKSPACE</p>
      <nav className="view-menu" aria-label="Admin pages">
        <button type="button" className={view === 'home' ? 'active' : ''} onClick={() => setView('home')}><span>01</span> Overview</button>
        <button type="button" className={view === 'users' ? 'active' : ''} onClick={() => setView('users')}><span>02</span> Users</button>
        <button type="button" className={view === 'courses' ? 'active' : ''} onClick={() => setView('courses')}><span>03</span> Courses</button>
      </nav>
      <div className="sidebar-note">
        <strong>Admin workspace</strong>
        <p>Manage the parts of your LMS that this backend supports.</p>
      </div>
    </aside>
    <div className="dashboard-main">
      {view === 'home' && <>
        <div className="welcome-banner">
          <p className="eyebrow">ADMIN OVERVIEW</p>
          <h1>Welcome back, {user.name}</h1>
          <p>Your learning platform is ready. Choose an area to get started.</p>
        </div>
        <div className="section-heading"><div><p className="eyebrow">QUICK ACCESS</p><h2>Your workspace</h2></div></div>
        <div className="card-grid">
          <InfoCard title="Learner accounts" detail="Register a new learner from the Users page." />
          <InfoCard title="Course catalog" detail="View, create, and update real courses." />
        </div>
        <div className="tip-card"><strong>Getting started</strong><p>Open Courses, then click Load courses to see what is in your database.</p></div>
      </>}
      {view === 'users' && <UserManagement />}
      {view === 'courses' && <CourseManagement token={token} onUnauthorized={onUnauthorized} />}
    </div>
  </div>
}

export default AdminDashboard
