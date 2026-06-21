import assert from "node:assert/strict";
import test from "node:test";

import { validateSeoSnapshot } from "../scripts/check-live-seo.mjs";

const healthySnapshot = {
  health: { status: 200, body: '{"ok":true}' },
  robots: { status: 200, body: "User-agent: *\nSitemap: https://sleekacademia.com/sitemap.xml" },
  sitemap: { status: 200, body: "<urlset><loc>https://sleekacademia.com/</loc></urlset>" },
  homepage: {
    status: 200,
    body: '<title>Academic Tutoring | Sleek Academia</title><link rel="canonical" href="https://sleekacademia.com/" />'
  }
};

test("accepts a healthy live SEO snapshot", () => {
  assert.deepEqual(validateSeoSnapshot(healthySnapshot), []);
});

test("reports actionable failures for unhealthy SEO responses", () => {
  const failures = validateSeoSnapshot({
    ...healthySnapshot,
    health: { status: 503, body: '{"ok":false}' },
    homepage: { status: 200, body: "<title>Home</title>" }
  });

  assert.deepEqual(failures, [
    "health endpoint returned 503",
    "health endpoint did not report ok=true",
    "homepage title does not describe academic tutoring",
    "homepage canonical is missing or incorrect"
  ]);
});
