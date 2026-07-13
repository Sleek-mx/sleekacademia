import assert from "node:assert/strict";
import { after, before, beforeEach, test } from "node:test";

import express from "express";

import { createPlatformRouter } from "../src/platform/http.js";
import { MemoryPlatformStore } from "../src/platform/memory-store.js";

let server;
let baseUrl;
let store;

function identityFromHeaders(req) {
  const userId = req.get("x-test-user");
  if (!userId) return null;
  const role = req.get("x-test-role") || "student";
  return {
    userId,
    role,
    email: `${userId}@example.com`,
    fullName: userId === "admin" ? "Test Admin" : "Test Client",
    demo: true,
  };
}

async function api(path, { user = "client", role = "student", method = "GET", body } = {}) {
  const headers = {};
  if (user) headers["x-test-user"] = user;
  if (role) headers["x-test-role"] = role;
  if (body !== undefined) headers["content-type"] = "application/json";
  return fetch(`${baseUrl}/api/platform${path}`, {
    method,
    headers,
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}

function validHandoff(overrides = {}) {
  return {
    idempotencyKey: "browser-handoff-001",
    service: "essay",
    subject: "Nursing leadership",
    title: "Evidence review",
    description: "Review the supplied sources using the assignment rubric.",
    deadline: "2026-08-01",
    citationStyle: "APA 7",
    pageCount: "6",
    name: "Test Client",
    email: "client@example.com",
    urgentPhone: "",
    school: "",
    ...overrides,
  };
}

before(async () => {
  const app = express();
  app.use(express.json({ limit: "12mb" }));
  app.use("/api/platform", (req, res, next) => {
    req.platformStore = store;
    next();
  });
  app.use("/api/platform", createPlatformRouter({ resolveIdentity: identityFromHeaders }));
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => server?.close());

beforeEach(async () => {
  store = new MemoryPlatformStore();
  await store.upsertProfile({ userId: "client", role: "student", email: "client@example.com", fullName: "Test Client" });
  await store.upsertProfile({ userId: "other", role: "student", email: "other@example.com", fullName: "Other Client" });
  await store.upsertProfile({ userId: "admin", role: "admin", email: "admin@example.com", fullName: "Test Admin" });
});

test("protected platform routes reject anonymous requests", async () => {
  const response = await api("/requests", { user: null, role: null });
  assert.equal(response.status, 401);
  assert.match((await response.json()).error, /authentication/i);
});

test("pending request handoff is durable and idempotent", async () => {
  const firstResponse = await api("/requests/handoff", { method: "POST", body: validHandoff() });
  assert.equal(firstResponse.status, 201);
  const first = await firstResponse.json();

  const duplicateResponse = await api("/requests/handoff", {
    method: "POST",
    body: validHandoff({ title: "Browser retry must not overwrite" }),
  });
  assert.equal(duplicateResponse.status, 200);
  const duplicate = await duplicateResponse.json();
  assert.equal(duplicate.request.id, first.request.id);
  assert.equal(duplicate.request.title, "Evidence review");

  const rows = await (await api("/requests")).json();
  assert.equal(rows.requests.length, 1);
});

test("cross-account request access returns 403 and admin access succeeds", async () => {
  const request = await store.createRequest({
    ...validHandoff({ idempotencyKey: "other-request" }),
    userId: "other",
    status: "Submitted",
  });

  assert.equal((await api(`/requests/${request.id}`)).status, 403);
  assert.equal((await api(`/requests/${request.id}`, { user: "admin", role: "admin" })).status, 200);
});

test("only admins can quote or transition requests", async () => {
  const request = await store.createRequest({
    ...validHandoff({ idempotencyKey: "quote-request" }),
    userId: "client",
    status: "Submitted",
  });

  assert.equal(
    (await api(`/requests/${request.id}/quote`, { method: "PATCH", body: { quoteCents: 24000 } })).status,
    403,
  );

  const quoted = await api(`/requests/${request.id}/quote`, {
    user: "admin",
    role: "admin",
    method: "PATCH",
    body: { quoteCents: 24000 },
  });
  assert.equal(quoted.status, 200);
  assert.equal((await quoted.json()).request.status, "Deposit Due");

  const blocked = await api(`/requests/${request.id}/status`, {
    user: "admin",
    role: "admin",
    method: "PATCH",
    body: { status: "In Progress" },
  });
  assert.equal(blocked.status, 409);
  assert.match((await blocked.json()).error, /50 percent deposit/i);
});

test("messages are validated and request scoped", async () => {
  const request = await store.createRequest({ ...validHandoff(), userId: "client", status: "Submitted" });
  assert.equal(
    (await api(`/requests/${request.id}/messages`, { method: "POST", body: { body: "" } })).status,
    400,
  );
  const sent = await api(`/requests/${request.id}/messages`, {
    method: "POST",
    body: { body: "I added the assignment rubric." },
  });
  assert.equal(sent.status, 201);
  assert.equal((await sent.json()).message.body, "I added the assignment rubric.");
});

test("uploads reject unsupported and oversized files", async () => {
  const request = await store.createRequest({ ...validHandoff(), userId: "client", status: "Submitted" });
  const unsupported = await api(`/requests/${request.id}/attachments`, {
    method: "POST",
    body: {
      fileName: "script.exe",
      mimeType: "application/x-msdownload",
      contentBase64: Buffer.from("unsafe").toString("base64"),
    },
  });
  assert.equal(unsupported.status, 400);

  const oversized = await api(`/requests/${request.id}/attachments`, {
    method: "POST",
    body: {
      fileName: "large.pdf",
      mimeType: "application/pdf",
      contentBase64: Buffer.alloc(8 * 1024 * 1024 + 1).toString("base64"),
    },
  });
  assert.equal(oversized.status, 400);
  assert.match((await oversized.json()).error, /8 MB/i);
});

test("locked final attachment returns 423 until the request is fully paid", async () => {
  const request = await store.createRequest({
    ...validHandoff(),
    userId: "client",
    status: "Balance Due",
    quoteCents: 24000,
    paidCents: 12000,
  });
  const object = await store.putPrivateObject({ requestId: request.id, fileName: "final.txt", mimeType: "text/plain", bytes: Buffer.from("final") });
  const attachment = await store.createAttachment({
    requestId: request.id,
    userId: "client",
    uploadedBy: "admin",
    fileName: "final.txt",
    mimeType: "text/plain",
    sizeBytes: 5,
    storagePath: object.path,
    category: "final",
    deliveryLocked: true,
  });

  const response = await api(`/attachments/${attachment.id}/download`);
  assert.equal(response.status, 423);
  assert.match((await response.json()).error, /full payment/i);
});

test("profile updates are allowlisted", async () => {
  const response = await api("/profile", {
    method: "PATCH",
    body: { urgentPhone: "+1 312 555 0110", school: "UMGC", role: "admin" },
  });
  assert.equal(response.status, 200);
  const profile = (await response.json()).profile;
  assert.equal(profile.school, "UMGC");
  assert.equal(profile.role, "student");
});
