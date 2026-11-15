function AppShell({ user, onLogout, onCheckProfile, children }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <strong>EduLearn LMS</strong>
        <div className="top-actions">
          <span>{user.name} · {user.role}</span>
          <button type="button" className="secondary" onClick={onCheckProfile}>Check profile</button>
          <button type="button" onClick={onLogout}>Log out</button>
        </div>
      </header>
      <main className="page-content">{children}</main>
    </div>
  )
}

export default AppShell
