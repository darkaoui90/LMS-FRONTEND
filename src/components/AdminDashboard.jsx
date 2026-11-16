import { useState } from 'react'
import InfoCard from './InfoCard'
import UserManagement from './UserManagement'
import CourseManagement from './CourseManagement'

function AdminDashboard({ user, token, onUnauthorized }) {
  const [view, setView] = useState('home')

  return <section>
    <p className="eyebrow">Admin dashboard</p>
    <h1>Hello, {user.name}</h1>
    <nav className="view-menu" aria-label="Admin pages">
      <button type="button" className={view === 'home' ? '' : 'secondary'} onClick={() => setView('home')}>Home</button>
      <button type="button" className={view === 'users' ? '' : 'secondary'} onClick={() => setView('users')}>Users</button>
      <button type="button" className={view === 'courses' ? '' : 'secondary'} onClick={() => setView('courses')}>Courses</button>
    </nav>
    {view === 'home' && <div className="card-grid">
      <InfoCard title="Users" detail="Open Users to register a learner." />
      <InfoCard title="Courses" detail="Open Courses to manage real course data." />
    </div>}
    {view === 'users' && <UserManagement />}
    {view === 'courses' && <CourseManagement token={token} onUnauthorized={onUnauthorized} />}
  </section>
}

export default AdminDashboard
