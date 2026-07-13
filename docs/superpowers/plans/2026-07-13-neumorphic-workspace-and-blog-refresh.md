# Neumorphic Workspace and Blog Refresh Implementation Plan

**Goal:** Deliver the approved form, login, dashboard, order-page, and blog refresh while preserving the secure platform boundaries.

**Architecture:** Extend the current static Express frontend and existing role-isolated JSON APIs. Keep backend domain and payment rules intact. Introduce shared frontend modules for order-page rendering and a shared neumorphic dashboard stylesheet.

## Tasks

1. Add UI contract tests for the new form fields, unified login, dedicated order pages, blog content hierarchy, and removal of dashboard dialogs.
2. Implement categorized subject and help-type selects, Other-field behavior, instructions capture, revised exam explanation, and neutral expert quote copy.
3. Replace visible login modes with a single identifier/password surface that dispatches MCX to admin auth and clients to Clerk, retaining local-demo review behavior.
4. Build a shared light/night neumorphic dashboard design system with exact brand accents, decorative logo motifs, accessible states, and responsive behavior.
5. Convert client order details to a dedicated protected page and update all client order links/navigation.
6. Convert admin order details and commands to a dedicated protected page and update all admin order links/navigation.
7. Strengthen blog card text hierarchy and regenerate/install ten distinct topic-specific brand illustrations.
8. Run the full application, SEO, security, dependency, syntax, and diff gates.
9. Restart the persistent localhost service and live-test all specified desktop/mobile flows in the browser.
10. Update `PROGRESS.md` and `docs/local-review.md` with evidence and perform a final security/accessibility/diff review.
