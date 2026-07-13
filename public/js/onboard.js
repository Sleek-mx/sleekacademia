(function () {
  const PENDING_KEY = "sleekAcademia.pendingRequest.v2";
  const form = document.getElementById("request-wizard");
  if (!form) return;

  const steps = Array.from(document.querySelectorAll("[data-wizard-step]"));
  const progress = Array.from(document.querySelectorAll(".wizard-progress span"));
  const backButton = document.getElementById("wizard-back");
  const nextButton = document.getElementById("wizard-next");
  const status = document.getElementById("wizard-status");
  const review = document.getElementById("request-review");
  const serviceInput = form.elements.service;
  const initialFiles = document.getElementById("initial-files");
  const writingUnit = document.getElementById("writing-unit");
  const estimateValue = document.getElementById("order-estimate-value");
  let currentStep = 0;
  let authMounted = false;
  let idempotencyKey = createIdempotencyKey();

  function createIdempotencyKey() {
    return `request:${crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36)}`;
  }

  function selectedService() {
    return String(serviceInput.value || "");
  }

  function chooseService(service) {
    serviceInput.value = service;
    document.querySelectorAll("[data-service]").forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.dataset.service === service));
    });
    document.querySelectorAll("[data-service-fields]").forEach(function (group) {
      group.classList.toggle("is-visible", group.dataset.serviceFields === service);
    });
    clearError("service");
    updateEstimate();
  }

  function showStep(index) {
    currentStep = Math.max(0, Math.min(index, steps.length - 1));
    steps.forEach(function (step, stepIndex) { step.classList.toggle("is-active", stepIndex === currentStep); });
    progress.forEach(function (item, stepIndex) { item.classList.toggle("is-active", stepIndex <= currentStep); });
    backButton.disabled = currentStep === 0;
    nextButton.hidden = currentStep === steps.length - 1;
    if (currentStep === steps.length - 1) {
      const pending = persistPendingRequest();
      renderReview(pending);
      if (!authMounted) {
        authMounted = true;
        void continueSecurely(pending);
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function setError(field, message) {
    const target = document.querySelector(`[data-error-for="${field}"]`);
    if (target) target.textContent = message;
  }

  function clearError(field) { setError(field, ""); }

  function validateStep(index) {
    if (index === 0 && !selectedService()) {
      setError("service", "Choose the support type that fits best.");
      return false;
    }
    if (index === 1) {
      const subject = form.elements.subject.value.trim();
      const description = form.elements.description.value.trim();
      clearError("subject"); clearError("description");
      if (!subject) setError("subject", "Add the subject or course.");
      if (!description) setError("description", "Tell us what you need help with.");
      if (selectedService() === "essay") {
        const units = writingUnit.value === "words" ? Number(formValue("wordCount")) : Number(formValue("pageCount"));
        if (!Number.isSafeInteger(units) || units < 1) setError("description", "Add a positive whole page or word count.");
        return Boolean(subject && description && Number.isSafeInteger(units) && units > 0);
      }
      if (selectedService() === "exam") {
        const hours = Number(formValue("examHours"));
        if (!Number.isSafeInteger(hours) || hours < 1) setError("description", "Add at least one whole assistance hour.");
        return Boolean(subject && description && Number.isSafeInteger(hours) && hours > 0);
      }
      return Boolean(subject && description);
    }
    if (index === 2) {
      const name = form.elements.name.value.trim();
      const email = form.elements.email.value.trim();
      clearError("name"); clearError("email");
      if (!name) setError("name", "Add your full name.");
      if (!/^\S+@\S+\.\S+$/.test(email)) setError("email", "Enter a valid email address.");
      return Boolean(name && /^\S+@\S+\.\S+$/.test(email));
    }
    return true;
  }

  function formValue(name) {
    const field = form.elements[name];
    return field && typeof field.value === "string" ? field.value.trim() : "";
  }

  function buildPendingRequest() {
    const tutoringAlias = document.querySelector('[data-alias="assistanceType"]');
    const assistanceType = selectedService() === "tutoring" ? tutoringAlias.value.trim() : formValue("assistanceType");
    const files = Array.from(initialFiles.files || []).map(function (file) {
      return { fileName: file.name, mimeType: file.type, sizeBytes: file.size };
    });
    return {
      idempotencyKey,
      service: selectedService(),
      subject: formValue("subject"),
      title: formValue("title"),
      description: formValue("description"),
      deadline: formValue("deadline"),
      citationStyle: selectedService() === "essay" ? formValue("citationStyle") : "",
      pageCount: selectedService() === "essay" && writingUnit.value === "pages" ? formValue("pageCount") : "",
      wordCount: selectedService() === "essay" && writingUnit.value === "words" ? formValue("wordCount") : "",
      urgency: selectedService() === "essay" && form.elements.urgency.checked ? "six-hour" : "standard",
      examName: selectedService() === "exam" ? formValue("examName") : "",
      examDate: selectedService() === "exam" ? formValue("examDate") : "",
      examHours: selectedService() === "exam" ? formValue("examHours") : "",
      attemptStatus: selectedService() === "exam" ? formValue("attemptStatus") : "",
      assistanceType,
      name: formValue("name"),
      email: formValue("email"),
      urgentPhone: formValue("urgentPhone"),
      school: formValue("school"),
      initialAttachments: files,
      savedAt: new Date().toISOString(),
    };
  }

  function persistPendingRequest() {
    const pending = buildPendingRequest();
    localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
    return pending;
  }

  function escapeHtml(value) {
    return String(value || "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }

  function serviceLabel(service) {
    return { essay: "Essay or coursework", exam: "Exam preparation", tutoring: "Personal tutoring", other: "Custom support" }[service] || service;
  }

  function estimateText() {
    if (selectedService() === "essay") {
      const words = Number(formValue("wordCount"));
      const pages = writingUnit.value === "words" ? Math.ceil(words / 275) : Number(formValue("pageCount"));
      if (!Number.isSafeInteger(pages) || pages < 1) return "Add a positive whole page or word count to preview the writing estimate.";
      const rateCents = form.elements.urgency.checked ? 1650 : 1500;
      return `${pages} ${pages === 1 ? "page" : "pages"} × $${(rateCents / 100).toFixed(2)} = $${((pages * rateCents) / 100).toFixed(2)}`;
    }
    if (selectedService() === "exam") {
      const hours = Number(formValue("examHours"));
      if (!Number.isSafeInteger(hours) || hours < 1) return "Add whole assistance hours to preview the exam-support estimate.";
      const totalCents = hours * 15000;
      return `${hours} ${hours === 1 ? "hour" : "hours"} × $150.00 = $${(totalCents / 100).toFixed(2)}`;
    }
    if (new Set(["tutoring", "other"]).has(selectedService())) return "MCX will provide a custom quote after reviewing the complete scope and materials.";
    return "Choose a service and units to preview the server-calculated rate.";
  }

  function updateEstimate() {
    if (estimateValue) estimateValue.textContent = estimateText();
  }

  function renderReview(pending) {
    const details = [
      ["Support type", serviceLabel(pending.service)],
      ["Subject", pending.subject],
      ["Request", pending.title || pending.description],
      ["Deadline", pending.deadline || "Not specified"],
      ["Informational estimate", estimateText()],
      ["Contact", `${pending.name} · ${pending.email}`],
      ["Files", pending.initialAttachments.length ? pending.initialAttachments.map(function (file) { return file.fileName; }).join(", ") : "None added"],
    ];
    review.innerHTML = details.map(function (item) {
      return `<div class="review-row"><span>${escapeHtml(item[0])}</span><strong>${escapeHtml(item[1])}</strong></div>`;
    }).join("");
  }

  async function continueSecurely(pending) {
    status.textContent = "Checking the secure workspace...";
    try {
      const response = await fetch("/api/config", { credentials: "same-origin" });
      const config = await response.json();
      if (config.demoMode) {
        status.textContent = "Local demo mode is active. Creating your order...";
        const order = await handoffPendingRequest(pending);
        await uploadCurrentFiles(order.id);
        localStorage.removeItem(PENDING_KEY);
        window.location.assign(`/dashboard.html?order=${encodeURIComponent(order.id)}`);
        return;
      }
      if (!config.publishableKey || !config.clerkJsUrl) throw new Error("Secure sign up is not configured yet.");
      await loadClerkScript(config.clerkJsUrl, config.publishableKey);
      await window.Clerk.load({ signInUrl: config.signInUrl, signUpUrl: "/onboard.html", afterSignInUrl: "/dashboard.html", afterSignUpUrl: "/dashboard.html" });
      if (window.Clerk.isSignedIn) {
        const order = await handoffPendingRequest(pending);
        localStorage.removeItem(PENDING_KEY);
        window.location.assign(`/dashboard.html?order=${encodeURIComponent(order.id)}`);
        return;
      }
      window.Clerk.mountSignUp(document.getElementById("clerk-onboard-sign-up"), {
        signInUrl: "/login.html",
        afterSignUpUrl: "/dashboard.html",
        afterSignInUrl: "/dashboard.html",
        appearance: { variables: { colorPrimary: "#6f3ff5", borderRadius: "0.8rem" } },
      });
      status.textContent = "Create your secure account to send this request to the workspace.";
    } catch (error) {
      status.textContent = error.message || "The secure workspace could not be reached.";
    }
  }

  async function handoffPendingRequest(pending) {
    const csrfToken = await getCsrfToken();
    const response = await fetch("/api/platform/orders/handoff", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
      body: JSON.stringify(pending),
    });
    const payload = await response.json().catch(function () { return {}; });
    if (!response.ok) throw new Error(payload.error || "The order could not be created.");
    return payload.order;
  }

  async function getCsrfToken() {
    const response = await fetch("/api/security/csrf", { credentials: "same-origin" });
    const payload = await response.json();
    return payload.csrfToken || "";
  }

  async function uploadCurrentFiles(orderId) {
    const csrfToken = await getCsrfToken();
    for (const file of Array.from(initialFiles.files || [])) {
      if (!file.size || file.size > 8 * 1024 * 1024) continue;
      const contentBase64 = await fileToBase64(file);
      await fetch(`/api/platform/orders/${encodeURIComponent(orderId)}/attachments`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
        body: JSON.stringify({ fileName: file.name, mimeType: file.type, contentBase64 }),
      });
    }
  }

  function fileToBase64(file) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onload = function () { resolve(String(reader.result || "").split(",")[1] || ""); };
      reader.onerror = function () { reject(new Error("A selected file could not be read.")); };
      reader.readAsDataURL(file);
    });
  }

  function loadClerkScript(src, publishableKey) {
    return new Promise(function (resolve, reject) {
      if (window.Clerk) return resolve();
      const script = document.createElement("script");
      script.async = true;
      script.crossOrigin = "anonymous";
      script.dataset.clerkPublishableKey = publishableKey;
      script.src = src;
      script.onload = resolve;
      script.onerror = function () { reject(new Error("Secure sign up could not load.")); };
      document.head.appendChild(script);
    });
  }

  document.querySelectorAll("[data-service]").forEach(function (button) {
    button.addEventListener("click", function () { chooseService(button.dataset.service); });
  });
  writingUnit.addEventListener("change", function () {
    document.querySelectorAll("[data-writing-unit]").forEach(function (field) { field.hidden = field.dataset.writingUnit !== writingUnit.value; });
    updateEstimate();
  });
  nextButton.addEventListener("click", function () { if (validateStep(currentStep)) showStep(currentStep + 1); });
  backButton.addEventListener("click", function () { showStep(currentStep - 1); });
  form.addEventListener("input", function () { updateEstimate(); if (currentStep === steps.length - 1) renderReview(persistPendingRequest()); });

  const goal = new URLSearchParams(window.location.search).get("goal");
  if (["essay", "exam", "tutoring", "other"].includes(goal)) chooseService(goal);
  showStep(0);
})();
