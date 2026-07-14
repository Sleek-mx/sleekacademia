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

function allHtmlFiles(directory = publicDir, prefix = "") {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relative = path.join(prefix, entry.name);
    if (entry.isDirectory()) return allHtmlFiles(path.join(directory, entry.name), relative);
    return entry.name.endsWith(".html") ? [relative] : [];
  });
}

test("About, Blog, and Store use the approved shared public system", () => {
  const currentPages = {
    "index.html": "/",
    "about.html": "/about.html",
    "blog.html": "/blog.html",
    "store.html": "/store.html",
  };

  for (const [page, currentPath] of Object.entries(currentPages)) {
    const html = read(page);
    assert.match(html, /class="site-header site-shell"/, `${page}: floating site header missing`);
    assert.match(html, /class="site-nav"/, `${page}: shared site navigation missing`);
    assert.match(html, /class="brand-lockup"/, `${page}: shared brand lockup missing`);
    assert.match(html, /\/images\/brand\/sleek-academia-mark\.webp/, `${page}: woman-head mark missing`);
    assert.match(html, /class="nav-links" id="primary-links"/, `${page}: responsive links missing`);
    assert.match(html, new RegExp(`href="${currentPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}" aria-current="page"`), `${page}: active navigation state missing`);
    assert.match(html, /\/images\/brand\/favicon-32\.png/, `${page}: woman-head favicon missing`);
    assert.match(html, /\/images\/brand\/apple-touch-icon\.png/, `${page}: touch icon missing`);
    assert.match(html, /\/css\/brand-v2\.css/, `${page}: brand CSS missing`);
    if (page !== "index.html") assert.match(html, /\/css\/platform-v2\.css/, `${page}: shared page CSS missing`);
    assert.match(html, /href="\/onboard\.html/, `${page}: Get Started path missing`);
    assert.match(html, /href="\/login\.html"/, `${page}: login path missing`);
  }
});

test("primary public pages contain no retired frog artwork", () => {
  for (const page of ["index.html", "about.html", "blog.html", "store.html"]) {
    const html = read(page);
    assert.doesNotMatch(html, /sleek-frog-hero|\bfrog\b/i, `${page}: retired frog artwork remains`);
  }
});

test("secondary-page woman artwork fills its frame without clipping the note cards", () => {
  const css = read("css/platform-v2.css");
  assert.match(css, /\.platform-art-card img\s*{[^}]*object-fit:\s*cover[^}]*object-position:\s*right center/s);
  assert.match(css, /\.platform-note\.one\s*{[^}]*left:\s*3%/s);
  assert.match(css, /\.platform-note\.two\s*{[^}]*right:\s*3%/s);
});

test("every HTML surface uses the standalone woman-head browser icons", () => {
  for (const page of allHtmlFiles()) {
    const html = read(page);
    assert.match(html, /<link rel="icon" type="image\/png" sizes="32x32" href="\/images\/brand\/favicon-32\.png"\s*\/?>/, `${page}: favicon missing`);
    assert.match(html, /<link rel="apple-touch-icon" href="\/images\/brand\/apple-touch-icon\.png"\s*\/?>/, `${page}: touch icon missing`);
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

  for (const page of ["index.html", "about.html", "blog.html", "store.html"]) {
    assert.match(read(page), /localhost\|127\\\.0\\\.0\\\.1/, `${page}: localhost analytics guard missing`);
  }
});

test("shared motion is restrained, progressive, and reduced-motion safe", () => {
  const script = read("js/platform-motion.js");
  const css = read("css/platform-v2.css");
  assert.match(script, /IntersectionObserver/);
  assert.doesNotMatch(script, /addEventListener\(["']scroll/);
  assert.match(script, /hero__video/);
  assert.match(script, /removeAttribute\(["']autoplay["']\)/);
  assert.match(script, /\.pause\(\)/);
  assert.match(script, /is-reduced-motion/);
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
  assert.doesNotMatch(html, /https:\/\/gumroad\.com\/js\/gumroad\.js/);
  assert.match(html, /id="products-grid"/);
  assert.match(html, /\/api\/gumroad\/products/);
  assert.match(html, /macsin6\.gumroad\.com/);
  assert.match(html, /class="platform-button store-button--primary"[^>]*>Browse materials</);
  assert.match(html, /class="platform-button store-button--secondary"[^>]*>Visit Gumroad store</);

  const css = read("css/platform-v2.css");
  assert.match(css, /\.platform-page \.store-button--primary\s*{[^}]*color:\s*#fff/s);
  assert.match(css, /\.platform-page \.store-button--secondary\s*{[^}]*color:\s*var\(--platform-ink\)/s);
});

test("every article uses its own optimized local editorial image", () => {
  const manifest = {
    "nursg-5315-exam-2-study-pack.html": "nursg-5315-study-pack.webp",
    "nclex-study-schedule.html": "nclex-study-schedule.webp",
    "nclex-first-attempt.html": "nclex-first-attempt.webp",
    "burnout-to-breakthrough.html": "burnout-to-breakthrough.webp",
    "ube-decoded.html": "ube-decoded.webp",
    "nextgen-bar-exam-2026-changes.html": "nextgen-bar-exam.webp",
    "comptia-security-plus-2026.html": "security-plus-2026.webp",
    "sy0-701-pbq-practice-guide.html": "sy0-701-pbq.webp",
    "cfa-level-1-study-plan.html": "cfa-level-1-plan.webp",
    "certifications-new-degree.html": "certifications-new-degree.webp",
  };
  const listing = read("blog.html");

  for (const [article, image] of Object.entries(manifest)) {
    const publicPath = `/images/blog/${image}`;
    const diskPath = path.join(publicDir, "images", "blog", image);
    assert.equal(fs.existsSync(diskPath), true, `${image}: generated file missing`);
    assert.match(listing, new RegExp(`<img[^>]+src=["']${publicPath.replaceAll("/", "\\/")}["'][^>]+width=["']1200["'][^>]+height=["']751["'][^>]+loading=["']lazy["'][^>]+alt=["'][^"']+["']`), `${image}: listing image contract`);
    assert.match(read(`blog/${article}`), new RegExp(`<img[^>]+src=["']${publicPath.replaceAll("/", "\\/")}["'][^>]+width=["']1200["'][^>]+height=["']751["'][^>]+loading=["']lazy["'][^>]+alt=["'][^"']+["']`), `${article}: article image contract`);
  }
});
