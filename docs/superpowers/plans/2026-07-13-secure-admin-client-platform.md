# Secure Sleek Academia Admin and Client Platform Implementation Plan

> **For Codex:** REQUIRED SKILL: Use `superpowers:executing-plans` to implement this plan task by task. Use `superpowers:test-driven-development` for every behavior change and `superpowers:verification-before-completion` before reporting completion.

**Goal:** Deliver a secure, locally reviewable Sleek Academia order platform with a dedicated MCX admin dashboard, a separate Clerk client dashboard, server-owned pricing and payment gates, a complete revision workflow, restored public neumorphism, and responsive liquid-glass light/night dashboard themes.

**Architecture:** Keep Express as the application boundary, Supabase as the production source of truth, Clerk for client identity, and Stripe/PayPal for provider-confirmed payments. Replace the combined role-switching workspace with separate client and admin shells. Split the current 283-line platform router into focused client, admin, admin-auth, and shared security modules. Keep the existing `service_requests` database table for migration safety while exposing `Order` terminology in all new code, APIs, and UI.

**Tech Stack:** Node.js ESM, Express 4.22.2, Clerk Express 1.7.82, Supabase REST/Storage, Stripe, PayPal REST, Helmet 8.3.0, express-rate-limit 8.5.2, vanilla HTML/CSS/JavaScript, Node's built-in test runner.

**Approved specification:** `docs/superpowers/specs/2026-07-13-sleek-academia-admin-client-platform-design.md`

**Execution constraints:** Work only in `/Users/ephantusmacharia/Websites/Active Projects/sleek-academia-render/.worktrees/phase-1-foundation-home`. Preserve `.codebase-memory/` as untracked. Update `PROGRESS.md` after every milestone. Do not push, trigger the webhook, touch Namecheap, or run the production `rsync --delete` flow until Max has approved the verified localhost result.

---

## Task 1: Lock the approved spec and eliminate the footer regression

**Files:**

- Modify: `docs/superpowers/specs/2026-07-13-sleek-academia-admin-client-platform-design.md`
- Create: `test/footer-regression.test.js`
- Modify: `public/index.html`
- Modify: `public/css/brand-v2.css`
- Modify: `PROGRESS.md`

**Step 1: Mark the specification approved**

Change the status line to:

```md
Status: Approved for implementation
```

**Step 2: Write the failing footer regression test**

Create `test/footer-regression.test.js` with assertions that:

```js
assert.doesNotMatch(home, /width="1595" height="993"[^>]*hidden/);
assert.match(css, /\[hidden\]\s*\{[^}]*display:\s*none\s*!important/s);
assert.equal((home.match(/sleek-academia-logo\.webp/g) || []).length, 1);
```

Also assert that the constrained visible footer lockup remains present and the public page still loads `brand-v2.css`.

**Step 3: Run the focused test and confirm failure**

Run: `node --test test/footer-regression.test.js`

Expected: FAIL because the redundant 1595 x 993 hidden logo is still in `public/index.html` and `brand-v2.css` does not yet contain the global hidden rule.

**Step 4: Apply the minimal layout fix**

- Remove the redundant hidden full-resolution `<img>` from the footer.
- Add near the global reset in `public/css/brand-v2.css`:

```css
[hidden] {
  display: none !important;
}
```

- Do not alter the approved public palette, neumorphic surfaces, or visible logo lockup.

**Step 5: Verify the regression test**

Run: `node --test test/footer-regression.test.js test/phase1-home.test.js`

Expected: PASS.

**Step 6: Record the checkpoint and commit**

Update `PROGRESS.md`, then run:

```bash
git add docs/superpowers/specs/2026-07-13-sleek-academia-admin-client-platform-design.md test/footer-regression.test.js public/index.html public/css/brand-v2.css PROGRESS.md
git commit -m "fix: remove footer logo layout regression"
```

---

## Task 2: Patch dependencies and establish security release gates

**Files:**

- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `scripts/check-security.mjs`
- Create: `test/security-release-gate.test.js`
- Modify: `PROGRESS.md`

**Step 1: Write the failing release-gate test**

The test must assert that:

- `package.json` pins compatible secure minimums for `@clerk/express`, `axios`, and `express`.
- `helmet` and `express-rate-limit` are present.
- `check:security` exists and runs the security script.
- The security script scans tracked source for credential-shaped assignments, retired manual-paid endpoints, `rsync --delete` outside the existing deploy handler, and production demo-role exposure.

**Step 2: Run the focused test and confirm failure**

Run: `node --test test/security-release-gate.test.js`

Expected: FAIL because the dependencies and script do not exist yet.

**Step 3: Update compatible dependencies**

Run:

```bash
npm install @clerk/express@1.7.82 axios@1.18.1 express@4.22.2 helmet@8.3.0 express-rate-limit@8.5.2
```

Do not upgrade Clerk across the 1.x to 2.x major boundary in this task.

**Step 4: Implement the security check script**

`scripts/check-security.mjs` must:

- Run `npm audit --omit=dev --audit-level=moderate` and propagate a non-zero exit.
- Inspect `git ls-files` output, never `.env` contents.
- Reject committed private-key blocks, service-role key assignments, hardcoded `ADMIN_PASSWORD`, or live secret-looking tokens.
- Reject manual payment override routes or UI labels.
- Confirm `LOCAL_DEMO_MODE` remains loopback-gated.
- Print only filenames and rule identifiers, never suspected secret values.

Add:

```json
"check:security": "node scripts/check-security.mjs"
```

**Step 5: Run release checks**

Run:

```bash
node --test test/security-release-gate.test.js
npm audit --omit=dev --audit-level=moderate
npm run check:security
```

Expected: all PASS and audit reports zero known production vulnerabilities.

**Step 6: Record the checkpoint and commit**

```bash
git add package.json package-lock.json scripts/check-security.mjs test/security-release-gate.test.js PROGRESS.md
git commit -m "chore: establish security release gates"
```

---

## Task 3: Implement server-owned pricing and milestone calculations

**Files:**

- Create: `src/platform/pricing.js`
- Create: `test/platform-pricing.test.js`
- Modify: `src/platform/domain.js`
- Modify: `test/platform-domain.test.js`
- Modify: `PROGRESS.md`

**Step 1: Write exhaustive failing pricing tests**

Cover these exact contracts:

```js
calculateWritingQuote({ pages: 1, urgency: "standard" }).totalCents === 1500;
calculateWritingQuote({ words: 276, urgency: "standard" }).units === 2;
calculateWritingQuote({ words: 0, urgency: "standard" }) // validation error
calculateWritingQuote({ pages: 4, urgency: "six-hour" }).totalCents === 6600;
calculateExamQuote({ hours: 1 }).totalCents === 15000;
calculateExamQuote({ hours: 1.5 }) // validation error
splitMilestones(1501) // { depositCents: 751, balanceCents: 750 }
```

Also test safe-integer overflow, negative values, page/word conflict resolution, immutable snapshot fields, and custom quotes of at least 100 cents.

**Step 2: Run the test and confirm module failure**

Run: `node --test test/platform-pricing.test.js`

Expected: FAIL because `src/platform/pricing.js` does not exist.

**Step 3: Implement the pricing module**

Export:

```js
export const DEFAULT_PRICING = Object.freeze({
  writingPageWords: 275,
  writingPageCents: 1500,
  urgentWritingPageCents: 1650,
  examHourCents: 15000,
  revisionDays: 7,
  includedRevisions: 1,
});

export function calculateWritingQuote(input, settings = DEFAULT_PRICING) {}
export function calculateExamQuote(input, settings = DEFAULT_PRICING) {}
export function calculateCustomQuote(input) {}
export function calculateOrderQuote(input, settings = DEFAULT_PRICING) {}
export function splitMilestones(totalCents) {}
```

Return integer-cent snapshots containing `pricingType`, `unitName`, `units`, `unitRateCents`, `equivalentWords`, `totalCents`, `depositCents`, `balanceCents`, and `currency: "usd"`. Never accept a browser-supplied total.

**Step 4: Extend order input validation**

Add allowlisted `wordCount`, `examHours`, and `urgency` fields. Normalize them in pricing, not with floating-point currency arithmetic. Preserve `pageCount` compatibility while converting it to an integer unit.

**Step 5: Verify pricing and domain tests**

Run: `node --test test/platform-pricing.test.js test/platform-domain.test.js`

Expected: PASS.

**Step 6: Record the checkpoint and commit**

```bash
git add src/platform/pricing.js src/platform/domain.js test/platform-pricing.test.js test/platform-domain.test.js PROGRESS.md
git commit -m "feat: calculate server-owned order pricing"
```

---

## Task 4: Replace the request lifecycle with the approved order lifecycle

**Files:**

- Modify: `src/platform/domain.js`
- Create: `test/platform-lifecycle.test.js`
- Modify: `src/platform/payments.js`
- Modify: `test/platform-payments.test.js`
- Modify: `PROGRESS.md`

**Step 1: Write the failing lifecycle matrix**

Assert this primary status list:

```js
[
  "Available", "Needs Clarification", "Deposit Due", "In Progress",
  "Delivered", "Revision Requested", "In Revision", "Completed",
  "Declined", "Cancelled",
]
```

Test every allowed edge and representative rejected jumps. Required guards:

- `Deposit Due` requires an immutable quote snapshot.
- `In Progress` requires confirmed deposit cents.
- `Delivered` requires at least one final deliverable.
- `Completed` requires full payment and no open revision.
- `Declined` and `Cancelled` are terminal.
- Full balance payment unlocks delivery but does not automatically replace `Delivered` with `Completed`.

Test derived queues independently: Balance Due, Delivered and Paid, Overdue, Unread.

**Step 2: Run the lifecycle tests and confirm failure**

Run: `node --test test/platform-lifecycle.test.js test/platform-payments.test.js`

Expected: FAIL against the old Submitted/Reviewing/Quoted/Ready for Review flow.

**Step 3: Implement the order domain**

Rename exports to order terminology while retaining temporary aliases only where an existing migration test needs them:

```js
export const ORDER_STATUSES = Object.freeze([...]);
export function canTransitionOrder(order, nextStatus, context = {}) {}
export function deriveOrderQueues(order, { now, unreadCount = 0 } = {}) {}
export function getRevisionEligibility(order, revisions, now = new Date()) {}
export function canDownloadAttachment(order, attachment) {}
```

The revision eligibility result must include `eligible`, `reason`, and `expiresAt` and use the first successful paid download timestamp.

**Step 4: Correct payment side effects**

Update `recordVerifiedPayment` so:

- A confirmed deposit moves `Deposit Due` to `In Progress`.
- A confirmed balance updates `paidCents` and emits payment events, but preserves `Delivered`.
- No provider event can create `Completed` directly.

**Step 5: Verify lifecycle and payment tests**

Run: `node --test test/platform-lifecycle.test.js test/platform-payments.test.js test/platform-domain.test.js`

Expected: PASS.

**Step 6: Record the checkpoint and commit**

```bash
git add src/platform/domain.js src/platform/payments.js test/platform-lifecycle.test.js test/platform-payments.test.js test/platform-domain.test.js PROGRESS.md
git commit -m "feat: enforce complete order lifecycle"
```

---

## Task 5: Extend the data model and both store adapters

**Files:**

- Create: `supabase/migrations/20260713_admin_client_platform.sql`
- Modify: `src/platform/memory-store.js`
- Modify: `src/platform/supabase-store.js`
- Modify: `src/platform/store.js`
- Modify: `test/platform-store.test.js`
- Create: `test/platform-store-contract.test.js`
- Modify: `PROGRESS.md`

**Step 1: Write one shared failing store contract**

The contract must run against `MemoryPlatformStore` and a mocked `SupabasePlatformStore` and cover:

- Order create/list/get/update using `Order` method names.
- Order ownership isolation.
- Pricing snapshot persistence.
- Revision uniqueness per included revision.
- Per-user/per-order read state.
- Admin sessions stored only by token hash.
- Session rotation, touch, expiry, and revocation.
- Append-only security and order events.
- Profile, all-payment, all-message, and all-file reporting reads.
- Atomic first-download timestamp behavior.

**Step 2: Run the contract and confirm failure**

Run: `node --test test/platform-store.test.js test/platform-store-contract.test.js`

Expected: FAIL because the new methods and schema are absent.

**Step 3: Add a forward-only Supabase migration**

Keep `service_requests` as the physical table to avoid destructive renames. Add order columns:

```sql
pricing_type text,
pricing_snapshot jsonb not null default '{}'::jsonb,
accepted_at timestamptz,
accepted_by text,
accepted_deadline timestamptz,
materials_complete boolean not null default false,
clarification_note text not null default '',
decline_reason text not null default '',
delivered_at timestamptz,
first_downloaded_at timestamptz,
completed_at timestamptz
```

Create `revisions`, `order_read_states`, `admin_sessions`, `security_events`, and `platform_settings`. Add checks, unique constraints, indexes, RLS, and revoke direct `anon`/`authenticated` access. Do not put a plaintext admin token or password column anywhere.

**Step 4: Implement adapter parity**

Add these method groups to both adapters:

```js
createOrder / listOrdersForUser / getOrderForUser / updateOrder
createRevision / listRevisions
getReadState / markOrderRead
createAdminSession / getAdminSessionByTokenHash / touchAdminSession / revokeAdminSession
appendSecurityEvent / listSecurityEvents
listProfiles / listAllPayments / listAllMessages / listAllAttachments
setFirstDownloadedAt
getSettings / updateSettings
```

Use aliases to the existing request methods only during the migration; all new routers must call the order methods.

**Step 5: Verify adapter parity and SQL safety**

Run:

```bash
node --test test/platform-store.test.js test/platform-store-contract.test.js
rg -n "plaintext|password text|session_token text" supabase/migrations/20260713_admin_client_platform.sql
```

Expected: tests PASS and the scan returns no unsafe secret columns.

**Step 6: Record the checkpoint and commit**

```bash
git add supabase/migrations/20260713_admin_client_platform.sql src/platform/memory-store.js src/platform/supabase-store.js src/platform/store.js test/platform-store.test.js test/platform-store-contract.test.js PROGRESS.md
git commit -m "feat: persist admin client platform state"
```

---

## Task 6: Build hardened MCX authentication and sessions

**Files:**

- Create: `src/platform/admin-auth.js`
- Create: `src/platform/admin-auth-router.js`
- Create: `test/admin-auth.test.js`
- Create: `test/admin-auth-api.test.js`
- Modify: `src/platform/identity.js`
- Modify: `server.js`
- Modify: `PROGRESS.md`

**Step 1: Write failing cryptographic and session tests**

Cover:

- Username is exactly `MCX` after controlled case normalization.
- Password hashes use Node `crypto.scrypt` with a per-password random salt.
- Hash parser rejects malformed or weak parameter strings.
- Verification uses equal-length buffers and `timingSafeEqual`.
- Browser receives only `sa_admin_session=<opaque random token>`; store receives only its HMAC/SHA-256 hash.
- Session cookie is `HttpOnly; SameSite=Strict; Path=/; Max-Age=28800` and `Secure` outside loopback.
- Idle expiry, eight-hour absolute expiry, rotation, logout revocation, failure throttling, progressive delay, and 15-minute lockout.
- All login failures return the same status and message.
- Security events never contain the submitted password or raw cookie.

**Step 2: Run tests and confirm failure**

Run: `node --test test/admin-auth.test.js test/admin-auth-api.test.js`

Expected: FAIL because the admin-auth modules do not exist.

**Step 3: Implement the admin session service**

Export:

```js
export function hashAdminPassword(password, options = {}) {}
export function verifyAdminPassword(password, encodedHash) {}
export function createAdminSessionService({ store, username, passwordHash, sessionSecret, now, randomBytes }) {}
```

The service must expose `login`, `resolveRequest`, `rotate`, and `logout`. Reject startup in non-demo mode if any required admin secret is missing. Read credentials only from `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, and `ADMIN_SESSION_SECRET`.

**Step 4: Implement admin-auth routes**

Provide:

- `POST /api/admin-auth/login`
- `GET /api/admin-auth/session`
- `POST /api/admin-auth/logout`

Login accepts only username/password, emits uniform errors, rotates the token, and returns a CSRF token separately from the `HttpOnly` session cookie.

**Step 5: Integrate identity without preserving Clerk-admin bypasses**

- Resolve MCX admin identity from the hardened admin session.
- Resolve Clerk identities as client/student identities.
- Remove email-inferred production admin access and the browser role switch.
- Keep localhost demo admin only on loopback.

**Step 6: Verify auth tests**

Run: `node --test test/admin-auth.test.js test/admin-auth-api.test.js test/platform-server-integration.test.js`

Expected: PASS.

**Step 7: Record the checkpoint and commit**

```bash
git add src/platform/admin-auth.js src/platform/admin-auth-router.js src/platform/identity.js server.js test/admin-auth.test.js test/admin-auth-api.test.js test/platform-server-integration.test.js PROGRESS.md
git commit -m "feat: secure the MCX admin session"
```

---

## Task 7: Add headers, origin/CSRF controls, rate limits, and file-signature validation

**Files:**

- Create: `src/platform/security.js`
- Create: `src/platform/uploads.js`
- Create: `test/platform-security.test.js`
- Create: `test/platform-uploads.test.js`
- Modify: `src/platform/http.js`
- Modify: `server.js`
- Modify: `PROGRESS.md`

**Step 1: Write failing security tests**

Assert:

- `X-Powered-By` is absent.
- CSP, HSTS in production mode, `X-Content-Type-Options`, frame protection, referrer policy, and permissions policy are present.
- Unknown origins receive no CORS permission and state-changing requests are rejected.
- `Sec-Fetch-Site: cross-site` mutations are rejected.
- Cookie-authenticated POST/PATCH/DELETE requests require a valid `x-csrf-token`.
- Stripe webhook and GitHub deploy webhook remain signature-protected exceptions to CSRF.
- Admin login, messages, uploads, payment endpoints, platform APIs, and webhooks have separate rate-limit policies.
- `/api/health` exposes only stable health fields.
- `/api/config` exposes only browser-safe public values.

**Step 2: Write failing upload-signature tests**

Test valid and mismatched PDF, JPEG, PNG, WEBP, OOXML ZIP, and text files. Reject executable content renamed as `.pdf`, inconsistent extension/MIME/signature triples, polyglot/binary text, null bytes, and files above 8 MB. Verify sanitized filenames cannot inject headers or paths.

**Step 3: Run focused tests and confirm failure**

Run: `node --test test/platform-security.test.js test/platform-uploads.test.js`

Expected: FAIL.

**Step 4: Implement centralized security middleware**

`src/platform/security.js` must export:

```js
export function createSecurityHeaders(config = {}) {}
export function createOriginGuard({ allowedOrigins, productionOrigin }) {}
export function createCsrfService({ secret, secure }) {}
export function createRateLimiters() {}
```

Use Helmet with an explicit CSP covering only self, the configured Clerk frontend, Stripe, PayPal, Google Fonts, and the existing analytics domains. Do not use `unsafe-eval`. If an inline script remains, move it to a static file instead of broadening CSP.

**Step 5: Implement binary validation**

Replace `decodeUpload` with `validateUpload` from `src/platform/uploads.js`. Storage paths must remain random and independent of the client filename. Preserve the 8 MB cap.

**Step 6: Integrate guards in correct order**

Order in `server.js`:

1. Disable Express identification.
2. Security headers.
3. Signature-specific raw webhook routes.
4. JSON parser with Stripe raw-body capture.
5. Exact-origin and Fetch-Metadata checks.
6. Authentication.
7. CSRF for cookie-authenticated mutations.
8. Route-specific rate limits.
9. Application routers.

**Step 7: Verify security tests and current payment tests**

Run: `node --test test/platform-security.test.js test/platform-uploads.test.js test/platform-payments.test.js test/platform-api.test.js`

Expected: PASS.

**Step 8: Record the checkpoint and commit**

```bash
git add src/platform/security.js src/platform/uploads.js src/platform/http.js server.js test/platform-security.test.js test/platform-uploads.test.js test/platform-api.test.js PROGRESS.md
git commit -m "feat: harden platform requests and uploads"
```

---

## Task 8: Split and complete client/admin order APIs

**Files:**

- Create: `src/platform/http-utils.js`
- Create: `src/platform/client-router.js`
- Create: `src/platform/admin-router.js`
- Create: `src/platform/reporting.js`
- Modify: `src/platform/http.js`
- Create: `test/client-orders-api.test.js`
- Create: `test/admin-orders-api.test.js`
- Create: `test/platform-reporting.test.js`
- Modify: `test/platform-api.test.js`
- Modify: `PROGRESS.md`

**Step 1: Write failing client API contracts**

Required routes:

```text
GET    /api/platform/session
POST   /api/platform/orders/handoff
GET    /api/platform/orders
GET    /api/platform/orders/:orderId
POST   /api/platform/orders/:orderId/messages
POST   /api/platform/orders/:orderId/attachments
POST   /api/platform/orders/:orderId/revisions
GET    /api/platform/attachments/:attachmentId/download
PATCH  /api/platform/profile
POST   /api/platform/orders/:orderId/payments/stripe-intent
POST   /api/platform/orders/:orderId/payments/paypal-order
POST   /api/platform/orders/:orderId/payments/paypal-capture
GET    /api/platform/notifications
```

Verify anonymous rejection, cross-client 404 behavior, input allowlists, idempotency, CSRF, payment ownership, and no admin action exposure.

**Step 2: Write failing admin API contracts**

Required routes:

```text
GET    /api/platform/admin/overview
GET    /api/platform/admin/orders
GET    /api/platform/admin/orders/:orderId
POST   /api/platform/admin/orders/:orderId/clarification
POST   /api/platform/admin/orders/:orderId/accept
PATCH  /api/platform/admin/orders/:orderId/status
POST   /api/platform/admin/orders/:orderId/deliverables
GET    /api/platform/admin/clients
GET    /api/platform/admin/messages
GET    /api/platform/admin/payments
GET    /api/platform/admin/earnings
GET    /api/platform/admin/files
GET    /api/platform/admin/exports/orders.csv
```

Test search, primary and derived status filters, deadline ordering, pagination, period filters, CSV escaping, and MCX-only access.

**Step 3: Run API tests and confirm failure**

Run: `node --test test/client-orders-api.test.js test/admin-orders-api.test.js test/platform-reporting.test.js`

Expected: FAIL because the routers and reporting module do not exist.

**Step 4: Extract shared helpers and client router**

Move generic `asyncRoute`, order access, text normalization, request-details composition, and safe public serialization into `http-utils.js`. The client router must return only the authenticated client's data and use `Order` terminology in JSON keys.

**Step 5: Implement admin router and reporting**

`reporting.js` must export pure functions:

```js
export function buildAdminOverview(data, now) {}
export function buildClientDirectory(data) {}
export function buildEarningsReport(data, { period, now }) {}
export function filterAndSortOrders(orders, query) {}
export function ordersToCsv(orders) {}
```

Revenue includes confirmed provider payments only. Outstanding balance is derived from accepted order value minus confirmed payments. Do not calculate expenses or profit.

**Step 6: Make `http.js` a composition root**

It should retain the Stripe webhook boundary, then mount client and admin routers with their explicit identity and security dependencies. Remove the old monolithic request routes after new contract tests pass.

**Step 7: Verify API suites**

Run: `node --test test/client-orders-api.test.js test/admin-orders-api.test.js test/platform-reporting.test.js test/platform-api.test.js`

Expected: PASS.

**Step 8: Record the checkpoint and commit**

```bash
git add src/platform/http-utils.js src/platform/client-router.js src/platform/admin-router.js src/platform/reporting.js src/platform/http.js test/client-orders-api.test.js test/admin-orders-api.test.js test/platform-reporting.test.js test/platform-api.test.js PROGRESS.md
git commit -m "feat: expose complete admin and client order APIs"
```

---

## Task 9: Complete delivery, paid download, and one-revision workflow

**Files:**

- Modify: `src/platform/client-router.js`
- Modify: `src/platform/admin-router.js`
- Modify: `src/platform/payments.js`
- Create: `test/delivery-revision-flow.test.js`
- Modify: `test/local-platform-smoke.test.js`
- Modify: `src/platform/demo-seed.js`
- Modify: `PROGRESS.md`

**Step 1: Write the failing end-to-end workflow test**

Exercise this exact state sequence:

```text
Available
-> Needs Clarification
-> Available
-> Deposit Due
-> In Progress (provider-confirmed deposit)
-> Delivered (final metadata visible, download returns 423)
-> Delivered and Paid derived state (provider-confirmed balance)
-> first paid download records firstDownloadedAt
-> Revision Requested (specific instructions, within 7 days)
-> In Revision
-> Delivered (redelivery)
-> Completed
```

Also test no revision before first paid download, no second included revision, expiry after seven days, additional work response, and failed file upload not changing status.

**Step 2: Run the flow and confirm failure**

Run: `node --test test/delivery-revision-flow.test.js test/local-platform-smoke.test.js`

Expected: FAIL against the incomplete old flow.

**Step 3: Implement atomic delivery behavior**

- Require a valid stored final deliverable before `Delivered`.
- Return delivery metadata even while locked.
- Return 423 for locked downloads before full payment.
- On the first successful authorized download, atomically set `firstDownloadedAt` and append `delivery.first_downloaded`.
- Create exactly one included revision record per original order.
- Redelivery replaces neither history nor the original attachment; it adds a new version.

**Step 4: Update demo seed for review coverage**

Seed deterministic examples for Available, Needs Clarification, In Progress, Delivered/Balance Due, Revision Requested, and Completed. Seed no real personal information or credentials.

**Step 5: Verify the complete workflow**

Run: `node --test test/delivery-revision-flow.test.js test/local-platform-smoke.test.js test/platform-payments.test.js`

Expected: PASS.

**Step 6: Record the checkpoint and commit**

```bash
git add src/platform/client-router.js src/platform/admin-router.js src/platform/payments.js src/platform/demo-seed.js test/delivery-revision-flow.test.js test/local-platform-smoke.test.js PROGRESS.md
git commit -m "feat: enforce paid delivery and revision workflow"
```

---

## Task 10: Restore the order wizard and build the two-mode login

**Files:**

- Modify: `public/onboard.html`
- Modify: `public/js/onboard.js`
- Modify: `public/login.html`
- Modify: `public/js/auth.js`
- Modify: `public/sign-up.html`
- Create: `test/order-entry-ui.test.js`
- Modify: `test/request-workspace-ui.test.js`
- Modify: `PROGRESS.md`

**Step 1: Write failing static UI contracts**

Assert the order wizard contains:

- Writing pages or word-count mode.
- 275 words per page and $15 standard calculation.
- Six-hour urgent toggle and $16.50 rate.
- Whole exam hours and $150/hour calculation.
- Custom quote language for tutoring/other.
- Browser estimate marked informational.
- No browser-provided `totalCents` in handoff payload.

Assert login contains Client and Admin tabs, Clerk mount only in Client mode, MCX username/password fields only in Admin mode, no role switch, no password persistence, and admin calls only `/api/admin-auth/login`.

**Step 2: Run UI tests and confirm failure**

Run: `node --test test/order-entry-ui.test.js test/request-workspace-ui.test.js`

Expected: FAIL.

**Step 3: Implement accessible order estimates**

Use integer arithmetic in browser display and send only units/urgency to the server. Update copy from Request to Order. Preserve the pending-handoff idempotency key and Clerk continuation flow.

**Step 4: Implement two-mode authentication UI**

- Client tab mounts Clerk sign-in.
- Admin tab posts username/password, keeps the password out of storage and query strings, then navigates to `/admin.html` on success.
- Uniform failure copy: `Sign-in details could not be verified.`
- Client recovery remains Clerk-owned.
- Theme and official logo are shared, constrained, and responsive.

**Step 5: Verify UI tests**

Run: `node --test test/order-entry-ui.test.js test/request-workspace-ui.test.js test/phase2-public-pages.test.js`

Expected: PASS.

**Step 6: Record the checkpoint and commit**

```bash
git add public/onboard.html public/js/onboard.js public/login.html public/js/auth.js public/sign-up.html test/order-entry-ui.test.js test/request-workspace-ui.test.js PROGRESS.md
git commit -m "feat: add priced orders and two-mode login"
```

---

## Task 11: Build the shared liquid-glass dashboard design system and routes

**Files:**

- Create: `public/css/dashboard-glass.css`
- Create: `public/js/dashboard-theme.js`
- Create: `test/dashboard-theme-ui.test.js`
- Modify: `server.js`
- Modify: `test/platform-server-integration.test.js`
- Modify: `PROGRESS.md`

**Step 1: Write failing theme and route contracts**

Assert:

- Only the approved brand colors appear as named design tokens.
- Light mode uses `#e7e4f1`; night mode uses `#12233b`.
- Theme defaults from `prefers-color-scheme`, persists to `sleekAcademia.dashboardTheme.v1`, and toggles `data-theme`.
- Reduced motion and strong focus-visible rules exist.
- `/admin` redirects to `/admin.html`; `/dashboard` redirects to `/dashboard.html`.
- `/admin.html` is protected by MCX admin session except loopback demo.
- `/dashboard.html` is protected by Clerk except loopback demo.

**Step 2: Run tests and confirm failure**

Run: `node --test test/dashboard-theme-ui.test.js test/platform-server-integration.test.js`

Expected: FAIL.

**Step 3: Implement the design tokens and primitives**

Define tokens for the exact palette, translucent surfaces, blur, inner borders, elevations, focus rings, status colors, responsive rail/drawer layouts, tables, cards, charts, timelines, dialogs, toast messages, skeletons, empty/error states, and mobile action bars.

Do not import `workspace-v2.css` into the new dashboards after migration. Public pages keep their neumorphic styles.

**Step 4: Implement theme behavior**

`dashboard-theme.js` must apply the stored/system preference before interactive dashboard rendering to avoid a flash, expose a toggle event, update `aria-pressed`, and listen for system changes only when no explicit preference is stored.

**Step 5: Implement route protection and redirects**

Add canonical redirects and dedicated page guards. Ensure static middleware cannot bypass either guarded HTML route.

**Step 6: Verify theme and route tests**

Run: `node --test test/dashboard-theme-ui.test.js test/platform-server-integration.test.js`

Expected: PASS.

**Step 7: Record the checkpoint and commit**

```bash
git add public/css/dashboard-glass.css public/js/dashboard-theme.js server.js test/dashboard-theme-ui.test.js test/platform-server-integration.test.js PROGRESS.md
git commit -m "feat: add responsive liquid glass dashboards"
```

---

## Task 12: Build the complete MCX admin dashboard

**Files:**

- Create: `public/admin.html`
- Create: `public/js/admin-dashboard.js`
- Create: `test/admin-dashboard-ui.test.js`
- Modify: `test/local-platform-smoke.test.js`
- Modify: `PROGRESS.md`

**Step 1: Write the failing admin UI contract**

Assert that the shell includes:

- Overview, Orders, Clients, Messages, Payments, Earnings, Files, Settings.
- All primary and derived order queues.
- Search, filters, deadline sort, unread and overdue indicators.
- Overview KPI targets and recent activity.
- Order command center with instructions, materials, pricing snapshot, payments, messages, files, timeline, delivery, and revision history.
- Acceptance, clarification, decline, status, deliverable, revision, and completion controls shown contextually.
- 7/30/90/all earnings filters and CSV export.
- Theme toggle, accessible mobile drawer, loading/empty/error/retry states, and logout.
- No client role switch and no manual paid control.

**Step 2: Run the UI test and confirm failure**

Run: `node --test test/admin-dashboard-ui.test.js`

Expected: FAIL because `admin.html` and its controller do not exist.

**Step 3: Build semantic dashboard markup**

Use landmarks, one page title, labelled navigation, real buttons, tables with responsive card fallbacks, dialogs with focus management, and live regions for action results. Keep the official logo constrained inside the rail.

**Step 4: Build the admin controller**

Organize by small rendering and action functions rather than one monolith:

```js
loadSession / loadOverview / loadOrders / loadOrder
renderKpis / renderOrderTable / renderOrderDetail / renderTimeline
submitClarification / acceptOrder / changeStatus / uploadDeliverable
loadClients / loadMessages / loadPayments / loadEarnings / loadFiles
downloadCsv / logout
```

All mutations must send CSRF tokens, show pending/disabled state, and refetch the affected resource after success.

**Step 5: Verify admin UI and smoke route**

Run: `node --test test/admin-dashboard-ui.test.js test/local-platform-smoke.test.js`

Expected: PASS.

**Step 6: Record the checkpoint and commit**

```bash
git add public/admin.html public/js/admin-dashboard.js test/admin-dashboard-ui.test.js test/local-platform-smoke.test.js PROGRESS.md
git commit -m "feat: build the MCX order dashboard"
```

---

## Task 13: Rebuild the complete client dashboard

**Files:**

- Modify: `public/dashboard.html`
- Create: `public/js/client-dashboard.js`
- Delete: `public/js/dashboard.js`
- Create: `test/client-dashboard-ui.test.js`
- Modify: `test/request-workspace-ui.test.js`
- Modify: `test/local-platform-smoke.test.js`
- Modify: `PROGRESS.md`

**Step 1: Write the failing client UI contract**

Assert that the client shell includes:

- Overview, My Orders, Messages, Files, Payments, Profile, Help.
- Queue, Needs Clarification, Deposit Due, In Progress, Delivered, Revision, Completed, Cancelled filters.
- Start New Order action.
- Cards showing service, calculation, deadline, quote, paid, balance, status, and latest update.
- Order detail with instructions, timeline, messages, materials, payments/receipts, deliveries, lock state, revision history, and policy help.
- Exact locked label: `Locked - pay balance to download`.
- Revision action conditional on server eligibility.
- Theme toggle and responsive drawer.
- No admin controls or `x-demo-role` switch in production UI.

**Step 2: Run the UI tests and confirm failure**

Run: `node --test test/client-dashboard-ui.test.js test/request-workspace-ui.test.js`

Expected: FAIL against the combined old workspace.

**Step 3: Build the client shell and controller**

Create focused functions:

```js
loadSession / loadOrders / loadOrder
renderOverview / renderOrders / renderOrderDetail / renderDelivery
sendMessage / uploadMaterial / payWithStripe / payWithPayPal
downloadAttachment / requestRevision / saveProfile / logout
```

The browser must treat all quote/payment/revision eligibility values as server-owned. A download response of 423 must preserve metadata and focus the balance-payment action.

**Step 4: Remove the retired combined controller**

Delete `public/js/dashboard.js` after all imports and tests point to `client-dashboard.js`. Remove the admin control region and localhost role switch from client HTML.

**Step 5: Verify client UI and smoke tests**

Run: `node --test test/client-dashboard-ui.test.js test/request-workspace-ui.test.js test/local-platform-smoke.test.js`

Expected: PASS.

**Step 6: Record the checkpoint and commit**

```bash
git add public/dashboard.html public/js/client-dashboard.js test/client-dashboard-ui.test.js test/request-workspace-ui.test.js test/local-platform-smoke.test.js PROGRESS.md
git rm public/js/dashboard.js
git commit -m "feat: build the client order dashboard"
```

---

## Task 14: Run whole-system verification and leave localhost ready for review

**Files:**

- Modify: `test/local-platform-smoke.test.js`
- Modify: `test/platform-server-integration.test.js`
- Modify: `docs/local-review.md`
- Modify: `PROGRESS.md`
- Modify other files only for defects found by verification

**Step 1: Expand the real-server smoke test**

From a spawned Express process in `LOCAL_DEMO_MODE=1`, verify:

- Homepage, footer, order wizard, login, client dashboard, and admin dashboard load.
- Non-loopback Host cannot use demo client or demo admin.
- Health response is minimal and security headers are present.
- Full order lifecycle, locked delivery, provider-simulated localhost milestones, first download, one revision, redelivery, and completion.
- Cross-client and client-to-admin access are denied.
- No manual payment route exists.

**Step 2: Run the complete automated suite**

Run:

```bash
npm test
npm run check:security
npm audit --omit=dev --audit-level=moderate
npm run test:seo
```

Expected: all commands exit 0; production audit reports zero vulnerabilities.

**Step 3: Reindex and inspect change impact**

Use codebase-memory MCP `detect_changes` and `index_repository(mode="moderate")`. Review inbound paths for the platform router, payment recorder, identity resolver, and both store adapters. Fix any missing test coverage or retired-route references.

**Step 4: Run browser-visible localhost verification**

Start the server with a dedicated loopback port and keep it running:

```bash
PORT=3000 LOCAL_DEMO_MODE=1 npm start
```

In the in-app browser, verify:

- Homepage footer at 1440 x 900 and a mobile viewport; no oversized logo or horizontal overflow.
- Public neumorphic theme remains intact.
- Client and Admin login tabs.
- Admin and client dashboards in both light and night mode.
- Desktop, tablet, and mobile layouts.
- Admin overview/queues/order command center/clients/messages/payments/earnings/files/settings.
- Client overview/orders/messages/files/payments/profile/help.
- The complete order/payment/delivery/revision flow.
- Keyboard focus, mobile drawer, reduced-motion behavior, empty/error/loading states.
- Browser console has no uncaught errors; failed requests are expected only for deliberate authorization/lock tests.

Capture screenshots for the local review handoff if the browser tool provides them.

**Step 5: Update the local review guide**

Document:

- Exact localhost URL.
- Demo Client and Demo Admin navigation.
- What is simulated locally versus provider-confirmed in production.
- Theme toggle locations.
- The locked-delivery/revision demonstration sequence.
- Explicit statement that nothing has been pushed to GitHub or Namecheap.

Do not document or generate a production MCX password in the repository.

**Step 6: Run final verification after any fixes**

Re-run every command from Step 2, plus:

```bash
git status --short
git diff --check
git log --oneline --decorate -15
```

Expected: only `.codebase-memory/` is untracked, no whitespace errors, and all implementation commits are present.

**Step 7: Commit verification artifacts without stopping localhost**

```bash
git add test/local-platform-smoke.test.js test/platform-server-integration.test.js docs/local-review.md PROGRESS.md
git commit -m "test: verify secure local admin client platform"
```

Keep the verified local server process running and report the localhost URL to Max. Stop here. Do not push.

---

## Post-local-approval deployment gate (not authorized by this plan)

Only after Max explicitly approves the localhost result:

1. Read and follow `~/.claude/skills/deploy-verify/SKILL.md` again.
2. Verify `pwd`, `git status`, `git branch --show-current`, `git remote -v`, and the exact commit.
3. Merge/push through the approved Git workflow.
4. Confirm the Namecheap source repo and live Passenger app root before any webhook-driven `rsync --delete` executes.
5. Verify the actual worker environment and public URLs; do not trust a control-panel restart response alone.
6. Verify `https://sleekacademia.com/`, `/login.html`, `/dashboard.html`, `/admin.html`, `/api/health`, headers, and one protected API denial.
7. Report live only after public-URL verification succeeds.
