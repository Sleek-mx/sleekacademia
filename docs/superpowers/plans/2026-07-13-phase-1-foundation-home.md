# Phase 1 Foundation and Home Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing neumorphic homepage with the approved Vibrant Academic Studio homepage and establish reusable production brand assets and CSS without changing the Store or authenticated behavior.

**Architecture:** Keep the current Express/static HTML architecture. Add a focused shared CSS system and production-ready logo/mascot assets under `public/`, then rebuild `public/index.html` against that system. Protect the user-visible contract with static Node tests before changing markup.

**Tech Stack:** Express 4, static HTML5, CSS custom properties, browser JavaScript, Node `node:test`, image generation, PNG/WebP assets, Namecheap Passenger.

## Global Constraints

- Use the official logo from `/Users/ephantusmacharia/Downloads/sleek academia logo2.png`.
- The mascot must be a full-body green graduate frog with black cap, orange glasses, blue hoodie, orange details, laptop, and blue shoes; no emoji or head-only asset.
- Primary CTA gradient is blue `#078FEC` to teal `#12C8AE`.
- Remove public pricing/package content and links from the homepage.
- Preserve the Store link and its existing behavior.
- Preserve homepage canonical URL, structured data, GA4, Meta Pixel, TikTok Pixel, and relevant SEO copy.
- All service CTAs route to `/onboard.html` with a service intent; no public service CTA routes to payment.
- Do not push until the complete phase is rendered, tested, committed, and explicitly verified.

---

### Task 1: Add the Phase 1 homepage contract

**Files:**
- Create: `test/phase1-home.test.js`
- Test: `public/index.html`

**Interfaces:**
- Consumes: homepage HTML from `public/index.html`.
- Produces: regression assertions for the new navigation, assets, funnel links, pricing removal, SEO markers, and analytics preservation.

- [ ] **Step 1: Write the failing contract tests**

Create tests that load `public/index.html` and assert:

```js
assert.match(home, /\/images\/brand\/sleek-academia-logo\.webp/);
assert.match(home, /\/images\/brand\/sleek-frog-hero\.webp/);
assert.match(home, /href="\/about\.html"/);
assert.match(home, /href="\/blog\.html"/);
assert.match(home, /href="\/store\.html"/);
assert.match(home, /href="\/onboard\.html\?goal=essay"/);
assert.match(home, /href="\/onboard\.html\?goal=exam"/);
assert.match(home, /Authorship matters at Sleek Academia/);
assert.doesNotMatch(home, /href="\/?#pricing"/i);
assert.doesNotMatch(home, /Tutoring Packages|View Packages|Choose Your Learning Path/i);
assert.match(home, /G-CHXSBK3M81/);
assert.match(home, /2344858129372736/);
assert.match(home, /D84IJPBC77UDS4G4KMO0/);
```

Also assert that `public/css/brand-v2.css`, the favicon, and one H1 are referenced.

- [ ] **Step 2: Run the focused test**

Run: `node --test test/phase1-home.test.js`

Expected: FAIL because the new asset paths, CSS, assurance, and navigation contract are not present and the old pricing section still exists.

- [ ] **Step 3: Commit the failing test**

```bash
git add test/phase1-home.test.js
git commit -m "test: define vibrant homepage contract"
```

### Task 2: Install the official brand asset foundation

**Files:**
- Create: `public/images/brand/sleek-academia-logo.png`
- Create: `public/images/brand/sleek-academia-logo.webp`
- Create: `public/images/brand/sleek-academia-mark.png`
- Create: `public/images/brand/favicon-32.png`
- Create: `public/images/brand/apple-touch-icon.png`
- Create: `public/images/brand/sleek-frog-hero.png`
- Create: `public/images/brand/sleek-frog-hero.webp`
- Create: `public/css/brand-v2.css`

**Interfaces:**
- Consumes: official logo source and approved full-body mascot reference.
- Produces: stable public asset paths and CSS tokens used by every later phase.

- [ ] **Step 1: Copy and optimize the official logo**

Copy the canonical logo into `public/images/brand/`, create a transparent WebP, and derive square mark, favicon, and touch-icon variants without redrawing the logo. Verify every output with visual inspection and `sips -g pixelWidth -g pixelHeight`.

- [ ] **Step 2: Generate the production mascot**

Generate a transparent, high-resolution full-body 3D mascot using the approved reference. The prompt must explicitly preserve green frog anatomy, black cap, orange glasses, blue knit hoodie, orange drawstrings/details, silver laptop, orange trousers, blue shoes, seated pose, and friendly professional expression. Reject outputs with cropped limbs, text, extra objects, altered costume, or head-only framing.

- [ ] **Step 3: Create the CSS token and component layer**

Define `:root` tokens for the approved colors, typography, spacing, radii, shadows, container sizes, focus rings, and motion. Add focused classes for the floating navigation, hero, CTA buttons, service cards, process steps, assurance banner, proof sections, testimonial cards, final CTA, and footer. Include mobile breakpoints and `prefers-reduced-motion` handling.

- [ ] **Step 4: Verify assets and CSS**

Run:

```bash
sips -g pixelWidth -g pixelHeight public/images/brand/*.{png,webp}
rg -n "#078FEC|#12C8AE|prefers-reduced-motion|focus-visible" public/css/brand-v2.css
```

Expected: all asset files are readable; CSS contains the approved primary colors, reduced motion, and visible focus rules.

- [ ] **Step 5: Commit the foundation**

```bash
git add public/images/brand public/css/brand-v2.css
git commit -m "feat: add Sleek Academia brand foundation"
```

### Task 3: Rebuild the real homepage

**Files:**
- Modify: `public/index.html`
- Test: `test/phase1-home.test.js`

**Interfaces:**
- Consumes: `brand-v2.css`, official logo variants, and `sleek-frog-hero.webp`.
- Produces: the complete public homepage and service-funnel entry points used by Phase 3.

- [ ] **Step 1: Preserve the homepage head contract**

Keep the canonical URL, title, description, Organization/Service JSON-LD, GA4, Meta Pixel, and TikTok Pixel. Replace visual stylesheets with the new brand layer and reference the new favicon/touch icon.

- [ ] **Step 2: Replace the body with the approved page structure**

Build semantic header, main, and footer landmarks. Add the floating navigation, full-body mascot hero, service choice cards, three-step process, authorship banner, subject areas, credibility/proof, verified testimonials already present in the repository, and final signup CTA. Use one H1 and descriptive image alternatives.

- [ ] **Step 3: Remove public pricing and package routes**

Remove the `#pricing` section, Pricing navigation, View Packages buttons, tutoring plan cards, and package copy from the homepage. Route essay and exam service CTAs to their explicit onboarding intents and route the secondary commerce CTA only to `/store.html`.

- [ ] **Step 4: Keep safe progressive enhancement**

Add a minimal mobile-nav controller and reveal animation that leaves content visible when JavaScript is disabled. Preserve the chatbot and analytics scripts only if their selectors and behavior remain valid; otherwise update their selectors without changing their server interfaces.

- [ ] **Step 5: Run focused and full tests**

Run:

```bash
node --test test/phase1-home.test.js
npm test
git diff --check
```

Expected: focused homepage tests pass, the existing full suite passes, and `git diff --check` produces no output.

- [ ] **Step 6: Commit the homepage**

```bash
git add public/index.html public/js test/phase1-home.test.js
git commit -m "feat: rebuild vibrant Sleek Academia homepage"
```

### Task 4: Render and review the actual Phase 1 site

**Files:**
- Modify: `PROGRESS.md`
- Verify: `public/index.html`
- Verify: `public/css/brand-v2.css`
- Verify: `public/images/brand/*`

**Interfaces:**
- Consumes: the completed Phase 1 implementation.
- Produces: desktop/mobile screenshots and a checkpoint ready for user review.

- [ ] **Step 1: Start the real application locally**

Run: `npm start`

Expected: Express starts successfully and `/`, `/api/health`, `/about.html`, `/blog.html`, and `/store.html` respond without server errors.

- [ ] **Step 2: Capture desktop and mobile renders**

Capture the running homepage at 1440 by 1100 and 390 by 844. Inspect the full-body mascot, exact logo, hero balance, nav behavior, service CTAs, assurance banner, removed pricing, footer, focus states, and overflow.

- [ ] **Step 3: Repair visible defects and rerun tests**

For every visible defect, add or tighten a focused assertion when feasible, repair the source, rerun the focused test and `npm test`, and capture fresh screenshots.

- [ ] **Step 4: Update the checkpoint**

Record the completed files, exact test results, screenshot paths, and Phase 2 next action in `PROGRESS.md`.

- [ ] **Step 5: Commit the reviewed phase**

```bash
git add PROGRESS.md
git commit -m "docs: checkpoint homepage redesign"
```
