import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");

function read(relative) {
  return fs.readFileSync(path.join(publicDir, relative), "utf8");
}

function publicMarketingHtml() {
  return [
    "index.html",
    "about.html",
    "blog.html",
    "store.html",
    "nclex-prep.html",
    "ube-bar-exam-prep.html",
    "cfa-level-1-prep.html",
    "comptia-security-plus-prep.html",
    ...fs.readdirSync(path.join(publicDir, "blog")).filter((name) => name.endsWith(".html")).map((name) => `blog/${name}`),
  ];
}

test("About, Blog, and Store use the approved shared public system", () => {
  for (const page of ["about.html", "blog.html", "store.html"]) {
    const html = read(page);
    assert.match(html, /\/images\/brand\/sleek-academia-logo\.webp/, `${page}: official logo missing`);
    assert.match(html, /\/css\/brand-v2\.css/, `${page}: brand CSS missing`);
    assert.match(html, /\/css\/platform-v2\.css/, `${page}: shared page CSS missing`);
    assert.match(html, /\/js\/platform-motion\.js/, `${page}: restrained motion missing`);
    assert.match(html, /href="\/onboard\.html/, `${page}: Get Started path missing`);
    assert.match(html, /href="\/login\.html"/, `${page}: login path missing`);
  }
});

test("public marketing pages contain no Pricing or package detours", () => {
  for (const page of publicMarketingHtml()) {
    const html = read(page);
    assert.doesNotMatch(html, /href=["'][^"']*#pricing/i, `${page}: legacy pricing link`);
    assert.doesNotMatch(html, />\s*Pricing\s*</i, `${page}: Pricing navigation`);
    assert.doesNotMatch(html, /View Tutoring Packages|Compare [^<]{0,40} plans/i, `${page}: package CTA`);
  }
});

test("redesigned primary public pages preserve analytics, schema, social links, and clean copy", () => {
  const social = [
    "https://instagram.com/sleek_academia",
    "https://tiktok.com/@sleek_e_learn",
    "https://www.youtube.com/channel/UCID9SDULAMHqyKjB65Bo01A",
  ];
  for (const page of ["about.html", "blog.html", "store.html"]) {
    const html = read(page);
    assert.match(html, /G-CHXSBK3M81/);
    assert.match(html, /2344858129372736/);
    assert.match(html, /D84IJPBC77UDS4G4KMO0/);
    assert.match(html, /application\/ld\+json/);
    for (const url of social) assert.match(html, new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.doesNotMatch(html, /[—–]/, `${page}: visible em/en dash remains`);
  }
});

test("shared motion is restrained, progressive, and reduced-motion safe", () => {
  const script = read("js/platform-motion.js");
  const css = read("css/platform-v2.css");
  assert.match(script, /IntersectionObserver/);
  assert.doesNotMatch(script, /addEventListener\(["']scroll/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /\[data-reveal\]/);
});

test("Blog retains every article URL and adds working search/filter controls", () => {
  const html = read("blog.html");
  const articles = fs.readdirSync(path.join(publicDir, "blog")).filter((name) => name.endsWith(".html"));
  for (const article of articles) assert.match(html, new RegExp(`/blog/${article.replace(".", "\\.")}`));
  assert.match(html, /id="blog-search"/);
  assert.match(html, /data-blog-filter/);
  assert.match(html, /\/js\/blog\.js/);
});

test("Store preserves Gumroad commerce and live product synchronization", () => {
  const html = read("store.html");
  assert.match(html, /https:\/\/gumroad\.com\/js\/gumroad\.js/);
  assert.match(html, /id="products-grid"/);
  assert.match(html, /\/api\/gumroad\/products/);
  assert.match(html, /macsin6\.gumroad\.com/);
});
