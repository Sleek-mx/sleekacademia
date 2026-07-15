const ADMIN_FAILURE = "Sign-in details could not be verified.";

async function initAuthPage() {
  const status = document.getElementById("auth-status");
  const signInTarget = document.getElementById("clerk-sign-in");
  const signUpTarget = document.getElementById("clerk-sign-up");
  const unifiedForm = document.getElementById("unified-login-form");
  let config;

  try {
    config = await fetch("/api/config", { credentials: "same-origin" }).then((response) => response.json());
    if (signInTarget && unifiedForm) await configureUnifiedLogin({ status, signInTarget, unifiedForm, config });
    if (signUpTarget) await mountClerk({ status, target: signUpTarget, mode: "sign-up", config });
  } catch (error) {
    showStatus(status, error.message || "Unable to load authentication.", true);
  }
}

function isAdminIdentifier(identifier) {
  return String(identifier || "").trim().toUpperCase() === "MCX";
}

async function configureUnifiedLogin({ status, signInTarget, unifiedForm, config }) {
  let clerkMounted = false;
  let clerkReady = false;

  async function prepareClerk() {
    if (clerkReady || config.demoMode) return;
    if (!config.publishableKey || !config.clerkJsUrl) throw new Error("Secure sign-in is not configured yet.");
    await loadScript(config.clerkJsUrl, config.publishableKey);
    await window.Clerk.load({ signInUrl: config.signInUrl, signUpUrl: config.signUpUrl, afterSignInUrl: "/dashboard.html", afterSignUpUrl: "/dashboard.html" });
    clerkReady = true;
    if (window.Clerk.isSignedIn) window.location.replace("/dashboard.html");
  }

  function showClerkSignIn(message) {
    signInTarget.hidden = false;
    unifiedForm.hidden = true;
    if (!clerkMounted) {
      clerkMounted = true;
      window.Clerk.mountSignIn(signInTarget, { appearance: clerkAppearance(), signUpUrl: "/sign-up.html", afterSignInUrl: "/dashboard.html" });
    }
    showStatus(status, message);
  }

  document.getElementById("clerk-options-toggle")?.addEventListener("click", async () => {
    try {
      if (config.demoMode) {
        window.location.assign("/dashboard.html");
        return;
      }
      await prepareClerk();
      showClerkSignIn("Choose a secure sign-in option.");
    } catch (error) {
      showStatus(status, error.message || ADMIN_FAILURE, true);
    }
  });

  unifiedForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submit = unifiedForm.querySelector('button[type="submit"]');
    const identifier = unifiedForm.elements.identifier.value.trim();
    const password = unifiedForm.elements.password.value;
    submit.disabled = true;
    showStatus(status, "Verifying your sign-in details...");
    try {
      if (config.demoMode && isAdminIdentifier(identifier)) {
        window.location.assign("/admin.html");
        return;
      }
      if (isAdminIdentifier(identifier)) {
        const response = await fetch("/api/admin-auth/login", {
          method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: identifier, password }),
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(ADMIN_FAILURE);
        sessionStorage.setItem("sleekAcademia.adminCsrf", payload.csrfToken || "");
        window.location.assign("/admin.html");
        return;
      }
      if (config.demoMode) {
        window.location.assign("/dashboard.html");
        return;
      }
      await prepareClerk();
      const signIn = await window.Clerk.client.signIn.create({ identifier, password });
      if (signIn.status !== "complete" || !signIn.createdSessionId) {
        showClerkSignIn("Complete the additional security verification.");
        return;
      }
      await window.Clerk.setActive({ session: signIn.createdSessionId });
      window.location.assign("/dashboard.html");
    } catch (error) {
      showStatus(status, error.message === ADMIN_FAILURE ? ADMIN_FAILURE : "Sign-in details could not be verified.", true);
    } finally {
      unifiedForm.elements.password.value = "";
      submit.disabled = false;
    }
  });
  showStatus(status, config.demoMode ? "Local review mode is active. Enter any email to open the seeded workspace." : "Enter your email or username and password.");
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
  const appearance = clerkAppearance();
  if (mode === "sign-up") window.Clerk.mountSignUp(target, { appearance, signInUrl: "/login.html", afterSignUpUrl: "/dashboard.html" });
  else window.Clerk.mountSignIn(target, { appearance, signUpUrl: "/sign-up.html", afterSignInUrl: "/dashboard.html" });
}

function clerkAppearance() {
  return {
    variables: { colorPrimary: "#702ae1", colorBackground: "#ffffff", colorText: "#202432", borderRadius: "1rem" },
    elements: { card: "shadow-none border border-slate-100 rounded-[1.5rem]", formButtonPrimary: "bg-[#702ae1] hover:bg-[#5d22c2] text-white rounded-2xl font-semibold", socialButtonsBlockButton: "rounded-2xl border border-slate-200 hover:bg-slate-50", footerActionLink: "text-[#702ae1] hover:text-[#5d22c2]" },
  };
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
