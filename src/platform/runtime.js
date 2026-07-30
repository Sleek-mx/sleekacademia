function normalizeOrigin(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  try {
    return new URL(text.includes("://") ? text : `https://${text}`).origin;
  } catch {
    return "";
  }
}

export function isVercelRuntime(env = process.env) {
  return env.VERCEL === "1";
}

export function jsonBodyLimit(env = process.env) {
  return isVercelRuntime(env) ? "4.25mb" : "12mb";
}

export function buildAllowedOrigins({
  configured = "",
  productionOrigin = "",
  localDemoMode = false,
  port = 3000,
  vercelUrl = "",
} = {}) {
  const values = String(configured || "").split(",");
  values.push(productionOrigin);
  if (vercelUrl) values.push(vercelUrl);
  if (localDemoMode) {
    values.push(`http://localhost:${port}`, `http://127.0.0.1:${port}`);
  }
  return [...new Set(values.map(normalizeOrigin).filter(Boolean))];
}
