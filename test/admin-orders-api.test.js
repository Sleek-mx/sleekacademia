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
  return userId ? { userId, role: req.get("x-test-role") || "student", email: `${userId}@example.com`, fullName: userId, demo: true } : null;
}

async function api(path, { user = "admin", role = "admin", method = "GET", body } = {}) {
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
});

async function availableOrder() {
  return store.createOrder({ idempotencyKey: "admin-order", userId: "client", service: "essay", pageCount: "2", title: "Paper", subject: "Nursing", description: "Complete brief", status: "Available", quoteCents: 3000, paidCents: 0, pricingSnapshot: { totalCents: 3000, depositCents: 1500, balanceCents: 1500 }, deadline: "2026-08-01" });
}

test("only MCX admin identity can use admin order APIs", async () => {
  assert.equal((await api("/admin/overview", { user: "client", role: "student" })).status, 403);
  assert.equal((await api("/admin/overview")).status, 200);
});

test("admin can clarify and accept a complete priced order", async () => {
  const order = await availableOrder();
  const clarification = await api(`/admin/orders/${order.id}/clarification`, { method: "POST", body: { body: "Please attach the rubric." } });
  assert.equal(clarification.status, 200);
  assert.equal((await clarification.json()).order.status, "Needs Clarification");
  const accepted = await api(`/admin/orders/${order.id}/accept`, { method: "POST", body: { acceptedDeadline: "2026-08-01T18:00:00.000Z" } });
  assert.equal(accepted.status, 200);
  assert.equal((await accepted.json()).order.status, "Deposit Due");
});

test("admin overview, queues, clients, messages, payments, earnings, files, and CSV are available", async () => {
  await availableOrder();
  for (const path of ["/admin/overview", "/admin/orders?status=Available", "/admin/clients", "/admin/messages", "/admin/payments", "/admin/earnings?period=30d", "/admin/files"]) {
    assert.equal((await api(path)).status, 200, path);
  }
  const csv = await api("/admin/exports/orders.csv");
  assert.equal(csv.status, 200);
  assert.match(csv.headers.get("content-type") || "", /text\/csv/);
  assert.match(await csv.text(), /^Order ID,/);
});
