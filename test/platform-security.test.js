import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { afterEach, test } from "node:test";
import { fileURLToPath } from "node:url";

import express from "express";

import {
  createCsrfService,
  createOriginGuard,
  createRateLimiters,
  createSecurityHeaders,
} from "../src/platform/security.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const servers = [];

afterEach(() => {
  while (servers.length) servers.pop().close();
});

async function listen(app) {
  const server = app.listen(0, "127.0.0.1");
  servers.push(server);
  await new Promise((resolve) => server.once("listening", resolve));
  return `http://127.0.0.1:${server.address().port}`;
}

test("production security headers disclose no framework and enforce a narrow CSP", async () => {
  const app = express();
  app.disable("x-powered-by");
  app.use(createSecurityHeaders({ production: true, scriptHashes: ["'sha256-testhash='"] }));
  app.get("/", (_req, res) => res.send("ok"));
  const response = await fetch(await listen(app));
  const csp = response.headers.get("content-security-policy") || "";
  const scriptPolicy = csp.split(";").find((directive) => directive.trim().startsWith("script-src")) || "";

  assert.equal(response.headers.get("x-powered-by"), null);
  assert.match(csp, /default-src 'self'/);
  assert.match(csp, /script-src 'self'/);
  assert.doesNotMatch(scriptPolicy, /unsafe-eval|unsafe-inline/);
  assert.match(response.headers.get("strict-transport-security") || "", /max-age=/);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.match(response.headers.get("x-frame-options") || "", /SAMEORIGIN|DENY/);
  assert.equal(response.headers.get("referrer-policy"), "strict-origin-when-cross-origin");
  assert.match(response.headers.get("permissions-policy") || "", /camera=\(\)/);
});

test("origin guard allows exact configured origins and rejects cross-site mutations", async () => {
  const app = express();
  app.use(express.json());
  app.use(createOriginGuard({
    allowedOrigins: ["https://sleekacademia.com", "http://localhost:3000"],
    productionOrigin: "https://sleekacademia.com",
    exemptPaths: ["/webhook"],
  }));
  app.post("/change", (_req, res) => res.json({ ok: true }));
  app.post("/webhook", (_req, res) => res.json({ ok: true }));
  const base = await listen(app);

  const allowed = await fetch(`${base}/change`, {
    method: "POST",
    headers: { origin: "https://sleekacademia.com", "content-type": "application/json" },
    body: "{}",
  });
  assert.equal(allowed.status, 200);
  assert.equal(allowed.headers.get("access-control-allow-origin"), "https://sleekacademia.com");

  const unknown = await fetch(`${base}/change`, {
    method: "POST",
    headers: { origin: "https://evil.example", "content-type": "application/json" },
    body: "{}",
  });
  assert.equal(unknown.status, 403);
  assert.equal(unknown.headers.get("access-control-allow-origin"), null);

  const fetchMetadata = await fetch(`${base}/change`, {
    method: "POST",
    headers: { "sec-fetch-site": "cross-site", "content-type": "application/json" },
    body: "{}",
  });
  assert.equal(fetchMetadata.status, 403);
  assert.equal((await fetch(`${base}/webhook`, { method: "POST" })).status, 200);
});

test("cookie-authenticated mutations require the issued CSRF header", async () => {
  const csrf = createCsrfService({ secret: "csrf-test-secret-that-is-at-least-thirty-two-characters", secure: false });
  const app = express();
  app.use(express.json());
  app.get("/token", (req, res) => res.json({ csrfToken: csrf.issueToken(req, res) }));
  app.post("/change", csrf.protect(), (_req, res) => res.json({ ok: true }));
  app.post("/webhook", csrf.protect({ exemptPaths: ["/webhook"] }), (_req, res) => res.json({ ok: true }));
  const base = await listen(app);

  const issued = await fetch(`${base}/token`);
  const token = (await issued.json()).csrfToken;
  const cookie = (issued.headers.get("set-cookie") || "").split(";")[0];
  assert.match(cookie, /sa_csrf=/);
  assert.equal((await fetch(`${base}/change`, { method: "POST", headers: { cookie } })).status, 403);
  assert.equal((await fetch(`${base}/change`, {
    method: "POST",
    headers: { cookie, "x-csrf-token": token },
  })).status, 200);
  assert.equal((await fetch(`${base}/webhook`, { method: "POST", headers: { cookie } })).status, 200);
});

test("separate rate-limit policies exist for every sensitive route class", () => {
  const limits = createRateLimiters();
  for (const name of ["adminLogin", "platform", "messages", "uploads", "payments", "webhooks"]) {
    assert.equal(typeof limits[name], "function", `${name} limiter is required`);
  }
  assert.equal(new Set(Object.values(limits)).size, 6, "sensitive route classes must not share one limiter instance");
});

test("server health and config responses contain only stable browser-safe fields", () => {
  const source = fs.readFileSync(path.join(root, "server.js"), "utf8");
  const health = source.slice(source.indexOf('app.get("/api/health"'), source.indexOf('app.use("/assets"'));
  assert.doesNotMatch(health, /deployWebhook|clerkConfigured|platformStore|process\.env|time:/);
  const config = source.slice(source.indexOf('app.get("/api/config"'), source.indexOf('app.get("/dashboard.html"'));
  assert.doesNotMatch(config, /platformStore|SECRET|SERVICE_ROLE|PASSWORD/);
});

test("server mounts signature exceptions and route-specific limits before the platform router", () => {
  const source = fs.readFileSync(path.join(root, "server.js"), "utf8");
  assert.match(source, /createSecurityHeaders/);
  assert.match(source, /createOriginGuard/);
  assert.match(source, /createCsrfService/);
  assert.match(source, /createRateLimiters/);
  assert.ok(source.indexOf('app.post("/deploy.php"') < source.indexOf("express.json"));
  assert.ok(source.indexOf("createOriginGuard") < source.indexOf('createPlatformRouter'));
});
