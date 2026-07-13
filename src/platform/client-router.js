import express from "express";

import { canDownloadAttachment, deriveOrderQueues, getRevisionEligibility, validateRequestInput } from "./domain.js";
import { asyncRoute, orderAccess, orderDetails, publicAttachment, text } from "./http-utils.js";
import { getServerPaymentDue, recordVerifiedPayment } from "./payments.js";
import { calculateOrderQuote } from "./pricing.js";
import { isLoopbackHostname } from "./store.js";
import { validateUpload } from "./uploads.js";

function aliases(router, method, paths, handler) {
  for (const path of paths) router[method](path, handler);
}

function clientOrderAccess(req) {
  return orderAccess(req.platformStore, req.params.orderId || req.params.requestId, { ...req.platformIdentity, role: "student" });
}

function calculateInitialPricing(value) {
  try {
    return calculateOrderQuote(value);
  } catch (error) {
    if (value.service === "tutoring" || value.service === "other") return null;
    throw error;
  }
}

function withQueues(order) {
  return { ...order, queues: deriveOrderQueues(order, { now: new Date(), unreadCount: order.unreadCount || 0 }) };
}

export function createClientRouter({ paymentProvider = null, csrfService = null } = {}) {
  const router = express.Router();

  router.get("/session", asyncRoute(async (req, res) => {
    const profile = await req.platformStore.getProfile(req.platformIdentity.userId);
    return res.json({ identity: req.platformIdentity, profile, csrfToken: csrfService?.issueToken(req, res) || "" });
  }));

  const handoff = asyncRoute(async (req, res) => {
    const { platformStore: store, platformIdentity: identity } = req;
    const idempotencyKey = text(req.body?.idempotencyKey, 120);
    if (!idempotencyKey || !/^[a-zA-Z0-9._:-]+$/.test(idempotencyKey)) return res.status(400).json({ error: "A valid idempotency key is required." });
    const validation = validateRequestInput(req.body);
    if (!validation.ok) return res.status(400).json({ error: "Please correct the order details.", fields: validation.errors });
    const existing = await store.findRequestByIdempotencyKey(identity.userId, idempotencyKey);
    if (existing) return res.json({ order: existing, request: existing, duplicate: true });
    let pricingSnapshot;
    try { pricingSnapshot = calculateInitialPricing(validation.value); }
    catch (error) { return res.status(400).json({ error: error.message }); }
    const profile = await store.upsertProfile({
      userId: identity.userId, role: "student", email: validation.value.email || identity.email,
      fullName: validation.value.name || identity.fullName, urgentPhone: validation.value.urgentPhone, school: validation.value.school,
    });
    const order = await store.createOrder({
      ...validation.value, userId: identity.userId, idempotencyKey, name: profile.fullName, email: profile.email,
      status: "Available", quoteCents: pricingSnapshot?.totalCents || 0, paidCents: 0,
      pricingSnapshot: pricingSnapshot || null, currency: "usd",
    });
    await store.appendEvent({ requestId: order.id, actorId: identity.userId, type: "order.submitted", data: { status: order.status, service: order.service } });
    return res.status(201).json({ order, request: order, duplicate: false });
  });
  aliases(router, "post", ["/orders/handoff", "/requests/handoff"], handoff);

  const list = asyncRoute(async (req, res) => {
    const orders = (await req.platformStore.listOrdersForUser(req.platformIdentity.userId, { role: "student" })).map(withQueues);
    return res.json({ orders, requests: orders });
  });
  aliases(router, "get", ["/orders", "/requests"], list);

  const detail = asyncRoute(async (req, res) => {
    const access = await clientOrderAccess(req);
    if (access.error) return res.status(access.status).json({ error: access.error });
    const payload = await orderDetails(req.platformStore, access.order, req.platformIdentity);
    payload.order = withQueues(payload.order);
    payload.revisionEligibility = getRevisionEligibility(payload.order, payload.revisions);
    return res.json({ ...payload, request: payload.order });
  });
  aliases(router, "get", ["/orders/:orderId", "/requests/:requestId"], detail);

  const message = asyncRoute(async (req, res) => {
    const access = await clientOrderAccess(req);
    if (access.error) return res.status(access.status).json({ error: access.error });
    const body = text(req.body?.body, 4000);
    if (!body) return res.status(400).json({ error: "Message text is required." });
    const row = await req.platformStore.createMessage({
      requestId: access.order.id, userId: access.order.userId, senderId: req.platformIdentity.userId,
      senderRole: "student", body, idempotencyKey: text(req.body?.idempotencyKey, 120) || null,
    });
    await req.platformStore.appendEvent({ requestId: access.order.id, actorId: req.platformIdentity.userId, type: "message.created", data: { messageId: row.id } });
    return res.status(201).json({ message: row });
  });
  aliases(router, "post", ["/orders/:orderId/messages", "/requests/:requestId/messages"], message);

  const attachment = asyncRoute(async (req, res) => {
    const access = await clientOrderAccess(req);
    if (access.error) return res.status(access.status).json({ error: access.error });
    const upload = validateUpload(req.body);
    if (upload.error) return res.status(400).json({ error: upload.error });
    const object = await req.platformStore.putPrivateObject({ requestId: access.order.id, ...upload });
    const row = await req.platformStore.createAttachment({
      requestId: access.order.id, userId: access.order.userId, uploadedBy: req.platformIdentity.userId,
      fileName: upload.fileName, mimeType: upload.mimeType, sizeBytes: upload.bytes.length,
      storagePath: object.path, category: "client", deliveryLocked: false,
    });
    await req.platformStore.appendEvent({ requestId: access.order.id, actorId: req.platformIdentity.userId, type: "attachment.created", data: { attachmentId: row.id, category: row.category } });
    return res.status(201).json({ attachment: publicAttachment(row) });
  });
  aliases(router, "post", ["/orders/:orderId/attachments", "/requests/:requestId/attachments"], attachment);

  router.post("/orders/:orderId/revisions", asyncRoute(async (req, res) => {
    const access = await clientOrderAccess(req);
    if (access.error) return res.status(access.status).json({ error: access.error });
    const revisions = await req.platformStore.listRevisions(access.order.id);
    const eligibility = getRevisionEligibility(access.order, revisions);
    if (!eligibility.eligible) return res.status(409).json({ error: "The included revision is not available. Additional work can be quoted separately.", eligibility, additionalWork: true });
    const instructions = text(req.body?.instructions, 4000);
    if (!instructions) return res.status(400).json({ error: "Revision instructions are required." });
    const revision = await req.platformStore.createRevision({ orderId: access.order.id, userId: access.order.userId, requestedBy: req.platformIdentity.userId, instructions, included: true });
    const order = await req.platformStore.updateOrder(access.order.id, { status: "Revision Requested" });
    return res.status(201).json({ revision, order });
  }));

  router.get("/attachments/:attachmentId/download", asyncRoute(async (req, res) => {
    const attachmentRow = await req.platformStore.getAttachment(req.params.attachmentId);
    if (!attachmentRow) return res.status(404).json({ error: "Attachment not found." });
    const access = await orderAccess(req.platformStore, attachmentRow.requestId, { ...req.platformIdentity, role: "student" });
    if (access.error) return res.status(404).json({ error: "Attachment not found." });
    if (!canDownloadAttachment(access.order, attachmentRow)) return res.status(423).json({ error: "Confirmed full payment is required before this delivery can be downloaded." });
    if (new Set(["final", "ai-report"]).has(attachmentRow.category) && access.order.paidCents >= access.order.quoteCents) {
      const firstDownload = await req.platformStore.setFirstDownloadedAt(access.order.id, new Date().toISOString());
      if (firstDownload?.firstDownloadRecorded) {
        await req.platformStore.appendEvent({ requestId: access.order.id, actorId: req.platformIdentity.userId, type: "delivery.first_downloaded", data: { attachmentId: attachmentRow.id, firstDownloadedAt: firstDownload.firstDownloadedAt } });
      }
    }
    await req.platformStore.appendEvent({ requestId: access.order.id, actorId: req.platformIdentity.userId, type: "attachment.downloaded", data: { attachmentId: attachmentRow.id } });
    if (req.platformStore.mode === "memory") {
      const object = await req.platformStore.getPrivateObject(attachmentRow.storagePath);
      if (!object) return res.status(404).json({ error: "Stored file not found." });
      res.setHeader("Content-Type", attachmentRow.mimeType);
      res.setHeader("Content-Disposition", `attachment; filename="${attachmentRow.fileName.replace(/["\r\n]/g, "")}"`);
      return res.send(object.bytes);
    }
    return res.json(await req.platformStore.createSignedObjectUrl(attachmentRow.storagePath));
  }));

  router.patch("/profile", asyncRoute(async (req, res) => {
    const current = await req.platformStore.getProfile(req.platformIdentity.userId);
    const profile = await req.platformStore.upsertProfile({
      userId: req.platformIdentity.userId, role: "student", email: current?.email || req.platformIdentity.email,
      fullName: current?.fullName || req.platformIdentity.fullName,
      urgentPhone: text(req.body?.urgentPhone, 80), school: text(req.body?.school, 180),
    });
    return res.json({ profile });
  }));

  const stripeIntent = asyncRoute(async (req, res) => {
    if (!paymentProvider?.stripeAvailable) return res.status(503).json({ error: "Stripe is not configured." });
    const access = await clientOrderAccess(req); if (access.error) return res.status(404).json({ error: access.error });
    const due = getServerPaymentDue(access.order); if (!due.milestone || !due.amountCents) return res.status(409).json({ error: "This order has no payment due." });
    return res.status(201).json(await paymentProvider.createStripeIntent({ request: access.order, due }));
  });
  aliases(router, "post", ["/orders/:orderId/payments/stripe-intent", "/requests/:requestId/payments/stripe-intent"], stripeIntent);

  const paypalOrder = asyncRoute(async (req, res) => {
    if (!paymentProvider?.paypalAvailable) return res.status(503).json({ error: "PayPal is not configured." });
    const access = await clientOrderAccess(req); if (access.error) return res.status(404).json({ error: access.error });
    const due = getServerPaymentDue(access.order); if (!due.milestone || !due.amountCents) return res.status(409).json({ error: "This order has no payment due." });
    return res.status(201).json(await paymentProvider.createPayPalOrder({ request: access.order, due }));
  });
  aliases(router, "post", ["/orders/:orderId/payments/paypal-order", "/requests/:requestId/payments/paypal-order"], paypalOrder);

  const paypalCapture = asyncRoute(async (req, res) => {
    if (!paymentProvider?.paypalAvailable) return res.status(503).json({ error: "PayPal is not configured." });
    const access = await clientOrderAccess(req); if (access.error) return res.status(404).json({ error: access.error });
    const orderId = text(req.body?.orderId, 200); if (!orderId) return res.status(400).json({ error: "PayPal order ID is required." });
    const due = getServerPaymentDue(access.order); if (!due.milestone || !due.amountCents) return res.status(409).json({ error: "This order has no payment due." });
    const capture = await paymentProvider.capturePayPalOrder(orderId, { requestId: access.order.id, due });
    if (capture.requestId !== access.order.id) return res.status(409).json({ error: "PayPal order does not belong to this order." });
    return res.json(await recordVerifiedPayment({ store: req.platformStore, request: access.order, provider: "paypal", providerTransactionId: capture.providerTransactionId, milestone: capture.milestone, amountCents: capture.amountCents }));
  });
  aliases(router, "post", ["/orders/:orderId/payments/paypal-capture", "/requests/:requestId/payments/paypal-capture"], paypalCapture);

  const demoPayment = asyncRoute(async (req, res) => {
    if (!req.platformIdentity.demo || !isLoopbackHostname(req.hostname)) return res.status(403).json({ error: "Payment simulation is available only in localhost demo mode." });
    const access = await clientOrderAccess(req); if (access.error) return res.status(404).json({ error: access.error });
    const due = getServerPaymentDue(access.order); if (!due.milestone || !due.amountCents) return res.status(409).json({ error: "This order has no payment due." });
    const result = await recordVerifiedPayment({ store: req.platformStore, request: access.order, provider: "demo", providerTransactionId: `demo:${access.order.id}:${due.milestone}:${due.amountCents}`, milestone: due.milestone, amountCents: due.amountCents });
    return res.json({ ...result, simulated: true });
  });
  aliases(router, "post", ["/orders/:orderId/payments/demo-confirm", "/requests/:requestId/payments/demo-confirm"], demoPayment);

  router.get("/notifications", asyncRoute(async (req, res) => res.json({ notifications: await req.platformStore.listNotifications(req.platformIdentity.userId) })));
  return router;
}
