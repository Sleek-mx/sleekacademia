# Sleek Academia SEO and Automation Design

## Objective

Position Sleek Academia as a tutoring service for students in nursing, law, IT, accounting, and finance, improve crawlability and search-result quality, and establish a guarded automation system that can monitor and improve SEO without routine user approval.

## Scope

The first release repairs the SEO foundation: deployment security, page positioning, canonical URLs, sitemap coverage, index controls, structured data, conversion measurement, and automated checks. Content automation follows after Search Console access and a verified tutor profile are available.

## Architecture

Static marketing pages remain under `public/` and continue to be served by Express. A Node test suite enforces metadata, canonical, indexation, sitemap, schema, and deployment-security contracts. GitHub Actions runs these checks on pushes and on a daily schedule. The existing Namecheap webhook deploys passing changes from `main`.

## Positioning

The site will use one umbrella promise: personalized academic and professional-exam tutoring. Nursing, law, IT, accounting, and finance are service categories within that promise. Copy must not claim guaranteed results, unverified pass rates, credentials, or first-hand outcomes.

## Technical SEO

- Every indexable page has one self-referencing canonical URL.
- Account, payment, dashboard, error, and premium utility pages use `noindex,follow` and stay out of the sitemap.
- The sitemap includes all indexable marketing and article pages and excludes utility pages.
- Homepage schema identifies Sleek Academia as an educational organization and its tutoring offer catalog.
- Article schema uses working image/logo URLs and honest organizational authorship until a named tutor profile is supplied.
- Visible content and structured data must agree.

## Measurement

GA4 remains the analytics destination. Calls to action emit `cta_clicked` with location and destination. Completed onboarding and payment remain separate future conversion events because their final business definitions require live verification.

## Automation

Daily automation performs deterministic checks only: crawler tests, metadata checks, broken internal URL checks, and a live health request. Weekly intelligent content work will be enabled after Google Search Console data and an OpenAI API key are stored as repository secrets. Content changes must pass the same checks before deployment.

## Safety and rollback

The deployment endpoint must have an environment-provided webhook secret; there is no code fallback. Secrets are never committed. A failed production health check blocks or rolls back automated publishing. Automation may skip work when facts are unavailable, but it may never invent them.

## Inputs still required

- Public tutor name, biography, subjects, qualifications, and experience.
- Primary contact method and service geography.
- Search Console access and GA4 property access.
- A rotated Namecheap/GitHub webhook secret stored outside the repository.
- An OpenAI API key stored as a GitHub Actions secret if weekly AI work is enabled.

