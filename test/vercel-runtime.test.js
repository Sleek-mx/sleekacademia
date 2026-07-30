import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import net from "node:net";
import path from "node:path";
import test, { after, before } from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const previewHostname = "sleek-academia-cutover-preview.vercel.app";
let server;
let baseUrl;

async function availablePort() {
  const socket = net.createServer();
  await new Promise((resolve) => socket.listen(0, "127.0.0.1", resolve));
  const { port } = socket.address();
  await new Promise((resolve, reject) => socket.close((error) => (error ? reject(error) : resolve())));
  return port;
}

before(async () => {
  const port = await availablePort();
  baseUrl = `http://127.0.0.1:${port}`;
  const env = {
    ...process.env,
    PORT: String(port),
    LOCAL_DEMO_MODE: "1",
    VERCEL: "1",
    VERCEL_URL: previewHostname,
  };
  for (const name of [
    "ADMIN_AUTH_ENABLED",
    "ADMIN_PASSWORD_HASH",
    "ADMIN_SESSION_SECRET",
    "CLERK_PUBLISHABLE_KEY",
    "CLERK_SECRET_KEY",
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_URL",
  ]) {
    delete env[name];
  }
  server = spawn(process.execPath, ["server.js"], { cwd: root, env, stdio: "ignore" });
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      if ((await fetch(`${baseUrl}/api/health`)).ok) return;
    } catch {
      // The process is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Vercel-mode test server did not start.");
});

after(() => server?.kill());

test("Vercel disables the cPanel shell deployment endpoint", async () => {
  const response = await fetch(`${baseUrl}/deploy.php`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  assert.equal(response.status, 410);
  assert.deepEqual(await response.json(), {
    error: "The cPanel deployment webhook is disabled on Vercel.",
  });
});

test("the exact Vercel preview origin can use same-origin quiz mutations", async () => {
  const response = await fetch(`${baseUrl}/api/pharm-quiz/next`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: `https://${previewHostname}`,
      "sec-fetch-site": "same-origin",
    },
    body: JSON.stringify({ salt: "preview_attempt_123", history: [] }),
  });
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(typeof payload.question?.id, "string");
});

test("Vercel mode rejects JSON bodies above the safe function payload budget", async () => {
  const response = await fetch(`${baseUrl}/api/pharm-quiz/next`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      salt: "preview_attempt_123",
      history: [],
        padding: "x".repeat(4_600_000),
    }),
  });
  assert.equal(response.status, 413);
});
