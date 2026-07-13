import "dotenv/config";
import axios from "axios";
import crypto from "crypto";
import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";
import express from "express";
import Stripe from "stripe";
import {
  clerkClient,
  clerkMiddleware,
  getAuth,
  requireAuth,
} from "@clerk/express";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2024-06-20",
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "public");
const assetsDir = path.join(__dirname, "assets");
const execAsync = promisify(exec);

const app = express();
const port = Number(process.env.PORT || 3000);
const clerkIsConfigured = Boolean(
  (process.env.CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
  process.env.CLERK_SECRET_KEY
);
const staticOptions = {
  extensions: ["html"],
  setHeaders: (res, filePath) => {
    if (filePath.endsWith(".html")) {
      res.setHeader("Cache-Control", "no-cache");
    }
  }
};

const validRoles = new Set(["admin", "tutor", "student"]);
const adminEmails = splitEmails(process.env.ADMIN_EMAILS);
const tutorEmails = splitEmails(process.env.TUTOR_EMAILS);

app.post("/deploy.php", express.raw({ type: "application/json", limit: "2mb" }), async (req, res) => {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    return res.status(503).json({ error: "Deployment webhook is not configured" });
  }
  const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from("");
  const expectedSignature = `sha256=${crypto.createHmac("sha256", secret).update(rawBody).digest("hex")}`;
  const receivedSignature = req.get("x-hub-signature-256") || "";

  const expectedBuffer = Buffer.from(expectedSignature);
  const receivedBuffer = Buffer.from(receivedSignature);
  if (
    !receivedSignature ||
    expectedBuffer.length !== receivedBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  ) {
    return res.status(403).json({ error: "Invalid signature" });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody.toString("utf8"));
  } catch {
    return res.status(400).json({ error: "Invalid JSON payload" });
  }

  if (payload.ref !== "refs/heads/main") {
    return res.json({ status: "ignored", reason: "not main branch" });
  }

  const repoPath = process.env.DEPLOY_REPO_PATH || "/home/sleenegb/repositories/sleekacademia";
  const livePath = process.env.DEPLOY_LIVE_PATH || "/home/sleenegb/public_html/sleekacademianewsite";
  const npmBin = process.env.DEPLOY_NPM_BIN || "/opt/alt/alt-nodejs20/root/usr/bin/npm";
  const logFile = process.env.DEPLOY_LOG_FILE || "/home/sleenegb/deploy.log";

  const commands = [
    `cd ${shellQuote(repoPath)} && git fetch origin main && git reset --hard origin/main`,
    `/usr/bin/rsync -a --delete --exclude='.git' --exclude='.cpanel.yml' --exclude='node_modules' --exclude='.env' ${shellQuote(`${repoPath}/`)} ${shellQuote(`${livePath}/`)}`,
    `cd ${shellQuote(livePath)} && ${shellQuote(npmBin)} install --omit=dev`,
    `mkdir -p ${shellQuote(`${livePath}/tmp`)} && touch ${shellQuote(`${livePath}/tmp/restart.txt`)}`
  ];

  const results = [];
  for (const command of commands) {
    try {
      const { stdout, stderr } = await execAsync(command, { timeout: 120000 });
      results.push({ command, code: 0, output: `${stdout}${stderr}`.slice(-4000) });
    } catch (error) {
      results.push({
        command,
        code: error.code || 1,
        output: `${error.stdout || ""}${error.stderr || error.message || ""}`.slice(-4000)
      });
      break;
    }
  }

  const failed = results.filter((step) => step.code !== 0);
  const logLine = `${new Date().toISOString()} | commit=${payload.after || "unknown"} | pusher=${payload.pusher?.name || "unknown"} | errors=${failed.length}\n`;
  try {
    await fs.appendFile(logFile, logLine);
  } catch (error) {
    results.push({ command: "write deploy log", code: error.code || 1, output: error.message });
  }

  return res.status(failed.length ? 500 : 200).json({
    status: failed.length ? "failed" : "success",
    commit: payload.after || "unknown",
    steps: results.length,
    errors: failed.map((step) => step.command)
  });
});

app.get("/deploy.php", (_req, res) => {
  res.status(404).send("Not found");
});

app.use(express.json());

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'https://sleekacademia.com,http://localhost:3000').split(',');
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.get("/", (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

const legacySeoRedirects = new Map([
  ["/index.html", "/"],
  ["/order.html", "/onboard.html"],
  // Cut pages — 301 to their load-bearing replacements (see SEO slimming, 2026-06)
  ["/services.html", "/"],
  ["/ai-tools.html", "/"],
  ["/ai-tools-pro.html", "/"],
  ["/courses.html", "/"],
  ["/pricing.html", "/onboard.html"],
  ["/blogs.html", "/blog.html"]
]);

for (const [source, destination] of legacySeoRedirects) {
  app.get(source, (_req, res) => res.redirect(301, destination));
}

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "sleek-academia",
    deployWebhook: true,
    clerkConfigured: clerkIsConfigured,
    time: new Date().toISOString()
  });
});

app.use("/assets", express.static(assetsDir));
app.use((req, res, next) => {
  if (req.path === "/dashboard.html") return next();
  return express.static(publicDir, staticOptions)(req, res, next);
});

if (clerkIsConfigured) {
  app.use(clerkMiddleware());
}

app.get("/app", (req, res) => {
  if (!clerkIsConfigured) return res.redirect("/onboard.html");
  const auth = getAuth(req);
  res.redirect(auth.isAuthenticated ? "/dashboard.html" : "/onboard.html");
});

const clerkCookieNames = [
  "__session", "__refresh", "__client_uat",
  "__clerk_handshake", "__clerk_redirect_count", "__clerk_handshake_nonce",
];

app.get("/logout", (_req, res) => {
  clerkCookieNames.forEach((cookieName) => {
    res.clearCookie(cookieName, { path: "/", sameSite: "lax" });
  });
  res.redirect("/onboard.html");
});

app.get("/api/config", (_req, res) => {
  const publishableKey =
    process.env.CLERK_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
  const frontendApiUrl =
    process.env.CLERK_FRONTEND_API_URL || frontendApiFromPublishableKey(publishableKey);
  const clerkJsUrl = buildClerkJsUrl(frontendApiUrl);
  res.json({
    publishableKey, frontendApiUrl, clerkJsUrl,
    signInUrl: "/onboard.html", signUpUrl: "/onboard.html",
    afterSignInUrl: "/dashboard.html", afterSignUpUrl: "/dashboard.html",
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || "",
    paypalClientId: process.env.PAYPAL_CLIENT_ID || "",
  });
});

app.get("/dashboard.html", requireClerkConfigured, requireAuth(), (_req, res) => {
  res.sendFile(path.join(publicDir, "dashboard.html"));
});

app.get("/api/me", requireSession, async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const user = await clerkClient.users.getUser(userId);
    const role = await ensureUserRole(user);
    res.json({ user: formatUser(user, role) });
  } catch (error) {
    res.status(500).json({ error: "Unable to load the current user profile.", details: error instanceof Error ? error.message : "Unknown error" });
  }
});

app.post("/api/service-request", requireSession, async (req, res) => {
  const service = String(req.body?.service || "").trim();
  const subject = String(req.body?.subject || "").trim();
  const details = String(req.body?.details || "").trim();

  if (!service || !subject || !details) {
    return res.status(400).json({ error: "Service, subject, and details are all required." });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpPort = Number(process.env.SMTP_PORT || 465);
  const smtpConfigured = Boolean(smtpHost && smtpUser && smtpPass);
  if (!resendKey && !smtpConfigured) {
    return res.status(500).json({ error: "Email service not configured." });
  }

  const notifyTo = (process.env.SERVICE_REQUEST_EMAIL || process.env.TUTOR_EMAILS || process.env.NOTIFICATION_EMAIL || "macsinjobs@gmail.com")
    .split(",").map((addr) => addr.trim()).filter(Boolean);

  let clientName = "Unknown client";
  let clientEmail = "unknown";
  try {
    const { userId } = getAuth(req);
    const user = await clerkClient.users.getUser(userId);
    clientEmail = primaryEmail(user) || "unknown";
    clientName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || user.username || clientEmail;
  } catch (_err) {
    // Non-fatal: still deliver the request even if the profile lookup fails.
  }

  const esc = (str) => String(str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const row = (key, val) => `<tr>
        <td style="padding:8px 12px;font-weight:700;color:#0f172a;white-space:nowrap;border-bottom:1px solid #e2e8f0">${esc(key)}</td>
        <td style="padding:8px 12px;color:#334155;border-bottom:1px solid #e2e8f0">${esc(val)}</td>
      </tr>`;
  const html = `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#0f172a;margin-top:0">New Service Request 📥</h2>
          <table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:8px;overflow:hidden;margin-bottom:20px">
            ${row("Client", clientName)}
            ${row("Email", clientEmail)}
            ${row("Service / Vertical", service)}
            ${row("Subject", subject)}
          </table>
          <div style="border-left:4px solid #702ae1;padding:12px 16px;border-radius:4px;font-size:14px;color:#334155;line-height:1.7;background:#f5f3ff">${esc(details).replace(/\n/g, "<br>")}</div>
          <p style="color:#94a3b8;font-size:12px;margin-top:20px">Submitted from the Sleek Academia client dashboard</p>
        </div>`;

  const mailSubject = `Service Request: ${subject} | Sleek Academia`;
  const replyTo = clientEmail !== "unknown" ? clientEmail : undefined;

  try {
    if (resendKey) {
      // Preferred channel: Resend (same provider as the chatbot enquiry email).
      await axios.post(
        "https://api.resend.com/emails",
        {
          from: process.env.RESEND_FROM || "Sleek Academia <onboarding@resend.dev>",
          to: notifyTo,
          reply_to: replyTo,
          subject: mailSubject,
          html,
        },
        { headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" }, timeout: 15000 }
      );
    } else {
      // Fallback: SMTP. Dynamic import so a missing module degrades to a 500 here, not an app-boot crash.
      const nodemailer = (await import("nodemailer")).default;
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
        tls: { rejectUnauthorized: false }, // shared-host mail cert is *.web-hosting.com
      });
      await transporter.sendMail({
        from: `"Sleek Academia" <${smtpUser}>`,
        to: notifyTo,
        replyTo,
        subject: mailSubject,
        html,
      });
    }
    return res.json({ ok: true });
  } catch (err) {
    console.error("Service request email error:", err.response?.data || (err && err.message) || err);
    return res.status(500).json({ error: "Failed to send your request. Please try again." });
  }
});

app.get("/api/admin/users", requireSession, requireAdmin, async (_req, res) => {
  try {
    const { data, totalCount } = await clerkClient.users.getUserList({ orderBy: "-created_at", limit: 25 });
    const users = await Promise.all(data.map(async (user) => { const role = await ensureUserRole(user); return formatUser(user, role); }));
    const counts = users.reduce((acc, user) => { acc[user.role] += 1; return acc; }, { admin: 0, tutor: 0, student: 0 });
    res.json({ totalCount, counts, users });
  } catch (error) {
    res.status(500).json({ error: "Unable to load platform users.", details: error instanceof Error ? error.message : "Unknown error" });
  }
});

app.patch("/api/admin/users/:userId/role", requireSession, requireAdmin, async (req, res) => {
  try {
    const role = normalizeRole(req.body?.role);
    if (!role) return res.status(400).json({ error: "Role must be one of admin, tutor, or student." });
    const updatedUser = await clerkClient.users.updateUserMetadata(req.params.userId, { publicMetadata: { role } });
    return res.json({ success: true, user: formatUser(updatedUser, role) });
  } catch (error) {
    return res.status(500).json({ error: "Unable to update the user's role.", details: error instanceof Error ? error.message : "Unknown error" });
  }
});

app.patch("/api/me/profile", requireSession, async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const user = await clerkClient.users.getUser(userId);
    const currentRole = await ensureUserRole(user);
    const payload = req.body || {};
    const publicMetadata = {
      ...(user.publicMetadata || {}),
      role: currentRole,
      selectedExam: typeof payload.selectedExam === "string" ? payload.selectedExam.trim() : user.publicMetadata?.selectedExam,
      selectedCategory: typeof payload.selectedCategory === "string" ? payload.selectedCategory.trim().toLowerCase() : user.publicMetadata?.selectedCategory,
      attemptStatus: typeof payload.attemptStatus === "string" ? payload.attemptStatus.trim() : user.publicMetadata?.attemptStatus,
      examOption: typeof payload.examOption === "string" ? payload.examOption.trim() : user.publicMetadata?.examOption,
      assistanceType: typeof payload.assistanceType === "string" ? payload.assistanceType.trim() : user.publicMetadata?.assistanceType,
    };
    const updatedUser = await clerkClient.users.updateUserMetadata(userId, { publicMetadata });
    res.json({ success: true, user: formatUser(updatedUser, currentRole) });
  } catch (error) {
    res.status(500).json({ error: "Unable to update onboarding metadata.", details: error instanceof Error ? error.message : "Unknown error" });
  }
});

// ── PayPal helpers ─────────────────────────────────────────────────────────────
const PAYPAL_BASE = () => process.env.PAYPAL_BASE_URL || "https://api-m.sandbox.paypal.com";

async function getPayPalToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID || "";
  const secret = process.env.PAYPAL_SECRET || "";
  if (!clientId || clientId.startsWith("REPLACE")) throw new Error("PayPal credentials not configured.");
  const creds = Buffer.from(`${clientId}:${secret}`).toString("base64");
  const res = await fetch(`${PAYPAL_BASE()}/v1/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: `Basic ${creds}` },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  if (!data.access_token) throw new Error("Failed to obtain PayPal token.");
  return data.access_token;
}

app.post("/api/paypal/create-order", async (req, res) => {
  try {
    const { amount, description = "Sleek Academia Service" } = req.body;
    const cents = Math.round(Number(amount));
    if (!cents || cents < 50) return res.status(400).json({ error: "Invalid amount." });
    const token = await getPayPalToken();
    const order = await fetch(`${PAYPAL_BASE()}/v2/checkout/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ intent: "CAPTURE", purchase_units: [{ amount: { currency_code: "USD", value: (cents / 100).toFixed(2) }, description }] }),
    }).then(r => r.json());
    return res.json({ id: order.id });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : "PayPal order failed." });
  }
});

app.post("/api/paypal/capture-order/:orderId", async (req, res) => {
  try {
    const token = await getPayPalToken();
    const capture = await fetch(`${PAYPAL_BASE()}/v2/checkout/orders/${req.params.orderId}/capture`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    }).then(r => r.json());
    return res.json(capture);
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : "PayPal capture failed." });
  }
});

app.post("/api/stripe/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency = "usd", description = "Sleek Academia Service" } = req.body;
    const cents = Math.round(Number(amount));
    if (!cents || cents < 50) return res.status(400).json({ error: "Invalid amount. Minimum is $0.50." });
    const paymentIntent = await stripe.paymentIntents.create({ amount: cents, currency, description, automatic_payment_methods: { enabled: true } });
    return res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : "Payment failed." });
  }
});

app.post("/api/stripe/create-checkout-session", async (req, res) => {
  try {
    const { priceAmountCents, productName } = req.body;
    const cents = Math.round(Number(priceAmountCents));
    if (!cents || cents < 50) return res.status(400).json({ error: "Invalid amount." });
    if (!productName || typeof productName !== "string" || productName.length > 200) {
      return res.status(400).json({ error: "Product name required." });
    }
    const baseUrl = (process.env.BASE_URL || `${req.protocol}://${req.get("host")}`).replace(/\/$/, "");
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: `Sleek Academia — ${productName}`,
            description: "Exam prep course access",
          },
          unit_amount: cents,
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `${baseUrl}/payment-success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/store.html`,
    });
    return res.json({ url: session.url });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : "Checkout session failed." });
  }
});

// ── Gumroad Products (public, 5-min server-side cache) ────────────────────
let _gumroadCache = { products: null, fetchedAt: 0 };
const GUMROAD_TTL = 5 * 60 * 1000;

app.get('/api/gumroad/products', async (_req, res) => {
  try {
    const token = process.env.GUMROAD_ACCESS_TOKEN;
    if (!token) return res.status(503).json({ error: 'Gumroad not configured.' });

    if (_gumroadCache.products && Date.now() - _gumroadCache.fetchedAt < GUMROAD_TTL) {
      return res.json({ products: _gumroadCache.products, cached: true });
    }

    const { data } = await axios.get('https://api.gumroad.com/v2/products', {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10000,
    });

    if (!data.success) throw new Error('Gumroad API error');

    const products = (data.products || [])
      .filter(p => p.published)
      .map(p => ({
        id: p.id,
        name: p.name,
        description: (p.description || '').replace(/<[^>]*>/g, '').slice(0, 120),
        formattedPrice: p.formatted_price || 'See price',
        url: p.short_url,
        permalink: p.permalink,
        coverUrl: p.cover_url || null,
      }));

    _gumroadCache = { products, fetchedAt: Date.now() };
    return res.json({ products, cached: false });
  } catch (err) {
    console.error('Gumroad API error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch Gumroad products.' });
  }
});

// ── NVIDIA AI Chat Route (public — no auth required, axios avoids Node v25 fetch bug) ──
async function nvidiaChat(apiKey, body) {
  const { data } = await axios.post(
    "https://integrate.api.nvidia.com/v1/chat/completions",
    body,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      timeout: 30000,
    }
  );
  return data;
}

app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages, systemPrompt } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages are required." });
    }

    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "AI service not configured." });

    const result = await nvidiaChat(apiKey, {
      model: "meta/llama-3.2-1b-instruct",
      messages: [
        {
          role: "system",
          content: systemPrompt || "You are a helpful academic tutor for Sleek Academia. Be concise, accurate, and impactful.",
        },
        ...messages,
      ],
      max_tokens: 400,
      temperature: 0.5,
      top_p: 0.9,
    });

    const reply = result.choices?.[0]?.message?.content || "";
    return res.json({ reply });

  } catch (error) {
    console.error("AI chat error:", error.message);
    return res.status(500).json({ error: "AI service error. Please try again." });
  }
});

// ── Chatbot intake summary → Resend email (public route — no auth required) ──
// Uses axios to avoid Node v25 undici/fetch issues.
app.post("/api/chat/send-summary", async (req, res) => {
  const { summary } = req.body;
  if (!summary) return res.status(400).json({ error: "No summary provided." });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Email service not configured." });

  // Split structured labels (first block) from Aria's narrative (second block)
  const parts = summary.split(/\n\n/);
  const labelBlock = parts[0] || "";
  const narrative  = parts.slice(1).join("\n\n");

  function esc(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // Render "Key: Value" lines as a clean table
  const detailRows = esc(labelBlock)
    .split(/\n/)
    .filter(Boolean)
    .map(function (line) {
      const colon = line.indexOf(":");
      if (colon === -1) return `<tr><td colspan="2" style="padding:6px 12px">${line}</td></tr>`;
      const key = line.slice(0, colon).trim();
      const val = line.slice(colon + 1).trim();
      return `<tr>
        <td style="padding:8px 12px;font-weight:700;color:#0f172a;white-space:nowrap;border-bottom:1px solid #e2e8f0">${key}</td>
        <td style="padding:8px 12px;color:#334155;border-bottom:1px solid #e2e8f0">${val}</td>
      </tr>`;
    })
    .join("");

  const safeNarrative = esc(narrative).replace(/\n/g, "<br>");

  try {
    await axios.post(
      "https://api.resend.com/emails",
      {
        from: "Aria at Sleek Academia <onboarding@resend.dev>",
        to: ["macsinjobs@gmail.com"],
        subject: "New Student Enquiry | Sleek Academia",
        html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#0f172a;margin-top:0">New Student Enquiry 🎓</h2>
          <table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:8px;overflow:hidden;margin-bottom:20px">
            ${detailRows}
          </table>
          ${safeNarrative ? `<div style="border-left:4px solid #f59e0b;padding:12px 16px;border-radius:4px;font-size:14px;color:#334155;line-height:1.7;background:#fffbeb">${safeNarrative}</div>` : ""}
          <p style="color:#94a3b8;font-size:12px;margin-top:20px">Sent via Sleek Academia AI Chatbot</p>
        </div>`,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );
    return res.json({ ok: true });
  } catch (err) {
    console.error("Resend error:", err.response?.data || err.message);
    return res.status(500).json({ error: "Failed to send email." });
  }
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(publicDir, "404.html"));
});

app.listen(port, () => {
  console.log(`Sleek Academia is running at http://localhost:${port}`);
});

function splitEmails(value = "") {
  return new Set(value.split(",").map((item) => item.trim().toLowerCase()).filter(Boolean));
}

function shellQuote(value) {
  return `'${String(value).replace(/'/g, "'\\''")}'`;
}

function normalizeRole(value) {
  if (typeof value !== "string") return null;
  const role = value.trim().toLowerCase();
  return validRoles.has(role) ? role : null;
}

function primaryEmail(user) {
  if (!user?.emailAddresses?.length) return "";
  const primaryId = user.primaryEmailAddressId;
  const primary = user.emailAddresses.find((email) => email.id === primaryId) || user.emailAddresses[0];
  return primary?.emailAddress?.toLowerCase() || "";
}

function inferRoleFromEmail(email) {
  if (adminEmails.has(email)) return "admin";
  if (tutorEmails.has(email)) return "tutor";
  return "student";
}

async function ensureUserRole(user) {
  const existingRole = normalizeRole(user?.publicMetadata?.role);
  if (existingRole) return existingRole;
  const role = inferRoleFromEmail(primaryEmail(user));
  await clerkClient.users.updateUserMetadata(user.id, { publicMetadata: { role } });
  return role;
}

async function requireAdmin(req, res, next) {
  try {
    const { userId } = getAuth(req);
    const user = await clerkClient.users.getUser(userId);
    const role = await ensureUserRole(user);
    if (role !== "admin") return res.status(403).json({ error: "Admin access is required." });
    req.currentUser = user;
    req.currentRole = role;
    return next();
  } catch (error) {
    return res.status(500).json({ error: "Unable to verify admin access.", details: error instanceof Error ? error.message : "Unknown error" });
  }
}

function requireSession(req, res, next) {
  if (!clerkIsConfigured) {
    return res.status(401).json({ error: "Authentication is required." });
  }
  const auth = getAuth(req);
  if (!auth.isAuthenticated || !auth.userId) return res.status(401).json({ error: "Authentication is required." });
  return next();
}

function requireClerkConfigured(_req, res, next) {
  if (!clerkIsConfigured) {
    return res.redirect("/login.html");
  }
  return next();
}

function formatUser(user, role) {
  const email = primaryEmail(user);
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || email || "Sleek Academia User";
  return {
    id: user.id, role, email, fullName,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    imageUrl: user.imageUrl || "",
    lastSignInAt: user.lastSignInAt || null,
    createdAt: user.createdAt || null,
    selectedExam: user.publicMetadata?.selectedExam || "",
    selectedCategory: user.publicMetadata?.selectedCategory || "",
    attemptStatus: user.publicMetadata?.attemptStatus || "",
    examOption: user.publicMetadata?.examOption || "",
    assistanceType: user.publicMetadata?.assistanceType || "",
  };
}

function buildClerkJsUrl(frontendApiUrl) {
  if (process.env.CLERK_JS_URL) return process.env.CLERK_JS_URL;
  if (!frontendApiUrl) return "";
  if (frontendApiUrl.startsWith("http://") || frontendApiUrl.startsWith("https://")) {
    return `${frontendApiUrl.replace(/\/$/, "")}/npm/@clerk/clerk-js@5/dist/clerk.browser.js`;
  }
  return `https://${frontendApiUrl}/npm/@clerk/clerk-js@5/dist/clerk.browser.js`;
}

function frontendApiFromPublishableKey(publishableKey) {
  if (!publishableKey) return "";
  const encoded = publishableKey.split("_").slice(2).join("_");
  if (!encoded) return "";
  try {
    const decoded = Buffer.from(encoded, "base64").toString("utf8").replace(/\$+$/, "");
    return decoded;
  } catch {
    return "";
  }
}
