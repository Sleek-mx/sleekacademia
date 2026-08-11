// Owner alert tests.
//
// No network: the mail channel is left unconfigured except where a send is
// exercised, and there the Resend transport is stubbed through axios.

import test from "node:test";
import assert from "node:assert/strict";

import axios from "axios";

import {
  alertOwner,
  alertsConfigured,
  notifyAccountCreated,
  notifyOrderStarted,
  notifyOrderSubmitted,
  notifyPaymentAbandoned,
  ownerAddress,
  resetAlertDedupe,
  settleAlert,
} from "../src/platform/owner-alerts.js";
import { createClerkWebhookHandler, verifySvixSignature, userFromClerkEvent } from "../src/platform/clerk-webhook.js";
import crypto from "node:crypto";

const MAIL_ENV = [
  "RESEND_API_KEY", "RESEND_FROM", "SMTP_HOST", "SMTP_USER", "SMTP_PASS", "SMTP_PORT",
  "OWNER_NOTIFICATION_EMAIL", "NOTIFICATION_EMAIL", "PUBLIC_BASE_URL",
];

// Async-aware: the env must stay overridden until the callback's promise
// settles, otherwise a send that awaits sees the real environment.
async function withEnv(overrides, fn) {
  const saved = {};
  for (const key of MAIL_ENV) saved[key] = process.env[key];
  for (const key of MAIL_ENV) delete process.env[key];
  Object.assign(process.env, overrides);
  resetAlertDedupe();
  try {
    return await fn();
  } finally {
    for (const key of MAIL_ENV) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
    resetAlertDedupe();
  }
}

function captureSends(fn) {
  const sent = [];
  const original = axios.post;
  axios.post = async (url, body) => {
    sent.push({ url, body });
    return { data: { id: "stub" } };
  };
  return Promise.resolve(fn(sent)).finally(() => { axios.post = original; });
}

test("alerts default to the owner inbox and honour the override", () => {
  withEnv({}, () => assert.equal(ownerAddress(), "macsinjobs@gmail.com"));
  withEnv({ OWNER_NOTIFICATION_EMAIL: "someone@else.com" }, () =>
    assert.equal(ownerAddress(), "someone@else.com"));
});

test("an unconfigured mail channel disables alerts instead of throwing", async () => {
  await withEnv({}, async () => {
    assert.equal(alertsConfigured(), false);
    const result = await notifyAccountCreated({ id: "user_1", email: "new@client.com" });
    assert.deepEqual(result, { sent: false, reason: "not-configured" });
  });
});

test("account-created alert names the signup and goes to the owner", async () => {
  await withEnv({ RESEND_API_KEY: "test-key" }, () => captureSends(async (sent) => {
    const result = await notifyAccountCreated({
      id: "user_123", email: "new@client.com", fullName: "New Client", source: "Clerk (email_code)",
    });
    assert.equal(result.sent, true);
    assert.equal(sent.length, 1);
    assert.deepEqual(sent[0].body.to, ["macsinjobs@gmail.com"]);
    assert.match(sent[0].body.subject, /New account — new@client\.com/);
    assert.match(sent[0].body.html, /Someone created an account/);
    assert.match(sent[0].body.html, /user_123/);
    assert.equal(sent[0].body.reply_to, "new@client.com");
  }));
});

test("the same account never alerts twice inside the dedupe window", async () => {
  await withEnv({ RESEND_API_KEY: "test-key" }, () => captureSends(async (sent) => {
    await notifyAccountCreated({ id: "user_dup", email: "dup@client.com" });
    const second = await notifyAccountCreated({ id: "user_dup", email: "dup@client.com" });
    assert.deepEqual(second, { sent: false, reason: "duplicate" });
    assert.equal(sent.length, 1);
  }));
});

test("order-started alert says plainly that nothing was submitted", async () => {
  await withEnv({ RESEND_API_KEY: "test-key" }, () => captureSends(async (sent) => {
    await notifyOrderStarted({ name: "Half Way", email: "half@client.com", service: "Essay or coursework", estimate: "$120" });
    assert.match(sent[0].body.subject, /Order started \(not submitted\)/);
    assert.match(sent[0].body.html, /has not submitted it/);
    assert.match(sent[0].body.html, /\$120/);
  }));
});

test("submitted-order alert carries the quote and order id", async () => {
  await withEnv({ RESEND_API_KEY: "test-key" }, () => captureSends(async (sent) => {
    await notifyOrderSubmitted({
      id: "order_9", name: "Paid Client", email: "client@school.edu", service: "essay",
      quoteCents: 12_500, currency: "usd", status: "Available",
    });
    assert.match(sent[0].body.subject, /New order submitted/);
    assert.match(sent[0].body.html, /125\.00 USD/);
    assert.match(sent[0].body.html, /order_9/);
  }));
});

test("abandoned-payment alert reports the decline reason", async () => {
  await withEnv({ RESEND_API_KEY: "test-key" }, () => captureSends(async (sent) => {
    await notifyPaymentAbandoned({
      email: "gone@client.com", provider: "stripe", milestone: "deposit",
      amountCents: 5_000, currency: "usd", transactionId: "pi_123", reason: "Your card was declined.",
    });
    assert.match(sent[0].body.subject, /Payment not completed/);
    assert.match(sent[0].body.html, /card was declined/);
  }));
});

test("a mail transport failure is swallowed, never thrown at the caller", async () => {
  await withEnv({ RESEND_API_KEY: "test-key" }, async () => {
    const original = axios.post;
    axios.post = async () => { throw new Error("resend is down"); };
    try {
      const result = await alertOwner({ subject: "x", heading: "x" });
      assert.equal(result.sent, false);
      assert.match(result.reason, /resend is down/);
    } finally {
      axios.post = original;
    }
  });
});

// ── Clerk webhook verification ────────────────────────────────────────────

const SECRET = `whsec_${Buffer.from("super-secret-signing-key").toString("base64")}`;

function signed(body, { id = "msg_1", timestamp = Math.floor(Date.now() / 1000), secret = SECRET } = {}) {
  const key = Buffer.from(secret.slice("whsec_".length), "base64");
  const signature = crypto.createHmac("sha256", key).update(`${id}.${timestamp}.${body}`).digest("base64");
  return {
    "svix-id": id,
    "svix-timestamp": String(timestamp),
    "svix-signature": `v1,${signature}`,
  };
}

test("a correctly signed Clerk webhook verifies", () => {
  const body = JSON.stringify({ type: "user.created" });
  assert.deepEqual(verifySvixSignature({ payload: body, headers: signed(body), signingSecret: SECRET }), { ok: true });
});

test("a tampered body fails verification", () => {
  const body = JSON.stringify({ type: "user.created" });
  const headers = signed(body);
  const result = verifySvixSignature({ payload: `${body} `, headers, signingSecret: SECRET });
  assert.equal(result.ok, false);
  assert.equal(result.reason, "signature mismatch");
});

test("an old timestamp fails verification even with a valid signature", () => {
  const body = JSON.stringify({ type: "user.created" });
  const stale = Math.floor(Date.now() / 1000) - 3600;
  const result = verifySvixSignature({ payload: body, headers: signed(body, { timestamp: stale }), signingSecret: SECRET });
  assert.equal(result.ok, false);
  assert.equal(result.reason, "timestamp outside tolerance");
});

test("missing signature headers fail verification", () => {
  const result = verifySvixSignature({ payload: "{}", headers: {}, signingSecret: SECRET });
  assert.equal(result.ok, false);
  assert.equal(result.reason, "missing signature headers");
});

test("multiple offered signatures pass when one matches (secret rotation)", () => {
  const body = JSON.stringify({ type: "user.created" });
  const headers = signed(body);
  headers["svix-signature"] = `v1,ZmFrZQ== ${headers["svix-signature"]}`;
  assert.deepEqual(verifySvixSignature({ payload: body, headers, signingSecret: SECRET }), { ok: true });
});

// Regression: the first deploy of this feature responded before firing the
// alert. On Vercel the function freezes when the response flushes, so the email
// was killed in flight and nothing ever arrived.
test("the webhook finishes the alert before it responds", async () => {
  const order = [];
  let resolveAlert;
  const handler = createClerkWebhookHandler({
    signingSecret: SECRET,
    onUserCreated: () => {
      order.push("alert-started");
      return new Promise((resolve) => { resolveAlert = () => { order.push("alert-finished"); resolve(); }; });
    },
  });

  const body = JSON.stringify({ type: "user.created", data: { id: "user_race", email_addresses: [] } });
  const req = { headers: signed(body), rawBody: Buffer.from(body) };
  const res = { json: () => { order.push("responded"); return res; } };

  const handled = handler(req, res);
  assert.deepEqual(order, ["alert-started"], "the response must not go out while the alert is in flight");
  resolveAlert();
  await handled;
  assert.deepEqual(order, ["alert-started", "alert-finished", "responded"]);
});

test("a hung mail provider still lets the request finish", async () => {
  const started = Date.now();
  const result = await settleAlert(new Promise(() => {}), { timeoutMs: 50 });
  assert.deepEqual(result, { sent: false, reason: "timeout" });
  assert.ok(Date.now() - started < 2_000);
});

test("the Clerk payload is flattened to the primary email address", () => {
  const user = userFromClerkEvent({
    type: "user.created",
    data: {
      id: "user_2",
      first_name: "Max", last_name: "Client",
      primary_email_address_id: "idn_2",
      email_addresses: [
        { id: "idn_1", email_address: "old@client.com" },
        { id: "idn_2", email_address: "primary@client.com", verification: { strategy: "email_code" } },
      ],
    },
  });
  assert.deepEqual(user, {
    id: "user_2",
    email: "primary@client.com",
    fullName: "Max Client",
    source: "Clerk (email_code)",
  });
});
