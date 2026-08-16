# Sleek Academia commerce and onboarding completion design

## Goal

Turn the unfinished redesign into two clear, working journeys:

1. Learners experience useful quiz content, then buy deeper practice or downloadable study packs through Gumroad.
2. Service clients submit a scoped support request through a visually consistent four-step onboarding flow.

Production success requires payment delivery, not only attractive pages: Gumroad must notify the site, the site must issue quiz access, digital products must contain their promised files, and every changed flow must be exercised on the public domain.

## Approved product model

### Free layer

- Keep three interactive quiz previews as the primary free study tools.
- Antimicrobial and renal/cardiac expose questions 1–50; pharmacology exposes questions 1–30.
- Free users retain results and teaching value from the available range.
- Never require service onboarding or account creation to start free practice.

### Paid quiz layer

- Retain one Gumroad product, `QuizUnlock`, at $10.
- Each quiz checkout appends its stable `quiz_id`; Gumroad Ping returns that parameter to the webhook.
- After verified sale, server issues a quiz-scoped signed entitlement and emails the buyer an access link.
- Paywall appears only at the free boundary, explains the remaining question count, and offers an unobtrusive route back to free results.

### Paid download layer

- Retain nine existing Gumroad study-pack/PDF products and their current prices.
- Each product remains individually purchasable and delivered by Gumroad.
- Website cards link directly to the matching Gumroad permalink.
- Product metadata must truthfully match attached content. Empty products stay hidden from the redesigned storefront until fixed.
- Bundles are deferred until individual sales data exists.

## Information architecture

`/resources.html` becomes the primary “Study tools” storefront. It opens with three free-practice paths, then presents paid study packs grouped by subject. Free/paid labels, prices, question counts, and delivery format are visible before a click. `/store.html` remains available for existing links and search indexing, but its main navigation and cross-links point visitors toward Study tools.

`/onboard.html` serves only custom academic-support requests. Study-resource links never enter this wizard. The flow remains four stages—support type, brief, contact, secure review—so existing API payloads and Clerk handoff behavior remain intact.

## Visual direction

Reuse the approved “online college under glass” language rather than introduce another theme.

- Ink: `#14181f`
- Body: `#4a5567`
- Paper: `#faf7f1`
- Sky: `#d3e3ef`
- Cobalt action: `#3457d5`
- Spectrum accents: existing coral through violet tokens, used for taxonomy and progress only
- Display type: Archivo 800/900
- Body type: Plus Jakarta Sans 500–800
- Utility labels and prices: Plus Jakarta Sans with tabular numerals

Signature: a desk-like study path. Free quiz cards look like active practice sheets; paid download cards look like compact course-pack covers. Spectrum color encodes subject/category, not decoration.

Onboarding uses the same photographic bands and glass panel, with a compact sticky “what happens next” rail and one focused step at a time. Motion is limited to progress, hover, and step transitions and respects reduced-motion preferences.

## Data and code boundaries

- `src/data/store-products.js` remains source of truth for paid Gumroad products.
- Quiz title, counts, free ranges, and unlock price come from `src/quiz/quizzes.js`.
- `scripts/build-resources-page.mjs` renders product and quiz markers in `public/resources.html` so visible copy cannot drift from source data.
- `public/js/study-tools.js` owns filtering only; it never owns product prices or URLs.
- Existing `public/js/quiz-engine.js` continues building Gumroad checkout URLs.
- Existing `src/platform/http.js` continues processing `QuizUnlock` Ping sales.
- Onboarding keeps current element ids and form names; new HTML/CSS is presentational and accessibility-focused.

## Gumroad configuration

- Set Ping to the production webhook URL with the existing Vercel secret as query key.
- Add truthful Quiz Unlock product description, branded cover, receipt button text, and receipt message explaining email delivery.
- Audit each visible PDF product for at least one attached deliverable, a description, a cover/thumbnail, price, refund policy, and published/profile-visible state.
- Do not expose credentials, seller identifiers, banking information, or webhook secrets in code, screenshots, commits, or chat.

## Failure handling

- A quiz sale with missing or unknown `quiz_id` remains rejected and does not mint access.
- Duplicate sale ids remain idempotent.
- Quiz paywall states that access arrives by email and includes a support route if it does not.
- Store links remain usable when JavaScript is unavailable; filters progressively enhance static markup.
- Onboarding validation stays inline and preserves entered data between steps.

## Verification

- Add static contract tests for storefront source-of-truth markers, three free quizzes, nine paid products, direct Gumroad links, and removal of fake resource-to-onboarding links.
- Add onboarding visual-contract tests for glass theme, semantic four-step progress, service-only language, and preserved ids/API hooks.
- Run focused tests red then green, full `npm test`, store schema check, security check, and local browser click-through at desktop/mobile sizes.
- Send Gumroad test Ping after configuration and confirm accepted response without exposing URL secret.
- Commit and push through the canonical GitHub remote; verify the public Vercel domain contains the new markers and manually click every changed public flow.
