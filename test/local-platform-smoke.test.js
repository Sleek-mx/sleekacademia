import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { spawn } from "node:child_process";
import net from "node:net";

let port;
let base;
let server;
let requestId;
let attachmentId;

async function api(path, { method = "GET", role = "student", body } = {}) {
  return fetch(`${base}/api/platform${path}`, {
    method,
    headers: { ...(role === "admin" ? { "x-demo-role": "admin" } : {}), ...(body === undefined ? {} : { "content-type": "application/json" }) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}

before(async () => {
  port = await availablePort();
  base = `http://127.0.0.1:${port}`;
  const env = { ...process.env, PORT: String(port), LOCAL_DEMO_MODE: "1" };
  for (const name of ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "CLERK_PUBLISHABLE_KEY", "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "CLERK_SECRET_KEY", "STRIPE_SECRET_KEY", "PAYPAL_CLIENT_ID", "PAYPAL_SECRET", "GUMROAD_ACCESS_TOKEN"]) delete env[name];
  server = spawn(process.execPath, ["server.js"], { env, stdio: "ignore" });
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try { if ((await fetch(`${base}/api/health`)).ok) return; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Local platform smoke server did not start.");
});

after(() => server?.kill());

test("all review surfaces load from the real Express app", async () => {
  for (const path of ["/", "/about.html", "/blog.html", "/store.html", "/onboard.html", "/login.html", "/sign-up.html", "/dashboard.html", "/client-order.html", "/admin.html", "/admin-order.html"]) {
    const response = await fetch(`${base}${path}`);
    assert.equal(response.status, 200, path);
  }
  const health = await (await fetch(`${base}/api/health`)).json();
  assert.deepEqual(health, { ok: true, service: "sleek-academia" });

  const homepage = await fetch(`${base}/`);
  const homepageHtml = await homepage.text();
  assert.match(homepageHtml, /class="site-footer"/);
  assert.doesNotMatch(homepageHtml, /sleek-academia-logo-source|1595|993/);
  assert.match(homepage.headers.get("content-security-policy") || "", /default-src 'self'/);
  assert.equal(homepage.headers.get("x-content-type-options"), "nosniff");

  const gumroad = await fetch(`${base}/api/gumroad/products`);
  assert.equal(gumroad.status, 200);
  assert.deepEqual(await gumroad.json(), { products: [], configured: false });
});

function availablePort() {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.unref();
    probe.on("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const address = probe.address();
      probe.close(() => resolve(address.port));
    });
  });
}

test("request, quote, deposit, delivery lock, balance, and download work end to end", async () => {
  const handoff = await api("/requests/handoff", {
    method: "POST",
    body: {
      idempotencyKey: "smoke-complete-flow",
      service: "essay",
      subject: "Nursing quality",
      title: "Local smoke request",
      description: "Exercise the complete protected request and delivery flow.",
      deadline: "2026-08-01",
      citationStyle: "APA 7",
      pageCount: "4",
      name: "Max Demo",
      email: "max.demo@sleekacademia.local",
      urgentPhone: "",
      school: "Demo University",
    },
  });
  assert.equal(handoff.status, 201);
  requestId = (await handoff.json()).order.id;

  const quote = await api(`/admin/orders/${requestId}/accept`, { method: "POST", role: "admin", body: { acceptedDeadline: "2026-08-01T18:00:00.000Z" } });
  assert.equal((await quote.json()).order.status, "Deposit Due");

  const deposit = await api(`/requests/${requestId}/payments/demo-confirm`, { method: "POST", body: { amountCents: 1 } });
  const depositPayload = await deposit.json();
  assert.equal(depositPayload.payment.amountCents, 3000);
  assert.equal(depositPayload.request.status, "In Progress");

  const delivery = await api(`/admin/orders/${requestId}/deliverables`, {
    method: "POST",
    role: "admin",
    body: { category: "final", fileName: "smoke-final.txt", mimeType: "text/plain", contentBase64: Buffer.from("verified local delivery").toString("base64") },
  });
  attachmentId = (await delivery.json()).attachment.id;
  const delivered = await api(`/admin/orders/${requestId}/status`, { method: "PATCH", role: "admin", body: { status: "Delivered" } });
  assert.equal(delivered.status, 200);
  assert.equal((await api(`/attachments/${attachmentId}/download`)).status, 423);

  const balance = await api(`/requests/${requestId}/payments/demo-confirm`, { method: "POST", body: { amountCents: 1 } });
  const balancePayload = await balance.json();
  assert.equal(balancePayload.payment.amountCents, 3000);
  assert.equal(balancePayload.request.status, "Delivered");

  const download = await api(`/attachments/${attachmentId}/download`);
  assert.equal(download.status, 200);
  assert.equal(await download.text(), "verified local delivery");

  const detailAfterDownload = await (await api(`/orders/${requestId}`)).json();
  assert.equal(detailAfterDownload.revisionEligibility.eligible, true);

  const revision = await api(`/orders/${requestId}/revisions`, { method: "POST", body: { instructions: "Please correct the final reference entry." } });
  assert.equal(revision.status, 201);
  assert.equal((await revision.json()).order.status, "Revision Requested");

  const revisionStarted = await api(`/admin/orders/${requestId}/status`, { method: "PATCH", role: "admin", body: { status: "In Revision" } });
  assert.equal(revisionStarted.status, 200);

  const redelivery = await api(`/admin/orders/${requestId}/deliverables`, {
    method: "POST",
    role: "admin",
    body: { category: "final", fileName: "smoke-final-v2.txt", mimeType: "text/plain", contentBase64: Buffer.from("verified revised delivery").toString("base64") },
  });
  assert.equal(redelivery.status, 201);
  const redelivered = await api(`/admin/orders/${requestId}/status`, { method: "PATCH", role: "admin", body: { status: "Delivered" } });
  assert.equal(redelivered.status, 200);

  const secondRevision = await api(`/orders/${requestId}/revisions`, { method: "POST", body: { instructions: "A second included revision should not be accepted." } });
  assert.equal(secondRevision.status, 409);
  assert.equal((await secondRevision.json()).additionalWork, true);

  const completed = await api(`/admin/orders/${requestId}/status`, { method: "PATCH", role: "admin", body: { status: "Completed" } });
  assert.equal(completed.status, 200);
  assert.equal((await completed.json()).order.status, "Completed");

  assert.equal((await api("/admin/overview")).status, 403);
  assert.equal((await api(`/admin/orders/${requestId}/payments/manual`, { method: "POST", role: "admin", body: {} })).status, 404);
});
