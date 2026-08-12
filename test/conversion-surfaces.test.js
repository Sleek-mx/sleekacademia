// The site had visitors and no clicks. These tests pin the things that were
// missing: a way to reach a human from any page, a price the visitor can see
// before committing, and a free entry product that needs no account.
//
// They are deliberately content assertions rather than snapshots — the wording
// can change, but a page that ships without a contact route or a visible price
// is a regression to the state that produced no customers.

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(rootDir, "public");

function read(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), "utf8");
}

function publicPages() {
  const skip = new Set([
    "dashboard.html", "admin.html", "admin-order.html", "client-order.html",
    "login.html", "sign-up.html", "payment-success.html", "blogs.html",
  ]);
  const pages = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".html") && !skip.has(entry.name)) pages.push(full);
    }
  };
  walk(publicDir);
  return pages;
}

test("every public page loads the contact dock", () => {
  const pages = publicPages();
  assert.ok(pages.length >= 20, "expected the full public page set");
  for (const page of pages) {
    const html = fs.readFileSync(page, "utf8");
    const name = path.relative(publicDir, page);
    assert.match(html, /\/js\/contact-dock\.js/, `${name} has no contact dock script`);
    assert.match(html, /\/css\/contact-dock\.css/, `${name} has no contact dock stylesheet`);
  }
});

test("the contact dock offers WhatsApp and a message form that reaches the owner", () => {
  const script = read("public/js/contact-dock.js");
  assert.match(script, /wa\.me\//);
  assert.match(script, /254724543489/);
  assert.match(script, /"\/api\/contact"/);
  assert.match(script, /No account needed/i);
  // A failed send must point somewhere, not dead-end.
  assert.match(script, /WhatsApp instead/i);
});

test("the homepage shows real prices above the order wizard", () => {
  const home = read("public/index.html");
  assert.match(home, /\$15/);
  assert.match(home, /\$16\.50/);
  assert.match(home, /\$150/);
  assert.match(home, /No account needed to get a price/i);
  assert.match(home, /wa\.me\/254724543489/);
});

test("the homepage leads with the free question banks", () => {
  const home = read("public/index.html");
  assert.match(home, /Free practice questions/i);
  for (const quiz of ["/antimicrobial-quiz.html", "/renal-cardiac-quiz.html", "/pharmacology-quiz.html"]) {
    assert.match(home, new RegExp(quiz.replace(/[/.]/g, "\\$&")), `${quiz} is not linked from the homepage`);
  }
  assert.match(home, /Start free/);
});

test("homepage calls to action are measurable", () => {
  const home = read("public/index.html");
  assert.match(home, /js\/analytics\.js/, "the CTA tracker is not loaded");
  const tagged = home.match(/data-cta-location="[^"]+"/g) || [];
  assert.ok(tagged.length >= 6, `expected tagged CTAs, found ${tagged.length}`);
});

test("no public surface still advertises PayPal", () => {
  for (const page of publicPages()) {
    assert.doesNotMatch(fs.readFileSync(page, "utf8"), /paypal/i, `${path.relative(publicDir, page)} still mentions PayPal`);
  }
  for (const script of ["public/js/client-order.js", "public/js/client-dashboard.js", "public/js/admin-dashboard.js"]) {
    assert.doesNotMatch(read(script), /paypal/i, `${script} still mentions PayPal`);
  }
  assert.equal(fs.existsSync(path.join(rootDir, "src/quiz/paypal.js")), false);
});

test("the order page can pay by MoneyGram when no card processor is configured", () => {
  const script = read("public/js/client-order.js");
  assert.match(script, /manualPaymentPanel/);
  assert.match(script, /payments\/mpesa-claim/);
  assert.match(script, /!state\.config\.stripePublishableKey/);
  // The client must never be told a manual claim is a completed payment.
  assert.match(script, /Nothing is marked paid automatically/i);
});
