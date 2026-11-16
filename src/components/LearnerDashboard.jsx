import InfoCard from './InfoCard'

const courses = [
  { id: 'html', title: 'HTML basics', detail: 'Example course · Not an enrollment' },
  { id: 'react', title: 'React basics', detail: 'Example course · Not an enrollment' },
]

function LearnerDashboard({ user }) {
  return <section>
    <div className="welcome-banner learner-banner">
      <p className="eyebrow">LEARNER SPACE</p>
      <h1>Keep going, {user.name}</h1>
      <p>Your learning journey starts here.</p>
    </div>
    <div className="section-heading"><div><p className="eyebrow">EXPLORE</p><h2>Course examples</h2></div></div>
    <p className="muted">Real “My courses” enrollment data is planned for Day 5. These cards are examples.</p>
    <div className="card-grid">{courses.map((course) => <InfoCard key={course.id} title={course.title} detail={course.detail} />)}</div>
  </section>
}
export default LearnerDashboard
