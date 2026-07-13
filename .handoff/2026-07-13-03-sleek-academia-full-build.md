# Session Handoff: Sleek Academia Full Website and Client Dashboard

Created: 2026-07-13 03:33 CDT
Branch: `feature/phase-1-foundation-home`
Author: Sly Macsie

## What We Were Building

Rebuild Sleek Academia as one consistent public website and authenticated client workspace, then demonstrate the complete working system on localhost before asking Max for permission to push to GitHub and trigger the Namecheap deployment.

## Session Progress

### Completed

- Restored and verified the canonical repository and GitHub remote.
- Wrote the approved platform design specification: `docs/superpowers/specs/2026-07-13-sleek-academia-platform-redesign-design.md` (`d2a2149`).
- Added official logo variants, favicon, touch icon, full-body mascot, and the brand foundation (`02c1e27`).
- Rebuilt the homepage around the Vibrant Academic Studio direction (`20f57bc`).
- Removed public homepage pricing/packages and changed `/pricing.html` to redirect to `/onboard.html`.
- Preserved Store access and its separate commerce behavior.
- Added the authorship/AI-use-report assurance message and signup-first service CTAs.
- A browser-native mascot/typewriter/plant hero animation was built, reviewed, rejected by Max, and fully reverted (`718a924`, `4071e81`). The committed homepage is static again.

### Current Status

- Phase 1 static homepage is implemented on `feature/phase-1-foundation-home`.
- Phases 2–5 are not implemented yet.
- Nothing from this branch has been pushed or deployed.
- Production at `https://sleekacademia.com` is unchanged by this branch.
- Ignored preview artifacts may remain under `tmp/`; they are not production files and must not influence the design.

## Max's Latest Direction

1. Keep the hero static. Do not recreate the typing headline, animated mascot arm/thinking loop, moving plants, or drifting hero scene.
2. Add polished **website animation**, using current 21st.dev examples for inspiration: restrained section entrances, hover responses, navigation transitions, card interactions, and page-level micro-interactions.
3. Motion must feel original, subtle, premium, and brand-consistent. Do not paste a 21st.dev component blindly or turn the site into a demo reel.
4. Finish the entire build before presenting another partial concept.
5. Show the full working website on localhost—including public pages, request flow, signup/auth handoff, dashboard, payment states, and gated delivery—before any push to Namecheap.

## Resume Instructions

1. Work from the existing isolated worktree:

   ```bash
   cd "/Users/ephantusmacharia/Websites/Active Projects/sleek-academia-render/.worktrees/phase-1-foundation-home"
   ```

2. Read these files before changing code:

   ```bash
   sed -n '1,260p' .handoff/2026-07-13-03-sleek-academia-full-build.md
   sed -n '1,240p' PROGRESS.md
   sed -n '1,320p' docs/superpowers/specs/2026-07-13-sleek-academia-platform-redesign-design.md
   ```

3. Verify the saved state:

   ```bash
   git status --short
   git branch --show-current
   npm install
   npm test
   ```

   Expected branch: `feature/phase-1-foundation-home`. Expected baseline after the hero-animation reverts: 31 tests passing.

4. Inspect the existing public pages, onboarding/auth code, dashboard, server payment endpoints, and deployment files before implementing. Use the repository knowledge graph first if its MCP tools are available.
5. Browse 21st.dev specifically for interaction inspiration, then choose a small reusable motion vocabulary. The hero composition itself stays still.
6. Execute the remaining phases in order, updating `PROGRESS.md` after every milestone.
7. Start the real Express app locally, exercise every user path, and show Max the complete localhost result. Stop before Git push or Namecheap deployment.

## Remaining Build Phases

### Phase 2: About, Blog, and Store

- Redesign About in an original PROSION-inspired editorial/sculptural layout using Sleek Academia colors and identity.
- Redesign Blog around the supplied colorful editorial reference.
- Generate consistent production artwork for each existing blog article; no generic placeholders.
- Restyle Store to match the new system while preserving its existing product data and immediate checkout behavior.
- Remove Pricing/packages links from all public navigation and content, not just the homepage.
- Apply restrained shared website motion and accessible reduced-motion fallbacks.

### Phase 3: Request Funnel and Signup

- All non-Store public CTAs end in the service request/contact/signup path, never public payment.
- Collect service-specific details first, then name, email, optional urgent phone number, and optional school.
- Add the essay/report authorship notice: every completed essay/report includes an AI-use report and is reviewed for instructions, sources, citations, and authorship transparency.
- Replace/adapt the current signup page to the supplied signup concept while matching the brand.
- Clerk remains the authentication provider.
- Preserve the pending request through signup and create the authenticated request without asking the client to re-enter details.

### Phase 4: Dashboard Backend

- Use Clerk identity at the Express security boundary.
- Use Supabase Postgres for durable application data and private Supabase Storage for files.
- Day-one dashboard features: prefilled requests, request list/detail, two-way messaging, file uploads/downloads, timeline/status tracking, notifications, and profile/contact data.
- Do not leave service requests as email-only submissions; they must be durable records.
- Dashboard styling is calmer and more professional than the public marketing pages but uses the exact logo and shared colors.

### Phase 5: Payments and Gated Delivery

- Reuse the payment methods already present in the repository: Stripe, PayPal, and any existing wallet flow that is genuinely configured.
- Custom service payments occur only inside the authenticated dashboard.
- Require a 50% deposit before a request can move to `In Progress`.
- Require the remaining 50% before the client can download final work.
- Final delivery includes both the completed work and the AI-use report where applicable.
- Store purchases stay immediate and separate from the custom-service 50/50 flow.
- Server-side state decides whether work may start or files may be downloaded; never trust a client-side button alone.

### Phase 6: Local QA and Review Gate

- Verify desktop and mobile layouts for all public and authenticated pages.
- Verify Clerk signup/login/session behavior.
- Verify pending-request persistence through auth.
- Verify messages, upload permissions, status transitions, payment webhooks/state, deposit gate, balance gate, and delivery authorization.
- Run the complete automated suite, static/SEO checks, and relevant security checks.
- Demonstrate the full system at a localhost URL with real screenshots and usable flows.
- Ask Max to approve the complete localhost build.
- Only after explicit approval: merge/push, let the platform auto-build, then follow the deploy verification playbook against the public URL.

## Locked Business and Design Decisions

- No public Pricing page, pricing section, packages, or package detours.
- Public service CTAs never collect card or PayPal details.
- Store and Store checkout remain public and functional.
- Exact logo source: `/Users/ephantusmacharia/Downloads/sleek academia logo2.png`.
- Approved hero/brand reference: `/Users/ephantusmacharia/Downloads/ChatGPT Image Jul 13, 2026, 01_00_01 AM.png`.
- Blog reference: `/Users/ephantusmacharia/Downloads/ChatGPT Image Jul 13, 2026, 01_21_18 AM.png`.
- About reference: the supplied PROSION screenshot and linked Dribbble project; create an original Sleek Academia interpretation.
- Mascot must remain the exact full-body green graduate frog: black cap, orange glasses, blue knit hoodie with orange details, laptop, orange trousers, and blue shoes. No head-only mascot or emoji replacement.
- The mascot and hero scene remain static.
- Public visual direction: Vibrant Academic Studio. Dashboard direction: calmer professional workspace.
- Public flow ends in signup/contact; assistance, communication, payment, tracking, and delivery continue in the dashboard.

## Architecture Facts

- Current stack is Express with static HTML/CSS/JavaScript, not a React/shadcn project.
- Existing Clerk integration and dashboard code are already present and must be audited/reused instead of replaced casually.
- `public/onboard.html` currently contains public/inline payment behavior that conflicts with the approved service flow and must be moved behind authenticated dashboard logic. Store payment is exempt.
- Supabase is the approved durable database/storage direction.
- Existing tests use Node's built-in `node:test`.

## Things Tried That Must Not Be Repeated

- The CSS/JavaScript 16:9 animated hero with typewriter headline, fake articulated arm, thought bubbles, plant sway, and drifting shapes was visually rejected. Do not recreate, refine, or repurpose it.
- Do not provide another abstract visual companion or low-fidelity concept board. Max wants the real running implementation.
- Do not call a local build “deployed” or “live.”

## Deployment and Safety Risks

- Remote: `https://github.com/Sleek-mx/sleekacademia.git`.
- Production: `https://sleekacademia.com`.
- Namecheap live directory: `/home/sleenegb/public_html/sleekacademianewsite`.
- Deployment is Git push → webhook/platform build → Passenger restart.
- `.cpanel.yml` and related deployment behavior use destructive `rsync --delete`. Confirm the exact complete source and destination before any deployment.
- Never push or deploy before Max approves the complete localhost site.
- Never launch Chrome with `--remote-debugging-port`.
- Never ask Max to paste secrets into chat. Read required credentials from `/Users/ephantusmacharia/Secret Stash/08 - Credentials & Keys`.

## Tests Status

- Last verified before the rejected animation: 31 passing tests, zero failures.
- The animation-specific tests were reverted with the feature.
- Run `npm test` immediately on resume to reconfirm the saved baseline.

## Key Files

- `PROGRESS.md`
- `docs/superpowers/specs/2026-07-13-sleek-academia-platform-redesign-design.md`
- `docs/superpowers/plans/2026-07-13-phase-1-foundation-home.md`
- `public/index.html`
- `public/css/brand-v2.css`
- `public/about.html`
- `public/blog.html`
- `public/store.html`
- `public/onboard.html`
- `public/sign-up.html`
- `public/dashboard.html`
- `public/js/onboard.js`
- `server.js`
- `.cpanel.yml`

## Definition of Done for the Next Task

The next task is not complete when one page looks good. It is complete when the entire public site and authenticated client workflow operate together on localhost, the Store still checks out, service requests survive Clerk signup into Supabase-backed dashboards, messaging/uploads/tracking work, 50/50 payment and delivery gates are server-enforced, all tests pass, and Max can review the full working local site before any deployment.
