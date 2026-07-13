import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("order wizard explains and captures every approved server pricing unit", () => {
  const html = read("public/onboard.html");
  for (const name of ["pageCount", "wordCount", "urgency", "examHours"]) assert.match(html, new RegExp(`name=["']${name}["']`));
  assert.match(html, /275 words per page/i);
  assert.match(html, /\$15(?:\.00)? per page/i);
  assert.match(html, /six-hour/i);
  assert.match(html, /\$16\.50/);
  assert.match(html, /\$150(?:\.00)? per hour/i);
  assert.match(html, /custom quote/i);
  assert.match(html, /informational estimate/i);
});

test("browser estimate uses integer units and never sends a browser total", () => {
  const script = read("public/js/onboard.js");
  assert.match(script, /Math\.ceil\([^)]*\/\s*275\)/);
  assert.match(script, /1500|1_500/);
  assert.match(script, /1650|1_650/);
  assert.match(script, /15000|15_000/);
  const payload = script.slice(script.indexOf("function buildPendingRequest"), script.indexOf("function persistPendingRequest"));
  assert.doesNotMatch(payload, /totalCents|quoteCents|amountCents/);
  assert.match(script, /\/api\/platform\/orders\/handoff/);
});

test("login has isolated Client and Admin modes with no credential persistence", () => {
  const html = read("public/login.html");
  const script = read("public/js/auth.js");
  assert.match(html, /data-auth-mode="client"/);
  assert.match(html, /data-auth-mode="admin"/);
  assert.match(html, /id="clerk-sign-in"/);
  assert.match(html, /name="username"[^>]*value="MCX"/);
  assert.match(html, /name="password"[^>]*type="password"/);
  assert.match(script, /\/api\/admin-auth\/login/);
  assert.match(script, /URLSearchParams[\s\S]*mode[\s\S]*admin/);
  assert.match(script, /Sign-in details could not be verified\./);
  assert.doesNotMatch(script, /localStorage.*password|sessionStorage.*password|URLSearchParams.*password/);
  assert.doesNotMatch(html, /role switch|View as admin|View as client/i);
});
