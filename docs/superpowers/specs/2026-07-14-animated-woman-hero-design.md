# Animated woman hero and browser icon design

Date: 2026-07-14  
Status: Approved in conversation

## Goal

Replace frog artwork with the supplied Sleek Academia woman illustration, correct the invisible Store hero button labels, and make Home, About, Blog, and Store feel like one neumorphic website. Preserve the current page content, analytics, SEO, commerce, and request flow. The standalone Sleek Academia woman-head mark must remain the browser-tab icon throughout the site.

## Approved visual direction

- Keep the current left-side headline, supporting copy, primary Get Started action, Store action, and support-area trust line.
- Replace the complete frog visual composition on the right with the supplied ten-second, 1920 by 1080 woman-illustration video.
- Remove the frog image, frog-specific preload, decorative checklist, book stack, orbs, sparks, and related unused styling from the homepage hero.
- Display the video as an illustration rather than a cinematic background: it stays in the right visual column, uses `object-fit: contain`, retains generous white space, and does not sit behind readable text.
- Preserve the exact woman, logo colors, books, plants, mug, and transparent-circle visual language shown in the supplied attachment and video.

## Shared public-site system

- Home is the canonical public theme: bright white canvas, floating raised navigation, soft paired shadows, rounded same-surface controls, Outfit display typography, and exact Sleek Academia logo colors.
- Replace the separate flat `platform-header` presentation on About, Blog, and Store with the same floating Home navigation structure, spacing, logo treatment, responsive menu, and active-page state.
- Keep each page's content and purpose, but apply the Home surface language to its hero, cards, filters, calls to action, and footer transitions so moving between pages no longer feels like entering another site.
- Use static HTML navigation on every page rather than injecting a shared header with JavaScript; this prevents layout flash, preserves SEO, and keeps navigation usable without scripts.
- Keep one shared implementation in the existing CSS system. Do not introduce a new framework or a third public visual theme.
- Remove every public-page frog reference. Home uses the woman video; About and Blog use the matching woman poster or a topic-relevant woman crop where illustration is needed. Store keeps its product-focused PDF artwork and does not add a character unnecessarily.

## Store button correction

- Root cause: `.platform-page a { color: inherit; }` has greater specificity than `.platform-button`, so the Store's dark hero makes both white buttons inherit white text.
- Fix the shared button contract at its source so labels keep explicit accessible contrast in every context instead of adding page-specific inline overrides.
- In the Store hero, use one branded blue-to-teal primary button with white text and one raised white secondary button with dark ink text.
- Preserve the visible labels `Browse materials` and `Visit Gumroad store`, their destinations, hover/pressed feedback, and keyboard focus rings.
- Add a regression test that fails if a hero button can resolve to white text on a white background or if either label disappears from the rendered surface.

## Playback and fallback behavior

- The homepage video autoplays, loops, plays inline, and is muted so modern browsers permit automatic playback.
- Browser controls remain hidden because this is a decorative hero animation, not editorial video content.
- Strip the supplied audio track from the web-delivery file; no audio is needed or exposed.
- Optimize the delivery copy for the web without changing the visible composition or animation timing.
- Generate a poster image from the supplied video so the woman appears immediately while the MP4 loads.
- The poster is also the no-video fallback.
- For `prefers-reduced-motion: reduce`, do not autoplay the animation; present the poster as the stable hero artwork.
- If video playback fails, the poster remains visible and the hero copy and actions continue to work.

## Responsive behavior

- Desktop and tablet keep the two-column hero with text on the left and the animated woman on the right.
- Mobile stacks the copy above the visual, keeps the woman fully visible without cropping, and avoids horizontal overflow.
- The media container uses an intrinsic 16:9 aspect ratio to prevent layout shift.
- The hero must remain usable before the video loads and under slow-network conditions.

## Browser-tab icon

- Use the canonical standalone woman-head mark from `public/images/brand/sleek-academia-mark.png` as the source identity.
- Preserve or regenerate the 32-pixel favicon and Apple touch icon from that mark, maintaining transparency and the exact logo colors.
- Ensure the homepage and every public, login, dashboard, and dedicated-order page reference the woman-head favicon.
- No frog artwork may appear in favicon, manifest, tab icon, social metadata, or homepage preload references.

## Accessibility and performance

- Treat the moving video as decorative because adjacent hero copy describes the page purpose; use an accessible visual-container label that identifies the Sleek Academia woman studying.
- Do not announce playback controls or duplicate the headline to assistive technology.
- Keep the poster meaningful if CSS or JavaScript is unavailable.
- Preload the poster rather than the full video. Load video metadata conservatively and avoid blocking first paint.
- Preserve existing semantic structure, one H1, focus behavior, reduced-motion rules, analytics identifiers, canonical metadata, and responsive navigation.

## Testing and acceptance criteria

1. The homepage contains the optimized supplied MP4 and its woman poster, with autoplay, muted, loop, and plays-inline behavior.
2. The old `sleek-frog-hero` reference and frog-specific markup are absent from Home, About, Blog, and Store.
3. Reduced-motion mode shows a stable woman poster without automatic animation.
4. Desktop and mobile browser tests show no clipping, layout shift, or horizontal overflow.
5. The woman-head favicon is visible in the browser tab and linked from all primary public and protected HTML surfaces.
6. Home, About, Blog, and Store use the same floating neumorphic navigation, typography, button hierarchy, canvas, and soft-shadow surface system with correct active-page states.
7. Store hero buttons visibly show `Browse materials` and `Visit Gumroad store` at desktop and mobile sizes with WCAG-readable contrast.
8. The homepage copy, Get Started route, Store route, Gumroad links, analytics, SEO, and dashboard entry points remain unchanged.
9. Automated tests, SEO tests, security checks, and browser console checks pass.
10. The localhost service remains available for review; this change is not pushed to Namecheap until Max separately approves deployment.
