# Sleek Academia Site Repair Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Repair the duplicate blog URL, restore executable SEO verification, make anonymous-auth testing deterministic, and prove the repair on the production site.

**Architecture:** Keep Express as the single routing authority and add the legacy redirect before static-file middleware. Add two independent verification layers: deterministic Node tests over repository files and routes, plus a secret-free live checker that exercises the public deployment.

**Tech Stack:** Node.js 20+, Express 4, built-in `node:test`, built-in `fetch`, static HTML/XML, GitHub push webhook, Namecheap cPanel/Passenger.

## Global Constraints

- Preserve the current visual design, marketing copy, analytics identifiers, checkout flow, and authenticated product behavior.
- Do not add credentials to source control, logs, fixtures, or documentation.
- Keep GA4 `G-CHXSBK3M81`, Meta Pixel `2344858129372736`, and TikTok Pixel `D84IJPBC77UDS4G4KMO0` unchanged.
- Push only from `Sleek-mx/sleekacademia` on `main` after reconfirming the remote and `.cpanel.yml` deployment destination.
- Do not report the repair live until the production checker and direct redirect check pass on `https://sleekacademia.com`.

---

### Task 1: Repair legacy routing and anonymous authentication contract

**Files:**
- Modify: `test/slimming.test.js`
- Modify: `server.js`

**Interfaces:**
- Consumes: Express application routes and `requireSession(req, res, next)`.
- Produces: `GET /blogs.html -> 301 /blog.html` and unauthenticated API responses with HTTP 401 even when Clerk environment variables are absent.

- [ ] **Step 1: Add the failing redirect test**

Add `"/blogs.html": "/blog.html"` to the `REDIRECTS` object in `test/slimming.test.js`.

- [ ] **Step 2: Make the spawned test environment deterministic**

Change the spawn environment to explicitly remove Clerk configuration before starting the test server:

```js
const env = { ...process.env, PORT: String(PORT) };
delete env.CLERK_PUBLISHABLE_KEY;
delete env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
delete env.CLERK_SECRET_KEY;

server = spawn(process.execPath, ["server.js"], {
  env,
  stdio: "ignore",
});
```

- [ ] **Step 3: Run focused tests and verify both current defects**

Run: `node --test test/slimming.test.js`

Expected: FAIL because `/blogs.html` returns 200 instead of 301 and the anonymous service-request returns 503 instead of 401.

- [ ] **Step 4: Add the Express redirect**

Add the following entry to `legacySeoRedirects` in `server.js`, before static middleware:

```js
["/blogs.html", "/blog.html"],
```

- [ ] **Step 5: Make the public authentication guard fail closed as unauthorized**

Replace `requireSession` with:

```js
function requireSession(req, res, next) {
  if (!clerkIsConfigured) {
    return res.status(401).json({ error: "Authentication is required." });
  }
  const auth = getAuth(req);
  if (!auth.isAuthenticated || !auth.userId) {
    return res.status(401).json({ error: "Authentication is required." });
  }
  return next();
}
```

- [ ] **Step 6: Run focused tests and verify the repair**

Run: `node --test test/slimming.test.js`

Expected: 18 tests pass, zero fail.

- [ ] **Step 7: Commit the routing repair**

```bash
git add server.js test/slimming.test.js
git commit -m "fix: repair legacy blog redirect and auth rejection"
```

### Task 2: Add the static SEO contract

**Files:**
- Create: `test/seo-static.test.js`
- Verify: `package.json`

**Interfaces:**
- Consumes: files under `public/`, `public/sitemap.xml`, and `public/robots.txt`.
- Produces: an executable `npm run test:seo` suite with named assertions and nonzero failure status.

- [ ] **Step 1: Create shared page inventory helpers**

In `test/seo-static.test.js`, use `fs`, `path`, `fileURLToPath`, `node:test`, and `node:assert/strict`. Recursively enumerate `public/**/*.html`; extract title, description, canonical, robots, H1 count, and JSON-LD count with focused regular expressions. Define these explicit sets:

```js
const redirectOnly = new Set(["blogs.html"]);
const utilityPages = new Set([
  "404.html",
  "dashboard.html",
  "login.html",
  "onboard.html",
  "payment-success.html",
  "sign-up.html",
]);
const indexablePages = allPages.filter(
  (page) => !redirectOnly.has(page.relative) && !utilityPages.has(page.relative)
);
```

- [ ] **Step 2: Add metadata and document-structure tests**

Create named tests asserting for every indexable page:

```js
assert.ok(page.title, `${page.relative}: missing title`);
assert.ok(page.description, `${page.relative}: missing meta description`);
assert.match(page.canonical, /^https:\/\/sleekacademia\.com\//);
assert.equal(page.h1Count, 1, `${page.relative}: expected exactly one h1`);
assert.ok(page.schemaCount > 0, `${page.relative}: missing JSON-LD`);
```

Also assert uniqueness of title, description, and canonical values across `indexablePages`.

- [ ] **Step 3: Add utility-page and sitemap contract tests**

Assert that every utility page contains `noindex` and is absent from sitemap `<loc>` values. Parse all `<loc>` values, reject duplicates or noncanonical hosts, and map each URL pathname to `public/index.html` for `/` or the corresponding file under `public/`. Assert every sitemap target exists and every indexable page appears exactly once.

- [ ] **Step 4: Run the SEO suite and inspect any evidence-based exception**

Run: `npm run test:seo`

Expected: real named tests execute. If an existing page violates the approved contract, either repair the confirmed defect or add a narrowly named purpose-based exception; never skip the entire page class.

- [ ] **Step 5: Run the full suite**

Run: `npm test`

Expected: all route and SEO tests pass with zero failures.

- [ ] **Step 6: Commit the static SEO contract**

```bash
git add test/seo-static.test.js package.json
git commit -m "test: enforce static SEO contracts"
```

### Task 3: Restore production SEO verification

**Files:**
- Create: `scripts/check-live-seo.mjs`
- Modify: `package.json`
- Test: `test/live-check.test.js`

**Interfaces:**
- Consumes: optional CLI base URL at `process.argv[2]`, defaulting to `https://sleekacademia.com`.
- Produces: `checkSite(baseUrl): Promise<{ checkedUrls: number }>` and CLI exit code 0 on success or 1 with a precise assertion message on failure.

- [ ] **Step 1: Write a failing integration test around a fixture server**

Create `test/live-check.test.js` with a temporary local HTTP server that supplies a homepage, redirects, robots file, sitemap, and one sitemap page. Import `checkSite` and assert it passes the conforming fixture. Add a second fixture response missing the homepage canonical and assert rejection matches `homepage canonical`.

- [ ] **Step 2: Run the checker test and verify it fails**

Run: `node --test test/live-check.test.js`

Expected: FAIL because `scripts/check-live-seo.mjs` does not exist.

- [ ] **Step 3: Implement bounded fetching and assertions**

Create `scripts/check-live-seo.mjs` with:

```js
async function request(url, { redirect = "follow" } = {}) {
  const response = await fetch(url, {
    redirect,
    signal: AbortSignal.timeout(15_000),
    headers: { "user-agent": "SleekAcademiaSEOCheck/1.0" },
  });
  return { response, body: await response.text() };
}
```

Export `checkSite`. Check homepage status and required markers, `robots.txt`, `sitemap.xml`, every sitemap URL, and these redirects:

```js
const redirects = new Map([
  ["/index.html", "/"],
  ["/services.html", "/"],
  ["/pricing.html", "/#pricing"],
  ["/blogs.html", "/blog.html"],
]);
```

Use manual redirect handling and compare `Location` exactly. When executed directly, print the checked URL count on success and set `process.exitCode = 1` with the exact error on failure.

- [ ] **Step 4: Add the package command**

Add to `package.json` scripts:

```json
"check:live-seo": "node scripts/check-live-seo.mjs"
```

- [ ] **Step 5: Run checker tests and the full suite**

Run: `node --test test/live-check.test.js && npm test`

Expected: all tests pass.

- [ ] **Step 6: Exercise the checker against current production as a baseline**

Run: `npm run check:live-seo -- https://sleekacademia.com`

Expected before deployment: FAIL specifically on `/blogs.html`, proving the checker detects the known live defect.

- [ ] **Step 7: Commit the live checker**

```bash
git add scripts/check-live-seo.mjs test/live-check.test.js package.json
git commit -m "test: restore live SEO verification"
```

### Task 4: Verify, deploy, and prove production

**Files:**
- Verify: `.cpanel.yml`
- Verify: `server.js`
- Verify: `test/seo-static.test.js`
- Verify: `scripts/check-live-seo.mjs`

**Interfaces:**
- Consumes: committed `main`, `origin`, active GitHub webhook, and public production URL.
- Produces: a pushed commit and evidence that the exact repair is live.

- [ ] **Step 1: Run pre-deployment verification**

```bash
npm test
npm run test:seo
git diff --check
git status --short
```

Expected: all tests pass, `git diff --check` has no output, and the working tree is clean.

- [ ] **Step 2: Reconfirm the destructive deployment target**

```bash
git remote -v
git branch --show-current
sed -n '1,80p' .cpanel.yml
```

Expected: remote is `https://github.com/Sleek-mx/sleekacademia.git`, branch is `main`, and `DEPLOYPATH` is `/home/sleenegb/public_html/sleekacademianewsite`.

- [ ] **Step 3: Push the completed repair**

Run: `git push origin main`

Expected: GitHub accepts the commits and reports the updated `main` ref.

- [ ] **Step 4: Inspect webhook delivery rather than assuming deployment**

Use `gh api repos/Sleek-mx/sleekacademia/hooks` to identify the active push hook and query its latest deliveries. Confirm HTTP 200 for the pushed commit. If history remains unavailable or the delivery fails, inspect `/api/health`, the webhook response, and cPanel deployment state; report pushed but not live until resolved.

- [ ] **Step 5: Run the production checker**

Run: `npm run check:live-seo -- https://sleekacademia.com`

Expected: exit 0 with all homepage, redirect, robots, sitemap, and sitemap-URL assertions passing.

- [ ] **Step 6: Verify the exact repaired behavior independently**

```bash
curl -sS -o /dev/null -D - https://sleekacademia.com/blogs.html
curl -sS https://sleekacademia.com/ | shasum
shasum public/index.html
```

Expected: `/blogs.html` returns 301 with `Location: /blog.html`; live and local homepage hashes match.

- [ ] **Step 7: Record final repository state**

Run: `git status -sb && git log --oneline -5`

Expected: clean `main` synchronized with `origin/main`. Only then report the site repair live and move to the separately scoped social-link change.
