# Transcript: Sleek Academia Redesign and Dashboard Planning

Date: 2026-07-13
Branch: `feature/phase-1-foundation-home`
Duration: multi-turn planning and Phase 1 implementation

## Summary

The Sleek Academia repository was restored, audited, and given a new brand foundation plus a static Vibrant Academic Studio homepage. The user locked a signup-first service flow, a Clerk/Supabase dashboard, existing payment reuse, 50/50 custom-service gates, and Namecheap deployment only after a complete localhost review.

## Key Decisions

- Public service CTAs end in contact/signup; only Store checkout remains public.
- Clerk handles authentication; Express remains the security boundary; Supabase handles durable data and private files.
- Clients pay 50% before work starts and the balance before final download.
- Final essay/report delivery includes an AI-use report.
- Public pages are colorful and mascot-led; dashboard is calmer and professional.
- Hero stays static; motion is limited to restrained website transitions inspired by 21st.dev.

## Failed Approach

- A live CSS/JavaScript hero animation added a typewriter headline, fake mascot thinking arm, moving plants, and drifting shapes. Max strongly rejected it. Commits `b324022` and `fc055df` were reverted by `718a924` and `4071e81`.

## Discoveries

- The project is Express plus static HTML/CSS/JS, not React.
- Existing public onboarding contains payment code that conflicts with the approved dashboard-only custom-service payment flow.
- Namecheap deploy uses a Git-triggered workflow with destructive `rsync --delete`; local success is not proof of deployment.
- The full-body mascot and official logo assets are already installed under `public/images/brand/`.

## Search Keywords

Sleek Academia, feature/phase-1-foundation-home, brand-v2.css, signup-first, Clerk, Supabase, 50 percent deposit, final download gate, AI-use report, 21st.dev, rejected hero animation, b324022, 718a924, Namecheap, rsync --delete
