// End-to-end checks for the two new public endpoints, against a real booted
// server: the Clerk webhook and the order-wizard lead beacon.
//
// The mail channel is deliberately unconfigured in the child process, so a
// verified webhook still answers 200 and simply logs that alerts are off. That
// is the behaviour that matters here — mail failures must never turn into
// webhook failures, which would make Clerk retry forever.

import assert from "node:assert/strict";
import crypto from "node:crypto";
import { after, before, test } from "node:test";
import { spawn } from "node:child_process";

const PORT = 3997;
const BASE = `http://127.0.0.1:${PORT}`;
const SIGNING_SECRET = `whsec_${Buffer.from("integration-signing-key").toString("base64")}`;
let server;

function svixHeaders(body, { id = "msg_int_1", timestamp = Math.floor(Date.now() / 1000) } = {}) {
  const key = Buffer.from(SIGNING_SECRET.slice("whsec_".length), "base64");
  const signature = crypto.createHmac("sha256", key).update(`${id}.${timestamp}.${body}`).digest("base64");
  return {
    "Content-Type": "application/json",
    "svix-id": id,
    "svix-timestamp": String(timestamp),
    "svix-signature": `v1,${signature}`,
  };
}

const USER_CREATED = JSON.stringify({
  type: "user.created",
  data: {
    id: "user_int_1",
    first_name: "Integration",
    last_name: "Client",
    primary_email_address_id: "idn_1",
    email_addresses: [{ id: "idn_1", email_address: "integration@client.com" }],
  },
});

before(async () => {
  const env = {
    ...process.env,
    PORT: String(PORT),
    LOCAL_DEMO_MODE: "1",
    CLERK_WEBHOOK_SIGNING_SECRET: SIGNING_SECRET,
  };
  for (const key of [
    "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY",
    "CLERK_PUBLISHABLE_KEY", "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "CLERK_SECRET_KEY",
    "RESEND_API_KEY", "SMTP_HOST", "SMTP_USER", "SMTP_PASS",
  ]) delete env[key];

  server = spawn(process.execPath, ["server.js"], { env, stdio: "ignore" });
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      await fetch(`${BASE}/api/health`);
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  throw new Error("Local demo server did not start.");
});

after(() => server?.kill());

test("a signed user.created webhook is accepted", async () => {
  const response = await fetch(`${BASE}/api/webhooks/clerk`, {
    method: "POST",
    headers: svixHeaders(USER_CREATED),
    body: USER_CREATED,
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { received: true, type: "user.created" });
});

test("an unsigned webhook is rejected", async () => {
  const response = await fetch(`${BASE}/api/webhooks/clerk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: USER_CREATED,
  });
  assert.equal(response.status, 401);
});

test("a webhook signed with the wrong secret is rejected", async () => {
  const headers = svixHeaders(USER_CREATED, { id: "msg_int_2" });
  headers["svix-signature"] = "v1,d3Jvbmc=";
  const response = await fetch(`${BASE}/api/webhooks/clerk`, { method: "POST", headers, body: USER_CREATED });
  assert.equal(response.status, 401);
});

test("other Clerk event types are acknowledged and ignored", async () => {
  const body = JSON.stringify({ type: "session.created", data: { id: "sess_1" } });
  const response = await fetch(`${BASE}/api/webhooks/clerk`, {
    method: "POST",
    headers: svixHeaders(body, { id: "msg_int_3" }),
    body,
  });
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.ignored, true);
});

test("the order-wizard beacon accepts a lead", async () => {
  const response = await fetch(`${BASE}/api/onboard-lead`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: `http://127.0.0.1:${PORT}` },
    body: JSON.stringify({
      name: "Half Way", email: "half@client.com",
      service: "Essay or coursework", estimate: "$120 informational estimate",
    }),
  });
  assert.equal(response.status, 202);
});

test("the beacon rejects a body with no usable email", async () => {
  const response = await fetch(`${BASE}/api/onboard-lead`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: `http://127.0.0.1:${PORT}` },
    body: JSON.stringify({ name: "No Email", email: "nope" }),
  });
  assert.equal(response.status, 400);
});

// The contact dock's message form. Mail is deliberately unconfigured in this
// child process, which is exactly the case that must not silently swallow a
// lead: the visitor is told to use WhatsApp instead of being shown a false
// "sent" confirmation.
test("the contact form rejects a message with no usable email", async () => {
  const response = await fetch(`${BASE}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: `http://127.0.0.1:${PORT}` },
    body: JSON.stringify({ name: "No Email", email: "nope", message: "I need help with a care plan." }),
  });
  assert.equal(response.status, 400);
});

test("the contact form rejects an empty message", async () => {
  const response = await fetch(`${BASE}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: `http://127.0.0.1:${PORT}` },
    body: JSON.stringify({ email: "student@client.com", message: "hi" }),
  });
  assert.equal(response.status, 400);
});

test("the contact form says so instead of pretending when no mail channel exists", async () => {
  const response = await fetch(`${BASE}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: `http://127.0.0.1:${PORT}` },
    body: JSON.stringify({
      name: "Real Student", email: "student@client.com",
      message: "Can you help with a NURS 5334 paper due Friday?",
    }),
  });
  assert.equal(response.status, 503);
  assert.match((await response.json()).error, /WhatsApp/i);
});

test("health reports whether alerts and card payments are available", async () => {
  const payload = await (await fetch(`${BASE}/api/health`)).json();
  assert.equal(payload.ok, true);
  assert.equal(payload.alerts, false);
  assert.equal(payload.cardPayments, false);
});

test("the browser config offers the MoneyGram fallback when no card processor is live", async () => {
  const payload = await (await fetch(`${BASE}/api/config`)).json();
  assert.equal(payload.stripePublishableKey, "");
  assert.equal(payload.manualPayment.enabled, true);
  assert.equal(payload.manualPayment.receiveMethod, "Mobile Wallet — M-Pesa");
  assert.doesNotMatch(JSON.stringify(payload), /paypal/i);
});
