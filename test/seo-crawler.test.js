import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import test from "node:test";

const PORT = 4319;
let serverProcess;

test.before(async () => {
  serverProcess = spawn(process.execPath, ["server.js"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      PORT: String(PORT)
    },
    stdio: ["ignore", "pipe", "pipe"]
  });

  await waitForServer();
});

test.after(() => {
  serverProcess?.kill();
});

test("serves robots.txt for search crawlers", async () => {
  const response = await fetch(`http://localhost:${PORT}/robots.txt`);
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /text\/plain/);
  assert.match(body, /User-agent: \*/);
  assert.match(body, /Sitemap: https:\/\/sleekacademia\.com\/sitemap\.xml/);
});

test("serves sitemap.xml for search crawlers", async () => {
  const response = await fetch(`http://localhost:${PORT}/sitemap.xml`);
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /application\/xml/);
  assert.match(body, /<loc>https:\/\/sleekacademia\.com\//);
});

function waitForServer() {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Timed out waiting for test server"));
    }, 5000);

    serverProcess.stdout.on("data", (chunk) => {
      if (chunk.toString().includes("Sleek Academia is running")) {
        clearTimeout(timeout);
        resolve();
      }
    });

    serverProcess.once("exit", (code) => {
      clearTimeout(timeout);
      reject(new Error(`Server exited before tests started with code ${code}`));
    });
  });
}
