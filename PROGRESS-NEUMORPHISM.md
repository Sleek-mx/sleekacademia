# Sleek Academia — Neumorphism Redesign Progress

Approved 2026-07-04. Reskin of sleekacademia.com to the neumorphism (soft UI) theme.
Source of truth for all tokens: `~/Downloads/sleek-academia-neumorphism-mockup.html`.
Style rules: the `neumorphism` skill (`~/.claude/skills/neumorphism/`).

## Design tokens (locked)
- Surface (element bg = page bg, never white cards): `#e7e4f1`
- Dual shadows: dark `#c3bdd8` (bottom-right) / light `#ffffff` (top-left)
- Text `#372f52`, muted `#6b6488`
- ONE purple accent: `#702ae1 → #9d6bff` (loud gradient on CTAs only)
- Fonts: Plus Jakarta Sans (headings) + Inter (body)
- Interaction language: raised = resting, inset/pressed = active/selected/input
- Shared stylesheet: `public/css/neumorphism.css` (variables + `.neu` / `.well` / `.btn` / nav / pricing / etc.) — reuse only, no per-page one-offs

## Hard rules (every phase)
- RESKIN only: keep all copy, functionality, SEO meta/schema, canonicals, and
  analytics pixels (GA4 `G-CHXSBK3M81`, Meta `2344858129372736`, TikTok `D84IJPBC77UDS4G4KMO0`) byte-for-byte.
- Keep CTAs loud (purple gradient `.btn.primary`).
- Branch per phase: `feature/neumorphism-phase-N`. NEVER push main without Max's explicit go
  (webhook + `.cpanel.yml` both `rsync --delete` → pushing main auto-deploys live).
- End-of-phase gate: local screenshots → WAIT for go → verify `git remote -v` → merge main → push
  → verify LIVE https://sleekacademia.com per deploy-verify skill → then check the box.

## Host / deploy (see memory: project_sleek_academia_deploy)
- cPanel Passenger Node app. Repo: this `sleek-academia-stitch` (NOT sleek-academia-render).
- Remote: `origin https://Sleek-mx@github.com/Sleek-mx/sleekacademia.git`
- Live dir: `/home/sleenegb/public_html/sleekacademianewsite/`. Deploy = push main → `/deploy.php` webhook.
- TRAP: keep main complete; `--delete` wipes anything missing from origin/main → 503.
- Local preview: `node dev-server.js` on :3000 (static, no Clerk/Stripe env needed). Launch config name `sleek-academia`.

---

## PHASES

> 2026-07-05: Max said "do everything and commit, do all phases now" + "make sure it's
> pushed to the site". Treated as explicit go for ALL phases + deploy. Phases 1–3 built
> and verified locally on `feature/neumorphism-phase-1`.
>
> **2026-07-07 cold run — timeline correction:** this file briefly claimed (as of the
> 2026-07-05 session) the work was already "merged to main and pushed live." That was
> false at the time — at the start of this run, `main`/`origin/main` were still at
> `173dc9a` (pre-neumorphism) and the live site had no `neumorphism.css`. Partway through
> this run's re-verification, **a concurrent session** (same repo, same working directory,
> commit author "Sly Macsie" / Claude Opus 4.8) fast-forward merged
> `feature/neumorphism-phase-1` into `main` (commit `eca5c02`), pushed it, and pushed two
> follow-up contrast fixes (`816b6ac`, `b3c9485`: white border + forced white text on
> primary CTA buttons for readability). That triggered the real `/deploy.php` webhook.
>
> **Verified live after the fact (this run):** `curl` against every touched page
> (`/`, about, store, sign-up, login, blog, nclex-prep, 404) returns HTTP 200 with
> `neumorphism.css` linked; all three analytics pixel IDs (`G-CHXSBK3M81`,
> `2344858129372736`, `D84IJPBC77UDS4G4KMO0`) present on the live homepage; screenshot
> of the live site confirms the neumorphism build is rendering correctly. So — this
> genuinely is done, deployed, and live now. Checking the boxes below for real this time.
>
> **Flag for Max:** two Claude Code sessions operated on this exact working directory at
> the same time. That's how the merge/push happened without this scheduled run doing it
> (this run never merged or pushed anything to main). It worked out fine here since both
> sessions were pushing the same intended change, but it's worth avoiding running an
> interactive session and this scheduled task against the same repo path simultaneously —
> a real conflict next time could be messier (lost work, confusing partial commits).

### [x] Phase 1 — Foundation + money pages
Foundation + homepage (which contains the pricing section).
- **Key finding:** there is NO standalone pricing page. Nav/footer "Pricing" → `/#pricing`,
  a section folded into `index.html`. So Phase 1 = fully reskin `index.html` (hero + "what
  would you like to achieve" search + trust bar + testimonials ×6 + tutor testimonials ×3 +
  pricing ×3 + final CTA + footer). Both money surfaces live on the homepage.

Files touched:
- `public/css/neumorphism.css` — NEW shared design system (all tokens + components).
- `public/index.html` — body fully reskinned to neu system. Head (SEO/schema/canonical/3
  analytics pixels) preserved byte-for-byte; only added the neumorphism.css `<link>`, set
  inline `html` bg to `#e7e4f1`, and aligned `.text-gradient` stop to `#9d6bff`.
- `.claude/launch.json` — NEW preview config (`sleek-academia`, node dev-server.js :3000).
- `PROGRESS-NEUMORPHISM.md` — this file.

Decisions / gotchas:
- Preserved `.hero-input` class on the search box — inline `onclick` handlers target it.
- Preserved all script tags (`site-transitions.js`, `chatbot.js`, `animations.js`) + `chatbot.css`.
- Kept `tailwind.min.css` linked (harmless; body no longer relies on Tailwind utilities). Later
  phases will decide whether to drop it once all pages are off Tailwind.
- Star ratings rendered as ★ text (matches mockup `.stars`, not emoji) instead of Material star glyphs.
- Added a small inline hamburger-toggle script for mobile nav (progressive enhancement).
- Did NOT use the mockup's `.rv` scroll-reveal (needs a JS IntersectionObserver the site's
  animations.js may not provide) — content is visible by default to avoid blank sections.

### [x] Phase 2 — Trust pages  &  ### [x] Phase 3 — Long tail + polish
Done together in one session (Max approved doing everything at once).

**Approach — CSS bridge (no markup rewrites):** rather than hand-rewrite 13 Tailwind pages
(risky for copy/SEO/analytics), added `public/css/neu-tailwind.css` — a bridge stylesheet that
remaps the existing Tailwind utility classes onto the neu system. Each page only gets 2 (or 3)
`<link>` tags injected into `<head>` after `tailwind.min.css`; **zero changes to body markup,
copy, meta, schema, canonicals, or analytics.** This is strictly safer for the byte-for-byte rule
than the Phase-1 full rewrite of index.html.

What the bridge does: page + all off-white/white cards → the ONE surface `#e7e4f1` with neu dual
shadows; `.shadow-*` → neu shadows; `bg-primary`/`bg-violet-5/6/700`/`from-primary` → loud purple
gradient (CTAs stay loud); inputs/textareas/selects → inset wells; nav → translucent surface pill;
dark panels (`bg-slate-950/900/800` auth brand rails, 404, dark bands) → light neu with fixed text;
per-page **inline** rose/teal hero gradients → the single purple accent; custom tokens
(`text-ink`, `text-muted`, `font-headline`, `on-surface*`) mapped.

Files touched:
- `public/css/neu-tailwind.css` — NEW bridge (only affects pages that link it).
- Injected the neu `<link>`s into: `about.html`, `store.html`, `sign-up.html`, `login.html`,
  `blog.html`, `onboard.html`, `dashboard.html`, `payment-success.html`, `404.html`,
  `nclex-prep.html`, `cfa-level-1-prep.html`, `comptia-security-plus-prep.html`,
  `ube-bar-exam-prep.html`. (`404.html` also got the Google Fonts link it was missing.)
- `blogs.html` left untouched — it's a `noindex` meta-refresh stub to `/blog.html`.

Verified locally (desktop 1280 + mobile 375, no CSS console errors): about, store, login, sign-up,
blog, nclex-prep (representative of all 4 prep pages — shared template), onboard, dashboard,
payment-success, 404.

Gotchas / notes:
- **login.html & dashboard.html show a red "Unexpected token '<' … not valid JSON" banner in the
  STATIC preview** — their JS (`auth.js` Clerk / dashboard API) fetches backend routes the
  `dev-server.js` static server doesn't implement, so it gets `index.html` back. This is
  environmental, NOT a reskin regression; on the live Passenger `server.js` (Clerk + `/api/*`) they
  load normally. Confirm on the live site after deploy.
- CSS `!important` in the bridge is what lets an external stylesheet beat inline hero gradients
  (inline styles without `!important` lose to stylesheet `!important`).
- Blog card thumbnails were gradient placeholders → now purple; green success check on
  payment-success kept (semantic success color, not the accent).
- Still TODO if desired later: drop the now-unused Tailwind utility reliance / Lighthouse pass /
  dead-style cleanup. Site is consistent and shipping; these are polish, not blockers.

### Re-verification — 2026-07-07 cold run
Re-spot-checked the branch build (no code changes, verification only). Ran
`node dev-server.js` on a scratch port (3457, since another session already held :3000)
and drove it via the Chrome MCP — screenshots at 1280 and mobile 390×844 for: homepage
(incl. pricing scroll), about, store, sign-up, login, blog, nclex-prep, 404.
- Confirmed byte-for-byte preservation: diffed each touched page's `<head>` (minus the
  new CSS `<link>`s) against `main` — zero differences. Analytics pixel IDs and canonical/
  schema tags all intact.
- **Non-issue found and resolved by explanation:** about.html, store.html, and sign-up.html
  initially screenshotted almost blank / very low-opacity. Root cause is the pre-existing
  (non-neumorphism) `animations.js` scroll-reveal system: it auto-tags any `rounded-2xl`/
  `rounded-3xl`/`rounded-[...]` element with `data-anim` + `opacity:0`, then reveals via
  IntersectionObserver or a 2.6s failsafe `setTimeout`. My first screenshot just fired
  before that reveal. Re-screenshotting after a 3s wait shows all three pages fully and
  correctly styled. Not a regression — just a timing artifact of taking a screenshot
  too early.
- Mobile (390px): hamburger nav opens/closes correctly, no horizontal overflow, sign-up's
  two-column layout correctly collapses to one column.
- `dev-server.js` had `const port = 3000` hardcoded with no env override, which is why it
  collided with another session's server — changed to `process.env.PORT || 3000` (still
  uncommitted locally as of writing; harmless, dev-tooling only, not used by production
  `server.js`).
- This run itself never merged or pushed main — a concurrent session (see timeline note
  above) did that mid-run. After discovering it, re-verified the actual live site
  (`curl` + browser screenshot against `https://sleekacademia.com/`) rather than assuming:
  all 8 touched-page routes return 200 with `neumorphism.css` linked, all 3 analytics
  pixels present, live homepage screenshot matches the local build. Live deploy confirmed
  real, not just claimed.
