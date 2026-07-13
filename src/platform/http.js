import express from "express";

import {
  canDownloadAttachment,
  canTransitionRequest,
  validateRequestInput,
} from "./domain.js";
import { getServerPaymentDue, recordVerifiedPayment } from "./payments.js";
import { isLoopbackHostname } from "./store.js";
import { validateUpload } from "./uploads.js";

function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

function text(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function getStore(req, fallbackStore) {
  return req.platformStore || fallbackStore;
}

async function requestAccess(store, requestId, identity) {
  const request = await store.getRequestForUser(requestId, identity.userId, { role: "admin" });
  if (!request) return { status: 404, error: "Request not found." };
  if (identity.role !== "admin" && request.userId !== identity.userId) {
    return { status: 403, error: "You do not have access to this request." };
  }
  return { request };
}

async function requestDetails(store, request) {
  const [events, messages, attachments, payments] = await Promise.all([
    store.listEvents(request.id),
    store.listMessages(request.id),
    store.listAttachments(request.id),
    store.listPayments(request.id),
  ]);
  return { request, events, messages, attachments, payments };
}

export function createPlatformRouter({ store: fallbackStore, resolveIdentity, paymentProvider = null, csrfService = null } = {}) {
  const router = express.Router();

  router.post("/payments/stripe-webhook", asyncRoute(async (req, res) => {
    const store = getStore(req, fallbackStore);
    if (!store?.available) return res.status(503).json({ error: "Payment storage is unavailable." });
    if (!paymentProvider?.stripeAvailable) return res.status(503).json({ error: "Stripe is not configured." });
    try {
      const rawBody = req.rawBody || Buffer.from(JSON.stringify(req.body || {}));
      const event = paymentProvider.parseStripeWebhook(rawBody, req.get("stripe-signature") || "");
      if (event.type !== "payment_intent.succeeded") return res.json({ received: true, ignored: true });
      const intent = event.data.object;
      const requestId = text(intent.metadata?.requestId, 200);
      const userId = text(intent.metadata?.userId, 200);
      const request = await store.getRequestForUser(requestId, userId, { role: "admin" });
      if (!request) return res.status(404).json({ error: "Payment request not found." });
      const result = await recordVerifiedPayment({
        store,
        request,
        provider: "stripe",
        providerTransactionId: intent.id,
        milestone: text(intent.metadata?.milestone, 40),
        amountCents: Number(intent.amount_received),
      });
      return res.json({ received: true, duplicate: result.duplicate });
    } catch (error) {
      return res.status(400).json({ error: error instanceof Error ? error.message : "Stripe webhook verification failed." });
    }
  }));

  router.use(asyncRoute(async (req, res, next) => {
    const store = getStore(req, fallbackStore);
    if (!store?.available) return res.status(503).json({ error: "The client workspace data service is not configured." });
    const identity = await resolveIdentity?.(req);
    if (!identity) return res.status(401).json({ error: "Authentication is required." });
    req.platformStore = store;
    req.platformIdentity = identity;
    return next();
  }));

  router.get("/session", asyncRoute(async (req, res) => {
    const profile = await req.platformStore.getProfile(req.platformIdentity.userId);
    const csrfToken = csrfService?.issueToken(req, res) || "";
    return res.json({ identity: req.platformIdentity, profile, csrfToken });
  }));

  router.post("/requests/handoff", asyncRoute(async (req, res) => {
    const { platformStore: store, platformIdentity: identity } = req;
    const idempotencyKey = text(req.body?.idempotencyKey, 120);
    if (!idempotencyKey || !/^[a-zA-Z0-9._:-]+$/.test(idempotencyKey)) {
      return res.status(400).json({ error: "A valid idempotency key is required." });
    }
    const validation = validateRequestInput(req.body);
    if (!validation.ok) return res.status(400).json({ error: "Please correct the request details.", fields: validation.errors });
    const existing = await store.findRequestByIdempotencyKey(identity.userId, idempotencyKey);
    if (existing) return res.json({ request: existing, duplicate: true });

    const profile = await store.upsertProfile({
      userId: identity.userId,
      role: identity.role,
      email: validation.value.email || identity.email,
      fullName: validation.value.name || identity.fullName,
      urgentPhone: validation.value.urgentPhone,
      school: validation.value.school,
    });
    const request = await store.createRequest({
      ...validation.value,
      userId: identity.userId,
      idempotencyKey,
      name: profile.fullName,
      email: profile.email,
      status: "Submitted",
      quoteCents: 0,
      paidCents: 0,
      currency: "usd",
    });
    await store.appendEvent({ requestId: request.id, actorId: identity.userId, type: "request.submitted", data: { status: "Submitted", service: request.service } });
    return res.status(201).json({ request, duplicate: false });
  }));

  router.get("/requests", asyncRoute(async (req, res) => {
    const requests = await req.platformStore.listRequestsForUser(req.platformIdentity.userId, { role: req.platformIdentity.role });
    return res.json({ requests });
  }));

  router.get("/requests/:requestId", asyncRoute(async (req, res) => {
    const access = await requestAccess(req.platformStore, req.params.requestId, req.platformIdentity);
    if (access.error) return res.status(access.status).json({ error: access.error });
    return res.json(await requestDetails(req.platformStore, access.request));
  }));

  router.post("/requests/:requestId/messages", asyncRoute(async (req, res) => {
    const access = await requestAccess(req.platformStore, req.params.requestId, req.platformIdentity);
    if (access.error) return res.status(access.status).json({ error: access.error });
    const body = text(req.body?.body, 4000);
    if (!body) return res.status(400).json({ error: "Message text is required." });
    const message = await req.platformStore.createMessage({
      requestId: access.request.id,
      userId: access.request.userId,
      senderId: req.platformIdentity.userId,
      senderRole: req.platformIdentity.role,
      body,
      idempotencyKey: text(req.body?.idempotencyKey, 120) || null,
    });
    await req.platformStore.appendEvent({ requestId: access.request.id, actorId: req.platformIdentity.userId, type: "message.created", data: { messageId: message.id } });
    return res.status(201).json({ message });
  }));

  router.post("/requests/:requestId/attachments", asyncRoute(async (req, res) => {
    const access = await requestAccess(req.platformStore, req.params.requestId, req.platformIdentity);
    if (access.error) return res.status(access.status).json({ error: access.error });
    const upload = validateUpload(req.body);
    if (upload.error) return res.status(400).json({ error: upload.error });
    const object = await req.platformStore.putPrivateObject({ requestId: access.request.id, ...upload });
    const attachment = await req.platformStore.createAttachment({
      requestId: access.request.id,
      userId: access.request.userId,
      uploadedBy: req.platformIdentity.userId,
      fileName: upload.fileName,
      mimeType: upload.mimeType,
      sizeBytes: upload.bytes.length,
      storagePath: object.path,
      category: "client",
      deliveryLocked: false,
    });
    await req.platformStore.appendEvent({ requestId: access.request.id, actorId: req.platformIdentity.userId, type: "attachment.created", data: { attachmentId: attachment.id, category: attachment.category } });
    return res.status(201).json({ attachment });
  }));

  router.post("/requests/:requestId/deliverables", asyncRoute(async (req, res) => {
    if (req.platformIdentity.role !== "admin") return res.status(403).json({ error: "Admin access is required." });
    const access = await requestAccess(req.platformStore, req.params.requestId, req.platformIdentity);
    if (access.error) return res.status(access.status).json({ error: access.error });
    const category = new Set(["draft", "final", "ai-report"]).has(req.body?.category) ? req.body.category : "";
    if (!category) return res.status(400).json({ error: "Choose draft, final, or ai-report delivery." });
    const upload = validateUpload(req.body);
    if (upload.error) return res.status(400).json({ error: upload.error });
    const object = await req.platformStore.putPrivateObject({ requestId: access.request.id, ...upload });
    const attachment = await req.platformStore.createAttachment({
      requestId: access.request.id,
      userId: access.request.userId,
      uploadedBy: req.platformIdentity.userId,
      fileName: upload.fileName,
      mimeType: upload.mimeType,
      sizeBytes: upload.bytes.length,
      storagePath: object.path,
      category,
      deliveryLocked: category === "final" || category === "ai-report",
    });
    await req.platformStore.appendEvent({ requestId: access.request.id, actorId: req.platformIdentity.userId, type: "deliverable.created", data: { attachmentId: attachment.id, category } });
    return res.status(201).json({ attachment });
  }));

  router.get("/attachments/:attachmentId/download", asyncRoute(async (req, res) => {
    const attachment = await req.platformStore.getAttachment(req.params.attachmentId);
    if (!attachment) return res.status(404).json({ error: "Attachment not found." });
    const access = await requestAccess(req.platformStore, attachment.requestId, req.platformIdentity);
    if (access.error) return res.status(access.status).json({ error: access.error });
    if (!canDownloadAttachment(access.request, attachment)) {
      return res.status(423).json({ error: "Confirmed full payment is required before this delivery can be downloaded." });
    }
    await req.platformStore.appendEvent({ requestId: access.request.id, actorId: req.platformIdentity.userId, type: "attachment.downloaded", data: { attachmentId: attachment.id } });
    if (req.platformStore.mode === "memory") {
      const object = await req.platformStore.getPrivateObject(attachment.storagePath);
      if (!object) return res.status(404).json({ error: "Stored file not found." });
      res.setHeader("Content-Type", attachment.mimeType);
      res.setHeader("Content-Disposition", `attachment; filename="${attachment.fileName.replace(/["\r\n]/g, "")}"`);
      return res.send(object.bytes);
    }
    const signed = await req.platformStore.createSignedObjectUrl(attachment.storagePath);
    return res.json(signed);
  }));

  router.patch("/profile", asyncRoute(async (req, res) => {
    const current = await req.platformStore.getProfile(req.platformIdentity.userId);
    const profile = await req.platformStore.upsertProfile({
      userId: req.platformIdentity.userId,
      role: current?.role || req.platformIdentity.role,
      email: current?.email || req.platformIdentity.email,
      fullName: current?.fullName || req.platformIdentity.fullName,
      urgentPhone: text(req.body?.urgentPhone, 80),
      school: text(req.body?.school, 180),
    });
    return res.json({ profile });
  }));

  router.patch("/requests/:requestId/quote", asyncRoute(async (req, res) => {
    if (req.platformIdentity.role !== "admin") return res.status(403).json({ error: "Admin access is required." });
    const access = await requestAccess(req.platformStore, req.params.requestId, req.platformIdentity);
    if (access.error) return res.status(access.status).json({ error: access.error });
    const quoteCents = Number(req.body?.quoteCents);
    if (!Number.isSafeInteger(quoteCents) || quoteCents < 100) return res.status(400).json({ error: "Quote must be at least 100 cents." });
    await req.platformStore.updateRequest(access.request.id, { quoteCents, status: "Quoted" });
    const request = await req.platformStore.updateRequest(access.request.id, { status: "Deposit Due" });
    await req.platformStore.appendEvent({ requestId: request.id, actorId: req.platformIdentity.userId, type: "request.quoted", data: { quoteCents, status: "Deposit Due" } });
    await req.platformStore.createNotification({ userId: request.userId, requestId: request.id, type: "payment.deposit_due", title: "Your quote is ready", body: "Confirm the 50 percent deposit to begin work." });
    return res.json({ request });
  }));

  router.patch("/requests/:requestId/status", asyncRoute(async (req, res) => {
    if (req.platformIdentity.role !== "admin") return res.status(403).json({ error: "Admin access is required." });
    const access = await requestAccess(req.platformStore, req.params.requestId, req.platformIdentity);
    if (access.error) return res.status(access.status).json({ error: access.error });
    const status = text(req.body?.status, 80);
    const transition = canTransitionRequest(access.request, status);
    if (!transition.ok) return res.status(409).json({ error: transition.error });
    const request = await req.platformStore.updateRequest(access.request.id, { status });
    await req.platformStore.appendEvent({ requestId: request.id, actorId: req.platformIdentity.userId, type: "request.status_changed", data: { from: access.request.status, to: status } });
    await req.platformStore.createNotification({ userId: request.userId, requestId: request.id, type: "request.status_changed", title: `Request status: ${status}`, body: "Open your workspace for the latest details." });
    return res.json({ request });
  }));

  router.post("/requests/:requestId/payments/stripe-intent", asyncRoute(async (req, res) => {
    if (!paymentProvider?.stripeAvailable) return res.status(503).json({ error: "Stripe is not configured." });
    const access = await requestAccess(req.platformStore, req.params.requestId, req.platformIdentity);
    if (access.error) return res.status(access.status).json({ error: access.error });
    const due = getServerPaymentDue(access.request);
    if (!due.milestone || !due.amountCents) return res.status(409).json({ error: "This request has no payment due." });
    const intent = await paymentProvider.createStripeIntent({ request: access.request, due });
    return res.status(201).json(intent);
  }));

  router.post("/requests/:requestId/payments/paypal-order", asyncRoute(async (req, res) => {
    if (!paymentProvider?.paypalAvailable) return res.status(503).json({ error: "PayPal is not configured." });
    const access = await requestAccess(req.platformStore, req.params.requestId, req.platformIdentity);
    if (access.error) return res.status(access.status).json({ error: access.error });
    const due = getServerPaymentDue(access.request);
    if (!due.milestone || !due.amountCents) return res.status(409).json({ error: "This request has no payment due." });
    const order = await paymentProvider.createPayPalOrder({ request: access.request, due });
    return res.status(201).json(order);
  }));

  router.post("/requests/:requestId/payments/paypal-capture", asyncRoute(async (req, res) => {
    if (!paymentProvider?.paypalAvailable) return res.status(503).json({ error: "PayPal is not configured." });
    const access = await requestAccess(req.platformStore, req.params.requestId, req.platformIdentity);
    if (access.error) return res.status(access.status).json({ error: access.error });
    const orderId = text(req.body?.orderId, 200);
    if (!orderId) return res.status(400).json({ error: "PayPal order ID is required." });
    const due = getServerPaymentDue(access.request);
    if (!due.milestone || !due.amountCents) return res.status(409).json({ error: "This request has no payment due." });
    const capture = await paymentProvider.capturePayPalOrder(orderId, { requestId: access.request.id, due });
    if (capture.requestId !== access.request.id) return res.status(409).json({ error: "PayPal order does not belong to this request." });
    const result = await recordVerifiedPayment({
      store: req.platformStore,
      request: access.request,
      provider: "paypal",
      providerTransactionId: capture.providerTransactionId,
      milestone: capture.milestone,
      amountCents: capture.amountCents,
    });
    return res.json(result);
  }));

  router.post("/requests/:requestId/payments/demo-confirm", asyncRoute(async (req, res) => {
    if (!req.platformIdentity.demo || !isLoopbackHostname(req.hostname)) {
      return res.status(403).json({ error: "Payment simulation is available only in localhost demo mode." });
    }
    const access = await requestAccess(req.platformStore, req.params.requestId, req.platformIdentity);
    if (access.error) return res.status(access.status).json({ error: access.error });
    const due = getServerPaymentDue(access.request);
    if (!due.milestone || !due.amountCents) return res.status(409).json({ error: "This request has no payment due." });
    const result = await recordVerifiedPayment({
      store: req.platformStore,
      request: access.request,
      provider: "demo",
      providerTransactionId: `demo:${access.request.id}:${due.milestone}:${due.amountCents}`,
      milestone: due.milestone,
      amountCents: due.amountCents,
    });
    return res.json({ ...result, simulated: true });
  }));

  router.get("/notifications", asyncRoute(async (req, res) => {
    const notifications = await req.platformStore.listNotifications(req.platformIdentity.userId);
    return res.json({ notifications });
  }));

  router.use((error, _req, res, _next) => {
    console.error("Platform API error:", error);
    return res.status(500).json({ error: "The client workspace could not complete this action." });
  });

  return router;
}
