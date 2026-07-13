(function initializeAdminOrderPage() {
  "use strict";

  const state = { csrfToken: "", demoMode: false, orderId: "", payload: null };
  const byId = (id) => document.getElementById(id);

  function element(tag, className, value) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (value !== undefined && value !== null) node.textContent = String(value);
    return node;
  }

  function replace(target, children) {
    const node = typeof target === "string" ? byId(target) : target;
    node.replaceChildren(...children.filter(Boolean));
    return node;
  }

  function money(cents) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format((Number(cents) || 0) / 100);
  }

  function date(value, withTime = false) {
    const parsed = new Date(value || "");
    if (!Number.isFinite(parsed.getTime())) return "Not set";
    return new Intl.DateTimeFormat("en-US", withTime ? { dateStyle: "medium", timeStyle: "short" } : { dateStyle: "medium" }).format(parsed);
  }

  function bytes(value) {
    const amount = Number(value) || 0;
    if (amount < 1024) return `${amount} B`;
    if (amount < 1048576) return `${(amount / 1024).toFixed(1)} KB`;
    return `${(amount / 1048576).toFixed(1)} MB`;
  }

  function statusBadge(status) {
    const key = String(status || "").toLowerCase().replaceAll(" ", "-");
    const map = { "needs-clarification": "clarification", "deposit-due": "deposit", "in-progress": "progress", "in-revision": "revision", "revision-requested": "revision", declined: "cancelled" };
    return element("span", `dash-status ${map[key] || key || "cancelled"}`, status || "Unknown");
  }

  function showToast(message, isError = false) {
    const toast = element("div", "dash-toast", message);
    if (isError) toast.setAttribute("role", "alert");
    replace("admin-order-live-region", [toast]);
    window.setTimeout(() => { if (toast.isConnected) toast.remove(); }, 5000);
  }

  function showError(error) {
    byId("admin-order-loading").hidden = true;
    byId("admin-order-content").hidden = true;
    byId("admin-order-error-copy").textContent = error.message || "The order could not be loaded.";
    byId("admin-order-error").hidden = false;
  }

  async function api(path, options = {}) {
    const method = options.method || "GET";
    const headers = { Accept: "application/json" };
    if (state.demoMode) headers["x-demo-role"] = "admin";
    if (method !== "GET" && method !== "HEAD") headers["x-csrf-token"] = state.csrfToken;
    let body;
    if (options.body !== undefined) {
      headers["content-type"] = "application/json";
      body = JSON.stringify(options.body);
    }
    const response = await fetch(path, { method, headers, body, credentials: "same-origin" });
    if ((response.status === 401 || response.status === 403) && !state.demoMode) {
      window.location.replace("/login.html");
      throw new Error("The MCX session has expired.");
    }
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.error || `Request failed with status ${response.status}.`);
    }
    if (response.status === 204) return null;
    return response.json();
  }

  async function loadSession() {
    const configResponse = await fetch("/api/config", { credentials: "same-origin" });
    if (!configResponse.ok) throw new Error("The workspace configuration could not load.");
    const config = await configResponse.json();
    state.demoMode = Boolean(config.demoMode);
    const session = await api(state.demoMode ? "/api/platform/session" : "/api/admin-auth/session");
    if (session.identity?.role !== "admin") throw new Error("MCX administrator access is required.");
    state.csrfToken = session.csrfToken || sessionStorage.getItem("sleekAcademia.adminCsrf") || "";
    sessionStorage.setItem("sleekAcademia.adminCsrf", state.csrfToken);
  }

  function definitionList(entries) {
    const list = element("dl", "dash-list");
    entries.forEach(([label, value]) => {
      const row = element("div", "dash-list-item");
      row.append(element("dt", "", label), element("dd", "", value || "Not supplied"));
      list.append(row);
    });
    return list;
  }

  function simpleList(items, title, meta) {
    if (!items.length) return element("p", "", "No records yet.");
    const list = element("ul", "dash-list");
    items.forEach((item) => {
      const row = element("li", "dash-list-item");
      const copy = element("div");
      copy.append(element("strong", "", title(item)), element("p", "", meta(item)));
      row.append(copy);
      list.append(row);
    });
    return list;
  }

  function fileList(files) {
    return simpleList(files, (file) => file.fileName || "Private file", (file) => `${file.category || "material"} · ${bytes(file.sizeBytes)} · ${date(file.createdAt, true)}${file.deliveryLocked ? " · download gated until paid" : ""}`);
  }

  function timeline(events) {
    if (!events.length) return element("p", "", "No timeline events yet.");
    const list = element("ol", "dash-timeline");
    events.forEach((event) => {
      const item = element("li", "dash-timeline-item");
      item.append(element("strong", "", String(event.type || "Activity").replaceAll(".", " ")), element("span", "", date(event.createdAt, true)));
      list.append(item);
    });
    return list;
  }

  function renderOrder(payload) {
    state.payload = payload;
    const order = payload.order;
    const pricing = order.pricingSnapshot || {};
    const balance = Math.max(0, (Number(order.quoteCents) || 0) - (Number(order.paidCents) || 0));
    document.title = `${order.title || order.subject || "Order"} | Sleek Academia Admin`;
    replace("admin-order-status", [statusBadge(order.status)]);
    byId("admin-order-title").textContent = order.title || order.subject || "Order command center";
    byId("admin-order-meta").textContent = `${order.id} · ${order.name || order.email || "Client"} · ${order.service || "support"}`;
    const summary = [["Status", order.status], ["Quote", money(order.quoteCents)], ["Paid", money(order.paidCents)], ["Balance", money(balance)]];
    replace("admin-order-summary", summary.map(([label, value]) => {
      const card = element("article", "glass-panel dash-kpi");
      card.append(element("span", "dash-kpi-label", label), element("strong", "dash-kpi-value", value));
      return card;
    }));
    replace("admin-order-instructions", [definitionList([["Client", order.name || order.email], ["Service", order.service], ["Subject", order.subject], ["Instructions", order.description], ["Citation style", order.citationStyle], ["Requested deadline", date(order.deadline, true)], ["Accepted deadline", date(order.acceptedDeadline, true)]])]);
    const materials = (payload.attachments || []).filter((file) => !new Set(["draft", "final", "ai-report"]).has(file.category));
    replace("admin-order-materials", [fileList(materials)]);
    replace("admin-order-pricing", [definitionList([["Calculation", pricing.calculation || pricing.label || "Server-calculated quote"], ["Total", money(order.quoteCents || pricing.totalCents)], ["Deposit", money(pricing.depositCents)], ["Balance", money(pricing.balanceCents)], ["Paid", money(order.paidCents)]])]);
    replace("admin-order-payments", [simpleList(payload.payments || [], (payment) => `${payment.provider || "Provider"} ${payment.milestone || "payment"}`, (payment) => `${money(payment.amountCents)} · ${payment.status || "pending"} · ${date(payment.confirmedAt || payment.createdAt, true)}`)]);
    replace("admin-order-messages", [simpleList(payload.messages || [], (message) => message.senderRole === "admin" ? "MCX" : (order.name || "Client"), (message) => `${message.body} · ${date(message.createdAt, true)}`)]);
    replace("admin-order-timeline", [timeline(payload.events || [])]);
    const deliveries = (payload.attachments || []).filter((file) => new Set(["draft", "final", "ai-report"]).has(file.category));
    replace("admin-order-deliveries", [fileList(deliveries)]);
    replace("admin-order-revisions", [simpleList(payload.revisions || [], (revision) => revision.status || "Revision", (revision) => `${revision.instructions || revision.body || "Revision request"} · ${date(revision.createdAt, true)}`)]);
    updateControls(order);
    byId("admin-order-loading").hidden = true;
    byId("admin-order-error").hidden = true;
    byId("admin-order-content").hidden = false;
  }

  function updateControls(order) {
    const incoming = new Set(["Available", "Needs Clarification"]);
    byId("admin-clarification-form").querySelector("button").disabled = !incoming.has(order.status);
    byId("admin-accept-form").querySelector("button").disabled = !incoming.has(order.status);
    byId("admin-decline-order").disabled = !incoming.has(order.status);
    byId("admin-deliverable-form").querySelector("button").disabled = !new Set(["In Progress", "In Revision"]).has(order.status);
    byId("admin-complete-order").disabled = !(order.status === "Delivered" && Number(order.paidCents) >= Number(order.quoteCents));
  }

  async function refresh(message) {
    renderOrder(await api(`/api/platform/admin/orders/${encodeURIComponent(state.orderId)}`));
    if (message) showToast(message);
  }

  async function withPending(control, task) {
    const original = control.textContent;
    control.disabled = true;
    control.textContent = "Working...";
    try { return await task(); }
    finally { control.disabled = false; control.textContent = original; }
  }

  async function submitClarification(event) {
    event.preventDefault();
    const body = byId("admin-clarification-body").value.trim();
    if (!body) return showToast("Add the missing information request.", true);
    await withPending(event.currentTarget.querySelector("button"), async () => {
      await api(`/api/platform/admin/orders/${encodeURIComponent(state.orderId)}/clarification`, { method: "POST", body: { body } });
      byId("admin-clarification-body").value = "";
      await refresh("Clarification request sent.");
    });
  }

  async function acceptOrder(event) {
    event.preventDefault();
    const dollars = Number(byId("admin-custom-quote").value);
    const body = {
      acceptedDeadline: byId("admin-accepted-deadline").value ? new Date(byId("admin-accepted-deadline").value).toISOString() : "",
      ...(Number.isFinite(dollars) && dollars > 0 ? { customQuoteCents: Math.round(dollars * 100), customQuoteReason: byId("admin-custom-reason").value.trim() } : {}),
    };
    await withPending(event.currentTarget.querySelector("button"), async () => {
      await api(`/api/platform/admin/orders/${encodeURIComponent(state.orderId)}/accept`, { method: "POST", body });
      await refresh("Order accepted. The client can now pay the deposit.");
    });
  }

  async function changeStatus(status, control) {
    await withPending(control, async () => {
      await api(`/api/platform/admin/orders/${encodeURIComponent(state.orderId)}/status`, { method: "PATCH", body: { status } });
      await refresh(`Order moved to ${status}.`);
    });
  }

  function readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("The selected file could not be read."));
      reader.onload = () => resolve(String(reader.result || "").split(",").at(-1) || "");
      reader.readAsDataURL(file);
    });
  }

  async function uploadDeliverable(event) {
    event.preventDefault();
    const file = byId("admin-deliverable-file").files[0];
    if (!file) return showToast("Choose a deliverable file.", true);
    await withPending(event.currentTarget.querySelector("button"), async () => {
      await api(`/api/platform/admin/orders/${encodeURIComponent(state.orderId)}/deliverables`, { method: "POST", body: { category: byId("admin-deliverable-category").value, fileName: file.name, mimeType: file.type || "application/octet-stream", contentBase64: await readFile(file) } });
      event.currentTarget.reset();
      await refresh("Deliverable uploaded to private storage.");
    });
  }

  async function logout() {
    if (!state.demoMode) await api("/api/admin-auth/logout", { method: "POST" });
    sessionStorage.removeItem("sleekAcademia.adminCsrf");
    window.location.replace("/login.html");
  }

  function bindEvents() {
    byId("admin-clarification-form").addEventListener("submit", (event) => void submitClarification(event).catch((error) => showToast(error.message, true)));
    byId("admin-accept-form").addEventListener("submit", (event) => void acceptOrder(event).catch((error) => showToast(error.message, true)));
    byId("admin-deliverable-form").addEventListener("submit", (event) => void uploadDeliverable(event).catch((error) => showToast(error.message, true)));
    byId("admin-change-status").addEventListener("click", (event) => void changeStatus(byId("admin-next-status").value, event.currentTarget).catch((error) => showToast(error.message, true)));
    byId("admin-decline-order").addEventListener("click", (event) => void changeStatus("Declined", event.currentTarget).catch((error) => showToast(error.message, true)));
    byId("admin-complete-order").addEventListener("click", (event) => void changeStatus("Completed", event.currentTarget).catch((error) => showToast(error.message, true)));
    byId("admin-order-logout").addEventListener("click", () => void logout().catch((error) => showToast(error.message, true)));
  }

  async function start() {
    state.orderId = new URLSearchParams(window.location.search).get("id") || "";
    if (!state.orderId) return showError(new Error("Choose an order from the administration dashboard."));
    bindEvents();
    try {
      await loadSession();
      await refresh();
    } catch (error) { showError(error); }
  }

  window.addEventListener("DOMContentLoaded", () => { void start(); });
}());
