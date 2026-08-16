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

async function readGlassCss() {
  return readFile(path.join(rootDir, "public", "css", "glass-college.css"), "utf8");
}

test("homepage uses the approved Sleek Academia brand foundation", async () => {
  const home = await readHome();

  assert.match(home, /\/css\/brand-v2\.css/);
  assert.match(home, /\/css\/glass-college\.css/);
  assert.match(home, /\/images\/brand\/sleek-academia-mark\.webp/);
  assert.match(home, /class="gc-wordmark[^"]*"/);
  assert.match(home, /\/images\/college\/hero-flatlay\.webp/);
  assert.match(home, /\/images\/brand\/favicon-32\.png/);
  assert.match(home, /\/images\/brand\/apple-touch-icon\.png/);
});

test("homepage exposes the approved navigation and service entry points", async () => {
  const home = await readHome();

  assert.match(home, /href="\/resources\.html"/);
  assert.match(home, /href="\/store\.html"/);
  assert.match(home, /href="\/login\.html"/);
  assert.match(home, /href="\/onboard\.html"/);
  assert.match(home, />Start free check</);
});

test("homepage hero uses the glass spectrum-border composition, responsive down to mobile", async () => {
  const [home, css] = await Promise.all([readHome(), readGlassCss()]);

  assert.match(home, /class="[^"]*\bgc-hero\b/);
  // "ONLINE COLLEGE DIFFICULTIES? SAY LESS.", with ONLINE and LESS. set in the
  // marker face and carrying their own drawn underline / lasso
  assert.match(home, /gc-mark gc-mark--coral">Online<svg/);
  assert.match(home, /gc-mark gc-mark--blue">Less\.<svg/);
  assert.match(home, /College <br \/>Difficulties\? <br \/>Say /, "headline must keep word spacing across its line breaks");
  assert.match(css, /"Permanent Marker"/);
  assert.match(css, /\.gc-glass--spectrum::after\s*{[^}]*background:\s*var\(--gc-spectrum\)/s);
  assert.match(
    css,
    /@media \(max-width: 640px\)[\s\S]*\.gc-band--hero\s*{[^}]*min-height:\s*0/,
  );
});

// The structural rule the approved references are built on: the photograph is a
// full-bleed band and the glass panel is inset on top of it, so the image runs
// past every edge of the glass. Regressing this back to a photo clipped inside
// the panel is the single most visible way to break the design.
test("every section is a full-bleed photo band with the glass panel inset on top", async () => {
  const [home, css] = await Promise.all([readHome(), readGlassCss()]);

  for (const photo of ["hero-flatlay", "guidance-flatlay", "planning-flatlay"]) {
    assert.match(home, new RegExp(`--band-photo:url\\('/images/college/${photo}\\.webp'\\)`), `${photo} band missing`);
  }
  assert.match(css, /\.gc-band::before\s*{[^}]*background-image:\s*var\(--band-photo\)/s);
  assert.match(css, /\.gc-band\s*{[^}]*padding:\s*var\(--gc-band-pad\)/s, "glass panel is not inset from the band edge");
  // bands fade into one another rather than butting up hard
  assert.match(css, /\.gc-band::before\s*{[\s\S]*?mask-image:\s*linear-gradient\(to bottom, transparent/);
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
