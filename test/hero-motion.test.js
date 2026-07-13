import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function source(relativePath) {
  return readFile(path.join(root, relativePath), "utf8");
}

test("homepage exposes the accessible animated hero hooks", async () => {
  const home = await source("public/index.html");

  assert.match(home, /data-hero-motion/);
  assert.match(home, /data-typewriter="A place where your professional journey begins\."/);
  assert.match(home, /data-mascot-arm/);
  assert.equal([...home.matchAll(/class="hero-plant\b/g)].length, 2);
  assert.match(home, /class="typing-pulse"/);
  assert.match(home, /src="\/js\/hero-motion\.js" defer/);
});

test("brand CSS defines a 16:9 stage and the complete subtle motion cycle", async () => {
  const css = await source("public/css/brand-v2.css");

  assert.match(css, /aspect-ratio:\s*16\s*\/\s*9/);
  assert.match(css, /@keyframes\s+mascot-cycle/);
  assert.match(css, /@keyframes\s+thinking-arm-cycle/);
  assert.match(css, /@keyframes\s+plant-sway/);
  assert.match(css, /@keyframes\s+ambient-drift/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*animation:\s*none/);
});

test("hero controller progressively enhances copy and honors reduced motion", async () => {
  const js = await source("public/js/hero-motion.js");

  assert.match(js, /function\s+initializeHeroMotion/);
  assert.match(js, /matchMedia\("\(prefers-reduced-motion: reduce\)"\)/);
  assert.match(js, /aria-label/);
  assert.match(js, /requestAnimationFrame/);
  assert.doesNotMatch(js, /setInterval/);
});
