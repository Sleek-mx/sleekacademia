import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const homePath = path.join(rootDir, "public", "index.html");
const brandCssPath = path.join(rootDir, "public", "css", "brand-v2.css");

async function readHome() {
  return readFile(homePath, "utf8");
}

async function readBrandCss() {
  return readFile(brandCssPath, "utf8");
}

test("homepage uses the approved Sleek Academia brand foundation", async () => {
  const home = await readHome();

  assert.match(home, /\/css\/brand-v2\.css/);
  assert.match(home, /\/images\/brand\/sleek-academia-mark\.webp/);
  assert.match(home, /class="brand-lockup__name">Sleek Academia</);
  assert.match(home, /class="brand-lockup__tagline">Pass\. Guaranteed\.</);
  assert.match(home, /\/video\/sleek-academia-woman-hero\.mp4/);
  assert.match(home, /\/images\/brand\/sleek-academia-woman-hero-poster\.webp/);
  assert.match(
    home,
    /<video\b(?=[^>]*\bautoplay\b)(?=[^>]*\bmuted\b)(?=[^>]*\bloop\b)(?=[^>]*\bplaysinline\b)[^>]*>/i,
  );
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

test("homepage hero uses content-led desktop and purpose-built mobile composition", async () => {
  const [home, css] = await Promise.all([readHome(), readBrandCss()]);

  assert.match(home, /<video class="hero__video" data-ambient-video/);
  assert.match(css, /\.hero\s*{[^}]*min-height:\s*auto/s);
  assert.match(css, /\.hero__media\s*{[^}]*aspect-ratio:\s*8\s*\/\s*7/s);
  assert.match(css, /\.hero__video\s*{[^}]*object-fit:\s*cover[^}]*object-position:\s*right center/s);
  assert.match(
    css,
    /@media \(max-width: 58rem\)[\s\S]*\.hero__media\s*{[^}]*aspect-ratio:\s*4\s*\/\s*3/s,
  );
  assert.match(
    css,
    /@media \(max-width: 42rem\)[\s\S]*\.hero__actions\s*{[^}]*grid-template-columns:\s*1fr/s,
  );
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
