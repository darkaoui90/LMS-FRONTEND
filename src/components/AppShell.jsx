function AppShell({ user, onLogout, onCheckProfile, children }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">E</span>
          <span><strong>EduLearn</strong><small>Learning management</small></span>
        </div>
        <div className="top-actions">
          <button type="button" className="text-button" onClick={onCheckProfile}>Check profile</button>
          <span className="user-avatar" aria-hidden="true">{user.name.charAt(0).toUpperCase()}</span>
          <span className="user-label"><strong>{user.name}</strong><small>{user.role}</small></span>
          <button type="button" className="outline-button" onClick={onLogout}>Log out</button>
        </div>
      </header>
      <main className="page-content">{children}</main>
    </div>
  )
}

export default AppShell
