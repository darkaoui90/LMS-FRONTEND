function ProtectedView({ session, allowedRoles, children }) {
  if (!session || !allowedRoles.includes(session.user.role)) {
    return <p className="error" role="alert">Access denied.</p>
  }
  return children
}

export default ProtectedView
