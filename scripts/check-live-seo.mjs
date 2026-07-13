import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";

async function request(url, { redirect = "follow" } = {}) {
  const response = await fetch(url, {
    redirect,
    signal: AbortSignal.timeout(15_000),
    headers: { "user-agent": "SleekAcademiaSEOCheck/1.0" },
  });
  return { response, body: await response.text() };
}

function expectedRedirectUrl(baseUrl, destination) {
  return new URL(destination, `${baseUrl}/`).href;
}

export async function checkSite(inputBaseUrl = "https://sleekacademia.com") {
  const baseUrl = inputBaseUrl.replace(/\/$/, "");
  const origin = new URL(baseUrl).origin;
  let checkedUrls = 0;

  const homepage = await request(`${baseUrl}/`);
  checkedUrls += 1;
  assert.equal(homepage.response.status, 200, "homepage must return HTTP 200");
  assert.match(homepage.body, /<title>[^<]+<\/title>/i, "homepage title is missing");
  assert.match(
    homepage.body,
    /<meta\b[^>]*\bname=["']description["'][^>]*\bcontent=["'][^"']+["'][^>]*>/i,
    "homepage meta description is missing",
  );
  const escapedCanonical = `${baseUrl}/`.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  assert.match(
    homepage.body,
    new RegExp(`<link\\b[^>]*\\brel=["']canonical["'][^>]*\\bhref=["']${escapedCanonical}["'][^>]*>`, "i"),
    "homepage canonical is missing or incorrect",
  );
  assert.match(homepage.body, /type=["']application\/ld\+json["']/i, "homepage JSON-LD is missing");
  assert.match(homepage.body, /G-CHXSBK3M81/, "homepage GA4 marker is missing");
  assert.match(homepage.body, /2344858129372736/, "homepage Meta Pixel marker is missing");
  assert.match(homepage.body, /D84IJPBC77UDS4G4KMO0/, "homepage TikTok Pixel marker is missing");
  assert.match(homepage.body, /https:\/\/instagram\.com\/sleek_academia/, "homepage verified Instagram profile is missing");
  assert.match(homepage.body, /https:\/\/tiktok\.com\/@sleek_e_learn/, "homepage verified TikTok profile is missing");
  assert.match(
    homepage.body,
    /https:\/\/www\.youtube\.com\/channel\/UCID9SDULAMHqyKjB65Bo01A/,
    "homepage verified YouTube profile is missing",
  );

  const redirects = new Map([
    ["/index.html", "/"],
    ["/services.html", "/"],
    ["/pricing.html", "/onboard.html"],
    ["/blogs.html", "/blog.html"],
  ]);
  for (const [source, destination] of redirects) {
    const { response } = await request(`${baseUrl}${source}`, { redirect: "manual" });
    checkedUrls += 1;
    assert.equal(response.status, 301, `${source} must return HTTP 301`);
    assert.equal(
      new URL(response.headers.get("location"), `${baseUrl}/`).href,
      expectedRedirectUrl(baseUrl, destination),
      `${source} redirect destination is incorrect`,
    );
  }

  const robots = await request(`${baseUrl}/robots.txt`);
  checkedUrls += 1;
  assert.equal(robots.response.status, 200, "robots.txt must return HTTP 200");
  assert.match(robots.body, /User-agent:/i, "robots.txt has no user-agent directive");
  assert.match(robots.body, /Sitemap:/i, "robots.txt has no sitemap directive");

  const sitemap = await request(`${baseUrl}/sitemap.xml`);
  checkedUrls += 1;
  assert.equal(sitemap.response.status, 200, "sitemap.xml must return HTTP 200");
  const sitemapUrls = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
  assert.ok(sitemapUrls.length > 0, "sitemap.xml contains no URLs");
  assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, "sitemap.xml contains duplicate URLs");

  for (const url of sitemapUrls) {
    const parsed = new URL(url);
    assert.equal(parsed.origin, origin, `${url}: sitemap URL uses an unexpected origin`);
    const { response } = await request(url);
    checkedUrls += 1;
    assert.equal(response.status, 200, `${url}: sitemap URL must return HTTP 200`);
  }

  if (new URL(baseUrl).hostname === "sleekacademia.com") {
    for (const variant of ["http://sleekacademia.com", "https://www.sleekacademia.com"]) {
      const { response } = await request(variant, { redirect: "manual" });
      checkedUrls += 1;
      assert.equal(response.status, 301, `${variant} must return HTTP 301`);
      assert.equal(
        new URL(response.headers.get("location"), variant).href,
        "https://sleekacademia.com/",
        `${variant} must redirect to the canonical host`,
      );
    }
  }

  return { checkedUrls };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const baseUrl = process.argv[2] || "https://sleekacademia.com";
  try {
    const result = await checkSite(baseUrl);
    console.log(`Live SEO check passed: ${result.checkedUrls} URLs checked at ${baseUrl}`);
  } catch (error) {
    console.error(`Live SEO check failed: ${error.message}`);
    process.exitCode = 1;
  }
}
