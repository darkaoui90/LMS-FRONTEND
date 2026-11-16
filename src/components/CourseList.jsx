import CourseCard from './CourseCard'

function CourseList({ courses, selectedId, onSelect }) {
  if (courses.length === 0) return <p>No courses match these filters.</p>
  return <div className="course-list">
    {courses.map((course) => <CourseCard key={course._id} course={course} selected={course._id === selectedId} onSelect={onSelect} />)}
  </div>
}

export default CourseList
