import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";

import express from "express";

import { createAdminSessionService, hashAdminPassword } from "../src/platform/admin-auth.js";
import { createAdminAuthRouter } from "../src/platform/admin-auth-router.js";
import { MemoryPlatformStore } from "../src/platform/memory-store.js";

let baseUrl;
let server;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

before(async () => {
  const store = new MemoryPlatformStore();
  const passwordHash = await hashAdminPassword("local admin test password", {
    randomBytes: (size) => Buffer.alloc(size, 3),
  });
  const service = createAdminSessionService({
    store,
    username: "MCX",
    passwordHash,
    sessionSecret: "router-session-secret-that-is-at-least-thirty-two-characters",
    sleep: async () => {},
  });
  const app = express();
  app.use(express.json());
  app.use("/api/admin-auth", createAdminAuthRouter({ service }));
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => server?.close());

async function post(path, body, headers = {}) {
  return fetch(`${baseUrl}/api/admin-auth${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body || {}),
  });
}

test("admin login API returns uniform failures", async () => {
  const wrongUser = await post("/login", { username: "other", password: "wrong" });
  const wrongPassword = await post("/login", { username: "MCX", password: "wrong" });
  assert.equal(wrongUser.status, 401);
  assert.equal(wrongPassword.status, 401);
  assert.deepEqual(await wrongUser.json(), await wrongPassword.json());
});

test("admin login sets a strict HttpOnly session and logout revokes it", async () => {
  const login = await post("/login", { username: "MCX", password: "local admin test password" });
  assert.equal(login.status, 200);
  const loginBody = await login.json();
  assert.equal(loginBody.identity.role, "admin");
  assert.match(loginBody.csrfToken, /^[A-Za-z0-9_-]{40,}$/);

  const setCookie = login.headers.get("set-cookie") || "";
  assert.match(setCookie, /sa_admin_session=/);
  assert.match(setCookie, /HttpOnly/i);
  assert.match(setCookie, /SameSite=Strict/i);
  assert.match(setCookie, /Path=\//i);
  assert.match(setCookie, /Max-Age=28800/i);
  assert.doesNotMatch(setCookie, /Secure/i, "loopback cookies must remain testable over HTTP");
  const cookie = setCookie.split(";")[0];

  const session = await fetch(`${baseUrl}/api/admin-auth/session`, { headers: { cookie } });
  assert.equal(session.status, 200);
  const sessionBody = await session.json();
  assert.equal(sessionBody.identity.userId, "admin:mcx");
  assert.match(sessionBody.csrfToken, /^[A-Za-z0-9_-]{40,}$/);

  const rejectedLogout = await post("/logout", {}, { cookie, "x-csrf-token": "wrong" });
  assert.equal(rejectedLogout.status, 403);

  const logout = await post("/logout", {}, { cookie, "x-csrf-token": sessionBody.csrfToken });
  assert.equal(logout.status, 204);
  assert.match(logout.headers.get("set-cookie") || "", /sa_admin_session=;/);
  assert.equal((await fetch(`${baseUrl}/api/admin-auth/session`, { headers: { cookie } })).status, 401);
});

test("unconfigured admin auth returns a stable unavailable response", async () => {
  const app = express();
  app.use(express.json());
  app.use("/api/admin-auth", createAdminAuthRouter({ service: null }));
  const unavailableServer = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => unavailableServer.once("listening", resolve));
  const port = unavailableServer.address().port;
  const response = await fetch(`http://127.0.0.1:${port}/api/admin-auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ username: "MCX", password: "ignored" }),
  });
  unavailableServer.close();
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { error: "Admin sign-in is unavailable." });
});

test("Express mounts MCX auth and contains no Clerk admin-role bypass", () => {
  const source = fs.readFileSync(path.join(root, "server.js"), "utf8");
  assert.match(source, /createAdminAuthRouter/);
  assert.match(source, /\/api\/admin-auth/);
  assert.doesNotMatch(source, /\/api\/admin\/users/);
  assert.doesNotMatch(source, /ADMIN_EMAILS|inferRoleFromEmail|function requireAdmin/);
});
