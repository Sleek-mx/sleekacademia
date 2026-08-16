import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

import { STORE_PRODUCTS, formatPrice, productUrl } from "../src/data/store-products.js";
import { QUIZZES } from "../src/quiz/quizzes.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const resourcesPath = path.join(root, "public", "resources.html");

function resourcesHtml() {
  return fs.readFileSync(resourcesPath, "utf8");
}

test("resources page is generated from quiz and Gumroad product data", () => {
  const result = spawnSync(process.execPath, ["scripts/build-resources-page.mjs", "--check"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});
test("every quiz offers useful free practice before its paid continuation", () => {
  const html = resourcesHtml();

  for (const quiz of Object.values(QUIZZES)) {
    assert.match(html, new RegExp(`href="${quiz.pagePath}\\.html"`), `${quiz.id}: quiz link missing`);
    assert.ok(html.includes(`${quiz.bank.FREE_QUESTION_COUNT} questions free`), `${quiz.id}: free value missing`);
    assert.ok(html.includes(`${quiz.bank.QUESTIONS.length - quiz.bank.FREE_QUESTION_COUNT} more after unlock`), `${quiz.id}: paid continuation missing`);
  }
});

test("every listed download uses its real Gumroad URL and visible price", () => {
  const html = resourcesHtml();

  for (const product of STORE_PRODUCTS) {
    assert.ok(html.includes(`${productUrl(product)}?wanted=true`), `${product.sku}: Gumroad URL missing`);
    assert.ok(html.includes(`${formatPrice(product)} one-time`), `${product.sku}: visible price missing`);
  }
});

test("study-tool visitors are never sent into service onboarding for a resource", () => {
  const html = resourcesHtml();
  assert.doesNotMatch(html, /onboard\.html\?goal=resource/i);
  assert.match(html, /<!-- study-tools:free:start -->/);
  assert.match(html, /<!-- study-tools:paid:start -->/);
});
