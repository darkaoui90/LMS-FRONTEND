function CourseCard({ course, selected, onSelect }) {
  return <button type="button" className={'course-card ' + (selected ? 'selected' : '')} onClick={() => onSelect(course._id)}>
    <strong>{course.title}</strong>
    <span>{course.category} · {course.level}</span>
    <span>Status: {course.status}</span>
    <span>Trainer ID: {course.trainer || 'Not available'}</span>
  </button>
}

export default CourseCard
