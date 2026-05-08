# Sleek Academia Backend Infrastructure

This project turns the exported Stitch frontend into a protected web app with:

- Clerk authentication for Email + Google
- Server-side session verification with Express
- A protected `dashboard.html`
- Three dashboard views driven by the signed-in user's role: `admin`, `tutor`, and `student`
- Admin APIs for viewing users and changing roles

## Stack

- Express
- `@clerk/express`
- Static HTML + Tailwind CDN

## Setup

1. Install Node.js 18+.
2. Copy `.env.example` to `.env`.
3. Fill in:
   - `CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `CLERK_FRONTEND_API_URL`
4. In the Clerk Dashboard, enable:
   - Email authentication
   - Google social login
5. Optionally set:
   - `ADMIN_EMAILS`
   - `TUTOR_EMAILS`

## Role assignment

- If a user already has `publicMetadata.role`, that value is used.
- If not, the backend assigns:
  - `admin` if their email is in `ADMIN_EMAILS`
  - `tutor` if their email is in `TUTOR_EMAILS`
  - `student` otherwise

Admins can later change roles from the Admin dashboard using the protected role update endpoint.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Logout route

A new server-side route is available at `/logout`. It clears Clerk session cookies and redirects users back to `/login.html`.

## Important Clerk note

The frontend uses Clerk's JavaScript browser script URL pattern from Clerk's official JavaScript quickstart:

- `https://YOUR_FRONTEND_API_URL/npm/@clerk/clerk-js@5/dist/clerk.browser.js`

That is why `CLERK_FRONTEND_API_URL` is required in addition to the publishable and secret keys.
