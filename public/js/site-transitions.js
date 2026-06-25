function isInternalPageLink(link) {
  if (!link) return false;
  if (link.target && link.target !== "_self") return false;
  if (link.hasAttribute("download")) return false;

  const href = link.getAttribute("href") || "";
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }

  const url = new URL(link.href, window.location.href);
  if (url.origin !== window.location.origin) return false;

  const current = new URL(window.location.href);
  if (url.pathname === current.pathname && url.search === current.search && url.hash) {
    return false;
  }

  return true;
}

function enablePageTransitions() {
  document.documentElement.classList.add("page-ready");

  window.addEventListener("pageshow", () => {
    document.documentElement.classList.remove("page-exit");
    document.documentElement.classList.add("page-ready");
  });

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!isInternalPageLink(link)) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (event.defaultPrevented) return;

    event.preventDefault();
    const destination = link.href;

    document.documentElement.classList.add("page-exit");

    window.setTimeout(() => {
      window.location.href = destination;
    }, 180);
  });
}

window.addEventListener("DOMContentLoaded", enablePageTransitions);
