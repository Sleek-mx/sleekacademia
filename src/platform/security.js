import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import rateLimit from "express-rate-limit";
import helmet from "helmet";

const MUTATION_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const CSRF_COOKIE = "sa_csrf";

function normalizedOrigin(value) {
  try {
    const url = new URL(String(value || ""));
    if (!new Set(["http:", "https:"]).has(url.protocol) || url.username || url.password || url.pathname !== "/") return "";
    return url.origin;
  } catch {
    return "";
  }
}

function requestPath(req) {
  return String(req.originalUrl || req.url || req.path || "").split("?", 1)[0];
}

function pathIsExempt(req, exemptPaths) {
  const current = requestPath(req);
  return exemptPaths.some((candidate) => current === candidate || current.endsWith(candidate));
}

function cookieValue(req, name) {
  const header = req?.get?.("cookie") || req?.headers?.cookie || "";
  for (const part of String(header).split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0 || part.slice(0, separator).trim() !== name) continue;
    try {
      return decodeURIComponent(part.slice(separator + 1).trim());
    } catch {
      return "";
    }
  }
  return "";
}

function safeEqual(left, right) {
  const a = Buffer.from(String(left || ""));
  const b = Buffer.from(String(right || ""));
  return a.length > 0 && a.length === b.length && timingSafeEqual(a, b);
}

export function createSecurityHeaders({
  production = false,
  clerkFrontend = "",
  scriptHashes = [],
} = {}) {
  const clerkSource = normalizedOrigin(clerkFrontend);
  const scriptSrc = [
    "'self'",
    ...scriptHashes.filter((value) => /^'sha256-[A-Za-z0-9+/]+=*'$/.test(value)),
    clerkSource,
    "https://js.stripe.com",
    "https://www.paypal.com",
    "https://www.paypalobjects.com",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://connect.facebook.net",
    "https://analytics.tiktok.com",
    "https://cdn.tailwindcss.com",
    "https://gumroad.com",
  ].filter(Boolean);
  const connectSrc = [
    "'self'",
    clerkSource,
    "https://api.stripe.com",
    "https://*.paypal.com",
    "https://www.google-analytics.com",
    "https://analytics.google.com",
    "https://www.facebook.com",
    "https://analytics.tiktok.com",
    "https://gumroad.com",
  ].filter(Boolean);
  const middleware = helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'self'"],
        formAction: ["'self'", "https://www.paypal.com"],
        scriptSrc,
        scriptSrcAttr: ["'none'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        connectSrc,
        frameSrc: ["'self'", clerkSource, "https://js.stripe.com", "https://hooks.stripe.com", "https://www.paypal.com"].filter(Boolean),
        mediaSrc: ["'self'", "blob:"],
        workerSrc: ["'self'", "blob:"],
        upgradeInsecureRequests: production ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "same-site" },
    hsts: production ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    frameguard: { action: "sameorigin" },
    noSniff: true,
  });
  return function securityHeaders(req, res, next) {
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(self), usb=(), interest-cohort=()");
    return middleware(req, res, next);
  };
}

export function createOriginGuard({ allowedOrigins = [], productionOrigin = "", exemptPaths = [] } = {}) {
  const allowed = new Set([...allowedOrigins, productionOrigin].map(normalizedOrigin).filter(Boolean));
  const exemptions = exemptPaths.map((value) => String(value || "")).filter(Boolean);
  return function originGuard(req, res, next) {
    if (pathIsExempt(req, exemptions)) return next();
    const originHeader = req.get("origin") || "";
    const origin = normalizedOrigin(originHeader);
    const mutation = MUTATION_METHODS.has(req.method);
    const crossSite = String(req.get("sec-fetch-site") || "").toLowerCase() === "cross-site";

    if (mutation && (crossSite || (originHeader && !allowed.has(origin)))) {
      return res.status(403).json({ error: "This request origin is not allowed." });
    }
    if (originHeader && allowed.has(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization,X-CSRF-Token,Idempotency-Key");
      res.append("Vary", "Origin");
    }
    if (req.method === "OPTIONS") return res.sendStatus(204);
    return next();
  };
}

export function createCsrfService({ secret, secure = true, cookieName = CSRF_COOKIE } = {}) {
  const key = String(secret || "");
  if (key.length < 32) throw new Error("CSRF_SECRET must be at least 32 characters.");
  const cookieOptions = { httpOnly: true, secure: Boolean(secure), sameSite: "strict", path: "/", maxAge: 8 * 60 * 60 * 1000 };

  function tokenFor(nonce) {
    return createHmac("sha256", key).update(`${nonce}:csrf-v1`).digest("base64url");
  }

  function issueToken(req, res) {
    let nonce = cookieValue(req, cookieName);
    if (!/^[A-Za-z0-9_-]{40,}$/.test(nonce)) {
      nonce = randomBytes(32).toString("base64url");
      res.cookie(cookieName, nonce, cookieOptions);
    }
    return tokenFor(nonce);
  }

  function validate(req) {
    const nonce = cookieValue(req, cookieName);
    const submitted = req.get("x-csrf-token") || "";
    return /^[A-Za-z0-9_-]{40,}$/.test(nonce) && safeEqual(tokenFor(nonce), submitted);
  }

  function protect({ exemptPaths = [], adminSessionService = null } = {}) {
    const exemptions = exemptPaths.map((value) => String(value || "")).filter(Boolean);
    return async function csrfProtection(req, res, next) {
      if (!MUTATION_METHODS.has(req.method) || pathIsExempt(req, exemptions) || !req.get("cookie")) return next();
      if (adminSessionService && cookieValue(req, adminSessionService.cookieName)) {
        const resolved = await adminSessionService.resolveRequest(req);
        if (resolved && adminSessionService.validateCsrf(resolved.session, req.get("x-csrf-token") || "")) return next();
      } else if (validate(req)) {
        return next();
      }
      return res.status(403).json({ error: "The security token is invalid or expired." });
    };
  }

  return Object.freeze({ cookieName, issueToken, validate, protect });
}

function limiter(options) {
  return rateLimit({
    windowMs: options.windowMs,
    limit: options.limit,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    skipSuccessfulRequests: Boolean(options.skipSuccessfulRequests),
    message: { error: "Too many requests. Please wait and try again." },
  });
}

export function createRateLimiters() {
  return Object.freeze({
    adminLogin: limiter({ windowMs: 15 * 60 * 1000, limit: 10, skipSuccessfulRequests: true }),
    platform: limiter({ windowMs: 60 * 1000, limit: 180 }),
    messages: limiter({ windowMs: 60 * 1000, limit: 30 }),
    uploads: limiter({ windowMs: 15 * 60 * 1000, limit: 20 }),
    payments: limiter({ windowMs: 10 * 60 * 1000, limit: 30 }),
    webhooks: limiter({ windowMs: 60 * 1000, limit: 120 }),
  });
}

async function htmlFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return htmlFiles(absolute);
    return entry.isFile() && entry.name.endsWith(".html") ? [absolute] : [];
  }));
  return nested.flat();
}

export async function collectInlineScriptHashes(directory) {
  const hashes = new Set();
  for (const file of await htmlFiles(directory)) {
    const source = await fs.readFile(file, "utf8");
    const pattern = /<script\b(?![^>]*\bsrc\s*=)[^>]*>([\s\S]*?)<\/script>/gi;
    for (const match of source.matchAll(pattern)) {
      if (!match[1]) continue;
      hashes.add(`'sha256-${createHash("sha256").update(match[1], "utf8").digest("base64")}'`);
    }
  }
  return [...hashes].sort();
}
