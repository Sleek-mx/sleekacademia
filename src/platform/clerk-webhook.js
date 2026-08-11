// Clerk webhook receiver.
//
// Sign-up happens entirely inside Clerk's hosted widget, so the server never
// sees an account being created unless Clerk tells it. This is that channel:
// Clerk POSTs `user.created` here and the owner gets an email.
//
// Signatures are Svix's scheme, verified here rather than through the `svix`
// package so the deployment gains no new dependency:
//
//   signed content = `${svix-id}.${svix-timestamp}.${raw body}`
//   expected       = base64( HMAC-SHA256( base64decode(secret after "whsec_"), signed content ) )
//   `svix-signature` carries a space-separated list of `v1,<signature>` pairs,
//   because Clerk rotates secrets by sending both old and new.
//
// An unverified request is rejected with 401 and never produces mail — the
// endpoint is public, so an unsigned POST is assumed hostile.

import crypto from "crypto";

const DEFAULT_TOLERANCE_SECONDS = 5 * 60;

function secretBytes(signingSecret) {
  const raw = String(signingSecret || "").trim();
  const base64 = raw.startsWith("whsec_") ? raw.slice("whsec_".length) : raw;
  return Buffer.from(base64, "base64");
}

function timingSafeEqual(a, b) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

/**
 * Verify a Svix-signed webhook.
 * @returns {{ok: true} | {ok: false, reason: string}}
 */
export function verifySvixSignature({ payload, headers, signingSecret, now = Date.now(), toleranceSeconds = DEFAULT_TOLERANCE_SECONDS }) {
  if (!signingSecret) return { ok: false, reason: "signing secret is not configured" };

  const id = headers["svix-id"] || headers["webhook-id"];
  const timestamp = headers["svix-timestamp"] || headers["webhook-timestamp"];
  const signatureHeader = headers["svix-signature"] || headers["webhook-signature"];
  if (!id || !timestamp || !signatureHeader) return { ok: false, reason: "missing signature headers" };

  const sentAt = Number(timestamp);
  if (!Number.isFinite(sentAt)) return { ok: false, reason: "invalid timestamp" };
  const driftSeconds = Math.abs(now / 1000 - sentAt);
  if (driftSeconds > toleranceSeconds) return { ok: false, reason: "timestamp outside tolerance" };

  const body = Buffer.isBuffer(payload) ? payload.toString("utf8") : String(payload || "");
  const expected = crypto
    .createHmac("sha256", secretBytes(signingSecret))
    .update(`${id}.${timestamp}.${body}`)
    .digest("base64");

  const offered = String(signatureHeader)
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => (part.includes(",") ? part.slice(part.indexOf(",") + 1) : part));

  const matched = offered.some((candidate) => timingSafeEqual(candidate, expected));
  return matched ? { ok: true } : { ok: false, reason: "signature mismatch" };
}

/** Flatten Clerk's user.created payload into what the alert needs. */
export function userFromClerkEvent(event) {
  const data = event?.data || {};
  const primaryId = data.primary_email_address_id;
  const addresses = Array.isArray(data.email_addresses) ? data.email_addresses : [];
  const primary = addresses.find((address) => address.id === primaryId) || addresses[0] || null;
  const fullName = [data.first_name, data.last_name].filter(Boolean).join(" ").trim();
  const strategy = primary?.verification?.strategy || "";
  return {
    id: data.id || "",
    email: primary?.email_address || "",
    fullName: fullName || data.username || "",
    source: strategy ? `Clerk (${strategy})` : "Clerk",
  };
}

/**
 * Express handler factory. Mount with a raw body parser so the exact bytes
 * Clerk signed are available — `express.json()` re-serialisation would break
 * the signature.
 */
export function createClerkWebhookHandler({
  signingSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET || "",
  onUserCreated,
  now = () => Date.now(),
} = {}) {
  return async function clerkWebhookHandler(req, res) {
    if (!signingSecret) return res.status(503).json({ error: "Clerk webhook is not configured." });

    // `req.rawBody` is captured by the express.json verify hook; falling back to
    // re-serialising req.body would change the bytes and fail verification.
    const raw = Buffer.isBuffer(req.rawBody)
      ? req.rawBody
      : Buffer.isBuffer(req.body)
        ? req.body
        : Buffer.from(JSON.stringify(req.body || {}));
    const verification = verifySvixSignature({
      payload: raw,
      headers: req.headers,
      signingSecret,
      now: now(),
    });
    if (!verification.ok) {
      console.warn("[clerk-webhook] rejected:", verification.reason);
      return res.status(401).json({ error: "Webhook signature verification failed." });
    }

    let event;
    try {
      event = JSON.parse(raw.toString("utf8"));
    } catch {
      return res.status(400).json({ error: "Webhook body is not valid JSON." });
    }

    if (event?.type !== "user.created") {
      return res.json({ received: true, ignored: true, type: event?.type || "unknown" });
    }

    // The alert must finish before the response is flushed. On Vercel the
    // function is frozen the moment the response goes out, which kills any
    // in-flight mail request — the exact failure this endpoint exists to avoid.
    // `onUserCreated` is expected to cap its own wait and swallow its errors, so
    // a mail outage still leaves Clerk with a 200 and no retry storm.
    try {
      await onUserCreated?.(userFromClerkEvent(event));
    } catch (error) {
      console.error("[clerk-webhook] alert failed:", error?.message || error);
    }
    return res.json({ received: true, type: "user.created" });
  };
}
