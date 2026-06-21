import assert from "node:assert/strict";
import test from "node:test";

import { buildCtaEvent } from "../public/js/analytics.js";

test("builds a decision-useful CTA event without query strings or PII", () => {
  const event = buildCtaEvent({
    text: "Get Started",
    location: "homepage_hero",
    href: "/onboard.html?email=student@example.com&goal=exam"
  }, "https://sleekacademia.com/");

  assert.deepEqual(event, {
    name: "cta_clicked",
    params: {
      cta_location: "homepage_hero",
      cta_text: "Get Started",
      destination: "/onboard.html"
    }
  });
  assert.doesNotMatch(JSON.stringify(event), /student@example\.com/);
});

test("normalizes blank CTA values", () => {
  const event = buildCtaEvent({ text: "  ", location: "", href: "" });

  assert.deepEqual(event.params, {
    cta_location: "unknown",
    cta_text: "CTA",
    destination: "unknown"
  });
});
