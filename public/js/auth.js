const ADMIN_FAILURE = "Sign-in details could not be verified.";

async function initAuthPage() {
  const status = document.getElementById("auth-status");
  const signInTarget = document.getElementById("clerk-sign-in");
  const signUpTarget = document.getElementById("clerk-sign-up");
  const adminForm = document.getElementById("admin-login-form");
  let config;

  try {
    config = await fetch("/api/config", { credentials: "same-origin" }).then((response) => response.json());
    if (signInTarget) configureLoginModes({ status, signInTarget, adminForm, config });
    if (signUpTarget) await mountClerk({ status, target: signUpTarget, mode: "sign-up", config });
  } catch (error) {
    showStatus(status, error.message || "Unable to load authentication.", true);
  }
}

function configureLoginModes({ status, signInTarget, adminForm, config }) {
  const tabs = Array.from(document.querySelectorAll("[data-auth-mode]"));
  const panels = Array.from(document.querySelectorAll("[data-auth-panel]"));
  let clerkMounted = false;

  async function selectMode(mode) {
    tabs.forEach((tab) => {
      const active = tab.dataset.authMode === mode;
      tab.setAttribute("aria-selected", String(active));
      tab.classList.toggle("primary", active);
    });
    panels.forEach((panel) => { panel.hidden = panel.dataset.authPanel !== mode; });
    if (mode === "client") {
      if (config.demoMode) {
        showStatus(status, "Local demo mode is active. Open the client dashboard to review the seeded workspace.");
        status.insertAdjacentHTML("beforeend", ' <a class="ws-button primary small" href="/dashboard.html">Open client demo</a>');
      } else if (!clerkMounted) {
        clerkMounted = true;
        await mountClerk({ status, target: signInTarget, mode: "sign-in", config });
      }
    } else {
      showStatus(status, config.demoMode ? "Localhost admin review is available without production credentials." : "Enter the dedicated MCX administrator credentials.");
      const demoLink = document.getElementById("admin-demo-link");
      if (demoLink) demoLink.hidden = !config.demoMode;
      adminForm?.elements.password?.focus();
    }
  }

  tabs.forEach((tab) => tab.addEventListener("click", () => { void selectMode(tab.dataset.authMode); }));
  adminForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submit = adminForm.querySelector('button[type="submit"]');
    submit.disabled = true;
    showStatus(status, "Verifying administrator access...");
    try {
      const response = await fetch("/api/admin-auth/login", {
        method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: adminForm.elements.username.value, password: adminForm.elements.password.value }),
      });
      const payload = await response.json().catch(() => ({}));
      adminForm.elements.password.value = "";
      if (!response.ok) throw new Error(ADMIN_FAILURE);
      sessionStorage.setItem("sleekAcademia.adminCsrf", payload.csrfToken || "");
      window.location.assign("/admin.html");
    } catch {
      adminForm.elements.password.value = "";
      showStatus(status, ADMIN_FAILURE, true);
    } finally {
      submit.disabled = false;
    }
  });
  const initialMode = new URLSearchParams(window.location.search).get("mode") === "admin" ? "admin" : "client";
  void selectMode(initialMode);
}

async function mountClerk({ status, target, mode, config }) {
  if (!config.publishableKey || !config.clerkJsUrl) throw new Error("Secure client authentication is not configured yet.");
  await loadScript(config.clerkJsUrl, config.publishableKey);
  await window.Clerk.load({
    signInUrl: config.signInUrl, signUpUrl: config.signUpUrl,
    afterSignInUrl: "/dashboard.html", afterSignUpUrl: "/dashboard.html",
  });
  if (window.Clerk.isSignedIn) {
    window.location.replace("/dashboard.html");
    return;
  }
  showStatus(status, mode === "sign-up" ? "Create your client account using email or Google." : "Sign in to your client workspace using email or Google.");
  const appearance = {
    variables: { colorPrimary: "#702ae1", colorBackground: "#ffffff", colorText: "#202432", borderRadius: "1rem" },
    elements: { card: "shadow-none border border-slate-100 rounded-[1.5rem]", formButtonPrimary: "bg-[#702ae1] hover:bg-[#5d22c2] text-white rounded-2xl font-semibold", socialButtonsBlockButton: "rounded-2xl border border-slate-200 hover:bg-slate-50", footerActionLink: "text-[#702ae1] hover:text-[#5d22c2]" },
  };
  if (mode === "sign-up") window.Clerk.mountSignUp(target, { appearance, signInUrl: "/login.html", afterSignUpUrl: "/dashboard.html" });
  else window.Clerk.mountSignIn(target, { appearance, signUpUrl: "/sign-up.html", afterSignInUrl: "/dashboard.html" });
}

function showStatus(target, message, error = false) {
  if (!target) return;
  target.textContent = message;
  target.classList.toggle("is-error", error);
}

function loadScript(src, publishableKey) {
  return new Promise((resolve, reject) => {
    if (window.Clerk) return resolve();
    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.dataset.clerkPublishableKey = publishableKey;
    script.src = src;
    script.type = "text/javascript";
    script.onload = resolve;
    script.onerror = () => reject(new Error("Failed to load secure client authentication."));
    document.head.appendChild(script);
  });
}

window.addEventListener("DOMContentLoaded", initAuthPage);
