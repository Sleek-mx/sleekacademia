# PROGRESS — NURS 5315 Renal, Urologic & Cardiac Pathophysiology Challenge

Goal: A second adaptive 100-question quiz at `sleekacademia.com/renal-cardiac-quiz`,
on the same engine as the antimicrobial quiz — first 50 free, Q51–100 behind a
$10 PayPal unlock, Nemotron 3 Super remediation on every miss.

Confirmed with Max before building: **pathophysiology**, not pharmacology
(NURS 5315 is Advanced Patho; 5334 was pharmacology), and the **same**
100-question / 50-free / $10 structure.

Plan:
1. Refactor the engine so a bank is a parameter, not a hardcoded import
2. Write the 100-item renal/urology/cardiac patho bank
3. Share the front-end assets between both quizzes
4. New page + route mount + SEO registration
5. Tests, deploy, verify both live URLs

## Done
- [x] Branch `feature/renal-cardiac-quiz` cut from `main` while `main` was in
      sync with `origin/main` (so the `rsync --delete` deploy cannot wipe live files).
- [x] **Refactor to multi-quiz.** `bank.js` (generic bank factory + QC),
      `engine.js` (`createEngine(bank, meta)`), scope-aware `signing.js`,
      domain-aware `nemotron.js`, parameterised `paypal.js` order,
      `createQuizRouter(quizDef)`, registry in `quizzes.js`. Deleted `adaptive.js`
      (it would have been a vestigial shim with one consumer). Full suite green
      throughout, so the antimicrobial quiz never regressed.
- [x] **`conceptKey`** added: separates the remediation *grouping key* from the
      teaching prose in `remediationConcept`. Before this, both banks had 100
      unique concepts, so the `remediation-retest` path could never fire and every
      re-test degraded to the same-topic fallback. 23 groups now in the new bank.
- [x] **100-question bank** in `src/quiz/questions-renal-cardiac/01..10-*.js`,
      106 points, 6 SATA, difficulty 2–5, 51 topics, 14 categories.
      `validateBank()` reports 0 problems.
- [x] **Free/paid split interleaved.** Section files are topic-grouped, so file
      order would have left ALL cardiac and urology items behind the paywall — a
      non-paying learner would see none of the two subjects the quiz is named for.
      `PRESENTATION_ORDER` in `renal-cardiac-bank.js` takes 5 from each section
      per half. Both halves span all three domains; no concept group straddles
      the paywall; the paid half skews harder (25 level-4s and 7 level-5s).
- [x] **Shared front end.** `public/css/antimicrobial-quiz.css` →
      `public/css/quiz.css`, `public/js/antimicrobial-quiz.js` →
      `public/js/quiz-engine.js`, driven by `window.QUIZ_CONFIG`. New page
      `public/renal-cardiac-quiz.html`. Registered noindex in `seo-static.test.js`.
- [x] Routes mounted: `/api/quiz` (unchanged) and `/api/patho-quiz`.
- [x] 36 new tests in `test/renal-cardiac-quiz.test.js`. **Full suite 258/258.**

## Verified in the browser (localhost:3200)
- New quiz: start → grade → rationale → Nemotron notes → 2 probes → AI evaluation
  → resume. Nemotron returned accurate *pathophysiology* coaching (SIADH vs
  osmotic diuresis), confirming the per-quiz `tutorDomain` works.
- Concept re-test fired live (missed r004 → served r005, same `raas-axis` key).
- Paywall at Q50, PayPal button mounts, results dashboard renders with patho
  bucket labels and "Weak body systems".
- **Antimicrobial quiz re-verified end to end on the shared assets** — start,
  grade, score update, rationale. No regression.
- Security, against the running server: paid question unentitled → 402; forged
  token → 402; **antimicrobial token replayed on patho → 402 and vice versa**;
  `/next` leaks no answer-key field; option ids opaque; wrong access code → 403;
  vault code → 200 and reaches paid questions. Live PayPal order created
  (`CREATED`), and both a fake order and the real *unpaid* order → 402, so no
  entitlement is issued without a completed capture.

## Bugs found and fixed during verification (all were real)
1. Topic cloud was hardcoded to antimicrobial topics in the shared JS → moved to
   `QUIZ_CONFIG.topics`, and switched from `innerHTML` to `textContent`.
2. Paywall bullet listed antimicrobial drug classes → rewritten for this quiz.
3. Paywall summary said "cover the classes" → now "cover the material".
4. Results advice said "Weak medication classes" on the patho quiz → now uses
   `categoryLabelPlural` from `/config`.
5. My own new test asserted the authored option order was spread. It is not —
   every item is authored answer-first. The *served* order is what matters and it
   is evenly spread by the per-attempt shuffle. Test rewritten to assert the
   served distribution, plus a companion test that fails if shuffling stops
   reordering. Documented in `renal-cardiac-bank.js`.

## LIVE AND VERIFIED
Deployed 2026-07-25 as `522dc2c` (merge of `756b1ac`).
- `https://sleekacademia.com/renal-cardiac-quiz` → 200, reads its own QUIZ_CONFIG
  (28 patho topic chips, "NURS 5315 student", 100/106/50/$10, "Body systems").
- `/api/patho-quiz/health` → `quizId=renal-cardiac`, 0 bank problems, tutor on,
  paypalLive true, payee `macsiemoney@gmail.com`.
- Live security: `/next` leaks no answer-key field, option ids opaque, paid
  question / tutor endpoint / forged token all 402, wrong access code 403.
- **Antimicrobial quiz re-verified live on the shared assets** — start, render,
  grade, rationale. `/api/quiz/health` healthy.
- Server tree: all new files present, antimicrobial files intact, and the two
  renamed assets correctly removed by `rsync --delete` (old paths now 404).
- Rest of the site unaffected: `/`, `/blog.html`, `/nclex-prep.html`,
  `/store.html`, `/about.html`, `/onboard.html`, `/assignment-help.html`,
  `/api/health` all 200.
- Restart was required and performed (killed lsnode pid 2000311; the old process
  was 1h31m old and the tell-tale was `/api/quiz/health` returning no `quizId`).

## Next
- [ ] Nothing blocking.
- [ ] Optional: the only untested link is a real human-approved $10 payment.
      Everything up to and including capture-rejection is verified.

## Gotcha this build uncovered
**Inline `<script>` blocks are CSP-hashed at server boot.**
`collectInlineScriptHashes(publicDir)` in `src/platform/security.js` scans
`public/**/*.html` at startup and adds a sha256 per inline script to
`script-src`. Editing an inline script and NOT restarting means the browser
silently blocks it — the page loads but `window.QUIZ_CONFIG` is undefined and the
engine falls back to its defaults. This is a second, independent reason the
LiteSpeed process must be killed after deploying HTML.

## Hard constraints this build must not break
- **`/api/quiz/*` paths must not change** and the entitlement scope string must
  stay exactly `antimicrobial-quiz:full` for that quiz. Unlocks have been SOLD;
  changing either invalidates a paying student's access.
- **Do not rotate `QUIZ_SIGNING_SECRET`** — it invalidates every unlock sold.
- Entitlements must be **scoped per quiz**: paying for one quiz must not unlock
  the other. Legacy tokens carry no quiz claim, so a missing claim means
  antimicrobial.

## Facts a fresh session needs
- Repo: `~/Websites/Active Projects/sleek-academia-render` → `Sleek-mx/sleekacademia`,
  branch `main` deploys. Confirm `git remote -v` before pushing.
- Deploy: push `main` → GitHub webhook → `POST /deploy.php` → git pull +
  `rsync -av --delete` → `/home/sleenegb/public_html/sleekacademianewsite`.
- **RESTART: `touch tmp/restart.txt` DOES NOT WORK.** The host runs LiteSpeed
  (`lsnode`), not Passenger. Kill the process and issue one request:
  ```
  PID=$(ps -eo pid,args | grep "[l]snode:/home/sleenegb/public_html/sleekacademianewsite" | awk '{print $1}' | head -1); kill "$PID"
  curl -s -o /dev/null https://sleekacademia.com/
  ```
  New routes 404ing while new static files are live is always this.
- **Bump `?v=` on the css/js links on every asset edit** (assets ship
  `max-age=14400`). Enforced by a test.
- Cloudflare 403s (error 1010) non-browser user agents — use a browser UA with
  `curl` when testing live, or a healthy endpoint reads as broken.
- Secrets live in vault `08 - Credentials & Keys/`. Never paste values into chat.
- Local dev needs `ALLOWED_ORIGINS` to include `http://localhost:3200` or the
  origin guard 403s every browser POST.
- Production `.env` already holds `NVIDIA_API_KEY`, `QUIZ_SIGNING_SECRET`,
  `QUIZ_ACCESS_CODE`, `QUIZ_PAYEE_EMAIL`, `PAYPAL_*` (live). The new quiz reuses
  all of them; no new env vars are required.
