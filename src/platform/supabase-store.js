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

  async createNotification(input) {
    const rows = await this.request("notifications", { method: "POST", body: toDatabase(input), prefer: "return=representation" });
    return fromDatabase(rows[0]);
  }

  async listNotifications(userId) {
    const rows = await this.request("notifications", { query: `user_id=eq.${encodeURIComponent(userId)}&order=created_at.desc` });
    return rows.map(fromDatabase);
  }
}
