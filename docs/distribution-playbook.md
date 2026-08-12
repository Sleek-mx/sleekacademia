# Getting the quizzes in front of nursing students

The site now converts better than it did, but conversion only matters if people
arrive. This is the distribution side: where to put the free question banks, in
what form, and how to tell what worked.

**You post these, not Claude.** Every community below bans accounts that show up
only to drop links, and a ban is hard to undo. Read the current rules of any
community before your first post there — they change, and the ones below were
last checked by hand.

## What you are actually distributing

Not "tutoring services". The free half of a question bank, which needs no
account and no payment:

| Quiz | Free | Link |
|---|---|---|
| Antimicrobial pharmacology (NURS 5334) | 50 questions | https://sleekacademia.com/antimicrobial-quiz.html |
| Renal, urologic & cardiac patho (NURS 5315) | 50 questions | https://sleekacademia.com/renal-cardiac-quiz.html |
| Pharmacology final review (NURS 5334) | 30 questions | https://sleekacademia.com/pharmacology-quiz.html |

Everything else — writing help, exam assistance — is what a fraction of those
visitors buy later. Lead with it and you get removed as an essay mill.

## Use tagged links, always

Paste the plain link and the visit lands in GA as "direct", which tells you
nothing. Add the tags:

```
https://sleekacademia.com/antimicrobial-quiz.html?utm_source=reddit&utm_medium=comment&utm_campaign=quiz_seed
```

Change `utm_source` per platform (`reddit`, `facebook`, `tiktok`, `discord`,
`whatsapp`) and `utm_medium` per placement (`comment`, `post`, `bio`,
`group_share`). Keep `utm_campaign=quiz_seed` for everything you post by hand,
so it stays separable from `quiz_share`, which is what students who use the
in-quiz share button generate on their own.

Check results in GA4 → Reports → Acquisition → Traffic acquisition, then look at
the `quiz_shared` and `contact_whatsapp_click` events to see whether the traffic
did anything once it arrived.

## Where, and how to behave there

**Reddit** — r/StudentNurse, r/NCLEX, r/nursing, r/nursingstudent.
Most of these remove self-promotion on sight. The pattern that survives: answer
questions properly for a couple of weeks with no links at all, then link only
where it directly answers what was asked ("here are 50 free antimicrobial
questions with rationales — the second half is paid, mentioning it so nobody
feels tricked"). Disclose that you built it. Never post the same link in three
subs the same day.

**Facebook groups** — nursing school cohort groups, NCLEX study groups.
Higher tolerance than Reddit, and closer to how students actually organise. Join,
answer for a week, then post a genuinely useful thing (a topic breakdown) with
the quiz link at the end. Admins remove links posted by day-one members.

**TikTok** — you already have @sleek_e_learn.
This is the one channel where promotion is the format. One question on screen,
15 seconds of reasoning, the answer, then "the other 49 are free on the site,
link in bio". Bio link should carry `utm_source=tiktok&utm_medium=bio`. Post
volume matters far more than production quality here.

**WhatsApp** — cohort group chats.
The highest-converting channel and the reason the quiz pages now have a share
button and link previews. You cannot join these yourself; students bring the
link in. Every student who finishes the free half sees "Know someone in your
cohort?" — that is the loop. Ask satisfied buyers directly to pass it on.

**University-adjacent** — course Discords, Slack groups, class GroupMe.
Same rule as Facebook: be a person there first.

## Ready copy

Adapt these; posting them verbatim across several communities reads as spam.

**Reddit comment, when someone asks for practice questions**

> I built a free antimicrobial question bank for my own NURS 5334 revision and
> put it online — 50 questions, full rationales on every answer, no signup:
> [link]. Being upfront: the second 50 are $10, and the free half is genuinely
> the full experience, not a trailer.

**Facebook group post**

> Made a thing for anyone sitting pharm this term. 50 free practice questions
> with the reasoning written out for every option — including why the wrong ones
> are wrong, which is the part most banks skip. No account needed: [link]
> Happy to answer questions on any of them in the comments.

**TikTok caption**

> 50 more like this, free, no signup. Link in bio. #nursingstudent #nclex #pharmacology

**Message to a past buyer**

> Hey — if the question bank helped, would you drop it in your cohort chat?
> There's a share button at the end of the free half. No pressure either way.

## Cadence that does not get you banned

- Week 1: join and answer only. No links anywhere.
- Week 2: one link, in the single most relevant thread you can find.
- Week 3 onward: at most two posts a week per community, always answering
  something real.
- TikTok is exempt — post daily if you can.

## What to check after two weeks

1. GA4 traffic acquisition by `utm_source` — which platform sent people at all.
2. `quiz_shared` events — whether students are passing it on unprompted. If this
   is above zero the loop works and the honest move is to feed it more.
3. `contact_whatsapp_click` and `contact_message_sent` — whether the traffic
   turned into conversations.
4. Google Search Console — the quiz pages were `noindex` until 2026-08-12, so
   impressions starting from zero are expected. Submit the sitemap if you have
   not.

If a platform sends traffic that never converts, drop it rather than posting
harder. If nothing converts anywhere, the problem is upstream of distribution
and we look at the quiz-to-paid step instead.
