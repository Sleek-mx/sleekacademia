// PayPal Orders v2 — $10 unlock for questions 51–100.
//
// LIVE money. PAYPAL_BASE_URL defaults to the live host because the credentials
// in the vault are live-only (they are rejected by sandbox). Funds are directed
// to QUIZ_PAYEE_EMAIL, which PayPal validates against the app's own account.
//
// Capture is verified server-side against PayPal before any entitlement is
// issued — the browser is never trusted to report that it paid.

import axios from "axios";

export const UNLOCK_PRICE_USD = "10.00";
export const DEFAULT_PAYEE = "macsiemoney@gmail.com";

function baseUrl() {
  return process.env.PAYPAL_BASE_URL || "https://api-m.paypal.com";
}

export function isConfigured() {
  return Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_SECRET);
}

export function payeeEmail() {
  return process.env.QUIZ_PAYEE_EMAIL || DEFAULT_PAYEE;
}

export function clientId() {
  return process.env.PAYPAL_CLIENT_ID || "";
}

/** True when running against PayPal's live host — surfaced in the UI. */
export function isLive() {
  return !/sandbox/i.test(baseUrl());
}

let cachedToken = null;

async function accessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }

  const id = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_SECRET;
  if (!id || !secret) {
    throw Object.assign(new Error("PayPal is not configured"), { code: "NO_PAYPAL" });
  }

  const { data } = await axios.post(
    `${baseUrl()}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      auth: { username: id.trim(), password: secret.trim() },
      headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
      timeout: 20_000,
    }
  );

  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in || 32400) * 1000,
  };
  return cachedToken.value;
}

/**
 * Create a $10 order. Returns the order id the browser SDK needs.
 * @returns {Promise<{id: string, status: string}>}
 */
export async function createOrder() {
  const token = await accessToken();

  const { data } = await axios.post(
    `${baseUrl()}/v2/checkout/orders`,
    {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: "antimicrobial-quiz-full",
          description: "NURS 5334 Antimicrobial Mastery Challenge — questions 51 to 100",
          custom_id: "antimicrobial-quiz",
          amount: { currency_code: "USD", value: UNLOCK_PRICE_USD },
          payee: { email_address: payeeEmail() },
        },
      ],
      application_context: {
        brand_name: "Sleek Academia",
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
      },
    },
    {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      timeout: 25_000,
    }
  );

  return { id: data.id, status: data.status };
}

/**
 * Capture an approved order and confirm the money actually moved.
 *
 * Only a COMPLETED capture for the expected amount grants entitlement — a
 * PENDING or partial capture must not unlock anything.
 *
 * @returns {Promise<{ok: boolean, reason?: string, orderId: string, captureId?: string, amount?: string, payer?: string}>}
 */
export async function captureOrder(orderId) {
  if (!orderId || typeof orderId !== "string") {
    return { ok: false, reason: "missing-order-id", orderId: "" };
  }

  const token = await accessToken();

  let data;
  try {
    ({ data } = await axios.post(
      `${baseUrl()}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
      {},
      {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        timeout: 30_000,
      }
    ));
  } catch (error) {
    const issue = error.response?.data?.details?.[0]?.issue;
    // Already captured in a previous attempt (e.g. a double-clicked button):
    // fall through to a read so we can still confirm and honour it.
    if (issue === "ORDER_ALREADY_CAPTURED") {
      return verifyCapturedOrder(orderId, token);
    }
    console.error("[quiz] PayPal capture failed:", issue || error.message);
    return { ok: false, reason: issue || "capture-failed", orderId };
  }

  return interpretOrder(data, orderId);
}

async function verifyCapturedOrder(orderId, token) {
  try {
    const { data } = await axios.get(
      `${baseUrl()}/v2/checkout/orders/${encodeURIComponent(orderId)}`,
      { headers: { Authorization: `Bearer ${token}` }, timeout: 25_000 }
    );
    return interpretOrder(data, orderId);
  } catch (error) {
    console.error("[quiz] PayPal order lookup failed:", error.message);
    return { ok: false, reason: "lookup-failed", orderId };
  }
}

function interpretOrder(data, orderId) {
  const unit = data?.purchase_units?.[0];
  const capture = unit?.payments?.captures?.[0];

  if (!capture) return { ok: false, reason: "no-capture", orderId };
  if (capture.status !== "COMPLETED") {
    return { ok: false, reason: `capture-${String(capture.status).toLowerCase()}`, orderId };
  }

  const amount = capture.amount?.value;
  const currency = capture.amount?.currency_code;
  if (currency !== "USD" || Number(amount) < Number(UNLOCK_PRICE_USD)) {
    return { ok: false, reason: "amount-mismatch", orderId, amount };
  }

  return {
    ok: true,
    orderId,
    captureId: capture.id,
    amount,
    payer: data?.payer?.email_address,
  };
}
