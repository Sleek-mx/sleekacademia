import assert from "node:assert/strict";
import { after, before, beforeEach, test } from "node:test";

import express from "express";

import { createPlatformRouter } from "../src/platform/http.js";
import { MemoryPlatformStore } from "../src/platform/memory-store.js";
import { getServerPaymentDue, recordGumroadPayment, recordVerifiedPayment } from "../src/platform/payments.js";

let server;
let baseUrl;
let store;
let request;
const paymentProvider = {
  stripeAvailable: true,
  async createStripeIntent({ due }) { return { providerTransactionId: "pi_created", clientSecret: "secret", ...due }; },
};

function resolveIdentity(req) {
  const userId = req.get("x-test-user");
  if (!userId) return null;
  return {
    userId,
    role: req.get("x-test-role") || "student",
    email: `${userId}@example.com`,
    fullName: userId,
    demo: req.get("x-test-demo") !== "false",
  };
}

async function api(path, { user = "client", role = "student", demo = true, body } = {}) {
  return fetch(`${baseUrl}/api/platform${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-test-user": user,
      "x-test-role": role,
      "x-test-demo": String(demo),
    },
    body: JSON.stringify(body || {}),
  });
}

before(async () => {
  const app = express();
  app.use(express.json({ limit: "12mb" }));
  app.use("/api/platform", (req, _res, next) => { req.platformStore = store; next(); });
  app.use("/api/platform", createPlatformRouter({ resolveIdentity, paymentProvider }));
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => server?.close());

beforeEach(async () => {
  store = new MemoryPlatformStore();
  await store.upsertProfile({ userId: "client", role: "student", email: "client@example.com", fullName: "Client" });
  request = await store.createRequest({
    userId: "client",
    idempotencyKey: "payment-request",
    service: "essay",
    subject: "Nursing",
    description: "Brief",
    name: "Client",
    email: "client@example.com",
    status: "Deposit Due",
    quoteCents: 24000,
    paidCents: 0,
  });
});

test("payment amount and milestone come only from the stored request", () => {
  assert.deepEqual(getServerPaymentDue(request), { milestone: "deposit", amountCents: 12000, currency: "usd" });
  assert.notEqual(getServerPaymentDue(request).amountCents, 1);
});

test("provider order creation ignores browser amounts and enforces membership", async () => {
  const stripe = await api(`/requests/${request.id}/payments/stripe-intent`, { body: { amountCents: 1 } });
  assert.equal(stripe.status, 201);
  assert.equal((await stripe.json()).amountCents, 12000);

  const forbidden = await api(`/requests/${request.id}/payments/stripe-intent`, { user: "other", body: { amountCents: 1 } });
  assert.equal(forbidden.status, 404);
});

test("unverified or amount-mismatched payments cannot mutate request totals", async () => {
  await assert.rejects(
    recordVerifiedPayment({ store, request, provider: "stripe", providerTransactionId: "pi_bad", milestone: "deposit", amountCents: 1 }),
    /amount/i,
  );
  const unchanged = await store.getRequestForUser(request.id, "client");
  assert.equal(unchanged.paidCents, 0);
  assert.equal((await store.listPayments(request.id)).length, 0);
});

test("verified deposit is idempotent and moves work into progress", async () => {
  const first = await recordVerifiedPayment({ store, request, provider: "stripe", providerTransactionId: "pi_deposit", milestone: "deposit", amountCents: 12000 });
  assert.equal(first.request.paidCents, 12000);
  assert.equal(first.request.status, "In Progress");
  assert.match(first.payment.confirmedAt, /^\d{4}-\d{2}-\d{2}T/);

  const duplicate = await recordVerifiedPayment({ store, request: first.request, provider: "stripe", providerTransactionId: "pi_deposit", milestone: "deposit", amountCents: 12000 });
  assert.equal(duplicate.duplicate, true);
  assert.equal((await store.listPayments(request.id)).length, 1);
});

test("verified balance unlocks protected final delivery without auto-completing the order", async () => {
  const deposit = await recordVerifiedPayment({ store, request, provider: "demo", providerTransactionId: "demo-deposit", milestone: "deposit", amountCents: 12000 });
  const balanceDue = await store.updateRequest(request.id, { status: "Balance Due" });
  const paid = await recordVerifiedPayment({ store, request: balanceDue, provider: "demo", providerTransactionId: "demo-balance", milestone: "balance", amountCents: 12000 });
  assert.equal(paid.request.paidCents, 24000);
  assert.equal(paid.request.status, "Balance Due");
});

test("loopback demo confirmation ignores browser amounts and enforces membership", async () => {
  const response = await api(`/requests/${request.id}/payments/demo-confirm`, { body: { amountCents: 1 } });
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.payment.amountCents, 12000);
  assert.equal(payload.request.status, "In Progress");

  const forbidden = await api(`/requests/${request.id}/payments/demo-confirm`, { user: "other" });
  assert.equal(forbidden.status, 404);
});

test("demo confirmation is rejected when identity is not an explicit local demo", async () => {
  const response = await api(`/requests/${request.id}/payments/demo-confirm`, { demo: false });
  assert.equal(response.status, 403);
  assert.match((await response.json()).error, /localhost demo/i);
});

test("a MoneyGram claim records the reference and notifies, but never marks the order paid", async () => {
  const claim = await api(`/requests/${request.id}/payments/mpesa-claim`, { body: { reference: "12345678" } });
  assert.equal(claim.status, 202);
  assert.equal((await claim.json()).amountCents, 12000);

  const unchanged = await store.getRequestForUser(request.id, "client");
  assert.equal(unchanged.paidCents, 0);
  assert.equal(unchanged.status, "Deposit Due");
  assert.equal((await store.listPayments(request.id)).length, 0);

  const events = await store.listEvents(request.id);
  assert.ok(events.some((event) => event.type === "payment.claim.submitted"));
});

test("a Gumroad underpay credits the actual amount but does not unlock progress", async () => {
  const result = await recordGumroadPayment({ store, request, providerTransactionId: "gum_short", milestone: "deposit", amountCents: 8000 });
  assert.equal(result.request.paidCents, 8000);
  assert.equal(result.request.status, "Deposit Due");
  assert.equal(result.payment.amountCents, 8000);
});

test("a Gumroad payment that reaches the deposit threshold moves work into progress", async () => {
  const result = await recordGumroadPayment({ store, request, providerTransactionId: "gum_deposit", milestone: "deposit", amountCents: 12000 });
  assert.equal(result.request.paidCents, 12000);
  assert.equal(result.request.status, "In Progress");
});

test("a Gumroad overpay is credited in full and capped at the order total", async () => {
  const result = await recordGumroadPayment({ store, request, providerTransactionId: "gum_over", milestone: "deposit", amountCents: 30000 });
  assert.equal(result.request.paidCents, 24000);
  assert.equal(result.request.status, "In Progress");
});

test("a Gumroad payment is idempotent by sale id", async () => {
  const first = await recordGumroadPayment({ store, request, providerTransactionId: "gum_dup", milestone: "deposit", amountCents: 12000 });
  assert.equal(first.duplicate, false);
  const second = await recordGumroadPayment({ store, request: first.request, providerTransactionId: "gum_dup", milestone: "deposit", amountCents: 12000 });
  assert.equal(second.duplicate, true);
  assert.equal((await store.listPayments(request.id)).length, 1);
});

test("a Gumroad balance payment after deposit completes the order total without a second checkout link", async () => {
  const deposit = await recordGumroadPayment({ store, request, providerTransactionId: "gum_dep2", milestone: "deposit", amountCents: 12000 });
  const balanceDue = await store.updateRequest(request.id, { status: "Balance Due" });
  const balance = await recordGumroadPayment({ store, request: { ...deposit.request, ...balanceDue }, providerTransactionId: "gum_bal2", milestone: "balance", amountCents: 12000 });
  assert.equal(balance.request.paidCents, 24000);
});

test("a MoneyGram claim needs a plausible reference and order membership", async () => {
  const empty = await api(`/requests/${request.id}/payments/mpesa-claim`, { body: {} });
  assert.equal(empty.status, 400);
  assert.match((await empty.json()).error, /reference/i);

  const nonsense = await api(`/requests/${request.id}/payments/mpesa-claim`, { body: { reference: "no spaces allowed!" } });
  assert.equal(nonsense.status, 400);

  const forbidden = await api(`/requests/${request.id}/payments/mpesa-claim`, { user: "other", body: { reference: "12345678" } });
  assert.equal(forbidden.status, 404);
});
