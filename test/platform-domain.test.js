import assert from "node:assert/strict";
import test from "node:test";

import {
  REQUEST_STATUSES,
  amountDueForMilestone,
  canDownloadAttachment,
  canTransitionRequest,
  nextPaymentMilestone,
  validateRequestInput,
} from "../src/platform/domain.js";

test("request input is allowlisted, trimmed, and length limited", () => {
  const result = validateRequestInput({
    service: " essay ",
    subject: " Nursing ethics ",
    title: " Evidence review ",
    description: "  Compare the assigned sources and prepare a transparent draft.  ",
    deadline: "2026-08-10",
    citationStyle: "APA 7",
    pageCount: "8",
    wordCount: "2200",
    examHours: "2",
    urgency: "six-hour",
    email: " MAX@EXAMPLE.COM ",
    name: " Max ",
    urgentPhone: " +1 312 555 0174 ",
    school: " UMGC ",
    ignoredAdminField: "must not survive",
  });

  assert.equal(result.ok, true);
  assert.equal(result.value.service, "essay");
  assert.equal(result.value.email, "max@example.com");
  assert.equal(result.value.description, "Compare the assigned sources and prepare a transparent draft.");
  assert.equal(result.value.wordCount, "2200");
  assert.equal(result.value.examHours, "2");
  assert.equal(result.value.urgency, "six-hour");
  assert.equal("ignoredAdminField" in result.value, false);
});

test("request input reports missing and oversized required values", () => {
  const result = validateRequestInput({
    service: "essay",
    subject: "",
    description: "x".repeat(5001),
    email: "not-an-email",
    name: "",
  });

  assert.equal(result.ok, false);
  assert.match(result.errors.subject, /required/i);
  assert.match(result.errors.name, /required/i);
  assert.match(result.errors.email, /valid/i);
  assert.match(result.errors.description, /5,000/);
});

test("request lifecycle exposes the approved ordered statuses", () => {
  assert.deepEqual(REQUEST_STATUSES, [
    "Draft",
    "Submitted",
    "Reviewing",
    "Quoted",
    "Deposit Due",
    "In Progress",
    "Ready for Review",
    "Balance Due",
    "Completed",
    "Cancelled",
  ]);
});

test("deposit is required before work enters In Progress", () => {
  assert.equal(
    canTransitionRequest(
      { status: "Deposit Due", quoteCents: 24000, paidCents: 0 },
      "In Progress",
    ).ok,
    false,
  );
  assert.equal(
    canTransitionRequest(
      { status: "Deposit Due", quoteCents: 24000, paidCents: 12000 },
      "In Progress",
    ).ok,
    true,
  );
});

test("full payment is required before completion", () => {
  const blocked = canTransitionRequest(
    { status: "Balance Due", quoteCents: 24000, paidCents: 12000 },
    "Completed",
  );
  assert.equal(blocked.ok, false);
  assert.match(blocked.error, /full payment/i);

  assert.equal(
    canTransitionRequest(
      { status: "Balance Due", quoteCents: 24000, paidCents: 24000 },
      "Completed",
    ).ok,
    true,
  );
});

test("invalid lifecycle jumps are rejected while cancellation remains available", () => {
  assert.equal(
    canTransitionRequest({ status: "Submitted", quoteCents: 0, paidCents: 0 }, "Completed").ok,
    false,
  );
  assert.equal(
    canTransitionRequest({ status: "Reviewing", quoteCents: 0, paidCents: 0 }, "Cancelled").ok,
    true,
  );
  assert.equal(
    canTransitionRequest({ status: "Completed", quoteCents: 100, paidCents: 100 }, "Cancelled").ok,
    false,
  );
});

test("payment milestones use integer cents and never trust browser amounts", () => {
  assert.equal(amountDueForMilestone({ quoteCents: 24001, paidCents: 0 }, "deposit"), 12001);
  assert.equal(amountDueForMilestone({ quoteCents: 24001, paidCents: 12001 }, "balance"), 12000);
  assert.equal(amountDueForMilestone({ quoteCents: 24001, paidCents: 24001 }, "balance"), 0);
  assert.equal(nextPaymentMilestone({ quoteCents: 24000, paidCents: 0 }), "deposit");
  assert.equal(nextPaymentMilestone({ quoteCents: 24000, paidCents: 12000 }), "balance");
  assert.equal(nextPaymentMilestone({ quoteCents: 24000, paidCents: 24000 }), null);
});

test("locked final work and AI-use reports require full payment", () => {
  const halfPaid = { quoteCents: 24000, paidCents: 12000 };
  const fullyPaid = { quoteCents: 24000, paidCents: 24000 };

  assert.equal(
    canDownloadAttachment(halfPaid, { category: "final", deliveryLocked: true }),
    false,
  );
  assert.equal(
    canDownloadAttachment(fullyPaid, { category: "ai-report", deliveryLocked: true }),
    true,
  );
  assert.equal(
    canDownloadAttachment(halfPaid, { category: "client", deliveryLocked: false }),
    true,
  );
});
