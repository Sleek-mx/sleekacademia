import { randomUUID } from "node:crypto";

function camelToSnake(value) {
  return value.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function snakeToCamel(value) {
  return value.replace(/_([a-z])/g, (_match, letter) => letter.toUpperCase());
}

function toDatabase(input) {
  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => [camelToSnake(key), value]),
  );
}

function fromDatabase(input) {
  if (!input) return null;
  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => [snakeToCamel(key), value]),
  );
}

function safeFileName(value = "file") {
  return String(value).normalize("NFKD").replace(/[^a-zA-Z0-9._-]+/g, "-").slice(0, 120) || "file";
}

export class SupabasePlatformStore {
  constructor({ url, serviceRoleKey, bucket = "sleek-academia-private", fetchImpl = globalThis.fetch }) {
    this.available = true;
    this.mode = "supabase";
    this.url = String(url).replace(/\/$/, "");
    this.serviceRoleKey = serviceRoleKey;
    this.bucket = bucket;
    this.fetch = fetchImpl;
  }

  headers(extra = {}) {
    return {
      apikey: this.serviceRoleKey,
      Authorization: `Bearer ${this.serviceRoleKey}`,
      ...extra,
    };
  }

  async request(table, { method = "GET", query = "", body, prefer } = {}) {
    const response = await this.fetch(`${this.url}/rest/v1/${table}${query ? `?${query}` : ""}`, {
      method,
      headers: this.headers({
        "Content-Type": "application/json",
        ...(prefer ? { Prefer: prefer } : {}),
      }),
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    if (!response.ok) {
      const details = await response.text();
      const error = new Error(`Supabase ${table} request failed (${response.status}).`);
      error.details = details;
      throw error;
    }
    if (response.status === 204) return null;
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  async upsertProfile(profile) {
    const rows = await this.request("profiles", {
      method: "POST",
      query: "on_conflict=user_id",
      body: toDatabase(profile),
      prefer: "resolution=merge-duplicates,return=representation",
    });
    return fromDatabase(rows[0]);
  }

  async getProfile(userId) {
    const rows = await this.request("profiles", { query: `user_id=eq.${encodeURIComponent(userId)}&limit=1` });
    return fromDatabase(rows[0]);
  }

  async listProfiles() {
    const rows = await this.request("profiles", { query: "order=created_at.asc" });
    return rows.map(fromDatabase);
  }

  async findRequestByIdempotencyKey(userId, idempotencyKey) {
    const rows = await this.request("service_requests", {
      query: `user_id=eq.${encodeURIComponent(userId)}&idempotency_key=eq.${encodeURIComponent(idempotencyKey)}&limit=1`,
    });
    return fromDatabase(rows[0]);
  }

  async createRequest(input) {
    const existing = await this.findRequestByIdempotencyKey(input.userId, input.idempotencyKey);
    if (existing) return existing;
    const rows = await this.request("service_requests", {
      method: "POST",
      body: toDatabase({ ...input, id: input.id || randomUUID() }),
      prefer: "return=representation",
    });
    return fromDatabase(rows[0]);
  }

  async listRequestsForUser(userId, { role = "student" } = {}) {
    const filter = role === "admin" ? "" : `user_id=eq.${encodeURIComponent(userId)}&`;
    const rows = await this.request("service_requests", { query: `${filter}order=updated_at.desc` });
    return rows.map(fromDatabase);
  }

  async getRequestForUser(requestId, userId, { role = "student" } = {}) {
    const owner = role === "admin" ? "" : `&user_id=eq.${encodeURIComponent(userId)}`;
    const rows = await this.request("service_requests", {
      query: `id=eq.${encodeURIComponent(requestId)}${owner}&limit=1`,
    });
    return fromDatabase(rows[0]);
  }

  async updateRequest(requestId, patch) {
    const rows = await this.request("service_requests", {
      method: "PATCH",
      query: `id=eq.${encodeURIComponent(requestId)}`,
      body: toDatabase(patch),
      prefer: "return=representation",
    });
    return fromDatabase(rows[0]);
  }

  async createOrder(input) {
    return this.createRequest(input);
  }

  async listOrdersForUser(userId, options = {}) {
    return this.listRequestsForUser(userId, options);
  }

  async getOrderForUser(orderId, userId, options = {}) {
    return this.getRequestForUser(orderId, userId, options);
  }

  async updateOrder(orderId, patch) {
    return this.updateRequest(orderId, patch);
  }

  async setFirstDownloadedAt(orderId, timestamp) {
    const rows = await this.request("service_requests", {
      method: "PATCH",
      query: `id=eq.${encodeURIComponent(orderId)}&first_downloaded_at=is.null`,
      body: { first_downloaded_at: timestamp },
      prefer: "return=representation",
    });
    if (rows[0]) return fromDatabase(rows[0]);
    const existing = await this.request("service_requests", {
      query: `id=eq.${encodeURIComponent(orderId)}&limit=1`,
    });
    return fromDatabase(existing[0]);
  }

  async createRevision(input) {
    if (input.included !== false) {
      const existing = await this.request("revisions", {
        query: `order_id=eq.${encodeURIComponent(input.orderId)}&included=eq.true&limit=1`,
      });
      if (existing[0]) {
        const error = new Error("An included revision already exists for this order.");
        error.code = "INCLUDED_REVISION_EXISTS";
        throw error;
      }
    }
    const rows = await this.request("revisions", {
      method: "POST",
      body: toDatabase({
        id: input.id || randomUUID(),
        status: input.status || "requested",
        included: input.included !== false,
        ...input,
      }),
      prefer: "return=representation",
    });
    return fromDatabase(rows[0]);
  }

  async listRevisions(orderId) {
    const rows = await this.request("revisions", {
      query: `order_id=eq.${encodeURIComponent(orderId)}&order=created_at.asc`,
    });
    return rows.map(fromDatabase);
  }

  async getReadState(orderId, userId) {
    const rows = await this.request("order_read_states", {
      query: `order_id=eq.${encodeURIComponent(orderId)}&user_id=eq.${encodeURIComponent(userId)}&limit=1`,
    });
    return fromDatabase(rows[0]);
  }

  async markOrderRead(input) {
    const rows = await this.request("order_read_states", {
      method: "POST",
      query: "on_conflict=order_id,user_id",
      body: toDatabase(input),
      prefer: "resolution=merge-duplicates,return=representation",
    });
    return fromDatabase(rows[0]);
  }

  async createAdminSession(input) {
    if (input.token || input.sessionToken || !/^[a-f0-9]{64}$/i.test(String(input.tokenHash || ""))) {
      throw new Error("Admin sessions require a valid token hash and cannot store raw tokens.");
    }
    const rows = await this.request("admin_sessions", {
      method: "POST",
      body: toDatabase({ id: input.id || randomUUID(), revokedAt: input.revokedAt || null, ...input }),
      prefer: "return=representation",
    });
    return fromDatabase(rows[0]);
  }

  async getAdminSessionByTokenHash(tokenHash) {
    const rows = await this.request("admin_sessions", {
      query: `token_hash=eq.${encodeURIComponent(tokenHash)}&limit=1`,
    });
    return fromDatabase(rows[0]);
  }

  async touchAdminSession(sessionId, patch) {
    const { tokenHash: _ignoredTokenHash, id: _ignoredId, ...safePatch } = patch;
    const rows = await this.request("admin_sessions", {
      method: "PATCH",
      query: `id=eq.${encodeURIComponent(sessionId)}`,
      body: toDatabase(safePatch),
      prefer: "return=representation",
    });
    return fromDatabase(rows[0]);
  }

  async revokeAdminSession(sessionId, revokedAt = new Date().toISOString()) {
    return this.touchAdminSession(sessionId, { revokedAt });
  }

  async appendSecurityEvent(input) {
    const rows = await this.request("security_events", {
      method: "POST",
      body: toDatabase({ id: input.id || randomUUID(), ...input }),
      prefer: "return=representation",
    });
    return fromDatabase(rows[0]);
  }

  async listSecurityEvents() {
    const rows = await this.request("security_events", { query: "order=created_at.asc" });
    return rows.map(fromDatabase);
  }

  async getSettings() {
    const rows = await this.request("platform_settings", { query: "id=eq.default&limit=1" });
    return rows[0]?.settings ? structuredClone(rows[0].settings) : {};
  }

  async updateSettings(patch, { updatedBy = "system" } = {}) {
    const current = await this.getSettings();
    const settings = { ...current, ...structuredClone(patch) };
    const rows = await this.request("platform_settings", {
      method: "POST",
      query: "on_conflict=id",
      body: { id: "default", settings, updated_by: updatedBy },
      prefer: "resolution=merge-duplicates,return=representation",
    });
    return structuredClone(rows[0]?.settings || settings);
  }

  async appendEvent(input) {
    const rows = await this.request("request_events", { method: "POST", body: toDatabase(input), prefer: "return=representation" });
    return fromDatabase(rows[0]);
  }

  async listEvents(requestId) {
    const rows = await this.request("request_events", { query: `request_id=eq.${encodeURIComponent(requestId)}&order=created_at.asc` });
    return rows.map(fromDatabase);
  }

  async createMessage(input) {
    const rows = await this.request("messages", { method: "POST", body: toDatabase(input), prefer: "return=representation" });
    return fromDatabase(rows[0]);
  }

  async listMessages(requestId) {
    const rows = await this.request("messages", { query: `request_id=eq.${encodeURIComponent(requestId)}&order=created_at.asc` });
    return rows.map(fromDatabase);
  }

  async listAllMessages() {
    const rows = await this.request("messages", { query: "order=created_at.asc" });
    return rows.map(fromDatabase);
  }

  async createAttachment(input) {
    const rows = await this.request("attachments", { method: "POST", body: toDatabase(input), prefer: "return=representation" });
    return fromDatabase(rows[0]);
  }

  async listAttachments(requestId) {
    const rows = await this.request("attachments", { query: `request_id=eq.${encodeURIComponent(requestId)}&order=created_at.asc` });
    return rows.map(fromDatabase);
  }

  async getAttachment(attachmentId) {
    const rows = await this.request("attachments", { query: `id=eq.${encodeURIComponent(attachmentId)}&limit=1` });
    return fromDatabase(rows[0]);
  }

  async listAllAttachments() {
    const rows = await this.request("attachments", { query: "order=created_at.asc" });
    return rows.map(fromDatabase);
  }

  async putPrivateObject({ requestId, fileName, mimeType, bytes }) {
    const path = `requests/${requestId}/${randomUUID()}-${safeFileName(fileName)}`;
    const response = await this.fetch(`${this.url}/storage/v1/object/${this.bucket}/${path}`, {
      method: "POST",
      headers: this.headers({ "Content-Type": mimeType, "x-upsert": "false" }),
      body: bytes,
    });
    if (!response.ok) throw new Error(`Supabase private upload failed (${response.status}).`);
    return { path };
  }

  async getPrivateObject(path) {
    const response = await this.fetch(`${this.url}/storage/v1/object/authenticated/${this.bucket}/${path}`, {
      headers: this.headers(),
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Supabase private download failed (${response.status}).`);
    return { bytes: Buffer.from(await response.arrayBuffer()), mimeType: response.headers.get("content-type") || "application/octet-stream", path };
  }

  async createSignedObjectUrl(path) {
    const response = await this.fetch(`${this.url}/storage/v1/object/sign/${this.bucket}/${path}`, {
      method: "POST",
      headers: this.headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ expiresIn: 60 }),
    });
    if (!response.ok) throw new Error(`Supabase signed URL failed (${response.status}).`);
    const data = await response.json();
    return { signedUrl: `${this.url}/storage/v1${data.signedURL}`, expiresIn: 60 };
  }

  async createPayment(input) {
    try {
      const rows = await this.request("payments", { method: "POST", body: toDatabase(input), prefer: "return=representation" });
      return fromDatabase(rows[0]);
    } catch (error) {
      if (String(error.details || "").includes("payments_provider_transaction_unique")) error.code = "DUPLICATE_PAYMENT";
      throw error;
    }
  }

  async findPaymentByProviderId(provider, providerTransactionId) {
    const rows = await this.request("payments", {
      query: `provider=eq.${encodeURIComponent(provider)}&provider_transaction_id=eq.${encodeURIComponent(providerTransactionId)}&limit=1`,
    });
    return fromDatabase(rows[0]);
  }

  async listPayments(requestId) {
    const rows = await this.request("payments", { query: `request_id=eq.${encodeURIComponent(requestId)}&order=created_at.asc` });
    return rows.map(fromDatabase);
  }

  async listAllPayments() {
    const rows = await this.request("payments", { query: "order=created_at.asc" });
    return rows.map(fromDatabase);
  }

  async createNotification(input) {
    const rows = await this.request("notifications", { method: "POST", body: toDatabase(input), prefer: "return=representation" });
    return fromDatabase(rows[0]);
  }

  async listNotifications(userId) {
    const rows = await this.request("notifications", { query: `user_id=eq.${encodeURIComponent(userId)}&order=created_at.desc` });
    return rows.map(fromDatabase);
  }
}
