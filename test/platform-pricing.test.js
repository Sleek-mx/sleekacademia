import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_PRICING,
  calculateCustomQuote,
  calculateExamQuote,
  calculateOrderQuote,
  calculateWritingQuote,
  splitMilestones,
} from "../src/platform/pricing.js";

test("standard writing costs 1500 cents for each 275-word page", () => {
  const quote = calculateWritingQuote({ pages: 4, urgency: "standard" });

  assert.equal(DEFAULT_PRICING.writingPageWords, 275);
  assert.equal(quote.units, 4);
  assert.equal(quote.unitRateCents, 1500);
  assert.equal(quote.equivalentWords, 1100);
  assert.equal(quote.totalCents, 6000);
});

test("word count rounds up at the 275-word boundary and takes precedence", () => {
  assert.equal(calculateWritingQuote({ words: 275 }).units, 1);
  assert.equal(calculateWritingQuote({ words: 276 }).units, 2);

  const quote = calculateWritingQuote({ pages: 99, words: 276 });
  assert.equal(quote.units, 2);
  assert.equal(quote.requestedWords, 276);
});

test("six-hour urgent writing costs 1650 cents per page", () => {
  const quote = calculateWritingQuote({ pages: 4, urgency: "six-hour" });
  assert.equal(quote.unitRateCents, 1650);
  assert.equal(quote.totalCents, 6600);
});

test("exam assistance costs 15000 cents per whole hour", () => {
  const quote = calculateExamQuote({ hours: "3" });
  assert.equal(quote.units, 3);
  assert.equal(quote.unitRateCents, 15000);
  assert.equal(quote.totalCents, 45000);
});

test("pricing rejects zero, fractional, negative, and conflicting invalid units", () => {
  assert.throws(() => calculateWritingQuote({ words: 0 }), /positive whole number/i);
  assert.throws(() => calculateWritingQuote({ pages: -1 }), /positive whole number/i);
  assert.throws(() => calculateExamQuote({ hours: 1.5 }), /whole hour/i);
  assert.throws(() => calculateExamQuote({ hours: "one" }), /whole hour/i);
  assert.throws(() => calculateWritingQuote({ pages: 1, urgency: "instant" }), /urgency/i);
});

test("pricing rejects totals outside JavaScript safe integer cents", () => {
  assert.throws(
    () => calculateExamQuote({ hours: Number.MAX_SAFE_INTEGER }),
    /safe integer/i,
  );
});

test("custom quotes require at least one dollar and a reason", () => {
  assert.throws(() => calculateCustomQuote({ totalCents: 99, reason: "Custom tutoring" }), /at least 100 cents/i);
  assert.throws(() => calculateCustomQuote({ totalCents: 25000, reason: "" }), /reason/i);

  const quote = calculateCustomQuote({ totalCents: 25000, reason: "Custom tutoring plan" });
  assert.equal(quote.totalCents, 25000);
  assert.equal(quote.reason, "Custom tutoring plan");
});

test("deposit receives the extra cent and balance is exact", () => {
  assert.deepEqual(splitMilestones(1501), { depositCents: 751, balanceCents: 750 });
  assert.deepEqual(splitMilestones(6000), { depositCents: 3000, balanceCents: 3000 });
});

test("order calculation routes fixed and custom services without browser totals", () => {
  assert.equal(calculateOrderQuote({ service: "essay", pages: 2, totalCents: 1 }).totalCents, 3000);
  assert.equal(calculateOrderQuote({ service: "exam", hours: 2, totalCents: 1 }).totalCents, 30000);
  assert.equal(
    calculateOrderQuote({ service: "tutoring", customQuoteCents: 22000, customQuoteReason: "Two-session plan" }).totalCents,
    22000,
  );
  assert.throws(() => calculateOrderQuote({ service: "other" }), /custom quote/i);
});

test("pricing snapshots are immutable and contain exact milestones", () => {
  const quote = calculateWritingQuote({ pages: 1 });
  assert.equal(Object.isFrozen(quote), true);
  assert.equal(quote.currency, "usd");
  assert.equal(quote.depositCents, 750);
  assert.equal(quote.balanceCents, 750);
  assert.throws(() => { quote.totalCents = 1; }, TypeError);
});
