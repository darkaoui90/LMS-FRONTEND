function CourseCard({ course, selected, onSelect }) {
  return <button type="button" className={'course-card ' + (selected ? 'selected' : '')} onClick={() => onSelect(course._id)}>
    <span className="course-card-top"><span className="course-icon">C</span><span className={'status-badge ' + course.status}>{course.status}</span></span>
    <strong>{course.title}</strong>
    <span className="muted">{course.category} · {course.level}</span>
    <span className="course-card-footer">Trainer ID: {course.trainer || 'Not available'}</span>
  </button>
}

export default CourseCard
