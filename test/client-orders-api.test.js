import assert from "node:assert/strict";
import { after, before, beforeEach, test } from "node:test";

import express from "express";

import { createPlatformRouter } from "../src/platform/http.js";
import { MemoryPlatformStore } from "../src/platform/memory-store.js";

let baseUrl;
let server;
let store;

function identity(req) {
  const userId = req.get("x-test-user");
  if (!userId) return null;
  return { userId, role: req.get("x-test-role") || "student", email: `${userId}@example.com`, fullName: userId, demo: true };
}

async function api(path, { user = "client", role = "student", method = "GET", body } = {}) {
  const headers = { "x-test-user": user, "x-test-role": role };
  if (body !== undefined) headers["content-type"] = "application/json";
  return fetch(`${baseUrl}/api/platform${path}`, { method, headers, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
}

before(async () => {
  const app = express();
  app.use(express.json({ limit: "12mb" }));
  app.use("/api/platform", (req, _res, next) => { req.platformStore = store; next(); });
  app.use("/api/platform", createPlatformRouter({ resolveIdentity: identity }));
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());
beforeEach(async () => {
  store = new MemoryPlatformStore();
  await store.upsertProfile({ userId: "client", role: "student", fullName: "Client", email: "client@example.com" });
  await store.upsertProfile({ userId: "other", role: "student", fullName: "Other", email: "other@example.com" });
});

function handoff(overrides = {}) {
  return { idempotencyKey: "order-1", service: "essay", subject: "Nursing", title: "Care plan", description: "Use the supplied rubric and sources.", deadline: "2026-08-01", pageCount: "2", name: "Client", email: "client@example.com", ...overrides };
}

test("client order handoff is priced by the server and idempotent", async () => {
  const created = await api("/orders/handoff", { method: "POST", body: handoff() });
  assert.equal(created.status, 201);
  const order = (await created.json()).order;
  assert.equal(order.quoteCents, 3000);
  assert.equal(order.pricingSnapshot.totalCents, 3000);
  assert.equal(order.status, "Available");
  const duplicate = await api("/orders/handoff", { method: "POST", body: handoff({ title: "changed" }) });
  assert.equal((await duplicate.json()).order.id, order.id);
});

test("clients see only their orders and cross-client detail is indistinguishable from missing", async () => {
  const foreign = await store.createOrder({ ...handoff({ idempotencyKey: "foreign" }), userId: "other", status: "Available" });
  assert.equal((await api(`/orders/${foreign.id}`)).status, 404);
  const list = await (await api("/orders")).json();
  assert.equal(list.orders.length, 0);
  assert.equal((await api("/admin/overview")).status, 403);
});

test("client order routes expose messages, attachments, profile, payments, and notifications without admin actions", async () => {
  const order = await store.createOrder({ ...handoff(), userId: "client", status: "Available" });
  assert.equal((await api(`/orders/${order.id}/messages`, { method: "POST", body: { body: "All source files are attached." } })).status, 201);
  assert.equal((await api(`/orders/${order.id}/attachments`, { method: "POST", body: { fileName: "notes.txt", mimeType: "text/plain", contentBase64: Buffer.from("Source notes").toString("base64") } })).status, 201);
  assert.equal((await api("/profile", { method: "PATCH", body: { school: "UMGC", role: "admin" } })).status, 200);
  assert.equal((await api("/notifications")).status, 200);
  assert.equal((await api(`/orders/${order.id}/status`, { method: "PATCH", body: { status: "Completed" } })).status, 404);
});
