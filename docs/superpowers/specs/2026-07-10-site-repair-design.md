# Sleek Academia Site Repair Design

## Objective

Repair the confirmed technical defects in the current Sleek Academia site without changing its visual design, marketing copy, analytics identifiers, checkout flow, or authenticated product behavior. The repair must be testable locally, deploy through the existing GitHub-to-cPanel path, and be verified on `https://sleekacademia.com` before it is reported live.

## Scope

This repair includes:

- Redirecting the legacy `/blogs.html` URL permanently to `/blog.html`.
- Adding executable static SEO regression tests for indexable pages, utility pages, canonical URLs, metadata, structured data, sitemap parity, and redirects.
- Adding an executable live-site checker for the public production URL.
- Making the anonymous service-request test deterministic when Clerk credentials are absent locally.
- Verifying every sitemap URL and the key canonical host redirects.

The following work is explicitly deferred to the next contained change:

- Adding Instagram, TikTok, and YouTube profile links to the website footer.
- Adding those verified profiles to `Organization.sameAs` structured data.
- Changing the Buffer token routing or posting automation.
- Publishing new SEO content.

## Existing Architecture

The site is an Express application serving static files from `public/`. Redirects and authenticated API behavior live in `server.js`. Production deploys from `Sleek-mx/sleekacademia` on `main` through the GitHub webhook at `/deploy.php`; cPanel executes `.cpanel.yml` and synchronizes the repository to `/home/sleenegb/public_html/sleekacademianewsite` before restarting Passenger.

Because `.cpanel.yml` uses `rsync --delete`, deployment is allowed only after confirming the canonical repository and remote immediately before pushing.

## Repair Design

### Legacy URL handling

`GET /blogs.html` will return HTTP 301 with `Location: /blog.html`. The existing `public/blogs.html` compatibility file may remain on disk, but Express must intercept the request before static-file serving. This removes the duplicate 200 response while preserving old inbound links.

### Static SEO contract

A Node test file matching the existing `test:seo` glob will enforce:

- Every indexable HTML page has one non-empty title, one meta description, one canonical URL on `https://sleekacademia.com`, and exactly one H1.
- Every indexable content page contains JSON-LD structured data.
- Utility pages remain `noindex,follow` and are excluded from the sitemap.
- Every sitemap URL maps to an existing public page or the homepage.
- Every intended indexable page appears once in the sitemap.
- Titles, descriptions, and canonical URLs are unique among indexable pages.
- Required legacy routes are represented by explicit 301 behavior tests.

Exceptions must be enumerated by purpose rather than silently skipped. The custom 404 page may omit a canonical, and redirect-only compatibility documents may omit normal page metadata.

### Live SEO checker

`scripts/check-live-seo.mjs` will accept an optional base URL defaulting to `https://sleekacademia.com`. It will check:

- HTTP-to-HTTPS and `www` canonicalization.
- `/index.html`, `/services.html`, `/pricing.html`, and `/blogs.html` redirects.
- Homepage status, canonical, title, description, JSON-LD, GA4, Meta Pixel, and TikTok Pixel markers.
- `robots.txt` and `sitemap.xml` availability.
- HTTP 200 for every sitemap URL.

It will exit nonzero and print the failing assertion when any contract is broken. It will never require production secrets.

### Authentication test determinism

When Clerk is not configured, an anonymous `POST /api/service-request` should still reject the request as unauthorized rather than returning a configuration-dependent 503. The route guard will distinguish missing authentication from downstream service configuration. Tests will supply an explicit test environment and assert the public security contract without calling Clerk.

## Error Handling and Safety

- Tests must fail closed on malformed sitemap XML, missing metadata, unexpected redirect destinations, or unreachable live URLs.
- Network checks use bounded timeouts and identify the exact URL that failed.
- No credential values are added to source control, logs, fixtures, or documentation.
- Existing GA4, Meta Pixel, and TikTok Pixel identifiers remain unchanged.
- No deployment command will run until the working tree, `origin`, branch, and `.cpanel.yml` destination are reconfirmed.

## Verification and Deployment

The repair is complete only when:

1. The new SEO tests fail against the current `/blogs.html` behavior.
2. The implementation makes the focused tests pass.
3. The full local test suite passes.
4. A local server passes the live checker against localhost where applicable.
5. The committed branch is pushed to `Sleek-mx/sleekacademia` `main`.
6. The GitHub webhook/cPanel deployment completes.
7. The production live checker passes against `https://sleekacademia.com`.
8. A direct production request confirms `/blogs.html` returns 301 to `/blog.html`.

If the webhook does not deploy the commit, the work is reported as pushed but not live while the deployment path is repaired. A local build or passing local test is not sufficient evidence of production completion.

## Success Criteria

- The current visual site and content remain unchanged.
- `/blogs.html` no longer returns duplicate indexable content.
- `npm run test:seo` executes real tests rather than zero tests.
- The full test suite has no configuration-dependent failure.
- Production passes the automated live SEO contract.
- The repair is traceable in Git and verified at the public URL.
