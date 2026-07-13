# Sleek Academia localhost review

This checkpoint is intentionally local only. No GitHub push, Namecheap sync, or production-provider transaction is part of this review.

## Start the app

From this worktree:

```bash
LOCAL_DEMO_MODE=1 PORT=3000 npm start
```

Open `http://localhost:3000/`.

`LOCAL_DEMO_MODE=1` works only on loopback hosts. It supplies deterministic, non-personal client and admin workspaces plus clearly labeled Stripe/PayPal confirmation simulations. A non-loopback `Host` header cannot use the demo identity or admin API.

## Review paths

- Public site: `http://localhost:3000/`
- Four-step request wizard: `http://localhost:3000/onboard.html`
- Unified role-neutral login: `http://localhost:3000/login.html`
- Clerk client workspace preview: `http://localhost:3000/dashboard.html`
- MCX administrator workspace preview: `http://localhost:3000/admin.html`
- Dedicated client order example: `http://localhost:3000/client-order.html?id=demo-order-delivered`
- Dedicated admin order example: `http://localhost:3000/admin-order.html?id=demo-order-available`

Both dashboards use same-surface light/night neumorphism. In loopback demo mode, enter any email and password for the seeded client workspace, or enter `MCX` with any non-empty password for the seeded administrator workspace. Production uses the isolated Clerk client and hardened MCX credential boundaries and never accepts demo credentials.

## What to review

### Public site and login

1. Confirm the public pages retain the Sleek Academia neumorphic theme, official mark, exact palette, and constrained footer lockup.
2. Resize the homepage and confirm there is no horizontal overflow or oversized footer artwork.
3. Open the login page and confirm there is one normal credential form with no visible role switch. An email routes to the client workspace; the exact `MCX` identifier routes to the separate administrator boundary.

### MCX administrator workspace

1. Open `/admin.html` and review **Overview**, **Orders**, **Clients**, **Messages**, **Payments**, **Earnings**, **Files**, and **Settings**.
2. In **Orders**, inspect the seeded Available, Needs Clarification, In Progress, Delivered, Revision Requested, and Completed examples.
3. Open an order and confirm it navigates to its own protected page, where instructions, materials, immutable pricing, payments, messages, delivery versions, revision history, and allowed lifecycle actions are not cramped into a popup.
4. Confirm the earnings view counts confirmed Stripe/PayPal transactions only. There is no manual, offline, or M-Pesa paid override.

### Client workspace and payment gate

1. Open `/dashboard.html`, then review **My Orders**, **Messages**, **Files**, **Payments**, **Profile**, and **Help**.
2. Filter **My Orders** to **Delivered** and open **Quality improvement briefing**. It opens its own order page; the final filename and delivery metadata are visible, but the download is disabled while the $37.50 balance remains.
3. Filter to **Completed** and open **Completed research summary**. It is fully paid and exposes **Download**.
4. The one included revision remains unavailable until the first paid download. That download atomically starts its seven-day request window; a second included revision becomes additional work.

## Pricing and lifecycle contracts

- Writing: $15.00 per 275-word page.
- Six-hour urgent writing: $16.50 per page.
- Exam assistance: $150.00 per whole hour.
- Server-owned 50 percent deposit before work starts; full provider-confirmed payment before final download.
- Delivered work can remain visible but locked. The lifecycle includes clarification, acceptance, deposit due, in progress, delivered, revision requested/in revision, redelivery, and completion.

## Production readiness boundary

Before a Namecheap launch, configure and verify Clerk, Supabase (including the private `sleek-academia-private` bucket), the MCX password hash, Stripe and/or PayPal, production environment values, the GitHub remote, the webhook build, and the final public URL. MCX MFA remains explicitly deferred. The repository's deployment path includes `rsync --delete`, so its complete source and exact destination must be reverified immediately before any push.
