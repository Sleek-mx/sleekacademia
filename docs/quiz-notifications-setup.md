# Quiz unlock notifications — setup

The code is deployed and live. It sends nothing until a mail channel works.
Check the current state any time:

```bash
curl -s -H 'user-agent: Mozilla/5.0' https://sleekacademia.com/api/patho-quiz/health | python3 -m json.tool
```

Look at the `notifications` block. `"channel": "resend"` means it is working.

## What it sends

| When | To | What |
|---|---|---|
| Someone completes a $10 unlock | you | Quiz, amount, buyer email, PayPal order + capture id |
| Same moment | the buyer | Confirmation plus a link that restores their access on another device |
| A capture call throws | you | "ACTION NEEDED" — money may have moved without an unlock being issued |

If the buyer's email fails, that failure and the buyer's link are both included in
your sale alert, so you can forward it by hand. A mail failure never blocks the
unlock itself — the learner is served first and email is attempted afterwards.

## Current state of the two channels

**Resend — not configured.** No `RESEND_API_KEY` is set. This is the chosen channel.

**SMTP — configured but broken, in two ways.** Both were verified on the server
on 2026-07-26:

1. `SMTP_HOST` is a `mail.<domain>` name that resolves to a **Cloudflare** IP.
   Cloudflare does not proxy SMTP, so the connection fails with `ENETUNREACH`.
   The working host from inside the server is `localhost`.
2. The password is genuinely wrong. Connecting to `localhost` on ports 25, 465
   and 587 all return `535 Incorrect authentication data`.

So SMTP would need a host change **and** a mailbox password reset. Because the
code prefers Resend whenever `RESEND_API_KEY` is set, fixing SMTP is optional —
you can leave it broken and it will simply never be reached.

> Note: `/health` reports `configured: true, channel: smtp` today because the
> `SMTP_*` variables exist. It cannot tell that the host is unreachable without
> making a network call on every health check. Treat "channel": "smtp" as
> **not working** until the two problems above are fixed.

## Setting up Resend

Resend requires you to verify one sending domain before it will send anything.
Free tier: 3,000 emails/month, 100/day, 1 custom domain — far more than a $10
quiz needs.

### 1. Create the account
Go to **resend.com** → **Sign up**. Free, no card.

### 2. Add the domain
1. In the Resend dashboard, left sidebar → **Domains** → **Add Domain**.
2. Type `sleekacademia.com` and confirm.
3. Resend now shows a table of DNS records to create. Leave this page open.

### 3. Put those records in Cloudflare
1. Go to **dash.cloudflare.com** → click **sleekacademia.com**.
2. Left sidebar → **DNS** → **Records**.
3. For each row Resend showed you, click **Add record** and copy it across
   exactly: the **Type**, the **Name**, and the **Value**.
4. **For any CNAME row, set Proxy status to "DNS only" (the cloud icon must be
   grey, not orange).** An orange cloud breaks mail — it is the same mistake that
   broke SMTP.
5. Click **Save** on each one.

### 4. Verify
Back in Resend → **Domains** → click your domain → **Verify DNS Records**.
It usually goes green in a few minutes. If it does not, wait and click again —
DNS can take up to an hour.

### 5. Create the API key
1. Resend → left sidebar → **API Keys** → **Create API Key**.
2. Name: `sleek-academia-quiz`. Permission: **Sending access**.
3. Click **Add**, then **copy the key** — it starts `re_` and is shown only once.
4. **Save it into the vault** (`08 - Credentials & Keys`). Do not paste it into a
   chat — transcripts keep it forever.

### 6. Add it to the live app
The site's environment variables are **not** in a file — they are in cPanel.

1. Log in to cPanel → **Software** → **Setup Node.js App**.
2. Find the app whose path is `public_html/sleekacademianewsite` → click the
   **pencil / Edit** icon.
3. Find the **Environment variables** section → **Add Variable**, once per row:

   | Name | Value |
   |---|---|
   | `RESEND_API_KEY` | the `re_…` key from step 5 |
   | `RESEND_FROM` | `Sleek Academia <noreply@sleekacademia.com>` |
   | `QUIZ_NOTIFY_EMAIL` | the inbox you want sale alerts in |

   `RESEND_FROM` must use the domain you verified in step 4, or Resend rejects
   the send. If `QUIZ_NOTIFY_EMAIL` is left out, alerts go to
   `NOTIFICATION_EMAIL` (currently `tutoring@sleekacademia.com`), then to the
   PayPal payee address.

4. Click **Save**, then **Restart** at the top of the page.

### 7. Confirm
```bash
curl -s -H 'user-agent: Mozilla/5.0' https://sleekacademia.com/api/patho-quiz/health | python3 -m json.tool
```
`notifications.channel` should now read `"resend"`, and `alertsTo` should be your
chosen inbox.

## The buyer's access link

The confirmation email contains a link shaped like:

```
https://sleekacademia.com/renal-cardiac-quiz#unlock=<token>
```

This is the fix for the quiz's one real limitation — a paid unlock lives in
browser storage, so clearing data or switching device previously lost it with no
way back.

- The token is in the URL **fragment**, never the query string, so it never
  reaches an access log, a proxy log or a `Referer` header.
- It is stripped from the address bar the moment it is used.
- It is scoped to one quiz. A link for one quiz will not unlock the other.
- A forged or expired link is rejected and the learner just sees the paywall.
- Treat the link like a receipt: anyone holding it has that person's access.
  To revoke every link ever issued you would rotate `QUIZ_SIGNING_SECRET`, which
  also invalidates **every** unlock already sold — so that is a last resort.
