import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
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

const app = express();
const port = Number(process.env.PORT || 3000);

const validRoles = new Set(["admin", "tutor", "student"]);
const adminEmails = splitEmails(process.env.ADMIN_EMAILS);
const tutorEmails = splitEmails(process.env.TUTOR_EMAILS);

app.use(express.json());
app.use(clerkMiddleware());

app.get("/", (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.get("/app", (req, res) => {
  const auth = getAuth(req);
  res.redirect(auth.isAuthenticated ? "/dashboard.html" : "/onboard.html");
});

const clerkCookieNames = [
  "__session",
  "__refresh",
  "__client_uat",
  "__clerk_handshake",
  "__clerk_redirect_count",
  "__clerk_handshake_nonce",
];

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "sleek-academia",
    time: new Date().toISOString(),
  });
});

app.get("/logout", (_req, res) => {
  clerkCookieNames.forEach((cookieName) => {
    res.clearCookie(cookieName, { path: "/", sameSite: "lax" });
  });
  res.redirect("/onboard.html");
});

app.get("/api/config", (_req, res) => {
  const publishableKey =
    process.env.CLERK_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    "";
  const frontendApiUrl =
    process.env.CLERK_FRONTEND_API_URL || frontendApiFromPublishableKey(publishableKey);
  const clerkJsUrl = buildClerkJsUrl(frontendApiUrl);

  res.json({
    publishableKey,
    frontendApiUrl,
    clerkJsUrl,
    signInUrl: "/onboard.html",
    signUpUrl: "/onboard.html",
    afterSignInUrl: "/dashboard.html",
    afterSignUpUrl: "/dashboard.html",
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || "",
    paypalClientId: process.env.PAYPAL_CLIENT_ID || "",
  });
});

app.get("/dashboard.html", requireAuth(), (_req, res) => {
  res.sendFile(path.join(publicDir, "dashboard.html"));
});

app.get("/api/me", requireSession, async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const user = await clerkClient.users.getUser(userId);
    const role = await ensureUserRole(user);

    res.json({
      user: formatUser(user, role),
    });
  } catch (error) {
    res.status(500).json({
      error: "Unable to load the current user profile.",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.get("/api/admin/users", requireSession, requireAdmin, async (_req, res) => {
  try {
    const { data, totalCount } = await clerkClient.users.getUserList({
      orderBy: "-created_at",
      limit: 25,
    });

    const users = await Promise.all(
      data.map(async (user) => {
        const role = await ensureUserRole(user);
        return formatUser(user, role);
      }),
    );

    const counts = users.reduce(
      (accumulator, user) => {
        accumulator[user.role] += 1;
        return accumulator;
      },
      { admin: 0, tutor: 0, student: 0 },
    );

    res.json({
      totalCount,
      counts,
      users,
    });
  } catch (error) {
    res.status(500).json({
      error: "Unable to load platform users.",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.patch(
  "/api/admin/users/:userId/role",
  requireSession,
  requireAdmin,
  async (req, res) => {
    try {
      const role = normalizeRole(req.body?.role);

      if (!role) {
        return res.status(400).json({
          error: "Role must be one of admin, tutor, or student.",
        });
      }

      const updatedUser = await clerkClient.users.updateUserMetadata(
        req.params.userId,
        {
          publicMetadata: {
            role,
          },
        },
      );

      return res.json({
        success: true,
        user: formatUser(updatedUser, role),
      });
    } catch (error) {
      return res.status(500).json({
        error: "Unable to update the user's role.",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

app.patch("/api/me/profile", requireSession, async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const user = await clerkClient.users.getUser(userId);
    const currentRole = await ensureUserRole(user);
    const payload = req.body || {};

    const publicMetadata = {
      ...(user.publicMetadata || {}),
      role: currentRole,
      selectedExam:
        typeof payload.selectedExam === "string" ? payload.selectedExam.trim() : user.publicMetadata?.selectedExam,
      selectedCategory:
        typeof payload.selectedCategory === "string"
          ? payload.selectedCategory.trim().toLowerCase()
          : user.publicMetadata?.selectedCategory,
      attemptStatus:
        typeof payload.attemptStatus === "string" ? payload.attemptStatus.trim() : user.publicMetadata?.attemptStatus,
      examOption:
        typeof payload.examOption === "string" ? payload.examOption.trim() : user.publicMetadata?.examOption,
      assistanceType:
        typeof payload.assistanceType === "string"
          ? payload.assistanceType.trim()
          : user.publicMetadata?.assistanceType,
    };

    const updatedUser = await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata,
    });

    res.json({
      success: true,
      user: formatUser(updatedUser, currentRole),
    });
  } catch (error) {
    res.status(500).json({
      error: "Unable to update onboarding metadata.",
      details: error instanceof Error ? error.message : "Unknown error",
    });
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
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{ amount: { currency_code: "USD", value: (cents / 100).toFixed(2) }, description }],
      }),
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
    if (!cents || cents < 50) {
      return res.status(400).json({ error: "Invalid amount. Minimum is $0.50." });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: cents,
      currency,
      description,
      automatic_payment_methods: { enabled: true },
    });
    return res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : "Payment failed." });
  }
});

app.use("/assets", express.static(assetsDir));
app.use(express.static(publicDir, { extensions: ["html"] }));

app.use((req, res) => {
  res.status(404).sendFile(path.join(publicDir, "404.html"));
});

app.listen(port, () => {
  console.log(`Sleek Academia is running at http://localhost:${port}`);
});

function splitEmails(value = "") {
  return new Set(
    value
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean),
  );
}

function normalizeRole(value) {
  if (typeof value !== "string") return null;
  const role = value.trim().toLowerCase();
  return validRoles.has(role) ? role : null;
}

function primaryEmail(user) {
  if (!user?.emailAddresses?.length) return "";

  const primaryId = user.primaryEmailAddressId;
  const primary =
    user.emailAddresses.find((email) => email.id === primaryId) ||
    user.emailAddresses[0];

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
  await clerkClient.users.updateUserMetadata(user.id, {
    publicMetadata: { role },
  });
  return role;
}

async function requireAdmin(req, res, next) {
  try {
    const { userId } = getAuth(req);
    const user = await clerkClient.users.getUser(userId);
    const role = await ensureUserRole(user);

    if (role !== "admin") {
      return res.status(403).json({ error: "Admin access is required." });
    }

    req.currentUser = user;
    req.currentRole = role;
    return next();
  } catch (error) {
    return res.status(500).json({
      error: "Unable to verify admin access.",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

function requireSession(req, res, next) {
  const auth = getAuth(req);

  if (!auth.isAuthenticated || !auth.userId) {
    return res.status(401).json({ error: "Authentication is required." });
  }

  return next();
}

function formatUser(user, role) {
  const email = primaryEmail(user);
  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
    email ||
    "Sleek Academia User";

  return {
    id: user.id,
    role,
    email,
    fullName,
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
