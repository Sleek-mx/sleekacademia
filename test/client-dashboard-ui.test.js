import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("client dashboard exposes the complete client workspace without admin controls", () => {
  const html = read("public/dashboard.html");
  for (const label of ["Overview", "My Orders", "Messages", "Files", "Payments", "Profile", "Help"]) {
    assert.match(html, new RegExp(`>${label}<`), `${label} navigation is missing`);
  }
  for (const queue of ["All orders", "Available", "Needs Clarification", "Deposit Due", "In Progress", "Delivered", "In Revision", "Completed", "Cancelled"]) {
    assert.match(html, new RegExp(queue, "i"), `${queue} filter is missing`);
  }
  assert.match(html, /Start New Order/i);
  assert.match(html, /Locked - pay balance to download/);
  assert.match(html, /data-theme-toggle/);
  assert.match(html, /aria-controls="client-rail"/);
  assert.match(html, /id="client-loading-state"/);
  assert.match(html, /id="client-empty-state"/);
  assert.match(html, /id="client-error-state"/);
  assert.match(html, /id="client-retry"/);
  assert.match(html, /id="client-logout"/);
  assert.match(html, /\/css\/dashboard-neumorphic\.css/);
  assert.match(html, /\/js\/client-dashboard\.js/);
  assert.doesNotMatch(html, /admin controls|View as admin|x-demo-role|role switch/i);
});

test("client controller uses server-owned payment and revision state", () => {
  const script = read("public/js/client-dashboard.js");
  for (const name of ["loadSession", "loadOrders", "loadOrder", "renderOverview", "renderOrders", "renderOrderDetail", "renderDelivery", "sendMessage", "uploadMaterial", "payWithStripe", "payWithPayPal", "downloadAttachment", "requestRevision", "saveProfile", "logout"]) {
    assert.match(script, new RegExp(`function\\s+${name}\\b|const\\s+${name}\\s*=`), `${name} is missing`);
  }
  assert.match(script, /\/api\/platform\/session/);
  assert.match(script, /\/api\/platform\/orders/);
  assert.match(script, /revisionEligibility/);
  assert.match(script, /response\.status\s*===\s*423/);
  assert.match(script, /Locked - pay balance to download/);
  assert.match(script, /x-csrf-token/i);
  assert.match(script, /\/payments\/stripe-intent/);
  assert.match(script, /\/payments\/paypal-order/);
  assert.match(script, /\/payments\/paypal-capture/);
  assert.doesNotMatch(script, /quoteCents\s*=|paidCents\s*=|amountCents\s*:/);
  assert.doesNotMatch(script, /x-demo-role|admin\/orders|manual paid|mark.{0,10}paid/i);
});

test("dedicated client order page preserves instructions, timeline, files, payments, and revision policy", () => {
  const html = read("public/client-order.html");
  for (const label of ["Instructions", "Timeline", "Messages", "Materials", "Payments", "Receipts", "Deliveries", "Revision history", "Policy help"]) {
    assert.match(html, new RegExp(label, "i"), `${label} detail surface is missing`);
  }
  assert.match(html, /seven days/i);
  assert.match(html, /first paid download/i);
  assert.match(html, /id="client-revision-form"/);
  assert.doesNotMatch(read("public/dashboard.html"), /<dialog|client-order-dialog/);
});
