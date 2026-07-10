import { test } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";

async function withFixture({ includeCanonical = true }, assertion) {
  const server = http.createServer((req, res) => {
    const baseUrl = `http://127.0.0.1:${server.address().port}`;
    const redirects = {
      "/index.html": "/",
      "/services.html": "/",
      "/pricing.html": "/#pricing",
      "/blogs.html": "/blog.html",
    };

    if (redirects[req.url]) {
      res.writeHead(301, { Location: redirects[req.url] });
      return res.end();
    }
    if (req.url === "/robots.txt") {
      res.writeHead(200, { "content-type": "text/plain" });
      return res.end(`User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml\n`);
    }
    if (req.url === "/sitemap.xml") {
      res.writeHead(200, { "content-type": "application/xml" });
      return res.end(`<urlset><url><loc>${baseUrl}/</loc></url><url><loc>${baseUrl}/blog.html</loc></url></urlset>`);
    }
    if (req.url === "/blog.html") {
      res.writeHead(200, { "content-type": "text/html" });
      return res.end("<!doctype html><title>Blog</title><h1>Blog</h1>");
    }
    if (req.url === "/") {
      res.writeHead(200, { "content-type": "text/html" });
      return res.end(`<!doctype html>
        <html><head>
          <title>Academic Tutoring | Sleek Academia</title>
          <meta name="description" content="Personalized academic tutoring and exam preparation." />
          ${includeCanonical ? `<link rel="canonical" href="${baseUrl}/" />` : ""}
          <script type="application/ld+json">{"@type":"Organization"}</script>
          <script>gtag('config', 'G-CHXSBK3M81'); fbq('init', '2344858129372736'); ttq.load('D84IJPBC77UDS4G4KMO0');</script>
        </head><body><h1>Sleek Academia</h1></body></html>`);
    }
    res.writeHead(404);
    res.end("Not found");
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    await assertion(`http://127.0.0.1:${server.address().port}`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test("live SEO checker accepts a conforming site", async () => {
  const { checkSite } = await import("../scripts/check-live-seo.mjs");
  await withFixture({ includeCanonical: true }, async (baseUrl) => {
    const result = await checkSite(baseUrl);
    assert.equal(result.checkedUrls, 9);
  });
});

test("live SEO checker identifies a missing homepage canonical", async () => {
  const { checkSite } = await import("../scripts/check-live-seo.mjs");
  await withFixture({ includeCanonical: false }, async (baseUrl) => {
    await assert.rejects(checkSite(baseUrl), /homepage canonical/);
  });
});

