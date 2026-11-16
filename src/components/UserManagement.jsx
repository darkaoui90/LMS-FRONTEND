import UserForm from './UserForm'
import { registerLearner } from '../services/api'

function UserManagement() {
  return <section>
    <p className="eyebrow">PEOPLE</p>
    <h1>Users</h1>
    <p className="page-subtitle">Add a learner to your LMS.</p>
    <div className="info-callout">
      <strong>About the user list</strong>
      <p>This backend has no route to list, edit, activate, or suspend users. A real user list and filters cannot be shown yet. The registration route below is public on the backend.</p>
    </div>
    <UserForm onSubmit={registerLearner} />
  </section>
}

export default UserManagement
