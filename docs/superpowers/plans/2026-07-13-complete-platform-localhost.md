# Complete Sleek Academia Platform Localhost Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the remaining Sleek Academia public redesign and authenticated client workspace, then leave the entire platform running and reviewable on localhost before any Git push or Namecheap deployment.

**Architecture:** Keep Express plus static HTML, CSS, and browser JavaScript. Move request, payment, authorization, and delivery invariants into focused server modules; use Supabase REST and private Storage when configured, with a loopback-only in-memory demo adapter for complete localhost review. Clerk stays the production identity provider and Express remains the security boundary.

**Tech Stack:** Node.js ESM, Express 4, Clerk Express, Supabase PostgREST/Storage REST APIs, Stripe, PayPal, static HTML/CSS/JavaScript, Node `node:test`, Playwright browser checks, PNG/WebP image assets.

## Global Constraints

- Continue only in `.worktrees/phase-1-foundation-home` on `feature/phase-1-foundation-home`.
- Keep the approved homepage hero and mascot static.
- Use original, restrained motion for navigation, reveal, hover, step transitions, uploads, status changes, and payment feedback only.
- Public service CTAs never collect payment; Store checkout stays public and separate.
- Remove public Pricing/package links and package language from every public page.
- Clerk remains production authentication; Supabase remains production durable data and private file storage.
- A confirmed 50 percent deposit is required before `In Progress`.
- Confirmed full payment is required before final-work and AI-use-report downloads.
- Amounts, status transitions, file access, and roles are server-owned.
- Local demo identity and simulated payments must work only on loopback when `LOCAL_DEMO_MODE=1`.
- Preserve public URLs, canonicals, analytics identifiers, article slugs, sitemap coverage, and Store product behavior.
- Never expose credentials in source, output, or browser-delivered configuration beyond publishable client identifiers.
- Do not push or deploy. Leave a complete localhost result for Max's review.

---

### Task 1: Establish the platform domain contract

**Files:**
- Create: `src/platform/domain.js`
- Create: `test/platform-domain.test.js`

**Interfaces:**
- Produces: `REQUEST_STATUSES`, `validateRequestInput(input)`, `nextPaymentMilestone(request)`, `canTransitionRequest(request, nextStatus)`, `canDownloadAttachment(request, attachment)`, `amountDueForMilestone(request, milestone)`.
- Consumes: plain request, attachment, and payment objects without network or framework dependencies.

- [ ] **Step 1: Write failing lifecycle tests**

Cover required fields and length limits, the allowed status order, deposit gating, full-payment delivery gating, cancellation, client-file visibility, and milestone amounts. The core assertions are:

```js
assert.equal(canTransitionRequest({ status: "Deposit Due", quoteCents: 24000, paidCents: 0 }, "In Progress").ok, false);
assert.equal(canTransitionRequest({ status: "Deposit Due", quoteCents: 24000, paidCents: 12000 }, "In Progress").ok, true);
assert.equal(canDownloadAttachment({ quoteCents: 24000, paidCents: 12000 }, { category: "final", deliveryLocked: true }), false);
assert.equal(canDownloadAttachment({ quoteCents: 24000, paidCents: 24000 }, { category: "ai-report", deliveryLocked: true }), true);
assert.equal(amountDueForMilestone({ quoteCents: 24000, paidCents: 0 }, "deposit"), 12000);
assert.equal(amountDueForMilestone({ quoteCents: 24000, paidCents: 12000 }, "balance"), 12000);
```

- [ ] **Step 2: Run RED**

Run: `node --test test/platform-domain.test.js`

Expected: FAIL because `src/platform/domain.js` does not exist.

- [ ] **Step 3: Implement the pure domain module**

Use an explicit transition map, integer cents, trimmed allowlisted fields, and result objects shaped as `{ ok, error? }`. Do not read environment variables or call Express inside this module.

- [ ] **Step 4: Run GREEN and the full suite**

Run: `node --test test/platform-domain.test.js && npm test && git diff --check`

Expected: all tests pass and diff check is silent.

- [ ] **Step 5: Commit the domain milestone**

```bash
git add src/platform/domain.js test/platform-domain.test.js
git commit -m "feat: define request payment and delivery rules"
```

### Task 2: Add durable storage and loopback demo adapters

**Files:**
- Create: `src/platform/store.js`
- Create: `src/platform/memory-store.js`
- Create: `src/platform/supabase-store.js`
- Create: `src/platform/demo-seed.js`
- Create: `supabase/migrations/20260713_platform.sql`
- Create: `test/platform-store.test.js`

**Interfaces:**
- Produces: `createPlatformStore(config)`, `MemoryPlatformStore`, `SupabasePlatformStore`.
- Store methods: `upsertProfile`, `createRequest`, `findRequestByIdempotencyKey`, `listRequestsForUser`, `getRequestForUser`, `updateRequest`, `appendEvent`, `createMessage`, `listMessages`, `createAttachment`, `getAttachment`, `createPayment`, `findPaymentByProviderId`, `listNotifications`.
- Storage methods: `putPrivateObject`, `createSignedObjectUrl`.

- [ ] **Step 1: Write failing adapter contract tests**

Exercise the memory adapter with two users and assert tenant isolation, idempotent request handoff, immutable events, ordered messages, duplicate provider-payment rejection, and private attachment metadata.

- [ ] **Step 2: Run RED**

Run: `node --test test/platform-store.test.js`

Expected: FAIL because the adapter modules do not exist.

- [ ] **Step 3: Implement the memory adapter and seeded localhost workspace**

Seed one deposit-due request, one in-progress request, one completed request, representative messages, a draft file, a locked final file, an AI-use report, and notifications. Keep data process-local and label demo records visibly.

- [ ] **Step 4: Implement the Supabase adapter and migration**

Use `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` only on the server. Create `profiles`, `service_requests`, `request_events`, `messages`, `attachments`, `payments`, and `notifications`; add unique indexes for request idempotency and provider transaction IDs; enable RLS and deny direct anonymous access. Store private file paths, never public URLs.

- [ ] **Step 5: Select adapters safely**

`createPlatformStore` returns Supabase only when both required variables exist. It returns memory only when `LOCAL_DEMO_MODE=1` and the request host is loopback; otherwise startup health reports the platform store as unavailable.

- [ ] **Step 6: Run GREEN and full regression**

Run: `node --test test/platform-store.test.js && npm test && git diff --check`

- [ ] **Step 7: Commit the storage milestone**

```bash
git add src/platform supabase test/platform-store.test.js
git commit -m "feat: add Supabase and localhost platform stores"
```

### Task 3: Build the authenticated platform API

**Files:**
- Create: `src/platform/http.js`
- Create: `src/platform/identity.js`
- Create: `test/platform-api.test.js`
- Modify: `server.js`

**Interfaces:**
- Produces protected routes under `/api/platform/*`.
- Identity shape: `{ userId, role, email, fullName, demo }`.
- Client routes: `POST /requests/handoff`, `GET /requests`, `GET /requests/:id`, `POST /requests/:id/messages`, `POST /requests/:id/attachments`, `GET /attachments/:id/download`, `PATCH /profile`.
- Admin routes: `PATCH /requests/:id/quote`, `PATCH /requests/:id/status`, `POST /requests/:id/deliverables`.

- [ ] **Step 1: Write failing API authorization and idempotency tests**

Build the Express app with injected memory store and identity resolver. Assert anonymous `401`, cross-account `403`, non-admin admin action `403`, duplicate handoff returns the original request, invalid transitions return `409`, oversized/invalid uploads return `400`, and locked final downloads return `423`.

- [ ] **Step 2: Run RED**

Run: `node --test test/platform-api.test.js`

- [ ] **Step 3: Implement production Clerk and loopback demo identities**

Production uses `getAuth(req)` plus Clerk user lookup. Demo identity is permitted only when `LOCAL_DEMO_MODE=1` and `req.hostname` is `localhost`, `127.0.0.1`, or `::1`; role switching is limited to the demo environment.

- [ ] **Step 4: Implement protected request, message, file, profile, quote, and status routes**

Allowlist payloads, cap strings and decoded upload size, rename storage objects server-side, verify request membership on every read/write, append audit events, and issue short-lived signed download URLs only after `canDownloadAttachment` passes.

- [ ] **Step 5: Replace email-only service submission**

Keep notification email as a best-effort side effect after the durable request is created. A failed email must not lose or roll back a valid request.

- [ ] **Step 6: Run GREEN and full regression**

Run: `node --test test/platform-api.test.js && npm test && git diff --check`

- [ ] **Step 7: Commit the API milestone and update `PROGRESS.md`**

Record exact routes, adapter selection, tests, and the next public-page action.

### Task 4: Complete the shared public redesign, About, Blog, and Store

**Files:**
- Create: `test/phase2-public-pages.test.js`
- Create: `public/css/platform-v2.css`
- Create: `public/js/platform-motion.js`
- Modify: `public/about.html`
- Modify: `public/blog.html`
- Modify: `public/store.html`
- Modify: `public/blog/*.html`
- Modify: `public/*-prep.html`

**Interfaces:**
- Consumes: Phase 1 logo, mascot, tokens, existing canonical URLs, article data, Store Gumroad API.
- Produces: consistent public navigation/footer, restrained motion vocabulary, pricing-free internal links, About/Blog/Store layouts.

- [ ] **Step 1: Write failing public-page contract tests**

Assert every indexable page uses the official logo, has Home/About/Blog/Store/Get Started navigation, contains no `#pricing`, Pricing nav, package CTA, hardcoded Stripe/PayPal IDs, or public custom-service payment pane. Assert About, Blog, and Store load the shared brand and motion assets and retain canonicals/analytics.

- [ ] **Step 2: Run RED**

Run: `node --test test/phase2-public-pages.test.js`

Expected: FAIL on legacy Pricing links, old About/Blog/Store layouts, and hardcoded onboarding payment identifiers.

- [ ] **Step 3: Implement shared restrained motion**

Use IntersectionObserver and CSS transitions for one-time section reveal, navigation active/hover feedback, card elevation, and button press feedback. Keep the hero and mascot still. Disable nonessential effects under `prefers-reduced-motion: reduce`.

- [ ] **Step 4: Rebuild About and Blog**

Use the approved original sculptural/editorial About direction and colorful Blog reference. Preserve all article URLs, metadata, structured data, searchable categories, and readable article pages.

- [ ] **Step 5: Restyle Store without changing commerce**

Keep Gumroad-backed products, product links, prices, and immediate delivery. Replace only page presentation and shared navigation/footer.

- [ ] **Step 6: Remove Pricing/package detours everywhere**

Replace legacy public Pricing links with the exact service request intent or Store where appropriate. Keep the `/pricing.html` redirect to `/onboard.html`.

- [ ] **Step 7: Run GREEN, SEO regression, and copy scan**

Run: `node --test test/phase2-public-pages.test.js && npm test && npm run test:seo && rg -n -i "#pricing|view tutoring packages|compare .* plans" public --glob '*.html' && git diff --check`

Expected: tests pass; the pricing scan produces no matches; diff check is silent.

- [ ] **Step 8: Commit and checkpoint Phase 2**

### Task 5: Create coordinated production article artwork

**Files:**
- Create: `public/images/blog/*.webp`
- Modify: `public/blog.html`
- Modify: `public/blog/*.html`
- Modify: `test/phase2-public-pages.test.js`

**Interfaces:**
- Consumes: the approved full-body mascot identity and each article's real subject.
- Produces: one distinct 3D editorial WebP per existing article, with stable descriptive filenames and accurate alt text.

- [ ] **Step 1: Define the exact article asset manifest in the test**

Map every article slug to one required local image and assert all files exist, are referenced by listing and article pages, include width/height, lazy loading below the fold, and nonempty alt text.

- [ ] **Step 2: Run RED**

Run: `node --test test/phase2-public-pages.test.js`

- [ ] **Step 3: Generate one image per article**

Use built-in image generation, one call per asset. Keep the colorful premium 3D editorial system coherent; use the exact frog identity only when the mascot appears; avoid text, watermarks, generic placeholders, and misleading clinical or financial claims.

- [ ] **Step 4: Save, inspect, and optimize every selected asset**

Copy final assets into `public/images/blog/`, convert to WebP, verify dimensions, inspect the contact sheet, and reject identity drift or malformed objects.

- [ ] **Step 5: Wire assets and run GREEN**

Run: `node --test test/phase2-public-pages.test.js && npm test && git diff --check`

- [ ] **Step 6: Commit and checkpoint artwork**

### Task 6: Rebuild the request funnel and authenticated workspace

**Files:**
- Create: `test/request-workspace-ui.test.js`
- Create: `public/css/workspace-v2.css`
- Modify: `public/onboard.html`
- Modify: `public/js/onboard.js`
- Modify: `public/sign-up.html`
- Modify: `public/login.html`
- Modify: `public/dashboard.html`
- Modify: `public/js/dashboard.js`

**Interfaces:**
- Browser pending-request key: `sleekAcademia.pendingRequest.v2`.
- Pending payload includes `idempotencyKey`, service-specific brief fields, contact fields, and initial attachment descriptors.
- Dashboard API base: `/api/platform`.

- [ ] **Step 1: Write failing UI contract tests**

Assert service-specific fields, contact step, assurance copy, local pending-request persistence, Clerk mount target, idempotency key, post-auth handoff call, workspace navigation, request detail, messages, files, payments, profile, help, empty/loading/error states, and no public payment controls.

- [ ] **Step 2: Run RED**

Run: `node --test test/request-workspace-ui.test.js`

- [ ] **Step 3: Build the branded service wizard**

Collect support type, service-specific details, name, email, optional urgent phone, optional school, assurance review, and initial files. Validate each step, save the pending payload locally, and mount Clerk only after the request review.

- [ ] **Step 4: Implement idempotent post-auth handoff**

On authenticated dashboard load, send the pending payload once to `/api/platform/requests/handoff`, open the returned request, then clear local state only after a successful server response.

- [ ] **Step 5: Build the client workspace**

Implement Overview, My Requests, Messages, Files, Payments, Profile, and Help. Include loading skeletons, useful empty states, inline errors, responsive sidebar/bottom navigation, request timeline, quote/payment card, and locked delivery explanation.

- [ ] **Step 6: Build the admin workspace**

Admins can review briefs, quote, message, upload deliverables, and perform allowed status changes. Demo mode exposes a clearly labeled client/admin switch only on localhost.

- [ ] **Step 7: Run GREEN and full regression**

Run: `node --test test/request-workspace-ui.test.js && npm test && git diff --check`

- [ ] **Step 8: Commit and checkpoint funnel/workspace**

### Task 7: Add server-owned staged payments and delivery gates

**Files:**
- Create: `test/platform-payments.test.js`
- Create: `src/platform/payments.js`
- Modify: `src/platform/http.js`
- Modify: `server.js`
- Modify: `public/js/dashboard.js`

**Interfaces:**
- Produces: `POST /api/platform/requests/:id/payments/stripe-intent`, `POST /api/platform/requests/:id/payments/paypal-order`, `POST /api/platform/requests/:id/payments/paypal-capture`, `POST /api/platform/payments/stripe-webhook`, and loopback-only `POST /api/platform/requests/:id/payments/demo-confirm`.
- Payment records use unique `{ provider, providerTransactionId }` and server-calculated milestone amounts.

- [ ] **Step 1: Write failing payment tests**

Assert request membership, milestone selection, server-owned amount, duplicate-provider idempotency, failed/unverified payment immutability, deposit status progression, full-payment download unlock, and demo endpoint rejection outside loopback demo mode.

- [ ] **Step 2: Run RED**

Run: `node --test test/platform-payments.test.js`

- [ ] **Step 3: Implement provider services and routes**

Create Stripe intents and PayPal orders only from the stored quote and next milestone. Record confirmed payments only after Stripe webhook verification or PayPal server capture verification. Never accept a browser amount as payment truth.

- [ ] **Step 4: Implement localhost payment simulation**

Allow explicit milestone confirmation only in loopback demo mode, label it as simulated, create normal audit/payment records, and exercise the same domain gates as a real provider confirmation.

- [ ] **Step 5: Wire dashboard payment states**

Show deposit due, deposit paid, balance due, paid, provider errors, and locked/unlocked delivery. Keep client messages and uploaded source files available while payment is pending.

- [ ] **Step 6: Run GREEN and security regression**

Run: `node --test test/platform-payments.test.js && npm test && git diff --check`

- [ ] **Step 7: Commit and checkpoint payments/delivery**

### Task 8: Verify the complete localhost system and leave it running

**Files:**
- Create: `test/local-platform-smoke.test.js`
- Create: `docs/local-review.md`
- Modify: `PROGRESS.md`

**Interfaces:**
- Consumes: the finished public site, loopback demo adapter, request workspace, payment gates, and Store.
- Produces: a verified localhost URL, desktop/mobile screenshots, and exact review steps for Max.

- [ ] **Step 1: Read and apply verification-before-completion skill**

Run all evidence fresh in this milestone; do not rely on earlier green output.

- [ ] **Step 2: Run automated verification**

Run: `npm test`, `npm run test:seo`, `node --check server.js`, `node --check public/js/onboard.js`, `node --check public/js/dashboard.js`, `git diff --check`, secret-pattern scan, public Pricing/package scan, and route smoke tests.

- [ ] **Step 3: Start the real Express app in localhost demo mode**

Run: `LOCAL_DEMO_MODE=1 PORT=4173 npm start`

Expected: `/api/health` reports healthy demo storage, `/` and all public pages return `200`, `/dashboard.html` is usable without production credentials only on loopback, and remote-host demo access remains disabled.

- [ ] **Step 4: Exercise every core browser path**

At desktop and mobile widths, verify Home, About, Blog search/filter, every article image, Store products, request wizard, pending handoff, client/admin views, messages, uploads, timeline, profile, deposit gate, status transition, balance gate, final/AI-report downloads, logout/login behavior, keyboard focus, and reduced motion.

- [ ] **Step 5: Capture screenshots and repair every visible defect**

Save fresh desktop and mobile captures under `tmp/local-review/`; for each behavior defect, add a failing regression test before the fix.

- [ ] **Step 6: Write the local review guide and final checkpoint**

Document the exact localhost URL, client/admin demo switch, review sequence, tests, screenshot paths, production environment variables still required, Supabase migration path, and the hard stop before Git push/Namecheap.

- [ ] **Step 7: Leave the verified server running and report the URL**

Do not push, merge, deploy, or run the destructive Namecheap sync.
