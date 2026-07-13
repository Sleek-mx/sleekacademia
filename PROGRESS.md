# PROGRESS — Sleek Academia Platform Redesign

Goal: Rebuild the public site and authenticated client workspace, then verify the completed platform live on Namecheap.

Plan:

1. Foundation and Home.
2. About, Blog, and Store.
3. Request Funnel and Signup.
4. Dashboard Backend.
5. Payments and Delivery.
6. QA and Namecheap Launch.

Current approved extension: replace dashboard liquid glass with branded light/night neumorphism, use one role-neutral login surface, add structured request dropdowns, move order details from dialogs to dedicated pages, and refresh Blog cards and artwork before another complete localhost review.

## Done

- [x] Verified `origin` is `https://github.com/Sleek-mx/sleekacademia.git` and restored the canonical local checkout.
- [x] Audited the live site, Express/Clerk architecture, existing dashboard, public payment code, Store, About, Blog, and deployment path.
- [x] Locked the signup-first public flow, dashboard scope, Supabase-backed architecture, 50/50 payment gates, official logo, full-body mascot, and Vibrant Academic Studio direction.
- [x] Wrote the approved platform design specification at `docs/superpowers/specs/2026-07-13-sleek-academia-platform-redesign-design.md`.
- [x] Completed Phase 1 on `feature/phase-1-foundation-home`: official logo variants, favicon/touch icon, optimized full-body mascot, shared Vibrant Academic Studio CSS, and a fully rebuilt signup-first homepage.
- [x] Removed public homepage pricing/packages and redirected the retired `/pricing.html` route to `/onboard.html`; Store checkout remains separate.
- [x] Verified Phase 1 with 31 passing tests, clean diff checks, successful local HTTP checks, and desktop/mobile renders from the running Express app.
- [x] Rejected and fully reverted the browser-native hero character animation. The homepage is back to the approved static Phase 1 design through revert commits `718a924` and `4071e81`.
- [x] Resumed the exact Phase 1 worktree, read the complete handoff/transcript/spec, verified `feature/phase-1-foundation-home`, verified `origin`, and reconfirmed all 31 baseline tests pass.
- [x] Audited the current Express/Clerk/payment/onboarding/dashboard code and saved the complete Phases 2-6 execution plan at `docs/superpowers/plans/2026-07-13-complete-platform-localhost.md`.
- [x] Completed full-build Task 1 in `src/platform/domain.js`: allowlisted request validation, approved status transitions, integer-cent milestone math, 50 percent deposit gate, full-payment completion gate, and protected final/AI-report downloads. Added 8 focused tests; full suite is 39 passing.
- [x] Completed full-build Task 2: tenant-isolated/idempotent in-memory store, loopback-safe adapter selection, production Supabase PostgREST/private Storage adapter, demo workspace seed, and the complete SQL migration at `supabase/migrations/20260713_platform.sql`. Added 6 focused tests; full suite is 45 passing.
- [x] Completed full-build Task 3: Clerk/loopback identity resolver plus protected profile, request handoff/list/detail, message, upload, deliverable, quote, status, notification, and gated-download APIs mounted at `/api/platform`. Local integration proves the seeded demo workspace is loopback-only. Added 10 focused/integration tests; full suite is 55 passing.
- [x] Completed full-build Task 4: rebuilt About, Blog, and Store on the official brand system; added accessible reduced-motion-safe reveal/navigation behavior; added complete Blog search and field filters; preserved Gumroad live synchronization, analytics, schema, social profiles, canonicals, and all article URLs; removed public Pricing/package detours across prep and article pages. Added 6 focused tests; full suite is 61 passing and SEO suite is 6 passing.
- [x] Completed full-build Task 5: generated, visually inspected, optimized, and installed ten distinct 1200 by 751 WebP editorial illustrations across the Blog listing and every existing article; updated article social images and added a manifest contract that prevents missing or placeholder artwork. Full suite is 62 passing.
- [x] Completed full-build Task 6: removed legacy public checkout from onboarding; built the four-step service-specific brief and contact wizard; added local pending-request persistence and idempotent Clerk/demo handoff; rebuilt sign-up/login; and replaced the legacy role/course dashboard with complete client/admin request, message, file, payment-record, profile, help, quote, status, and delivery surfaces. Added 5 UI contract tests; full suite is 67 passing and SEO suite is 6 passing.
- [x] Completed full-build Task 7: retired browser-amount payment endpoints; added server-calculated deposit/balance amounts, Stripe intent and verified webhook handling, pre-validated PayPal order/capture, provider transaction idempotency, loopback-only simulation, automatic deposit/completion progression, dashboard provider states, and full-payment delivery unlocks. Added 7 payment/security tests; full suite is 74 passing.
- [x] Completed full-build Task 8: added a localhost end-to-end smoke test; exercised the public pages, request handoff, client/admin workspace, quote, deposit, status progression, balance, completed delivery, mobile layout, and navigation in the in-app browser; humanized activity labels found during visual review; saved `docs/local-review.md` and desktop/mobile screenshots; and left the app running at `http://localhost:4173/`.
- [x] Passed the final localhost gate on 2026-07-13: 76/76 application tests, 6/6 SEO tests, JavaScript syntax checks, `git diff --check`, credential-pattern scan, retired-pricing scan, unsafe legacy-payment-route scan, and clean browser consoles.
- [x] Audited Max's footer screenshot and reproduced the regression: the global `img { display: block }` rule overrides a redundant hidden 1595 by 993 footer logo, producing a 1,354-pixel footer.
- [x] Re-audited the live `https://sleekacademia.com` visual system and confirmed the exact neumorphic source colors, fonts, raised/pressed shadows, and current official-logo treatment.
- [x] Approved the role-separated platform design: MCX password login and dedicated admin dashboard, Clerk client dashboard, server-calculated writing and exam pricing, 50/50 payment gates, delivered-but-locked files, one seven-day revision, complete queues/clients/messages/payments/earnings/files, and no offline or M-Pesa payment recording.
- [x] Completed a security audit: preserved strong tenant isolation/private storage/provider verification, found 3 high and 3 moderate dependency advisories plus missing rate limits, CSRF, and security headers, and made those findings release blockers. MCX MFA is explicitly deferred.
- [x] Wrote and self-reviewed the approved design at `docs/superpowers/specs/2026-07-13-sleek-academia-admin-client-platform-design.md`.
- [x] Max approved the written admin/client platform specification.
- [x] Created and self-reviewed the 14-task test-driven implementation plan at `docs/superpowers/plans/2026-07-13-secure-admin-client-platform.md`.
- [x] Completed revised-platform Task 1: removed the redundant 1595 by 993 footer logo, added a global `[hidden]` safeguard, preserved the constrained visible mark/name lockup, and added a focused regression test.
- [x] Completed revised-platform Task 2: patched Clerk, Axios, Express, and vulnerable transitive packages; added Helmet and express-rate-limit; established a tracked-source security release gate; reached zero production audit vulnerabilities; and kept the full suite green at 81/81.
- [x] Completed revised-platform Task 3: implemented immutable server-owned writing, urgent-writing, exam-hour, and custom pricing snapshots; added exact 50/50 milestone splits and safe-integer guards; extended order input fields; and kept the full suite green at 91/91.
- [x] Completed revised-platform Task 4: added the approved order lifecycle and derived Balance Due/Delivered and Paid/Overdue/Unread queues, enforced quote/deposit/deliverable/payment/revision guards, added the seven-day included-revision eligibility window, stopped payment providers from auto-completing work, and kept the full suite green at 96/96.
- [x] Completed revised-platform Task 5: extended both memory and Supabase adapters with Order aliases, revisions, read state, hashed admin sessions, append-only security events, reporting reads, atomic first-download timestamps, and protected settings; added a forward-only RLS migration; and kept the full suite green at 111/111.
- [x] Completed revised-platform Task 6: added scrypt-backed MCX credentials, uniform and progressively delayed login failures, temporary lockout, hashed revocable sessions, strict HttpOnly cookies, rotating CSRF tokens, idle/absolute expiry, security events, and a dedicated admin identity boundary; removed Clerk email/metadata admin escalation paths and kept the full suite green at 125/125.
- [x] Completed revised-platform Task 7: disabled framework disclosure; added hashed-script CSP, production HSTS and browser security headers, exact-origin and Fetch Metadata guards, signed double-submit CSRF, six route-specific throttling policies, minimal health/config responses, and binary signature validation for approved uploads; kept all 136 tests green and the production dependency audit at zero vulnerabilities.
- [x] Completed revised-platform Task 8: split the platform API into tenant-isolated client and MCX-only admin routers; added server-priced Order handoff, cross-client 404 protection, complete admin queues/actions, client directory, global messages/payments/files views, confirmed-provider earnings, safe filtering/pagination, and formula-safe CSV export; kept all 147 tests green.
- [x] Completed revised-platform Task 9: enforced the exact clarification/accept/deposit/delivery/balance/revision/redelivery/completion flow; kept final metadata visible while downloads return 423 until fully paid; atomically opens one seven-day included revision on first paid download; retains delivery versions; returns expired/second revisions as additional work; expanded deterministic demo coverage; kept all 149 tests green.
- [x] Completed revised-platform Task 10: upgraded onboarding to explicit page/word writing units, urgency, whole exam hours, server-authoritative estimates, order handoff, protected attachment upload, and client routing; rebuilt login with isolated Clerk client and MCX administrator modes without credential persistence; kept all 152 tests green and the dependency audit at zero vulnerabilities.
- [x] Completed revised-platform Task 11: added the shared Sleek-palette liquid-glass dashboard system with light/night preference persistence, reduced-motion/transparency fallbacks, accessible focus states, responsive rail/table/dialog/state primitives, canonical dashboard aliases, and non-bypassable Clerk client and MCX admin HTML guards; kept all 155 tests green and the dependency audit at zero vulnerabilities.
- [x] Completed revised-platform Task 12: built the dedicated MCX admin dashboard with complete lifecycle and derived queues, search/sort, order command center, clarification/acceptance/decline/status/delivery/revision/completion controls, client/message/payment/earnings/file reporting, 7/30/90/all earnings, CSV export, secure logout, responsive drawer, and resilient loading/empty/error states; kept all 159 tests green and both security audits at zero vulnerabilities.
- [x] Completed revised-platform Task 13: replaced the combined legacy workspace with a dedicated Clerk client dashboard covering overview, order queues/cards/details, messages, materials, provider payments/receipts, locked delivery metadata, 423 handling, server-owned revision eligibility, one included seven-day revision, profile/help, light/night theme, responsive drawer, and resilient states; removed the client/admin role switch and retired controller; kept all 162 tests green.
- [x] Completed revised-platform Task 14: expanded the real-server smoke flow through paid download, one included revision, redelivery, second-revision denial, completion, client/admin isolation, and absence of manual-payment routes; denied non-loopback demo admin access; visually reviewed public/login/admin/client surfaces at desktop and mobile sizes in the in-app browser; verified both dashboard themes, all navigation sections, responsive drawers, locked and paid delivery states, and a clean browser console; fixed and regression-tested decorative homepage overflow; updated `docs/local-review.md`; passed 163/163 application tests, 6/6 SEO tests, the tracked-source security gate, dependency audit, and diff checks with zero vulnerabilities.
- [x] Approved the Neumorphic Workspace and Blog Refresh design, covering structured request fields, unified login, dedicated order pages, light/night soft UI, visible Blog copy, and varied topic-specific artwork.
- [x] Saved the approved refresh specification and implementation plan under `docs/superpowers/`.
- [x] Implemented and live-tested the Neumorphic Workspace and Blog Refresh: structured subject/help dropdowns and exam-hour guidance, one role-neutral login, dedicated client/admin order pages, true same-surface light/night neumorphism with branded motifs, ten varied topic-specific Blog illustrations with visible summaries, and responsive dashboard navigation.
- [x] Passed the refreshed localhost gate on 2026-07-13: 170/170 application tests, 6/6 SEO tests, the tracked-source security release gate across 64 files, zero production dependency vulnerabilities, desktop/mobile browser checks, light/night visual checks, client/MCX login routing, delivered-file payment locking, dedicated-order navigation, responsive drawers, and clean browser logs.

## Next

- [x] Execute the approved plan inline with red-green-refactor tests and checkpoint commits.
- [x] Verify the entire revised platform locally and leave the server running; do not push or deploy until Max approves that local result.
- [ ] After Max reviews localhost and explicitly approves launch, reverify the GitHub remote and destructive deployment source/destination, configure production credentials, push for the Namecheap auto-build, and verify the public URL before reporting live.

## Facts a fresh session needs

- Repository: `/Users/ephantusmacharia/Websites/Active Projects/sleek-academia-render`
- Remote: `https://github.com/Sleek-mx/sleekacademia.git`
- Production: `https://sleekacademia.com`
- Namecheap live directory: `/home/sleenegb/public_html/sleekacademianewsite`
- Deployment: push to GitHub, webhook, Passenger restart; `.cpanel.yml` and `server.js` use destructive `rsync --delete`, so verify the complete source and destination before pushing.
- Official logo source: `/Users/ephantusmacharia/Downloads/sleek academia logo2.png`
- Approved visual reference: `/Users/ephantusmacharia/Downloads/ChatGPT Image Jul 13, 2026, 01_00_01 AM.png`
- Blog reference: `/Users/ephantusmacharia/Downloads/ChatGPT Image Jul 13, 2026, 01_21_18 AM.png`
- About reference: supplied PROSION screenshot and Dribbble link.
- Public services never take payment; custom-service payment happens only in the dashboard.
- Custom requests require 50 percent deposit before `In Progress` and full payment before final/AI-report downloads.
- Store checkout remains immediate and separate.
- The hero must remain static. The rejected typing/thinking mascot animation must not be recreated.
- Use 21st.dev only as interaction inspiration; implement original, restrained website transitions and micro-interactions consistent with the Sleek Academia brand.
- Full remaining implementation plan: `docs/superpowers/plans/2026-07-13-complete-platform-localhost.md`.
- Baseline on resume: `npm test` = 31 passing, 0 failing on 2026-07-13.
- Local review will use a loopback-only `LOCAL_DEMO_MODE=1`; production still requires Clerk and Supabase and must never expose demo identity remotely.
- Supabase schema: `supabase/migrations/20260713_platform.sql`; private bucket: `sleek-academia-private`.
- Protected platform API base: `/api/platform`; production identity is Clerk, local review identity exists only for loopback hosts with `LOCAL_DEMO_MODE=1`.
- Never put credentials in Git or chat; use `/Users/ephantusmacharia/Secret Stash/08 - Credentials & Keys` when secrets are required.
- Canonical revised design: `docs/superpowers/specs/2026-07-13-sleek-academia-admin-client-platform-design.md`.
- Writing rate: $15 per 275-word page; six-hour urgent rate: $16.50 per page; exam assistance: $150 per whole hour.
- Provider-confirmed Stripe/PayPal only; no manual paid override, offline payment, or M-Pesa recording.
- Dashboard design: true light/night neumorphism using the same-surface raised/inset rules, exact website/logo accents, and restrained logo-derived background motifs.
- Approved refresh specification: `docs/superpowers/specs/2026-07-13-neumorphic-workspace-and-blog-refresh-design.md`.
- Approved refresh plan: `docs/superpowers/plans/2026-07-13-neumorphic-workspace-and-blog-refresh.md`.
- Security release status: dependency audit, CSP/security headers, rate limits, CSRF, upload signature checks, tenant isolation, private-file gates, provider verification, and hardened MCX password/session controls are implemented and passing. Production secret/provider configuration and MCX MFA remain launch-time work; MFA is explicitly deferred.
- Approved revised implementation plan: `docs/superpowers/plans/2026-07-13-secure-admin-client-platform.md`.
