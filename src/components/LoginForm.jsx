import { useState } from 'react'

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    if (!email.trim() || !password) {
      setError('Enter your email and password.')
      return
    }
    setBusy(true)
    setError('')
    try {
      await onLogin(email.trim(), password)
    } catch (problem) {
      if (problem.status === 401 || problem.status === 400) {
        setError('Email or password is incorrect.')
      } else if (problem.status === 403) {
        setError('Access denied (403). Please contact your administrator.')
      } else {
        setError(problem.message || 'Cannot reach the server.')
      }
    } finally {
      setPassword('')
      setBusy(false)
    }
  }

  return (
    <main className="login-page">
      <div className="login-card">
        <p className="eyebrow">EduLearn LMS</p>
        <h1>Welcome back</h1>
        <p>Sign in with your LMS account.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
          {error && <p className="error" role="alert">{error}</p>}
          <button type="submit" disabled={busy}>{busy ? 'Signing in...' : 'Sign in'}</button>
        </form>
      </div>
    </main>
  )
}

export default LoginForm
