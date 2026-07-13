(function initializeClientOrderPage() {
  "use strict";

  const state = { config: null, csrfToken: "", orderId: "", payload: null };
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
    replace("client-order-live-region", [toast]);
    window.setTimeout(() => { if (toast.isConnected) toast.remove(); }, 5000);
  }

  function showError(error) {
    byId("client-order-loading").hidden = true;
    byId("client-order-content").hidden = true;
    byId("client-order-error-copy").textContent = error.message || "The order could not be loaded.";
    byId("client-order-error").hidden = false;
  }

  async function api(path, options = {}) {
    const method = options.method || "GET";
    const headers = { Accept: "application/json" };
    if (method !== "GET" && method !== "HEAD") headers["x-csrf-token"] = state.csrfToken;
    let body;
    if (options.body !== undefined) {
      headers["content-type"] = "application/json";
      body = JSON.stringify(options.body);
    }
    const response = await fetch(path, { method, headers, body, credentials: "same-origin" });
    if (response.status === 401) {
      window.location.replace("/login.html");
      throw new Error("Your session has expired.");
    }
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      const error = new Error(payload.error || `Request failed with status ${response.status}.`);
      error.status = response.status;
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
      throw new Error("The secure workspace could not load.");
    }
    state.config = await configResponse.json();
    const session = await sessionResponse.json();
    state.csrfToken = session.csrfToken || "";
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

  function timeline(events) {
    if (!events.length) return element("p", "", "No timeline updates yet.");
    const list = element("ol", "dash-timeline");
    events.forEach((event) => {
      const item = element("li", "dash-timeline-item");
      item.append(element("strong", "", String(event.type || "Activity").replaceAll(".", " ")), element("span", "", date(event.createdAt, true)));
      list.append(item);
    });
    return list;
  }

  function calculation(order) {
    const pricing = order.pricingSnapshot || {};
    if (pricing.calculation) return pricing.calculation;
    if (order.service === "essay" || order.service === "writing") return `${pricing.pages || order.pageCount || 0} pages at ${money(pricing.rateCents || 1500)} per page`;
    if (order.service === "exam") return `${order.examHours || pricing.hours || 0} hours at $150.00 per hour`;
    return pricing.reason || "Custom quote";
  }

  function renderOrder(payload) {
    state.payload = payload;
    const order = payload.order;
    const balance = Math.max(0, (Number(order.quoteCents) || 0) - (Number(order.paidCents) || 0));
    document.title = `${order.title || order.subject || "Order"} | Sleek Academia`;
    replace("client-order-status", [statusBadge(order.status)]);
    byId("client-order-title").textContent = order.title || order.subject || "Order";
    byId("client-order-meta").textContent = `${order.id} · ${order.service || "support"} · deadline ${date(order.acceptedDeadline || order.deadline, true)}`;
    const summary = [["Status", order.status], ["Quote", money(order.quoteCents)], ["Paid", money(order.paidCents)], ["Balance", money(balance)]];
    replace("client-order-summary", summary.map(([label, value]) => {
      const card = element("article", "glass-panel dash-kpi");
      card.append(element("span", "dash-kpi-label", label), element("strong", "dash-kpi-value", value));
      return card;
    }));
    replace("client-order-instructions", [definitionList([["Service", order.service], ["Subject", order.subject], ["Support requested", calculation(order)], ["Instructions", order.description], ["Citation style", order.citationStyle], ["Requested deadline", date(order.deadline, true)]])]);
    replace("client-order-timeline", [timeline(payload.events || [])]);
    replace("client-order-messages", [simpleList(payload.messages || [], (message) => message.senderRole === "student" ? "You" : "Sleek Academia", (message) => `${message.body} · ${date(message.createdAt, true)}`)]);
    const materials = (payload.attachments || []).filter((file) => !new Set(["draft", "final", "ai-report"]).has(file.category));
    replace("client-order-materials", [simpleList(materials, (file) => file.fileName, (file) => `${bytes(file.sizeBytes)} · ${date(file.createdAt, true)}`)]);
    replace("client-order-payments", [simpleList(payload.payments || [], (payment) => `${payment.provider || "Provider"} ${payment.milestone || "payment"}`, (payment) => `${money(payment.amountCents)} · ${payment.status || "pending"} · ${date(payment.confirmedAt || payment.createdAt, true)}`)]);
    replace("client-order-revisions", [simpleList(payload.revisions || [], (revision) => revision.status || "Revision", (revision) => `${revision.instructions || "Revision instructions"} · ${date(revision.createdAt, true)}`)]);
    renderDelivery(payload);
    renderPaymentActions(payload);
    renderRevisionEligibility(payload.revisionEligibility);
    byId("client-order-loading").hidden = true;
    byId("client-order-error").hidden = true;
    byId("client-order-content").hidden = false;
  }

  function renderDelivery(payload) {
    const order = payload.order;
    const deliveries = (payload.attachments || []).filter((file) => new Set(["draft", "final", "ai-report"]).has(file.category));
    const container = element("div", "dash-stack");
    if (!deliveries.length) container.append(element("p", "", "No delivery files yet."));
    deliveries.forEach((file) => {
      const row = element("div", "dash-list-item");
      const copy = element("div");
      copy.append(element("strong", "", file.fileName), element("p", "", `${file.category} · ${bytes(file.sizeBytes)} · ${date(file.createdAt, true)}`));
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

  async function refresh(message) {
    renderOrder(await api(`/api/platform/orders/${encodeURIComponent(state.orderId)}`));
    if (message) showToast(message);
  }

  async function withPending(control, task) {
    const original = control.textContent;
    control.disabled = true;
    control.textContent = "Working...";
    try { return await task(); }
    finally { control.disabled = false; control.textContent = original; }
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("The selected file could not be read."));
      reader.onload = () => resolve(String(reader.result || "").split(",").at(-1) || "");
      reader.readAsDataURL(file);
    });
  }

  async function sendMessage(event) {
    event.preventDefault();
    const body = byId("client-message-body").value.trim();
    if (!body) return;
    await withPending(event.currentTarget.querySelector("button"), async () => {
      await api(`/api/platform/orders/${encodeURIComponent(state.orderId)}/messages`, { method: "POST", body: { body, idempotencyKey: `message:${crypto.randomUUID()}` } });
      byId("client-message-body").value = "";
      await refresh("Message sent.");
    });
  }

  async function uploadMaterial(event) {
    event.preventDefault();
    const file = byId("client-material-file").files[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) return showToast("Files must be 8 MB or smaller.", true);
    await withPending(event.currentTarget.querySelector("button"), async () => {
      await api(`/api/platform/orders/${encodeURIComponent(state.orderId)}/attachments`, { method: "POST", body: { fileName: file.name, mimeType: file.type || "application/octet-stream", contentBase64: await fileToBase64(file) } });
      event.currentTarget.reset();
      await refresh("Material uploaded to private storage.");
    });
  }

  async function requestRevision(event) {
    event.preventDefault();
    const instructions = byId("client-revision-instructions").value.trim();
    if (!instructions) return;
    await withPending(byId("client-revision-submit"), async () => {
      await api(`/api/platform/orders/${encodeURIComponent(state.orderId)}/revisions`, { method: "POST", body: { instructions } });
      byId("client-revision-instructions").value = "";
      await refresh("Included revision requested.");
    });
  }

  async function confirmDemoPayment(control) {
    await withPending(control, async () => {
      await api(`/api/platform/orders/${encodeURIComponent(state.orderId)}/payments/demo-confirm`, { method: "POST", body: {} });
      await refresh("Localhost payment simulation confirmed.");
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
      const intent = await api(`/api/platform/orders/${encodeURIComponent(state.orderId)}/payments/stripe-intent`, { method: "POST", body: {} });
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
        const returnUrl = `${location.origin}/client-order.html?id=${encodeURIComponent(state.orderId)}`;
        const result = await stripe.confirmPayment({ elements, confirmParams: { return_url: returnUrl }, redirect: "if_required" });
        if (result.error) { submit.disabled = false; showToast(result.error.message || "Stripe could not confirm payment.", true); }
        else { showToast("Payment submitted. Waiting for provider confirmation."); window.setTimeout(() => void refresh(), 1800); }
      });
    });
  }

  async function payWithPayPal(control) {
    await withPending(control, async () => {
      const providerOrder = await api(`/api/platform/orders/${encodeURIComponent(state.orderId)}/payments/paypal-order`, { method: "POST", body: {} });
      await loadExternalScript(`https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(state.config.paypalClientId)}&currency=USD`, "paypal-js");
      const mount = element("div");
      byId("client-payment-actions").append(mount);
      await window.paypal.Buttons({
        style: { layout: "horizontal", height: 38, tagline: false },
        createOrder: () => providerOrder.orderId,
        onApprove: async (data) => {
          await api(`/api/platform/orders/${encodeURIComponent(state.orderId)}/payments/paypal-capture`, { method: "POST", body: { orderId: data.orderID } });
          await refresh("PayPal payment confirmed.");
        },
        onError: () => showToast("PayPal could not complete the payment.", true),
      }).render(mount);
    });
  }

  async function downloadAttachment(attachmentId, fileName, control) {
    control.disabled = true;
    try {
      const response = await fetch(`/api/platform/attachments/${encodeURIComponent(attachmentId)}/download`, { credentials: "same-origin" });
      if (response.status === 423) {
        showToast("Locked - pay balance to download", true);
        byId("client-payment-actions").focus();
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
      await refresh("Download ready. Your revision window has been updated.");
    } finally { control.disabled = false; }
  }

  function bindEvents() {
    byId("client-message-form").addEventListener("submit", (event) => void sendMessage(event).catch((error) => showToast(error.message, true)));
    byId("client-material-form").addEventListener("submit", (event) => void uploadMaterial(event).catch((error) => showToast(error.message, true)));
    byId("client-revision-form").addEventListener("submit", (event) => void requestRevision(event).catch((error) => showToast(error.message, true)));
    document.addEventListener("click", (event) => {
      const download = event.target.closest("[data-attachment-id]");
      if (download) void downloadAttachment(download.dataset.attachmentId, download.dataset.fileName, download).catch((error) => showToast(error.message, true));
      const demo = event.target.closest("[data-demo-payment]");
      if (demo) void confirmDemoPayment(demo).catch((error) => showToast(error.message, true));
      const stripe = event.target.closest("[data-stripe-payment]");
      if (stripe) void payWithStripe(stripe).catch((error) => showToast(error.message, true));
      const paypal = event.target.closest("[data-paypal-payment]");
      if (paypal) void payWithPayPal(paypal).catch((error) => showToast(error.message, true));
    });
  }

  async function start() {
    state.orderId = new URLSearchParams(window.location.search).get("id") || "";
    if (!state.orderId) return showError(new Error("Choose an order from your dashboard."));
    bindEvents();
    try {
      await loadSession();
      await refresh();
    } catch (error) { showError(error); }
  }

  window.addEventListener("DOMContentLoaded", () => { void start(); });
}());
