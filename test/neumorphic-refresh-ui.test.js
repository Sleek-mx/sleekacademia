import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("request brief uses structured subject and help selects with escape hatches", () => {
  const html = read("public/onboard.html");
  const script = read("public/js/onboard.js");
  const workspaceCss = read("public/css/workspace-v2.css");

  assert.match(html, /<select[^>]+id="subject"[^>]+name="subject"/i);
  assert.match(html, /<select[^>]+id="helpType"[^>]+name="helpType"/i);
  for (const field of ["Nursing", "Law", "ICT", "Finance"]) assert.match(html, new RegExp(`<optgroup[^>]+label="${field}"`, "i"));
  assert.match(html, /value="other"[^>]*>Other subject or course/i);
  assert.match(html, /id="subjectOther"[^>]+name="subjectOther"/i);
  assert.match(html, /id="helpTypeOther"[^>]+name="helpTypeOther"/i);
  assert.match(html, /id="description"[^>]+name="description"/i);
  assert.match(script, /helpType/);
  assert.match(script, /subjectOther/);
  assert.match(script, /helpTypeOther/);
  assert.match(workspaceCss, /\[hidden\]\s*\{\s*display:\s*none\s*!important;?\s*\}/i);
});

test("exam hours and custom quote copy are client-facing and unambiguous", () => {
  const html = read("public/onboard.html");
  const script = read("public/js/onboard.js");
  const combined = `${html}\n${script}`;

  assert.match(combined, /Assistance hours means the number of hours allocated to your exam/i);
  assert.match(combined, /Our team of experts will provide a custom quote after reviewing the complete scope and materials/i);
  assert.doesNotMatch(combined, /MCX will provide a custom quote|after MCX reviews/i);
});

test("login presents one role-neutral credential form and dispatches by identifier", () => {
  const html = read("public/login.html");
  const script = read("public/js/auth.js");

  assert.match(html, /id="unified-login-form"/);
  assert.match(html, /name="identifier"/);
  assert.match(html, /name="password"[^>]+type="password"/);
  assert.doesNotMatch(html, /data-auth-mode|role="tablist"|>\s*Admin\s*<|>\s*Client\s*</i);
  assert.match(script, /function\s+isAdminIdentifier\b/);
  assert.match(script, /identifier[\s\S]*MCX/i);
  assert.match(script, /\/api\/admin-auth\/login/);
  assert.match(script, /signIn\.create/);
  assert.match(script, /config\.demoMode\s*&&\s*isAdminIdentifier\(identifier\)/);
  assert.doesNotMatch(script, /URLSearchParams[\s\S]*mode[\s\S]*admin/);
});

test("dashboard system is same-surface neumorphism in light and night modes", () => {
  assert.equal(fs.existsSync(path.join(root, "public/css/dashboard-neumorphic.css")), true, "neumorphic dashboard stylesheet is missing");
  const css = read("public/css/dashboard-neumorphic.css");

  assert.match(css, /--dash-canvas:\s*#e0e5ec/i);
  assert.match(css, /--dash-surface:\s*var\(--dash-canvas\)/i);
  assert.match(css, /\[data-theme="night"\][\s\S]*--dash-canvas:\s*#20242b/i);
  assert.match(css, /box-shadow:[^;]*var\(--dash-shadow-dark\)[^;]*var\(--dash-shadow-light\)/i);
  assert.match(css, /box-shadow:\s*inset[^;]*var\(--dash-shadow-dark\)[^;]*inset[^;]*var\(--dash-shadow-light\)/i);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /@media\s*\(max-width:\s*767px\)/);
  assert.match(css, /\.dash-view\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/i);
  assert.doesNotMatch(css, /backdrop-filter/);
});

test("client orders open a dedicated protected order page instead of a dialog", () => {
  assert.equal(fs.existsSync(path.join(root, "public/client-order.html")), true, "client order page is missing");
  assert.equal(fs.existsSync(path.join(root, "public/js/client-order.js")), true, "client order controller is missing");
  const dashboard = read("public/dashboard.html");
  const dashboardScript = read("public/js/client-dashboard.js");
  const orderPage = read("public/client-order.html");
  const orderScript = read("public/js/client-order.js");

  assert.doesNotMatch(dashboard, /<dialog|client-order-dialog/);
  assert.match(dashboardScript, /client-order\.html\?id=/);
  assert.match(orderPage, /id="client-order-page"/);
  for (const label of ["Instructions", "Timeline", "Messages", "Materials", "Payments", "Deliveries", "Revision history", "Policy help"]) {
    assert.match(orderPage, new RegExp(label, "i"));
  }
  assert.match(orderScript, /\/api\/platform\/orders\//);
  assert.match(orderScript, /response\.status\s*===\s*423/);
  assert.doesNotMatch(orderScript, /admin\/orders|x-demo-role/i);
});

test("admin orders open a dedicated MCX-only command page instead of a dialog", () => {
  assert.equal(fs.existsSync(path.join(root, "public/admin-order.html")), true, "admin order page is missing");
  assert.equal(fs.existsSync(path.join(root, "public/js/admin-order.js")), true, "admin order controller is missing");
  const dashboard = read("public/admin.html");
  const dashboardScript = read("public/js/admin-dashboard.js");
  const orderPage = read("public/admin-order.html");
  const orderScript = read("public/js/admin-order.js");

  assert.doesNotMatch(dashboard, /<dialog|admin-order-dialog/);
  assert.match(dashboardScript, /admin-order\.html\?id=/);
  assert.match(orderPage, /id="admin-order-page"/);
  for (const label of ["Instructions", "Materials", "Pricing", "Payments", "Messages", "Timeline", "Delivery", "Revisions"]) {
    assert.match(orderPage, new RegExp(label, "i"));
  }
  assert.match(orderScript, /\/api\/admin-auth\/session/);
  assert.match(orderScript, /\/api\/platform\/admin\/orders\//);
  assert.match(orderScript, /x-csrf-token/i);
  assert.doesNotMatch(orderScript, /manual paid|mark.{0,10}paid|paid override/i);
});

test("blog cards expose useful text and explicit links independently of artwork", () => {
  const html = read("public/blog.html");
  const cards = html.match(/<article class="blog-card[\s\S]*?<\/article>/g) || [];

  assert.equal(cards.length, 10);
  for (const card of cards) {
    assert.match(card, /blog-card-body/);
    assert.match(card, /<h[23][^>]*>[\s\S]*?<\/h[23]>/);
    assert.match(card, /<p[^>]*class="blog-card-summary"[^>]*>[\s\S]{40,}?<\/p>/);
    assert.match(card, /Read more/i);
  }
});
