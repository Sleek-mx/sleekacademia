// Pins the quiz paywall's Gumroad checkout wiring — the site had 3 quizzes
// whose only unlock path was a manual MoneyGram claim with no automated
// verification. This locks in that the Gumroad option, added alongside it,
// stays present on every quiz page and stays wired to the shared engine.

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(rootDir, "public");

function read(relativePath) {
  return fs.readFileSync(path.join(publicDir, relativePath), "utf8");
}

const QUIZ_PAGES = ["antimicrobial-quiz.html", "renal-cardiac-quiz.html", "pharmacology-quiz.html"];

test("every quiz page has the Gumroad checkout mount point ahead of the MoneyGram wizard", () => {
  for (const page of QUIZ_PAGES) {
    const html = read(page);
    assert.match(html, /id="gumroad-checkout"/, `${page} is missing the Gumroad checkout mount point`);
    assert.match(html, /id="paywall-delivery"/, `${page} is missing post-purchase delivery guidance`);
    assert.match(html, /<details class="payment-backup">[\s\S]*id="checkout-container"[\s\S]*<\/details>/, `${page}: MoneyGram should be a disclosed backup`);
    assert.match(html, /id="btn-see-results"/, `${page}: free-results escape hatch missing`);
    const gumroadIndex = html.indexOf('id="gumroad-checkout"');
    const checkoutIndex = html.indexOf('id="checkout-container"');
    assert.ok(gumroadIndex > 0 && gumroadIndex < checkoutIndex, `${page}: Gumroad option must appear before the MoneyGram wizard`);
  }
});

test("the quiz engine builds a Gumroad checkout link carrying the quiz id and price", () => {
  const script = read("js/quiz-engine.js");
  assert.match(script, /sleekmx\.gumroad\.com\/l\/QuizUnlock/);
  assert.match(script, /function renderGumroadCheckout/);
  assert.match(script, /quiz_id:\s*config\.quizId/);
  assert.match(script, /paywall-delivery/);
  assert.match(script, /personal access link/);
  assert.match(script, /Unlock " \+ remaining/);
  assert.match(script, /renderGumroadCheckout\(remaining\)/);
});
