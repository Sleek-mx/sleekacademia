(function initializeDashboardTheme() {
  "use strict";

  const STORAGE_KEY = "sleekAcademia.dashboardTheme.v1";
  const root = document.documentElement;
  const systemPreference = window.matchMedia("(prefers-color-scheme: dark)");

  function storedTheme() {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return value === "light" || value === "night" ? value : null;
    } catch {
      return null;
    }
  }

  function systemTheme() {
    return systemPreference.matches ? "night" : "light";
  }

  function updateControls(theme) {
    document.querySelectorAll("[data-theme-toggle]").forEach((control) => {
      control.setAttribute("aria-pressed", String(theme === "night"));
      control.setAttribute("aria-label", theme === "night" ? "Use light dashboard theme" : "Use night dashboard theme");
    });
  }

  function applyTheme(theme, persist) {
    const next = theme === "night" ? "night" : "light";
    root.dataset.theme = next;
    root.style.colorScheme = next === "night" ? "dark" : "light";
    if (persist) {
      try { localStorage.setItem(STORAGE_KEY, next); } catch { /* Storage may be unavailable. */ }
    }
    updateControls(next);
    window.dispatchEvent(new CustomEvent("sleek:dashboard-theme-change", { detail: { theme: next } }));
    return next;
  }

  function toggleTheme() {
    return applyTheme(root.dataset.theme === "night" ? "light" : "night", true);
  }

  applyTheme(storedTheme() || systemTheme(), false);

  systemPreference.addEventListener("change", () => {
    if (!storedTheme()) applyTheme(systemTheme(), false);
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-theme-toggle]")) toggleTheme();
  });
  document.addEventListener("DOMContentLoaded", () => updateControls(root.dataset.theme));

  window.SleekDashboardTheme = Object.freeze({
    get: () => root.dataset.theme,
    set: (theme) => applyTheme(theme, true),
    toggle: toggleTheme,
  });
}());
