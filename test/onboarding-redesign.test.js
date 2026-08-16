import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = fs.readFileSync(path.join(root, "public", "onboard.html"), "utf8");

test("onboarding uses the approved glass-college shell", () => {
  assert.match(html, /class="[^"]*glass-college[^"]*page-onboard|class="[^"]*page-onboard[^"]*glass-college/);
  assert.match(html, /href="\/css\/glass-college\.css\?v=/);
  assert.match(html, /href="\/css\/onboarding-glass\.css\?v=/);
  assert.match(html, /class="gc-nav"/);
});
test("four progress stages are named for assistive technology", () => {
  for (const label of ["Support type", "Project brief", "Contact details", "Secure review"]) {
    assert.ok(html.includes(`aria-label="${label}"`), `${label}: progress label missing`);
  }
});

test("onboarding stays service-only and gives study-tool shoppers a direct exit", () => {
  assert.match(html, /Request academic support/);
  assert.match(html, /href="\/resources\.html"[^>]*>Browse study tools/);
  assert.doesNotMatch(html, /Free planner|Free checklist|resource&amp;item=/i);
});

test("redesign preserves order and identity integration hooks", () => {
  for (const id of ["request-wizard", "wizard-back", "wizard-next", "request-review", "clerk-onboard-sign-up"]) {
    assert.match(html, new RegExp(`id="${id}"`), `${id}: integration hook missing`);
  }
  for (const step of ["service", "brief", "contact", "review"]) {
    assert.match(html, new RegExp(`data-wizard-step="${step}"`), `${step}: wizard step missing`);
  }
  assert.match(html, /src="\/js\/onboard\.js\?v=/);
});
