# Sleek Academia Commerce and Onboarding Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a verified free/paid study-tools storefront, working Gumroad quiz delivery, and redesigned service onboarding.

**Architecture:** Generate study-tool commerce markup from existing quiz and product sources of truth, preserve current server-side entitlement flow, and isolate presentation changes in focused static assets. Configure Gumroad only after code and product-content contracts pass, then deploy through the existing GitHub-to-Vercel pipeline.

**Tech Stack:** Node.js 22, Express, static HTML/CSS/JavaScript, Node test runner, Gumroad, Clerk, Vercel.

**Spec:** `docs/superpowers/specs/2026-08-16-commerce-onboarding-completion-design.md`

## Global Constraints

- Work only in `/Users/ephantusmacharia/Websites/Active Projects/sleek-academia-render` on `feature/finish-redesign-commerce`.
- Preserve existing uncommitted redesign work.
- Keep `src/data/store-products.js` and `src/quiz/quizzes.js` as commerce sources of truth.
- Never commit or display Gumroad credentials or webhook secrets.
- Do not deploy via cPanel; push to GitHub and verify `https://sleekacademia.com` after Vercel builds.
- Preserve onboarding form ids, field names, request payload, Clerk handoff, and API routes.

---

### Task 1: Generated study-tools storefront

**Files:**
- Create: `scripts/build-resources-page.mjs`
- Create: `public/js/study-tools.js`
- Modify: `public/resources.html`
- Modify: `public/css/glass-college.css`
- Modify: `package.json`
- Test: `test/study-tools-storefront.test.js`

**Interfaces:**
- Consumes: `STORE_PRODUCTS`, `productUrl`, and `formatPrice` from `src/data/store-products.js`; `QUIZZES` from `src/quiz/quizzes.js`.
- Produces: deterministic markup between `study-tools:free` and `study-tools:paid` build markers; filter controls keyed by `data-category`.

- [ ] Write tests asserting three free quiz previews, every paid product, direct Gumroad permalinks, visible prices, build markers, and zero resource links to `/onboard.html?goal=resource`.
- [ ] Run `node --test test/study-tools-storefront.test.js` and verify expected failures.
- [ ] Implement deterministic generator and add `build:resources` script.
- [ ] Replace fake resource cards with generated free/paid study paths and progressive-enhancement filters.
- [ ] Add responsive storefront styles with clear free/paid states, focus rings, and reduced motion.
- [ ] Run generator, focused test, `npm run check:store-schema`, and commit checkpoint.

### Task 2: Quiz paywall clarity and delivery contracts

**Files:**
- Modify: `public/js/quiz-engine.js`
- Modify: quiz HTML only if required by contract
- Test: `test/quiz-gumroad-checkout-ui.test.js`
- Test: `test/gumroad-webhook.test.js`

**Interfaces:**
- Consumes: `config.quizId`, `config.freeEnd`, `config.totalQuestions`, and `config.unlockPriceUsd`.
- Produces: checkout URL `https://sleekmx.gumroad.com/l/QuizUnlock?price=<price>&quiz_id=<id>` and clear paywall copy.

- [ ] Add failing assertions for value-first paywall copy, remaining-question count, email-delivery expectation, and free-results escape hatch.
- [ ] Run focused tests and verify expected failures.
- [ ] Implement minimal paywall-copy/rendering changes without altering entitlement rules.
- [ ] Run focused quiz UI and webhook tests and commit checkpoint.

### Task 3: Service-only onboarding redesign

**Files:**
- Create: `public/css/onboarding-glass.css`
- Modify: `public/onboard.html`
- Modify: `public/js/onboard.js` only for semantic progress labels or harmless visual state hooks
- Test: `test/onboarding-redesign.test.js`
- Test: existing onboarding/order-entry/request-workspace UI suites

**Interfaces:**
- Consumes: existing form ids, `data-wizard-step`, service values, Clerk mount point, and order handoff API.
- Produces: glass-college visual shell and accessible four-step progress labels while preserving current payload.

- [ ] Add failing visual-contract tests for new stylesheet, glass shell, named progress stages, service-only language, study-tools escape link, and preserved hooks.
- [ ] Run focused test and verify expected failures.
- [ ] Restructure presentational HTML and add scoped responsive CSS.
- [ ] Preserve all ids/names and add progress semantics without changing request behavior.
- [ ] Run focused and existing onboarding suites; commit checkpoint.

### Task 4: Gumroad product and webhook readiness

**Files:**
- Create: `public/images/college/quiz-unlock-cover.webp`
- Update: Gumroad `QuizUnlock` product content, receipt, cover, and profile settings through signed-in browser.
- Update: Gumroad Advanced Ping endpoint through signed-in browser.
- Audit: nine paid download product Content tabs and profile visibility.

**Interfaces:**
- Consumes: production `GUMROAD_WEBHOOK_SECRET`, live webhook route, existing product permalink `QuizUnlock`.
- Produces: configured Gumroad Ping and buyer-facing delivery instructions.

- [ ] Create and visually inspect branded quiz cover using canonical Sleek Academia assets.
- [ ] Determine production webhook endpoint and confirm secret exists without printing it.
- [ ] Update Quiz Unlock description, content guidance, receipt copy, and cover; save once.
- [ ] Audit nine PDF products and repair missing required metadata/files only when source deliverables are available and identity is unambiguous.
- [ ] Set Ping endpoint, send Gumroad test Ping, and verify accepted response without exposing secret.
- [ ] Record non-secret audit results in `PROGRESS.md`.

### Task 5: Full verification and production release

**Files:**
- Modify: `PROGRESS.md`
- Modify: documentation only if verification discovers drift.

**Interfaces:**
- Consumes: completed code/config/product changes.
- Produces: verified Git commit, pushed branch/production deployment, and live evidence.

- [ ] Run `npm test`, `npm run check:store-schema`, `npm run check:security`, and local smoke server.
- [ ] Click every changed path at desktop and mobile widths: filters, free quiz starts, paywall checkout links, onboarding navigation/validation, login and store links.
- [ ] Review `git diff`, confirm no secret or unrelated destructive change, and create final commit.
- [ ] Verify `git remote -v`, push feature branch, integrate to production branch using safe non-destructive git operations, and wait for Vercel.
- [ ] Verify `https://sleekacademia.com/resources.html`, `/onboard.html`, all three quiz pages, checkout destinations, and changed API route behavior.
- [ ] Update `PROGRESS.md`, mark goal complete, and report evidence plus any external limitation that could not be safely resolved.
