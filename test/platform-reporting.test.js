import assert from "node:assert/strict";
import test from "node:test";

import {
  buildAdminOverview,
  buildClientDirectory,
  buildEarningsReport,
  filterAndSortOrders,
  ordersToCsv,
} from "../src/platform/reporting.js";

const orders = [
  { id: "o1", userId: "u1", title: "Nursing paper", status: "In Progress", quoteCents: 3000, paidCents: 1500, acceptedDeadline: "2026-07-14T00:00:00.000Z", createdAt: "2026-07-10T00:00:00.000Z" },
  { id: "o2", userId: "u2", title: "Bar exam", status: "Delivered", quoteCents: 15000, paidCents: 15000, acceptedDeadline: "2026-07-20T00:00:00.000Z", createdAt: "2026-07-11T00:00:00.000Z" },
];
const payments = [
  { id: "p1", requestId: "o1", provider: "stripe", status: "confirmed", amountCents: 1500, confirmedAt: "2026-07-12T00:00:00.000Z" },
  { id: "p2", requestId: "o2", provider: "paypal", status: "confirmed", amountCents: 15000, confirmedAt: "2026-07-13T00:00:00.000Z" },
  { id: "p3", requestId: "o2", provider: "demo", status: "confirmed", amountCents: 99999, confirmedAt: "2026-07-13T00:00:00.000Z" },
];

test("admin overview separates lifecycle counts, revenue, and outstanding balance", () => {
  const overview = buildAdminOverview({ orders, payments, messages: [] }, new Date("2026-07-13T12:00:00.000Z"));
  assert.equal(overview.totalOrders, 2);
  assert.equal(overview.statusCounts["In Progress"], 1);
  assert.equal(overview.statusCounts.Delivered, 1);
  assert.equal(overview.confirmedRevenueCents, 16500);
  assert.equal(overview.outstandingCents, 1500);
});

test("client directory aggregates orders and confirmed provider payments", () => {
  const clients = buildClientDirectory({
    profiles: [{ userId: "u1", fullName: "Ana" }, { userId: "u2", fullName: "Ben" }],
    orders,
    payments,
  });
  assert.equal(clients[0].userId, "u1");
  assert.equal(clients[0].orderCount, 1);
  assert.equal(clients[0].paidCents, 1500);
  assert.equal(clients[1].paidCents, 15000);
});

test("earnings include only confirmed Stripe and PayPal payments in period", () => {
  const report = buildEarningsReport({ payments, orders }, { period: "7d", now: new Date("2026-07-13T12:00:00.000Z") });
  assert.equal(report.revenueCents, 16500);
  assert.equal(report.transactions, 2);
  assert.equal("profitCents" in report, false);
});

test("earnings supports the dashboard 90-day period", () => {
  const historical = { id: "p0", requestId: "o1", provider: "stripe", status: "confirmed", amountCents: 700, confirmedAt: "2026-03-01T00:00:00.000Z" };
  const report = buildEarningsReport({ payments: [...payments, historical], orders }, { period: "90d", now: new Date("2026-07-13T12:00:00.000Z") });
  assert.equal(report.revenueCents, 16500);
  assert.equal(report.transactions, 2);
});

test("orders support search, derived filters, deadline ordering, and pagination", () => {
  const result = filterAndSortOrders(orders, { search: "nursing", sort: "deadline", page: "1", pageSize: "1" }, new Date("2026-07-13T12:00:00.000Z"));
  assert.equal(result.total, 1);
  assert.deepEqual(result.items.map((order) => order.id), ["o1"]);
  assert.equal(result.pageSize, 1);
  const balance = filterAndSortOrders(orders, { queue: "Delivered and Paid" }, new Date("2026-07-13T12:00:00.000Z"));
  assert.deepEqual(balance.items.map((order) => order.id), ["o2"]);
});

test("CSV export escapes formulas, quotes, commas, and newlines", () => {
  const csv = ordersToCsv([{ ...orders[0], title: '=HYPERLINK("bad"),\nPaper' }]);
  assert.match(csv, /^Order ID,/);
  assert.match(csv, /"'=HYPERLINK\(""bad""\),\nPaper"/);
});
