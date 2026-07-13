import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const home = fs.readFileSync(path.join(root, "public/index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "public/css/brand-v2.css"), "utf8");

test("footer cannot render the redundant full-resolution logo", () => {
  assert.doesNotMatch(home, /width="1595" height="993"[^>]*hidden/);
  assert.equal((home.match(/sleek-academia-logo\.webp/g) || []).length, 0);
  assert.match(css, /\[hidden\]\s*\{[^}]*display:\s*none\s*!important/s);
});

test("footer preserves the constrained visible brand lockup and public theme", () => {
  assert.match(home, /href="\/css\/brand-v2\.css"/);
  assert.match(home, /class="brand-lockup"/);
  assert.match(home, /class="brand-lockup__mark"[^>]*sleek-academia-mark\.webp/);
  assert.match(home, /class="brand-lockup__name">Sleek Academia</);
});
