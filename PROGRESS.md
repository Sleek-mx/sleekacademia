# PROGRESS — Sleek Academia Platform Redesign

Goal: Rebuild the public site and authenticated client workspace, then verify the completed platform live on Namecheap.

Plan:

1. Foundation and Home.
2. About, Blog, and Store.
3. Request Funnel and Signup.
4. Dashboard Backend.
5. Payments and Delivery.
6. QA and Namecheap Launch.

## Done

- [x] Verified `origin` is `https://github.com/Sleek-mx/sleekacademia.git` and restored the canonical local checkout.
- [x] Audited the live site, Express/Clerk architecture, existing dashboard, public payment code, Store, About, Blog, and deployment path.
- [x] Locked the signup-first public flow, dashboard scope, Supabase-backed architecture, 50/50 payment gates, official logo, full-body mascot, and Vibrant Academic Studio direction.
- [x] Wrote the approved platform design specification at `docs/superpowers/specs/2026-07-13-sleek-academia-platform-redesign-design.md`.
- [x] Completed Phase 1 on `feature/phase-1-foundation-home`: official logo variants, favicon/touch icon, optimized full-body mascot, shared Vibrant Academic Studio CSS, and a fully rebuilt signup-first homepage.
- [x] Removed public homepage pricing/packages and redirected the retired `/pricing.html` route to `/onboard.html`; Store checkout remains separate.
- [x] Verified Phase 1 with 31 passing tests, clean diff checks, successful local HTTP checks, and desktop/mobile renders from the running Express app.

## Next

- [ ] Review the actual Phase 1 homepage render with Max and apply any visual refinements.
- [ ] Execute Phase 2: redesign About and Blog, generate production blog artwork, and restyle Store without changing checkout behavior.

## Facts a fresh session needs

- Repository: `/Users/ephantusmacharia/Websites/Active Projects/sleek-academia-render`
- Remote: `https://github.com/Sleek-mx/sleekacademia.git`
- Production: `https://sleekacademia.com`
- Namecheap live directory: `/home/sleenegb/public_html/sleekacademianewsite`
- Deployment: push to GitHub, webhook, Passenger restart; `.cpanel.yml` and `server.js` use destructive `rsync --delete`, so verify the complete source and destination before pushing.
- Official logo source: `/Users/ephantusmacharia/Downloads/sleek academia logo2.png`
- Approved visual reference: `/Users/ephantusmacharia/Downloads/ChatGPT Image Jul 13, 2026, 01_00_01 AM.png`
- Blog reference: `/Users/ephantusmacharia/Downloads/ChatGPT Image Jul 13, 2026, 01_21_18 AM.png`
- About reference: supplied PROSION screenshot and Dribbble link.
- Public services never take payment; custom-service payment happens only in the dashboard.
- Custom requests require 50 percent deposit before `In Progress` and full payment before final/AI-report downloads.
- Store checkout remains immediate and separate.
- Never put credentials in Git or chat; use `/Users/ephantusmacharia/Secret Stash/08 - Credentials & Keys` when secrets are required.
