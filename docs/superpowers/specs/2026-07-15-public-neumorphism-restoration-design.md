# Sleek Academia Public Neumorphism Restoration

## Scope

Restore true neumorphism to the public Home, About, Blog, and Store pages only. Keep the authenticated dashboards, order pages, login, onboarding, backend, payments, content, animation, SEO metadata, routes, and JavaScript behavior unchanged.

## Visual system

The canonical source remains `public/css/neumorphism.css`:

- Page and component surface: `#e7e4f1`
- Lower-right shadow: `#c3bdd8`
- Upper-left highlight: `#ffffff`
- Primary text: `#372f52`
- Secondary text: `#6b6488`
- Accent gradient: `#702ae1` to `#9d6bff`
- Raised controls use paired outer shadows from one top-left light source.
- Selected navigation, inputs, filters, and subtle wells use paired inset shadows.
- Primary calls to action retain high-contrast white text on the purple accent gradient.

## Architecture

Add one public-only CSS layer, `public/css/public-neumorphic.css`, after `brand-v2.css` on the four public pages. This layer maps the existing public component classes to the approved soft-UI tokens. It does not replace the current HTML or JavaScript, so current content, animations, layout, accessibility, and responsive behavior remain intact.

## Component treatment

- Page background, navigation, mobile menu, footer, and section surfaces share the lavender base instead of white panels.
- Navigation, content cards, blog cards, store cards, hero media, notes, chips, filters, and secondary buttons become raised surfaces.
- Active navigation, search controls, category filters, and form controls become inset surfaces.
- Primary buttons keep the branded purple gradient and receive a neumorphic highlight/shadow treatment.
- Images and the animated woman video remain unchanged; only their containing surfaces receive depth.
- Hover, active, focus-visible, reduced-motion, and mobile behavior remain accessible and consistent.

## Non-goals

- No rollback to obsolete page markup.
- No changes to dashboard or workspace styles.
- No content, media, copy, SEO, analytics, route, API, authentication, or payment changes.
- No new dependency or framework.

## Verification

- A regression contract proves all four public pages load the public neumorphism layer after `brand-v2.css`, and that dashboard/login pages do not.
- The contract checks canonical tokens plus raised and inset shadow primitives.
- The full application, SEO, security, dependency, syntax, and diff gates must pass.
- Home, About, Blog, and Store must be inspected at desktop and mobile widths with navigation, buttons, animation, filters, and overflow checked.
- Deployment is verified against `https://sleekacademia.com` by exact public asset hashes and live browser inspection.
