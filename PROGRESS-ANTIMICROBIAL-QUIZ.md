# PROGRESS — NURS 5334 Antimicrobial Mastery Challenge

Goal: Ship an adaptive 100-question antimicrobial pharmacology quiz at
`sleekacademia.com/antimicrobial-quiz` — first 50 free, Q51–100 behind a live
$10 PayPal unlock, with a Nemotron 3 Super remediation loop on every miss.

Plan:
1. Question bank (100 items, full rationales) — `src/quiz/questions/*.js`
2. Quiz API + server-side grading, opaque option ids — `src/quiz/router.js`
3. Nemotron remediation loop (notes → 2 open-ended probes → AI evaluation)
4. PayPal live paywall + HMAC entitlement — `src/quiz/entitlement.js`
5. Adaptive engine + front-end UI — `public/antimicrobial-quiz.html`, `public/js/`
6. Results dashboard + printable summary
7. QC + tests + deploy + verify live URL

## Done
- [x] Verified all three external dependencies before building:
      NVIDIA NIM key works, `nvidia/nemotron-3-super-120b-a12b` responds
      (returns `reasoning_content` — must be stripped);
      PayPal **live** creds valid (app `APP-89U56214JK239233E`, sandbox rejects them);
      live order accepted payee `macsiemoney@gmail.com`.
- [x] Branch `feature/antimicrobial-quiz` cut from `main`.
- [x] Question bank: 100 items in `src/quiz/questions/01..10-*.js`, 106 points,
      6 SATA. `validateBank()` reports 0 problems.
- [x] `signing.js` (HMAC entitlements + opaque option ids), `adaptive.js`
      (ladder, remediation queue, mastery, results), `nemotron.js`, `paypal.js`,
      `router.js`. Mounted at `/api/quiz` in `server.js`.
- [x] Front end: `public/antimicrobial-quiz.html` + `css/` + `js/`.
- [x] 39 new tests in `test/antimicrobial-quiz.test.js`. **Full suite 221/221 green.**
- [x] Verified in-browser: adaptive ladder, SATA validation, full Nemotron
      remediation loop (notes → 2 probes → evaluation), paywall + PayPal buttons
      mounting, results dashboard, mobile 375px with no overflow.
- [x] Registered `antimicrobial-quiz.html` in `utilityPages` in
      `test/seo-static.test.js` — it is noindex and out of the sitemap by design.

## Next
- [ ] Merge to `main`, push (auto-deploys), verify the LIVE url.
- [ ] **Max must add production env vars** (see below) — quiz works without them
      but unlock tokens reset on restart and the access code stays disabled.

## Facts a fresh session needs
- Repo: `~/Websites/Active Projects/sleek-academia-render` → `Sleek-mx/sleekacademia`, branch `main` deploys.
- Deploy: cPanel `.cpanel.yml`, `rsync -av --delete` → `/home/sleenegb/public_html/sleekacademianewsite`.
  **`main` was in sync with `origin/main` at branch time**, so the live tree mirrors main and
  adding files is safe. Never push a main that is missing live files — `--delete` wipes them.
- The repo has UNRELATED uncommitted work (blog posts, neumorphism edits). Commit quiz files ONLY.
- Server: Express, `server.js`, static root `public/`. Existing NIM pattern at `POST /api/ai/chat`.
- Env vars already present in production `.env`: `NVIDIA_API_KEY`, `PAYPAL_CLIENT_ID`,
  `PAYPAL_SECRET`, `PAYPAL_BASE_URL`. New ones needed: `QUIZ_SIGNING_SECRET`, `QUIZ_ACCESS_CODE`.
- Secrets live in vault `08 - Credentials & Keys/` (`AI & API Keys.md`,
  `Payments - Stripe & PayPal.md`). Never paste values into chat.
- Stripe in this project is TEST mode only — that is why the paywall uses PayPal.
- Quizlet source links return HTTP 403 (bot-blocked) and copying test-bank content is
  barred by the brief's own QC rules — bank is the 100 original questions supplied.
- Answer key must never reach the client pre-submission: grading is server-side and
  option ids are HMAC-derived per attempt.
- **Production env vars still to add** to `/home/sleenegb/public_html/sleekacademianewsite/.env`:
  - `QUIZ_SIGNING_SECRET=<64 hex chars>` — without it, tokens use an ephemeral
    per-process secret and paying learners lose access on every app restart.
  - `QUIZ_ACCESS_CODE=<>=8 chars>` — the free-unlock escape hatch; disabled when unset.
  - `QUIZ_PAYEE_EMAIL=macsiemoney@gmail.com` — defaults to this anyway.
  - `PAYPAL_BASE_URL=https://api-m.paypal.com` — must be the LIVE host; the
    vault creds are rejected by sandbox. The rest of the app defaults to sandbox,
    so confirm this value is set rather than assuming.
  Then restart Passenger: `touch ~/public_html/sleekacademianewsite/tmp/restart.txt`
- Deploy trigger: push to `main` → GitHub webhook → `POST /deploy.php` → git pull
  + rsync. Requires `GITHUB_WEBHOOK_SECRET` set on the server.
- Local dev needs `ALLOWED_ORIGINS` to include `http://localhost:3200`, otherwise
  the origin guard 403s every browser POST. Production already allows sleekacademia.com.
- The bank spans difficulty 3–5 only (the brief describes 1–5). `nearestAvailableDifficulty`
  resolves a demotion below 3 up to 3. Adding level 1–2 items needs no code change.
