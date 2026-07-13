(function initializeAdminDashboard() {
  "use strict";

  const state = {
    csrfToken: "",
    demoMode: false,
    identity: null,
    overview: null,
    orders: [],
    orderPage: null,
    currentOrder: null,
    currentView: "overview",
  };

  const viewCopy = {
    overview: ["Overview", "Orders, clients, revenue, and work requiring attention."],
    orders: ["Orders", "Review every lifecycle and payment queue."],
    clients: ["Clients", "Client history, active work, and confirmed payments."],
    messages: ["Messages", "Conversations across every client order."],
    payments: ["Payments", "Verified Stripe and PayPal transactions."],
    earnings: ["Earnings", "Confirmed revenue and outstanding balances."],
    files: ["Files", "Private materials and every delivery version."],
    settings: ["Settings", "Security boundaries and workspace policy."],
  };

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
    if (!value) return "Not set";
    const parsed = new Date(value);
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
    const className = String(status || "").toLowerCase().replaceAll(" ", "-");
    const map = { "needs-clarification": "clarification", "deposit-due": "deposit", "in-progress": "progress", "in-revision": "revision", "declined": "cancelled" };
    return element("span", `dash-status ${map[className] || className || "cancelled"}`, status || "Unknown");
  }

  function tableCell(label, value) {
    const cell = element("td");
    cell.dataset.label = label;
    if (value instanceof Node) cell.append(value);
    else cell.textContent = String(value ?? "");
    return cell;
  }

  function showToast(message, isError = false) {
    const toast = element("div", "dash-toast", message);
    if (isError) toast.setAttribute("role", "alert");
    replace("admin-live-region", [toast]);
    window.setTimeout(() => { if (toast.isConnected) toast.remove(); }, 5000);
  }

  function showLoading(visible) {
    byId("admin-loading-state").hidden = !visible;
    if (visible) {
      byId("admin-error-state").hidden = true;
      byId("admin-empty-state").hidden = true;
      document.querySelectorAll("[data-admin-view]").forEach((view) => { view.hidden = true; });
    }
  }

  function showError(error) {
    showLoading(false);
    byId("admin-error-copy").textContent = error.message || "Try the request again.";
    byId("admin-error-state").hidden = false;
  }

  async function api(path, options = {}) {
    const method = options.method || "GET";
    const headers = { Accept: "application/json", ...(options.headers || {}) };
    if (state.demoMode) headers["x-demo-role"] = "admin";
    if (method !== "GET" && method !== "HEAD") headers["x-csrf-token"] = state.csrfToken;
    let body;
    if (options.body !== undefined) {
      headers["content-type"] = "application/json";
      body = JSON.stringify(options.body);
    }
    const response = await fetch(path, { method, headers, body, credentials: "same-origin" });
    if ((response.status === 401 || response.status === 403) && !state.demoMode) {
      window.location.replace("/login.html?mode=admin");
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
    const sessionPath = state.demoMode ? "/api/platform/session" : "/api/admin-auth/session";
    const session = await api(sessionPath);
    if (session.identity?.role !== "admin") throw new Error("MCX administrator access is required.");
    state.identity = session.identity;
    state.csrfToken = session.csrfToken || sessionStorage.getItem("sleekAcademia.adminCsrf") || "";
    sessionStorage.setItem("sleekAcademia.adminCsrf", state.csrfToken);
    byId("admin-user-name").textContent = session.identity.fullName || "MCX Administrator";
    byId("admin-user-email").textContent = session.identity.email || "Secure session";
  }

  async function loadOverview() {
    const [overviewPayload] = await Promise.all([
      api("/api/platform/admin/overview"),
      state.orders.length ? Promise.resolve() : loadOrders({ render: false }),
    ]);
    state.overview = overviewPayload.overview;
    renderKpis(state.overview);
    renderOverviewQueues(state.overview.queueCounts || {});
    renderRecentActivity(state.orders.slice(0, 6));
    byId("nav-order-count").textContent = String(state.overview.totalOrders || 0);
    byId("nav-message-count").textContent = String(state.overview.unreadMessages || 0);
  }

  async function loadOrders({ render = true } = {}) {
    const params = new URLSearchParams();
    const search = byId("admin-order-search")?.value.trim();
    const status = byId("admin-order-status")?.value;
    const queue = byId("admin-order-queue")?.value;
    const sort = byId("admin-order-sort")?.value || "updated";
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (queue) params.set("queue", queue === "Paid" ? "Delivered and Paid" : queue);
    params.set("sort", sort);
    params.set("pageSize", "100");
    const payload = await api(`/api/platform/admin/orders?${params}`);
    state.orderPage = payload.orders;
    state.orders = payload.orders.items || [];
    if (render) renderOrderTable(payload.orders);
    return payload;
  }

  async function loadOrder(orderId) {
    const payload = await api(`/api/platform/admin/orders/${encodeURIComponent(orderId)}`);
    state.currentOrder = payload;
    renderOrderDetail(payload);
    const dialog = byId("admin-order-dialog");
    if (!dialog.open) dialog.showModal();
    return payload;
  }

  function renderKpis(overview) {
    const kpis = [
      ["Total orders", overview.totalOrders, "Every client order"],
      ["Confirmed revenue", money(overview.confirmedRevenueCents), "Stripe and PayPal only"],
      ["Outstanding", money(overview.outstandingCents), "Open client balances"],
      ["Unread messages", overview.unreadMessages, "Needs a reply"],
    ];
    replace("admin-kpis", kpis.map(([label, value, meta]) => {
      const card = element("article", "glass-panel dash-kpi");
      card.append(element("span", "dash-kpi-label", label), element("strong", "dash-kpi-value", value), element("span", "dash-kpi-meta", meta));
      return card;
    }));
  }

  function renderOverviewQueues(counts) {
    const statuses = state.overview?.statusCounts || {};
    const entries = [
      ["Available", statuses.Available || 0], ["Needs Clarification", statuses["Needs Clarification"] || 0],
      ["Deposit Due", statuses["Deposit Due"] || 0], ["In Progress", statuses["In Progress"] || 0],
      ["Delivered", statuses.Delivered || 0], ["In Revision", statuses["In Revision"] || 0],
      ["Completed", statuses.Completed || 0], ["Balance Due", counts["Balance Due"] || 0],
      ["Paid", counts["Delivered and Paid"] || 0], ["Overdue", counts.Overdue || 0], ["Unread", counts.Unread || 0],
    ];
    replace("overview-queues", entries.map(([label, count]) => {
      const button = element("button", "dash-tab", `${label} ${count}`);
      button.type = "button";
      button.dataset.queueShortcut = label;
      return button;
    }));
  }

  function renderRecentActivity(orders) {
    replace("admin-recent-activity", orders.map((order) => {
      const item = element("li", "dash-list-item");
      const copy = element("div");
      copy.append(element("strong", "", order.title || order.subject || order.id), element("p", "", `${order.name || order.email || "Client"} - ${date(order.updatedAt || order.createdAt, true)}`));
      const button = element("button", "dash-button", "Open");
      button.type = "button";
      button.dataset.orderId = order.id;
      item.append(copy, button);
      return item;
    }));
  }

  function renderOrderTable(page) {
    const orders = page.items || [];
    byId("admin-empty-state").hidden = orders.length > 0;
    replace("admin-order-rows", orders.map((order) => {
      const row = element("tr");
      row.dataset.orderId = order.id;
      const orderButton = element("button", "dash-button", order.title || order.subject || order.id);
      orderButton.type = "button";
      orderButton.dataset.orderId = order.id;
      const attention = (order.queues || []).filter((queue) => new Set(["Balance Due", "Delivered and Paid", "Overdue", "Unread"]).has(queue)).join(", ") || "None";
      row.append(
        tableCell("Order", orderButton),
        tableCell("Client", order.name || order.email || order.userId),
        tableCell("Status", statusBadge(order.status)),
        tableCell("Deadline", date(order.acceptedDeadline || order.deadline)),
        tableCell("Quote", money(order.quoteCents)),
        tableCell("Paid", money(order.paidCents)),
        tableCell("Attention", attention),
      );
      return row;
    }));
    byId("admin-order-pagination").textContent = `${page.total || 0} orders`;
  }

  function section(title, content) {
    const panel = element("section", "glass-panel glass-panel-inner dash-stack");
    panel.append(element("h3", "", title));
    if (content instanceof Node) panel.append(content);
    else panel.append(element("p", "", content || "No information supplied."));
    return panel;
  }

  function definitionList(entries) {
    const list = element("dl", "dash-list");
    entries.forEach(([label, value]) => {
      const row = element("div", "dash-list-item");
      row.append(element("dt", "", label), element("dd", "", value ?? "Not supplied"));
      list.append(row);
    });
    return list;
  }

  function renderOrderDetail(payload) {
    const order = payload.order;
    byId("admin-order-dialog-title").textContent = order.title || order.subject || "Order command center";
    byId("admin-order-dialog-meta").textContent = `${order.id} - ${order.name || order.email || "Client"} - ${order.status}`;
    const pricing = order.pricingSnapshot || {};
    const instructions = definitionList([
      ["Service", order.service], ["Subject", order.subject], ["Instructions", order.description],
      ["Citation style", order.citationStyle], ["Requested deadline", date(order.deadline, true)], ["Accepted deadline", date(order.acceptedDeadline, true)],
    ]);
    const materials = renderFiles(payload.attachments?.filter((file) => !new Set(["draft", "final", "ai-report"]).has(file.category)) || []);
    const pricingList = definitionList([
      ["Calculation", pricing.calculation || pricing.label || "Server-calculated quote"], ["Total", money(order.quoteCents || pricing.totalCents)],
      ["Deposit", money(pricing.depositCents)], ["Balance", money(pricing.balanceCents)], ["Paid", money(order.paidCents)],
    ]);
    const paymentList = renderSimpleList(payload.payments || [], (payment) => `${payment.provider || "Provider"} ${payment.milestone || "payment"}`, (payment) => `${money(payment.amountCents)} - ${payment.status || "pending"} - ${date(payment.confirmedAt || payment.createdAt, true)}`);
    const messageList = renderSimpleList(payload.messages || [], (message) => `${message.senderRole || "user"} message`, (message) => `${message.body} - ${date(message.createdAt, true)}`);
    const files = renderFiles(payload.attachments || []);
    const timeline = renderTimeline(payload.events || []);
    const deliveries = renderFiles(payload.attachments?.filter((file) => new Set(["draft", "final", "ai-report"]).has(file.category)) || []);
    const revisions = renderSimpleList(payload.revisions || [], (revision) => revision.status || "Revision", (revision) => `${revision.body || revision.instructions || "Revision request"} - ${date(revision.createdAt, true)}`);
    replace("admin-order-detail", [
      section("Instructions", instructions), section("Materials", materials), section("Pricing snapshot", pricingList),
      section("Payments", paymentList), section("Messages", messageList), section("Files", files),
      section("Timeline", timeline), section("Delivery versions", deliveries), section("Revision history", revisions),
    ]);
    updateOrderControls(order);
  }

  function renderTimeline(events) {
    const list = element("ol", "dash-timeline");
    if (!events.length) return element("p", "", "No timeline events yet.");
    events.forEach((event) => {
      const item = element("li", "dash-timeline-item");
      item.append(element("strong", "", String(event.type || "Activity").replaceAll(".", " ")), element("span", "", date(event.createdAt, true)));
      list.append(item);
    });
    return list;
  }

  function renderSimpleList(items, title, meta) {
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

  function renderFiles(files) {
    return renderSimpleList(files, (file) => file.fileName || "Private file", (file) => `${file.category || "material"} - ${bytes(file.sizeBytes)} - ${date(file.createdAt, true)}${file.deliveryLocked ? " - download gated" : ""}`);
  }

  function updateOrderControls(order) {
    const incoming = new Set(["Available", "Needs Clarification"]);
    byId("admin-clarification-form").querySelector("button").disabled = !incoming.has(order.status);
    byId("admin-accept-form").querySelector("button").disabled = !incoming.has(order.status);
    byId("admin-decline-order").disabled = !incoming.has(order.status);
    byId("admin-deliverable-form").querySelector("button").disabled = !new Set(["In Progress", "In Revision"]).has(order.status);
    byId("admin-complete-order").disabled = !(order.status === "Delivered" && Number(order.paidCents) >= Number(order.quoteCents));
  }

  async function withPending(control, task) {
    const original = control.textContent;
    control.disabled = true;
    control.textContent = "Working...";
    try { return await task(); }
    finally { control.disabled = false; control.textContent = original; }
  }

  async function refreshCurrentOrder(message) {
    const orderId = state.currentOrder?.order?.id;
    await Promise.all([loadOrders({ render: state.currentView === "orders" }), loadOverview()]);
    if (orderId) await loadOrder(orderId);
    if (message) showToast(message);
  }

  async function submitClarification(event) {
    event.preventDefault();
    const button = event.currentTarget.querySelector('button[type="submit"]');
    const body = byId("admin-clarification-body").value.trim();
    if (!body) return showToast("Add the missing information request.", true);
    await withPending(button, async () => {
      await api(`/api/platform/admin/orders/${encodeURIComponent(state.currentOrder.order.id)}/clarification`, { method: "POST", body: { body } });
      byId("admin-clarification-body").value = "";
      await refreshCurrentOrder("Clarification request sent.");
    });
  }

  async function acceptOrder(event) {
    event.preventDefault();
    const button = event.currentTarget.querySelector('button[type="submit"]');
    const dollars = Number(byId("admin-custom-quote").value);
    const body = {
      acceptedDeadline: byId("admin-accepted-deadline").value ? new Date(byId("admin-accepted-deadline").value).toISOString() : "",
      ...(Number.isFinite(dollars) && dollars > 0 ? { customQuoteCents: Math.round(dollars * 100), customQuoteReason: byId("admin-custom-reason").value.trim() } : {}),
    };
    await withPending(button, async () => {
      await api(`/api/platform/admin/orders/${encodeURIComponent(state.currentOrder.order.id)}/accept`, { method: "POST", body });
      await refreshCurrentOrder("Order accepted. The client can now pay the deposit.");
    });
  }

  async function changeStatus(status, control) {
    if (!state.currentOrder?.order?.id) return;
    await withPending(control, async () => {
      await api(`/api/platform/admin/orders/${encodeURIComponent(state.currentOrder.order.id)}/status`, { method: "PATCH", body: { status } });
      await refreshCurrentOrder(`Order moved to ${status}.`);
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
    const form = event.currentTarget;
    const control = form.querySelector('button[type="submit"]');
    const file = byId("admin-deliverable-file").files[0];
    if (!file) return showToast("Choose a deliverable file.", true);
    await withPending(control, async () => {
      const contentBase64 = await readFile(file);
      await api(`/api/platform/admin/orders/${encodeURIComponent(state.currentOrder.order.id)}/deliverables`, {
        method: "POST",
        body: { category: byId("admin-deliverable-category").value, fileName: file.name, mimeType: file.type || "application/octet-stream", contentBase64 },
      });
      form.reset();
      await refreshCurrentOrder("Deliverable uploaded to private storage.");
    });
  }

  async function loadClients() {
    const payload = await api("/api/platform/admin/clients");
    replace("admin-client-rows", payload.clients.map((client) => {
      const row = element("tr");
      row.append(tableCell("Client", client.fullName || client.email || client.userId), tableCell("Orders", client.orderCount), tableCell("Active", client.activeOrderCount), tableCell("Paid", money(client.paidCents)), tableCell("Last order", date(client.lastOrderAt)));
      return row;
    }));
    return payload;
  }

  async function loadMessages() {
    const payload = await api("/api/platform/admin/messages");
    replace("admin-message-list", payload.messages.map((message) => {
      const row = element("li", "dash-list-item");
      const copy = element("div");
      copy.append(element("strong", "", `${message.senderRole || "Client"} - order ${message.requestId || "unknown"}`), element("p", "", message.body || "Message"));
      row.append(copy, element("span", "", date(message.createdAt, true)));
      return row;
    }));
    return payload;
  }

  function paymentRow(payment, earnings = false) {
    const row = element("tr");
    row.append(tableCell("Transaction", payment.providerTransactionId || payment.id), tableCell("Order", payment.requestId || payment.orderId), tableCell("Provider", payment.provider), ...(earnings ? [] : [tableCell("Milestone", payment.milestone || "payment")]), tableCell("Amount", money(payment.amountCents)), ...(earnings ? [] : [tableCell("Status", statusBadge(payment.status))]), tableCell("Date", date(payment.confirmedAt || payment.createdAt, true)));
    return row;
  }

  async function loadPayments() {
    const payload = await api("/api/platform/admin/payments");
    replace("admin-payment-rows", payload.payments.map((payment) => paymentRow(payment)));
    return payload;
  }

  async function loadEarnings() {
    const period = byId("admin-earnings-period").value;
    const payload = await api(`/api/platform/admin/earnings?period=${encodeURIComponent(period)}`);
    const report = payload.earnings;
    const kpis = [["Revenue", money(report.revenueCents)], ["Transactions", report.transactions], ["Outstanding", money(report.outstandingCents)], ["Period", period === "all" ? "All time" : period]];
    replace("admin-earnings-kpis", kpis.map(([label, value]) => {
      const card = element("article", "glass-panel dash-kpi");
      card.append(element("span", "dash-kpi-label", label), element("strong", "dash-kpi-value", value));
      return card;
    }));
    replace("admin-earnings-rows", report.payments.map((payment) => paymentRow(payment, true)));
    return payload;
  }

  async function loadFiles() {
    const payload = await api("/api/platform/admin/files");
    replace("admin-file-rows", payload.files.map((file) => {
      const row = element("tr");
      row.append(tableCell("File", file.fileName), tableCell("Order", file.requestId), tableCell("Category", file.category), tableCell("Size", bytes(file.sizeBytes)), tableCell("Locked", file.deliveryLocked ? "Yes" : "No"), tableCell("Uploaded", date(file.createdAt, true)));
      return row;
    }));
    return payload;
  }

  async function downloadCsv() {
    const params = new URLSearchParams();
    if (byId("admin-order-search").value.trim()) params.set("search", byId("admin-order-search").value.trim());
    if (byId("admin-order-status").value) params.set("status", byId("admin-order-status").value);
    if (byId("admin-order-queue").value) params.set("queue", byId("admin-order-queue").value);
    const headers = state.demoMode ? { "x-demo-role": "admin" } : {};
    const response = await fetch(`/api/platform/admin/exports/orders.csv?${params}`, { credentials: "same-origin", headers });
    if (!response.ok) throw new Error("The order export could not be created.");
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sleek-academia-orders.csv";
    link.click();
    URL.revokeObjectURL(url);
    showToast("Order CSV exported.");
  }

  async function logout() {
    if (!state.demoMode) await api("/api/admin-auth/logout", { method: "POST" });
    sessionStorage.removeItem("sleekAcademia.adminCsrf");
    window.location.replace("/login.html?mode=admin");
  }

  async function showView(viewName) {
    const name = viewCopy[viewName] ? viewName : "overview";
    state.currentView = name;
    byId("admin-page-title").textContent = viewCopy[name][0];
    byId("admin-page-description").textContent = viewCopy[name][1];
    document.querySelectorAll("[data-admin-view]").forEach((view) => { view.hidden = view.dataset.adminView !== name; });
    document.querySelectorAll("[data-view]").forEach((button) => {
      const active = button.dataset.view === name;
      button.classList.toggle("is-active", active);
      if (active) button.setAttribute("aria-current", "page"); else button.removeAttribute("aria-current");
    });
    byId("admin-shell").dataset.drawerOpen = "false";
    try {
      if (name === "overview") await loadOverview();
      if (name === "orders") await loadOrders();
      if (name === "clients") await loadClients();
      if (name === "messages") await loadMessages();
      if (name === "payments") await loadPayments();
      if (name === "earnings") await loadEarnings();
      if (name === "files") await loadFiles();
    } catch (error) { showError(error); }
  }

  function bindEvents() {
    document.addEventListener("click", (event) => {
      const viewButton = event.target.closest("[data-view], [data-open-view]");
      if (viewButton) void showView(viewButton.dataset.view || viewButton.dataset.openView);
      const orderButton = event.target.closest("[data-order-id]");
      if (orderButton) void loadOrder(orderButton.dataset.orderId).catch(showError);
      const shortcut = event.target.closest("[data-queue-shortcut]");
      if (shortcut) {
        const value = shortcut.dataset.queueShortcut;
        const statusSelect = byId("admin-order-status");
        const queueSelect = byId("admin-order-queue");
        const isStatus = Array.from(statusSelect.options).some((option) => option.value === value);
        statusSelect.value = isStatus ? value : "";
        queueSelect.value = value === "Paid" ? "Delivered and Paid" : (isStatus ? "" : value);
        void showView("orders");
      }
      if (event.target.closest("[data-drawer-toggle]")) {
        const shell = byId("admin-shell");
        shell.dataset.drawerOpen = shell.dataset.drawerOpen === "true" ? "false" : "true";
        event.target.closest("[data-drawer-toggle]").setAttribute("aria-expanded", String(shell.dataset.drawerOpen === "true"));
      }
      if (event.target.closest("[data-drawer-close]")) byId("admin-shell").dataset.drawerOpen = "false";
      if (event.target.closest("[data-close-order]")) byId("admin-order-dialog").close();
    });
    byId("admin-clarification-form").addEventListener("submit", (event) => void submitClarification(event).catch((error) => showToast(error.message, true)));
    byId("admin-accept-form").addEventListener("submit", (event) => void acceptOrder(event).catch((error) => showToast(error.message, true)));
    byId("admin-deliverable-form").addEventListener("submit", (event) => void uploadDeliverable(event).catch((error) => showToast(error.message, true)));
    byId("admin-change-status").addEventListener("click", (event) => void changeStatus(byId("admin-next-status").value, event.currentTarget).catch((error) => showToast(error.message, true)));
    byId("admin-decline-order").addEventListener("click", (event) => void changeStatus("Declined", event.currentTarget).catch((error) => showToast(error.message, true)));
    byId("admin-complete-order").addEventListener("click", (event) => void changeStatus("Completed", event.currentTarget).catch((error) => showToast(error.message, true)));
    byId("admin-order-search").addEventListener("input", debounce(() => void loadOrders().catch(showError), 250));
    for (const id of ["admin-order-status", "admin-order-queue", "admin-order-sort"]) byId(id).addEventListener("change", () => void loadOrders().catch(showError));
    byId("admin-earnings-period").addEventListener("change", () => void loadEarnings().catch(showError));
    byId("admin-export-csv").addEventListener("click", () => void downloadCsv().catch((error) => showToast(error.message, true)));
    byId("admin-logout").addEventListener("click", () => void logout().catch((error) => showToast(error.message, true)));
    byId("admin-retry").addEventListener("click", () => window.location.reload());
  }

  function debounce(callback, delay) {
    let timer;
    return (...args) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => callback(...args), delay);
    };
  }

  async function start() {
    bindEvents();
    showLoading(true);
    try {
      await loadSession();
      await loadOrders({ render: false });
      showLoading(false);
      await showView("overview");
    } catch (error) { showError(error); }
  }

  window.addEventListener("DOMContentLoaded", () => { void start(); });
}());
