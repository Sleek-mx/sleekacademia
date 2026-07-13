import assert from "node:assert/strict";
import test from "node:test";

import { MemoryPlatformStore } from "../src/platform/memory-store.js";
import { SupabasePlatformStore } from "../src/platform/supabase-store.js";
import { createPlatformStore } from "../src/platform/store.js";

function requestInput(overrides = {}) {
  return {
    userId: "user_client",
    idempotencyKey: "handoff-001",
    service: "essay",
    subject: "Nursing ethics",
    title: "Evidence review",
    description: "Review the supplied sources and assignment instructions.",
    name: "Max Client",
    email: "max@example.com",
    status: "Submitted",
    quoteCents: 0,
    paidCents: 0,
    ...overrides,
  };
}

test("memory store keeps profiles and requests isolated by user", async () => {
  const store = new MemoryPlatformStore();
  await store.upsertProfile({ userId: "user_client", email: "max@example.com", fullName: "Max Client", role: "student" });
  await store.upsertProfile({ userId: "user_other", email: "other@example.com", fullName: "Other Client", role: "student" });
  const first = await store.createRequest(requestInput());
  await store.createRequest(requestInput({ userId: "user_other", idempotencyKey: "handoff-002" }));

  const clientRows = await store.listRequestsForUser("user_client", { role: "student" });
  assert.deepEqual(clientRows.map((row) => row.id), [first.id]);
  assert.equal(await store.getRequestForUser(first.id, "user_other", { role: "student" }), null);
  assert.equal((await store.getRequestForUser(first.id, "user_admin", { role: "admin" })).id, first.id);
});

test("request handoff is idempotent", async () => {
  const store = new MemoryPlatformStore();
  const first = await store.createRequest(requestInput());
  const duplicate = await store.createRequest(requestInput({ title: "Changed browser retry" }));

  assert.equal(duplicate.id, first.id);
  assert.equal(duplicate.title, "Evidence review");
  assert.equal((await store.listRequestsForUser("user_client", { role: "student" })).length, 1);
  assert.equal((await store.findRequestByIdempotencyKey("user_client", "handoff-001")).id, first.id);
});

test("events are append-only snapshots and messages remain ordered", async () => {
  let tick = 0;
  const store = new MemoryPlatformStore({ now: () => new Date(1700000000000 + tick++ * 1000).toISOString() });
  const request = await store.createRequest(requestInput());
  const event = await store.appendEvent({ requestId: request.id, actorId: "user_client", type: "request.created", data: { status: "Submitted" } });
  event.data.status = "mutated outside";

  await store.createMessage({ requestId: request.id, userId: "user_client", senderId: "user_client", senderRole: "student", body: "First" });
  await store.createMessage({ requestId: request.id, userId: "user_client", senderId: "user_admin", senderRole: "admin", body: "Second" });

  const events = await store.listEvents(request.id);
  const messages = await store.listMessages(request.id, "user_client", { role: "student" });
  assert.equal(events[0].data.status, "Submitted");
  assert.deepEqual(messages.map((message) => message.body), ["First", "Second"]);
});

test("provider transaction identifiers cannot create duplicate payments", async () => {
  const store = new MemoryPlatformStore();
  const request = await store.createRequest(requestInput({ quoteCents: 24000 }));
  await store.createPayment({
    requestId: request.id,
    userId: "user_client",
    provider: "stripe",
    providerTransactionId: "pi_123",
    milestone: "deposit",
    amountCents: 12000,
    status: "confirmed",
  });

  await assert.rejects(
    store.createPayment({
      requestId: request.id,
      userId: "user_client",
      provider: "stripe",
      providerTransactionId: "pi_123",
      milestone: "deposit",
      amountCents: 12000,
      status: "confirmed",
    }),
    (error) => error.code === "DUPLICATE_PAYMENT",
  );
  assert.equal((await store.findPaymentByProviderId("stripe", "pi_123")).amountCents, 12000);
});

test("private attachment metadata never exposes a public storage URL", async () => {
  const store = new MemoryPlatformStore();
  const request = await store.createRequest(requestInput());
  const object = await store.putPrivateObject({
    requestId: request.id,
    fileName: "instructions.pdf",
    mimeType: "application/pdf",
    bytes: Buffer.from("private source"),
  });
  const attachment = await store.createAttachment({
    requestId: request.id,
    userId: "user_client",
    uploadedBy: "user_client",
    fileName: "instructions.pdf",
    mimeType: "application/pdf",
    sizeBytes: 14,
    storagePath: object.path,
    category: "client",
    deliveryLocked: false,
  });

  assert.match(attachment.storagePath, /^requests\//);
  assert.equal("publicUrl" in attachment, false);
  assert.equal((await store.getPrivateObject(object.path)).bytes.toString(), "private source");
});

test("store selection requires Supabase or explicit loopback demo mode", () => {
  const supabase = createPlatformStore({
    supabaseUrl: "https://project.supabase.co",
    supabaseServiceRoleKey: "server-secret",
  });
  assert.ok(supabase instanceof SupabasePlatformStore);

  const demo = createPlatformStore({ localDemoMode: true, hostname: "localhost" });
  assert.ok(demo instanceof MemoryPlatformStore);
  assert.equal(demo.available, true);

  const remoteDemo = createPlatformStore({ localDemoMode: true, hostname: "sleekacademia.com" });
  assert.equal(remoteDemo.available, false);
  assert.equal(remoteDemo.mode, "unavailable");
});
