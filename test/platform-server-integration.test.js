import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { spawn } from "node:child_process";
import http from "node:http";

const PORT = 3998;
const BASE = `http://127.0.0.1:${PORT}`;
let server;

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
  assert.equal(requests.requests.length, 3);
});

test("demo identity is denied when the same process receives a non-loopback host", async () => {
  const status = await new Promise((resolve, reject) => {
    const request = http.get({
      hostname: "127.0.0.1",
      port: PORT,
      path: "/api/platform/session",
      headers: { Host: "sleekacademia.com" },
    }, (response) => {
      response.resume();
      response.on("end", () => resolve(response.statusCode));
    });
    request.on("error", reject);
  });
  assert.equal(status, 401);
});
