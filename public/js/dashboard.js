(function () {
  const PENDING_KEY = "sleekAcademia.pendingRequest.v2";
  const state = { config: null, session: null, requests: [], selectedId: null, details: null, demoRole: new URLSearchParams(location.search).get("role") === "admin" ? "admin" : "student" };
  const loading = document.getElementById("workspace-loading");
  const errorState = document.getElementById("workspace-error");
  const emptyState = document.getElementById("workspace-empty");
  const ready = document.getElementById("workspace-ready");

  function isLoopback() { return ["localhost", "127.0.0.1", "::1"].includes(location.hostname); }

  async function api(path, options) {
    const input = options || {};
    const headers = new Headers(input.headers || {});
    if (state.config?.demoMode && isLoopback()) headers.set("x-demo-role", state.demoRole);
    if (state.session?.csrfToken && new Set(["POST", "PUT", "PATCH", "DELETE"]).has(String(input.method || "GET").toUpperCase())) {
      headers.set("x-csrf-token", state.session.csrfToken);
    }
    const response = await fetch(`/api/platform${path}`, { ...input, credentials: "same-origin", headers });
    if (response.status === 401) {
      location.replace("/login.html");
      throw new Error("Authentication is required.");
    }
    return response;
  }

  async function json(response) {
    const payload = await response.json().catch(function () { return {}; });
    if (!response.ok) throw new Error(payload.error || "The workspace action failed.");
    return payload;
  }

  function renderLoading() { loading.hidden = false; errorState.hidden = true; emptyState.hidden = true; ready.hidden = true; }
  function renderError(message) { loading.hidden = true; emptyState.hidden = true; ready.hidden = true; errorState.hidden = false; document.getElementById("workspace-error-message").textContent = message; }
  function renderEmpty() { loading.hidden = true; errorState.hidden = true; ready.hidden = true; emptyState.hidden = false; }
  function renderReady() { loading.hidden = true; errorState.hidden = true; emptyState.hidden = true; ready.hidden = false; }

  async function initialize() {
    renderLoading();
    try {
      state.config = await fetch("/api/config", { credentials: "same-origin" }).then(function (response) { return response.json(); });
      if (!state.config.demoMode) await loadClerk(state.config);
      configureDemoSwitch();
      state.session = await json(await api("/session"));
      hydrateIdentity();
      await handoffPendingRequest();
      await loadRequests();
      hydrateProfileForm();
    } catch (error) {
      renderError(error.message || "The workspace could not be opened.");
    }
  }

  function configureDemoSwitch() {
    const button = document.getElementById("demo-role-switch");
    if (!state.config.demoMode || !isLoopback()) return;
    button.classList.add("is-visible");
    button.textContent = state.demoRole === "admin" ? "View as client" : "View as admin";
    button.addEventListener("click", function () {
      const role = state.demoRole === "admin" ? "student" : "admin";
      const url = new URL(location.href);
      url.searchParams.set("role", role === "admin" ? "admin" : "student");
      location.assign(url.toString());
    });
  }

  function hydrateIdentity() {
    const identity = state.session.identity || {};
    const profile = state.session.profile || {};
    document.getElementById("workspace-user-name").textContent = profile.fullName || identity.fullName || "Workspace user";
    document.getElementById("workspace-user-email").textContent = profile.email || identity.email || "";
    document.getElementById("workspace-user-role").textContent = identity.role === "admin" ? "Administrator view" : "Client view";
  }

  async function handoffPendingRequest() {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return;
    let pending;
    try { pending = JSON.parse(raw); } catch { localStorage.removeItem(PENDING_KEY); return; }
    const response = await api("/requests/handoff", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(pending) });
    const payload = await json(response);
    localStorage.removeItem(PENDING_KEY);
    state.selectedId = payload.request.id;
  }

  async function loadRequests() {
    const payload = await json(await api("/requests"));
    state.requests = Array.isArray(payload.requests) ? payload.requests : [];
    if (!state.requests.length) return renderEmpty();
    renderReady();
    document.getElementById("request-count").textContent = `${state.requests.length} total`;
    renderRequestList();
    const queryId = new URLSearchParams(location.search).get("request");
    const preferred = state.selectedId || queryId;
    const selected = state.requests.find(function (request) { return request.id === preferred; }) || state.requests[0];
    await selectRequest(selected.id);
  }

  function renderRequestList() {
    const list = document.getElementById("request-list");
    list.replaceChildren();
    state.requests.forEach(function (request) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "request-item" + (request.id === state.selectedId ? " is-active" : "");
      button.dataset.requestId = request.id;
      const status = document.createElement("span"); status.className = "status-pill"; status.textContent = request.status;
      const title = document.createElement("strong"); title.textContent = request.title || request.subject || "Untitled request";
      const meta = document.createElement("span"); meta.textContent = `${labelService(request.service)} · ${formatDate(request.updatedAt)}`;
      button.append(status, title, meta);
      button.addEventListener("click", function () { void selectRequest(request.id); });
      list.appendChild(button);
    });
  }

  async function selectRequest(requestId) {
    state.selectedId = requestId;
    renderRequestList();
    const detail = document.getElementById("request-detail");
    detail.textContent = "Loading request details...";
    try {
      state.details = await json(await api(`/requests/${encodeURIComponent(requestId)}`));
      renderRequestDetails();
      renderAggregateViews();
    } catch (error) {
      detail.textContent = error.message || "Request details could not be loaded.";
    }
  }

  function bind(container, name, value) {
    const target = container.querySelector(`[data-bind="${name}"]`);
    if (target) target.textContent = value;
  }

  function renderRequestDetails() {
    const root = document.getElementById("request-detail");
    const fragment = document.getElementById("request-detail-template").content.cloneNode(true);
    const request = state.details.request;
    bind(fragment, "status", request.status);
    bind(fragment, "service", labelService(request.service));
    bind(fragment, "deadline", request.deadline ? `Due ${formatDate(request.deadline)}` : "No deadline supplied");
    bind(fragment, "title", request.title || request.subject || "Request");
    bind(fragment, "description", request.description);
    bind(fragment, "quote", money(request.quoteCents));
    bind(fragment, "paid", money(request.paidCents));
    bind(fragment, "remaining", money(Math.max(0, (request.quoteCents || 0) - (request.paidCents || 0))));
    root.replaceChildren(fragment);
    renderEvents(); renderMessages(); renderFiles(); renderPayments(); wireDetailTabs(); wireMessageForm(); wireFileForm(); wireAdminControls();
  }

  function renderEvents() {
    const list = document.getElementById("event-list"); list.replaceChildren();
    const events = state.details.events || [];
    if (!events.length) return appendEmpty(list, "No updates have been recorded yet.");
    events.slice().reverse().forEach(function (event) {
      const row = document.createElement("div"); row.className = "event-row";
      const copy = document.createElement("div"); const title = document.createElement("strong"); const time = document.createElement("span");
      title.textContent = eventLabel(event.type); time.textContent = formatDate(event.createdAt); copy.append(title, time); row.append(copy); list.appendChild(row);
    });
  }

  function renderMessages() {
    const list = document.getElementById("message-list"); list.replaceChildren();
    const identity = state.session.identity || {};
    const messages = state.details.messages || [];
    if (!messages.length) return appendEmpty(list, "No messages yet. Start the request conversation here.");
    messages.forEach(function (message) {
      const item = document.createElement("div"); item.className = "message" + (message.senderId === identity.userId ? " is-mine" : "");
      const sender = document.createElement("strong"); sender.textContent = `${message.senderRole || "team"} · ${formatDate(message.createdAt)}`;
      const body = document.createElement("p"); body.textContent = message.body; item.append(sender, body); list.appendChild(item);
    });
  }

  function renderFiles() {
    const list = document.getElementById("file-list"); list.replaceChildren();
    const files = state.details.attachments || [];
    if (!files.length) return appendEmpty(list, "No files have been added to this request.");
    files.forEach(function (file) {
      const row = document.createElement("div"); row.className = "file-row";
      const copy = document.createElement("div"); const title = document.createElement("strong"); const meta = document.createElement("span");
      title.textContent = file.fileName; meta.textContent = `${labelCategory(file.category)} · ${formatBytes(file.sizeBytes)}`; copy.append(title, meta);
      const button = document.createElement("button"); button.type = "button"; button.className = "ws-button small"; button.textContent = file.deliveryLocked && !isFullyPaid() ? "Locked" : "Download"; button.disabled = file.deliveryLocked && !isFullyPaid();
      button.addEventListener("click", function () { void downloadAttachment(file); }); row.append(copy, button); list.appendChild(row);
    });
  }

  function renderPayments() {
    const list = document.getElementById("payment-list"); list.replaceChildren();
    const payments = state.details.payments || [];
    if (!payments.length) appendEmpty(list, state.details.request.quoteCents ? "No confirmed payments yet." : "A quote has not been added yet.");
    else payments.forEach(function (payment) {
        const row = document.createElement("div"); row.className = "payment-row";
        const copy = document.createElement("div"); const title = document.createElement("strong"); const meta = document.createElement("span");
        title.textContent = `${capitalize(payment.milestone)} payment · ${money(payment.amountCents)}`; meta.textContent = `${capitalize(payment.status)} · ${formatDate(payment.confirmedAt || payment.createdAt)}`; copy.append(title, meta); row.append(copy); list.appendChild(row);
      });
    renderPaymentActions();
  }

  function paymentDue() {
    const request = state.details.request;
    const quote = Number(request.quoteCents) || 0;
    const paid = Number(request.paidCents) || 0;
    if (!quote || paid >= quote) return null;
    const deposit = Math.ceil(quote / 2);
    if (paid < deposit && request.status !== "Deposit Due") return null;
    if (paid >= deposit && request.status !== "Balance Due") return null;
    return paid < deposit
      ? { milestone: "deposit", amountCents: deposit - paid }
      : { milestone: "balance", amountCents: quote - paid };
  }

  function renderPaymentActions() {
    const target = document.getElementById("payment-actions");
    target.replaceChildren();
    const due = paymentDue();
    if (!due) {
      if (state.details.request.quoteCents) appendEmpty(target, "This request is fully paid. Protected delivery is unlocked.");
      return;
    }
    const heading = document.createElement("strong");
    heading.textContent = `${capitalize(due.milestone)} due: ${money(due.amountCents)}`;
    target.appendChild(heading);

    if (state.config.demoMode && isLoopback()) {
      const button = document.createElement("button");
      button.type = "button"; button.className = "ws-button primary small"; button.textContent = `Simulate ${due.milestone} confirmation (localhost)`;
      const output = document.createElement("p"); output.className = "form-hint";
      button.addEventListener("click", async function () {
        button.disabled = true; output.textContent = "Applying simulated provider confirmation...";
        try {
          await json(await api(`/requests/${encodeURIComponent(state.selectedId)}/payments/demo-confirm`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }));
          await loadRequests();
        } catch (error) { output.textContent = error.message; button.disabled = false; }
      });
      target.append(button, output);
      return;
    }

    const providerRow = document.createElement("div"); providerRow.className = "wizard-actions";
    if (state.config.stripePublishableKey) {
      const stripeButton = document.createElement("button"); stripeButton.type = "button"; stripeButton.className = "ws-button primary small"; stripeButton.textContent = "Pay securely by card";
      stripeButton.addEventListener("click", function () { void mountStripePayment(target, stripeButton); });
      providerRow.appendChild(stripeButton);
    }
    if (state.config.paypalClientId) {
      const paypalTarget = document.createElement("div"); paypalTarget.id = "paypal-payment-button"; providerRow.appendChild(paypalTarget); void mountPayPalPayment(paypalTarget);
    }
    if (!providerRow.children.length) appendEmpty(target, "A verified payment provider is not configured yet. Your request and files remain available.");
    else target.appendChild(providerRow);
  }

  async function mountStripePayment(target, trigger) {
    trigger.disabled = true;
    try {
      const intent = await json(await api(`/requests/${encodeURIComponent(state.selectedId)}/payments/stripe-intent`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }));
      await loadExternalScript("https://js.stripe.com/v3/", "stripe-js");
      const stripe = window.Stripe(state.config.stripePublishableKey);
      const elements = stripe.elements({ clientSecret: intent.clientSecret });
      const form = document.createElement("form"); form.className = "inline-form";
      const mount = document.createElement("div"); mount.id = "stripe-payment-element";
      const submit = document.createElement("button"); submit.type = "submit"; submit.className = "ws-button primary small"; submit.textContent = `Confirm ${money(intent.amountCents)}`;
      const output = document.createElement("p"); output.className = "form-hint";
      form.append(mount, submit, output); target.appendChild(form);
      elements.create("payment").mount(mount);
      form.addEventListener("submit", async function (event) {
        event.preventDefault(); submit.disabled = true; output.textContent = "Confirming with Stripe...";
        const result = await stripe.confirmPayment({ elements, confirmParams: { return_url: `${location.origin}/dashboard.html?request=${encodeURIComponent(state.selectedId)}` }, redirect: "if_required" });
        if (result.error) { output.textContent = result.error.message || "Stripe could not confirm payment."; submit.disabled = false; }
        else { output.textContent = "Provider confirmed. Waiting for the verified webhook..."; setTimeout(function () { void loadRequests(); }, 1800); }
      });
    } catch (error) { trigger.disabled = false; appendEmpty(target, error.message); }
  }

  async function mountPayPalPayment(target) {
    try {
      const src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(state.config.paypalClientId)}&currency=USD`;
      await loadExternalScript(src, "paypal-js");
      window.paypal.Buttons({
        style: { layout: "horizontal", height: 36, tagline: false },
        createOrder: async function () {
          const order = await json(await api(`/requests/${encodeURIComponent(state.selectedId)}/payments/paypal-order`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }));
          return order.orderId;
        },
        onApprove: async function (data) {
          await json(await api(`/requests/${encodeURIComponent(state.selectedId)}/payments/paypal-capture`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId: data.orderID }) }));
          await loadRequests();
        },
        onError: function (error) { appendEmpty(target, error.message || "PayPal could not complete the payment."); },
      }).render(target);
    } catch (error) { appendEmpty(target, error.message); }
  }

  function loadExternalScript(src, id) {
    return new Promise(function (resolve, reject) {
      if (document.getElementById(id)) return resolve();
      const script = document.createElement("script"); script.id = id; script.src = src; script.async = true; script.onload = resolve; script.onerror = function () { reject(new Error("Payment provider could not load.")); }; document.head.appendChild(script);
    });
  }

  function wireDetailTabs() {
    document.querySelectorAll("[data-detail-tab]").forEach(function (button) {
      button.addEventListener("click", function () {
        document.querySelectorAll("[data-detail-tab]").forEach(function (item) { item.classList.toggle("is-active", item === button); });
        document.querySelectorAll("[data-detail-panel]").forEach(function (panel) { panel.classList.toggle("is-active", panel.dataset.detailPanel === button.dataset.detailTab); });
      });
    });
  }

  function wireMessageForm() {
    const form = document.getElementById("message-form");
    form.addEventListener("submit", async function (event) {
      event.preventDefault(); const body = form.elements.body.value.trim(); if (!body) return;
      const status = document.getElementById("message-status"); status.textContent = "Sending...";
      try {
        await json(await api(`/requests/${encodeURIComponent(state.selectedId)}/messages`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ body, idempotencyKey: `message:${crypto.randomUUID()}` }) }));
        form.reset(); await selectRequest(state.selectedId); status.textContent = "";
      } catch (error) { status.textContent = error.message; }
    });
  }

  function wireFileForm() {
    const form = document.getElementById("file-upload-form");
    form.addEventListener("submit", function (event) { event.preventDefault(); void uploadFromForm(form, "attachments", "file-status"); });
    const deliverable = document.getElementById("deliverable-form");
    if (state.session.identity.role === "admin") {
      deliverable.hidden = false;
      deliverable.addEventListener("submit", function (event) { event.preventDefault(); void uploadFromForm(deliverable, "deliverables", "deliverable-status"); });
    }
  }

  async function uploadFromForm(form, route, statusId) {
    const file = form.elements.file.files[0]; const status = document.getElementById(statusId); if (!file) return;
    if (file.size > 8 * 1024 * 1024) { status.textContent = "Files must be 8 MB or smaller."; return; }
    status.textContent = "Uploading...";
    try {
      const contentBase64 = await fileToBase64(file);
      const body = { fileName: file.name, mimeType: file.type || "application/octet-stream", contentBase64 };
      if (route === "deliverables") body.category = form.elements.category.value;
      await json(await api(`/requests/${encodeURIComponent(state.selectedId)}/${route}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }));
      form.reset(); await selectRequest(state.selectedId);
    } catch (error) { status.textContent = error.message; }
  }

  function fileToBase64(file) {
    return new Promise(function (resolve, reject) { const reader = new FileReader(); reader.onload = function () { resolve(String(reader.result || "").split(",")[1] || ""); }; reader.onerror = reject; reader.readAsDataURL(file); });
  }

  async function downloadAttachment(file) {
    const response = await api(`/attachments/${encodeURIComponent(file.id)}/download`);
    if (!response.ok) return json(response);
    const type = response.headers.get("content-type") || "";
    if (type.includes("application/json")) { const payload = await response.json(); if (payload.signedUrl) location.assign(payload.signedUrl); return; }
    const blob = await response.blob(); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = file.fileName; link.click(); URL.revokeObjectURL(url);
  }

  function wireAdminControls() {
    const controls = document.getElementById("admin-controls");
    if (state.session.identity.role !== "admin") return;
    controls.classList.add("is-visible");
    document.getElementById("admin-save").addEventListener("click", async function () {
      const quote = Number(document.getElementById("admin-quote").value); const nextStatus = document.getElementById("admin-status").value; const output = document.getElementById("admin-status-message");
      try {
        if (quote > 0) await json(await api(`/requests/${encodeURIComponent(state.selectedId)}/quote`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ quoteCents: Math.round(quote * 100) }) }));
        else if (nextStatus) await json(await api(`/requests/${encodeURIComponent(state.selectedId)}/status`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: nextStatus }) }));
        else throw new Error("Enter a quote or choose a status.");
        await loadRequests(); output.textContent = "Saved.";
      } catch (error) { output.textContent = error.message; }
    });
  }

  function renderAggregateViews() {
    renderAggregate("all-messages", state.details.messages || [], function (message) { return `${capitalize(message.senderRole)}: ${message.body}`; });
    renderAggregate("all-files", state.details.attachments || [], function (file) { return `${file.fileName} · ${labelCategory(file.category)}`; });
    renderAggregate("all-payments", state.details.payments || [], function (payment) { return `${capitalize(payment.milestone)} · ${money(payment.amountCents)} · ${capitalize(payment.status)}`; });
  }

  function renderAggregate(id, items, labeler) {
    const target = document.getElementById(id); target.replaceChildren();
    if (!items.length) return appendEmpty(target, "Nothing recorded for the selected request yet.");
    items.forEach(function (item) { const row = document.createElement("div"); row.className = "file-row"; const strong = document.createElement("strong"); strong.textContent = labeler(item); row.appendChild(strong); target.appendChild(row); });
  }

  function hydrateProfileForm() {
    const profile = state.session.profile || {}; const identity = state.session.identity || {};
    document.getElementById("profile-name").value = profile.fullName || identity.fullName || "";
    document.getElementById("profile-email").value = profile.email || identity.email || "";
    document.getElementById("profile-phone").value = profile.urgentPhone || "";
    document.getElementById("profile-school").value = profile.school || "";
  }

  document.getElementById("profile-form").addEventListener("submit", async function (event) {
    event.preventDefault(); const form = event.currentTarget; const output = document.getElementById("profile-status"); output.textContent = "Saving...";
    try { const payload = await json(await api("/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ urgentPhone: form.elements.urgentPhone.value, school: form.elements.school.value }) })); state.session.profile = payload.profile; output.textContent = "Profile saved."; } catch (error) { output.textContent = error.message; }
  });

  document.querySelectorAll("[data-workspace-view]").forEach(function (button) {
    button.addEventListener("click", function () {
      document.querySelectorAll("[data-workspace-view]").forEach(function (item) { item.classList.toggle("is-active", item === button); });
      document.querySelectorAll("[data-view-panel]").forEach(function (panel) { panel.classList.toggle("is-active", panel.dataset.viewPanel === button.dataset.workspaceView); });
      document.getElementById("workspace-title").textContent = button.textContent.trim();
      document.getElementById("workspace-sidebar").classList.remove("is-open");
    });
  });
  document.getElementById("sidebar-toggle").addEventListener("click", function () { document.getElementById("workspace-sidebar").classList.toggle("is-open"); });
  document.getElementById("workspace-retry").addEventListener("click", initialize);
  document.getElementById("workspace-sign-out").addEventListener("click", async function () { if (window.Clerk) await window.Clerk.signOut({ redirectUrl: "/login.html" }); else location.assign("/login.html"); });

  function appendEmpty(target, message) { const item = document.createElement("p"); item.className = "form-hint"; item.textContent = message; target.appendChild(item); }
  function isFullyPaid() { const request = state.details.request; return Boolean(request.quoteCents && request.paidCents >= request.quoteCents); }
  function money(cents) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format((Number(cents) || 0) / 100); }
  function formatDate(value) { if (!value) return ""; const date = new Date(value); return Number.isNaN(date.valueOf()) ? value : new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date); }
  function formatBytes(bytes) { const value = Number(bytes) || 0; return value < 1024 * 1024 ? `${Math.max(1, Math.round(value / 1024))} KB` : `${(value / 1024 / 1024).toFixed(1)} MB`; }
  function labelService(value) { return { essay: "Essay or coursework", exam: "Exam preparation", tutoring: "Tutoring", other: "Custom support" }[value] || capitalize(value); }
  function labelCategory(value) { return { client: "Client upload", draft: "Draft", final: "Final work", "ai-report": "AI-use report" }[value] || capitalize(value); }
  function eventLabel(value) { return String(value || "Update").replaceAll(".", " ").replaceAll("_", " ").split(" ").map(capitalize).join(" "); }
  function capitalize(value) { const text = String(value || ""); return text ? text[0].toUpperCase() + text.slice(1) : ""; }

  async function loadClerk(config) {
    if (!config.publishableKey || !config.clerkJsUrl) return;
    if (!window.Clerk) await new Promise(function (resolve, reject) { const script = document.createElement("script"); script.async = true; script.crossOrigin = "anonymous"; script.dataset.clerkPublishableKey = config.publishableKey; script.src = config.clerkJsUrl; script.onload = resolve; script.onerror = reject; document.head.appendChild(script); });
    await window.Clerk.load({ signInUrl: config.signInUrl, signUpUrl: config.signUpUrl, afterSignInUrl: "/dashboard.html", afterSignUpUrl: "/dashboard.html" });
  }

  window.addEventListener("DOMContentLoaded", initialize);
})();
