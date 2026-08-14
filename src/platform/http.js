import crypto from "crypto";

import express from "express";

import { createAdminRouter } from "./admin-router.js";
import { createClientRouter } from "./client-router.js";
import { asyncRoute, getStore, text } from "./http-utils.js";
import { settleAlert, notifyPaymentAbandoned, notifyPaymentConfirmed, notifyPaymentUnderpaid } from "./owner-alerts.js";
import { getServerPaymentDue, recordGumroadPayment, recordVerifiedPayment } from "./payments.js";

function timingSafeEqual(a, b) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

export function createPlatformRouter({
  store: fallbackStore,
  resolveIdentity,
  paymentProvider = null,
  csrfService = null,
  gumroadWebhookSecret = "",
} = {}) {
  const router = express.Router();

  router.post("/payments/stripe-webhook", asyncRoute(async (req, res) => {
    const store = getStore(req, fallbackStore);
    if (!store?.available) return res.status(503).json({ error: "Payment storage is unavailable." });
    if (!paymentProvider?.stripeAvailable) return res.status(503).json({ error: "Stripe is not configured." });
    try {
      const rawBody = req.rawBody || Buffer.from(JSON.stringify(req.body || {}));
      const event = paymentProvider.parseStripeWebhook(rawBody, req.get("stripe-signature") || "");

      // A card that fails or a checkout the client walks out of is the case Max
      // most wants to hear about, so these are alerted rather than dropped.
      if (event.type === "payment_intent.payment_failed" || event.type === "payment_intent.canceled") {
        const failed = event.data.object;
        await settleAlert(notifyPaymentAbandoned({
          email: failed.receipt_email || failed.metadata?.email || "",
          provider: "stripe",
          milestone: text(failed.metadata?.milestone, 40),
          amountCents: Number(failed.amount),
          currency: failed.currency || "usd",
          transactionId: failed.id,
          orderId: text(failed.metadata?.requestId || failed.metadata?.orderId, 200),
          reason: failed.last_payment_error?.message
            || (event.type === "payment_intent.canceled" ? "client cancelled the payment" : "not reported by Stripe"),
        }));
        return res.json({ received: true, alerted: true });
      }

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
      if (!result.duplicate) {
        await settleAlert(notifyPaymentConfirmed({
          order, provider: "stripe", milestone: text(intent.metadata?.milestone, 40),
          amountCents: Number(intent.amount_received), currency: intent.currency || order.currency,
          transactionId: intent.id,
        }));
      }
      return res.json({ received: true, duplicate: result.duplicate });
    } catch (error) {
      return res.status(400).json({ error: error instanceof Error ? error.message : "Stripe webhook verification failed." });
    }
  }));

  // Gumroad Ping sends application/x-www-form-urlencoded, and it has no signing
  // secret — the account-wide Ping URL fires for every product this seller has,
  // not just this one, so the secret query param and the product_permalink
  // check below are the only things standing between this route and a spoofed
  // "mark this order paid" request. See .planning/specs/gumroad-custom-order-payments.md.
  router.post(
    "/payments/gumroad-webhook",
    express.urlencoded({ extended: true }),
    asyncRoute(async (req, res) => {
      const store = getStore(req, fallbackStore);
      if (!store?.available) return res.status(503).json({ error: "Payment storage is unavailable." });
      const providedKey = text(req.query?.key, 200);
      if (!gumroadWebhookSecret || !providedKey || !timingSafeEqual(providedKey, gumroadWebhookSecret)) {
        return res.status(404).end();
      }

      const permalink = text(req.body?.product_permalink, 200);
      if (permalink !== "OrderPayment") return res.json({ received: true, ignored: true });

      const saleId = text(req.body?.sale_id, 200);
      const orderId = text(req.body?.url_params?.order_id, 200);
      const milestone = text(req.body?.url_params?.milestone, 40);
      const priceCents = Number(req.body?.price);
      if (!saleId || !orderId || !Number.isSafeInteger(priceCents) || priceCents <= 0) {
        return res.status(400).json({ error: "The Gumroad payload is missing required fields." });
      }
      // Order ids are always a real randomUUID(). Production's store queries a
      // uuid database column, which throws on malformed input rather than
      // returning null — reject the shape here so a garbage id (a bad link, a
      // Gumroad test-ping with no real order attached) is a clean 404 rather
      // than a 500 from an unhandled database error.
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId)) {
        return res.status(404).json({ error: "The order for this payment could not be found." });
      }

      const order = await store.getRequestForUser(orderId, null, { role: "admin" });
      if (!order) return res.status(404).json({ error: "The order for this payment could not be found." });

      const before = getServerPaymentDue(order);
      const result = await recordGumroadPayment({
        store, request: order, providerTransactionId: saleId, milestone, amountCents: priceCents,
      });
      if (!result.duplicate) {
        if (result.underpaid) {
          await settleAlert(notifyPaymentUnderpaid({
            order: result.request, milestone, paidAmountCents: priceCents,
            dueAmountCents: before.amountCents || priceCents, currency: "usd", transactionId: saleId,
          }));
        } else {
          await settleAlert(notifyPaymentConfirmed({
            order: result.request, provider: "gumroad", milestone, amountCents: priceCents, currency: "usd", transactionId: saleId,
          }));
        }
      }
      return res.json({ recorded: true, duplicate: result.duplicate, orderId: result.request.id, status: result.request.status });
    }),
  );

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
