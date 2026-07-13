import assert from "node:assert/strict";
import test from "node:test";

import {
  ORDER_STATUSES,
  canTransitionOrder,
  deriveOrderQueues,
  getRevisionEligibility,
} from "../src/platform/domain.js";

const pricedOrder = {
  status: "Available",
  quoteCents: 24000,
  paidCents: 0,
  pricingSnapshot: {
    totalCents: 24000,
    depositCents: 12000,
    balanceCents: 12000,
  },
};

test("order lifecycle exposes the approved primary statuses", () => {
  assert.deepEqual(ORDER_STATUSES, [
    "Available",
    "Needs Clarification",
    "Deposit Due",
    "In Progress",
    "Delivered",
    "Revision Requested",
    "In Revision",
    "Completed",
    "Declined",
    "Cancelled",
  ]);
});

test("order lifecycle allows only the approved path and terminal outcomes", () => {
  const allowed = [
    ["Available", "Needs Clarification"],
    ["Needs Clarification", "Available"],
    ["Available", "Deposit Due"],
    ["Needs Clarification", "Deposit Due"],
    ["Deposit Due", "In Progress"],
    ["In Progress", "Delivered"],
    ["Delivered", "Revision Requested"],
    ["Revision Requested", "In Revision"],
    ["In Revision", "Delivered"],
    ["Delivered", "Completed"],
    ["Available", "Declined"],
    ["Available", "Cancelled"],
  ];

  for (const [from, to] of allowed) {
    const result = canTransitionOrder(
      { ...pricedOrder, status: from, paidCents: 24000 },
      to,
      { hasFinalDeliverable: true, hasOpenRevision: false },
    );
    assert.equal(result.ok, true, `${from} -> ${to}: ${result.error || "blocked"}`);
  }

  for (const status of ["Completed", "Declined", "Cancelled"]) {
    assert.equal(canTransitionOrder({ ...pricedOrder, status }, "Available").ok, false);
  }
  assert.equal(canTransitionOrder({ ...pricedOrder, status: "Available" }, "Completed").ok, false);
});

test("order lifecycle enforces quote, deposit, delivery, payment, and revision guards", () => {
  assert.match(
    canTransitionOrder({ status: "Available", quoteCents: 24000 }, "Deposit Due").error,
    /pricing snapshot/i,
  );
  assert.match(
    canTransitionOrder({ ...pricedOrder, status: "Deposit Due" }, "In Progress").error,
    /deposit/i,
  );
  assert.match(
    canTransitionOrder({ ...pricedOrder, status: "In Progress", paidCents: 12000 }, "Delivered").error,
    /final deliverable/i,
  );
  assert.match(
    canTransitionOrder({ ...pricedOrder, status: "Delivered", paidCents: 12000 }, "Completed").error,
    /full payment/i,
  );
  assert.match(
    canTransitionOrder(
      { ...pricedOrder, status: "Delivered", paidCents: 24000 },
      "Completed",
      { hasOpenRevision: true },
    ).error,
    /open revision/i,
  );
});

test("derived queues keep payment, overdue, and unread state separate from status", () => {
  const now = new Date("2026-07-13T12:00:00.000Z");
  const balanceDue = deriveOrderQueues({
    status: "Delivered",
    quoteCents: 24000,
    paidCents: 12000,
    acceptedDeadline: "2026-07-12T12:00:00.000Z",
  }, { now, unreadCount: 2 });
  assert.deepEqual(balanceDue, ["Delivered", "Balance Due", "Overdue", "Unread"]);

  const paid = deriveOrderQueues({
    status: "Delivered",
    quoteCents: 24000,
    paidCents: 24000,
    acceptedDeadline: "2026-07-20T12:00:00.000Z",
  }, { now });
  assert.deepEqual(paid, ["Delivered", "Delivered and Paid"]);
});

test("included revision opens on first paid download and expires after seven days", () => {
  const order = { firstDownloadedAt: "2026-07-01T10:00:00.000Z" };

  assert.deepEqual(
    getRevisionEligibility(order, [], new Date("2026-07-08T10:00:00.000Z")),
    { eligible: true, reason: "eligible", expiresAt: "2026-07-08T10:00:00.000Z" },
  );
  assert.equal(
    getRevisionEligibility(order, [], new Date("2026-07-08T10:00:00.001Z")).reason,
    "window-expired",
  );
  assert.equal(
    getRevisionEligibility(order, [{ included: true }], new Date("2026-07-02T10:00:00.000Z")).reason,
    "included-revision-used",
  );
  assert.equal(
    getRevisionEligibility({}, [], new Date("2026-07-02T10:00:00.000Z")).reason,
    "not-started",
  );
});
