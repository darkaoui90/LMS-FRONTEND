# EduLearn LMS Frontend — Sprint 3, Days 1 to 4

Small React learning project using JavaScript, JSX, CSS, `useState`, and `fetch`. Admin courses now come from the database. Learner dashboard cards are still examples until Day 5.

## Run

Start the Sprint 2 backend on port 3000 and its MongoDB. In `LMS-Frontend`, run `npm install`, then `npm run dev`. Open `http://localhost:5173`. Run `npm run build` to check the build.

The API base URL defaults to `http://localhost:3000`. To change it, set `VITE_API_URL=http://localhost:YOUR_PORT` in a frontend `.env.local`. Never put a password or JWT in that file. The backend now allows the Vite origin `http://localhost:5173` through CORS.

## Backend contract checked in source

Express mounts its routes under `/api`.

| Route | Purpose | Used now? |
| --- | --- | --- |
| `POST /api/auth/login` | Login | Yes |
| `GET /api/profiles/me` | Protected profile | Yes, Check profile button |
| `POST /api/auth/register` | Public learner registration | Yes, Admin Users page |
| `GET /api/enrollments/me` | Learner enrollments | Day 5 |
| `GET /api/trainer/Courses` | All courses for Admin, including drafts and archived | Yes |
| `POST /api/courses` | Create a draft course (Admin or Trainer) | Yes |
| `PATCH /api/courses/:id` | Update a course (Admin or owning Trainer) | Yes |
| `PATCH /api/courses/:id/unpublish` | Change published course to draft | Yes |
| `PATCH /api/courses/:id/archived` | Archive a course | Yes |
| `GET /api/courses` | Public published courses only | No |
| `GET /api/admin/config` | Admin-only config | No |

Login sends JSON with `email` and `password`. A successful response contains `success`, `message`, a top-level `token`, and `data.user` with `id`, `name`, `email`, and `role`. The role always comes from the server. Protected requests send `Authorization: Bearer <token>`. Profile returns `data.user`.

Errors use `{"success":false,"message":"..."}`. Missing or expired bearer tokens return **401**. Forbidden roles return **403**. Wrong login credentials currently return **400**, so the form handles 400 as well as 401. A profile 401 clears the session; a 403 keeps it and shows an error. No backend logout route exists, so logout clears React state. Refreshing also clears the token because it is never stored in localStorage.

The PDF gives example profile and enrollment paths that differ from this backend. The real paths are listed above. The backend currently accepts suspended users at login but refuses their protected requests. This project does not change that business logic.

### Day 3 backend limitation

The backend has **no route** for an Admin to list users, get another user's details, edit a learner, or activate/suspend an account. Therefore the Users page does not pretend to show a real list or working filters. Its controlled form calls the existing public `POST /api/auth/register` route with `name`, `email`, and `password`; success returns `data.user` and HTTP 201. Duplicate email returns 409. Because registration is public, it is not an Admin-only backend operation. Full Day 3 user management requires backend routes and permissions before the frontend can use them.

### Day 4 course fields

Create and edit send `title`, `description`, `objectives` (array of strings), `level` (`beginner`, `intermediate`, or `advanced`), `category`, and `estimatedDuration` (number of minutes, at least 1). The backend sets `trainer` from the logged-in account and new course `status` to `draft`. The list response is `data.courses`; create/update/status responses contain `data.course`. Status values are `draft`, `published`, and `archived`. Trainer names are not returned by this endpoint, so the UI shows the trainer ID.

The Admin course list uses the protected `/api/trainer/Courses` route because public `/api/courses` returns only published courses. Course requests send the bearer token. A 401 logs out; a 403 shows “Access denied” and keeps the session. Archive and unpublish require a confirmation click.

## Components and React concepts

```text
App (token, user, message in state)
├─ LoginForm (controlled inputs, onLogin callback)
└─ AppShell (user, onLogout, onCheckProfile)
   └─ ProtectedView (session, allowedRoles)
      ├─ AdminDashboard → Home, UserManagement, CourseManagement
      │  ├─ UserForm (public learner registration)
      │  └─ CourseList → CourseCard, CourseForm
      └─ LearnerDashboard → InfoCard examples
```

Props send data from parent to child. Callbacks send user actions back to App. `useState` remembers the inputs and session. `map` renders the example cards with stable keys. API calls run only after submit or button click.

## Simple wireframes

Desktop:

```text
┌────────────────────────────────────────────────────┐
│ EduLearn LMS         User · role   Profile   Logout │
├────────────────────────────────────────────────────┤
│ Dashboard heading                                  │
│ [ Example card ] [ Example card ] [ Example card ] │
└────────────────────────────────────────────────────┘
```

Mobile:

```text
┌─────────────────────┐
│ EduLearn LMS        │
│ User · role         │
│ Profile    Logout   │
├─────────────────────┤
│ Dashboard heading   │
│ [ Example card ]    │
│ [ Example card ]    │
└─────────────────────┘
```

## Manual test plan

Try an empty form, wrong credentials, admin login, learner login, Check profile, logout, refresh, and a narrow mobile window. In Admin, open Users and try valid and duplicate learner registration. Open Courses, load real data, filter it, select one, create and edit a course, then confirm an archive or unpublish action. The private dashboard must match the server role. Day 5 remains real learner enrollments and final acceptance checks.

## Checks completed

- `npm run dev` served the page on port 5173 (HTTP 200).
- `npm run build` and `npm run lint` passed.
- CORS preflight from `http://localhost:5173` returned 204 with that origin allowed.
- Wrong login credentials returned 400; a profile request without a token returned 401.
- Temporary admin and learner accounts each logged in with HTTP 200 and the correct server role. Their bearer-token profile requests returned 200.
- A direct learner request to `/api/admin/config` returned 403; the admin request returned 200. Temporary accounts were removed after testing.

The visual login and mobile layouts should still be checked manually in your browser with your own demo accounts.

### Day 3 and Day 4 API checks

These checks used temporary accounts and a temporary course in the local Docker MongoDB database. The test records were removed afterward.

- Admin and Learner login returned 200 with the correct server role.
- Learner registration returned 201; registering the same email again returned 409.
- Learner requests to the Admin course list and course-create route returned 403.
- Admin course list returned 200 and included a newly created draft.
- Admin course create returned 201; edit, unpublish, and archive each returned 200 with the expected course fields and status.
- A course request without a token returned 401; an invalid course level returned 400.
- `npm run build` and `npm run lint` passed after the new components were added.

Browser automation was unavailable during this check, so the new form, filters, and mobile layout still need a manual browser walkthrough. User-list and user-edit tests cannot run because their backend routes do not exist.
