async function initAuthPage() {
  const status = document.getElementById("auth-status");
  const signInTarget = document.getElementById("clerk-sign-in");
  const signUpTarget = document.getElementById("clerk-sign-up");
  const mode = signUpTarget ? "sign-up" : "sign-in";

  try {
    const response = await fetch("/api/config", {
      credentials: "same-origin",
    });
    const config = await response.json();

    if (!config.publishableKey || !config.clerkJsUrl) {
      throw new Error(
        "Missing Clerk configuration. Set CLERK_PUBLISHABLE_KEY and CLERK_FRONTEND_API_URL in your .env file.",
      );
    }

    await loadScript(config.clerkJsUrl, config.publishableKey);
    await window.Clerk.load({
      signInUrl: config.signInUrl,
      signUpUrl: config.signUpUrl,
      afterSignInUrl: config.afterSignInUrl,
      afterSignUpUrl: config.afterSignUpUrl,
    });

    if (window.Clerk.isSignedIn) {
      window.location.replace(config.afterSignInUrl);
      return;
    }

    if (status) {
      status.textContent =
        mode === "sign-up"
          ? "Authentication ready. Create your account using email or Google."
          : "Authentication ready. Sign in using email or Google.";
    }

    const appearance = {
      variables: {
        colorPrimary: "#702ae1",
        colorBackground: "#ffffff",
        colorText: "#202432",
        borderRadius: "1rem",
      },
      elements: {
        card: "shadow-none border border-slate-100 rounded-[1.5rem]",
        formButtonPrimary:
          "bg-[#702ae1] hover:bg-[#5d22c2] text-white rounded-2xl font-semibold",
        socialButtonsBlockButton:
          "rounded-2xl border border-slate-200 hover:bg-slate-50",
        footerActionLink: "text-[#702ae1] hover:text-[#5d22c2]",
      },
    };

    if (mode === "sign-up") {
      window.Clerk.mountSignUp(signUpTarget, {
        appearance,
        signInUrl: config.signInUrl,
        afterSignUpUrl: config.afterSignUpUrl,
      });
    } else {
      window.Clerk.mountSignIn(signInTarget, {
        appearance,
        signUpUrl: config.signUpUrl,
        afterSignInUrl: config.afterSignInUrl,
      });
    }
  } catch (error) {
    if (status) {
      status.textContent = error.message || "Unable to load authentication.";
      status.className =
        "rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 border border-rose-100";
    }
  }
}

function loadScript(src, publishableKey) {
  return new Promise((resolve, reject) => {
    if (window.Clerk) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.dataset.clerkPublishableKey = publishableKey;
    script.src = src;
    script.type = "text/javascript";
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load authentication script. Check Clerk configuration."));
    document.head.appendChild(script);
  });
}

window.addEventListener("DOMContentLoaded", initAuthPage);
