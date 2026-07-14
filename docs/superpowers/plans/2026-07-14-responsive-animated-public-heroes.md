# Responsive Animated Public Heroes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fill the Home hero with appropriately scaled copy and motion, relax crowded About/Blog typography, animate every public woman visual, and deliver a separately composed mobile layout.

**Architecture:** Keep the existing static Express public site and reuse the single optimized MP4 plus WebP poster. Repeated public-page media uses one `data-ambient-video` contract controlled by `platform-motion.js`, while `brand-v2.css` owns Home geometry and `platform-v2.css` owns About/Blog geometry.

**Tech Stack:** Semantic HTML, vanilla CSS, vanilla JavaScript, Node test runner, existing Express server, in-app browser.

## Global Constraints

- Reuse `/video/sleek-academia-woman-hero.mp4`; do not add another video or dependency.
- Preserve `/images/brand/sleek-academia-woman-hero-poster.webp` as the loading and reduced-motion fallback.
- Preserve the exact Sleek Academia colors, neumorphic surfaces, copy, routes, SEO metadata, analytics, and favicon.
- Motion-enabled visitors see video anywhere the public woman appears; reduced-motion visitors see the poster.
- Mobile at `58rem` and below is a stacked, touch-friendly composition, not a scaled desktop grid.
- Do not deploy or push.

---

### Task 1: Lock the responsive motion and typography contracts

**Files:**
- Modify: `test/phase1-home.test.js`
- Modify: `test/phase2-public-pages.test.js`

**Interfaces:**
- Consumes: existing public HTML/CSS/JS files read by static contract tests.
- Produces: failing contracts for `data-ambient-video`, relaxed display tracking, content-led Home height, desktop crop, and mobile 4:3 composition.

- [x] **Step 1: Write the failing Home contract**

Add assertions that Home marks its video with `data-ambient-video`, that `.hero` explicitly uses `min-height: auto`, that the desktop frame is taller than 16:9, and that the mobile frame switches to `aspect-ratio: 4 / 3`.

```js
assert.match(home, /<video class="hero__video" data-ambient-video/);
assert.match(css, /\.hero\s*{[^}]*min-height:\s*auto/s);
assert.match(css, /\.hero__media\s*{[^}]*aspect-ratio:\s*8\s*\/\s*7/s);
assert.match(css, /@media \(max-width: 58rem\)[\s\S]*\.hero__media\s*{[^}]*aspect-ratio:\s*4\s*\/\s*3/s);
```

- [x] **Step 2: Write the failing About/Blog animation and typography contract**

Require two ambient videos on About, one on Blog, the shared MP4/poster attributes, relaxed display tracking/line height, and mobile-specific media geometry.

```js
assert.equal((about.match(/data-ambient-video/g) || []).length, 2);
assert.equal((blog.match(/data-ambient-video/g) || []).length, 1);
assert.match(css, /\.platform-display\s*{[^}]*line-height:\s*1\.02[^}]*letter-spacing:\s*-0\.045em/s);
assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.platform-art-card\s*{[^}]*aspect-ratio:\s*4\s*\/\s*3/s);
assert.match(script, /querySelectorAll\(\"\[data-ambient-video\]\"\)/);
```

- [x] **Step 3: Run the focused tests and verify RED**

Run: `node --test test/phase1-home.test.js test/phase2-public-pages.test.js`

Expected: FAIL because the current Home hero remains viewport-height based, About/Blog use static images, tracking remains `-0.075em`, and the motion controller selects only `.hero__video`.

---

### Task 2: Animate every public woman visual and handle reduced motion centrally

**Files:**
- Modify: `public/index.html`
- Modify: `public/about.html`
- Modify: `public/blog.html`
- Modify: `public/js/platform-motion.js`

**Interfaces:**
- Consumes: `/video/sleek-academia-woman-hero.mp4` and `/images/brand/sleek-academia-woman-hero-poster.webp`.
- Produces: repeated `[data-ambient-video]` elements and centralized reduced-motion handling.

- [x] **Step 1: Mark the Home video as ambient motion**

Use the existing Home video and add the shared data attribute:

```html
<video class="hero__video" data-ambient-video autoplay muted loop playsinline preload="metadata" poster="/images/brand/sleek-academia-woman-hero-poster.webp" aria-label="Animated Sleek Academia woman studying beside books and plants">
```

- [x] **Step 2: Replace About and Blog woman images with resilient animated media**

For each woman panel, retain a poster image beneath the video and place note cards after the media:

```html
<img class="platform-woman-poster" src="/images/brand/sleek-academia-woman-hero-poster.webp" width="1440" height="810" alt="Sleek Academia woman studying beside books and plants">
<video class="platform-woman-video" data-ambient-video autoplay muted loop playsinline preload="metadata" poster="/images/brand/sleek-academia-woman-hero-poster.webp" aria-label="Animated Sleek Academia woman studying beside books and plants">
  <source src="/video/sleek-academia-woman-hero.mp4" type="video/mp4">
</video>
```

Use the same pair inside a `.platform-story-media` wrapper for the secondary About visual.

- [x] **Step 3: Generalize the motion controller**

Replace the single Home video lookup with the shared collection and pause every ambient video under reduced motion:

```js
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const ambientVideos = Array.from(document.querySelectorAll("[data-ambient-video]"));
if (reduceMotion && ambientVideos.length) {
  ambientVideos.forEach(function (video) {
    video.removeAttribute("autoplay");
    video.pause();
    video.currentTime = 0;
  });
  document.documentElement.classList.add("is-reduced-motion");
}
```

- [x] **Step 4: Run focused tests**

Run: `node --test test/phase1-home.test.js test/phase2-public-pages.test.js`

Expected: animation-count and controller assertions pass; layout assertions remain RED until Task 3.

---

### Task 3: Recompose Home, About, and Blog for desktop and mobile

**Files:**
- Modify: `public/css/brand-v2.css`
- Modify: `public/css/platform-v2.css`

**Interfaces:**
- Consumes: `.hero`, `.hero__media`, `.platform-display`, `.platform-art-card`, `.platform-story-media`, `.platform-woman-poster`, and `.platform-woman-video` markup.
- Produces: content-led desktop heroes and explicit stacked mobile compositions.

- [x] **Step 1: Make Home content-led and crop the desktop animation**

Set `.hero` to `min-height: auto`, reduce vertical padding, use a balanced grid, enlarge the heading, and make `.hero__media` an `8 / 7` frame. Set poster/video to `object-fit: cover` and `object-position: right center`.

- [x] **Step 2: Build the Home mobile composition**

At `58rem` and below, use one column, explicit gap and padding, 4:3 media, full-width actions, mobile-specific headline rhythm, and natural document flow without viewport-height math.

- [x] **Step 3: Relax About and Blog typography**

Set `.platform-display` to `line-height: 1.02`, `letter-spacing: -0.045em`, and balanced wrapping. Increase `.platform-lede` line height to `1.82` and keep its readable maximum width.

- [x] **Step 4: Style animated secondary-page media**

Give `.platform-woman-poster` and `.platform-woman-video` identical absolute, right-focused cover geometry. Keep the video above the poster normally and hide it when `.is-reduced-motion` is present. Make `.platform-story-media` fill the About visual panel.

- [x] **Step 5: Build the About/Blog mobile composition**

At `900px` and below, stack the grid with copy first, reduce hero padding, set animation cards to 4:3, and keep notes inside. At `620px` and below, use mobile-specific display size/tracking, smaller notes, and safe inset positions that do not cover the face or writing hand.

- [x] **Step 6: Verify GREEN**

Run: `node --test test/phase1-home.test.js test/phase2-public-pages.test.js`

Expected: all focused tests PASS.

- [x] **Step 7: Commit the implementation checkpoint**

```bash
git add public/index.html public/about.html public/blog.html public/css/brand-v2.css public/css/platform-v2.css public/js/platform-motion.js test/phase1-home.test.js test/phase2-public-pages.test.js
git commit -m "fix: recompose animated public heroes"
```

---

### Task 4: Verify the real localhost experience and checkpoint completion

**Files:**
- Modify: `PROGRESS.md`
- Modify: `docs/local-review.md`
- Modify: `docs/superpowers/plans/2026-07-14-responsive-animated-public-heroes.md`

**Interfaces:**
- Consumes: the running Express site at `http://127.0.0.1:3000/`.
- Produces: browser evidence, final automated evidence, and a durable local handoff.

- [ ] **Step 1: Restart the local server and verify health**

Run: `curl --fail http://127.0.0.1:3000/api/health`

Expected: `{"ok":true,"service":"sleek-academia"}`.

- [ ] **Step 2: Verify desktop**

At approximately `1440x1000`, inspect Home, About, and Blog. Confirm content begins near the top of each hero, animations fill their frames and play, heading letters do not collide, notes remain readable, and horizontal overflow is zero.

- [ ] **Step 3: Verify mobile as a distinct composition**

At `390x844`, inspect Home, About, and Blog. Confirm stacked order, full-width Home actions, 4:3 motion panels, readable headings, in-frame notes, working navigation, and zero horizontal overflow.

- [ ] **Step 4: Verify reduced motion**

Emulate `prefers-reduced-motion: reduce` on all three pages. Confirm every ambient video is paused without an `autoplay` attribute and every poster fallback is visible.

- [ ] **Step 5: Run the complete gate**

```bash
npm test
npm run test:seo
npm run check:security
npm audit --omit=dev
git diff --check
```

Expected: all application and SEO tests pass, security release gate passes, dependency audit reports zero vulnerabilities, and the diff is clean.

- [ ] **Step 6: Record and commit verification**

Update the plan status, `PROGRESS.md`, and `docs/local-review.md` with exact test counts and browser evidence, then commit without pushing:

```bash
git add PROGRESS.md docs/local-review.md docs/superpowers/plans/2026-07-14-responsive-animated-public-heroes.md
git commit -m "docs: verify responsive animated public heroes"
```
