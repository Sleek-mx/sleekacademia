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

### [ ] Phase 1 — Foundation + money pages (IN REVIEW — awaiting Max's go)
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

### [ ] Phase 2 — Trust pages
ABOUT (`about.html`), SIGN-UP/login (`sign-up.html`, `login.html`), STORE listing (`store.html`).
Reuse `neumorphism.css` only.

### [ ] Phase 3 — Long tail + polish
BLOG templates (`blog.html`, `public/blog/*`) + remaining public pages
(`onboard.html`, `dashboard.html`, prep pages, `payment-success.html`, `404.html`, `blogs.html`).
Then full-site sweep: every page at 375px, CTA contrast check, Lighthouse, dead-style cleanup.
