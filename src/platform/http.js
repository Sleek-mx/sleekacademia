import express from "express";

import { createAdminRouter } from "./admin-router.js";
import { createClientRouter } from "./client-router.js";
import { asyncRoute, getStore, text } from "./http-utils.js";
import { recordVerifiedPayment } from "./payments.js";

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
      const orderId = text(intent.metadata?.requestId || intent.metadata?.orderId, 200);
      const userId = text(intent.metadata?.userId, 200);
      const order = await store.getOrderForUser(orderId, userId, { role: "admin" });
      if (!order) return res.status(404).json({ error: "Payment order not found." });
      const result = await recordVerifiedPayment({
        store, request: order, provider: "stripe", providerTransactionId: intent.id,
        milestone: text(intent.metadata?.milestone, 40), amountCents: Number(intent.amount_received),
      });
      return res.json({ received: true, duplicate: result.duplicate });
    } catch (error) {
      return res.status(400).json({ error: error instanceof Error ? error.message : "Stripe webhook verification failed." });
    }
  }));

  router.use(asyncRoute(async (req, res, next) => {
    const store = getStore(req, fallbackStore);
    if (!store?.available) return res.status(503).json({ error: "The workspace data service is not configured." });
    const identity = await resolveIdentity?.(req);
    if (!identity) return res.status(401).json({ error: "Authentication is required." });
    req.platformStore = store;
    req.platformIdentity = identity;
    return next();
  }));

  router.use("/admin", createAdminRouter());
  router.use(createClientRouter({ paymentProvider, csrfService }));

  router.use((error, _req, res, _next) => {
    console.error("Platform API error:", error);
    return res.status(500).json({ error: "The workspace could not complete this action." });
  });
  return router;
}
