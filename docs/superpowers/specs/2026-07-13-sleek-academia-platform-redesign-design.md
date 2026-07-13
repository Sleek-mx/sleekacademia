# Sleek Academia Platform Redesign Design

## Objective

Rebuild Sleek Academia as a vibrant, professional academic-support platform with a consistent public website, a signup-first service funnel, and an authenticated client workspace. Public service flows collect intent and contact details but never payment. Custom-service communication, uploads, status tracking, staged payments, and protected delivery happen inside the dashboard. The Store remains a separate immediate-purchase experience.

## Approved Delivery Phases

1. Foundation and Home: install the visual system, official logo/favicon, full-body mascot assets, global navigation, and rebuilt homepage; remove packages and public pricing.
2. About, Blog, and Store: rebuild About and Blog, create coordinated imagery for every existing article, and restyle the Store without changing its checkout behavior.
3. Request Funnel and Signup: rebuild the service wizard, add the essay/report AI-report assurance, collect contact details, integrate Clerk, and transfer the pending request into the dashboard.
4. Dashboard Backend: add durable profiles, requests, messages, attachments, status history, and client/admin workspace views.
5. Payments and Delivery: move the existing Stripe, PayPal, and wallet methods behind authentication; require a 50 percent deposit before work begins and the remaining 50 percent before final downloads unlock.
6. QA and Namecheap Launch: verify responsive behavior, accessibility, SEO, auth, storage, messaging, payment gates, Store checkout, and the live Namecheap deployment.

Each phase must produce runnable, reviewable software and update `PROGRESS.md` before the next phase begins.

## Existing Architecture and Deployment

The repository is `Sleek-mx/sleekacademia` on `main`. It is an Express application that serves static HTML, CSS, and browser JavaScript from `public/`. Clerk is already configured through `@clerk/express`. Stripe and PayPal server endpoints already exist. Production runs on Namecheap CloudLinux/Passenger at `/home/sleenegb/public_html/sleekacademianewsite`.

Deployments occur through Git push and the repository webhook. The deployment performs `rsync --delete`, so the repository, remote, branch, and complete deploy payload must be verified immediately before pushing. No production state may be stored inside the synchronized application directory.

## Visual Direction

The approved direction is **Vibrant Academic Studio**:

- Public marketing pages are expressive, spacious, and mascot-led.
- The About page borrows the sculptural depth and oversized editorial composition of the supplied PROSION reference.
- The Blog uses colorful editorial cards and custom article images.
- Authentication uses luminous gradients and glass-like controls adapted from the supplied signup component.
- The dashboard uses the same brand family but is calmer, denser, and optimized for work.

### Brand Assets

- Use the official Sleek Academia logo from `/Users/ephantusmacharia/Downloads/sleek academia logo2.png`.
- The full logo appears in public navigation, authentication, and the dashboard sidebar.
- The logo mark becomes the favicon, touch icon, compact mobile mark, and application icon.
- Mascot artwork must show the same full-body green graduate frog from the approved references: black graduation cap, orange glasses, blue knit hoodie with orange details, laptop, blue shoes, and premium friendly 3D rendering.
- Do not use emoji, a head-only crop, a generic frog, or a materially different costume.

### Color System

The UI uses a white and very-light-blue foundation with the reference palette:

- Ink: `#101827`
- Body: `#526073`
- Muted: `#8491A3`
- Border: `#E5EBF2`
- Surface: `#F5F8FC`
- Blue: `#078FEC`
- Teal: `#12C8AE`
- Green: `#42C83F`
- Orange: `#FF9C0A`
- Pink: `#ED3489`
- Yellow: `#FFD51A`

Blue-to-teal gradients are the primary CTA treatment. Orange and pink support highlights and status accents. Green is reserved for success and progress. Body copy remains dark and readable. The implementation must sample final asset colors and tune these values if the official logo or generated mascot visibly differs.

### Typography and Shape

- Use a modern geometric sans for headings with strong black weights and compact tracking.
- Use a highly legible sans for body copy and form labels.
- Desktop page shells use generous whitespace, 20 to 32 pixel radii, restrained shadows, and clean one-pixel borders.
- Mobile layouts collapse to a single column without shrinking desktop content.
- Motion is short and purposeful: entrance, hover elevation, step transition, upload progress, status change, and payment confirmation. Reduced-motion preferences disable nonessential effects.

## Public Information Architecture

The primary navigation is:

- Home
- About Us
- Blog
- Store
- Get Started
- Login when signed out, or Dashboard when signed in

Pricing is removed from navigation, footers, article CTAs, schemas, redirects, and the homepage. Tutoring package cards and package language are removed. The Store remains visible and retains its product checkout.

### Homepage

The homepage contains:

1. Floating white navigation shell with official logo.
2. Hero with the full-body mascot and the headline “A place where your professional journey begins.”
3. Primary “Get Started” CTA and secondary “Visit Store” CTA.
4. Service paths for essay/report help, exam preparation, tutoring, and other support.
5. A short three-step explanation: share details, create workspace, collaborate and complete.
6. Authorship/AI-report assurance for essay and report work.
7. Credibility, subject areas, testimonials, and outcome-oriented proof that avoids unsupported guarantees.
8. Final signup CTA and global footer without pricing links.

### About

The About page uses an oversized editorial hero with sculptural academic forms, the official logo, and a concise mission. It then tells the Sleek Academia story, explains the client process, presents values and subject expertise, and closes with a signup CTA. It must not copy PROSION content or branding.

### Blog

The Blog contains a mascot-led editorial hero, category shortcuts, complete-guide cards, article search/filtering, and responsive article cards. Every existing article receives a coordinated 3D editorial image matched to its subject while preserving the mascot’s approved identity when the mascot appears. Article metadata, canonicals, structured data, and current article URLs remain intact.

### Store

The Store is restyled with the new visual system. Existing products, prices, payment behavior, and immediate digital delivery remain unchanged. The custom-service 50/50 rule does not apply to Store products.

## Public Service Funnel

Every non-Store conversion CTA ends in signup/contact details and then the dashboard.

1. Choose support type.
2. Enter service details.
3. Review the request and authorship assurance.
4. Enter name, email, optional urgent phone number, and optional school.
5. Create or access the Clerk account.
6. Create the durable request and open it prefilled in the authenticated dashboard.

Essay/report fields include subject/field, title or brief, page count, citation format, deadline, description, and initial attachments. The UI includes this approved assurance:

> Authorship matters at Sleek Academia. Every completed essay or report includes an AI-use report for transparency. Our team reviews instructions, sources, citations, and the completed work carefully before delivery.

No public service page requests card, PayPal, wallet, or pricing information. A pending request is held only long enough to complete authentication, then exchanged for a server-owned request record. The handoff must be idempotent so refreshes cannot create duplicate requests.

## Authentication and Contact Profile

Clerk remains the authentication provider. The new signup shell uses the supplied animated signup concept and Sleek Academia branding, but all success states must reflect real Clerk state. Email verification, Google sign-in, session recovery, and account security remain Clerk-controlled.

Contact profiles store Clerk user ID, name, primary email, optional urgent phone, optional school, avatar, role, notification preferences, and timestamps. Secret credentials remain in the existing credential store or production environment and are never committed or pasted into chat.

## Dashboard Experience

The client dashboard has a responsive sidebar/bottom navigation with:

- Overview
- My Requests
- Messages
- Files
- Payments
- Profile
- Help

The overview shows active requests, unread messages, shared files, amount due, recent activity, and a prominent new-request action. A request detail view contains the brief, status timeline, messages, files, quote/payment card, and delivery area. The first request created through the public funnel opens automatically.

The admin workspace supports reviewing requests, setting quotes, replying, uploading deliverables, changing allowed statuses, and monitoring payments. All admin actions are server-authorized by Clerk role.

## Durable Backend

Clerk remains identity. Supabase PostgreSQL stores application data and Supabase Storage stores protected files. Express remains the only trusted public API boundary and verifies Clerk sessions before accessing Supabase with server credentials.

Core records are:

- `profiles`: Clerk-linked contact profiles.
- `service_requests`: briefs, academic details, quote totals, payment state, and current status.
- `request_events`: immutable status and audit timeline.
- `messages`: request-scoped client/admin conversation.
- `attachments`: request-scoped storage metadata, category, visibility, and delivery-lock state.
- `payments`: provider, milestone, provider transaction ID, amount, currency, and confirmed state.

Files use private storage. Clients receive short-lived signed URLs only after request membership and delivery-lock checks pass. Public URLs are not stored for private client documents.

## Request Status and Payment Rules

The allowed custom-service lifecycle is:

1. Draft
2. Submitted
3. Reviewing
4. Quoted
5. Deposit Due
6. In Progress
7. Ready for Review
8. Balance Due
9. Completed
10. Cancelled

The server enforces these invariants:

- A request cannot enter `In Progress` until a confirmed deposit equals at least 50 percent of the quoted total.
- The remaining balance becomes due when final work is ready.
- Final work and the AI-use report cannot be downloaded until confirmed payments cover the full quoted total.
- Messages and client-provided files remain available while payment is pending.
- Payment operations are idempotent and store provider transaction identifiers.
- Successful payment, status change, upload, and final download create audit events.

The existing Stripe card, Stripe Payment Request wallet, and PayPal integrations are reused behind authentication and attached to request/milestone records. Client success pages alone never establish payment truth; the server verifies provider results before changing request access.

## Error Handling and Security

- Every protected API returns `401` without a Clerk session and `403` for cross-account or role violations.
- Request fields are allowlisted, length-limited, and escaped at output boundaries.
- Uploads have explicit MIME, extension, and size rules and are renamed server-side.
- Payment amounts are calculated from server-owned quotes, never browser input.
- Duplicate handoff, message, and payment requests use idempotency keys.
- Failed uploads can be retried without duplicating completed uploads.
- Failed payments preserve the request and show a recoverable error.
- Final download URLs expire quickly and cannot be reused outside the authorized account.
- Production secrets remain outside Git.

## SEO and Accessibility

- Preserve current canonical URLs, metadata, JSON-LD, sitemap inclusion, analytics identifiers, and article URLs unless a requirement explicitly changes them.
- Remove all public pricing and package links without creating broken internal links.
- Keep utility pages `noindex`.
- Use semantic landmarks, one H1 per indexable page, labeled controls, keyboard operation, visible focus, adequate contrast, descriptive image alternatives, and reduced-motion support.

## Verification and Deployment

Each phase requires focused regression tests, the full local suite, a rendered desktop screenshot, a rendered mobile screenshot, and a clean diff check. Authentication, database, storage, and payment phases also require negative authorization and idempotency tests.

Before deployment:

1. Run the full test suite and live-check fixture tests.
2. Confirm `origin` is `Sleek-mx/sleekacademia`, the branch is correct, and the working tree contains the complete deploy payload.
3. Inspect `.cpanel.yml` and the webhook/live directory relationship.
4. Commit and push through Git.
5. Confirm the Namecheap webhook/Passenger deployment completed for the pushed commit.
6. Verify the public homepage, About, Blog, Store, signup funnel, Clerk login, protected dashboard, and `/api/health`.
7. Verify the exact removal of pricing/packages and the presence of the new mascot, logo, funnel, and dashboard behavior on `https://sleekacademia.com`.

The work is not live until the public URL proves the new behavior.

## Success Criteria

- The visual design matches the supplied vibrant references and uses the correct official logo and full-body mascot.
- Pricing and tutoring packages are absent from public navigation and pages.
- Store products and checkout still work.
- Every public service CTA ends in contact/signup and creates a prefilled dashboard request.
- Clerk authentication and account recovery work.
- Clients and admins can use persistent request threads, files, and statuses.
- A 50 percent deposit is required before work begins.
- The remaining 50 percent is required before final work and AI-report downloads unlock.
- About and Blog are fully redesigned, with custom article imagery.
- Desktop and mobile views are usable and accessible.
- The verified commit is live on Namecheap.
