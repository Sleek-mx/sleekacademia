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
  assert.match(html, /\$150(?:\.00)? per (?:whole )?hour/i);
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

test("login has one role-neutral form while preserving isolated authentication", () => {
  const html = read("public/login.html");
  const script = read("public/js/auth.js");
  assert.match(html, /id="unified-login-form"/);
  assert.match(html, /id="clerk-sign-in"/);
  assert.match(html, /name="identifier"/);
  assert.match(html, /name="password"[^>]*type="password"/);
  assert.match(script, /\/api\/admin-auth\/login/);
  assert.match(script, /function\s+isAdminIdentifier/);
  assert.match(script, /signIn\.create/);
  assert.match(script, /Sign-in details could not be verified\./);
  assert.doesNotMatch(script, /localStorage.*password|sessionStorage.*password|URLSearchParams.*password/);
  assert.doesNotMatch(html, /data-auth-mode|role="tablist"|>\s*Admin\s*<|>\s*Client\s*</i);
});

test("client login completes Clerk client-trust verification without repeating credentials", () => {
  const script = read("public/js/auth.js");
  const html = read("public/login.html");

  assert.match(html, /id="client-trust-form"[^>]*hidden/);
  assert.match(html, /id="client-trust-code"[^>]*autocomplete="one-time-code"/);
  assert.match(script, /\["needs_client_trust",\s*"needs_second_factor"\]\.includes\(signIn\.status\)/);
  assert.match(script, /supportedSecondFactors\?\.find\([\s\S]*?factor\.strategy\s*===\s*"email_code"/);
  assert.match(script, /prepareSecondFactor\(\{\s*strategy:\s*"email_code",\s*emailAddressId:\s*emailCodeFactor\.emailAddressId\s*\}\)/);
  assert.match(script, /attemptSecondFactor\(\{\s*strategy:\s*"email_code",\s*code\s*\}\)/);
  assert.match(script, /window\.Clerk\.setActive\(\{\s*session:\s*signIn\.createdSessionId\s*\}\)/);
});
