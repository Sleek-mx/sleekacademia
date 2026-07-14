# Animated woman hero and browser icon design

Date: 2026-07-14  
Status: Approved in conversation

## Goal

Replace the frog-based homepage hero artwork with the supplied animated Sleek Academia woman illustration while preserving the current high-performing hero copy, actions, navigation, analytics, SEO, and request flow. The standalone Sleek Academia woman-head mark must remain the browser-tab icon throughout the site.

## Approved visual direction

- Keep the current left-side headline, supporting copy, primary Get Started action, Store action, and support-area trust line.
- Replace the complete frog visual composition on the right with the supplied ten-second, 1920 by 1080 woman-illustration video.
- Remove the frog image, frog-specific preload, decorative checklist, book stack, orbs, sparks, and related unused styling from the homepage hero.
- Display the video as an illustration rather than a cinematic background: it stays in the right visual column, uses `object-fit: contain`, retains generous white space, and does not sit behind readable text.
- Preserve the exact woman, logo colors, books, plants, mug, and transparent-circle visual language shown in the supplied attachment and video.

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
2. The old `sleek-frog-hero` reference and frog-specific hero markup are absent from the homepage.
3. Reduced-motion mode shows a stable woman poster without automatic animation.
4. Desktop and mobile browser tests show no clipping, layout shift, or horizontal overflow.
5. The woman-head favicon is visible in the browser tab and linked from all primary public and protected HTML surfaces.
6. The homepage copy, Get Started route, Store route, analytics, SEO, and dashboard entry points remain unchanged.
7. Automated tests, SEO tests, security checks, and browser console checks pass.
8. The localhost service remains available for review; this change is not pushed to Namecheap until Max separately approves deployment.
