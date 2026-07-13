# Sleek Academia localhost review

This checkpoint is intentionally local only. No GitHub push, Namecheap sync, or production-provider transaction is part of this review.

## Start the app

From this worktree:

```bash
LOCAL_DEMO_MODE=1 PORT=4173 npm start
```

Open `http://localhost:4173/`.

`LOCAL_DEMO_MODE=1` works only on loopback hosts. It supplies a seeded client workspace, an admin/client role switch, and clearly labeled payment simulation buttons without exposing a demo identity on a remote host.

## Review paths

- Public pages: `/`, `/about.html`, `/blog.html`, and `/store.html`
- Request wizard: `/onboard.html`
- Authentication previews: `/sign-up.html` and `/login.html`
- Workspace: `/dashboard.html`

## End-to-end demo

1. Start a request from the homepage and complete the service, brief, and contact steps.
2. The request is handed off once into the client workspace.
3. Select **View as admin**, enter a quote, and apply it. The request becomes **Deposit Due**.
4. Return to the client view, open **Payments**, and use the localhost deposit simulation. The request becomes **In Progress**.
5. In admin view, move the request through **Ready for Review** to **Balance Due**.
6. Return to client view and simulate the balance confirmation. The server marks the request **Completed**.
7. Open the seeded completed request, **Quality improvement briefing**, then open **Files**. Final work and the AI-use report are available only after full payment.

The application owns quote and milestone amounts on the server. Browser-supplied payment amounts are not trusted. Stripe and PayPal use provider-confirmed production flows when configured; only the loopback demo exposes simulation.

## Production readiness boundary

Before a Namecheap launch, configure and verify Clerk, Supabase (including the private `sleek-academia-private` bucket), Stripe and/or PayPal, production environment values, the GitHub remote, the webhook build, and the final public URL. The repository's deployment path includes `rsync --delete`, so its source and destination must be verified immediately before any push.
