import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("Vercel preserves the canonical 301 redirects before static file handling", () => {
  const config = JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf8"));
  assert.deepEqual(config.redirects[0], {
    source: "/:path*",
    has: [{ type: "host", value: "www.sleekacademia.com" }],
    destination: "https://sleekacademia.com/:path*",
    statusCode: 301,
  });

  const redirects = new Map(
    config.redirects.map(({ source, destination, statusCode }) => [
      source,
      { destination, statusCode },
    ]),
  );

  assert.deepEqual(redirects.get("/index.html"), { destination: "/", statusCode: 301 });
  assert.deepEqual(redirects.get("/services.html"), { destination: "/", statusCode: 301 });
  assert.deepEqual(redirects.get("/pricing.html"), { destination: "/onboard.html", statusCode: 301 });
  assert.deepEqual(redirects.get("/blogs.html"), { destination: "/blog.html", statusCode: 301 });
});
