# Responsive Animated Public Heroes Design

**Status:** Approved by Max on 2026-07-14.

## Goal

Remove the excessive empty space in the Home hero, give the About and Blog hero typography room to breathe, and ensure every visible public-page woman illustration is animated for motion-enabled visitors without turning mobile into a scaled-down desktop layout.

## Root causes

- The Home hero uses a near-viewport minimum height, large symmetrical vertical padding, and centered grid alignment. At common laptop heights this places the content well below the top of the hero.
- The supplied animation is displayed in its full 16:9 frame. The source intentionally contains open space on the left, so the woman looks small when the entire frame is fitted inside a second 16:9 frame.
- The About and Blog display headings use `-0.075em` letter spacing and `0.94` line height, making large letters visually collide.
- About and Blog use the animation poster as a normal static image instead of using the approved MP4.

## Desktop composition

### Home

- Replace the viewport-filling hero geometry with content-led height, reduced top padding, and an approximately balanced split between copy and media.
- Increase the visual weight of the copy while keeping readable paragraph measure and aligned actions.
- Use a taller media frame and crop the MP4 from the right with `object-fit: cover` so the woman, books, and plants fill the visual panel instead of preserving the source's empty left region.
- Keep the neumorphic frame, exact Sleek Academia colors, and existing routes.

### About and Blog

- Change display heading tracking to approximately `-0.045em` and line height to approximately `1.02`.
- Balance headings and increase body-copy line height without enlarging the copy beyond a readable measure.
- Replace each hero poster with the silent looping MP4 while retaining the note cards above the moving artwork.
- Replace the secondary About woman illustration with the same animated treatment.

## Mobile composition

Mobile is a separate composition at `58rem` and below, not a proportional desktop shrink:

- Stack copy first and animation second with explicit section rhythm.
- Use a 4:3 animated frame with right-focused cropping so the character remains legible on a narrow screen.
- Use mobile-specific heading sizes, tracking, and line height.
- Present Home calls to action as full-width controls and preserve comfortable touch spacing.
- Reposition and reduce note cards so they remain inside the animation frame and do not cover the woman's face or writing hand.
- Remove viewport-height requirements so short and tall phones both flow naturally.

## Motion and accessibility

- Every motion-enabled public-page woman visual uses `/video/sleek-academia-woman-hero.mp4` with `autoplay`, `muted`, `loop`, and `playsinline`.
- Every animation has the approved WebP poster beneath it for loading resilience.
- The shared motion controller handles every `data-ambient-video` instance, not only the Home video.
- When `prefers-reduced-motion: reduce` is active, all ambient videos pause at the first frame and the static poster becomes visible.
- Existing descriptive alternative text remains available through the poster or the video label.

## Scope

### In scope

- Home hero layout and animation crop.
- About hero typography and both woman media panels.
- Blog hero typography and woman media panel.
- Shared responsive and reduced-motion behavior.
- Automated contracts and desktop/mobile browser verification.

### Out of scope

- Store hero structure, because it contains no woman illustration.
- Blog-card editorial illustrations, which are topic-specific artwork rather than the woman brand visual.
- Dashboard layout or animation.
- Production deployment.

## Verification

- New static contracts must fail before implementation and pass afterward.
- Full application, SEO, and security gates must remain green.
- Browser checks cover Home, About, and Blog at desktop and mobile widths.
- Browser checks confirm videos are playing under normal motion, paused with poster fallbacks under reduced motion, note cards stay in-frame, and no horizontal overflow appears.
