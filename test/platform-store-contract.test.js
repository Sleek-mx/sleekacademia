import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { MemoryPlatformStore } from "../src/platform/memory-store.js";
import { SupabasePlatformStore } from "../src/platform/supabase-store.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NOW = "2026-07-13T12:00:00.000Z";

function clone(value) {
  return value === undefined ? undefined : structuredClone(value);
}

function createRestHarness() {
  const tables = new Map();
  let sequence = 0;

  function rowsFor(table) {
    if (!tables.has(table)) tables.set(table, []);
    return tables.get(table);
  }

  function filtered(table, query) {
    const parameters = new URLSearchParams(query || "");
    let rows = rowsFor(table).slice();
    for (const [field, expression] of parameters.entries()) {
      if (new Set(["order", "limit", "on_conflict"]).has(field)) continue;
      if (expression.startsWith("eq.")) {
        const expected = expression.slice(3);
        rows = rows.filter((row) => String(row[field]) === expected);
      } else if (expression === "is.null") {
        rows = rows.filter((row) => row[field] === null || row[field] === undefined);
      }
    }
    const order = parameters.get("order");
    if (order) {
      const [field, direction] = order.split(".");
      rows.sort((a, b) => String(a[field] || "").localeCompare(String(b[field] || "")) * (direction === "desc" ? -1 : 1));
    }
    const limit = Number(parameters.get("limit") || 0);
    return limit ? rows.slice(0, limit) : rows;
  }

  return {
    async request(table, { method = "GET", query = "", body } = {}) {
      if (method === "GET") return clone(filtered(table, query));
      if (method === "PATCH") {
        const matches = new Set(filtered(table, query));
        const updated = [];
        for (const row of rowsFor(table)) {
          if (!matches.has(row)) continue;
          Object.assign(row, clone(body), { updated_at: NOW });
          updated.push(clone(row));
        }
        return updated;
      }
      if (method === "POST") {
        const incoming = Array.isArray(body) ? body : [body];
        const created = [];
        for (const value of incoming) {
          const row = clone(value);
          const key = table === "profiles" ? "user_id" : table === "platform_settings" ? "id" : null;
          const existing = key ? rowsFor(table).find((candidate) => candidate[key] === row[key]) : null;
          if (existing) {
            Object.assign(existing, row, { updated_at: NOW });
            created.push(clone(existing));
            continue;
          }
          if (!row.id) row.id = `fake-${++sequence}`;
          if (!row.created_at) row.created_at = NOW;
          if (!row.updated_at) row.updated_at = NOW;
          rowsFor(table).push(row);
          created.push(clone(row));
        }
        return created;
      }
      throw new Error(`Unsupported fake REST method ${method}.`);
    },
  };
}

function storeFactories() {
  return [
    ["memory", () => new MemoryPlatformStore({ now: () => NOW })],
    ["supabase", () => {
      const harness = createRestHarness();
      const store = new SupabasePlatformStore({ url: "https://example.supabase.co", serviceRoleKey: "test-only" });
      store.request = harness.request;
      return store;
    }],
  ];
}

for (const [name, createStore] of storeFactories()) {
  test(`${name} store keeps order names and tenant isolation`, async () => {
    const store = createStore();
    const order = await store.createOrder({
      userId: "client-a",
      idempotencyKey: "order-001",
      service: "essay",
      subject: "Nursing",
      description: "Evidence review",
      name: "Client A",
      email: "a@example.com",
      status: "Available",
      quoteCents: 6000,
      paidCents: 0,
      pricingSnapshot: { totalCents: 6000, depositCents: 3000, balanceCents: 3000 },
    });

    assert.equal((await store.listOrdersForUser("client-a"))[0].id, order.id);
    assert.equal((await store.listOrdersForUser("client-b")).length, 0);
    assert.equal((await store.getOrderForUser(order.id, "client-b")), null);
    assert.equal((await store.getOrderForUser(order.id, "mcx", { role: "admin" })).id, order.id);
    assert.equal((await store.updateOrder(order.id, { materialsComplete: true })).materialsComplete, true);
  });

  test(`${name} store permits only one included revision per order`, async () => {
    const store = createStore();
    const first = await store.createRevision({ orderId: "order-1", userId: "client-a", instructions: "Correct section two.", included: true });
    assert.equal(first.included, true);
    await assert.rejects(
      store.createRevision({ orderId: "order-1", userId: "client-a", instructions: "Another change.", included: true }),
      /included revision already exists/i,
    );
    assert.equal((await store.listRevisions("order-1")).length, 1);
  });

  test(`${name} store tracks per-user order read state`, async () => {
    const store = createStore();
    assert.equal(await store.getReadState("order-1", "client-a"), null);
    const state = await store.markOrderRead({ orderId: "order-1", userId: "client-a", lastMessageReadAt: NOW });
    assert.equal(state.lastMessageReadAt, NOW);
    assert.equal((await store.getReadState("order-1", "client-a")).lastMessageReadAt, NOW);
  });

  test(`${name} store persists only hashed revocable admin sessions`, async () => {
    const store = createStore();
    const tokenHash = "a".repeat(64);
    const session = await store.createAdminSession({
      tokenHash,
      username: "MCX",
      csrfHash: "b".repeat(64),
      createdAt: NOW,
      lastSeenAt: NOW,
      idleExpiresAt: "2026-07-13T12:30:00.000Z",
      absoluteExpiresAt: "2026-07-13T20:00:00.000Z",
    });
    assert.equal("token" in session, false);
    assert.equal((await store.getAdminSessionByTokenHash(tokenHash)).id, session.id);

    const touched = await store.touchAdminSession(session.id, { lastSeenAt: "2026-07-13T12:10:00.000Z" });
    assert.equal(touched.lastSeenAt, "2026-07-13T12:10:00.000Z");
    const revoked = await store.revokeAdminSession(session.id, "2026-07-13T12:11:00.000Z");
    assert.equal(revoked.revokedAt, "2026-07-13T12:11:00.000Z");
  });

  test(`${name} store appends isolated security events`, async () => {
    const store = createStore();
    const event = await store.appendSecurityEvent({ type: "admin.login_failed", actor: "MCX", data: { reason: "invalid" } });
    event.data.reason = "changed";
    const rows = await store.listSecurityEvents();
    assert.equal(rows.length, 1);
    assert.equal(rows[0].data.reason, "invalid");
  });

  test(`${name} store exposes reporting reads and atomic first download`, async () => {
    const store = createStore();
    await store.upsertProfile({ userId: "client-a", role: "student", email: "a@example.com", fullName: "Client A" });
    const order = await store.createOrder({ userId: "client-a", idempotencyKey: "report-order", status: "Delivered" });
    await store.createMessage({ requestId: order.id, userId: "client-a", senderId: "client-a", senderRole: "student", body: "Hello" });
    await store.createPayment({ requestId: order.id, userId: "client-a", provider: "stripe", providerTransactionId: "pi-report", milestone: "balance", amountCents: 100, currency: "usd", status: "confirmed" });
    await store.createAttachment({ requestId: order.id, userId: "client-a", uploadedBy: "mcx", fileName: "final.pdf", mimeType: "application/pdf", sizeBytes: 10, storagePath: "private/final.pdf", category: "final", deliveryLocked: true });

    assert.equal((await store.listProfiles()).length, 1);
    assert.equal((await store.listAllMessages()).length, 1);
    assert.equal((await store.listAllPayments()).length, 1);
    assert.equal((await store.listAllAttachments()).length, 1);

    const first = await store.setFirstDownloadedAt(order.id, NOW);
    const second = await store.setFirstDownloadedAt(order.id, "2026-07-13T13:00:00.000Z");
    assert.equal(first.firstDownloadedAt, NOW);
    assert.equal(second.firstDownloadedAt, NOW);
  });

  test(`${name} store merges protected platform settings`, async () => {
    const store = createStore();
    assert.deepEqual(await store.getSettings(), {});
    await store.updateSettings({ revisionDays: 7, writingPageCents: 1500 }, { updatedBy: "MCX" });
    const updated = await store.updateSettings({ examHourCents: 15000 }, { updatedBy: "MCX" });
    assert.deepEqual(updated, { revisionDays: 7, writingPageCents: 1500, examHourCents: 15000 });
  });
}

test("forward-only migration contains protected platform tables and no plaintext credential columns", () => {
  const migrationPath = path.join(root, "supabase/migrations/20260713_admin_client_platform.sql");
  assert.equal(fs.existsSync(migrationPath), true, "platform extension migration is missing");
  const sql = fs.readFileSync(migrationPath, "utf8");
  for (const table of ["revisions", "order_read_states", "admin_sessions", "security_events", "platform_settings"]) {
    assert.match(sql, new RegExp(`create table if not exists public\\.${table}`));
  }
  assert.match(sql, /prevent_security_event_mutation/);
  assert.doesNotMatch(sql, /password\s+text|session_token\s+text/i);
});
