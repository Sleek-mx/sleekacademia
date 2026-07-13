import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("MCX dashboard exposes the complete admin information architecture", () => {
  const html = read("public/admin.html");

  assert.match(html, /<h1[^>]*>[^<]*Overview/i);
  for (const label of ["Overview", "Orders", "Clients", "Messages", "Payments", "Earnings", "Files", "Settings"]) {
    assert.match(html, new RegExp(`>${label}<`), `${label} navigation is missing`);
  }
  for (const queue of ["Available", "Needs Clarification", "Deposit Due", "In Progress", "Delivered", "In Revision", "Completed", "Declined", "Cancelled", "Balance Due", "Paid", "Overdue", "Unread"]) {
    assert.match(html, new RegExp(queue, "i"), `${queue} queue is missing`);
  }
  assert.match(html, /id="admin-order-search"/);
  assert.match(html, /value="deadline"/);
  assert.match(html, /data-theme-toggle/);
  assert.match(html, /aria-controls="admin-rail"/);
  assert.match(html, /id="admin-live-region"[^>]*aria-live="polite"/);
  assert.match(html, /id="admin-loading-state"/);
  assert.match(html, /id="admin-empty-state"/);
  assert.match(html, /id="admin-error-state"/);
  assert.match(html, /id="admin-retry"/);
  assert.match(html, /id="admin-logout"/);
  assert.match(html, /\/css\/dashboard-neumorphic\.css/);
  assert.doesNotMatch(html, /workspace-v2\.css|View as client|role switch/i);
});

test("admin command center covers every order decision and evidence surface", () => {
  const html = read("public/admin-order.html");
  const script = read("public/js/admin-order.js");

  for (const surface of ["Instructions", "Materials", "Pricing", "Payments", "Messages", "Files", "Timeline", "Delivery", "Revisions"]) {
    assert.match(html, new RegExp(surface, "i"), `${surface} surface is missing`);
  }
  for (const action of ["request clarification", "accept order", "decline order", "change status", "upload deliverable", "complete order"]) {
    assert.match(html, new RegExp(action, "i"), `${action} control is missing`);
  }
  for (const name of ["loadSession", "renderOrder", "submitClarification", "acceptOrder", "changeStatus", "uploadDeliverable", "logout"]) {
    assert.match(script, new RegExp(`function\\s+${name}\\b|const\\s+${name}\\s*=`), `${name} is missing`);
  }
  assert.match(script, /x-csrf-token/i);
  assert.match(script, /\/api\/admin-auth\/session/);
  assert.match(script, /\/api\/platform\/admin\/orders/);
  assert.match(script, /FileReader/);
  assert.match(html, /data-action="accept"/);
  assert.doesNotMatch(script, /manual paid|mark.{0,10}paid|paid override/i);
  assert.doesNotMatch(read("public/admin.html"), /<dialog|admin-order-dialog/);
});

test("earnings filters and CSV export use server reports", () => {
  const html = read("public/admin.html");
  const script = read("public/js/admin-dashboard.js");

  for (const period of ["7d", "30d", "90d", "all"]) assert.match(html, new RegExp(`value="${period}"`));
  assert.match(html, /Export CSV/i);
  assert.match(script, /\/api\/platform\/admin\/earnings\?period=/);
  assert.match(script, /\/api\/platform\/admin\/exports\/orders\.csv/);
  assert.match(script, /response\.blob\(\)/);
});
