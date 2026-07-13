# Animated Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a responsive, accessible 16:9 hero animation with typewriter copy, mascot typing/thinking motion, swaying plants, and ambient color movement.

**Architecture:** Keep the current static Express frontend. HTML provides semantic motion hooks, CSS owns the continuous visual loop, and one small deferred JavaScript file progressively enhances the H1 typewriter effect while preserving the complete source text.

**Tech Stack:** Semantic HTML5, CSS keyframes and custom properties, browser DOM APIs, Node `node:test`.

## Global Constraints

- Use only browser-native, freely available web standards at runtime.
- Preserve one real H1 containing the complete approved headline.
- Preserve the official logo, full-body mascot, CTAs, analytics, SEO metadata, and signup-first flow.
- New motion must stop under `prefers-reduced-motion: reduce`.
- Animate transforms and opacity; do not introduce autoplay video or a large runtime dependency.

---

### Task 1: Define the animation contract

**Files:**
- Create: `test/hero-motion.test.js`
- Test: `public/index.html`, `public/css/brand-v2.css`, `public/js/hero-motion.js`

**Interfaces:**
- Consumes: Phase 1 homepage HTML and brand stylesheet.
- Produces: regression assertions for stage ratio, motion hooks, controller, and reduced-motion fallback.

- [ ] **Step 1: Write tests that require `data-typewriter`, `data-hero-motion`, `data-mascot-arm`, two plant elements, `/js/hero-motion.js`, `aspect-ratio: 16 / 9`, and reduced-motion overrides.**
- [ ] **Step 2: Run `node --test test/hero-motion.test.js`.**

Expected: FAIL because the new hooks and controller do not exist.

- [ ] **Step 3: Commit the failing contract.**

```bash
git add test/hero-motion.test.js docs/superpowers
git commit -m "test: define animated hero contract"
```

### Task 2: Implement the live hero animation

**Files:**
- Modify: `public/index.html`
- Modify: `public/css/brand-v2.css`
- Create: `public/js/hero-motion.js`
- Test: `test/hero-motion.test.js`

**Interfaces:**
- Consumes: semantic `data-typewriter` source text and `data-hero-motion` stage.
- Produces: `initializeHeroMotion(root = document)` which safely enhances any matching hero and returns without error when hooks are absent.

- [ ] **Step 1: Add the 16:9 stage, plant markup, gesture overlay, typing indicators, typewriter hook, and deferred controller reference to `public/index.html`.**
- [ ] **Step 2: Add transform-only mascot, arm, plant, orb, dot, checklist, book, and caret keyframes plus mobile and reduced-motion overrides to `brand-v2.css`.**
- [ ] **Step 3: Implement `initializeHeroMotion` to reveal characters progressively, preserve the accessible label, and show the full text immediately for reduced motion.**
- [ ] **Step 4: Run `node --test test/hero-motion.test.js` and confirm PASS.**
- [ ] **Step 5: Run `npm test && git diff --check` and confirm zero failures.**
- [ ] **Step 6: Commit the implementation.**

```bash
git add public/index.html public/css/brand-v2.css public/js/hero-motion.js test/hero-motion.test.js PROGRESS.md
git commit -m "feat: animate the Sleek Academia hero"
```

### Task 3: Render the actual page

**Files:**
- Modify: `PROGRESS.md`
- Verify: running homepage at desktop and mobile widths.

**Interfaces:**
- Consumes: completed live hero implementation.
- Produces: actual browser screenshots and a review checkpoint.

- [ ] **Step 1: Start the Express application and verify `/`, `/api/health`, and hero assets return HTTP 200.**
- [ ] **Step 2: Capture the running homepage at 1440 × 1100 and a mobile viewport.**
- [ ] **Step 3: Inspect headline completion, full-body mascot, plant placement, gesture overlay, overflow, and reduced-motion fallback.**
- [ ] **Step 4: Update `PROGRESS.md` with verified results and next action.**
