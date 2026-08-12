// Owner alerts — "tell Max the moment something happens on the site".
//
// Every alert in here goes to one inbox (OWNER_NOTIFICATION_EMAIL, default
// macsinjobs@gmail.com) and covers the moments that were previously silent:
//
//   1. someone creates an account            (Clerk `user.created` webhook)
//   2. someone starts the order wizard       (lead beacon from onboard.js)
//   3. someone submits an order              (order.submitted)
//   4. someone opens checkout                (Stripe intent created)
//   5. a payment confirms                    (Stripe webhook)
//   6. a payment fails or is abandoned       (Stripe webhook)
//   7. someone claims a MoneyGram transfer   (manual claim, nothing paid yet)
//   8. someone sends a message               (contact dock on every page)
//
// Rules this module never breaks:
//
//   * **An email failure must never break the visitor's request.** Every export
//     swallows its own errors and logs. Callers use `fireOwnerAlert` so the
//     send happens off the response path.
//   * **Alerts are best-effort duplicates-free, not exactly-once.** The dedupe
//     cache is per-process, so a serverless cold start can repeat an alert.
//     A repeat is acceptable; a missed alert is what we are fixing.
//
// The mail transport is shared with the quiz notifier (Resend, then SMTP,
// otherwise disabled) so there is one place where mail credentials are read.

import { send, isConfigured, channel } from "../quiz/notify.js";

const DEFAULT_OWNER_EMAIL = "macsinjobs@gmail.com";
const DEDUPE_WINDOW_MS = 30 * 60 * 1000;

const recentAlerts = new Map();
let warnedUnconfigured = false;

/** Every owner alert lands here. */
export function ownerAddress() {
  return (
    process.env.OWNER_NOTIFICATION_EMAIL ||
    process.env.NOTIFICATION_EMAIL ||
    DEFAULT_OWNER_EMAIL
  );
}

export function alertsConfigured() {
  return isConfigured();
}

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function money(cents, currency = "usd") {
  if (!Number.isFinite(Number(cents))) return "not set";
  return `${(Number(cents) / 100).toFixed(2)} ${String(currency).toUpperCase()}`;
}

function stamp(now = new Date()) {
  // UTC in the subject-adjacent body; the reader converts. Server never guesses
  // a local timezone.
  return `${now.toISOString().replace("T", " ").slice(0, 16)} UTC`;
}

const row = (key, value) => `<tr>
    <td style="padding:8px 12px;font-weight:700;white-space:nowrap;border-bottom:1px solid #e2e8f0">${esc(key)}</td>
    <td style="padding:8px 12px;color:#4b4468;border-bottom:1px solid #e2e8f0">${esc(value)}</td>
  </tr>`;

function layout({ heading, intro, rows = [], note = "", actionUrl = "", actionLabel = "" }) {
  const table = rows.length
    ? `<table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:8px;overflow:hidden">
        ${rows.map(([key, value]) => row(key, value)).join("")}
      </table>`
    : "";
  const action = actionUrl
    ? `<p style="margin:20px 0">
         <a href="${esc(actionUrl)}" style="display:inline-block;background:#702ae1;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:700">${esc(actionLabel || "Open")}</a>
       </p>`
    : "";
  return `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#372f52">
    <h2 style="color:#372f52;margin:0 0 16px">${esc(heading)}</h2>
    ${intro ? `<p style="line-height:1.7;margin:0 0 16px">${intro}</p>` : ""}
    ${table}
    ${note ? `<p style="line-height:1.7;margin-top:16px">${note}</p>` : ""}
    ${action}
    <p style="color:#94a3b8;font-size:12px;margin-top:24px">Automatic alert from sleekacademia.com. Reply address is the visitor where one is known.</p>
  </div>`;
}

function shouldSkipDuplicate(dedupeKey) {
  if (!dedupeKey) return false;
  const now = Date.now();
  for (const [key, seenAt] of recentAlerts) {
    if (now - seenAt > DEDUPE_WINDOW_MS) recentAlerts.delete(key);
  }
  if (recentAlerts.has(dedupeKey)) return true;
  recentAlerts.set(dedupeKey, now);
  return false;
}

/** Test seam — clears the per-process dedupe cache. */
export function resetAlertDedupe() {
  recentAlerts.clear();
}

/**
 * Send one owner alert. Never throws.
 * @returns {Promise<{sent: boolean, reason?: string}>}
 */
export async function alertOwner({ subject, heading, intro = "", rows = [], note = "", actionUrl = "", actionLabel = "", replyTo = "", dedupeKey = "" }) {
  if (!isConfigured()) {
    if (!warnedUnconfigured) {
      warnedUnconfigured = true;
      console.warn(
        "[alerts] no email channel configured (set RESEND_API_KEY or SMTP_*); " +
          "owner alerts are disabled. Site behaviour is unaffected."
      );
    }
    return { sent: false, reason: "not-configured" };
  }
  if (shouldSkipDuplicate(dedupeKey)) return { sent: false, reason: "duplicate" };

  try {
    await send({
      to: ownerAddress(),
      replyTo: replyTo || undefined,
      subject,
      html: layout({ heading, intro, rows, note, actionUrl, actionLabel }),
    });
    return { sent: true };
  } catch (error) {
    console.error(`[alerts] "${subject}" failed via ${channel()}:`, error.response?.data || error.message);
    return { sent: false, reason: error.message };
  }
}

/**
 * Wait for an alert to finish, but never fail or hang the request because of it.
 *
 * This is deliberately **not** fire-and-forget. On Vercel the function is frozen
 * the moment the response is flushed, so a detached promise is killed mid-flight
 * and the email silently never sends — which is exactly the bug this whole
 * feature exists to fix. Callers therefore await this before responding, and the
 * timeout keeps a slow mail provider from holding the visitor hostage.
 */
export async function settleAlert(promise, { timeoutMs = 5_000 } = {}) {
  let timer;
  try {
    return await Promise.race([
      Promise.resolve(promise),
      new Promise((resolve) => {
        timer = setTimeout(() => resolve({ sent: false, reason: "timeout" }), timeoutMs);
      }),
    ]);
  } catch (error) {
    console.error("[alerts] unexpected alert failure:", error?.message || error);
    return { sent: false, reason: error?.message || "unknown" };
  } finally {
    clearTimeout(timer);
  }
}

function dashboardUrl(pathname = "/admin.html") {
  const origin = process.env.PUBLIC_BASE_URL || "https://sleekacademia.com";
  return `${origin}${pathname}`;
}

// ── The individual moments ────────────────────────────────────────────────

/** A Clerk account was created. This is the alert that did not exist at all. */
export function notifyAccountCreated(user, { now = new Date() } = {}) {
  const email = user?.email || "not reported by Clerk";
  return alertOwner({
    subject: `New account — ${email}`,
    heading: "Someone created an account",
    intro: "They can now sign in and start an order. Nothing has been ordered or paid yet.",
    rows: [
      ["Name", user?.fullName || "not given"],
      ["Email", email],
      ["Signed up", stamp(now)],
      ["Clerk user id", user?.id || "unknown"],
      ["Sign-up route", user?.source || "website"],
    ],
    replyTo: user?.email || "",
    actionUrl: dashboardUrl("/admin.html"),
    actionLabel: "Open the admin dashboard",
    dedupeKey: `account:${user?.id || email}`,
  });
}

/**
 * Someone filled in the order wizard's contact step. They may never finish —
 * that is the point of the alert. Deduped per email for 30 minutes so a
 * visitor tabbing back and forth does not send a stream of mail.
 */
export function notifyOrderStarted(lead, { now = new Date() } = {}) {
  const email = lead?.email || "not given";
  return alertOwner({
    subject: `Order started (not submitted) — ${email}`,
    heading: "Someone started an order and has not submitted it",
    intro:
      "This fires as soon as the wizard's contact step is filled in. If a " +
      "\"New order submitted\" alert does not follow within a few minutes, they dropped out.",
    rows: [
      ["Name", lead?.name || "not given"],
      ["Email", email],
      ["Service", lead?.service || "not chosen yet"],
      ["Estimate shown", lead?.estimate || "none yet"],
      ["Deadline", lead?.deadline || "not given"],
      ["Started", stamp(now)],
    ],
    replyTo: lead?.email || "",
    note: "Worth a follow-up email if nothing arrives — this is a warm lead who saw a price.",
    dedupeKey: `lead:${String(email).toLowerCase()}`,
  });
}

/** An order reached the database. */
export function notifyOrderSubmitted(order, { now = new Date() } = {}) {
  return alertOwner({
    subject: `New order submitted — ${order?.service || "order"} — ${order?.email || "unknown"}`,
    heading: "A new order was submitted",
    rows: [
      ["Client", order?.name || "not given"],
      ["Email", order?.email || "not given"],
      ["Service", order?.service || "not given"],
      ["Deadline", order?.deadline || "not given"],
      ["Quote", money(order?.quoteCents, order?.currency)],
      ["Status", order?.status || "unknown"],
      ["Order id", order?.id || "unknown"],
      ["Submitted", stamp(now)],
    ],
    replyTo: order?.email || "",
    actionUrl: dashboardUrl("/admin.html"),
    actionLabel: "Open the order",
    dedupeKey: `order:${order?.id}`,
  });
}

/** Checkout was opened. No money has moved yet. */
export function notifyCheckoutStarted({ order, milestone, amountCents, currency, provider }, { now = new Date() } = {}) {
  return alertOwner({
    subject: `Checkout opened, not paid — ${money(amountCents, currency)} — ${order?.email || "unknown"}`,
    heading: "A client opened checkout",
    intro: "No money has moved yet. A payment-confirmed alert follows if they complete it.",
    rows: [
      ["Client", order?.name || order?.email || "not given"],
      ["Email", order?.email || "not given"],
      ["Provider", provider || "unknown"],
      ["Milestone", milestone || "unknown"],
      ["Amount due", money(amountCents, currency)],
      ["Order id", order?.id || "unknown"],
      ["Opened", stamp(now)],
    ],
    replyTo: order?.email || "",
    dedupeKey: `checkout:${order?.id}:${milestone}:${provider}`,
  });
}

/** Money confirmed. */
export function notifyPaymentConfirmed({ order, provider, milestone, amountCents, currency, transactionId }, { now = new Date() } = {}) {
  return alertOwner({
    subject: `Payment confirmed — ${money(amountCents, currency)} — ${order?.email || "unknown"}`,
    heading: "A payment was confirmed",
    rows: [
      ["Client", order?.name || "not given"],
      ["Email", order?.email || "not given"],
      ["Provider", provider || "unknown"],
      ["Milestone", milestone || "unknown"],
      ["Amount", money(amountCents, currency)],
      ["Transaction", transactionId || "unknown"],
      ["Order id", order?.id || "unknown"],
      ["Confirmed", stamp(now)],
    ],
    replyTo: order?.email || "",
    actionUrl: dashboardUrl("/admin.html"),
    actionLabel: "Open the order",
    dedupeKey: `payment:${provider}:${transactionId}`,
  });
}

/**
 * A client says they sent a MoneyGram transfer and gave the reference number.
 *
 * Nothing is marked paid by this — MoneyGram has no verification API, so the
 * operator confirms the payout landed on the M-Pesa side and then records the
 * payment from the admin dashboard. This alert is the only thing that tells
 * them a claim is waiting, so it must never be silently dropped.
 */
export function notifyManualPaymentClaim({ order, reference, milestone, amountCents, currency }, { now = new Date() } = {}) {
  return alertOwner({
    subject: `ACTION: confirm MoneyGram payment — ${money(amountCents, currency)} — ${order?.email || "unknown"}`,
    heading: "A client submitted a MoneyGram reference",
    intro:
      "Check the M-Pesa payout landed, then record the payment in the admin dashboard. " +
      "The order is <strong>not</strong> marked paid until you do.",
    rows: [
      ["Client", order?.name || "not given"],
      ["Email", order?.email || "not given"],
      ["MoneyGram reference", reference || "not given"],
      ["Milestone", milestone || "unknown"],
      ["Amount claimed", money(amountCents, currency)],
      ["Order id", order?.id || "unknown"],
      ["Claimed", stamp(now)],
    ],
    replyTo: order?.email || "",
    actionUrl: dashboardUrl("/admin.html"),
    actionLabel: "Open the order",
    dedupeKey: `claim:${order?.id}:${reference}`,
  });
}

/**
 * Someone used the contact dock instead of the order wizard. This is the
 * "I have a question before I commit" lead, and it is the one the site had no
 * way of capturing at all.
 */
export function notifyContactMessage({ name, email, message, page }, { now = new Date() } = {}) {
  return alertOwner({
    subject: `Website message — ${email || "unknown"}`,
    heading: "Someone sent a message from the website",
    intro: "They did not start an order. Replying quickly is the whole point of this one.",
    rows: [
      ["Name", name || "not given"],
      ["Email", email || "not given"],
      ["Page", page || "not reported"],
      ["Sent", stamp(now)],
    ],
    note: `<strong>Message</strong><br />${esc(message || "").replace(/\n/g, "<br />")}`,
    replyTo: email || "",
    dedupeKey: `contact:${String(email || "").toLowerCase()}:${String(message || "").slice(0, 60)}`,
  });
}

/** A checkout failed or was cancelled — the abandoned-payment case. */
export function notifyPaymentAbandoned({ email, provider, milestone, amountCents, currency, transactionId, reason, orderId }, { now = new Date() } = {}) {
  return alertOwner({
    subject: `Payment not completed — ${money(amountCents, currency)} — ${email || "unknown client"}`,
    heading: "A payment was started but never completed",
    intro: "The client reached the payment step and dropped out or was declined.",
    rows: [
      ["Email", email || "not reported"],
      ["Provider", provider || "unknown"],
      ["Milestone", milestone || "unknown"],
      ["Amount attempted", money(amountCents, currency)],
      ["Reason", reason || "not reported"],
      ["Transaction", transactionId || "unknown"],
      ["Order id", orderId || "unknown"],
      ["Seen", stamp(now)],
    ],
    replyTo: email || "",
    note: "A card decline is often fixable with one reply — worth chasing.",
    dedupeKey: `abandoned:${provider}:${transactionId}`,
  });
}
