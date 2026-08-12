import { amountDueForMilestone, nextPaymentMilestone } from "./domain.js";

function clean(value, max = 200) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function getServerPaymentDue(request) {
  const calculated = nextPaymentMilestone(request);
  const milestone = calculated === "deposit" && request?.status === "Deposit Due"
    ? "deposit"
    : calculated === "balance" && new Set(["Balance Due", "Delivered"]).has(request?.status)
      ? "balance"
      : null;
  const amountCents = milestone ? amountDueForMilestone(request, milestone) : 0;
  return {
    milestone,
    amountCents,
    currency: clean(request?.currency, 12).toLowerCase() || "usd",
  };
}

export async function recordVerifiedPayment({
  store,
  request,
  provider,
  providerTransactionId,
  milestone,
  amountCents,
}) {
  if (!store?.available) throw new Error("Payment storage is unavailable.");
  const providerName = clean(provider, 40).toLowerCase();
  const transactionId = clean(providerTransactionId, 200);
  if (!providerName || !transactionId) throw new Error("Verified provider details are required.");

  const duplicate = await store.findPaymentByProviderId(providerName, transactionId);
  if (duplicate) {
    const current = await store.getRequestForUser(request.id, request.userId, { role: "admin" });
    return { request: current, payment: duplicate, duplicate: true };
  }

  const current = await store.getRequestForUser(request.id, request.userId, { role: "admin" });
  if (!current) throw new Error("The payment request no longer exists.");
  const due = getServerPaymentDue(current);
  if (!due.milestone || !due.amountCents) throw new Error("This request has no payment due.");
  if (milestone !== due.milestone) throw new Error("The verified payment milestone does not match the amount due.");
  if (!Number.isSafeInteger(amountCents) || amountCents !== due.amountCents) {
    throw new Error("The verified payment amount does not match the server-calculated amount due.");
  }

  const payment = await store.createPayment({
    requestId: current.id,
    userId: current.userId,
    provider: providerName,
    providerTransactionId: transactionId,
    milestone: due.milestone,
    amountCents: due.amountCents,
    currency: due.currency,
    status: "confirmed",
  });
  const paidCents = Math.min(current.quoteCents, (current.paidCents || 0) + due.amountCents);
  let status = current.status;
  if (due.milestone === "deposit" && current.status === "Deposit Due") status = "In Progress";
  const updated = await store.updateRequest(current.id, { paidCents, status });
  await store.appendEvent({
    requestId: current.id,
    actorId: `payment:${providerName}`,
    type: "payment.confirmed",
    data: { paymentId: payment.id, provider: providerName, milestone: due.milestone, amountCents: due.amountCents, status },
  });
  await store.createNotification({
    userId: current.userId,
    requestId: current.id,
    type: "payment.confirmed",
    title: due.milestone === "deposit" ? "Deposit confirmed" : "Balance confirmed",
    body: due.milestone === "deposit" ? "Work can now move into progress." : "Protected final delivery is now unlocked.",
  });
  return { request: updated, payment, duplicate: false };
}

// Card payment is Stripe only. PayPal was removed after the account was
// restricted; when Stripe is unconfigured the client checkout falls back to the
// manual MoneyGram-to-M-Pesa claim in client-router.js, which never marks an
// order paid on its own.
export function createPaymentProvider({
  stripeClient = null,
  stripeWebhookSecret = "",
} = {}) {
  return {
    stripeAvailable: Boolean(stripeClient),
    async createStripeIntent({ request, due }) {
      if (!stripeClient) throw new Error("Stripe is not configured.");
      const intent = await stripeClient.paymentIntents.create({
        amount: due.amountCents,
        currency: due.currency,
        automatic_payment_methods: { enabled: true },
        description: `Sleek Academia ${due.milestone} for request ${request.id}`,
        metadata: { requestId: request.id, userId: request.userId, milestone: due.milestone, amountCents: String(due.amountCents) },
      }, { idempotencyKey: `request:${request.id}:${due.milestone}:${due.amountCents}` });
      return { providerTransactionId: intent.id, clientSecret: intent.client_secret, milestone: due.milestone, amountCents: due.amountCents, currency: due.currency };
    },
    parseStripeWebhook(rawBody, signature) {
      if (!stripeClient || !stripeWebhookSecret) throw new Error("Stripe webhook verification is not configured.");
      return stripeClient.webhooks.constructEvent(rawBody, signature, stripeWebhookSecret);
    },
  };
}
