import express from "express";

import { canTransitionOrder } from "./domain.js";
import { asyncRoute, orderDetails, publicAttachment, text } from "./http-utils.js";
import { calculateCustomQuote, calculateOrderQuote } from "./pricing.js";
import { buildAdminOverview, buildClientDirectory, buildEarningsReport, filterAndSortOrders, ordersToCsv } from "./reporting.js";
import { validateUpload } from "./uploads.js";

async function allData(store) {
  const [orders, profiles, messages, payments, attachments] = await Promise.all([
    store.listOrdersForUser("admin:mcx", { role: "admin" }), store.listProfiles(), store.listAllMessages(), store.listAllPayments(), store.listAllAttachments(),
  ]);
  return { orders, profiles, messages, payments, attachments };
}

async function adminOrder(req, res) {
  const order = await req.platformStore.getOrderForUser(req.params.orderId || req.params.requestId, req.platformIdentity.userId, { role: "admin" });
  if (!order) { res.status(404).json({ error: "Order not found." }); return null; }
  return order;
}

export function createAdminRouter() {
  const router = express.Router();
  router.use((req, res, next) => req.platformIdentity.role === "admin" ? next() : res.status(403).json({ error: "MCX administrator access is required." }));

  router.get("/overview", asyncRoute(async (req, res) => res.json({ overview: buildAdminOverview(await allData(req.platformStore), new Date()) })));
  router.get("/orders", asyncRoute(async (req, res) => {
    const data = await allData(req.platformStore);
    return res.json({ orders: filterAndSortOrders(data.orders, req.query, new Date()), filters: { status: req.query.status || "", queue: req.query.queue || "" } });
  }));
  router.get("/orders/:orderId", asyncRoute(async (req, res) => {
    const order = await adminOrder(req, res); if (!order) return;
    return res.json(await orderDetails(req.platformStore, order, req.platformIdentity));
  }));

  router.post("/orders/:orderId/clarification", asyncRoute(async (req, res) => {
    const order = await adminOrder(req, res); if (!order) return;
    const body = text(req.body?.body, 4000); if (!body) return res.status(400).json({ error: "Clarification details are required." });
    if (!new Set(["Available", "Needs Clarification"]).has(order.status)) return res.status(409).json({ error: "This order cannot request clarification now." });
    const message = await req.platformStore.createMessage({ requestId: order.id, userId: order.userId, senderId: req.platformIdentity.userId, senderRole: "admin", body });
    const updated = order.status === "Needs Clarification" ? order : await req.platformStore.updateOrder(order.id, { status: "Needs Clarification" });
    await req.platformStore.createNotification({ userId: order.userId, requestId: order.id, type: "order.clarification", title: "More information is needed", body });
    return res.json({ order: updated, message });
  }));

  router.post("/orders/:orderId/accept", asyncRoute(async (req, res) => {
    const order = await adminOrder(req, res); if (!order) return;
    let pricingSnapshot = order.pricingSnapshot;
    try {
      if (!pricingSnapshot?.totalCents) {
        pricingSnapshot = new Set(["tutoring", "other"]).has(order.service)
          ? calculateCustomQuote({ totalCents: req.body?.customQuoteCents, reason: req.body?.customQuoteReason })
          : calculateOrderQuote(order);
      }
    } catch (error) { return res.status(400).json({ error: error.message }); }
    const candidate = { ...order, quoteCents: pricingSnapshot.totalCents, pricingSnapshot };
    const transition = canTransitionOrder(candidate, "Deposit Due");
    if (!transition.ok) return res.status(409).json({ error: transition.error });
    const acceptedDeadline = text(req.body?.acceptedDeadline, 40) || order.deadline || null;
    if (acceptedDeadline && !Number.isFinite(new Date(acceptedDeadline).getTime())) return res.status(400).json({ error: "Choose a valid accepted deadline." });
    const updated = await req.platformStore.updateOrder(order.id, { quoteCents: pricingSnapshot.totalCents, pricingSnapshot, acceptedDeadline, status: "Deposit Due", acceptedAt: new Date().toISOString() });
    await req.platformStore.appendEvent({ requestId: order.id, actorId: req.platformIdentity.userId, type: "order.accepted", data: { quoteCents: updated.quoteCents, acceptedDeadline } });
    await req.platformStore.createNotification({ userId: order.userId, requestId: order.id, type: "payment.deposit_due", title: "Your order was accepted", body: "Pay the deposit to move the order into progress." });
    return res.json({ order: updated, request: updated });
  }));

  router.patch("/orders/:orderId/status", asyncRoute(async (req, res) => {
    const order = await adminOrder(req, res); if (!order) return;
    const status = text(req.body?.status, 80);
    const [attachments, revisions] = await Promise.all([req.platformStore.listAttachments(order.id), req.platformStore.listRevisions(order.id)]);
    const transition = canTransitionOrder(order, status, { hasFinalDeliverable: attachments.some((file) => file.category === "final"), hasOpenRevision: revisions.some((revision) => !new Set(["completed", "cancelled"]).has(revision.status)) });
    if (!transition.ok) return res.status(409).json({ error: transition.error });
    const updated = await req.platformStore.updateOrder(order.id, { status });
    await req.platformStore.appendEvent({ requestId: order.id, actorId: req.platformIdentity.userId, type: "order.status_changed", data: { from: order.status, to: status } });
    await req.platformStore.createNotification({ userId: order.userId, requestId: order.id, type: "order.status_changed", title: `Order status: ${status}`, body: "Open your dashboard for details." });
    return res.json({ order: updated, request: updated });
  }));

  const deliverable = asyncRoute(async (req, res) => {
    const order = await adminOrder(req, res); if (!order) return;
    const category = new Set(["draft", "final", "ai-report"]).has(req.body?.category) ? req.body.category : "";
    if (!category) return res.status(400).json({ error: "Choose draft, final, or ai-report delivery." });
    const upload = validateUpload(req.body); if (upload.error) return res.status(400).json({ error: upload.error });
    const object = await req.platformStore.putPrivateObject({ requestId: order.id, ...upload });
    const attachment = await req.platformStore.createAttachment({ requestId: order.id, userId: order.userId, uploadedBy: req.platformIdentity.userId, fileName: upload.fileName, mimeType: upload.mimeType, sizeBytes: upload.bytes.length, storagePath: object.path, category, deliveryLocked: category === "final" || category === "ai-report" });
    await req.platformStore.appendEvent({ requestId: order.id, actorId: req.platformIdentity.userId, type: "deliverable.created", data: { attachmentId: attachment.id, category } });
    return res.status(201).json({ attachment: publicAttachment(attachment) });
  });
  router.post("/orders/:orderId/deliverables", deliverable);

  router.get("/clients", asyncRoute(async (req, res) => res.json({ clients: buildClientDirectory(await allData(req.platformStore)) })));
  router.get("/messages", asyncRoute(async (req, res) => res.json({ messages: (await allData(req.platformStore)).messages.slice().reverse() })));
  router.get("/payments", asyncRoute(async (req, res) => res.json({ payments: (await allData(req.platformStore)).payments.slice().reverse() })));
  router.get("/earnings", asyncRoute(async (req, res) => res.json({ earnings: buildEarningsReport(await allData(req.platformStore), { period: req.query.period || "all", now: new Date() }) })));
  router.get("/files", asyncRoute(async (req, res) => res.json({ files: (await allData(req.platformStore)).attachments.map(publicAttachment).reverse() })));
  router.get("/exports/orders.csv", asyncRoute(async (req, res) => {
    const data = await allData(req.platformStore); const filtered = filterAndSortOrders(data.orders, { ...req.query, pageSize: "100" }, new Date());
    res.type("text/csv"); res.setHeader("Content-Disposition", 'attachment; filename="sleek-academia-orders.csv"');
    return res.send(ordersToCsv(filtered.items));
  }));
  return router;
}
