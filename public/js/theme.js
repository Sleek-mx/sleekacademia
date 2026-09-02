(function initializePublicTheme() {
  "use strict";

  var STORAGE_KEY = "sleek-theme";
  var root = document.documentElement;

  function storedTheme() {
    try {
      var value = localStorage.getItem(STORAGE_KEY);
      return value === "light" || value === "dark" ? value : null;
    } catch (err) {
      return null;
    }
  }

  function currentTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function updateControls(theme) {
    var isDark = theme === "dark";
    document.querySelectorAll("[data-theme-toggle]").forEach(function (control) {
      control.setAttribute("aria-pressed", String(isDark));
      control.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
      );
    });
  }

  function applyTheme(theme, persist) {
    var next = theme === "dark" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    if (root.dataset) root.dataset.theme = next;
    root.style.colorScheme = next;
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (err) {
        /* Storage may be unavailable. */
      }
    }
    updateControls(next);
    return next;
  }

  function toggleTheme() {
    return applyTheme(currentTheme() === "dark" ? "light" : "dark", true);
  }

  applyTheme(storedTheme() || "light", false);

  document.addEventListener("click", function (event) {
    if (event.target.closest("[data-theme-toggle]")) toggleTheme();
  });
  document.addEventListener("DOMContentLoaded", function () {
    updateControls(currentTheme());
  });
})();
