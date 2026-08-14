import assert from "node:assert/strict";
import { after, before, beforeEach, test } from "node:test";

import express from "express";

import { createPlatformRouter } from "../src/platform/http.js";
import { MemoryPlatformStore } from "../src/platform/memory-store.js";
import { antimicrobialQuiz, renalCardiacQuiz } from "../src/quiz/quizzes.js";
import { createQuizRouter } from "../src/quiz/router.js";

const WEBHOOK_SECRET = "test-secret-abc123";

let server;
let baseUrl;
let store;
let request;

function resolveIdentity(req) {
  const userId = req.get("x-test-user");
  if (!userId) return null;
  return { userId, role: req.get("x-test-role") || "student", email: `${userId}@example.com`, fullName: userId, demo: false };
}

before(async () => {
  const app = express();
  app.use("/api/platform", (req, _res, next) => { req.platformStore = store; next(); });
  app.use("/api/platform", createPlatformRouter({ resolveIdentity, gumroadWebhookSecret: WEBHOOK_SECRET }));
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => server?.close());

beforeEach(async () => {
  store = new MemoryPlatformStore();
  await store.upsertProfile({ userId: "client", role: "student", email: "client@example.com", fullName: "Client" });
  request = await store.createRequest({
    userId: "client", idempotencyKey: "gumroad-webhook-request", service: "essay", subject: "Nursing",
    description: "Brief", name: "Client", email: "client@example.com", status: "Deposit Due",
    quoteCents: 24000, paidCents: 0,
  });
});

function ping(body, { key = WEBHOOK_SECRET } = {}) {
  return fetch(`${baseUrl}/api/platform/payments/gumroad-webhook?key=${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body).toString(),
  });
}

test("a Ping with the wrong secret is rejected without touching any order", async () => {
  const response = await ping({
    sale_id: "gum_1", price: "12000", product_permalink: "OrderPayment",
    "url_params[order_id]": request.id, "url_params[milestone]": "deposit",
  }, { key: "wrong-secret" });
  assert.equal(response.status, 404);
  const unchanged = await store.getRequestForUser(request.id, "client");
  assert.equal(unchanged.paidCents, 0);
});

test("a Ping for a different Gumroad product is safely ignored, not an error", async () => {
  const response = await ping({
    sale_id: "gum_other", price: "1500", product_permalink: "SomeQuizPack",
    "url_params[order_id]": request.id, "url_params[milestone]": "deposit",
  });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ignored, true);
  const unchanged = await store.getRequestForUser(request.id, "client");
  assert.equal(unchanged.paidCents, 0);
});

test("a malformed order_id is rejected with a clean 404, never reaching the store", async () => {
  // Production's Supabase store queries a uuid column — a non-UUID id throws
  // there instead of returning null, so this has to be caught before the
  // store call, not after. A stub that throws on any call proves it.
  const throwingStore = { available: true, getRequestForUser: () => { throw new Error("must not be called"); } };
  const app = express();
  app.use("/api/platform", (req, _res, next) => { req.platformStore = throwingStore; next(); });
  app.use("/api/platform", createPlatformRouter({ resolveIdentity, gumroadWebhookSecret: WEBHOOK_SECRET }));
  const throwServer = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => throwServer.once("listening", resolve));
  const throwBaseUrl = `http://127.0.0.1:${throwServer.address().port}`;
  try {
    const response = await fetch(`${throwBaseUrl}/api/platform/payments/gumroad-webhook?key=${WEBHOOK_SECRET}`, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        sale_id: "gum_2", price: "12000", product_permalink: "OrderPayment",
        "url_params[order_id]": "not-a-real-order", "url_params[milestone]": "deposit",
      }).toString(),
    });
    assert.equal(response.status, 404);
  } finally {
    throwServer.close();
  }
});

test("a well-formed but nonexistent order id is rejected so Gumroad retries", async () => {
  const response = await ping({
    sale_id: "gum_2", price: "12000", product_permalink: "OrderPayment",
    "url_params[order_id]": "00000000-0000-4000-8000-000000000000", "url_params[milestone]": "deposit",
  });
  assert.notEqual(response.status, 200);
});

test("a verified deposit Ping credits the order and moves work into progress", async () => {
  const response = await ping({
    sale_id: "gum_3", price: "12000", product_permalink: "OrderPayment",
    "url_params[order_id]": request.id, "url_params[milestone]": "deposit",
  });
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.recorded, true);
  assert.equal(payload.status, "In Progress");
  const updated = await store.getRequestForUser(request.id, "client");
  assert.equal(updated.paidCents, 12000);
  assert.equal(updated.status, "In Progress");
});

test("an underpaid deposit Ping still credits the order without unlocking progress", async () => {
  const response = await ping({
    sale_id: "gum_4", price: "8000", product_permalink: "OrderPayment",
    "url_params[order_id]": request.id, "url_params[milestone]": "deposit",
  });
  assert.equal(response.status, 200);
  const updated = await store.getRequestForUser(request.id, "client");
  assert.equal(updated.paidCents, 8000);
  assert.equal(updated.status, "Deposit Due");
});

test("a duplicate sale id is a no-op the second time", async () => {
  const body = {
    sale_id: "gum_5", price: "12000", product_permalink: "OrderPayment",
    "url_params[order_id]": request.id, "url_params[milestone]": "deposit",
  };
  await ping(body);
  const second = await ping(body);
  assert.equal(second.status, 200);
  assert.equal((await second.json()).duplicate, true);
  assert.equal((await store.listPayments(request.id)).length, 1);
});

// ── Quiz unlock (a different product on the same account-wide Ping URL) ────

test("a verified quiz sale mints an entitlement and reports unlocked", async () => {
  const response = await ping({
    sale_id: "gum_quiz_1", price: "1000", product_permalink: "QuizUnlock",
    email: "buyer@example.com", "url_params[quiz_id]": renalCardiacQuiz.id,
  });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).unlocked, true);
});

test("a quiz sale for an unresolvable quiz_id is rejected", async () => {
  const response = await ping({
    sale_id: "gum_quiz_2", price: "1000", product_permalink: "QuizUnlock",
    email: "buyer@example.com", "url_params[quiz_id]": "not-a-real-quiz",
  });
  assert.equal(response.status, 404);
});

test("a duplicate quiz sale id is a no-op the second time", async () => {
  const body = {
    sale_id: "gum_quiz_3", price: "1000", product_permalink: "QuizUnlock",
    email: "buyer@example.com", "url_params[quiz_id]": renalCardiacQuiz.id,
  };
  await ping(body);
  const second = await ping(body);
  assert.equal(second.status, 200);
  assert.equal((await second.json()).duplicate, true);
});

test("a quiz sale never touches the order store at all", async () => {
  const response = await ping({
    sale_id: "gum_quiz_4", price: "1000", product_permalink: "QuizUnlock",
    email: "buyer@example.com", "url_params[quiz_id]": renalCardiacQuiz.id,
  });
  assert.equal(response.status, 200);
  const unchanged = await store.getRequestForUser(request.id, "client");
  assert.equal(unchanged.paidCents, 0);
});

test("a quiz sale still unlocks even when the order-payment store is unavailable", async () => {
  const unavailableApp = express();
  unavailableApp.use("/api/platform", (req, _res, next) => { req.platformStore = { available: false }; next(); });
  unavailableApp.use("/api/platform", createPlatformRouter({ resolveIdentity, gumroadWebhookSecret: WEBHOOK_SECRET }));
  const unavailableServer = unavailableApp.listen(0, "127.0.0.1");
  await new Promise((resolve) => unavailableServer.once("listening", resolve));
  try {
    const port = unavailableServer.address().port;
    const response = await fetch(`http://127.0.0.1:${port}/api/platform/payments/gumroad-webhook?key=${WEBHOOK_SECRET}`, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        sale_id: "gum_quiz_5", price: "1000", product_permalink: "QuizUnlock",
        email: "buyer@example.com", "url_params[quiz_id]": renalCardiacQuiz.id,
      }).toString(),
    });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).unlocked, true);
  } finally {
    unavailableServer.close();
  }
});

test("end-to-end: a Gumroad-minted entitlement unlocks the paid quiz but not a different one", async () => {
  const response = await ping({
    sale_id: "gum_quiz_scope", price: "1000", product_permalink: "QuizUnlock",
    email: "buyer@example.com", "url_params[quiz_id]": renalCardiacQuiz.id,
  });
  assert.equal(response.status, 200);

  // Pull the actual minted token from the buyer's email instead of trusting
  // the webhook's own bookkeeping — this is what proves the token that left
  // the building really carries the right scope.
  const axios = (await import("axios")).default;
  const sent = [];
  const original = axios.post;
  axios.post = async (url, body) => { sent.push({ url, body }); return { data: { id: "stub" } }; };
  let token;
  try {
    process.env.RESEND_API_KEY = "test-key";
    await ping({
      sale_id: "gum_quiz_scope_2", price: "1000", product_permalink: "QuizUnlock",
      email: "buyer@example.com", "url_params[quiz_id]": renalCardiacQuiz.id,
    });
    const buyerMail = sent.find((entry) => entry.body.to.includes("buyer@example.com"));
    const match = /#unlock=([^"&\s]+)/.exec(buyerMail.body.html);
    token = decodeURIComponent(match[1]);
  } finally {
    axios.post = original;
    delete process.env.RESEND_API_KEY;
  }

  const quizApp = express();
  quizApp.use(express.json());
  quizApp.use("/api/renal-cardiac", createQuizRouter(renalCardiacQuiz));
  quizApp.use("/api/antimicrobial", createQuizRouter(antimicrobialQuiz));
  const quizServer = quizApp.listen(0, "127.0.0.1");
  await new Promise((resolve) => quizServer.once("listening", resolve));
  try {
    const port = quizServer.address().port;
    const paidQuiz = await fetch(`http://127.0.0.1:${port}/api/renal-cardiac/config`, { headers: { "x-quiz-entitlement": token } });
    assert.equal((await paidQuiz.json()).entitled, true, "the quiz that was actually paid for must unlock");

    const wrongQuiz = await fetch(`http://127.0.0.1:${port}/api/antimicrobial/config`, { headers: { "x-quiz-entitlement": token } });
    assert.equal((await wrongQuiz.json()).entitled, false, "a different quiz must not unlock from the same token");
  } finally {
    quizServer.close();
  }
});
