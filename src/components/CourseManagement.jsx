import { useState } from 'react'
import { getAdminCourses, saveCourse, changeCourseStatus } from '../services/api'
import CourseList from './CourseList'
import CourseForm from './CourseForm'

function CourseManagement({ token, onUnauthorized }) {
  const [courses, setCourses] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedId, setSelectedId] = useState(null)
  const [editing, setEditing] = useState(false)

  const visibleCourses = courses.filter((course) => {
    const categoryMatches = course.category.toLowerCase().includes(categoryFilter.toLowerCase())
    const statusMatches = statusFilter === 'all' || course.status === statusFilter
    return categoryMatches && statusMatches
  })
  const selectedCourse = courses.find((course) => course._id === selectedId)

  async function loadCourses() {
    setLoading(true)
    setError('')
    try {
      const result = await getAdminCourses(token)
      setCourses(result.data.courses)
      setLoaded(true)
    } catch (problem) {
      if (problem.status === 401) {
        onUnauthorized()
      } else if (problem.status === 403) {
        setError('Access denied (403).')
      } else {
        setError(problem.message || 'Could not load courses.')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(courseId, fields) {
    try {
      const result = await saveCourse(token, courseId, fields)
      const saved = result.data.course
      setCourses((current) => courseId
        ? current.map((item) => item._id === saved._id ? saved : item)
        : [saved, ...current])
      setLoaded(true)
      setSelectedId(saved._id)
      setEditing(false)
      setMessage(result.message || 'Course saved.')
      await loadCourses()
    } catch (problem) {
      if (problem.status === 401) onUnauthorized()
      throw problem
    }
  }

  async function handleStatus(action) {
    if (!selectedCourse) return
    if (!window.confirm('Are you sure you want to ' + action + ' this course?')) return
    setError('')
    setMessage('')
    try {
      const result = await changeCourseStatus(token, selectedCourse._id, action)
      const saved = result.data.course
      setCourses((current) => current.map((item) => item._id === saved._id ? saved : item))
      setMessage(result.message || 'Course updated.')
      await loadCourses()
    } catch (problem) {
      if (problem.status === 401) onUnauthorized()
      else if (problem.status === 403) setError('Access denied (403).')
      else setError(problem.message || 'Could not change the course.')
    }
  }

  return <section>
    <div className="section-heading">
      <h2>Courses</h2>
      <div className="button-row">
        <button type="button" onClick={loadCourses} disabled={loading}>{loading ? 'Loading...' : 'Load courses'}</button>
        <button type="button" className="secondary" onClick={() => setEditing('new')}>New course</button>
      </div>
    </div>
    {error && <p className="error" role="alert">{error}</p>}
    {message && <p className="notice" role="status">{message}</p>}
    {loading && <p>Loading courses...</p>}
    {loaded && <>
      <div className="filter-row">
        <label htmlFor="category-filter">Filter category</label>
        <input id="category-filter" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} placeholder="Type a category" />
        <label htmlFor="status-filter">Filter status</label>
        <select id="status-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="all">All</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      <div className="management-grid">
        <CourseList courses={visibleCourses} selectedId={selectedId} onSelect={setSelectedId} />
        <div className="detail-panel">
          {selectedCourse ? <>
            <h3>{selectedCourse.title}</h3>
            <p>{selectedCourse.description}</p>
            <p>Category: {selectedCourse.category}</p>
            <p>Level: {selectedCourse.level}</p>
            <p>Status: {selectedCourse.status}</p>
            <p>Trainer ID: {selectedCourse.trainer || 'Not available'}</p>
            <p>Duration: {selectedCourse.estimatedDuration} minutes</p>
            <h4>Objectives</h4>
            <p>{selectedCourse.objectives.join(', ')}</p>
            <div className="button-row">
              <button type="button" onClick={() => setEditing(selectedCourse._id)}>Edit</button>
              {selectedCourse.status === 'published' && <button type="button" className="secondary" onClick={() => handleStatus('unpublish')}>Unpublish</button>}
              {selectedCourse.status !== 'archived' && <button type="button" className="secondary" onClick={() => handleStatus('archived')}>Archive</button>}
            </div>
          </> : <p>Select a course to see its details.</p>}
        </div>
      </div>
    </>}
    {editing && <CourseForm key={editing} course={editing === 'new' ? null : courses.find((course) => course._id === editing)} onSave={handleSave} onCancel={() => setEditing(false)} />}
  </section>
}

export default CourseManagement
