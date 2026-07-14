# Animated Woman Hero and Unified Public Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace every public frog visual with the supplied woman artwork, add the animated homepage hero and woman-head favicon coverage, unify Home/About/Blog/Store under the approved light-neumorphic shell, and correct the invisible Store hero button labels.

**Architecture:** Keep the existing static HTML, shared CSS, and progressive JavaScript structure. Home remains the canonical visual system. About, Blog, and Store adopt the same `site-header`/`site-nav` markup and Home tokens while retaining their page content, analytics, schema, filtering, and Gumroad integration. The supplied MP4 becomes a silent optimized local asset with a static WebP poster; reduced-motion behavior is enforced by the shared public motion script.

**Tech Stack:** Static HTML, CSS, browser JavaScript, Node.js built-in test runner, FFmpeg media optimization, Express localhost runtime, in-app browser verification.

## Global Constraints

- Preserve all canonical metadata, analytics identifiers, schema, social links, article URLs, Gumroad URLs, request routes, and dashboard entry points.
- Do not deploy or push. Finish at a browser-verified localhost URL.
- Use the exact Sleek Academia logo palette; keep text contrast accessible even though surfaces use low-contrast neumorphic shadows.
- Raised surfaces use paired top-left light and bottom-right dark shadows; active controls and form wells use inset shadows.
- The woman video remains an illustration in the right hero column and never sits behind readable text.
- Do not stage `.codebase-memory/`.

---

## Task 1: Lock the public-theme and media contracts in tests

**Files:**

- Modify: `test/phase1-home.test.js`
- Modify: `test/phase2-public-pages.test.js`

- [ ] Replace the legacy frog assertion with assertions for `/video/sleek-academia-woman-hero.mp4`, `/images/brand/sleek-academia-woman-hero-poster.webp`, and the `autoplay muted loop playsinline` video contract.
- [ ] Add a four-page contract that rejects `sleek-frog-hero` and frog alt text on Home, About, Blog, and Store.
- [ ] Add assertions that all four primary pages contain the shared `site-header site-shell`, `site-nav`, `brand-lockup`, `nav-links`, page-specific `aria-current="page"`, woman-head favicon, and Apple touch icon.
- [ ] Add Store assertions for visible labels plus a page-specific primary/secondary hero-button class contract that cannot inherit white text on white.
- [ ] Add a reduced-motion script assertion that pauses the hero video and exposes the poster state.
- [ ] Run `node --test test/phase1-home.test.js test/phase2-public-pages.test.js` and confirm the new assertions fail for the expected missing media/shared-header behavior.

## Task 2: Optimize and install the supplied woman media

**Files:**

- Create: `public/video/sleek-academia-woman-hero.mp4`
- Create: `public/images/brand/sleek-academia-woman-hero-poster.webp`

- [ ] Use FFmpeg to remove audio, preserve H.264/yuv420p compatibility, scale to a browser-appropriate maximum width, enable `faststart`, and keep the source aspect ratio.
- [ ] Export a representative still frame as a high-quality WebP poster using the same composition.
- [ ] Verify both assets with `ffprobe`, confirm the web MP4 has no audio stream, and confirm the poster dimensions and file type.
- [ ] Keep the original download untouched.

## Task 3: Replace the Home frog composition with the accessible video hero

**Files:**

- Modify: `public/index.html`
- Modify: `public/css/brand-v2.css`
- Modify: `public/js/platform-motion.js`

- [ ] Replace the frog preload with the poster preload.
- [ ] Replace the orbs, sparks, checklist, books, and frog image with a `<video>` using `autoplay`, `muted`, `loop`, `playsinline`, `preload="metadata"`, and the woman poster.
- [ ] Add a static poster image fallback for reduced motion and video failure without duplicating spoken or essential content.
- [ ] Replace frog-specific hero rules with a contained, responsive, soft-surface media frame that uses `object-fit: contain` and has no horizontal overflow.
- [ ] Extend the shared motion script so reduced-motion mode pauses/removes autoplay and displays the stable poster; keep the existing reveal behavior and Home responsive menu behavior.
- [ ] Run the focused tests and confirm the Home/media assertions pass.

## Task 4: Unify the four public-page navigation shells

**Files:**

- Modify: `public/about.html`
- Modify: `public/blog.html`
- Modify: `public/store.html`
- Modify: `public/js/platform-motion.js`

- [ ] Replace each `platform-header` block with the exact Home `site-header site-shell` and `site-nav` structure.
- [ ] Preserve the correct page-specific active navigation state and keep Log in/Get Started routes unchanged.
- [ ] Make the shared motion script control `.menu-button`/`#primary-links` on all four pages, including body scroll locking and accessible labels.
- [ ] Add favicon and touch-icon links to About, Blog, and Store.
- [ ] Run the focused tests and confirm all shared-navigation/favicon assertions pass.

## Task 5: Replace remaining public frogs and align page surfaces

**Files:**

- Modify: `public/about.html`
- Modify: `public/blog.html`
- Modify: `public/css/platform-v2.css`

- [ ] Replace About and Blog frog images with the woman poster/crop and accurate non-frog alt text.
- [ ] Retheme `platform-v2.css` around the Home surface, typography, radius, exact logo accents, and paired light/dark shadows while retaining all current layout hooks.
- [ ] Give cards, filters, search, CTAs, Blog tiles, and footer transitions the same same-surface raised/pressed interaction language.
- [ ] Retain strong readable body text and visible focus states.
- [ ] Keep the existing Blog summaries, topic-specific card images, search, filters, and article URLs unchanged.
- [ ] Run focused tests and `git diff --check`.

## Task 6: Correct Store hero button contrast at the shared CSS source

**Files:**

- Modify: `public/store.html`
- Modify: `public/css/platform-v2.css`

- [ ] Give the Store hero primary button the blue-to-teal treatment with white text.
- [ ] Give the Store hero secondary button a raised light surface with dark text.
- [ ] Replace the broad `.platform-page a { color: inherit; }` behavior with a selector that cannot override button labels, or explicitly out-specific it without `!important`.
- [ ] Keep `Browse materials`, `Visit Gumroad store`, product links, live `/api/gumroad/products` synchronization, and external-link safety attributes unchanged.
- [ ] Run the focused tests and confirm the Store contrast regression contract passes.

## Task 7: Add woman-head favicon coverage across the application surfaces

**Files:**

- Modify: primary/protected HTML files under `public/` that lack icon links
- Modify: `test/phase2-public-pages.test.js` or add a focused favicon test

- [ ] Add `/images/brand/favicon-32.png` and `/images/brand/apple-touch-icon.png` to the main public, auth, client, admin, order, and payment-result documents without altering their page logic.
- [ ] Assert the favicon PNG is the standalone woman-head mark and not the wide wordmark.
- [ ] Run the favicon contract test.

## Task 8: Automated release checks

**Files:**

- Modify: `PROGRESS.md`
- Modify: `docs/local-review.md`

- [ ] Run `npm test`.
- [ ] Run `npm run test:seo`.
- [ ] Run `npm run check:security`.
- [ ] Run `npm audit --omit=dev` and require zero production vulnerabilities.
- [ ] Run syntax checks for modified JavaScript and `git diff --check`.
- [ ] Search Home/About/Blog/Store for remaining frog references, invisible-button overrides, inline secrets, or retired pricing/payment routes.

## Task 9: Real localhost browser verification

**Files:**

- Modify: `docs/local-review.md`
- Modify: `PROGRESS.md`

- [ ] Start or restart the actual Express app with loopback demo mode and verify `/api/health` directly.
- [ ] Open Home, About, Blog, and Store in the in-app browser at desktop and mobile widths.
- [ ] Confirm the Home video visibly plays, is muted, loops, uses the woman poster before playback, and does not shift or overflow the layout.
- [ ] Confirm About and Blog show the woman artwork and no public frog remains.
- [ ] Confirm all four pages share the same floating raised navigation, type system, buttons, background, active state, and responsive menu.
- [ ] Confirm both Store hero button labels are visibly readable and clickable at desktop and mobile widths.
- [ ] Confirm the woman-head favicon is linked and returned successfully; inspect the tab/page asset where browser tooling permits.
- [ ] Confirm navigation, Blog search/filter, Store product links, login, and Get Started routes still work.
- [ ] Confirm browser console logs are clean on all four pages.
- [ ] Record the verified localhost URL and results in `docs/local-review.md` and mark the extension complete in `PROGRESS.md`.

## Task 10: Final self-review and handoff

- [ ] Inspect the complete diff for accidental content, route, SEO, analytics, security, or commerce regressions.
- [ ] Re-run the focused tests after any review fix.
- [ ] Leave the verified localhost service running and the Home page open for Max.
- [ ] Report the actual localhost URL, checks run, and any launch-only prerequisites. Do not claim production deployment.
