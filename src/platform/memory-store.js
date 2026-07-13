import { randomUUID } from "node:crypto";

function clone(value) {
  return value == null ? value : structuredClone(value);
}

function safeFileName(value = "file") {
  const normalized = String(value).normalize("NFKD").replace(/[^a-zA-Z0-9._-]+/g, "-");
  return normalized.replace(/^-+|-+$/g, "").slice(0, 120) || "file";
}

export class MemoryPlatformStore {
  constructor({ now = () => new Date().toISOString() } = {}) {
    this.available = true;
    this.mode = "memory";
    this.now = now;
    this.profiles = new Map();
    this.requests = new Map();
    this.events = new Map();
    this.messages = new Map();
    this.attachments = new Map();
    this.payments = new Map();
    this.notifications = new Map();
    this.objects = new Map();
  }

  async upsertProfile(profile) {
    const previous = this.profiles.get(profile.userId) || {};
    const timestamp = this.now();
    const next = {
      ...previous,
      ...clone(profile),
      createdAt: previous.createdAt || timestamp,
      updatedAt: timestamp,
    };
    this.profiles.set(profile.userId, next);
    return clone(next);
  }

  async getProfile(userId) {
    return clone(this.profiles.get(userId) || null);
  }

  async findRequestByIdempotencyKey(userId, idempotencyKey) {
    const row = [...this.requests.values()].find(
      (request) => request.userId === userId && request.idempotencyKey === idempotencyKey,
    );
    return clone(row || null);
  }

  async createRequest(input) {
    const existing = await this.findRequestByIdempotencyKey(input.userId, input.idempotencyKey);
    if (existing) return existing;
    const timestamp = this.now();
    const request = {
      id: input.id || randomUUID(),
      ...clone(input),
      status: input.status || "Submitted",
      quoteCents: Number.isSafeInteger(input.quoteCents) ? input.quoteCents : 0,
      paidCents: Number.isSafeInteger(input.paidCents) ? input.paidCents : 0,
      currency: input.currency || "usd",
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.requests.set(request.id, request);
    return clone(request);
  }

  async listRequestsForUser(userId, { role = "student" } = {}) {
    return [...this.requests.values()]
      .filter((request) => role === "admin" || request.userId === userId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .map(clone);
  }

  async getRequestForUser(requestId, userId, { role = "student" } = {}) {
    const request = this.requests.get(requestId);
    if (!request || (role !== "admin" && request.userId !== userId)) return null;
    return clone(request);
  }

  async updateRequest(requestId, patch) {
    const request = this.requests.get(requestId);
    if (!request) return null;
    const updated = { ...request, ...clone(patch), id: request.id, updatedAt: this.now() };
    this.requests.set(requestId, updated);
    return clone(updated);
  }

  async appendEvent(input) {
    const event = {
      id: input.id || randomUUID(),
      ...clone(input),
      createdAt: this.now(),
    };
    const rows = this.events.get(input.requestId) || [];
    rows.push(event);
    this.events.set(input.requestId, rows);
    return clone(event);
  }

  async listEvents(requestId) {
    return (this.events.get(requestId) || [])
      .slice()
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .map(clone);
  }

  async createMessage(input) {
    const message = {
      id: input.id || randomUUID(),
      ...clone(input),
      createdAt: this.now(),
    };
    const rows = this.messages.get(input.requestId) || [];
    rows.push(message);
    this.messages.set(input.requestId, rows);
    return clone(message);
  }

  async listMessages(requestId) {
    return (this.messages.get(requestId) || [])
      .slice()
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .map(clone);
  }

  async createAttachment(input) {
    const attachment = {
      id: input.id || randomUUID(),
      ...clone(input),
      createdAt: this.now(),
    };
    this.attachments.set(attachment.id, attachment);
    return clone(attachment);
  }

  async listAttachments(requestId) {
    return [...this.attachments.values()]
      .filter((attachment) => attachment.requestId === requestId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .map(clone);
  }

  async getAttachment(attachmentId) {
    return clone(this.attachments.get(attachmentId) || null);
  }

  async putPrivateObject({ requestId, fileName, mimeType, bytes }) {
    const path = `requests/${requestId}/${randomUUID()}-${safeFileName(fileName)}`;
    this.objects.set(path, { bytes: Buffer.from(bytes), mimeType, fileName, path });
    return { path };
  }

  async getPrivateObject(path) {
    const object = this.objects.get(path);
    return object ? { ...object, bytes: Buffer.from(object.bytes) } : null;
  }

  async createSignedObjectUrl(path) {
    return { signedUrl: `/api/platform/storage/${encodeURIComponent(path)}`, expiresIn: 60 };
  }

  async createPayment(input) {
    const duplicate = await this.findPaymentByProviderId(input.provider, input.providerTransactionId);
    if (duplicate) {
      const error = new Error("A payment with this provider transaction ID already exists.");
      error.code = "DUPLICATE_PAYMENT";
      throw error;
    }
    const payment = {
      id: input.id || randomUUID(),
      ...clone(input),
      createdAt: this.now(),
      confirmedAt: input.status === "confirmed" ? this.now() : null,
    };
    this.payments.set(payment.id, payment);
    return clone(payment);
  }

  async findPaymentByProviderId(provider, providerTransactionId) {
    const row = [...this.payments.values()].find(
      (payment) => payment.provider === provider && payment.providerTransactionId === providerTransactionId,
    );
    return clone(row || null);
  }

  async listPayments(requestId) {
    return [...this.payments.values()]
      .filter((payment) => payment.requestId === requestId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .map(clone);
  }

  async createNotification(input) {
    const notification = {
      id: input.id || randomUUID(),
      ...clone(input),
      readAt: input.readAt || null,
      createdAt: this.now(),
    };
    this.notifications.set(notification.id, notification);
    return clone(notification);
  }

  async listNotifications(userId) {
    return [...this.notifications.values()]
      .filter((notification) => notification.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map(clone);
  }
}
