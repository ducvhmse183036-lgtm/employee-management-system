# Employee Management System — Frontend

For local Windows backend + physical mobile devices, see [local web/mobile commands and environment files](LOCAL_MOBILE.md). `.env.development` now calls `http://localhost:8080` directly; `.env.mobile` selects the PC LAN backend for mobile builds.

React + Vite + JavaScript + Bootstrap 5 frontend for the existing Spring Boot application. All application data uses the real API. No backend files are modified.

## Start

```sh
npm install
npm run dev
```

Open http://localhost:5173. Start the Spring Boot backend separately on http://localhost:8080 and sign in with an existing account. On Windows PowerShell, use `npm.cmd` if script execution policy prevents `npm` from running.

Vite proxies `/api` and `/uploads` to port 8080 when `VITE_API_BASE_URL` is unset. Production uses the HTTPS backend origin configured by `VITE_API_BASE_URL`; see `.env.example`. Vercel SPA routing and Capacitor configuration are prepared. See [deployment and iPad/iPhone instructions](DEPLOYMENT.md).

## Features

- JWT sign-in, expiration handling, logout, protected routes and role-based actions.
- Responsive sidebar/offcanvas navigation, employee directory, debounced server search, status filter and recursive organization tree.
- Employee creation, editing with immutable employee code, and ADMIN-only confirmed soft deletion.
- Employee profile with Basic Info, Personal Info, Labor Contract, Family Info and Allowances. Tabs load on first use and retain their data while switching.
- Add/edit dialogs, required fields, date-range validation, formatted monetary amounts, loading/empty/error states and success feedback.
- JPG/PNG/WEBP photo uploads up to 5 MB. Protected images are fetched with authorization and displayed using revocable blob URLs.
- ADMIN-only account creation with ADMIN, HR or VIEWER roles and optional employee ID.

## Access

| Role | View profiles | Create/edit records and photos | Delete employees | Create users |
| --- | --- | --- | --- | --- |
| ADMIN | Yes | Yes | Yes | Yes |
| HR | Yes | Yes | No | No |
| VIEWER | Yes | No | No | No |

The backend remains the authority for authorization. Development sessions store only token, user ID, role and employee ID in localStorage; passwords are not persisted.

## Checks

```sh
npm run build
npm run lint
npm run test:e2e
```

Browser tests use installed Google Chrome and synthetic network responses confined to `tests/`. They do not create or modify real backend records. Tests cover sign-in, protected routes, three roles, API search/filtering, create/edit forms, profile tabs, photo requests, account creation, delete confirmation, error handling, and desktop/tablet/mobile layouts. Install Chrome if it is not available. `npm run format` formats source and tests.

## API boundaries

- User Management creates accounts only; no user listing, editing or deletion endpoint is assumed.
- Organization pages use existing read APIs. Organization editing is not offered.
- Filtering a unit returns directly assigned employees only. When combining search and organization, results from the two real API endpoints are intersected by employee ID.
- Employee deletion marks the employee inactive. Records may remain visible depending on the backend list behavior.
- Salaries and allowances are formatted as numbers because the API does not provide a currency code.
- Contract types, relationships, allowance types and similar string fields accept backend values rather than imposing an undocumented enum.
- A 403 response can indicate forbidden access or an invalid JWT in Spring Security; the UI explains how to sign in again without silently discarding a valid session.

Live integration still requires the running backend and an existing login. During implementation the backend health URL was unreachable, so browser verification used test fixtures.
