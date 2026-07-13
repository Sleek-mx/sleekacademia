import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { spawn } from "node:child_process";
import http from "node:http";

const PORT = 3998;
const BASE = `http://127.0.0.1:${PORT}`;
let server;

function requestWithHost(pathname, host = "sleekacademia.com") {
  return new Promise((resolve, reject) => {
    const request = http.get({
      hostname: "127.0.0.1",
      port: PORT,
      path: pathname,
      headers: { Host: host },
    }, (response) => {
      response.resume();
      response.on("end", () => resolve({ status: response.statusCode, location: response.headers.location || "" }));
    });
    request.on("error", reject);
  });
}

before(async () => {
  const env = { ...process.env, PORT: String(PORT), LOCAL_DEMO_MODE: "1" };
  delete env.SUPABASE_URL;
  delete env.SUPABASE_SERVICE_ROLE_KEY;
  delete env.CLERK_PUBLISHABLE_KEY;
  delete env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  delete env.CLERK_SECRET_KEY;
  server = spawn(process.execPath, ["server.js"], { env, stdio: "ignore" });
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      await fetch(`${BASE}/api/health`);
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  throw new Error("Local demo server did not start.");
});

after(() => server?.kill());

test("loopback demo mode exposes a seeded authenticated workspace", async () => {
  const config = await (await fetch(`${BASE}/api/config`)).json();
  assert.equal(config.demoMode, true);

  const dashboard = await fetch(`${BASE}/dashboard.html`);
  assert.equal(dashboard.status, 200);

  const session = await fetch(`${BASE}/api/platform/session`);
  assert.equal(session.status, 200);
  assert.equal((await session.json()).identity.userId, "demo-client");

  const requests = await (await fetch(`${BASE}/api/platform/requests`)).json();
  assert.equal(requests.requests.length, 6);
});

test("dashboard aliases are canonical and protected pages cannot bypass their guards", async () => {
  const adminAlias = await fetch(`${BASE}/admin`, { redirect: "manual" });
  assert.equal(adminAlias.status, 301);
  assert.equal(adminAlias.headers.get("location"), "/admin.html");

  const dashboardAlias = await fetch(`${BASE}/dashboard`, { redirect: "manual" });
  assert.equal(dashboardAlias.status, 301);
  assert.equal(dashboardAlias.headers.get("location"), "/dashboard.html");

  const clientAlias = await fetch(`${BASE}/client.html`, { redirect: "manual" });
  assert.equal(clientAlias.status, 301);
  assert.equal(clientAlias.headers.get("location"), "/dashboard.html");

  const adminGuard = await requestWithHost("/admin.html");
  assert.equal(adminGuard.status, 302);
  assert.equal(adminGuard.location, "/login.html?mode=admin");

  const clientGuard = await requestWithHost("/dashboard.html");
  assert.equal(clientGuard.status, 302);
  assert.equal(clientGuard.location, "/login.html");
});

test("demo identity is denied when the same process receives a non-loopback host", async () => {
  const response = await requestWithHost("/api/platform/session");
  assert.equal(response.status, 401);
});
