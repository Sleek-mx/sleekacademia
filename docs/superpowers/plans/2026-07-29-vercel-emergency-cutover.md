# Sleek Academia Emergency Vercel Cutover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deploy the existing Sleek Academia Express application to Vercel, verify it on a Git preview, and cut `sleekacademia.com` over by changing only the Cloudflare apex and `www` web records.

**Architecture:** Keep `server.js` as the single Express entrypoint and use Vercel's Node server detection. Isolate Vercel-specific behavior in a small runtime helper, preserve cPanel behavior outside Vercel, use the deployment URL as an exact preview origin, and cap base64 JSON uploads at 3 MiB so requests stay below Vercel's 4.5 MB payload ceiling.

**Tech Stack:** Node.js 22, Express 4, Vercel Functions, GitHub automatic deployments, Supabase, Clerk, Cloudflare DNS, Node test runner.

## Global Constraints

- The Git remote must remain `https://github.com/Sleek-mx/sleekacademia.git`.
- Normal Vercel deployment is Git push followed by Vercel's automatic build; direct CLI production deployment is fallback only.
- Never print, commit, or paste a credential value.
- Preserve the Namecheap files and configuration for rollback.
- Change only Cloudflare's apex and `www` web records; do not change nameservers, mail records, Clerk CNAMEs, or verification records.
- Do not report the site live until the public custom-domain checks pass.
- Preserve the three quiz IDs, API paths, server-side grading, and entitlement isolation.
- Keep unrelated untracked screenshots and handoff files untouched.

---

### Task 1: Create the emergency branch and runtime compatibility contracts

**Files:**
- Create: `src/platform/runtime.js`
- Create: `test/vercel-runtime.test.js`
- Modify: `server.js`
- Modify: `package.json`

**Interfaces:**
- Produces: `isVercelRuntime(env): boolean`
- Produces: `buildAllowedOrigins({ configured, productionOrigin, localDemoMode, port, vercelUrl }): string[]`
- Produces: `jsonBodyLimit(env): string`
- Consumes: standard environment keys `VERCEL`, `VERCEL_URL`, and `ALLOWED_ORIGINS`

- [ ] **Step 1: Create the emergency branch**

Run:

```bash
git switch -c emergency/vercel-cutover
```

Expected: the new branch points to the committed design checkpoint `86cbb73`.

- [ ] **Step 2: Write failing unit tests for runtime detection, preview origin, and JSON size**

Create `test/vercel-runtime.test.js`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildAllowedOrigins,
  isVercelRuntime,
  jsonBodyLimit,
} from "../src/platform/runtime.js";

test("detects Vercel only from the explicit runtime flag", () => {
  assert.equal(isVercelRuntime({ VERCEL: "1" }), true);
  assert.equal(isVercelRuntime({ VERCEL: "0" }), false);
  assert.equal(isVercelRuntime({}), false);
});

test("adds the exact Vercel deployment URL without weakening production origins", () => {
  assert.deepEqual(buildAllowedOrigins({
    configured: "https://sleekacademia.com",
    productionOrigin: "https://sleekacademia.com",
    localDemoMode: false,
    port: 3000,
    vercelUrl: "sleek-academia-git-cutover.example.vercel.app",
  }), [
    "https://sleekacademia.com",
    "https://sleek-academia-git-cutover.example.vercel.app",
  ]);
});

test("uses a Vercel-safe JSON parser limit while preserving the existing host limit", () => {
  assert.equal(jsonBodyLimit({ VERCEL: "1" }), "4.25mb");
  assert.equal(jsonBodyLimit({}), "12mb");
});

test("pins the Vercel-compatible Node 22 runtime used by the release gate", () => {
  const packageJson = JSON.parse(fs.readFileSync(
    new URL("../package.json", import.meta.url),
    "utf8"
  ));
  assert.equal(packageJson.engines?.node, "22.x");
});
```

- [ ] **Step 3: Run the new test and verify it fails**

Run:

```bash
node --test test/vercel-runtime.test.js
```

Expected: FAIL because `src/platform/runtime.js` does not exist.

- [ ] **Step 4: Implement the minimal runtime helper**

Create `src/platform/runtime.js`:

```js
function normalizeOrigin(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  try {
    return new URL(text.includes("://") ? text : `https://${text}`).origin;
  } catch {
    return "";
  }
}

export function isVercelRuntime(env = process.env) {
  return env.VERCEL === "1";
}

export function jsonBodyLimit(env = process.env) {
  return isVercelRuntime(env) ? "4.25mb" : "12mb";
}

export function buildAllowedOrigins({
  configured = "",
  productionOrigin = "",
  localDemoMode = false,
  port = 3000,
  vercelUrl = "",
} = {}) {
  const values = String(configured || "").split(",");
  values.push(productionOrigin);
  if (vercelUrl) values.push(vercelUrl);
  if (localDemoMode) {
    values.push(`http://localhost:${port}`, `http://127.0.0.1:${port}`);
  }
  return [...new Set(values.map(normalizeOrigin).filter(Boolean))];
}
```

- [ ] **Step 5: Wire the helper into `server.js`**

Import the helper:

```js
import {
  buildAllowedOrigins,
  isVercelRuntime,
  jsonBodyLimit,
} from "./src/platform/runtime.js";
```

At the beginning of the `/deploy.php` POST handler, add:

```js
if (isVercelRuntime()) {
  return res.status(410).json({
    error: "The cPanel deployment webhook is disabled on Vercel.",
  });
}
```

Change the JSON parser and origin construction to:

```js
app.use(express.json({
  limit: jsonBodyLimit(),
  verify: (req, _res, buffer) => {
    if (req.originalUrl === "/api/platform/payments/stripe-webhook") req.rawBody = Buffer.from(buffer);
  },
}));
const allowedOrigins = buildAllowedOrigins({
  configured: process.env.ALLOWED_ORIGINS || "https://sleekacademia.com",
  productionOrigin: "https://sleekacademia.com",
  localDemoMode,
  port,
  vercelUrl: process.env.VERCEL_URL || "",
});
```

Add the tested runtime pin to `package.json`:

```json
"engines": {
  "node": "22.x"
}
```

- [ ] **Step 6: Add a source-order regression contract for the webhook guard**

Append to `test/vercel-runtime.test.js`:

```js
test("disables the cPanel shell deploy path before reading secrets or paths on Vercel", () => {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const source = fs.readFileSync(path.join(root, "server.js"), "utf8");
  const route = source.slice(
    source.indexOf('app.post("/deploy.php"'),
    source.indexOf('app.get("/deploy.php"')
  );
  assert.ok(route.indexOf("isVercelRuntime()") < route.indexOf("GITHUB_WEBHOOK_SECRET"));
  assert.ok(route.indexOf("isVercelRuntime()") < route.indexOf("DEPLOY_REPO_PATH"));
});
```

- [ ] **Step 7: Run the focused tests**

Run:

```bash
node --test test/vercel-runtime.test.js test/platform-security.test.js
```

Expected: all tests PASS.

- [ ] **Step 8: Commit Task 1**

```bash
git add src/platform/runtime.js test/vercel-runtime.test.js server.js package.json
git commit -m "feat: make Express runtime safe for Vercel"
```

---

### Task 2: Enforce the temporary 3 MiB upload ceiling

**Files:**
- Modify: `src/platform/uploads.js`
- Modify: `test/platform-uploads.test.js`
- Modify: `test/platform-api.test.js`

**Interfaces:**
- Produces: `MAX_UPLOAD_BYTES = 3 * 1024 * 1024`
- Consumes: existing `validateUpload(input)` contract

- [ ] **Step 1: Change the upload tests to require 3 MiB**

Replace 8 MiB assertions and oversized buffers with:

```js
Buffer.alloc(3 * 1024 * 1024 + 1, 1)
```

and:

```js
assert.match(result.error, /3 MB/i);
```

Add a boundary assertion that a valid supported file of exactly 3 MiB does not fail with the size message.

- [ ] **Step 2: Run the upload tests and verify failure**

Run:

```bash
node --test test/platform-uploads.test.js test/platform-api.test.js
```

Expected: FAIL because the implementation still allows 8 MiB and returns the 8 MB message.

- [ ] **Step 3: Implement the 3 MiB ceiling**

In `src/platform/uploads.js`, set:

```js
export const MAX_UPLOAD_BYTES = 3 * 1024 * 1024;
```

Replace both hard-coded size messages with:

```js
"Files must be 3 MB or smaller."
```

- [ ] **Step 4: Run focused upload tests**

Run:

```bash
node --test test/platform-uploads.test.js test/platform-api.test.js
```

Expected: PASS.

- [ ] **Step 5: Run the complete local release gate**

Run:

```bash
npm test
npm run test:seo
npm run check:security
npm audit --omit=dev
node --check server.js
git diff --check
```

Expected: all test and security commands pass, audit reports zero production vulnerabilities, and diff check is clean.

- [ ] **Step 6: Commit Task 2**

```bash
git add src/platform/uploads.js test/platform-uploads.test.js test/platform-api.test.js
git commit -m "fix: fit uploads within Vercel payload limits"
```

---

### Task 3: Create the Vercel project and configure secrets safely

**Files:**
- Create locally through Vercel CLI: `.vercel/project.json` (must remain ignored)
- Modify: `PROGRESS.md`

**Interfaces:**
- Consumes: Vercel team `macsie-s-projects`
- Consumes: GitHub repository `Sleek-mx/sleekacademia`
- Produces: linked Vercel project `sleek-academia`
- Produces: Preview and Production environment configuration

- [ ] **Step 1: Reconfirm repository identity and ignore rules**

Run:

```bash
git remote -v
git status --short --branch
git check-ignore .vercel
```

Expected: remote matches Sleek Academia, only known unrelated untracked files remain, and `.vercel` is ignored.

- [ ] **Step 2: Create and link the Vercel project**

Run:

```bash
vercel link --yes --project sleek-academia --scope macsie-s-projects
```

Expected: `.vercel/project.json` identifies the new `sleek-academia` project.

- [ ] **Step 3: Connect the existing GitHub repository**

Run:

```bash
vercel git connect https://github.com/Sleek-mx/sleekacademia.git
```

Expected: Vercel confirms the repository connection. If access is blocked, use the Vercel dashboard only to authorize this exact repository, then retry.

- [ ] **Step 4: Verify the runtime version selected from `package.json`**

```bash
vercel project inspect sleek-academia
```

Expected: the linked project recognizes the repository configuration, and the first deployment build reports Node.js 22.x from `engines.node`.

- [ ] **Step 5: Transfer environment values without printing them**

For every required production key, read the value from the existing production environment or credential vault and pipe it directly to:

```bash
vercel env add KEY_NAME preview --sensitive
vercel env add KEY_NAME production --sensitive
```

Required names:

```text
ADMIN_AUTH_ENABLED
ADMIN_PASSWORD_HASH
ADMIN_SESSION_SECRET
ADMIN_USERNAME
ALLOWED_ORIGINS
CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
CSRF_SECRET
LOCAL_DEMO_MODE
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
NOTIFICATION_EMAIL
NVIDIA_API_KEY
PAYPAL_BASE_URL
PAYPAL_CLIENT_ID
PAYPAL_SECRET
QUIZ_ACCESS_CODE
QUIZ_ACCESS_CODE_PHARMACOLOGY
QUIZ_ACCESS_CODE_RENAL_CARDIAC
QUIZ_NOTIFY_EMAIL
QUIZ_PAYEE_EMAIL
QUIZ_SIGNING_SECRET
RESEND_API_KEY
RESEND_FROM
SMTP_HOST
SMTP_PASS
SMTP_PORT
SMTP_USER
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_STORAGE_BUCKET
SUPABASE_URL
TUTOR_EMAILS
```

Use `LOCAL_DEMO_MODE=0` and `ALLOWED_ORIGINS=https://sleekacademia.com`. Do not add Namecheap deployment-path variables.

- [ ] **Step 6: Verify environment names only**

Run:

```bash
vercel env ls
```

Expected: all required names exist for Preview and Production; values are not displayed.

- [ ] **Step 7: Update the checkpoint**

Record the Vercel project name, project ID, Git connection status, configured environment names, and the exact next command in `PROGRESS.md`. Do not record values.

- [ ] **Step 8: Commit the checkpoint**

```bash
git add PROGRESS.md
git commit -m "docs: checkpoint Vercel project configuration"
```

---

### Task 4: Push and verify the Vercel preview

**Files:**
- Modify only if preview evidence reveals a specific defect.
- Modify: `PROGRESS.md`

**Interfaces:**
- Consumes: Git-connected emergency branch
- Produces: immutable Vercel preview URL and deployment ID

- [ ] **Step 1: Push the emergency branch**

Run:

```bash
git push -u origin emergency/vercel-cutover
```

Expected: Vercel starts an automatic Preview deployment; Namecheap's main-only deploy handler ignores the branch.

- [ ] **Step 2: Locate and wait for the Git deployment**

Run:

```bash
vercel inspect --logs
vercel ls
```

Poll the exact deployment with short repeated inspections until it is Ready or failed. Do not use an arbitrary long sleep.

- [ ] **Step 3: Verify the public preview endpoints**

For the exact preview URL:

```bash
curl -fsS "$PREVIEW_URL/" | rg "Sleek Academia"
curl -fsS "$PREVIEW_URL/api/health"
curl -fsS -o /dev/null -w "%{http_code}\n" "$PREVIEW_URL/pharmacology-quiz"
curl -fsS "$PREVIEW_URL/api/pharm-quiz/health"
curl -fsS "$PREVIEW_URL/api/quiz/health"
curl -fsS "$PREVIEW_URL/api/patho-quiz/health"
```

Expected: homepage marker is present, every status is 200, and health JSON is valid.

- [ ] **Step 4: Exercise the pharmacology API**

Use the same request sequence as `test/pharmacology-quiz.test.js` against the preview URL:

- create a session;
- fetch free questions;
- submit an answer;
- verify grading feedback;
- verify question 31 remains locked without entitlement.

Expected: the preview origin is accepted and entitlement isolation matches local tests.

- [ ] **Step 5: Verify representative static assets**

Check the main stylesheet, quiz JavaScript, official logo, and woman hero video with `curl -fI`.

Expected: each returns a successful response with a non-zero content length or valid streamed response.

- [ ] **Step 6: Inspect deployment logs**

Run:

```bash
vercel inspect "$PREVIEW_URL" --logs
```

Expected: no startup failure, missing file, function crash, or repeated 500.

- [ ] **Step 7: Checkpoint preview evidence**

Update `PROGRESS.md` with the preview URL, deployment ID, commit SHA, endpoint results, and the next production step.

- [ ] **Step 8: Commit preview evidence**

```bash
git add PROGRESS.md
git commit -m "docs: verify Vercel preview deployment"
git push
```

Expected: the checkpoint commit also receives a Ready preview deployment.

---

### Task 5: Promote to production and attach the custom domain

**Files:**
- Modify: `PROGRESS.md`

**Interfaces:**
- Consumes: verified preview commit SHA
- Produces: Ready Vercel production deployment
- Produces: Vercel custom-domain requirements

- [ ] **Step 1: Re-run the release gate on the exact preview commit**

Run:

```bash
npm test
npm run test:seo
npm run check:security
npm audit --omit=dev
git diff --check
git status --short --branch
```

Expected: all gates pass and no unintended file is staged or modified.

- [ ] **Step 2: Fast-forward main to the verified branch**

Run:

```bash
git switch main
git merge --ff-only emergency/vercel-cutover
git push origin main
```

Expected: Vercel starts a Production deployment from the pushed commit.

- [ ] **Step 3: Wait for Vercel production readiness**

Use `vercel ls` and `vercel inspect` with the exact production deployment until Ready.

Expected: the production Vercel URL passes the same homepage, health, quiz, and asset checks as Preview.

- [ ] **Step 4: Add both custom domains**

Run:

```bash
vercel domains add sleekacademia.com sleek-academia
vercel domains add www.sleekacademia.com sleek-academia
vercel domains inspect sleekacademia.com
vercel domains inspect www.sleekacademia.com
```

Expected: Vercel returns the exact DNS records required for this project.

- [ ] **Step 5: Record Cloudflare rollback values**

Before editing, record only these existing properties for the apex and `www` records in `PROGRESS.md`:

- record name;
- record type;
- target/value;
- proxy state;
- TTL.

Do not alter or record secret tokens.

- [ ] **Step 6: Apply the DNS cutover**

In the authoritative Cloudflare zone, replace only the apex and `www` web records with the exact project-specific values returned by Vercel. Preserve every other record unchanged.

- [ ] **Step 7: Verify DNS, TLS, and public HTTP**

Poll with short checks:

```bash
dig +short sleekacademia.com A
dig +short sleekacademia.com CNAME
dig +short www.sleekacademia.com CNAME
vercel domains inspect sleekacademia.com
curl -fsS -o /dev/null -w "%{http_code}\n" https://sleekacademia.com/
```

Expected: Vercel reports a valid domain configuration, TLS succeeds, and the homepage returns 200.

---

### Task 6: Complete the public production verification

**Files:**
- Modify: `PROGRESS.md`

**Interfaces:**
- Consumes: live `https://sleekacademia.com`
- Produces: final evidence that the Vercel cutover is live and rollback-safe

- [ ] **Step 1: Verify required production endpoints**

Run:

```bash
curl -fsS https://sleekacademia.com/api/health
curl -fsS https://sleekacademia.com/api/pharm-quiz/health
curl -fsS -o /dev/null -w "%{http_code}\n" https://sleekacademia.com/pharmacology-quiz
curl -fsS https://sleekacademia.com/api/quiz/health
curl -fsS https://sleekacademia.com/api/patho-quiz/health
```

Expected: every endpoint returns 200 and valid health content.

- [ ] **Step 2: Verify the pharmacology quiz behavior**

Exercise question loading, grading, rationale, the 30-question free boundary, and the question-31 lock through the public domain.

Expected: behavior matches the 301-test local baseline.

- [ ] **Step 3: Verify security and durable backend boundaries**

Check:

- `/api/security/csrf` returns a token and Secure cookie;
- Clerk student authentication reaches the expected sign-in or client-trust boundary;
- MCX administrator authentication reaches the expected login boundary;
- an authenticated Supabase-backed dashboard read succeeds;
- one controlled supported upload below 3 MiB succeeds;
- a file above 3 MiB is rejected with the 3 MB message.

- [ ] **Step 4: Verify live assets and browser behavior**

Inspect desktop and mobile homepage and pharmacology quiz surfaces, confirm required animation/static assets load, and confirm there are no final browser console errors.

- [ ] **Step 5: Update the final checkpoint**

Mark Vercel production, custom domain, DNS rollback values, live endpoints, quiz verification, authentication boundary, upload checks, and remaining Namecheap support status in `PROGRESS.md`.

- [ ] **Step 6: Commit and push final evidence**

```bash
git add PROGRESS.md
git commit -m "docs: verify Sleek Academia live on Vercel"
git push origin main
```

Wait for the final documentation-only Vercel production deployment and recheck `/api/health`.

- [ ] **Step 7: Report completion**

Report the live URL, exact commit SHA, verified endpoints, DNS records changed, rollback availability, and the temporary 3 MiB upload limitation. Do not claim Namecheap is repaired; state only that Vercel is serving production.
