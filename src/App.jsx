import { useState } from 'react'
import { login, getProfile } from './services/api'
import LoginForm from './components/LoginForm'
import AppShell from './components/AppShell'
import ProtectedView from './components/ProtectedView'
import AdminDashboard from './components/AdminDashboard'
import LearnerDashboard from './components/LearnerDashboard'
import './App.css'

function App() {
  const [session, setSession] = useState(null)
  const [message, setMessage] = useState('')

  async function handleLogin(email, password) {
    const result = await login(email, password)
    if (!result.token || !result.data?.user?.role) {
      throw new Error('The server did not return a token and user role.')
    }
    setSession({ token: result.token, user: result.data.user })
    setMessage('')
  }

  function handleLogout() {
    setSession(null)
    setMessage('')
  }

  async function handleCheckProfile() {
    try {
      const result = await getProfile(session.token)
      setMessage('Profile checked: ' + result.data.user.name)
    } catch (error) {
      if (error.status === 401) {
        handleLogout()
      } else if (error.status === 403) {
        setMessage('Access denied (403). Your session is still active.')
      } else {
        setMessage(error.message)
      }
    }
  }

  if (!session) return <LoginForm onLogin={handleLogin} />

  return (
    <AppShell user={session.user} onLogout={handleLogout} onCheckProfile={handleCheckProfile}>
      {message && <p className="notice" role="status">{message}</p>}
      <ProtectedView session={session} allowedRoles={['admin', 'learner']}>
        {session.user.role === 'admin' && <AdminDashboard user={session.user} />}
        {session.user.role === 'learner' && <LearnerDashboard user={session.user} />}
      </ProtectedView>
    </AppShell>
  )
}

export default App
