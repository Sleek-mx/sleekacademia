import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");

test("request wizard captures service-specific context and contact details without payment", () => {
  const html = read("public/onboard.html");
  assert.match(html, /id="request-wizard"/);
  for (const service of ["essay", "exam", "tutoring", "other"]) {
    assert.match(html, new RegExp(`data-service=["']${service}["']`));
  }
  for (const field of ["subject", "description", "deadline", "citationStyle", "pageCount", "examName", "examDate", "attemptStatus", "assistanceType", "name", "email", "urgentPhone", "school"]) {
    assert.match(html, new RegExp(`name=["']${field}["']`), `${field}: field missing`);
  }
  assert.match(html, /type="file"/);
  assert.match(html, /No payment is taken/i);
  assert.match(html, /private workspace/i);
  assert.doesNotMatch(html, /Stripe|PayPal|card number|client-id/i);
});

test("request wizard persists an idempotent pending handoff and supports localhost demo", () => {
  const script = read("public/js/onboard.js");
  assert.match(script, /sleekAcademia\.pendingRequest\.v2/);
  assert.match(script, /crypto\.randomUUID/);
  assert.match(script, /localStorage\.setItem/);
  assert.match(script, /idempotencyKey/);
  assert.match(script, /\/api\/platform\/orders\/handoff/);
  assert.match(script, /mountSignUp/);
  assert.match(script, /demoMode/);
  assert.doesNotMatch(script, /stripe|paypal/i);
});

test("authentication pages preserve Clerk mount targets and the official brand", () => {
  // Both auth pages now share the glass design system and the LOG IN / SIGN UP
  // tab pair; the Clerk mount targets and auth.js wiring are unchanged.
  const signUp = read("public/sign-up.html");
  assert.match(signUp, /\/images\/brand\/sleek-academia-mark\.webp/);
  assert.match(signUp, /\/css\/glass-college\.css/);
  assert.match(signUp, /\/js\/auth\.js/);
  assert.match(signUp, /id="clerk-sign-up"/);
  assert.match(signUp, /href="\/sign-up\.html" aria-current="page"/);

  // login.html moved to the glass design system (glass-college.css) — it keeps
  // the approved mark, just not the full logo lockup or the old workspace CSS.
  const login = read("public/login.html");
  assert.match(login, /\/images\/brand\/sleek-academia-mark\.webp/);
  assert.match(login, /\/css\/glass-college\.css/);
  assert.match(login, /\/js\/auth\.js/);
  assert.match(login, /id="clerk-sign-in"/);
  assert.match(login, /href="\/login\.html" aria-current="page"/);
});

test("workspace exposes complete client navigation and resilient states", () => {
  const html = read("public/dashboard.html");
  for (const label of ["Overview", "My Orders", "Messages", "Files", "Payments", "Profile", "Help"]) {
    assert.match(html, new RegExp(`>${label}<`), `${label}: navigation missing`);
  }
  for (const id of ["client-loading-state", "client-empty-state", "client-error-state", "client-order-grid", "client-profile-form"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`), `${id}: state or surface missing`);
  }
  const orderHtml = read("public/client-order.html");
  for (const id of ["client-message-form", "client-material-form", "client-revision-form"]) assert.match(orderHtml, new RegExp(`id=["']${id}["']`), `${id}: order surface missing`);
  assert.match(html, /50% deposit/i);
  assert.match(html, /fully paid|locked until/i);
  assert.match(html, /AI-use report/i);
  assert.doesNotMatch(html, /admin-controls|View as admin|x-demo-role/i);
});

test("workspace script uses only protected client APIs and implements client actions", () => {
  const script = read("public/js/client-dashboard.js");
  for (const route of ["/session", "/orders", "/messages", "/attachments", "/profile", "/revisions", "/download"]) {
    assert.match(script, new RegExp(route.replaceAll("/", "\\/")), `${route}: API integration missing`);
  }
  assert.match(script, /contentBase64/);
  assert.match(script, /showLoading/);
  assert.match(script, /showError/);
  assert.doesNotMatch(script, /x-demo-role|admin\/orders/i);
});
