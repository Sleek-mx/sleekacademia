import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(repoRoot, "public");
const canonicalOrigin = "https://sleekacademia.com";
const socialProfiles = [
  "https://instagram.com/sleek_academia",
  "https://tiktok.com/@sleek_e_learn",
  "https://www.youtube.com/channel/UCID9SDULAMHqyKjB65Bo01A",
];

const redirectOnly = new Set(["blogs.html"]);
const utilityPages = new Set([
  "404.html",
  "admin.html",
  "dashboard.html",
  "login.html",
  "onboard.html",
  "payment-success.html",
  "sign-up.html",
]);

function walkHtml(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walkHtml(fullPath) : entry.name.endsWith(".html") ? [fullPath] : [];
  });
}

function tagAttribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, "i"))?.[1] || "";
}

function metaContent(html, name) {
  const tag = html.match(new RegExp(`<meta\\b[^>]*\\bname=["']${name}["'][^>]*>`, "i"))?.[0] || "";
  return tagAttribute(tag, "content");
}

function pageRecord(filePath) {
  const html = fs.readFileSync(filePath, "utf8");
  const relative = path.relative(publicDir, filePath).split(path.sep).join("/");
  const canonicalTag = html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*>/i)?.[0] || "";
  return {
    relative,
    html,
    title: html.match(/<title>([^<]+)<\/title>/i)?.[1].trim() || "",
    description: metaContent(html, "description"),
    canonical: tagAttribute(canonicalTag, "href"),
    robots: metaContent(html, "robots").toLowerCase(),
    h1Count: (html.match(/<h1\b/gi) || []).length,
    schemaCount: (html.match(/type=["']application\/ld\+json["']/gi) || []).length,
  };
}

function duplicates(pages, key) {
  const values = new Map();
  for (const page of pages) {
    const matchingPages = values.get(page[key]) || [];
    matchingPages.push(page.relative);
    values.set(page[key], matchingPages);
  }
  return [...values.entries()].filter(([, matchingPages]) => matchingPages.length > 1);
}

const allPages = walkHtml(publicDir).map(pageRecord);
const indexablePages = allPages.filter(
  (page) => !redirectOnly.has(page.relative) && !utilityPages.has(page.relative),
);
const sitemapXml = fs.readFileSync(path.join(publicDir, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());

test("indexable pages have complete SEO metadata and document structure", () => {
  for (const page of indexablePages) {
    assert.ok(page.title, `${page.relative}: missing title`);
    assert.ok(page.description, `${page.relative}: missing meta description`);
    assert.match(page.canonical, /^https:\/\/sleekacademia\.com\//, `${page.relative}: invalid canonical`);
    assert.equal(page.h1Count, 1, `${page.relative}: expected exactly one h1`);
    assert.ok(page.schemaCount > 0, `${page.relative}: missing JSON-LD`);
    assert.doesNotMatch(page.robots, /noindex/, `${page.relative}: indexable page is noindex`);
  }
});

test("indexable metadata values are unique", () => {
  for (const key of ["title", "description", "canonical"]) {
    assert.deepEqual(duplicates(indexablePages, key), [], `duplicate ${key} values`);
  }
});

test("utility and redirect-only pages are noindex and absent from the sitemap", () => {
  const excludedPages = allPages.filter(
    (page) => utilityPages.has(page.relative) || redirectOnly.has(page.relative),
  );
  for (const page of excludedPages) {
    assert.match(page.robots, /noindex/, `${page.relative}: expected noindex`);
    const publicPath = `/${page.relative}`;
    assert.ok(
      !sitemapUrls.some((url) => new URL(url).pathname === publicPath),
      `${page.relative}: excluded page appears in sitemap`,
    );
  }
});

test("sitemap contains each canonical indexable page exactly once", () => {
  assert.ok(sitemapUrls.length > 0, "sitemap has no URLs");
  assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, "sitemap contains duplicate URLs");

  for (const url of sitemapUrls) {
    const parsed = new URL(url);
    assert.equal(parsed.origin, canonicalOrigin, `${url}: noncanonical sitemap origin`);
    const relative = parsed.pathname === "/" ? "index.html" : parsed.pathname.replace(/^\//, "");
    assert.ok(fs.existsSync(path.join(publicDir, relative)), `${url}: sitemap target does not exist`);
  }

  for (const page of indexablePages) {
    const expectedPath = page.relative === "index.html" ? "/" : `/${page.relative}`;
    const matches = sitemapUrls.filter((url) => new URL(url).pathname === expectedPath);
    assert.equal(matches.length, 1, `${page.relative}: expected exactly one sitemap entry`);
  }
});

test("every indexable page visibly links to the verified social profiles", () => {
  for (const page of indexablePages) {
    for (const profile of socialProfiles) {
      assert.match(
        page.html,
        new RegExp(`href=["']${profile.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`, "i"),
        `${page.relative}: missing visible link to ${profile}`,
      );
    }
  }
});

test("homepage Organization schema identifies the verified social profiles", () => {
  const homepage = allPages.find((page) => page.relative === "index.html");
  const schemas = [...homepage.html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => JSON.parse(match[1]));
  const organization = schemas.find((schema) => schema["@type"] === "Organization");
  assert.ok(organization, "homepage Organization schema is missing");
  assert.deepEqual(organization.sameAs, socialProfiles);
});
