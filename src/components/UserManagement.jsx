import UserForm from './UserForm'
import { registerLearner } from '../services/api'

function UserManagement() {
  return <section>
    <h2>Users</h2>
    <p className="notice">This backend has no route to list, edit, activate, or suspend users. A real user list and filters cannot be shown yet.</p>
    <p>The existing registration route can create a learner. It is public on the backend, so this page is not an Admin-only API operation.</p>
    <UserForm onSubmit={registerLearner} />
  </section>
}

export default UserManagement
