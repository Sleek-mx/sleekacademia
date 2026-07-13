import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    ...options,
  });
}

function trackedSourceFiles() {
  const result = run("git", ["ls-files", "-z"]);
  if (result.status !== 0) {
    throw new Error("Unable to enumerate tracked source files.");
  }

  return result.stdout
    .split("\0")
    .filter(Boolean)
    .filter((file) => (
      file === "server.js" ||
      file.startsWith("src/") ||
      file.startsWith("public/") ||
      file.startsWith("scripts/") ||
      file.startsWith(".github/")
    ))
    .filter((file) => file !== "scripts/check-security.mjs")
    .filter((file) => /\.(?:c?js|mjs|html|json|ya?ml|css)$/.test(file));
}

function report(rule, file) {
  failures.push({ rule, file });
}

const credentialRules = [
  ["credential-pattern.private-key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ["credential-pattern.stripe-secret", /\b(?:sk_live|rk_live|whsec)_[A-Za-z0-9]{12,}/],
  ["credential-pattern.github-token", /\b(?:ghp|github_pat)_[A-Za-z0-9_]{20,}/],
  ["credential-pattern.aws-access-key", /\bAKIA[0-9A-Z]{16}\b/],
  ["credential-pattern.admin-password", /\bADMIN_PASSWORD(?!_HASH)\s*[:=]\s*["'][^"'$]{8,}["']/],
  ["credential-pattern.supabase-service-role", /\bSUPABASE_SERVICE_ROLE_KEY\s*[:=]\s*["'][^"'$]{20,}["']/],
];

const manualPaymentRoute = /(?:app|router)\.(?:post|patch)\(\s*["'`][^"'`]*(?:mark[-_/ ]?paid|manual[-_/ ]?paid|offline[-_/ ]?payment|m-?pesa)/i;
const unsafeRsyncDelete = /\brsync\b[^\n]*--delete/;
const files = trackedSourceFiles();

for (const file of files) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  for (const [rule, pattern] of credentialRules) {
    if (pattern.test(source)) report(rule, file);
  }
  if (manualPaymentRoute.test(source)) report("manual-payment-route", file);
  if (unsafeRsyncDelete.test(source) && file !== "server.js") {
    report("unsafe-rsync-delete", file);
  }
}

const identityPath = path.join(root, "src/platform/identity.js");
const identitySource = fs.readFileSync(identityPath, "utf8");
const demoModeEnvironmentName = "LOCAL_DEMO_MODE";
if (!demoModeEnvironmentName || !identitySource.includes("localDemoMode && isLoopbackHostname(req.hostname)")) {
  report("demo-mode-loopback-guard", "src/platform/identity.js");
}

if (failures.length) {
  for (const failure of failures) {
    console.error(`${failure.rule}: ${failure.file}`);
  }
  process.exit(1);
}

const audit = run("npm", ["audit", "--omit=dev", "--audit-level=moderate"], { stdio: "inherit" });
if (audit.status !== 0) process.exit(audit.status || 1);

console.log(`Security release gate passed (${files.length} tracked source files scanned).`);
