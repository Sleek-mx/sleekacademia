import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { createClerkClient } from "@clerk/backend";
import Stripe from "stripe";

const BASE_URL = process.env.PRODUCTION_BASE_URL || "https://sleekacademia.com";
const TEST_EMAIL = "client.test@sleekacademia.com";
const ISOLATION_EMAIL = "client.isolation@sleekacademia.com";
const PAYMENTS_FILE = "/Users/ephantusmacharia/Obsidian/Secret Stash/08 - Credentials & Keys/Payments - Stripe & PayPal.md";

function keychain(account, service) {
  return execFileSync("/usr/bin/security", [
    "find-generic-password", "-a", account, "-s", service, "-w",
  ], { encoding: "utf8" }).trim();
}

function vaultValue(source, name) {
  return (source.match(new RegExp(`${name}=\\s*([^\\s\`]+)`)) || [])[1] || "";
}

function cookiesFrom(response) {
  const values = typeof response.headers.getSetCookie === "function"
    ? response.headers.getSetCookie()
    : [response.headers.get("set-cookie")].filter(Boolean);
  return values.map((value) => value.split(";", 1)[0]).join("; ");
}

async function json(response) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error || `HTTP ${response.status}`);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }
  return payload;
}

async function expectStatus(response, status, label) {
  if (response.status !== status) {
    const payload = await response.text();
    throw new Error(`${label}: expected ${status}, received ${response.status}: ${payload.slice(0, 300)}`);
  }
  return response;
}

async function poll(label, read, predicate, { attempts = 24, delayMs = 1000 } = {}) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const value = await read();
    if (predicate(value)) return value;
    if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  throw new Error(`${label} did not reach the expected state.`);
}

const clerkSecret = keychain("faithful-labrador-45", "sleekacademia.clerk.secret_key");
const adminPassword = keychain("MCX", "sleekacademia.admin.password");
const paymentsSource = fs.readFileSync(PAYMENTS_FILE, "utf8");
const stripeSecret = vaultValue(paymentsSource, "STRIPE_SECRET_KEY");
if (!clerkSecret || !adminPassword || !stripeSecret.startsWith("sk_test_")) {
  throw new Error("The production smoke-test credentials are incomplete.");
}

const clerk = createClerkClient({ secretKey: clerkSecret });
const stripe = new Stripe(stripeSecret, { apiVersion: "2024-06-20" });
const createdSessions = [];

async function userByEmail(email) {
  const result = await clerk.users.getUserList({ emailAddress: [email], limit: 2 });
  return (result.data || result)[0] || null;
}

async function tokenFor(userId) {
  const session = await clerk.sessions.createSession({ userId });
  createdSessions.push(session.id);
  return (await clerk.sessions.getToken(session.id)).jwt;
}

const testUser = await userByEmail(TEST_EMAIL);
if (!testUser) throw new Error("The production test client does not exist in Clerk.");
const clientToken = await tokenFor(testUser.id);

const isolationUser = await userByEmail(ISOLATION_EMAIL) || await clerk.users.createUser({
  emailAddress: [ISOLATION_EMAIL],
  password: randomBytes(20).toString("base64url"),
  firstName: "Isolation",
  lastName: "Test Client",
  skipLegalChecks: true,
});
const isolationToken = await tokenFor(isolationUser.id);

let clientCookie = "";
let clientCsrf = "";
const clientHeaders = (write = false) => ({
  Accept: "application/json",
  Authorization: `Bearer ${clientToken}`,
  Origin: BASE_URL,
  ...(clientCookie ? { Cookie: clientCookie } : {}),
  ...(write ? { "Content-Type": "application/json", "x-csrf-token": clientCsrf } : {}),
});

async function clientFetch(path, options = {}) {
  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...clientHeaders(!new Set(["GET", "HEAD"]).has(options.method || "GET")), ...(options.headers || {}) },
  });
}

let adminCookie = "";
let adminCsrf = "";
const adminHeaders = (write = false) => ({
  Accept: "application/json",
  Origin: BASE_URL,
  ...(adminCookie ? { Cookie: adminCookie } : {}),
  ...(write ? { "Content-Type": "application/json", "x-csrf-token": adminCsrf } : {}),
});

async function adminFetch(path, options = {}) {
  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...adminHeaders(!new Set(["GET", "HEAD"]).has(options.method || "GET")), ...(options.headers || {}) },
  });
}

const report = {
  baseUrl: BASE_URL,
  clientAuth: false,
  adminAuth: false,
  tenantIsolation: false,
  pricing: null,
  paypalOrderCreatedNotCaptured: false,
  stripeDepositConfirmed: false,
  unpaidDeliveryLocked: false,
  stripeBalanceConfirmed: false,
  paidDeliveryDownloaded: false,
  revisionCompleted: false,
  completed: false,
  earningsCents: 0,
};

try {
  const clientSessionResponse = await clientFetch("/api/platform/session");
  const clientSession = await json(clientSessionResponse);
  clientCookie = cookiesFrom(clientSessionResponse);
  clientCsrf = clientSession.csrfToken || "";
  if (clientSession.identity?.userId !== testUser.id || !clientCookie || !clientCsrf) {
    throw new Error("The Clerk client session did not initialize completely.");
  }
  report.clientAuth = true;

  const adminLoginResponse = await fetch(`${BASE_URL}/api/admin-auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE_URL },
    body: JSON.stringify({ username: "MCX", password: adminPassword }),
  });
  const adminLogin = await json(adminLoginResponse);
  adminCookie = cookiesFrom(adminLoginResponse);
  adminCsrf = adminLogin.csrfToken || "";
  if (adminLogin.identity?.role !== "admin" || !adminCookie || !adminCsrf) {
    throw new Error("The MCX admin session did not initialize completely.");
  }
  report.adminAuth = true;

  const runId = `${new Date().toISOString().slice(0, 10)}-${Date.now()}`;
  const orderPayload = {
    idempotencyKey: `production-smoke-${runId}`,
    service: "essay",
    subject: "Nursing",
    title: `Production backend validation ${runId}`,
    description: "Production pipeline validation order. This clearly labeled order verifies the real client, administrator, payment, private-file, delivery-lock, and revision workflow.",
    deadline: new Date(Date.now() + 7 * 86400000).toISOString(),
    citationStyle: "APA 7",
    pageCount: "1",
    wordCount: "275",
    urgency: "standard",
    assistanceType: "Essay writing",
    name: "Sleek Client Test",
    email: TEST_EMAIL,
    urgentPhone: "",
    school: "Production validation",
  };

  const createResponse = await clientFetch("/api/platform/orders/handoff", {
    method: "POST",
    body: JSON.stringify(orderPayload),
  });
  const created = await json(createResponse);
  const orderId = created.order?.id;
  if (!orderId || created.order.status !== "Available" || created.order.quoteCents !== 1500) {
    throw new Error("The production order was not created with the expected server price.");
  }
  report.orderId = orderId;
  report.pricing = {
    quoteCents: created.order.quoteCents,
    pageWords: created.order.pricingSnapshot?.pageWords,
    depositCents: created.order.pricingSnapshot?.depositCents,
    balanceCents: created.order.pricingSnapshot?.balanceCents,
  };

  await json(await clientFetch(`/api/platform/orders/${orderId}/attachments`, {
    method: "POST",
    body: JSON.stringify({
      fileName: "production-test-material.txt",
      mimeType: "text/plain",
      contentBase64: Buffer.from(`Production client material for ${runId}`).toString("base64"),
    }),
  }));

  await json(await adminFetch(`/api/platform/admin/orders/${orderId}/clarification`, {
    method: "POST",
    body: JSON.stringify({ body: "Production validation clarification: all required scope fields and the uploaded material are present." }),
  }));

  await json(await clientFetch(`/api/platform/orders/${orderId}/messages`, {
    method: "POST",
    body: JSON.stringify({ body: "Confirmed: the supplied brief and material are complete for this validation order.", idempotencyKey: `client-reply-${runId}` }),
  }));

  const accepted = await json(await adminFetch(`/api/platform/admin/orders/${orderId}/accept`, {
    method: "POST",
    body: JSON.stringify({ acceptedDeadline: orderPayload.deadline }),
  }));
  if (accepted.order.status !== "Deposit Due" || accepted.order.quoteCents !== 1500) {
    throw new Error("MCX acceptance did not produce the expected deposit milestone.");
  }

  const isolated = await fetch(`${BASE_URL}/api/platform/orders/${orderId}`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${isolationToken}`, Origin: BASE_URL },
  });
  await expectStatus(isolated, 404, "Tenant isolation");
  report.tenantIsolation = true;

  const paypal = await json(await clientFetch(`/api/platform/orders/${orderId}/payments/paypal-order`, {
    method: "POST",
    body: "{}",
  }));
  if (!paypal.orderId || paypal.amountCents !== 750 || paypal.milestone !== "deposit") {
    throw new Error("PayPal did not create the expected live deposit order.");
  }
  report.paypalOrderCreatedNotCaptured = true;

  const depositIntent = await json(await clientFetch(`/api/platform/orders/${orderId}/payments/stripe-intent`, {
    method: "POST",
    body: "{}",
  }));
  if (depositIntent.amountCents !== 750 || depositIntent.milestone !== "deposit") {
    throw new Error("Stripe did not create the expected deposit intent.");
  }
  const confirmedDeposit = await stripe.paymentIntents.confirm(depositIntent.providerTransactionId, {
    payment_method: "pm_card_visa",
    return_url: `${BASE_URL}/dashboard.html`,
  });
  if (confirmedDeposit.status !== "succeeded") throw new Error("Stripe test deposit did not succeed.");
  await poll("Stripe deposit webhook", async () => json(await clientFetch(`/api/platform/orders/${orderId}`)),
    (value) => value.order?.paidCents === 750 && value.order?.status === "In Progress");
  report.stripeDepositConfirmed = true;

  const finalUpload = await json(await adminFetch(`/api/platform/admin/orders/${orderId}/deliverables`, {
    method: "POST",
    body: JSON.stringify({
      category: "final",
      fileName: "production-delivery.txt",
      mimeType: "text/plain",
      contentBase64: Buffer.from(`Production delivery for ${runId}`).toString("base64"),
    }),
  }));
  const attachmentId = finalUpload.attachment?.id;
  if (!attachmentId || finalUpload.attachment.deliveryLocked !== true) {
    throw new Error("The final deliverable was not stored as payment locked.");
  }

  const delivered = await json(await adminFetch(`/api/platform/admin/orders/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status: "Delivered" }),
  }));
  if (delivered.order.status !== "Delivered") throw new Error("MCX could not mark the order delivered.");

  const lockedDownload = await clientFetch(`/api/platform/attachments/${attachmentId}/download`);
  await expectStatus(lockedDownload, 423, "Unpaid final delivery");
  report.unpaidDeliveryLocked = true;

  const balanceIntent = await json(await clientFetch(`/api/platform/orders/${orderId}/payments/stripe-intent`, {
    method: "POST",
    body: "{}",
  }));
  if (balanceIntent.amountCents !== 750 || balanceIntent.milestone !== "balance") {
    throw new Error("Stripe did not create the expected balance intent.");
  }
  const confirmedBalance = await stripe.paymentIntents.confirm(balanceIntent.providerTransactionId, {
    payment_method: "pm_card_visa",
    return_url: `${BASE_URL}/dashboard.html`,
  });
  if (confirmedBalance.status !== "succeeded") throw new Error("Stripe test balance did not succeed.");
  await poll("Stripe balance webhook", async () => json(await clientFetch(`/api/platform/orders/${orderId}`)),
    (value) => value.order?.paidCents === 1500 && value.order?.status === "Delivered");
  report.stripeBalanceConfirmed = true;

  const unlocked = await json(await clientFetch(`/api/platform/attachments/${attachmentId}/download`));
  const downloaded = await fetch(unlocked.signedUrl);
  const downloadedText = await downloaded.text();
  if (!downloaded.ok || downloadedText !== `Production delivery for ${runId}`) {
    throw new Error("The paid private delivery did not download with the expected content.");
  }
  report.paidDeliveryDownloaded = true;

  const revision = await json(await clientFetch(`/api/platform/orders/${orderId}/revisions`, {
    method: "POST",
    body: JSON.stringify({ instructions: "Production validation revision: add a final confirmation line." }),
  }));
  if (revision.order.status !== "Revision Requested") throw new Error("The included revision was not opened.");

  await json(await adminFetch(`/api/platform/admin/orders/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status: "In Revision" }),
  }));
  await json(await adminFetch(`/api/platform/admin/orders/${orderId}/deliverables`, {
    method: "POST",
    body: JSON.stringify({
      category: "final",
      fileName: "production-delivery-revised.txt",
      mimeType: "text/plain",
      contentBase64: Buffer.from(`Production delivery for ${runId}\nRevision confirmed.`).toString("base64"),
    }),
  }));
  const redelivered = await json(await adminFetch(`/api/platform/admin/orders/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status: "Delivered" }),
  }));
  if (redelivered.order.status !== "Delivered") throw new Error("The revised order was not redelivered.");
  report.revisionCompleted = true;

  const completed = await json(await adminFetch(`/api/platform/admin/orders/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status: "Completed" }),
  }));
  if (completed.order.status !== "Completed") throw new Error("The order was not completed.");
  report.completed = true;

  const payments = await json(await adminFetch("/api/platform/admin/payments"));
  const orderPayments = payments.payments.filter((payment) => payment.requestId === orderId && payment.status === "confirmed");
  if (orderPayments.length !== 2 || orderPayments.reduce((sum, payment) => sum + payment.amountCents, 0) !== 1500) {
    throw new Error("The confirmed payment ledger is incorrect.");
  }
  if (orderPayments.some((payment) => !/^\d{4}-\d{2}-\d{2}T/.test(payment.confirmedAt || ""))) {
    throw new Error("A confirmed payment is missing its confirmation timestamp.");
  }

  const earnings = await json(await adminFetch("/api/platform/admin/earnings?period=all"));
  report.earningsCents = earnings.earnings?.revenueCents || 0;
  if (report.earningsCents < 1500) throw new Error("The confirmed earnings report did not include the validation order.");

  const manualPayment = await adminFetch("/api/platform/admin/payments/manual", {
    method: "POST",
    body: JSON.stringify({ orderId, amountCents: 1 }),
  });
  if (manualPayment.status !== 404) throw new Error("A forbidden manual-payment route is present.");

  console.log(JSON.stringify({ ok: true, report }, null, 2));
} finally {
  await Promise.allSettled(createdSessions.map((sessionId) => clerk.sessions.revokeSession(sessionId)));
}
