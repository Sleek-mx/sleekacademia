# Sleek Academia Animated Hero Design

## Outcome

Turn the existing homepage hero into a subtle, premium 16:9 live animation while preserving the approved copy, logo, full-body mascot, service paths, accessibility, and page performance.

## Motion Direction

- The desktop hero behaves like a 16:9 cinematic stage; mobile keeps a natural stacked layout.
- The headline “A place where your professional journey begins.” types in once on page load, then remains fully readable.
- The mascot follows a calm repeating cycle: active typing, a short thinking pause with a raised chin-hand gesture, then typing again.
- Decorative plants sway gently as if moved by a light breeze.
- Color fields, dots, checklist, and book elements drift by only a few pixels so the page feels alive without becoming distracting.
- The cycle is roughly 12 seconds and uses eased, non-abrupt transitions.

## Technical Approach

Use browser-native HTML, CSS keyframes, and a small focused JavaScript controller. No paid service, video API, canvas renderer, runtime framework, or large animation dependency is required. The existing mascot remains a responsive WebP; the thinking gesture is a lightweight CSS overlay coordinated with the mascot cycle.

The headline remains present as real H1 text for search engines and assistive technology. JavaScript progressively decorates it for the typewriter reveal. If JavaScript fails or the user requests reduced motion, the complete headline and still hero remain visible.

## Accessibility and Performance

- `prefers-reduced-motion: reduce` disables the typewriter, plant sway, mascot loop, and ambient drift.
- Decorative motion is `aria-hidden` and never creates a focus target.
- The existing eager-loaded WebP remains the largest hero asset.
- Animation uses transforms and opacity to avoid layout thrashing.
- Mobile navigation, CTA links, analytics markers, and one-H1 semantics remain unchanged.

## Acceptance Criteria

- Desktop hero declares a 16:9 stage.
- The page loads `/js/hero-motion.js` with `defer`.
- The H1 exposes stable source text and a typewriter hook.
- Mascot typing/thinking state hooks, two plant groups, and ambient elements exist.
- Reduced-motion CSS freezes all new movement and shows the complete headline.
- Existing homepage and SEO tests continue passing.
- A real browser render shows no desktop or mobile overflow.
