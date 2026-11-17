function EnrollmentCard({ enrollment }) {
  const course = enrollment.course

  return <article className="enrollment-card">
    <div className="enrollment-top">
      <span className="course-icon">C</span>
      <span className={'status-badge ' + enrollment.status}>{enrollment.status}</span>
    </div>
    <h3>{course ? course.title : 'Course unavailable'}</h3>
    <p>{course ? course.description : 'This course is no longer available.'}</p>
    <div className="enrollment-footer">
      <span>Enrollment: {enrollment.status}</span>
      {course && <span>Course: {course.status}</span>}
    </div>
  </article>
}

export default EnrollmentCard
