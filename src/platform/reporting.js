import { deriveOrderQueues, ORDER_STATUSES } from "./domain.js";

const REAL_PROVIDERS = new Set(["stripe", "paypal"]);

function confirmedPayments(payments = []) {
  return payments.filter((payment) => payment?.status === "confirmed" && REAL_PROVIDERS.has(payment.provider));
}

function cents(value) {
  return Number.isSafeInteger(value) && value > 0 ? value : 0;
}

export function buildAdminOverview({ orders = [], payments = [], messages = [] } = {}, now = new Date()) {
  const statusCounts = Object.fromEntries(ORDER_STATUSES.map((status) => [status, 0]));
  const queueCounts = {};
  for (const order of orders) {
    statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    for (const queue of deriveOrderQueues(order, { now })) queueCounts[queue] = (queueCounts[queue] || 0) + 1;
  }
  const confirmed = confirmedPayments(payments);
  return {
    totalOrders: orders.length,
    statusCounts,
    queueCounts,
    confirmedRevenueCents: confirmed.reduce((sum, payment) => sum + cents(payment.amountCents), 0),
    outstandingCents: orders.reduce((sum, order) => sum + Math.max(0, cents(order.quoteCents) - Math.max(0, order.paidCents || 0)), 0),
    unreadMessages: messages.filter((message) => !message.readAt && message.senderRole !== "admin").length,
  };
}

export function buildClientDirectory({ profiles = [], orders = [], payments = [] } = {}) {
  const paidByUser = new Map();
  const orderUser = new Map(orders.map((order) => [order.id, order.userId]));
  for (const payment of confirmedPayments(payments)) {
    const userId = payment.userId || orderUser.get(payment.requestId || payment.orderId);
    if (userId) paidByUser.set(userId, (paidByUser.get(userId) || 0) + cents(payment.amountCents));
  }
  return profiles.map((profile) => {
    const clientOrders = orders.filter((order) => order.userId === profile.userId);
    return {
      ...profile,
      orderCount: clientOrders.length,
      activeOrderCount: clientOrders.filter((order) => !new Set(["Completed", "Declined", "Cancelled"]).has(order.status)).length,
      paidCents: paidByUser.get(profile.userId) || 0,
      lastOrderAt: clientOrders.map((order) => order.createdAt || "").sort().at(-1) || null,
    };
  }).sort((a, b) => String(a.fullName || a.email || "").localeCompare(String(b.fullName || b.email || "")));
}

function periodStart(period, now) {
  const at = now instanceof Date ? now : new Date(now);
  if (period === "today") return new Date(at.getFullYear(), at.getMonth(), at.getDate());
  if (period === "7d") return new Date(at.getTime() - 7 * 86400000);
  if (period === "30d") return new Date(at.getTime() - 30 * 86400000);
  if (period === "month") return new Date(at.getFullYear(), at.getMonth(), 1);
  if (period === "year") return new Date(at.getFullYear(), 0, 1);
  return null;
}

export function buildEarningsReport({ payments = [], orders = [] } = {}, { period = "all", now = new Date() } = {}) {
  const start = periodStart(period, now);
  const rows = confirmedPayments(payments).filter((payment) => {
    if (!start) return true;
    const timestamp = new Date(payment.confirmedAt || payment.createdAt || "").getTime();
    return Number.isFinite(timestamp) && timestamp >= start.getTime() && timestamp <= new Date(now).getTime();
  });
  const byProvider = {};
  for (const payment of rows) byProvider[payment.provider] = (byProvider[payment.provider] || 0) + cents(payment.amountCents);
  return {
    period,
    revenueCents: rows.reduce((sum, payment) => sum + cents(payment.amountCents), 0),
    transactions: rows.length,
    byProvider,
    outstandingCents: orders.reduce((sum, order) => sum + Math.max(0, cents(order.quoteCents) - Math.max(0, order.paidCents || 0)), 0),
    payments: rows,
  };
}

export function filterAndSortOrders(orders = [], query = {}, now = new Date()) {
  const search = String(query.search || "").trim().toLowerCase();
  const status = String(query.status || "").trim();
  const queue = String(query.queue || "").trim();
  let items = orders.filter((order) => {
    if (status && order.status !== status) return false;
    if (queue && !deriveOrderQueues(order, { now, unreadCount: order.unreadCount || 0 }).includes(queue)) return false;
    if (!search) return true;
    return [order.id, order.title, order.subject, order.name, order.email, order.service]
      .some((value) => String(value || "").toLowerCase().includes(search));
  });
  const sort = String(query.sort || "updated");
  items = items.slice().sort((a, b) => {
    if (sort === "deadline") return String(a.acceptedDeadline || a.deadline || "9999").localeCompare(String(b.acceptedDeadline || b.deadline || "9999"));
    if (sort === "oldest") return String(a.createdAt || "").localeCompare(String(b.createdAt || ""));
    return String(b.updatedAt || b.createdAt || "").localeCompare(String(a.updatedAt || a.createdAt || ""));
  });
  const total = items.length;
  const pageSize = Math.min(100, Math.max(1, Number.parseInt(query.pageSize, 10) || 25));
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  return { items: items.slice((page - 1) * pageSize, page * pageSize), total, page, pageSize, pages: Math.max(1, Math.ceil(total / pageSize)) };
}

function csvCell(value) {
  let text = String(value ?? "");
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function ordersToCsv(orders = []) {
  const headings = ["Order ID", "Client", "Email", "Service", "Title", "Status", "Deadline", "Quote USD", "Paid USD", "Created"];
  const rows = orders.map((order) => [
    order.id, order.name || order.userId, order.email, order.service, order.title || order.subject,
    order.status, order.acceptedDeadline || order.deadline, (cents(order.quoteCents) / 100).toFixed(2),
    (Math.max(0, order.paidCents || 0) / 100).toFixed(2), order.createdAt,
  ]);
  return [headings, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n") + "\r\n";
}
