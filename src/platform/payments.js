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

function parsePayPalCustomId(value) {
  const [requestId, milestone, amount] = clean(value, 500).split(":");
  const amountCents = Number(amount);
  if (!requestId || !new Set(["deposit", "balance"]).has(milestone) || !Number.isSafeInteger(amountCents)) {
    throw new Error("PayPal returned invalid request metadata.");
  }
  return { requestId, milestone, amountCents };
}

export function createPaymentProvider({
  stripeClient = null,
  stripeWebhookSecret = "",
  paypalClientId = "",
  paypalSecret = "",
  paypalBaseUrl = "https://api-m.sandbox.paypal.com",
  fetchImpl = globalThis.fetch,
} = {}) {
  async function paypalToken() {
    if (!paypalClientId || !paypalSecret) throw new Error("PayPal is not configured.");
    const response = await fetchImpl(`${paypalBaseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${paypalClientId}:${paypalSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    const payload = await response.json();
    if (!response.ok || !payload.access_token) throw new Error("PayPal authorization failed.");
    return payload.access_token;
  }

  return {
    stripeAvailable: Boolean(stripeClient),
    paypalAvailable: Boolean(paypalClientId && paypalSecret),
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
    async createPayPalOrder({ request, due }) {
      const token = await paypalToken();
      const response = await fetchImpl(`${paypalBaseUrl}/v2/checkout/orders`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "PayPal-Request-Id": `request-${request.id}-${due.milestone}-${due.amountCents}` },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [{
            custom_id: `${request.id}:${due.milestone}:${due.amountCents}`,
            description: `Sleek Academia ${due.milestone}`,
            amount: { currency_code: due.currency.toUpperCase(), value: (due.amountCents / 100).toFixed(2) },
          }],
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.id) throw new Error("PayPal order creation failed.");
      return { orderId: payload.id, milestone: due.milestone, amountCents: due.amountCents, currency: due.currency };
    },
    async capturePayPalOrder(orderId, { requestId, due }) {
      const token = await paypalToken();
      const orderResponse = await fetchImpl(`${paypalBaseUrl}/v2/checkout/orders/${encodeURIComponent(clean(orderId, 200))}`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      const order = await orderResponse.json();
      const orderMetadata = parsePayPalCustomId(order.purchase_units?.[0]?.custom_id);
      const orderedCurrency = clean(order.purchase_units?.[0]?.amount?.currency_code, 12).toLowerCase();
      if (!orderResponse.ok || orderMetadata.requestId !== requestId || orderMetadata.milestone !== due.milestone || orderMetadata.amountCents !== due.amountCents || orderedCurrency !== due.currency) {
        throw new Error("PayPal order does not match this request's server-calculated payment.");
      }
      const response = await fetchImpl(`${paypalBaseUrl}/v2/checkout/orders/${encodeURIComponent(clean(orderId, 200))}/capture`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      const payload = await response.json();
      const unit = payload.purchase_units?.[0];
      const capture = unit?.payments?.captures?.[0];
      if (!response.ok || payload.status !== "COMPLETED" || capture?.status !== "COMPLETED") {
        throw new Error("PayPal did not confirm this payment.");
      }
      const metadata = parsePayPalCustomId(unit.custom_id);
      const capturedCents = Math.round(Number(capture.amount?.value) * 100);
      const capturedCurrency = clean(capture.amount?.currency_code, 12).toLowerCase();
      if (capturedCents !== metadata.amountCents || capturedCurrency !== due.currency) throw new Error("PayPal confirmed an unexpected amount or currency.");
      return { ...metadata, providerTransactionId: capture.id, currency: clean(capture.amount?.currency_code, 12).toLowerCase() };
    },
  };
}
