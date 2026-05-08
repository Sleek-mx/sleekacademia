async function initDashboard() {
  try {
    const [configResponse, meResponse] = await Promise.all([
      fetch("/api/config", { credentials: "same-origin" }),
      fetch("/api/me", { credentials: "same-origin" }),
    ]);

    if (meResponse.status === 401) {
      window.location.replace("/login.html");
      return;
    }

    const config = await configResponse.json();
    const me = await meResponse.json();

    if (!config.publishableKey || !config.clerkJsUrl) {
      throw new Error("Clerk config is missing. Check your environment variables.");
    }

    await loadClerk(config.clerkJsUrl, config.publishableKey);
    await window.Clerk.load({
      signInUrl: config.signInUrl,
      signUpUrl: config.signUpUrl,
      afterSignInUrl: config.afterSignInUrl,
      afterSignUpUrl: config.afterSignUpUrl,
    });

    if (!window.Clerk.isSignedIn) {
      window.location.replace("/login.html");
      return;
    }

    const syncedUser = await syncOnboardingFromUrl(me.user);

    mountUserButton();
    hydrateProfile(syncedUser || me.user);
    wireSignOut(config.signInUrl);

    if ((syncedUser || me.user).role === "admin") {
      await loadAdminPanel();
    }
  } catch (error) {
    renderFatal(error.message || "Unable to load dashboard.");
  }
}

function hydrateProfile(user) {
  const heroCopyByRole = {
    admin:
      "You are viewing the platform control center. Manage user roles, monitor system health, and steer the Sleek Academia operation from one protected surface.",
    tutor:
      "You have a tutor-focused view with session readiness, material workflows, and quick action tools tailored to instruction and learner support.",
    student:
      "You are in the learning workspace built for course progress, session reminders, and study momentum across your academic journey.",
  };

  const roleLabel = capitalize(user.role);
  setText("user-name", user.fullName);
  setText("user-role-pill", roleLabel);
  setText("hero-name", user.firstName || user.fullName);
  setText("hero-role", roleLabel);
  setText("hero-email", user.email || "No email available");
  setText("hero-copy", heroCopyByRole[user.role] || heroCopyByRole.student);

  if (user.selectedExam) {
    setText(
      "hero-copy",
      `${heroCopyByRole[user.role] || heroCopyByRole.student} Current funnel focus: ${user.selectedExam}.`,
    );
  }
  showRoleView(user.role);
}

async function syncOnboardingFromUrl(currentUser) {
  const params = new URLSearchParams(window.location.search);
  const selectedExam = params.get("selectedExam");

  if (!selectedExam) {
    return currentUser;
  }

  const payload = {
    selectedExam,
    selectedCategory: params.get("selectedCategory") || "",
    attemptStatus: params.get("attemptStatus") || "",
    examOption: params.get("examOption") || "",
    assistanceType: params.get("assistanceType") || "",
  };

  const response = await fetch("/api/me/profile", {
    method: "PATCH",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return currentUser;
  }

  const result = await response.json();
  const cleanUrl = `${window.location.origin}${window.location.pathname}`;
  window.history.replaceState({}, document.title, cleanUrl);
  return result.user || currentUser;
}

function showRoleView(role) {
  document.querySelectorAll("[data-role-view]").forEach((section) => {
    const isActive = section.dataset.roleView === role;

    if (isActive) {
      section.classList.remove("hidden-role");
      section.classList.add("role-view-active");
      section.getBoundingClientRect();
    } else {
      section.classList.remove("role-view-active");
      section.classList.add("hidden-role");
    }
  });
}

async function loadAdminPanel() {
  const response = await fetch("/api/admin/users", {
    credentials: "same-origin",
  });

  if (!response.ok) {
    throw new Error("Unable to load admin data.");
  }

  const payload = await response.json();
  setText("admin-student-count", String(payload.counts.student));
  setText("admin-tutor-count", String(payload.counts.tutor));
  setText("admin-admin-count", String(payload.counts.admin));
  renderAdminUsers(payload.users);

  const refreshButton = document.getElementById("refresh-admin-users");
  if (refreshButton) {
    refreshButton.onclick = async () => {
      refreshButton.disabled = true;
      refreshButton.textContent = "Refreshing...";
      try {
        await loadAdminPanel();
      } finally {
        refreshButton.disabled = false;
        refreshButton.textContent = "Refresh";
      }
    };
  }
}

function renderAdminUsers(users) {
  const tbody = document.getElementById("admin-users-table");
  if (!tbody) return;

  tbody.innerHTML = "";

  users.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="py-4">
        <div class="flex items-center gap-3">
          <div class="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-slate-100">
            ${
              user.imageUrl
                ? `<img alt="${escapeHtml(user.fullName)}" class="h-full w-full object-cover" src="${escapeHtml(user.imageUrl)}" />`
                : `<span class="text-sm font-bold text-slate-600">${escapeHtml(initials(user.fullName))}</span>`
            }
          </div>
          <div>
            <p class="text-sm font-bold text-ink">${escapeHtml(user.fullName)}</p>
            <p class="text-xs text-slate-500">${escapeHtml(user.id)}</p>
          </div>
        </div>
      </td>
      <td class="py-4 text-sm text-slate-600">${escapeHtml(user.email || "No email")}</td>
      <td class="py-4">
        <select
          class="role-select rounded-xl border-slate-200 text-sm font-semibold"
          data-user-id="${escapeHtml(user.id)}"
        >
          ${["admin", "tutor", "student"]
            .map(
              (role) =>
                `<option value="${role}" ${role === user.role ? "selected" : ""}>${capitalize(role)}</option>`,
            )
            .join("")}
        </select>
      </td>
      <td class="py-4">
        <button
          class="save-role rounded-full bg-primary px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white"
          data-user-id="${escapeHtml(user.id)}"
          type="button"
        >
          Save
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });

  tbody.querySelectorAll(".save-role").forEach((button) => {
    button.addEventListener("click", async () => {
      const userId = button.dataset.userId;
      const select = button.closest("tr")?.querySelector(".role-select");
      const role = select?.value;

      if (!role) return;

      button.disabled = true;
      button.textContent = "Saving...";

      try {
        const response = await fetch(`/api/admin/users/${encodeURIComponent(userId)}/role`, {
          method: "PATCH",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role }),
        });

        if (!response.ok) {
          throw new Error("Role update failed.");
        }

        button.textContent = "Saved";
        setTimeout(() => {
          button.textContent = "Save";
          button.disabled = false;
        }, 800);
      } catch (error) {
        button.textContent = "Retry";
        button.disabled = false;
        window.alert(error.message || "Role update failed.");
      }
    });
  });
}

function wireSignOut(redirectUrl) {
  ["top-sign-out"].forEach((id) => {
    const button = document.getElementById(id);
    if (!button) return;

    button.addEventListener("click", async () => {
      await window.Clerk.signOut({
        redirectUrl,
      });
    });
  });
}

function mountUserButton() {
  const target = document.getElementById("user-button");
  if (!target) return;

  window.Clerk.mountUserButton(target, {
    afterSignOutUrl: "/login.html",
    appearance: {
      variables: {
        colorPrimary: "#702ae1",
        borderRadius: "9999px",
      },
    },
  });
}

function loadClerk(src, publishableKey) {
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
    script.onerror = () => reject(new Error("Failed to load ClerkJS."));
    document.head.appendChild(script);
  });
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}

function renderFatal(message) {
  const main = document.querySelector("main");
  if (!main) return;

  main.innerHTML = `
    <section class="mt-10 rounded-[2rem] border border-rose-100 bg-rose-50 p-8 text-rose-800 shadow-float">
      <p class="text-xs font-bold uppercase tracking-[0.3em]">Dashboard Error</p>
      <h1 class="mt-3 text-3xl font-extrabold">Unable to load Sleek Academia.</h1>
      <p class="mt-3 max-w-2xl text-base leading-7">${escapeHtml(message)}</p>
      <a class="mt-6 inline-flex rounded-full bg-rose-700 px-5 py-3 text-sm font-bold text-white" href="/login.html">
        Return to Login
      </a>
    </section>
  `;
}

function capitalize(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
}

function initials(name = "") {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

window.addEventListener("DOMContentLoaded", initDashboard);
