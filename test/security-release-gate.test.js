import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

test("production dependencies meet the approved secure minimums", () => {
  assert.match(packageJson.dependencies["@clerk/express"] || "", /1\.7\.82/);
  assert.match(packageJson.dependencies.axios || "", /1\.18\.1/);
  assert.match(packageJson.dependencies.express || "", /4\.22\.2/);
  assert.match(packageJson.dependencies.helmet || "", /8\.3\.0/);
  assert.match(packageJson.dependencies["express-rate-limit"] || "", /8\.5\.2/);
});

test("package scripts expose the security release gate", () => {
  assert.equal(packageJson.scripts["check:security"], "node scripts/check-security.mjs");
});

test("security gate audits dependencies and scans only tracked source", () => {
  const scriptPath = path.join(root, "scripts/check-security.mjs");
  assert.equal(fs.existsSync(scriptPath), true, "security gate script is missing");
  const script = fs.readFileSync(scriptPath, "utf8");

  assert.match(script, /npm[\s\S]*audit[\s\S]*--omit=dev[\s\S]*--audit-level=moderate/);
  assert.match(script, /git[\s\S]*ls-files/);
  assert.match(script, /credential-pattern/);
  assert.match(script, /manual-payment-route/);
  assert.match(script, /unsafe-rsync-delete/);
  assert.match(script, /LOCAL_DEMO_MODE/);
  assert.doesNotMatch(script, /readFileSync\([^)]*\.env/);
});
