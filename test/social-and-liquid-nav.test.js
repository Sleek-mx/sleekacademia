import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");

const read = (relative) => fs.readFileSync(path.join(publicDir, relative), "utf8");

const htmlPages = () => [
  ...fs.readdirSync(publicDir).filter((n) => n.endsWith(".html")),
  ...fs.readdirSync(path.join(publicDir, "blog")).filter((n) => n.endsWith(".html")).map((n) => `blog/${n}`),
];

// The four channels rendered as buttons: the three connected in Buffer plus the
// YouTube channel the site already linked.
const CHANNELS = [
  ["instagram", "https://instagram.com/sleek_academia"],
  ["tiktok", "https://tiktok.com/@sleek_e_learn"],
  ["linkedin", "https://www.linkedin.com/in/sir-maxwell-763b9818b"],
  ["youtube", "https://www.youtube.com/channel/UCID9SDULAMHqyKjB65Bo01A"],
];

// The paid quiz is a closed funnel and carries no outbound social links.
const NO_SOCIAL = new Set([
  "antimicrobial-quiz.html",
  "renal-cardiac-quiz.html",
  "pharmacology-quiz.html",
]);

test("every page with a footer renders the social buttons exactly once", () => {
  for (const page of htmlPages()) {
    const html = read(page);
    if (!html.includes("</footer>") || NO_SOCIAL.has(page)) continue;

    assert.equal(
      (html.match(/<div class="sa-social">/g) || []).length,
      1,
      `${page}: expected exactly one social block`,
    );
    assert.match(html, /\/css\/social\.css\?v=/, `${page}: social stylesheet not linked`);

    for (const [key, href] of CHANNELS) {
      assert.match(
        html,
        new RegExp(`sa-social__btn--${key}" href="${href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`),
        `${page}: missing ${key} button`,
      );
    }
    // The old text-only navs are replaced, not duplicated alongside the buttons.
    assert.doesNotMatch(html, /<nav[^>]*class="(?:footer-social|platform-social)"/, `${page}: legacy social nav remains`);
  }
});

test("social buttons are labelled for assistive tech", () => {
  const html = read("index.html");
  for (const [, href] of CHANNELS) {
    const anchor = html.match(new RegExp(`<a[^>]*href="${href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>`))?.[0];
    assert.ok(anchor, `no anchor for ${href}`);
    assert.match(anchor, /aria-label="Sleek Academia on /, `${href}: missing aria-label`);
    assert.match(anchor, /rel="noopener noreferrer"/, `${href}: missing rel`);
  }
});

test("pages with the shared nav load the liquid glass layer", () => {
  const navPages = htmlPages().filter((page) => read(page).includes('class="nav-links"'));
  assert.ok(navPages.length >= 3, "expected the remaining legacy public pages to share the liquid nav");

  for (const page of navPages) {
    const html = read(page);
    assert.match(html, /\/css\/liquid-nav\.css\?v=/, `${page}: liquid nav stylesheet not linked`);
    assert.match(html, /\/js\/liquid-nav\.js\?v=/, `${page}: liquid nav script not linked`);
    assert.match(html, /aria-current="page"/, `${page}: no active nav link to mark`);
  }
});

test("the glass layer overrides the pressed neumorphic active state", () => {
  const css = read("css/liquid-nav.css");
  assert.match(css, /backdrop-filter:\s*blur\(/, "no backdrop blur");
  assert.match(css, /\.site-nav \.nav-link\[aria-current="page"\][\s\S]*?box-shadow:\s*none/, "pressed inset not cleared");
  // Sticky only works if body stops being a scroll container.
  assert.match(css, /body\s*{[^}]*overflow-x:\s*clip/s, "body overflow-x not relaxed for sticky");
  assert.match(css, /prefers-reduced-motion/, "no reduced-motion handling");
});

test("the droplet script degrades safely", () => {
  const js = read("js/liquid-nav.js");
  assert.match(js, /prefers-reduced-motion/, "reduced motion not honoured");
  assert.match(js, /links\.length < 2 \|\| !active/, "missing guard for pages without an active link");
  assert.match(js, /catch \(err\)/, "sessionStorage access is not guarded");
});

test("the approved public site does not expose the rejected assignment-help draft", () => {
  const rejectedLinks = /(?:assignment-help|online-course-support)\.html/;

  for (const page of htmlPages()) {
    assert.doesNotMatch(read(page), rejectedLinks, `${page}: rejected draft link is still visible`);
  }

  assert.equal(fs.existsSync(path.join(publicDir, "assignment-help.html")), false);
  assert.equal(fs.existsSync(path.join(publicDir, "online-course-support.html")), false);
  assert.doesNotMatch(read("sitemap.xml"), rejectedLinks, "sitemap still advertises rejected draft pages");
});
