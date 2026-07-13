(function initializeClientDashboard() {
  "use strict";

  const state = {
    config: null,
    session: null,
    csrfToken: "",
    orders: [],
    details: new Map(),
    currentOrderId: null,
    currentView: "overview",
    currentFilter: "",
  };

  const viewCopy = {
    overview: ["Overview", "Your orders, payment milestones, messages, and deliveries."],
    orders: ["My Orders", "Follow each order from submission through revision and completion."],
    messages: ["Messages", "Order-specific conversations with Sleek Academia."],
    files: ["Files", "Materials, drafts, final deliveries, and AI-use reports."],
    payments: ["Payments", "Provider-confirmed payments and receipts."],
    profile: ["Profile", "Contact details used for your active work."],
    help: ["Help", "Payment, delivery, and revision policy."],
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
    const key = String(status || "").toLowerCase().replaceAll(" ", "-");
    const map = { "needs-clarification": "clarification", "deposit-due": "deposit", "in-progress": "progress", "in-revision": "revision", "revision-requested": "revision", "declined": "cancelled" };
    return element("span", `dash-status ${map[key] || key || "cancelled"}`, status || "Unknown");
  }

  function showToast(message, isError = false) {
    const toast = element("div", "dash-toast", message);
    if (isError) toast.setAttribute("role", "alert");
    replace("client-live-region", [toast]);
    window.setTimeout(() => { if (toast.isConnected) toast.remove(); }, 5000);
  }

  function showLoading(visible) {
    byId("client-loading-state").hidden = !visible;
    if (visible) {
      byId("client-error-state").hidden = true;
      byId("client-empty-state").hidden = true;
      document.querySelectorAll("[data-client-panel]").forEach((panel) => { panel.hidden = true; });
    }
  }

  function showError(error) {
    showLoading(false);
    byId("client-error-copy").textContent = error.message || "Try the request again.";
    byId("client-error-state").hidden = false;
  }

  async function api(path, options = {}) {
    const method = options.method || "GET";
    const headers = { Accept: "application/json", ...(options.headers || {}) };
    if (method !== "GET" && method !== "HEAD") headers["x-csrf-token"] = state.csrfToken;
    let body;
    if (options.body !== undefined) {
      headers["content-type"] = "application/json";
      body = JSON.stringify(options.body);
    }
    const response = await fetch(path, { method, headers, body, credentials: "same-origin" });
    if (response.status === 401) {
      window.location.replace("/login.html");
      throw new Error("Your client session has expired.");
    }
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      const error = new Error(payload.error || `Request failed with status ${response.status}.`);
      error.status = response.status;
      error.payload = payload;
      throw error;
    }
    if (response.status === 204) return null;
    return response.json();
  }

  async function loadSession() {
    const [configResponse, sessionResponse] = await Promise.all([
      fetch("/api/config", { credentials: "same-origin" }),
      fetch("/api/platform/session", { credentials: "same-origin" }),
    ]);
    if (!configResponse.ok || !sessionResponse.ok) {
      if (sessionResponse.status === 401) window.location.replace("/login.html");
      throw new Error("The secure client session could not load.");
    }
    state.config = await configResponse.json();
    state.session = await sessionResponse.json();
    state.csrfToken = state.session.csrfToken || "";
    const identity = state.session.identity || {};
    const profile = state.session.profile || {};
    byId("client-user-name").textContent = profile.fullName || identity.fullName || "Sleek Academia client";
    byId("client-user-email").textContent = profile.email || identity.email || "Secure workspace";
    byId("client-profile-name").value = profile.fullName || identity.fullName || "";
    byId("client-profile-email").value = profile.email || identity.email || "";
    byId("client-profile-phone").value = profile.urgentPhone || "";
    byId("client-profile-school").value = profile.school || "";
    return state.session;
  }

  async function loadOrders() {
    const payload = await api("/api/platform/orders");
    state.orders = Array.isArray(payload.orders) ? payload.orders : [];
    byId("client-order-count").textContent = String(state.orders.length);
    renderOverview();
    renderOrders();
    if (!state.orders.length) byId("client-empty-state").hidden = false;
    return payload;
  }

  async function loadOrder(orderId, open = true) {
    const payload = await api(`/api/platform/orders/${encodeURIComponent(orderId)}`);
    state.details.set(orderId, payload);
    state.currentOrderId = orderId;
    renderOrderDetail(payload);
    if (open && !byId("client-order-dialog").open) byId("client-order-dialog").showModal();
    return payload;
  }

  async function loadAllDetails() {
    await Promise.all(state.orders.map(async (order) => {
      if (state.details.has(order.id)) return;
      const payload = await api(`/api/platform/orders/${encodeURIComponent(order.id)}`);
      state.details.set(order.id, payload);
    }));
  }

  function hasStatus(order, status) {
    return status === "In Revision"
      ? new Set(["Revision Requested", "In Revision"]).has(order.status)
      : order.status === status;
  }

  function queueCount(status) {
    return state.orders.filter((order) => hasStatus(order, status)).length;
  }

  function renderOverview() {
    const totalQuote = state.orders.reduce((sum, order) => sum + (Number(order.quoteCents) || 0), 0);
    const totalPaid = state.orders.reduce((sum, order) => sum + (Number(order.paidCents) || 0), 0);
    const delivered = state.orders.filter((order) => order.status === "Delivered").length;
    const kpis = [["All orders", state.orders.length, "Every submitted order"], ["In progress", queueCount("In Progress"), "Active work"], ["Delivered", delivered, "Available or payment locked"], ["Outstanding", money(Math.max(0, totalQuote - totalPaid)), "Across accepted orders"]];
    replace("client-kpis", kpis.map(([label, value, meta]) => {
      const card = element("article", "glass-panel dash-kpi");
      card.append(element("span", "dash-kpi-label", label), element("strong", "dash-kpi-value", value), element("span", "dash-kpi-meta", meta));
      return card;
    }));
    const statuses = ["Available", "Needs Clarification", "Deposit Due", "In Progress", "Delivered", "In Revision", "Completed", "Cancelled"];
    replace("client-overview-queues", statuses.map((status) => {
      const button = element("button", "dash-tab", `${status} ${queueCount(status)}`);
      button.type = "button";
      button.dataset.clientQueue = status;
      return button;
    }));
    const recent = state.orders.slice().sort((a, b) => String(b.updatedAt || b.createdAt || "").localeCompare(String(a.updatedAt || a.createdAt || ""))).slice(0, 6);
    replace("client-recent-orders", recent.map((order) => {
      const row = element("li", "dash-list-item");
      const copy = element("div");
      copy.append(element("strong", "", order.title || order.subject || order.id), element("p", "", `${order.status} - updated ${date(order.updatedAt || order.createdAt, true)}`));
      const button = element("button", "dash-button", "Open");
      button.type = "button";
      button.dataset.clientOrderId = order.id;
      row.append(copy, button);
      return row;
    }));
  }

  function calculation(order) {
    const pricing = order.pricingSnapshot || {};
    if (pricing.calculation) return pricing.calculation;
    if (order.service === "essay" || order.service === "writing") {
      const pages = Number(pricing.pages || order.pageCount) || 0;
      const rate = Number(pricing.rateCents) || 1500;
      return `${pages} pages at ${money(rate)} per page`;
    }
    if (order.service === "exam") return `${order.examHours || pricing.hours || 0} hours at $150.00 per hour`;
    return pricing.reason || "Custom quote";
  }

  function renderOrders() {
    const orders = state.currentFilter ? state.orders.filter((order) => hasStatus(order, state.currentFilter)) : state.orders;
    replace("client-order-grid", orders.map((order) => {
      const card = element("article", "glass-panel glass-panel-inner dash-stack");
      const heading = element("div");
      heading.append(statusBadge(order.status), element("h3", "", order.title || order.subject || "Order"), element("p", "", calculation(order)));
      const list = element("div", "dash-stack");
      [["Service", order.service], ["Deadline", date(order.acceptedDeadline || order.deadline)], ["Quote", money(order.quoteCents)], ["Paid", money(order.paidCents)], ["Balance", money(Math.max(0, (Number(order.quoteCents) || 0) - (Number(order.paidCents) || 0)))], ["Latest update", date(order.updatedAt || order.createdAt, true)]].forEach(([label, value]) => {
        const row = element("div", "dash-list-item");
        row.append(element("strong", "", label), element("span", "", value));
        list.append(row);
      });
      const button = element("button", "dash-button primary", "Open order");
      button.type = "button";
      button.dataset.clientOrderId = order.id;
      card.append(heading, list, button);
      return card;
    }));
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

  function renderOrderDetail(payload) {
    const order = payload.order;
    const balance = Math.max(0, (Number(order.quoteCents) || 0) - (Number(order.paidCents) || 0));
    byId("client-order-dialog-title").textContent = order.title || order.subject || "Order details";
    byId("client-order-dialog-meta").textContent = `${order.id} - ${order.status} - ${date(order.acceptedDeadline || order.deadline, true)}`;
    const summary = [["Status", order.status], ["Quote", money(order.quoteCents)], ["Paid", money(order.paidCents)], ["Balance", money(balance)]];
    replace("client-order-summary", summary.map(([label, value]) => {
      const card = element("article", "glass-panel dash-kpi");
      card.append(element("span", "dash-kpi-label", label), element("strong", "dash-kpi-value", value));
      return card;
    }));
    replace("client-order-instructions", [simpleList([
      { label: "Service", value: order.service }, { label: "Calculation", value: calculation(order) }, { label: "Subject", value: order.subject },
      { label: "Instructions", value: order.description }, { label: "Citation style", value: order.citationStyle || "Not supplied" },
    ], (item) => item.label, (item) => item.value)]);
    replace("client-order-timeline", [renderTimeline(payload.events || [])]);
    replace("client-order-messages", [simpleList(payload.messages || [], (message) => message.senderRole === "student" ? "You" : "Sleek Academia", (message) => `${message.body} - ${date(message.createdAt, true)}`)]);
    const materials = (payload.attachments || []).filter((file) => !new Set(["draft", "final", "ai-report"]).has(file.category));
    replace("client-order-materials", [simpleList(materials, (file) => file.fileName, (file) => `${bytes(file.sizeBytes)} - ${date(file.createdAt, true)}`)]);
    replace("client-order-payments", [simpleList(payload.payments || [], (payment) => `${payment.provider || "Provider"} ${payment.milestone || "payment"}`, (payment) => `${money(payment.amountCents)} - ${payment.status || "pending"} - ${date(payment.confirmedAt || payment.createdAt, true)}`)]);
    renderPaymentActions(payload);
    renderDelivery(payload);
    replace("client-order-revisions", [simpleList(payload.revisions || [], (revision) => revision.status || "Revision", (revision) => `${revision.instructions || "Revision instructions"} - ${date(revision.createdAt, true)}`)]);
    renderRevisionEligibility(payload.revisionEligibility);
  }

  function renderTimeline(events) {
    if (!events.length) return element("p", "", "No timeline updates yet.");
    const list = element("ol", "dash-timeline");
    events.forEach((event) => {
      const item = element("li", "dash-timeline-item");
      item.append(element("strong", "", String(event.type || "Activity").replaceAll(".", " ")), element("span", "", date(event.createdAt, true)));
      list.append(item);
    });
    return list;
  }

  function renderDelivery(payload) {
    const order = payload.order;
    const deliveries = (payload.attachments || []).filter((file) => new Set(["draft", "final", "ai-report"]).has(file.category));
    const container = element("div", "dash-stack");
    if (!deliveries.length) container.append(element("p", "", "No delivery files yet."));
    deliveries.forEach((file) => {
      const row = element("div", "dash-list-item");
      const copy = element("div");
      copy.append(element("strong", "", file.fileName), element("p", "", `${file.category} - ${bytes(file.sizeBytes)} - ${date(file.createdAt, true)}`));
      const locked = file.deliveryLocked && Number(order.paidCents) < Number(order.quoteCents);
      const button = element("button", locked ? "dash-button" : "dash-button primary", locked ? "Locked - pay balance to download" : "Download");
      button.type = "button";
      button.dataset.attachmentId = file.id;
      button.dataset.fileName = file.fileName;
      button.disabled = locked;
      row.append(copy, button);
      container.append(row);
    });
    replace("client-order-deliveries", [container]);
    byId("client-delivery-lock-copy").hidden = !deliveries.some((file) => file.deliveryLocked && Number(order.paidCents) < Number(order.quoteCents));
  }

  function renderRevisionEligibility(eligibility) {
    const button = byId("client-revision-submit");
    const policy = byId("client-revision-policy");
    button.disabled = !eligibility?.eligible;
    if (eligibility?.eligible) policy.textContent = `Included revision available through ${date(eligibility.expiresAt, true)}.`;
    else if (eligibility?.reason === "not-started") policy.textContent = "The seven-day revision window starts after the first paid download.";
    else if (eligibility?.reason === "included-revision-used") policy.textContent = "The included revision has already been used. Additional work can be quoted separately.";
    else if (eligibility?.reason === "window-expired") policy.textContent = "The included revision window has expired. Additional work can be quoted separately.";
    else policy.textContent = "The included revision is not available for this order.";
  }

  function dueFor(order) {
    const quote = Number(order.quoteCents) || 0;
    const paid = Number(order.paidCents) || 0;
    if (!quote || paid >= quote) return null;
    if (order.status === "Deposit Due") return { milestone: "deposit", cents: Math.max(0, (order.pricingSnapshot?.depositCents || Math.ceil(quote / 2)) - paid) };
    if (order.status === "Delivered") return { milestone: "balance", cents: quote - paid };
    return null;
  }

  function renderPaymentActions(payload) {
    const target = byId("client-payment-actions");
    target.replaceChildren();
    const due = dueFor(payload.order);
    if (!due) {
      target.append(element("p", "", Number(payload.order.paidCents) >= Number(payload.order.quoteCents) && Number(payload.order.quoteCents) > 0 ? "This order is fully paid." : "No payment is due at this stage."));
      return;
    }
    target.append(element("strong", "", `${due.milestone === "deposit" ? "Deposit" : "Balance"} due: ${money(due.cents)}`));
    const actions = element("div", "dash-header-actions");
    if (state.config.demoMode) {
      const demo = element("button", "dash-button primary", `Confirm ${due.milestone} in localhost demo`);
      demo.type = "button";
      demo.dataset.demoPayment = "true";
      actions.append(demo);
    } else {
      if (state.config.stripePublishableKey) {
        const stripe = element("button", "dash-button primary", "Pay by card");
        stripe.type = "button";
        stripe.dataset.stripePayment = "true";
        actions.append(stripe);
      }
      if (state.config.paypalClientId) {
        const paypal = element("button", "dash-button", "Pay with PayPal");
        paypal.type = "button";
        paypal.dataset.paypalPayment = "true";
        actions.append(paypal);
      }
    }
    target.append(actions);
  }

  async function sendMessage(event) {
    event.preventDefault();
    const body = byId("client-message-body").value.trim();
    if (!body) return;
    const button = event.currentTarget.querySelector("button");
    await withPending(button, async () => {
      await api(`/api/platform/orders/${encodeURIComponent(state.currentOrderId)}/messages`, { method: "POST", body: { body, idempotencyKey: `message:${crypto.randomUUID()}` } });
      byId("client-message-body").value = "";
      await refreshOrder("Message sent.");
    });
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("The selected file could not be read."));
      reader.onload = () => resolve(String(reader.result || "").split(",").at(-1) || "");
      reader.readAsDataURL(file);
    });
  }

  async function uploadMaterial(event) {
    event.preventDefault();
    const file = byId("client-material-file").files[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) return showToast("Files must be 8 MB or smaller.", true);
    const button = event.currentTarget.querySelector("button");
    await withPending(button, async () => {
      await api(`/api/platform/orders/${encodeURIComponent(state.currentOrderId)}/attachments`, { method: "POST", body: { fileName: file.name, mimeType: file.type || "application/octet-stream", contentBase64: await fileToBase64(file) } });
      event.currentTarget.reset();
      await refreshOrder("Material uploaded to private storage.");
    });
  }

  function loadExternalScript(src, id) {
    return new Promise((resolve, reject) => {
      if (document.getElementById(id)) return resolve();
      const script = document.createElement("script");
      script.id = id;
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error("The payment provider could not load."));
      document.head.append(script);
    });
  }

  async function payWithStripe(control) {
    await withPending(control, async () => {
      const intent = await api(`/api/platform/orders/${encodeURIComponent(state.currentOrderId)}/payments/stripe-intent`, { method: "POST", body: {} });
      await loadExternalScript("https://js.stripe.com/v3/", "stripe-js");
      const stripe = window.Stripe(state.config.stripePublishableKey);
      const elements = stripe.elements({ clientSecret: intent.clientSecret });
      const form = element("form", "dash-stack");
      const mount = element("div");
      const submit = element("button", "dash-button primary", `Confirm ${money(intent.amountCents)}`);
      submit.type = "submit";
      form.append(mount, submit);
      byId("client-payment-actions").append(form);
      elements.create("payment").mount(mount);
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        submit.disabled = true;
        const result = await stripe.confirmPayment({ elements, confirmParams: { return_url: `${location.origin}/dashboard.html?order=${encodeURIComponent(state.currentOrderId)}` }, redirect: "if_required" });
        if (result.error) { submit.disabled = false; showToast(result.error.message || "Stripe could not confirm payment.", true); }
        else { showToast("Payment submitted. Waiting for provider confirmation."); window.setTimeout(() => void refreshOrder(), 1800); }
      });
    });
  }

  async function payWithPayPal(control) {
    await withPending(control, async () => {
      const providerOrder = await api(`/api/platform/orders/${encodeURIComponent(state.currentOrderId)}/payments/paypal-order`, { method: "POST", body: {} });
      await loadExternalScript(`https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(state.config.paypalClientId)}&currency=USD`, "paypal-js");
      const mount = element("div");
      byId("client-payment-actions").append(mount);
      await window.paypal.Buttons({
        style: { layout: "horizontal", height: 38, tagline: false },
        createOrder: () => providerOrder.orderId,
        onApprove: async (data) => {
          await api(`/api/platform/orders/${encodeURIComponent(state.currentOrderId)}/payments/paypal-capture`, { method: "POST", body: { orderId: data.orderID } });
          await refreshOrder("PayPal payment confirmed.");
        },
        onError: () => showToast("PayPal could not complete the payment.", true),
      }).render(mount);
    });
  }

  async function confirmDemoPayment(control) {
    await withPending(control, async () => {
      await api(`/api/platform/orders/${encodeURIComponent(state.currentOrderId)}/payments/demo-confirm`, { method: "POST", body: {} });
      await refreshOrder("Localhost payment simulation confirmed.");
    });
  }

  async function downloadAttachment(attachmentId, fileName, control) {
    control.disabled = true;
    try {
      const response = await fetch(`/api/platform/attachments/${encodeURIComponent(attachmentId)}/download`, { credentials: "same-origin" });
      if (response.status === 423) {
        showToast("Locked - pay balance to download", true);
        byId("client-payment-actions").focus({ preventScroll: false });
        return;
      }
      if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || "The file could not be downloaded.");
      const type = response.headers.get("content-type") || "";
      if (type.includes("application/json")) {
        const payload = await response.json();
        if (payload.signedUrl) window.location.assign(payload.signedUrl);
      } else {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
      }
      await refreshOrder("Download ready. Your revision window has been updated.");
    } finally { control.disabled = false; }
  }

  async function requestRevision(event) {
    event.preventDefault();
    const instructions = byId("client-revision-instructions").value.trim();
    if (!instructions) return;
    const button = byId("client-revision-submit");
    await withPending(button, async () => {
      await api(`/api/platform/orders/${encodeURIComponent(state.currentOrderId)}/revisions`, { method: "POST", body: { instructions } });
      byId("client-revision-instructions").value = "";
      await refreshOrder("Included revision requested.");
    });
  }

  async function saveProfile(event) {
    event.preventDefault();
    const button = event.currentTarget.querySelector("button");
    await withPending(button, async () => {
      const payload = await api("/api/platform/profile", { method: "PATCH", body: { urgentPhone: byId("client-profile-phone").value.trim(), school: byId("client-profile-school").value.trim() } });
      state.session.profile = payload.profile;
      showToast("Profile saved.");
    });
  }

  async function logout() {
    window.location.assign("/logout");
  }

  async function refreshOrder(message) {
    state.details.delete(state.currentOrderId);
    await loadOrders();
    await loadOrder(state.currentOrderId);
    if (message) showToast(message);
  }

  async function renderAggregateViews(viewName) {
    await loadAllDetails();
    const details = [...state.details.values()];
    if (viewName === "messages") {
      const messages = details.flatMap((detail) => (detail.messages || []).map((message) => ({ ...message, order: detail.order })));
      replace("client-all-messages", [simpleList(messages.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))), (message) => `${message.senderRole === "student" ? "You" : "Sleek Academia"} - ${message.order.title || message.order.id}`, (message) => `${message.body} - ${date(message.createdAt, true)}`)]);
    }
    if (viewName === "files") {
      const files = details.flatMap((detail) => (detail.attachments || []).map((file) => ({ ...file, order: detail.order })));
      replace("client-all-files", [simpleList(files, (file) => file.fileName, (file) => `${file.order.title || file.order.id} - ${file.category} - ${bytes(file.sizeBytes)}${file.deliveryLocked && Number(file.order.paidCents) < Number(file.order.quoteCents) ? " - Locked - pay balance to download" : ""}`)]);
    }
    if (viewName === "payments") {
      const payments = details.flatMap((detail) => (detail.payments || []).map((payment) => ({ ...payment, order: detail.order })));
      replace("client-payment-rows", payments.map((payment) => {
        const row = element("tr");
        [["Receipt", payment.providerTransactionId || payment.id], ["Order", payment.order.title || payment.order.id], ["Provider", payment.provider], ["Milestone", payment.milestone], ["Amount", money(payment.amountCents)], ["Status", payment.status], ["Date", date(payment.confirmedAt || payment.createdAt, true)]].forEach(([label, value]) => {
          const cell = element("td", "", value);
          cell.dataset.label = label;
          row.append(cell);
        });
        return row;
      }));
    }
  }

  async function showView(viewName) {
    const name = viewCopy[viewName] ? viewName : "overview";
    state.currentView = name;
    byId("client-page-title").textContent = viewCopy[name][0];
    byId("client-page-description").textContent = viewCopy[name][1];
    document.querySelectorAll("[data-client-panel]").forEach((panel) => { panel.hidden = panel.dataset.clientPanel !== name; });
    document.querySelectorAll("[data-client-view]").forEach((button) => {
      const active = button.dataset.clientView === name;
      button.classList.toggle("is-active", active);
      if (active) button.setAttribute("aria-current", "page"); else button.removeAttribute("aria-current");
    });
    byId("client-shell").dataset.drawerOpen = "false";
    if (new Set(["messages", "files", "payments"]).has(name)) {
      try { await renderAggregateViews(name); } catch (error) { showError(error); }
    }
  }

  async function withPending(control, task) {
    const original = control.textContent;
    control.disabled = true;
    control.textContent = "Working...";
    try { return await task(); }
    finally { control.disabled = false; control.textContent = original; }
  }

  function bindEvents() {
    document.addEventListener("click", (event) => {
      const view = event.target.closest("[data-client-view], [data-open-client-view]");
      if (view) void showView(view.dataset.clientView || view.dataset.openClientView);
      const order = event.target.closest("[data-client-order-id]");
      if (order) void loadOrder(order.dataset.clientOrderId).catch(showError);
      const filter = event.target.closest("[data-order-filter]");
      if (filter) {
        state.currentFilter = filter.dataset.orderFilter;
        document.querySelectorAll("[data-order-filter]").forEach((button) => button.classList.toggle("is-active", button === filter));
        renderOrders();
      }
      const queue = event.target.closest("[data-client-queue]");
      if (queue) {
        state.currentFilter = queue.dataset.clientQueue;
        void showView("orders").then(renderOrders);
      }
      if (event.target.closest("[data-drawer-toggle]")) {
        const shell = byId("client-shell");
        shell.dataset.drawerOpen = shell.dataset.drawerOpen === "true" ? "false" : "true";
        event.target.closest("[data-drawer-toggle]").setAttribute("aria-expanded", String(shell.dataset.drawerOpen === "true"));
      }
      if (event.target.closest("[data-drawer-close]")) byId("client-shell").dataset.drawerOpen = "false";
      if (event.target.closest("[data-close-client-order]")) byId("client-order-dialog").close();
      const download = event.target.closest("[data-attachment-id]");
      if (download) void downloadAttachment(download.dataset.attachmentId, download.dataset.fileName, download).catch((error) => showToast(error.message, true));
      const stripe = event.target.closest("[data-stripe-payment]");
      if (stripe) void payWithStripe(stripe).catch((error) => showToast(error.message, true));
      const paypal = event.target.closest("[data-paypal-payment]");
      if (paypal) void payWithPayPal(paypal).catch((error) => showToast(error.message, true));
      const demo = event.target.closest("[data-demo-payment]");
      if (demo) void confirmDemoPayment(demo).catch((error) => showToast(error.message, true));
    });
    byId("client-message-form").addEventListener("submit", (event) => void sendMessage(event).catch((error) => showToast(error.message, true)));
    byId("client-material-form").addEventListener("submit", (event) => void uploadMaterial(event).catch((error) => showToast(error.message, true)));
    byId("client-revision-form").addEventListener("submit", (event) => void requestRevision(event).catch((error) => showToast(error.message, true)));
    byId("client-profile-form").addEventListener("submit", (event) => void saveProfile(event).catch((error) => showToast(error.message, true)));
    byId("client-logout").addEventListener("click", () => void logout());
    byId("client-retry").addEventListener("click", () => window.location.reload());
  }

  async function start() {
    bindEvents();
    showLoading(true);
    try {
      await loadSession();
      await loadOrders();
      showLoading(false);
      await showView("overview");
      const requested = new URLSearchParams(window.location.search).get("order");
      if (requested && state.orders.some((order) => order.id === requested)) await loadOrder(requested);
    } catch (error) { showError(error); }
  }

  window.addEventListener("DOMContentLoaded", () => { void start(); });
}());
