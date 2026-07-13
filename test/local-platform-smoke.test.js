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
  for (const name of ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "CLERK_PUBLISHABLE_KEY", "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "CLERK_SECRET_KEY", "STRIPE_SECRET_KEY", "PAYPAL_CLIENT_ID", "PAYPAL_SECRET"]) delete env[name];
  server = spawn(process.execPath, ["server.js"], { env, stdio: "ignore" });
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try { if ((await fetch(`${base}/api/health`)).ok) return; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Local platform smoke server did not start.");
});

after(() => server?.kill());

test("all review surfaces load from the real Express app", async () => {
  for (const path of ["/", "/about.html", "/blog.html", "/store.html", "/onboard.html", "/login.html", "/sign-up.html", "/dashboard.html"]) {
    const response = await fetch(`${base}${path}`);
    assert.equal(response.status, 200, path);
  }
  const health = await (await fetch(`${base}/api/health`)).json();
  assert.deepEqual(health, { ok: true, service: "sleek-academia" });
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
  requestId = (await handoff.json()).request.id;

  const quote = await api(`/requests/${requestId}/quote`, { method: "PATCH", role: "admin", body: { quoteCents: 20000 } });
  assert.equal((await quote.json()).request.status, "Deposit Due");

  const deposit = await api(`/requests/${requestId}/payments/demo-confirm`, { method: "POST", body: { amountCents: 1 } });
  const depositPayload = await deposit.json();
  assert.equal(depositPayload.payment.amountCents, 10000);
  assert.equal(depositPayload.request.status, "In Progress");

  for (const status of ["Ready for Review", "Balance Due"]) {
    const transition = await api(`/requests/${requestId}/status`, { method: "PATCH", role: "admin", body: { status } });
    assert.equal(transition.status, 200);
  }

  const delivery = await api(`/requests/${requestId}/deliverables`, {
    method: "POST",
    role: "admin",
    body: { category: "final", fileName: "smoke-final.txt", mimeType: "text/plain", contentBase64: Buffer.from("verified local delivery").toString("base64") },
  });
  attachmentId = (await delivery.json()).attachment.id;
  assert.equal((await api(`/attachments/${attachmentId}/download`)).status, 423);

  const balance = await api(`/requests/${requestId}/payments/demo-confirm`, { method: "POST", body: { amountCents: 1 } });
  const balancePayload = await balance.json();
  assert.equal(balancePayload.payment.amountCents, 10000);
  assert.equal(balancePayload.request.status, "Balance Due");

  const download = await api(`/attachments/${attachmentId}/download`);
  assert.equal(download.status, 200);
  assert.equal(await download.text(), "verified local delivery");
});
