# Sleek Academia Neumorphic Workspace and Blog Refresh

Status: Approved by Max on 2026-07-13.

## Purpose

Correct the remaining usability and brand inconsistencies without changing the protected order, payment, delivery, revision, or tenant-isolation rules already implemented.

## Request form

- Replace the free-form subject field with a categorized subject/course select covering Nursing, Law, ICT, Finance, academic skills, and an `Other` path.
- Replace the free-form “What do you need help with?” field with a service-aware select. Keep a separate required instructions textarea so clients can provide the complete brief.
- Reveal a short custom field when either select uses `Other`; never prevent an uncommon course or request from being submitted.
- Explain exam hours as: “Assistance hours means the number of hours allocated to your exam. Exam assistance is billed at $150 per whole hour.”
- Replace MCX-facing public quote copy with: “Our team of experts will provide a custom quote after reviewing the complete scope and materials.”
- Keep server-authoritative pricing at $15 per 275-word page, $16.50 per urgent page, and $150 per whole exam hour.

## Unified login

- Present one normal sign-in surface with no visible role tabs or Client/Admin choice.
- Route the reserved `MCX` identifier to the isolated administrator authentication endpoint.
- Route all other identifiers through Clerk client authentication.
- Preserve uniform administrator failure messages, throttling, lockout, CSRF, secure cookie, and session rules.
- Preserve Google/client account creation as secondary client-only actions without exposing an administrator mode.

## Dashboard visual system

- Replace liquid glass on both authenticated workspaces with true neumorphism.
- Light surface: a cool light gray in the established Sleek palette, with cards using the same base color as the page and paired light/dark shadows.
- Night surface: black/charcoal, with same-color components and paired charcoal highlights/shadows; no translucent glass panels.
- Raised surfaces indicate resting cards and controls. Pressed/inset surfaces indicate selected navigation, inputs, filters, and active states.
- Use the canonical logo and restrained overlapping circles, dot clusters, and head-profile fragments as decorative background motifs.
- Use exact existing logo colors for accents and status cues. Maintain WCAG-readable text and visible keyboard focus.
- Keep theme persistence, reduced-motion behavior, responsive drawers, and all existing dashboard functionality.

## Dedicated order pages

- Dashboard order cards link to full pages rather than opening modal dialogs.
- Client order page sections: summary, instructions, status timeline, materials, messages, payments, delivery versions, download lock, revision eligibility, and policy.
- Admin order page sections: client/scope summary, materials, clarification and messaging, quote, acceptance and lifecycle commands, payments, deliveries, revisions, and audit timeline.
- Both pages reuse the existing role-isolated APIs. A client can only load their own order; the administrator boundary remains MCX-only.
- Dialog markup and dialog-opening code are removed after equivalent full-page coverage exists.

## Blog refresh

- Every listing card visibly includes category, title, useful summary, reading time/date, and a clear “Read more” link.
- Card text remains visible without hover and is not embedded inside artwork.
- Replace repetitive editorial collages with ten varied topic-specific illustrations. Subjects include clinical study, calendars, NCLEX judgment, bar-exam structure, CFA planning, cybersecurity, performance-based questions, burnout, and certification pathways.
- Artwork uses varied compositions but one recognizable Sleek Academia language: clean educational illustration, logo-derived overlapping shapes, and the canonical blue/teal/green/yellow/orange/pink/purple palette.
- Preserve existing article URLs, metadata, schema, filters, search, and social-image wiring.

## Verification gate

Completion requires automated tests, syntax and security checks, localhost restart, and live browser review of:

- onboarding selections, Other paths, estimates, validation, and request handoff;
- single login behavior for client and MCX paths;
- client/admin dashboards in light and night modes at desktop and mobile widths;
- client/admin dedicated order pages and every major order action;
- delivery lock before full payment, paid download, and revision rules;
- blog card text, filters, links, and varied imagery;
- keyboard focus, console errors, broken assets, and responsive overflow.

No push or production deployment is included. That remains gated on Max's explicit approval after localhost review.
