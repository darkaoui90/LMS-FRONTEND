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
      <div><p className="eyebrow">CATALOG</p><h1>Courses</h1><p className="page-subtitle">Organize the learning content in your platform.</p></div>
      <div className="button-row">
        <button type="button" className="outline-button" onClick={loadCourses} disabled={loading}>{loading ? 'Loading...' : 'Load courses'}</button>
        <button type="button" onClick={() => setEditing('new')}>+ New course</button>
      </div>
    </div>
    {error && <p className="error" role="alert">{error}</p>}
    {message && <p className="notice" role="status">{message}</p>}
    {loading && <p className="loading-state">Loading courses...</p>}
    {loaded && <>
      <div className="filter-panel">
        <strong>{visibleCourses.length} of {courses.length} courses</strong>
        <div className="filter-row">
          <label htmlFor="category-filter">Category</label>
          <input id="category-filter" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} placeholder="Search category" />
          <label htmlFor="status-filter">Status</label>
          <select id="status-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">All statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>
      <div className="management-grid">
        <CourseList courses={visibleCourses} selectedId={selectedId} onSelect={setSelectedId} />
        <div className="detail-panel">
          {selectedCourse ? <>
            <p className="eyebrow">COURSE DETAILS</p>
            <span className={'status-badge ' + selectedCourse.status}>{selectedCourse.status}</span>
            <h2>{selectedCourse.title}</h2>
            <p className="course-description">{selectedCourse.description}</p>
            <div className="detail-facts">
              <p><span>Category</span><strong>{selectedCourse.category}</strong></p>
              <p><span>Level</span><strong>{selectedCourse.level}</strong></p>
              <p><span>Duration</span><strong>{selectedCourse.estimatedDuration} minutes</strong></p>
              <p><span>Trainer ID</span><strong>{selectedCourse.trainer || 'Not available'}</strong></p>
            </div>
            <h4>Objectives</h4>
            <p>{selectedCourse.objectives.join(', ')}</p>
            <div className="button-row">
              <button type="button" onClick={() => setEditing(selectedCourse._id)}>Edit</button>
              {selectedCourse.status === 'published' && <button type="button" className="outline-button" onClick={() => handleStatus('unpublish')}>Unpublish</button>}
              {selectedCourse.status !== 'archived' && <button type="button" className="outline-button" onClick={() => handleStatus('archived')}>Archive</button>}
            </div>
          </> : <div className="empty-detail"><span className="empty-icon">C</span><h3>Choose a course</h3><p>Select a course on the left to view its details and actions.</p></div>}
        </div>
      </div>
    </>}
    {editing && <CourseForm key={editing} course={editing === 'new' ? null : courses.find((course) => course._id === editing)} onSave={handleSave} onCancel={() => setEditing(false)} />}
  </section>
}

export default CourseManagement
