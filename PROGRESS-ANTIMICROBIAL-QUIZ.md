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

- [x] Merged to `main` and pushed (`5af5711`). rsync deployed the static files:
      `/antimicrobial-quiz`, its CSS and its JS are all live and 200.

- [x] Added the production env vars to `sleekacademianewsite/.env`
      (`NVIDIA_API_KEY`, `QUIZ_SIGNING_SECRET`, `QUIZ_ACCESS_CODE`,
      `QUIZ_PAYEE_EMAIL`). `.env` backed up first to `.env.bak-prequiz-*`.
      `PAYPAL_*` were already present and already pointed at the live host.
- [x] **Root-caused the failed restart:** the runtime is LiteSpeed (`lsnode`),
      not Phusion Passenger, so `touch tmp/restart.txt` is a no-op. The old
      process had `etime` 1h13m — it never reloaded, which is why new static
      files were live while new routes 404'd. Fixed by killing the lsnode pid
      and issuing a request so LiteSpeed respawns.
- [x] **LIVE AND VERIFIED** at `https://sleekacademia.com/antimicrobial-quiz`.

## Verified on production
- `/api/quiz/health` → `bankProblems: 0`, tutor configured, paypalLive true, payee correct.
- `/api/quiz/next` leaks no answer-key field; option ids are opaque digests.
- `q051` without entitlement → 402. Forged entitlement → 402. Tutor endpoints on
  a paid question → 402 (no free AI farming on paywalled items).
- Nemotron 3 Super returns accurate `source: "ai"` remediation notes live.
- `/.env` → 403. Rest of the site unaffected: `/`, `/nclex-prep.html`,
  `/about.html`, `/blog.html`, `/store.html`, `/api/health` all 200.

## Round 2 (same day) — neumorphism, mobile, stranded-remediation fix
- [x] Rebuilt the stylesheet as Sleek Academia **neumorphism** on the tokens in
      `public/css/neumorphism.css`: one `#e7e4f1` surface, `#c3bdd8`/`#ffffff`
      dual shadows, `#702ae1→#9d6bff` as the only accent. Element background
      equals page background; raised = resting, inset = pressed/selected/input.
- [x] Mobile-first: base styles target a phone, shadow depth scales up at 42rem.
      Verified no horizontal overflow at 375px and full-width tap targets.
- [x] Fixed the logo: `/images/logo.png` is a 400x99 lockup that was declared
      40x40 and squashed. Now uses the square `brand/sleek-academia-mark`.
- [x] Fixed "Feedback is unavailable right now". Root cause was latency, not
      logic — see the commit for numbers. `thinking:false` cut the loop from
      ~31s to ~6.6s, plus a server retry, a 200-with-fallback instead of 400,
      and a client-side fallback to the bank's own remediation text.
- [x] Cache-busted the asset URLs (`?v=2`). CSS/JS ship as
      `public, max-age=14400`, so the redesign was invisible to any browser
      holding the old file. **Bump `?v=` on every CSS/JS edit** — enforced by a test.

## Next
- [ ] Nothing blocking. Optional: add level 1–2 items if the ladder should span
      the full 1–5 described in the brief (engine already degrades gracefully).

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
- **Production env vars are ALL SET** in `/home/sleenegb/public_html/sleekacademianewsite/.env`
  (mode 600, web-blocked 403, rsync-excluded so it survives deploys):
  `NVIDIA_API_KEY`, `QUIZ_SIGNING_SECRET`, `QUIZ_ACCESS_CODE`, `QUIZ_PAYEE_EMAIL`,
  and `PAYPAL_*` with `PAYPAL_BASE_URL=https://api-m.paypal.com` (LIVE — the vault
  creds are rejected by sandbox). Access-code value is in the vault, not here.
  Do NOT rotate `QUIZ_SIGNING_SECRET` casually: it invalidates unlocks already sold.
- **RESTART: `touch tmp/restart.txt` DOES NOT WORK on this host.** It runs
  LiteSpeed (`lsnode`), not Phusion Passenger. Kill the process and issue one request:
  ```
  PID=$(ps -eo pid,args | grep "[l]snode:/home/sleenegb/public_html/sleekacademianewsite" | awk '{print $1}' | head -1); kill "$PID"
  curl -s -o /dev/null https://sleekacademia.com/
  ```
  Tell-tale: `ps -eo pid,etime,args | grep [l]snode` — an `etime` predating the
  deploy means it never reloaded. New routes 404ing while new static files are
  live is always this.
- **Bump `?v=` on the css/js links in the HTML on every CSS/JS edit.** Assets ship
  as `public, max-age=14400`; without a bump, returning visitors keep the old
  stylesheet for up to 4 hours and a redesign looks like it never deployed.
  Enforced by a test.
- Cloudflare fronts the site and 403s (error 1010) non-browser user agents —
  Python `urllib` is blocked, `curl` passes. Use a browser UA when testing live,
  or you will misread a healthy endpoint as broken.
- Deploy trigger: push to `main` → GitHub webhook → `POST /deploy.php` → git pull
  + rsync. Requires `GITHUB_WEBHOOK_SECRET` set on the server.
- Local dev needs `ALLOWED_ORIGINS` to include `http://localhost:3200`, otherwise
  the origin guard 403s every browser POST. Production already allows sleekacademia.com.
- The bank spans difficulty 3–5 only (the brief describes 1–5). `nearestAvailableDifficulty`
  resolves a demotion below 3 up to 3. Adding level 1–2 items needs no code change.
