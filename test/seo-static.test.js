import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const siteUrl = "https://sleekacademia.com";

const indexablePages = [
  "index.html",
  "about.html",
  "ai-tools.html",
  "blog.html",
  "courses.html",
  "pricing.html",
  "store.html",
  "lp/nursing-pharmacology.html",
  "blog/burnout-to-breakthrough.html",
  "blog/certifications-new-degree.html",
  "blog/cfa-level-1-study-plan.html",
  "blog/comptia-security-plus-2026.html",
  "blog/nclex-first-attempt.html",
  "blog/nclex-study-schedule.html",
  "blog/nursg-5315-exam-2-study-pack.html",
  "blog/students-dread-the-sheer-volume-of-endocrine-and-gi-facts-that-can-feel-like-a-m.html",
  "blog/ube-decoded.html"
];

const utilityPages = [
  "404.html",
  "ai-tools-pro.html",
  "blogs.html",
  "dashboard.html",
  "login.html",
  "onboard.html",
  "payment-success.html",
  "sign-up.html"
];

test("every indexable page has one self-referencing canonical", async () => {
  for (const page of indexablePages) {
    const html = await readPublic(page);
    const canonicals = [...html.matchAll(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["'][^>]*>/gi)];
    const expected = page === "index.html" ? `${siteUrl}/` : `${siteUrl}/${page}`;

    assert.equal(canonicals.length, 1, `${page} must have exactly one canonical`);
    assert.equal(canonicals[0][1], expected, `${page} canonical must self-reference`);
  }
});

test("utility pages are noindex and excluded from the sitemap", async () => {
  const sitemap = await readPublic("sitemap.xml");

  for (const page of utilityPages) {
    const html = await readPublic(page);
    assert.match(html, /<meta\s+name=["']robots["']\s+content=["']noindex,follow["']\s*\/?>/i, `${page} must be noindex,follow`);
    assert.doesNotMatch(sitemap, new RegExp(escapeRegex(`${siteUrl}/${page}`)), `${page} must not be in sitemap`);
  }
});

test("sitemap contains every indexable page and no utility page", async () => {
  const sitemap = await readPublic("sitemap.xml");
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]).sort();
  const expected = indexablePages
    .map((page) => page === "index.html" ? `${siteUrl}/` : `${siteUrl}/${page}`)
    .sort();

  assert.deepEqual(urls, expected);
});

test("public marketing copy avoids unsupported outcome claims", async () => {
  const homepage = await readPublic("index.html");
  const pricing = await readPublic("pricing.html");

  assert.doesNotMatch(homepage, /results guaranteed/i);
  assert.doesNotMatch(pricing, /98% pass rate/i);
});

test("homepage presents all tutoring categories under one service", async () => {
  const homepage = await readPublic("index.html");

  for (const category of ["nursing", "law", "IT", "accounting", "finance"]) {
    assert.match(homepage, new RegExp(`\\b${category}\\b`, "i"), `homepage must mention ${category}`);
  }
  assert.match(homepage, /academic tutoring/i);
});

test("homepage schema describes the educational organization and tutoring catalog", async () => {
  const homepage = await readPublic("index.html");
  const jsonLdBlocks = [...homepage.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)]
    .map((match) => JSON.parse(match[1]));
  const nodes = jsonLdBlocks.flatMap((block) => block["@graph"] ?? [block]);
  const types = nodes.map((node) => node["@type"]);

  assert.ok(types.includes("EducationalOrganization"));
  assert.ok(types.includes("WebSite"));
  const organization = nodes.find((node) => node["@type"] === "EducationalOrganization");
  assert.equal(organization.hasOfferCatalog?.["@type"], "OfferCatalog");
  assert.equal(organization.hasOfferCatalog?.itemListElement?.length, 5);

  const logoPath = new URL(organization.logo).pathname;
  await access(path.join(process.cwd(), "public", decodeURIComponent(logoPath)));
});

async function readPublic(relativePath) {
  return readFile(path.join(process.cwd(), "public", relativePath), "utf8");
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
