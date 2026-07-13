import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { before, beforeEach, test } from "node:test";
import { fileURLToPath } from "node:url";

import {
  ADMIN_AUTH_ERROR,
  createAdminSessionService,
  hashAdminPassword,
  verifyAdminPassword,
} from "../src/platform/admin-auth.js";
import { MemoryPlatformStore } from "../src/platform/memory-store.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let passwordHash;
let nowMs;
let randomCounter;
let store;
let delays;
let service;

function requestWithToken(token, userAgent = "Admin Test Agent") {
  return {
    headers: { cookie: `sa_admin_session=${token}` },
    get(name) {
      if (name.toLowerCase() === "user-agent") return userAgent;
      if (name.toLowerCase() === "cookie") return this.headers.cookie;
      return "";
    },
    ip: "127.0.0.1",
  };
}

before(async () => {
  passwordHash = await hashAdminPassword("correct horse battery staple", {
    randomBytes: (size) => Buffer.alloc(size, 7),
  });
});

beforeEach(() => {
  nowMs = Date.parse("2026-07-13T12:00:00.000Z");
  randomCounter = 0;
  delays = [];
  store = new MemoryPlatformStore({ now: () => new Date(nowMs).toISOString() });
  service = createAdminSessionService({
    store,
    username: "MCX",
    passwordHash,
    sessionSecret: "session-secret-that-is-at-least-thirty-two-characters",
    now: () => new Date(nowMs),
    randomBytes: (size) => Buffer.alloc(size, ++randomCounter),
    sleep: async (milliseconds) => { delays.push(milliseconds); },
  });
});

test("scrypt password hashes verify valid passwords and reject malformed or weak hashes", async () => {
  assert.match(passwordHash, /^scrypt\$16384\$8\$1\$/);
  assert.equal(await verifyAdminPassword("correct horse battery staple", passwordHash), true);
  assert.equal(await verifyAdminPassword("wrong password", passwordHash), false);
  assert.equal(await verifyAdminPassword("anything", "scrypt$2$1$1$bad$bad"), false);
  assert.equal(await verifyAdminPassword("anything", "not-a-hash"), false);

  const source = fs.readFileSync(path.join(root, "src/platform/admin-auth.js"), "utf8");
  assert.match(source, /timingSafeEqual/);
});

test("username and password failures are uniform and progressively delayed", async () => {
  const wrongUser = await service.login({ username: "someone", password: "wrong", ip: "127.0.0.1", userAgent: "Agent" });
  const wrongPassword = await service.login({ username: "MCX", password: "wrong", ip: "127.0.0.1", userAgent: "Agent" });

  assert.deepEqual(
    { ok: wrongUser.ok, status: wrongUser.status, error: wrongUser.error },
    { ok: false, status: 401, error: ADMIN_AUTH_ERROR },
  );
  assert.deepEqual(
    { ok: wrongPassword.ok, status: wrongPassword.status, error: wrongPassword.error },
    { ok: false, status: 401, error: ADMIN_AUTH_ERROR },
  );
  assert.deepEqual(delays, [250, 500]);
});

test("successful login stores only hashes and resolves an admin identity", async () => {
  const login = await service.login({ username: "mcx", password: "correct horse battery staple", ip: "127.0.0.1", userAgent: "Admin Test Agent" });
  assert.equal(login.ok, true);
  assert.match(login.token, /^[A-Za-z0-9_-]{40,}$/);
  assert.match(login.csrfToken, /^[A-Za-z0-9_-]{40,}$/);

  const sessions = [...store.adminSessions.values()];
  assert.equal(sessions.length, 1);
  assert.equal(JSON.stringify(sessions).includes(login.token), false);
  assert.equal(JSON.stringify(sessions).includes(login.csrfToken), false);
  assert.match(sessions[0].tokenHash, /^[a-f0-9]{64}$/);
  assert.match(sessions[0].csrfHash, /^[a-f0-9]{64}$/);

  const resolved = await service.resolveRequest(requestWithToken(login.token));
  assert.equal(resolved.identity.role, "admin");
  assert.equal(resolved.identity.userId, "admin:mcx");
});

test("sessions expire after idle and absolute limits", async () => {
  const idleLogin = await service.login({ username: "MCX", password: "correct horse battery staple", ip: "127.0.0.1", userAgent: "Admin Test Agent" });
  nowMs += 31 * 60 * 1000;
  assert.equal(await service.resolveRequest(requestWithToken(idleLogin.token)), null);

  nowMs = Date.parse("2026-07-13T12:00:00.000Z");
  const absoluteLogin = await service.login({ username: "MCX", password: "correct horse battery staple", ip: "127.0.0.1", userAgent: "Admin Test Agent" });
  nowMs += 8 * 60 * 60 * 1000 + 1;
  assert.equal(await service.resolveRequest(requestWithToken(absoluteLogin.token)), null);
});

test("session rotation invalidates the old token and logout revokes the new one", async () => {
  const login = await service.login({ username: "MCX", password: "correct horse battery staple", ip: "127.0.0.1", userAgent: "Admin Test Agent" });
  const resolved = await service.resolveRequest(requestWithToken(login.token));
  const rotated = await service.rotate(resolved);

  assert.equal(await service.resolveRequest(requestWithToken(login.token)), null);
  const active = await service.resolveRequest(requestWithToken(rotated.token));
  assert.equal(active.identity.role, "admin");
  await service.logout(active);
  assert.equal(await service.resolveRequest(requestWithToken(rotated.token)), null);
});

test("five failures trigger a temporary lockout without recording credentials", async () => {
  const attempts = [];
  for (let index = 0; index < 5; index += 1) {
    attempts.push(await service.login({ username: "MCX", password: `wrong-${index}`, ip: "127.0.0.1", userAgent: "Agent" }));
  }
  const locked = await service.login({ username: "MCX", password: "still-wrong", ip: "127.0.0.1", userAgent: "Agent" });

  assert.equal(attempts.every((attempt) => attempt.status === 401), true);
  assert.equal(locked.status, 429);
  assert.equal(locked.error, ADMIN_AUTH_ERROR);
  assert.ok(locked.retryAfterSeconds > 0);

  const serialized = JSON.stringify(await store.listSecurityEvents());
  assert.equal(serialized.includes("wrong-"), false);
  assert.equal(serialized.includes("still-wrong"), false);
  assert.equal(serialized.includes("correct horse"), false);
});

test("CSRF tokens can be rotated and verified without storing raw values", async () => {
  const login = await service.login({ username: "MCX", password: "correct horse battery staple", ip: "127.0.0.1", userAgent: "Admin Test Agent" });
  const resolved = await service.resolveRequest(requestWithToken(login.token));
  assert.equal(service.validateCsrf(resolved.session, login.csrfToken), true);
  assert.equal(service.validateCsrf(resolved.session, "wrong"), false);

  const issued = await service.issueCsrf(resolved.session);
  assert.notEqual(issued.csrfToken, login.csrfToken);
  assert.equal(service.validateCsrf(issued.session, login.csrfToken), false);
  assert.equal(service.validateCsrf(issued.session, issued.csrfToken), true);
});
