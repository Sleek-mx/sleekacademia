export function buildCtaEvent({ text, location, href }, baseUrl = "https://sleekacademia.com/") {
  return {
    name: "cta_clicked",
    params: {
      cta_location: cleanValue(location, "unknown"),
      cta_text: cleanValue(text, "CTA"),
      destination: destinationPath(href, baseUrl)
    }
  };
}

export function trackCtaClicks(documentRef = document, gtagRef = globalThis.gtag) {
  documentRef.addEventListener("click", (event) => {
    const cta = event.target.closest?.("[data-cta-location]");
    if (!cta || typeof gtagRef !== "function") return;

    const analyticsEvent = buildCtaEvent({
      text: cta.textContent,
      location: cta.dataset.ctaLocation,
      href: cta.getAttribute("href")
    }, documentRef.baseURI);

    gtagRef("event", analyticsEvent.name, analyticsEvent.params);
  });
}

function cleanValue(value, fallback) {
  const cleaned = String(value ?? "").trim().replace(/\s+/g, " ");
  return cleaned || fallback;
}

function destinationPath(href, baseUrl) {
  if (!href) return "unknown";

  try {
    const url = new URL(href, baseUrl);
    return ["http:", "https:"].includes(url.protocol) ? url.pathname : "external_action";
  } catch {
    return "unknown";
  }
}

if (typeof document !== "undefined") {
  trackCtaClicks();
}
