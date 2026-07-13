import assert from "node:assert/strict";
import { after, before, beforeEach, test } from "node:test";

import express from "express";

import { createPlatformRouter } from "../src/platform/http.js";
import { MemoryPlatformStore } from "../src/platform/memory-store.js";

let baseUrl;
let server;
let store;

function identity(req) {
  const role = req.get("x-test-role") || "student";
  return { userId: role === "admin" ? "demo-admin" : "demo-client", role, email: `${role}@example.com`, fullName: role, demo: true };
}

async function api(path, { role = "student", method = "GET", body } = {}) {
  const headers = { "x-test-role": role };
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
  await store.upsertProfile({ userId: "demo-client", role: "student", fullName: "Demo Client", email: "student@example.com" });
});

async function createOrder(key = "revision-flow") {
  const response = await api("/orders/handoff", { method: "POST", body: { idempotencyKey: key, service: "essay", subject: "Nursing", title: "Evidence paper", description: "All instructions and sources are attached.", deadline: "2026-08-01", pageCount: "2", name: "Demo Client", email: "student@example.com" } });
  return (await response.json()).order;
}

async function uploadFinal(orderId, name = "final.txt") {
  return api(`/admin/orders/${orderId}/deliverables`, { role: "admin", method: "POST", body: { category: "final", fileName: name, mimeType: "text/plain", contentBase64: Buffer.from(`content:${name}`).toString("base64") } });
}

test("complete delivery and one included revision follow the approved lifecycle", async () => {
  let order = await createOrder();
  assert.equal(order.status, "Available");
  assert.equal((await api(`/admin/orders/${order.id}/clarification`, { role: "admin", method: "POST", body: { body: "Confirm the rubric version." } })).status, 200);
  assert.equal((await (await api(`/admin/orders/${order.id}/status`, { role: "admin", method: "PATCH", body: { status: "Available" } })).json()).order.status, "Available");
  assert.equal((await (await api(`/admin/orders/${order.id}/accept`, { role: "admin", method: "POST", body: {} })).json()).order.status, "Deposit Due");
  assert.equal((await (await api(`/orders/${order.id}/payments/demo-confirm`, { method: "POST" })).json()).request.status, "In Progress");

  const delivery = await uploadFinal(order.id);
  const attachment = (await delivery.json()).attachment;
  assert.equal((await (await api(`/admin/orders/${order.id}/status`, { role: "admin", method: "PATCH", body: { status: "Delivered" } })).json()).order.status, "Delivered");
  const lockedDetail = await (await api(`/orders/${order.id}`)).json();
  assert.equal(lockedDetail.attachments[0].fileName, "final.txt");
  assert.equal((await api(`/attachments/${attachment.id}/download`)).status, 423);
  assert.equal((await api(`/orders/${order.id}/revisions`, { method: "POST", body: { instructions: "Change the conclusion." } })).status, 409);

  await api(`/orders/${order.id}/payments/demo-confirm`, { method: "POST" });
  const paidDetail = await (await api(`/orders/${order.id}`)).json();
  assert.ok(paidDetail.order.queues.includes("Delivered and Paid"));
  assert.equal((await api(`/attachments/${attachment.id}/download`)).status, 200);
  const firstDownloaded = await store.getOrderForUser(order.id, "demo-client");
  assert.ok(firstDownloaded.firstDownloadedAt);
  assert.equal((await store.listEvents(order.id)).filter((event) => event.type === "delivery.first_downloaded").length, 1);

  const revision = await api(`/orders/${order.id}/revisions`, { method: "POST", body: { instructions: "Change the conclusion and retain APA 7." } });
  assert.equal(revision.status, 201);
  assert.equal((await revision.json()).order.status, "Revision Requested");
  const second = await api(`/orders/${order.id}/revisions`, { method: "POST", body: { instructions: "A second included revision." } });
  assert.equal(second.status, 409);
  assert.equal((await second.json()).additionalWork, true);

  assert.equal((await api(`/admin/orders/${order.id}/status`, { role: "admin", method: "PATCH", body: { status: "In Revision" } })).status, 200);
  assert.equal((await uploadFinal(order.id, "final-v2.txt")).status, 201);
  assert.equal((await api(`/admin/orders/${order.id}/status`, { role: "admin", method: "PATCH", body: { status: "Delivered" } })).status, 200);
  const completed = await api(`/admin/orders/${order.id}/status`, { role: "admin", method: "PATCH", body: { status: "Completed" } });
  assert.equal(completed.status, 200);
  assert.equal((await store.listAttachments(order.id)).length, 2);
  assert.equal((await store.listRevisions(order.id))[0].status, "completed");
});

test("expired revision becomes additional work and failed delivery never changes status", async () => {
  const order = await createOrder("expired-flow");
  await store.updateOrder(order.id, { status: "Delivered", quoteCents: 3000, paidCents: 3000, firstDownloadedAt: "2026-01-01T00:00:00.000Z" });
  const expired = await api(`/orders/${order.id}/revisions`, { method: "POST", body: { instructions: "Late change" } });
  assert.equal(expired.status, 409);
  assert.equal((await expired.json()).additionalWork, true);

  await store.updateOrder(order.id, { status: "In Progress" });
  const failed = await api(`/admin/orders/${order.id}/deliverables`, { role: "admin", method: "POST", body: { category: "final", fileName: "malware.pdf", mimeType: "application/pdf", contentBase64: Buffer.from("MZ executable").toString("base64") } });
  assert.equal(failed.status, 400);
  assert.equal((await store.getOrderForUser(order.id, "demo-admin", { role: "admin" })).status, "In Progress");
});
