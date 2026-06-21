# Sleek Academia SEO Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a secure, test-enforced SEO foundation and daily monitoring workflow for Sleek Academia.

**Architecture:** Express continues serving static HTML from `public/`. Node tests read the rendered files and enforce crawl, metadata, schema, and sitemap contracts; GitHub Actions runs the suite on pushes and daily.

**Tech Stack:** Node.js 20, Express 4, static HTML, JSON-LD, Node test runner, GitHub Actions.

## Global Constraints

- Do not claim guaranteed results, pass rates, qualifications, or personal experience without evidence.
- Nursing, law, IT, accounting, and finance remain categories under one tutoring brand.
- No secret may have a committed fallback value.
- New behavior follows red-green-refactor test-driven development.

---

### Task 1: Secure deployment webhook

**Files:**
- Modify: `test/seo-crawler.test.js`
- Modify: `server.js`

**Interfaces:**
- Consumes: `GITHUB_WEBHOOK_SECRET` from the server environment.
- Produces: `POST /deploy.php` returning 503 when the secret is absent.

- [ ] Add a test that posts an unsigned payload while the test server has no webhook secret and expects status 503.
- [ ] Run `node --test test/seo-crawler.test.js` and confirm the test fails with status 401.
- [ ] Replace the committed fallback secret with a guard that returns 503 before signature validation.
- [ ] Run `node --test test/seo-crawler.test.js` and confirm all crawler tests pass.

### Task 2: Enforce indexation and metadata contracts

**Files:**
- Create: `test/seo-static.test.js`
- Modify: `package.json`
- Modify: `public/*.html`
- Modify: `public/blog/*.html`
- Modify: `public/lp/*.html`
- Modify: `public/sitemap.xml`

**Interfaces:**
- Consumes: HTML documents and `public/sitemap.xml`.
- Produces: one canonical per indexable page, `noindex,follow` on utility pages, and sitemap parity.

- [ ] Add failing tests that enumerate indexable and utility pages, validate canonicals, reject guaranteed-result language, and compare sitemap URLs with indexable pages.
- [ ] Run `node --test test/seo-static.test.js` and confirm failures identify missing canonicals, sitemap drift, and unsupported guarantee copy.
- [ ] Add canonical or robots metadata to every affected page and rebuild the sitemap.
- [ ] Add `test` and `test:seo` scripts to `package.json`.
- [ ] Run `npm test` and confirm the complete suite passes.

### Task 3: Improve positioning and structured data

**Files:**
- Modify: `test/seo-static.test.js`
- Modify: `public/index.html`
- Modify: `public/about.html`
- Modify: `public/courses.html`
- Modify: `public/blog/*.html`

**Interfaces:**
- Consumes: the approved umbrella tutoring positioning.
- Produces: accurate homepage copy, EducationalOrganization and OfferCatalog JSON-LD, and valid article publisher assets.

- [ ] Add failing tests for the five tutoring categories, homepage canonical, supported schema types, and schema URLs that map to existing public assets.
- [ ] Run the focused static test and confirm it fails for the current homepage schema and logo URL.
- [ ] Update homepage title, description, social metadata, H1, service copy, and JSON-LD without unsupported outcomes.
- [ ] Repair article publisher-logo URLs and add visible organizational authorship language.
- [ ] Run `npm test` and confirm all tests pass.

### Task 4: Add conversion measurement

**Files:**
- Create: `public/js/analytics.js`
- Create: `test/analytics.test.js`
- Modify: indexable marketing HTML pages.

**Interfaces:**
- Consumes: links with `data-cta-location`.
- Produces: GA4 `cta_clicked` events with `cta_location`, `cta_text`, and `destination`.

- [ ] Add a failing unit test for event payload generation and the absence of email, phone, or other PII.
- [ ] Run `node --test test/analytics.test.js` and confirm the missing module failure.
- [ ] Implement the minimal analytics helper and load it on marketing pages.
- [ ] Add stable CTA location attributes to primary conversion links.
- [ ] Run `npm test` and confirm all tests pass.

### Task 5: Add daily deterministic monitoring

**Files:**
- Create: `.github/workflows/seo-watchdog.yml`
- Create: `scripts/check-live-seo.mjs`
- Create: `test/live-check.test.js`

**Interfaces:**
- Consumes: `SITE_URL`, defaulting to `https://sleekacademia.com`.
- Produces: a non-zero exit when health, robots, sitemap, homepage canonical, or homepage title checks fail.

- [ ] Add failing tests for the live-check response validator using local response fixtures.
- [ ] Run the focused test and confirm the validator module is missing.
- [ ] Implement the validator and CLI with bounded request timeouts.
- [ ] Add a workflow that runs `npm ci`, `npm test`, and the live check daily and on pushes to `main`.
- [ ] Run the tests and a live check against production.

### Task 6: Verify and publish

**Files:**
- Review all files changed by Tasks 1-5.

**Interfaces:**
- Produces: a reviewable branch ready to push and merge.

- [ ] Run `npm test`.
- [ ] Run `node scripts/check-live-seo.mjs` against the current production baseline and distinguish expected pre-deploy differences from outages.
- [ ] Inspect `git diff --check` and `git status --short`.
- [ ] Commit the implementation, push `codex/seo-foundation`, and merge only after the webhook secret has been configured in Namecheap.
- [ ] Verify the resulting production HTML, sitemap, robots file, health endpoint, and deployed commit marker.

