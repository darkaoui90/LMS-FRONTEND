const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function readResponse(response) {
  const data = await response.json()
  if (!response.ok) {
    const error = new Error(data.message || 'The request failed.')
    error.status = response.status
    throw error
  }
  return data
}

export async function login(email, password) {
  const response = await fetch(API_URL + '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return readResponse(response)
}

export async function getProfile(token) {
  const response = await fetch(API_URL + '/api/profiles/me', {
    headers: { Authorization: 'Bearer ' + token },
  })
  return readResponse(response)
}

export async function registerLearner(name, email, password) {
  const response = await fetch(API_URL + '/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
  return readResponse(response)
}

export async function getAdminCourses(token) {
  const response = await fetch(API_URL + '/api/trainer/Courses', {
    headers: { Authorization: 'Bearer ' + token },
  })
  return readResponse(response)
}

export async function saveCourse(token, courseId, fields) {
  const path = courseId ? '/api/courses/' + courseId : '/api/courses'
  const response = await fetch(API_URL + path, {
    method: courseId ? 'PATCH' : 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(fields),
  })
  return readResponse(response)
}

export async function changeCourseStatus(token, courseId, action) {
  const response = await fetch(API_URL + '/api/courses/' + courseId + '/' + action, {
    method: 'PATCH',
    headers: { Authorization: 'Bearer ' + token },
  })
  return readResponse(response)
}
