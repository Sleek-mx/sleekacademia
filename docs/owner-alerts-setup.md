# Owner alerts — setup and what triggers each email

Every alert below goes to **one inbox**: `OWNER_NOTIFICATION_EMAIL`, which
defaults to `macsinjobs@gmail.com` when the variable is not set.

## What now sends an email

| Moment on the site | Alert subject starts with | Where it fires from |
|---|---|---|
| Someone creates an account | `New account —` | Clerk `user.created` webhook |
| Someone fills the wizard's contact step | `Order started (not submitted) —` | `POST /api/onboard-lead` |
| Someone submits an order | `New order submitted —` | order handoff route |
| Someone opens Stripe or PayPal checkout | `Checkout opened, not paid —` | payment-intent routes |
| A payment confirms | `Payment confirmed —` | Stripe webhook / PayPal capture |
| A card fails, or checkout is cancelled | `Payment not completed —` | Stripe webhook |

Abandonment is visible as a **missing follow-up**: an "Order started" with no
"New order submitted" after it means the visitor walked away, and a "Checkout
opened" with no "Payment confirmed" means they dropped at payment.

Repeat alerts for the same account, lead, order or transaction are suppressed
for 30 minutes. The suppression lives in process memory, so a serverless cold
start can let one repeat through. A repeat is harmless; a missed alert is not.

If no mail channel is configured (`RESEND_API_KEY`, or the `SMTP_*` trio) the
alerts are skipped with one warning in the logs. The site keeps working — no
signup, order or payment is ever blocked by a mail failure.

## One-time setup

### 1. Environment variables (Vercel)

Open **vercel.com** → project **sleek-academia** → **Settings** → **Environment
Variables**, and confirm these exist for **Production**:

| Name | Value |
|---|---|
| `RESEND_API_KEY` | the existing Resend key (already used by the quizzes) |
| `OWNER_NOTIFICATION_EMAIL` | `macsinjobs@gmail.com` |
| `CLERK_WEBHOOK_SIGNING_SECRET` | from step 2 below — starts with `whsec_` |

Save, then **Deployments** → the newest deployment → **⋯** → **Redeploy**, so
the running functions pick the variables up.

### 2. Clerk webhook

1. Go to **dashboard.clerk.com** and select the **Sleek Academia** application.
2. Left sidebar → **Configure** → **Webhooks**.
3. Click **Add Endpoint**.
4. **Endpoint URL**: `https://sleekacademia.com/api/webhooks/clerk`
5. Under **Subscribe to events**, tick **`user.created`** only.
6. Click **Create**.
7. On the endpoint's page, copy the **Signing Secret** (`whsec_…`) and paste it
   into `CLERK_WEBHOOK_SIGNING_SECRET` in Vercel (step 1), then redeploy.
8. Back on the endpoint page, use **Testing** → **Send Example** with
   `user.created` to confirm a `200` response and an email arriving.

Without the signing secret the endpoint answers `503` and sends nothing —
it never trusts an unsigned request.

### 3. Stripe events (only if Stripe is live)

The Stripe webhook already exists. In **dashboard.stripe.com** → **Developers**
→ **Webhooks** → the sleekacademia endpoint → **Update details**, make sure
these events are subscribed alongside `payment_intent.succeeded`:

- `payment_intent.payment_failed`
- `payment_intent.canceled`

Those two are what produce the "Payment not completed" alert.

## Checking it works later

```bash
curl -s -o /dev/null -w '%{http_code}\n' -X POST https://sleekacademia.com/api/webhooks/clerk
```

`401` means the endpoint is live and correctly refusing unsigned traffic.
`503` means `CLERK_WEBHOOK_SIGNING_SECRET` is missing from the environment.
