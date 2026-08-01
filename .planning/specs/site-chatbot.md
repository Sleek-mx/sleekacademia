# Spec — Site-wide chatbot ("Aria")

Status: approved 2026-08-01

## Problem

`public/js/chatbot.js` exists but is loaded on one page (`payment-success.html`), its stylesheet
`/css/chatbot.css` was never committed (404 in production), it ships its whole system prompt to the
browser, it runs on a 1B model, and the "$400/month / $350/month" plans it quotes do not exist
anywhere in the product. Visitors have no way to ask a question on the site.

## Goal

A single floating assistant, present on every public page, that:

1. answers questions about Sleek Academia from a curated, version-controlled knowledge base;
2. never answers academic/clinical questions itself — it routes those to a human;
3. captures an enquiry (name, field, timing, scope) and delivers it by email and/or WhatsApp;
4. looks and moves like the rest of the site (neumorphism), pinned bottom-right, never scrolling.

## Users

Prospective students landing on the marketing pages, mostly on mobile, mostly outside working hours.

## Functional requirements

### Knowledge
- FR1. Facts live in `src/chat/kb/*.md`, compiled at boot into one system context. No vector store.
- FR2. Prices are interpolated from `src/platform/pricing.js` at build time so the bot can never
  quote a stale rate.
- FR3. A test fails if a public page (excluding utility/auth/admin pages) is not covered by the KB.

### Conversation
- FR4. `POST /api/chat` takes `{ messages }` only. The system prompt and KB stay server-side.
- FR5. History is capped at 12 turns and 4000 characters per message server-side.
- FR6. The model is `nvidia/nemotron-3-super-120b-a12b` with `thinking: false`, `max_tokens` 400.
- FR7. Out-of-scope requests (coursework answers, clinical/medical/legal/financial advice, quiz
  answers, "do my assignment") get a fixed refusal plus a handoff, enforced in the system prompt
  **and** by a server-side pre-check on the user's message.
- FR8. When the model has collected name + field + timing + scope it emits `[READY_TO_SEND]`;
  the widget then offers Email and WhatsApp buttons.
- FR9. `POST /api/chat/send-summary` emails the enquiry via Resend (existing route, reused).
- FR10. `GET /api/chat/health` reports `{ ok, model, configured, kbBytes }`.
- FR11. If `NVIDIA_API_KEY` is missing or the upstream fails twice, the widget degrades to a static
  handoff card (WhatsApp + email + "start a request") rather than an error.

### Widget
- FR12. Launcher = `/images/brand/sleek-academia-mark.webp` in a round neumorphic button,
  `position: fixed; right; bottom`, above all content, unaffected by scroll.
- FR13. Idle animation: slow float + soft pulse ring. Hover: raise. Open: spring scale from the
  launcher's corner. Messages: stagger fade-up. Typing: three-dot pulse.
- FR14. All motion is compositor-only (`transform`/`opacity`) and disabled under
  `prefers-reduced-motion: reduce`.
- FR15. Mobile (`<=560px`): full-width bottom sheet honouring `env(safe-area-inset-*)`.
- FR16. Accessible: `role="dialog"`, labelled, focus moved on open, `Esc` closes, focus returns to
  the launcher, `aria-live="polite"` message log.
- FR17. Conversation persists in `sessionStorage` under `sleek.chat.v1` so navigation does not reset it.
- FR18. Loaded on every `public/*.html` except the three quiz pages.

## Non-functional

- NFR1. No new inline scripts (CSP hashes are collected at boot).
- NFR2. Asset URLs carry `?v=` matching a constant in the JS; a test enforces it.
- NFR3. Widget CSS is self-scoped under `#sa-chat-root` and defines its own tokens, because pages
  use four different stylesheets (`public-neumorphic`, `neumorphism`, `workspace-v2`,
  `dashboard-neumorphic`).
- NFR4. Rate limited with the existing `rateLimiters.platform`.
- NFR5. $0 running cost — reuses the provisioned `NVIDIA_API_KEY`.

## Out of scope

- Tutoring or answering study questions.
- Any presence on the three paid quiz pages.
- Retrieval/embeddings, chat transcripts storage, authentication.

## Acceptance

- `npm test` green, including the new `test/site-chatbot.test.js`.
- Live `https://sleekacademia.com/api/chat/health` returns `ok: true`.
- Live homepage screenshot shows the launcher pinned bottom-right and the panel open.
- The three quiz pages do **not** include the widget.
