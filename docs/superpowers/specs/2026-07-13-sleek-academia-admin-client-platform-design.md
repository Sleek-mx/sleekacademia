# Sleek Academia Admin and Client Platform Design

Date: 2026-07-13  
Status: Approved for implementation
Repository: `Sleek-mx/sleekacademia`  
Branch: `feature/phase-1-foundation-home`

## 1. Objective

Finish Sleek Academia as a secure order-management platform with two distinct authenticated products:

1. An MCX administrator workspace for reviewing, accepting, managing, delivering, revising, and reporting on client orders.
2. A client workspace for creating orders, supplying materials, paying verified milestones, communicating, downloading paid deliveries, and requesting revisions.

The public website retains the existing live Sleek Academia neumorphic identity. The two dashboards use a responsive liquid-glass interface with light and night modes, built only from the established website and official-logo colors.

No GitHub push or Namecheap deployment is part of this implementation phase. The completed system must first pass local automated and browser verification.

## 2. Confirmed Product Decisions

- Use **Orders** rather than **Requests** in all user-facing language.
- Use separate admin and client dashboard interfaces backed by one order system.
- The login screen exposes separate **Client** and **Admin** modes.
- Client accounts use Clerk email and password authentication.
- The only administrator username is `MCX`.
- The MCX password is never hardcoded, committed, or pasted into chat.
- MCX authenticator-app MFA is deferred. All other approved security controls remain required.
- Writing orders cost $15 per 275-word page.
- Six-hour urgent writing costs $16.50 per page.
- Exam assistance costs $150 per hour.
- Tutoring and unusual custom work are manually quoted after review.
- A confirmed 50 percent deposit is required before work begins.
- The remaining balance is required before delivered files can be downloaded.
- Delivered filenames and delivery metadata are visible before full payment.
- One revision request is included for seven days after the first successful paid download.
- Additional revision work becomes a separately quoted order.
- Payments are provider-confirmed through Stripe or PayPal only.
- There is no manual paid override and no offline or M-Pesa payment recording.
- The current footer-logo regression must be fixed and covered by a test.

## 3. System Architecture

### 3.1 Role-separated interfaces

The platform has two canonical interface shells:

- `/admin.html`: MCX administrator workspace. `/admin` redirects here.
- `/dashboard.html`: Clerk-authenticated client workspace. `/dashboard` redirects here.

Both interfaces call the same protected platform API and operate on the same profiles, orders, messages, attachments, payments, events, notifications, and revision records. Authorization is enforced on the server for every request.

The existing browser-controlled production role switch is removed. Localhost retains explicit demo identities for testing, but demo identity resolution must continue to reject non-loopback hosts.

### 3.2 Client authentication

- Clerk manages client registration, email/password login, identity verification, and account recovery.
- The server verifies Clerk authentication before exposing client data.
- Each client can access only their own profile, orders, order messages, payment records, and attachments.
- Unauthorized access returns a uniform not-found response where practical to avoid leaking valid order identifiers.

### 3.3 MCX authentication

- `ADMIN_USERNAME` defaults to `MCX` when explicitly enabled.
- `ADMIN_PASSWORD_HASH` stores a salted memory-hard password hash.
- `ADMIN_SESSION_SECRET` signs or authenticates admin-session material.
- Password verification uses constant-time comparison.
- The server issues a cryptographically random session identifier after successful login.
- Only a hash of the session identifier is stored server-side.
- Production sessions are stored in Supabase; localhost uses an isolated in-memory adapter.
- The browser receives only an `HttpOnly`, `Secure`, `SameSite=Strict` cookie.
- The session identifier rotates after login and privilege establishment.
- Sessions expire after a short idle period and an eight-hour absolute lifetime.
- Logout invalidates the server-side session before clearing the cookie.
- Repeated login failures trigger rate limits, progressive delay, and temporary lockout.
- Authentication errors never confirm whether the username or password was the failing field.
- Admin login, logout, failure, lockout, and session revocation are recorded as security events without storing credentials.

### 3.4 Storage and service boundaries

- Supabase remains the production source of truth.
- The Supabase service-role key exists only on the server.
- Browser clients never receive service-role credentials or direct unrestricted table access.
- The private `sleek-academia-private` bucket stores client materials and deliveries.
- Downloads require application authorization before a 60-second signed URL is issued.
- Stripe and PayPal secrets stay server-side.
- Stripe webhook signatures and PayPal order/capture details must be verified before payment state changes.

## 4. Order and Pricing Model

### 4.1 Writing calculation

Writing services include essays, coursework, reports, and presentation-writing work.

- Standard rate: 1,500 cents per page.
- Six-hour urgent rate: 1,650 cents per page.
- One page equals 275 words.
- If a word count is supplied, page count equals `max(1, ceil(wordCount / 275))`.
- If only pages are supplied, the displayed equivalent word count equals `pages * 275`.
- All calculations use integer cents.
- The server recalculates totals from approved rate settings; browser totals are informational only.

### 4.2 Exam-assistance calculation

- Rate: 15,000 cents per hour.
- Minimum booking: one hour.
- Bookings use whole-hour increments in the initial release.
- The server calculates `hours * 15,000` and stores the rate, units, and total as an immutable pricing snapshot on acceptance.

### 4.3 Custom calculation

Tutoring and unusual work without an approved fixed unit remain in Needs Clarification until MCX enters a custom quote. The activity record must identify the administrator, timestamp, currency, total, and reason for the custom calculation.

### 4.4 Milestones

- Deposit equals `ceil(totalCents / 2)`.
- Balance equals `totalCents - depositCents`.
- The server derives the active milestone from the stored quote and confirmed payments.
- No endpoint accepts a browser-provided amount as payment truth.
- Provider transaction identifiers remain unique and idempotent.

## 5. Order Lifecycle

Order status and payment state are related but independent.

### 5.1 Primary statuses

1. Available
2. Needs Clarification
3. Deposit Due
4. In Progress
5. Delivered
6. Revision Requested
7. In Revision
8. Completed
9. Declined
10. Cancelled

### 5.2 Derived working queues

- **Balance Due** is a derived queue for Delivered orders whose confirmed paid total is below the quote.
- **Delivered and Paid** is a derived state for Delivered orders whose quote is fully paid.
- **Overdue** is a warning applied when an active order passes its accepted deadline.
- **Unread** is derived from per-user message read state.

### 5.3 Transition rules

- A new client submission becomes Available.
- MCX may request clarification, decline the order, or accept it.
- Needs Clarification does not start work or request payment.
- Accepting a fixed-rate order stores the server-calculated quote and changes the order to Deposit Due.
- Accepting a custom order requires a valid custom quote.
- Only a confirmed 50 percent deposit can move an accepted order to In Progress.
- MCX uploads deliverables before marking an order Delivered.
- Marking Delivered creates the balance milestone without hiding the Delivered status.
- Delivered filenames, types, sizes, and timestamps are visible before payment.
- Final work and AI-use reports remain download-locked until the order is fully paid.
- The first successful paid download records `firstDownloadedAt` and starts the seven-day revision window.
- A client may submit one included revision request during that window.
- MCX moves an accepted revision into In Revision and later redelivers it.
- Further revision work is submitted and quoted as a new order.
- Declined and Cancelled orders remain archived with their activity records.

## 6. Admin Dashboard

### 6.1 Dashboard shell

- Dedicated MCX workspace with no client navigation or role switch.
- Official Sleek Academia logo in a constrained, responsive lockup.
- Floating liquid-glass navigation rail on desktop.
- Collapsible navigation drawer on tablet and mobile.
- Command bar with global search, unread messages, notifications, theme control, and account menu.

### 6.2 Overview

The overview shows:

- Available orders.
- Orders awaiting clarification.
- Deposits awaiting payment.
- Orders in progress.
- Delivered orders with unpaid balances.
- Revision requests.
- Upcoming and overdue deadlines.
- Confirmed earnings for the selected period.
- Recent payments.
- Unread client messages.
- Recent platform activity.

### 6.3 Order queues

The admin can filter or navigate directly to:

- Available.
- Needs Clarification.
- Deposit Due.
- In Progress.
- Balance Due.
- Delivered.
- Revision Requested.
- In Revision.
- Completed.
- Declined.
- Cancelled.

Each row shows client, title, subject, service, pricing summary, confirmed paid total, balance, deadline, material completeness, unread messages, and last activity.

### 6.4 Order command center

Each order detail contains:

- Complete client instructions.
- Pricing calculation and immutable acceptance snapshot.
- Client profile and order history.
- Uploaded-material checklist.
- Request-scoped messages.
- Payment ledger.
- Delivery and revision history.
- Append-only activity timeline.
- Deadline and overdue warnings.
- Only the actions allowed by the current status and payment state.

### 6.5 Supporting sections

- **Clients:** Contact details, school, orders, active orders, confirmed lifetime payments, open balance, and recent activity.
- **Messages:** Unified order-aware inbox with unread state.
- **Payments:** Provider-confirmed deposit and balance records.
- **Earnings:** Confirmed revenue, deposits, balances, outstanding balances, order value, and 7/30/90-day or all-time filters.
- **Files:** Client materials, drafts, final deliveries, and AI-use reports.
- **Settings:** Protected pricing, revision, notification, and session controls.

The admin receives search, status filters, deadline sorting, overdue warnings, unread indicators, and CSV exports. Earnings report revenue only, not expenses or profit.

## 7. Client Dashboard

### 7.1 Overview

The overview shows:

- Active orders.
- Clarification required.
- Deposit or balance due.
- Recently delivered work.
- Unread messages.
- Upcoming deadlines.
- A prominent Start New Order action.

### 7.2 My Orders

Clients can filter their own orders by Queue, Needs Clarification, Deposit Due, In Progress, Delivered, Revision, Completed, and Cancelled.

Each order card shows title, subject, service, deadline, status, calculation, quote, confirmed paid amount, remaining balance, and latest update.

### 7.3 Order workspace

Each order contains:

- Instructions and requirements.
- Page/word or exam-hour calculation.
- Status timeline.
- Messages.
- Original materials.
- Payment history and receipts.
- Delivered files and lock state.
- Revision history.
- Relevant help and policy information.

### 7.4 Payment and delivery

- Stripe and PayPal actions appear only when a server-derived milestone is due.
- Provider confirmation controls the success state.
- A Delivered order shows delivery metadata immediately.
- Unpaid final files display `Locked - pay balance to download`.
- Full payment unlocks download without an administrator override.
- The included revision action appears only after the first successful paid download and while the seven-day window remains open.
- Revision submission requires specific instructions.

### 7.5 Supporting sections

- **Messages:** Conversations grouped by order.
- **Files:** Client materials and accessible deliveries.
- **Payments:** Due milestones, confirmed transactions, and receipts.
- **Profile:** Contact, school, and Clerk account controls.
- **Help:** Payment, delivery, revision, and file policies.

## 8. Visual System

### 8.1 Public website

The public website continues to use the current live neumorphic visual system. Its source colors and behavior remain authoritative rather than being replaced with a new palette.

### 8.2 Established palette

Only existing website and official-logo colors are used:

- Purple: `#702ae1`.
- Light purple: `#9d6bff`.
- Blue: `#078fec`.
- Teal: `#12c8ae`.
- Green: `#42c83f`.
- Orange: `#ff9c0a`.
- Pink: `#ed3489`.
- Yellow: `#ffd51a`.
- Logo navy: `#12233b`.
- Light surface: `#e7e4f1`.
- Primary text: `#372f52`.
- Muted text: `#6b6488`.

### 8.3 Dashboard light mode

- Lavender base surface.
- Translucent white and lavender glass panels.
- Fine inner borders, background blur, and restrained highlights.
- Purple primary actions.
- Other logo colors are reserved for semantic statuses, charts, notifications, and progress.

### 8.4 Dashboard night mode

- Logo-navy base surface.
- Translucent navy and purple glass panels.
- Light readable text.
- The same established logo colors retain the same semantic meanings.
- No separate invented dark palette.

### 8.5 Interaction and accessibility

- Theme defaults to system preference on first visit and persists locally afterward.
- Controls have visible hover, pressed, focus, disabled, loading, and error states.
- Motion is short and restrained and respects reduced-motion preference.
- Contrast is checked in both themes.
- Layouts are verified on desktop, tablet, and mobile.
- The rejected animated mascot behavior does not return.

## 9. Footer Regression

The attached error is caused by a hidden full-resolution footer logo being forced back to `display: block` by the global `img` rule. The browser therefore renders its declared `1595 x 993` dimensions and expands the footer.

The fix must:

- Remove the redundant hidden full-resolution footer image.
- Preserve the visible constrained brand lockup.
- Add a global hidden-element rule that cannot be overridden by generic media display rules.
- Add a regression test proving hidden footer media has no rendered layout box.
- Verify the corrected footer at desktop and mobile widths.

## 10. Security Requirements

### 10.1 Existing controls to preserve

- Server-enforced role and ownership checks.
- Cross-client order isolation.
- Private Supabase bucket.
- Short-lived signed download URLs.
- Stripe signature verification.
- PayPal order, amount, currency, and capture verification.
- Integer-cent server-owned payment totals.
- Provider transaction idempotency.
- Upload size and MIME allowlists.
- Environment-only secrets and ignored `.env` files.
- HMAC-verified deployment webhook.

### 10.2 Required hardening

- Upgrade vulnerable dependencies and make a zero-known-vulnerability production audit a release gate.
- Disable Express identification headers.
- Add a restrictive Content Security Policy compatible with Clerk, Stripe, PayPal, fonts, and local assets.
- Add HSTS, frame-ancestor protection, MIME-sniffing protection, a restrictive referrer policy, and a permissions policy.
- Enforce exact production origins.
- Validate CSRF tokens and Origin/Fetch-Metadata on state-changing cookie-authenticated requests.
- Rate-limit admin login, client APIs, messages, uploads, payment creation/capture, and webhooks.
- Apply stricter limits to failed MCX authentication.
- Validate extension, claimed MIME type, and binary signature together.
- Generate storage paths independently from user filenames.
- Sanitize download filenames.
- Avoid stack traces, secrets, cookies, payment data, or document contents in client errors and logs.
- Remove configuration details from the public health response.
- Record append-only admin and security audit events.
- Keep MCX MFA deferred rather than partially implementing it.

### 10.3 Current audit findings

The pre-design audit found no committed credential material and no critical dependency advisory. It did find three high and three moderate dependency advisories with fixes available, plus missing CSP/security headers, rate limits, and CSRF controls. These findings are blockers for production readiness and must be cleared before deployment.

## 11. Error Handling and Reliability

- Every dashboard has composed loading, empty, permission, unavailable-service, validation, and retry states.
- Forms keep safe user-entered values after validation errors.
- Order creation and payment actions use idempotency keys.
- Status transitions return actionable conflict messages without revealing unrelated records.
- Provider outages do not mark payments successful.
- File failures do not create attachment metadata unless storage succeeds.
- Delivery failures do not mark an order Delivered.
- Notifications are downstream effects and cannot invalidate a successfully persisted core order transition.
- Admin actions show explicit success or failure near the affected control.
- Client-facing copy avoids internal error details.

## 12. Testing and Acceptance

### 12.1 Automated coverage

- Pricing: page/word boundaries, urgent rate, exam hours, integer cents, and milestone splits.
- Lifecycle: every allowed and rejected transition.
- Authorization: anonymous, cross-client, client-to-admin, and expired-session attempts.
- MCX authentication: hashing, constant-time verification behavior, rate limits, rotation, expiry, logout, and lockout.
- CSRF, origin, and fetch-metadata enforcement.
- Upload size, extension/MIME/signature mismatches, filename handling, and protected downloads.
- Stripe and PayPal tampering and idempotency.
- Delivered-but-locked and paid-unlocked behavior.
- First-download revision-window behavior and single included revision.
- Earnings and queue derivation.
- Footer hidden-media regression.
- Security headers and production configuration.
- Dependency audit release gate.

### 12.2 Browser coverage

- Public homepage and footer in desktop and mobile layouts.
- Client and admin login modes.
- MCX login failure, success, expiry, and logout.
- Client order submission with writing and exam calculations.
- Clarification, acceptance, deposit, progress, delivery, locked download, balance, unlocked download, revision, redelivery, and completion.
- Admin queues, client directory, messages, payments, earnings, files, search, filters, sorting, and CSV export.
- Client overview, orders, messages, files, payments, profile, and help.
- Dashboard light and night modes at desktop and mobile sizes.
- Keyboard navigation, visible focus, contrast, reduced motion, loading, empty, and error states.
- Clean browser console and network behavior.

### 12.3 Local completion gate

Implementation is complete only when:

1. All application, security, and SEO tests pass.
2. The production dependency audit reports no known vulnerabilities.
3. Secret, unsafe-route, and retired-pricing scans pass.
4. Browser workflows pass in both dashboard themes and responsive sizes.
5. The footer regression is visually absent.
6. The local server remains running for Max to review.
7. No GitHub or Namecheap push has occurred.

## 13. Out of Scope for This Phase

- Offline payment recording.
- M-Pesa payment recording.
- Manual paid overrides.
- MCX authenticator-app MFA.
- Multiple administrator accounts.
- Tutor/staff assignment and permissions.
- Expense or profit accounting.
- Automatic production deployment before local approval.
