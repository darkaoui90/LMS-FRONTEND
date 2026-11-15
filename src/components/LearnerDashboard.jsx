import InfoCard from './InfoCard'

const courses = [
  { id: 'html', title: 'HTML basics', detail: 'Example course · Not an enrollment' },
  { id: 'react', title: 'React basics', detail: 'Example course · Not an enrollment' },
]

function LearnerDashboard({ user }) {
  return <section>
    <p className="eyebrow">Learner dashboard</p>
    <h1>Hello, {user.name}</h1>
    <p className="intro">My courses will use real enrollment data on Day 5. These are examples.</p>
    <div className="card-grid">{courses.map((course) => <InfoCard key={course.id} title={course.title} detail={course.detail} />)}</div>
  </section>
}
export default LearnerDashboard
