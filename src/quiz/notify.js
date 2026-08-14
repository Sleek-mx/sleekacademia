// Email notifications for quiz unlocks.
//
// Three messages, triggered by a verified payment (originally PayPal's capture
// route; now also the Gumroad unlock path in gumroad-unlock.js):
//   1. notifyUnlock          — tells Max a sale happened
//   2. emailBuyerAccessLink  — gives the buyer a link that restores paid access
//   3. notifyCaptureFailure  — flags a capture that errored, where money may have
//                              moved without an unlock being issued (PayPal-specific)
//
// Two rules this module never breaks:
//
//   * **A failed email must never cost a learner their unlock.** Every exported
//     notify* function swallows its own errors and logs. Callers fire them after
//     the HTTP response has gone out.
//   * **The buyer's recovery link goes in the URL fragment, not the query
//     string.** A fragment is never sent to a server, so the entitlement token
//     stays out of access logs, proxy logs and Referer headers.
//
// Channel: Resend if RESEND_API_KEY is set, otherwise SMTP, otherwise disabled
// (logged once, no throw). Mirrors the provider order already used by the
// service-request route in server.js.

import axios from "axios";

const DEFAULT_FROM = "Sleek Academia <onboarding@resend.dev>";

let warnedUnconfigured = false;

export function isConfigured() {
  return Boolean(
    process.env.RESEND_API_KEY ||
      (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
  );
}

export function channel() {
  if (process.env.RESEND_API_KEY) return "resend";
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) return "smtp";
  return "disabled";
}

/** Where sale and failure alerts go. */
export function notifyAddress() {
  return (
    process.env.QUIZ_NOTIFY_EMAIL ||
    process.env.NOTIFICATION_EMAIL ||
    process.env.QUIZ_PAYEE_EMAIL ||
    "macsiemoney@gmail.com"
  );
}

function fromAddress() {
  return process.env.RESEND_FROM || DEFAULT_FROM;
}

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Send one email. Throws on failure — callers are responsible for catching.
 * @param {{to: string|string[], subject: string, html: string, replyTo?: string}} message
 */
export async function send({ to, subject, html, replyTo }) {
  const recipients = (Array.isArray(to) ? to : String(to).split(","))
    .map((address) => String(address).trim())
    .filter(Boolean);

  if (!recipients.length) throw new Error("no recipient");

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    await axios.post(
      "https://api.resend.com/emails",
      { from: fromAddress(), to: recipients, reply_to: replyTo, subject, html },
      {
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        timeout: 15_000,
      }
    );
    return "resend";
  }

  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    // Dynamic import so a missing module degrades here rather than at app boot.
    const nodemailer = (await import("nodemailer")).default;
    const port = Number(process.env.SMTP_PORT || 465);
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
      tls: { rejectUnauthorized: false }, // shared-host mail cert is *.web-hosting.com
    });
    await transporter.sendMail({
      from: `"Sleek Academia" <${SMTP_USER}>`,
      to: recipients,
      replyTo,
      subject,
      html,
    });
    return "smtp";
  }

  throw Object.assign(new Error("email is not configured"), { code: "NO_MAIL" });
}

function skipIfUnconfigured(what) {
  if (isConfigured()) return false;
  if (!warnedUnconfigured) {
    warnedUnconfigured = true;
    console.warn(
      "[quiz] no email channel configured (set RESEND_API_KEY or SMTP_*); " +
        "unlock notifications are disabled. Unlocks themselves are unaffected."
    );
  }
  console.warn(`[quiz] skipped ${what}: email not configured`);
  return true;
}

/**
 * The link that restores a paid unlock on a new browser or device.
 * The token rides in the fragment so it never reaches a server log.
 */
export function accessLink(quiz, entitlement) {
  const origin = process.env.PUBLIC_BASE_URL || "https://sleekacademia.com";
  return `${origin}${quiz.pagePath}#unlock=${encodeURIComponent(entitlement)}`;
}

const wrap = (title, body) => `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#372f52">
  <h2 style="color:#372f52;margin:0 0 16px">${esc(title)}</h2>
  ${body}
  <p style="color:#94a3b8;font-size:12px;margin-top:24px">Sent automatically by the Sleek Academia quiz service.</p>
</div>`;

const row = (key, value) => `<tr>
    <td style="padding:8px 12px;font-weight:700;white-space:nowrap;border-bottom:1px solid #e2e8f0">${esc(key)}</td>
    <td style="padding:8px 12px;color:#4b4468;border-bottom:1px solid #e2e8f0">${esc(value)}</td>
  </tr>`;

/**
 * Tell Max a sale happened. `buyerEmailOutcome` folds in whether the buyer's
 * recovery link actually sent, so a bounced buyer email is never silent — the
 * link is included here so it can be forwarded by hand.
 */
export async function notifyUnlock(quiz, result, { buyerEmailOutcome, link } = {}) {
  if (skipIfUnconfigured("unlock notification")) return { sent: false, reason: "not-configured" };

  const buyerLine = buyerEmailOutcome
    ? buyerEmailOutcome.sent
      ? `<p style="color:#1d7a4f;margin:16px 0 0">Access link emailed to the buyer.</p>`
      : `<div style="border-left:4px solid #b02a37;background:#fdf2f3;padding:12px 16px;margin:16px 0 0">
           <strong>The buyer's access link did NOT send</strong> (${esc(buyerEmailOutcome.reason)}).
           Forward this to them so they can restore access on another device:<br>
           <a href="${esc(link)}" style="word-break:break-all">${esc(link)}</a>
         </div>`
    : "";

  try {
    await send({
      to: notifyAddress(),
      replyTo: result.payer || undefined,
      subject: `Quiz unlock sold — ${result.amount || "10.00"} USD — ${quiz.shortTitle}`,
      html: wrap(
        "Someone unlocked the full quiz",
        `<table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:8px;overflow:hidden">
          ${row("Quiz", quiz.title)}
          ${row("Amount", `${result.amount || "10.00"} USD`)}
          ${row("Provider", result.provider || "unknown")}
          ${row("Buyer", result.payer || "not reported by the payment provider")}
          ${row("Order / sale id", result.orderId)}
        </table>
        ${buyerLine}`
      ),
    });
    return { sent: true };
  } catch (error) {
    console.error("[quiz] unlock notification failed:", error.response?.data || error.message);
    return { sent: false, reason: error.message };
  }
}

/**
 * Give the buyer a link that restores their unlock. This is the fix for the
 * quiz's one real limitation: entitlement lives in browser storage, so clearing
 * data or switching device otherwise loses paid access with no recovery.
 */
export async function emailBuyerAccessLink(quiz, result, entitlement) {
  const link = accessLink(quiz, entitlement);

  if (!result.payer) {
    console.warn("[quiz] payment provider reported no buyer email; cannot send the access link");
    return { sent: false, reason: "the payment provider did not report a buyer email", link };
  }
  if (skipIfUnconfigured("buyer access link")) {
    return { sent: false, reason: "email not configured", link };
  }

  try {
    await send({
      to: result.payer,
      replyTo: notifyAddress(),
      subject: `Your full access to the ${quiz.shortTitle}`,
      html: wrap(
        "Your unlock is confirmed",
        `<p style="line-height:1.7">Thank you — questions 51 to 100 of the
           <strong>${esc(quiz.title)}</strong> are now unlocked.</p>
         <p style="line-height:1.7">Your access is saved in the browser you paid from,
           so you can simply carry on there. <strong>Keep this email.</strong> If you
           clear your browsing data or switch to another phone or computer, open this
           link to restore your access:</p>
         <p style="margin:20px 0">
           <a href="${esc(link)}"
              style="display:inline-block;background:#702ae1;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:700">Restore my access</a>
         </p>
         <p style="line-height:1.7;font-size:14px;color:#6b6488">If the button does not work,
           copy this address into your browser:<br>
           <span style="word-break:break-all">${esc(link)}</span></p>
         <p style="line-height:1.7;font-size:14px;color:#6b6488">Treat the link like a receipt —
           anyone who has it can use your access. Reply to this email if you need help.</p>`
      ),
    });
    return { sent: true, link };
  } catch (error) {
    console.error("[quiz] buyer access link failed:", error.response?.data || error.message);
    return { sent: false, reason: error.message, link };
  }
}

/**
 * Flag a capture that threw. This is the case worth waking up for: PayPal may
 * have taken the money while the unlock was never issued, so the buyer has paid
 * and has nothing.
 */
export async function notifyCaptureFailure(quiz, orderId, error) {
  if (skipIfUnconfigured("capture failure alert")) return { sent: false, reason: "not-configured" };

  const detail =
    typeof error === "string"
      ? error
      : JSON.stringify(error?.response?.data || error?.message || error).slice(0, 900);

  try {
    await send({
      to: notifyAddress(),
      subject: `ACTION NEEDED: quiz capture failed — ${quiz.shortTitle}`,
      html: wrap(
        "A payment capture failed",
        `<p style="line-height:1.7">A learner attempted to unlock
           <strong>${esc(quiz.title)}</strong> and the capture call failed. Money may
           have been taken without an unlock being issued.</p>
         <table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:8px;overflow:hidden">
           ${row("PayPal order", orderId || "not supplied")}
           ${row("Quiz", quiz.id)}
         </table>
         <p style="line-height:1.7;margin-top:16px">Check this order in the PayPal
           dashboard. If it did complete, issue access with the tutor access code.</p>
         <pre style="background:#f5f3ff;padding:12px;border-radius:6px;font-size:12px;white-space:pre-wrap;word-break:break-word">${esc(detail)}</pre>`
      ),
    });
    return { sent: true };
  } catch (sendError) {
    console.error("[quiz] capture failure alert failed:", sendError.message);
    return { sent: false, reason: sendError.message };
  }
}

// ── Manual MoneyGram claim (temporary, no automated verification) ─────────

/**
 * A learner claims they sent MoneyGram-to-mobile-money payment. Nothing is
 * verified here — this alerts the operator to check the M-Pesa line and issue
 * an access code by hand if it checks out.
 */
export async function notifyManualPaymentClaim(quiz, { email, reference, note }) {
  if (skipIfUnconfigured("manual payment claim")) return { sent: false, reason: "not-configured" };

  try {
    await send({
      to: notifyAddress(),
      replyTo: email || undefined,
      subject: `MoneyGram claim — ${quiz.shortTitle}`,
      html: wrap(
        "A learner claims they paid via MoneyGram",
        `<p style="line-height:1.7">Unverified — check the M-Pesa line for a
           matching payout before issuing an access code.</p>
         <table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:8px;overflow:hidden">
           ${row("Quiz", quiz.title)}
           ${row("Buyer email", email || "not given")}
           ${row("MoneyGram reference", reference || "not given")}
         </table>
         ${note ? `<p style="line-height:1.7;margin-top:16px">${esc(note)}</p>` : ""}`
      ),
    });
    return { sent: true };
  } catch (error) {
    console.error("[quiz] manual claim alert failed:", error.response?.data || error.message);
    return { sent: false, reason: error.message };
  }
}

/** Acknowledges the claim to the buyer so they know it did not vanish. */
export async function confirmClaimReceived(quiz, email) {
  if (!email) return { sent: false, reason: "no buyer email" };
  if (skipIfUnconfigured("claim confirmation")) return { sent: false, reason: "not-configured" };

  try {
    await send({
      to: email,
      replyTo: notifyAddress(),
      subject: `We received your payment claim — ${quiz.shortTitle}`,
      html: wrap(
        "Claim received",
        `<p style="line-height:1.7">Thanks — we have your MoneyGram reference for
           <strong>${esc(quiz.title)}</strong> and are checking it against the
           M-Pesa line now.</p>
         <p style="line-height:1.7">Once confirmed, we will reply to this email
           with your access code. Enter it on the quiz page under
           <strong>"I have an access code."</strong></p>
         <p style="line-height:1.7;font-size:14px;color:#6b6488">This usually
           takes a few hours. If you have not heard back after a day, reply to
           this email.</p>`
      ),
    });
    return { sent: true };
  } catch (error) {
    console.error("[quiz] claim confirmation failed:", error.response?.data || error.message);
    return { sent: false, reason: error.message };
  }
}
