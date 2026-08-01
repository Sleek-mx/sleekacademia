# PROGRESS — Site-wide chatbot ("Aria")

Goal: a floating, site-wide neumorphic chat widget on sleekacademia.com that answers
questions about the site from a curated knowledge base, captures leads, and hands off to
WhatsApp/email. Launcher is the brand mark, fixed bottom-right, animated, never scrolls.

## Decisions (locked with Max, 2026-08-01)
- Scope: **site guide + lead capture**. No clinical/tutoring answers — refuse server-side and hand off.
- Pages: every `public/*.html` **except** `antimicrobial-quiz`, `renal-cardiac-quiz`, `pharmacology-quiz`.
- Escalation: WhatsApp `254742836835` **and** Resend intake email to `macsinjobs@gmail.com`.

## Plan
1. Knowledge base (`src/chat/kb/*.md`) + loader
2. Backend `/api/chat` on Nemotron 3 Super
3. Widget CSS + JS (neumorphic, animated)
4. Inject into pages, retire old `chatbot.js`
5. Tests
6. Deploy + live verification

## Done
- [x] Recon — found existing `public/js/chatbot.js` (payment-success only, its `/css/chatbot.css`
      404s live), `/api/ai/chat` on `meta/llama-3.2-1b-instruct`, strict hash-pinned CSP,
      `src/quiz/nemotron.js` already proven in prod.
- [x] Spec — `.planning/specs/site-chatbot.md`
- [x] Phase 1 — KB (`src/chat/kb/*.md`) + `src/chat/knowledge.js`; prices interpolated from
      `DEFAULT_PRICING`, `pages:` lines drive the coverage test.
- [x] Phase 2 — `src/chat/prompt.js` + `src/chat/router.js`, mounted at `/api/chat` in server.js.
      Prompt tuned against the live model: it kept refusing to quote rates and refusing services
      Sleek Academia actually sells, so the prompt now carries the rates explicitly and separates
      "buying a service" from "asking Aria to do the work".
- [x] Phase 3 — `public/css/chat-widget.css` + `public/js/chat-widget.js`.
- [x] Phase 4 — `scripts/inject-chat-widget.mjs` injected the include into 28 pages (18 top level
      + 10 blog posts), quizzes excluded; retired `public/js/chatbot.js` and the dead
      `/css/chatbot.css` links.
- [x] Phase 5 — `test/site-chatbot.test.js`, 20 tests, all green. Full suite 332/333.
- [x] Local browser verification — launcher pinned, panel opens, live model answers, no console
      errors, mobile sheet correct, session persistence works.

## Next
- [ ] Phase 6: commit, push to `Sleek-mx/sleekacademia` main, wait for Vercel, verify the live URL.

## Known, not mine
`test/public-neumorphism.test.js` "workspace and dashboard pages remain isolated from the public
theme" fails on `onboard.html`, which loads `public-neumorphic.css`. Confirmed pre-existing by
stashing this branch's changes — unrelated to the chatbot.

## Facts a fresh session needs
- Repo: `~/Websites/Active Projects/sleek-academia-render`, remote `Sleek-mx/sleekacademia`.
  **Confirm with `git remote get-url origin` before pushing** — a sibling folder is a different repo.
- Production = **Vercel** (project `sleek-academia`). cPanel is fallback only, do not deploy there.
- Real pricing lives in `src/platform/pricing.js` (`DEFAULT_PRICING`): writing $15.00/page of 275
  words, six-hour urgent $16.50/page, exam assistance $150.00/whole hour, tutoring/other = custom
  quote. The old chatbot's "$400/month" plans were invented — do not reuse them.
- LLM: `nvidia/nemotron-3-super-120b-a12b` via `NVIDIA_API_KEY`, **must** send
  `chat_template_kwargs: { thinking: false }` or latency blows past the edge proxy.
- CSP script hashes are collected at boot from inline scripts (`collectInlineScriptHashes`).
  Keep all widget code in external files — no new inline `<script>`.
- Static CSS/JS is served `max-age=14400`; every widget asset URL must carry `?v=<date>` and a test
  enforces the two match.
- Local dev: `npm run dev` (port 3200 via launch config `sleek-academia-live-repo`). `ALLOWED_ORIGINS`
  must include `http://localhost:3200` or the origin guard 403s browser POSTs (curl hides this).
- Tests: `npm test` (`node --test test/*.test.js`).
