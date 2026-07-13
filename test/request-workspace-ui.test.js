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
  for (const page of ["sign-up.html", "login.html"]) {
    const html = read(`public/${page}`);
    assert.match(html, /\/images\/brand\/sleek-academia-logo\.webp/);
    assert.match(html, /\/css\/workspace-v2\.css/);
    assert.match(html, /\/js\/auth\.js/);
  }
  assert.match(read("public/sign-up.html"), /id="clerk-sign-up"/);
  assert.match(read("public/login.html"), /id="clerk-sign-in"/);
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
