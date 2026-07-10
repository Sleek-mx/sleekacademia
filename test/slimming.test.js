// Regression tests for the 2026-06 SEO slimming:
// cut pages must 301 to their replacements, kept pages must 200,
// and the authenticated service-request endpoint must reject anonymous posts.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";

const PORT = 3997;
const BASE = `http://127.0.0.1:${PORT}`;
let server;

before(async () => {
  const env = { ...process.env, PORT: String(PORT) };
  delete env.CLERK_PUBLISHABLE_KEY;
  delete env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  delete env.CLERK_SECRET_KEY;

  server = spawn(process.execPath, ["server.js"], {
    env,
    stdio: "ignore",
  });
  // Wait for the port to accept connections.
  for (let i = 0; i < 50; i++) {
    try {
      await fetch(`${BASE}/api/health`);
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 100));
    }
  }
  throw new Error("server did not start");
});

after(() => server && server.kill());

const REDIRECTS = {
  "/pricing.html": "/#pricing",
  "/courses.html": "/",
  "/ai-tools.html": "/",
  "/ai-tools-pro.html": "/",
  "/services.html": "/",
  "/blogs.html": "/blog.html",
};

for (const [from, to] of Object.entries(REDIRECTS)) {
  test(`301 ${from} -> ${to}`, async () => {
    const res = await fetch(`${BASE}${from}`, { redirect: "manual" });
    assert.equal(res.status, 301);
    assert.equal(new URL(res.headers.get("location"), BASE).pathname + (to.includes("#") ? "" : ""), to.split("#")[0]);
    assert.ok(res.headers.get("location").endsWith(to));
  });
}

for (const path of ["/", "/nclex-prep.html", "/ube-bar-exam-prep.html", "/cfa-level-1-prep.html", "/comptia-security-plus-prep.html", "/blog.html", "/store.html", "/about.html", "/sitemap.xml", "/robots.txt"]) {
  test(`200 ${path}`, async () => {
    const res = await fetch(`${BASE}${path}`);
    assert.equal(res.status, 200);
  });
}

test("landing folds in the #pricing section", async () => {
  const html = await (await fetch(`${BASE}/`)).text();
  assert.match(html, /id="pricing"/);
  assert.match(html, /\$300/);
});

test("service-request rejects anonymous submissions", async () => {
  const res = await fetch(`${BASE}/api/service-request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ service: "NCLEX", subject: "s", details: "d" }),
  });
  assert.equal(res.status, 401);
});
