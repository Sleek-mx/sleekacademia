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
    this.revisions = new Map();
    this.readStates = new Map();
    this.adminSessions = new Map();
    this.securityEvents = [];
    this.settings = {};
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

  async listProfiles() {
    return [...this.profiles.values()]
      .sort((a, b) => String(a.createdAt || "").localeCompare(String(b.createdAt || "")))
      .map(clone);
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
    const order = this.requests.get(orderId);
    if (!order) return null;
    if (order.firstDownloadedAt) return { ...clone(order), firstDownloadRecorded: false };
    const updated = await this.updateRequest(orderId, { firstDownloadedAt: timestamp });
    return { ...updated, firstDownloadRecorded: true };
  }

  async createRevision(input) {
    const rows = this.revisions.get(input.orderId) || [];
    if (input.included !== false && rows.some((revision) => revision.included !== false)) {
      const error = new Error("An included revision already exists for this order.");
      error.code = "INCLUDED_REVISION_EXISTS";
      throw error;
    }
    const revision = {
      id: input.id || randomUUID(),
      status: input.status || "requested",
      included: input.included !== false,
      ...clone(input),
      createdAt: this.now(),
      updatedAt: this.now(),
    };
    rows.push(revision);
    this.revisions.set(input.orderId, rows);
    return clone(revision);
  }

  async listRevisions(orderId) {
    return (this.revisions.get(orderId) || [])
      .slice()
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .map(clone);
  }

  async updateRevision(revisionId, patch) {
    for (const [orderId, rows] of this.revisions.entries()) {
      const index = rows.findIndex((revision) => revision.id === revisionId);
      if (index < 0) continue;
      const updated = { ...rows[index], ...clone(patch), id: revisionId, orderId, updatedAt: this.now() };
      rows[index] = updated;
      return clone(updated);
    }
    return null;
  }

  async getReadState(orderId, userId) {
    return clone(this.readStates.get(`${orderId}:${userId}`) || null);
  }

  async markOrderRead(input) {
    const key = `${input.orderId}:${input.userId}`;
    const previous = this.readStates.get(key) || {};
    const state = {
      ...previous,
      ...clone(input),
      createdAt: previous.createdAt || this.now(),
      updatedAt: this.now(),
    };
    this.readStates.set(key, state);
    return clone(state);
  }

  async createAdminSession(input) {
    if (input.token || input.sessionToken || !/^[a-f0-9]{64}$/i.test(String(input.tokenHash || ""))) {
      throw new Error("Admin sessions require a valid token hash and cannot store raw tokens.");
    }
    if ([...this.adminSessions.values()].some((session) => session.tokenHash === input.tokenHash)) {
      throw new Error("An admin session with this token hash already exists.");
    }
    const session = {
      id: input.id || randomUUID(),
      ...clone(input),
      revokedAt: input.revokedAt || null,
      createdAt: input.createdAt || this.now(),
    };
    this.adminSessions.set(session.id, session);
    return clone(session);
  }

  async getAdminSessionByTokenHash(tokenHash) {
    const session = [...this.adminSessions.values()].find((row) => row.tokenHash === tokenHash);
    return clone(session || null);
  }

  async touchAdminSession(sessionId, patch) {
    const session = this.adminSessions.get(sessionId);
    if (!session) return null;
    const updated = { ...session, ...clone(patch), id: session.id, tokenHash: session.tokenHash };
    this.adminSessions.set(session.id, updated);
    return clone(updated);
  }

  async revokeAdminSession(sessionId, revokedAt = this.now()) {
    return this.touchAdminSession(sessionId, { revokedAt });
  }

  async appendSecurityEvent(input) {
    const event = { id: input.id || randomUUID(), ...clone(input), createdAt: this.now() };
    this.securityEvents.push(event);
    return clone(event);
  }

  async listSecurityEvents() {
    return this.securityEvents
      .slice()
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .map(clone);
  }

  async getSettings() {
    return clone(this.settings);
  }

  async updateSettings(patch) {
    this.settings = { ...this.settings, ...clone(patch) };
    return clone(this.settings);
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

  async listAllMessages() {
    return [...this.messages.values()]
      .flat()
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

  async listAllAttachments() {
    return [...this.attachments.values()]
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .map(clone);
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

  async listAllPayments() {
    return [...this.payments.values()]
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
