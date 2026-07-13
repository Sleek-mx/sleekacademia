import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const homePath = path.join(rootDir, "public", "index.html");

async function readHome() {
  return readFile(homePath, "utf8");
}

test("homepage uses the approved Sleek Academia brand foundation", async () => {
  const home = await readHome();

  assert.match(home, /\/css\/brand-v2\.css/);
  assert.match(home, /\/images\/brand\/sleek-academia-mark\.webp/);
  assert.match(home, /class="brand-lockup__name">Sleek Academia</);
  assert.match(home, /class="brand-lockup__tagline">Pass\. Guaranteed\.</);
  assert.match(home, /\/images\/brand\/sleek-frog-hero\.webp/);
  assert.match(home, /\/images\/brand\/favicon-32\.png/);
  assert.match(home, /\/images\/brand\/apple-touch-icon\.png/);
});

test("homepage exposes the approved navigation and service entry points", async () => {
  const home = await readHome();

  assert.match(home, /href="\/about\.html"/);
  assert.match(home, /href="\/blog\.html"/);
  assert.match(home, /href="\/store\.html"/);
  assert.match(home, /href="\/onboard\.html\?goal=essay"/);
  assert.match(home, /href="\/onboard\.html\?goal=exam"/);
  assert.match(home, /Authorship matters at Sleek Academia/);
});

test("homepage removes public pricing and tutoring packages", async () => {
  const home = await readHome();

  assert.doesNotMatch(home, /href="\/?#pricing"/i);
  assert.doesNotMatch(
    home,
    /Tutoring Packages|View Packages|Choose Your Learning Path/i,
  );
});

test("homepage preserves SEO, analytics, and semantic structure", async () => {
  const home = await readHome();
  const h1Count = [...home.matchAll(/<h1\b/gi)].length;

  assert.equal(h1Count, 1);
  assert.match(home, /<link rel="canonical" href="https:\/\/sleekacademia\.com\/"/);
  assert.match(home, /application\/ld\+json/);
  assert.match(home, /G-CHXSBK3M81/);
  assert.match(home, /2344858129372736/);
  assert.match(home, /D84IJPBC77UDS4G4KMO0/);
  assert.match(home, /<header\b/);
  assert.match(home, /<main\b/);
  assert.match(home, /<footer\b/);
});
