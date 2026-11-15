# EduLearn LMS Frontend — Sprint 3, Days 1 and 2

Small React learning project using JavaScript, JSX, CSS, `useState`, and `fetch`. Dashboard cards are examples, not database records.

## Run

Start the Sprint 2 backend on port 3000 and its MongoDB. In `LMS-Frontend`, run `npm install`, then `npm run dev`. Open `http://localhost:5173`. Run `npm run build` to check the build.

The API base URL defaults to `http://localhost:3000`. To change it, set `VITE_API_URL=http://localhost:YOUR_PORT` in a frontend `.env.local`. Never put a password or JWT in that file. The backend now allows the Vite origin `http://localhost:5173` through CORS.

## Backend contract checked in source

Express mounts its routes under `/api`.

| Route | Purpose | Used now? |
| --- | --- | --- |
| `POST /api/auth/login` | Login | Yes |
| `GET /api/profiles/me` | Protected profile | Yes, Check profile button |
| `POST /api/auth/register` | Create learner | No |
| `GET /api/enrollments/me` | Learner enrollments | Day 5 |
| `GET /api/courses` | Public courses | Day 4 |
| `GET /api/admin/config` | Admin-only config | No |

Login sends JSON with `email` and `password`. A successful response contains `success`, `message`, a top-level `token`, and `data.user` with `id`, `name`, `email`, and `role`. The role always comes from the server. Protected requests send `Authorization: Bearer <token>`. Profile returns `data.user`.

Errors use `{"success":false,"message":"..."}`. Missing or expired bearer tokens return **401**. Forbidden roles return **403**. Wrong login credentials currently return **400**, so the form handles 400 as well as 401. A profile 401 clears the session; a 403 keeps it and shows an error. No backend logout route exists, so logout clears React state. Refreshing also clears the token because it is never stored in localStorage.

The PDF gives example profile and enrollment paths that differ from this backend. The real paths are listed above. The backend currently accepts suspended users at login but refuses their protected requests. This project does not change that business logic.

## Components and React concepts

```text
App (token, user, message in state)
├─ LoginForm (controlled inputs, onLogin callback)
└─ AppShell (user, onLogout, onCheckProfile)
   └─ ProtectedView (session, allowedRoles)
      ├─ AdminDashboard → InfoCard examples
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

Try an empty form, wrong credentials, admin login, learner login, Check profile, logout, refresh, and a narrow mobile window. The private dashboard must match the server role. Later: Day 3 real user management, Day 4 real course management, Day 5 real learner enrollments and full acceptance checks.

## Checks completed

- `npm run dev` served the page on port 5173 (HTTP 200).
- `npm run build` and `npm run lint` passed.
- CORS preflight from `http://localhost:5173` returned 204 with that origin allowed.
- Wrong login credentials returned 400; a profile request without a token returned 401.
- Temporary admin and learner accounts each logged in with HTTP 200 and the correct server role. Their bearer-token profile requests returned 200.
- A direct learner request to `/api/admin/config` returned 403; the admin request returned 200. Temporary accounts were removed after testing.

The visual login and mobile layouts should still be checked manually in your browser with your own demo accounts.
