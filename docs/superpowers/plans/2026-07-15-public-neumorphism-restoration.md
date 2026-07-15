# Public Neumorphism Restoration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the approved Sleek Academia neumorphism to the four public marketing pages without changing their content, behavior, animation, responsive layout, SEO, or backend integration.

**Architecture:** Add a focused CSS override layer after `brand-v2.css` on Home, About, Blog, and Store. Keep `brand-v2.css` as the structural/layout system and map its existing components onto the canonical lavender soft-UI tokens, leaving workspace and dashboard styles isolated.

**Tech Stack:** Static HTML, vanilla CSS, Node.js built-in test runner, Express production server, GitHub-to-Namecheap cPanel deployment.

## Global Constraints

- Modify only the public visual layer and its regression test/documentation.
- Preserve every current HTML section, text string, media asset, video behavior, script, route, meta tag, schema block, analytics hook, and backend endpoint.
- Do not load the new public stylesheet on dashboards, order pages, login, signup, or onboarding.
- Use `#e7e4f1`, `#c3bdd8`, `#ffffff`, `#372f52`, `#6b6488`, `#702ae1`, and `#9d6bff` as the canonical theme values.
- Keep reduced-motion, focus-visible, mobile navigation, and no-horizontal-overflow behavior intact.
- Add no package or external dependency.

---

### Task 1: Lock the public-only theme boundary

**Files:**
- Create: `public/css/public-neumorphic.css`
- Modify: `public/index.html`
- Modify: `public/about.html`
- Modify: `public/blog.html`
- Modify: `public/store.html`
- Test: `test/public-neumorphism.test.js`

**Interfaces:**
- Consumes: Existing `brand-v2.css` component class names and canonical token values from `neumorphism.css`.
- Produces: A public-only stylesheet loaded after `brand-v2.css` on exactly four pages.

- [ ] **Step 1: Write the failing boundary contract**

Create a Node test that reads the four public pages, verifies `/css/public-neumorphic.css` occurs after `/css/brand-v2.css`, verifies dashboard/workspace pages do not load it, and checks the new CSS file for canonical theme tokens, a paired raised shadow, and a paired inset shadow.

- [ ] **Step 2: Run the focused contract and verify RED**

Run: `node --test test/public-neumorphism.test.js`

Expected: FAIL because `public/css/public-neumorphic.css` does not exist and the four pages do not reference it.

- [ ] **Step 3: Add the stylesheet boundary**

Create `public/css/public-neumorphic.css` with the canonical tokens and load it immediately after `brand-v2.css` in the four public HTML files. Do not add it to any workspace HTML file.

- [ ] **Step 4: Run the focused contract and verify GREEN**

Run: `node --test test/public-neumorphism.test.js`

Expected: all public-neumorphism tests pass.

### Task 2: Map existing public components to true soft UI

**Files:**
- Modify: `public/css/public-neumorphic.css`
- Test: `test/public-neumorphism.test.js`

**Interfaces:**
- Consumes: Existing structural classes in `brand-v2.css`.
- Produces: Neumorphic page, navigation, hero, cards, controls, buttons, media frames, footer, and mobile menu without HTML restructuring.

- [ ] **Step 1: Extend the failing contract for component coverage**

Assert that the stylesheet targets navigation, cards, controls, primary and secondary buttons, media surfaces, footer, and mobile/reduced-motion states.

- [ ] **Step 2: Run the focused contract and verify RED**

Run: `node --test test/public-neumorphism.test.js`

Expected: FAIL on missing component selectors.

- [ ] **Step 3: Implement minimal component mappings**

Use shared custom properties for raised, raised-hover, pressed, and branded CTA shadows. Override colors, backgrounds, borders, and shadows while retaining existing grid, sizing, spacing, video object-fit, animations, and responsive rules.

- [ ] **Step 4: Run focused and full automated gates**

Run:

```bash
node --test test/public-neumorphism.test.js
npm test
npm run test:seo
npm run check:security
npm audit --omit=dev
git diff --check
```

Expected: zero failures and zero vulnerabilities.

### Task 3: Visual and production verification

**Files:**
- Modify: `PROGRESS.md`
- Modify: `docs/local-review.md` only if the review procedure changed.

**Interfaces:**
- Consumes: Completed public theme layer and existing deployment pipeline.
- Produces: Verified local and live public pages with unchanged functionality.

- [ ] **Step 1: Run local desktop and mobile browser checks**

Inspect Home, About, Blog, and Store at desktop and mobile widths. Confirm the lavender same-surface system, raised and inset depth, readable buttons, working animated woman video, working Blog filters, working Store controls, working responsive navigation, no horizontal overflow, and clean console output.

- [ ] **Step 2: Update the continuous checkpoint**

Record the exact test counts, visual checks, files changed, and next deployment action in `PROGRESS.md`.

- [ ] **Step 3: Confirm deployment source and destination**

Run `git remote -v`, inspect `.cpanel.yml`, and confirm the source checkout is `/Users/ephantusmacharia/Websites/Active Projects/sleek-academia-render` and the destination remains `/home/sleenegb/public_html/sleekacademianewsite` before any push.

- [ ] **Step 4: Commit and push**

Stage only the approved public-theme files, tests, spec, plan, and checkpoint. Push `main` to `https://github.com/Sleek-mx/sleekacademia.git`.

- [ ] **Step 5: Verify production**

Match the live/local hash of `public/css/public-neumorphic.css`, run `npm run check:live-seo`, and visually inspect the four public pages at `https://sleekacademia.com` on desktop and mobile before reporting completion.
