import InfoCard from './InfoCard'

const cards = [
  { id: 'users', title: 'Users', detail: 'User management comes on Day 3.' },
  { id: 'courses', title: 'Courses', detail: 'Course management comes on Day 4.' },
  { id: 'activity', title: 'Activity', detail: 'This is a static example card.' },
]

function AdminDashboard({ user }) {
  return <section>
    <p className="eyebrow">Admin dashboard</p>
    <h1>Hello, {user.name}</h1>
    <p className="intro">A simple overview. These cards use mock data.</p>
    <div className="card-grid">{cards.map((card) => <InfoCard key={card.id} title={card.title} detail={card.detail} />)}</div>
  </section>
}
export default AdminDashboard
