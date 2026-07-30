# Sleek Academia Emergency Vercel Cutover Design

Date: 2026-07-29

## Goal

Restore the full Sleek Academia production site by deploying the existing Express application to Vercel, validating it on a preview deployment, and then moving only the `sleekacademia.com` and `www.sleekacademia.com` web records from the unavailable Namecheap LiteSpeed/Passenger origin to Vercel.

The cutover is temporary and reversible. Namecheap remains intact while its support team repairs the existing Passenger routing failure.

## Current State

- Repository: `/Users/ephantusmacharia/Websites/Active Projects/sleek-academia-render`
- GitHub remote: `https://github.com/Sleek-mx/sleekacademia.git`
- Current production commit: `f6690f7`
- Current production platform: Namecheap cPanel with LiteSpeed and Passenger
- Current failure: Namecheap returns a site-wide branded HTTP 500, including direct-origin HTTPS requests.
- Application health: the same code, Node binary, and environment return HTTP 200 when the app is run directly outside Passenger.
- Pharmacology quiz: complete, committed, pushed, and locally verified with the full 301-test suite.
- Vercel account: authenticated as the `macsie-s-projects` team; no existing Sleek Academia Vercel project.

## Chosen Approach

Use a Git-connected Vercel project and an emergency branch:

1. Create `emergency/vercel-cutover` from the current local main branch.
2. Add the minimum Vercel compatibility changes and focused tests.
3. Create and link a Vercel project without publishing secrets.
4. Configure production and preview environment variables from the existing credential store or production environment without printing their values.
5. Connect the Vercel project to the existing GitHub repository.
6. Push the emergency branch so Vercel creates a preview deployment.
7. Verify the preview deployment before changing production or DNS.
8. Merge or fast-forward the verified changes to `main` and let Vercel build the production deployment from Git.
9. Attach `sleekacademia.com` and `www.sleekacademia.com` to the Vercel project.
10. Record the current Cloudflare web records, apply Vercel's project-specific records, and verify the public domain.

Direct CLI production deployment is a recovery fallback only if the Git integration fails. The normal deployment path is Git push followed by Vercel's automatic build.

## Application Compatibility Changes

### Express entrypoint

Keep `server.js` as the single application entrypoint. Current Vercel supports root-level Node HTTP servers that call `listen()`, so the Express architecture does not need to be converted into separate API functions.

### cPanel deployment webhook

The `/deploy.php` POST route performs cPanel-only shell operations: Git reset, destructive `rsync --delete`, npm installation, and Passenger restart-file creation. On Vercel, this route must not attempt those operations.

When `process.env.VERCEL` is present, the route will return a stable disabled response without invoking a shell command or writing a deploy log. Namecheap behavior remains unchanged.

### Upload limit

Vercel Functions cap request and response bodies at 4.5 MB. Sleek Academia currently accepts an 8 MB file encoded as base64 inside JSON, which exceeds that platform limit.

For the emergency deployment:

- Set the application upload ceiling to 3 MB.
- Keep the MIME, extension, and binary-signature validation.
- Update user-facing validation copy and tests to match the temporary limit.
- Do not implement direct-to-Supabase uploads during the emergency cutover.

This keeps uploads honest and functional while avoiding an unbounded architectural change. Restoring the 8 MB limit requires a later direct-to-object-storage upload flow.

### Static files and runtime filesystem

The public site and assets remain read-only deployment files served by Express. Production data, admin sessions, files, notifications, orders, quiz unlocks, and other durable state continue to use Supabase or signed tokens.

No production feature may depend on local disk persistence. The cPanel deploy log remains disabled on Vercel.

### Origin, authentication, and cookies

The production domain remains `https://sleekacademia.com`, so the existing Clerk domain, Secure cookies, CSRF origin, and allowed-origin model remain unchanged after DNS cutover.

The Vercel preview is used primarily to verify public pages, static assets, health endpoints, quiz APIs, and server startup. Production Clerk and administrator authentication receive their final smoke check only after the custom domain points to Vercel.

## Environment Configuration

Environment values will be transferred to Vercel without displaying or committing them.

Required categories:

- Supabase URL, service-role key, and private storage bucket
- Clerk publishable and secret keys
- Admin authentication hash, session secret, and username
- CSRF and quiz-signing secrets
- Quiz access codes and notification configuration
- Resend and SMTP configuration
- PayPal configuration
- Allowed production origins

Namecheap-specific deployment paths, npm paths, and deploy-log paths are not required on Vercel.

No credential value may appear in Git, build output copied into the repository, `PROGRESS.md`, the design document, or chat.

## DNS Cutover

Cloudflare remains the authoritative DNS provider.

Before any mutation:

1. Capture the exact current apex and `www` record type, value, proxy state, and TTL.
2. Confirm all mail, Clerk, and verification records that must remain untouched.
3. Obtain the required apex and `www` values from the configured Vercel project rather than hard-coding generic Vercel records.

During cutover:

- Change only the apex web record and the `www` web record.
- Use the proxy state required for Vercel domain verification and TLS issuance.
- Do not change nameservers, MX records, SPF/DKIM/DMARC, Clerk CNAMEs, Supabase configuration, or email-routing records.

The public domain is not considered live until Vercel reports a ready production deployment, DNS resolves to the intended target, TLS is valid, and the required HTTP checks pass.

## Verification

### Local gate

- Full application test suite
- SEO test suite
- Tracked-source security scan
- Production dependency audit
- JavaScript syntax and `git diff --check`
- Focused tests for Vercel deploy-webhook disabling and the temporary upload limit

### Vercel preview gate

- `/` returns 200 and contains the expected Sleek Academia homepage marker.
- `/api/health` returns the exact healthy JSON response.
- `/pharmacology-quiz` returns 200.
- `/api/pharm-quiz/health` returns 200.
- The pharmacology question session, grading response, free-question boundary, and locked-question behavior work.
- Existing antimicrobial and renal/cardiac quiz health endpoints remain functional.
- Required CSS, JavaScript, image, and video assets return successful responses.
- No serverless startup or missing-file errors appear in the deployment logs.

### Public-domain gate

After DNS cutover, repeat the preview checks against `https://sleekacademia.com`, then smoke-test:

- Clerk student sign-in boundary
- MCX administrator login boundary
- CSRF issuance
- Supabase-backed dashboard read
- One controlled sub-3-MB upload without exposing private content
- Quiz unlock claim path without performing an uncontrolled payment

Only after these checks pass may the site be reported as live on Vercel.

## Rollback

Rollback does not delete or overwrite the Namecheap deployment.

If the Vercel production or custom-domain checks fail:

1. Restore the captured Cloudflare apex and `www` records exactly.
2. Verify that DNS points back to the previous origin.
3. Leave the Vercel deployment available by its project URL for diagnostics.
4. Do not remove production environment values or the Vercel project until the rollback is verified.

When Namecheap support repairs Passenger, the team may either keep Vercel or restore Namecheap using the same recorded DNS values and full live verification.

## Non-Goals

- Rewriting Express into a new framework
- Replacing Supabase, Clerk, Resend, PayPal, or the MoneyGram quiz flow
- Reworking the payment architecture
- Building direct-to-Supabase uploads during the outage
- Modifying mail, Clerk, or non-web DNS records
- Deleting the Namecheap deployment
- Treating a local build or Vercel preview as proof that the public domain is live

## Success Criteria

- The Vercel deployment is produced from the verified Git commit.
- `https://sleekacademia.com` returns the Sleek Academia application rather than the Namecheap 500 page.
- The homepage, health endpoint, pharmacology quiz page, and pharmacology quiz API return HTTP 200.
- All three quizzes retain correct server-side grading and entitlement isolation.
- Production authentication and durable Supabase-backed reads work on the custom domain.
- DNS rollback information is recorded and complete.
- No secret is exposed and no unrelated DNS record is changed.
