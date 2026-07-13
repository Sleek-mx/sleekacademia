import express from "express";

import { isLoopbackHostname } from "./store.js";

const COOKIE_MAX_AGE = 8 * 60 * 60 * 1000;

function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

function cookieOptions(req) {
  return {
    httpOnly: true,
    secure: !isLoopbackHostname(req.hostname),
    sameSite: "strict",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  };
}

export function createAdminAuthRouter({ service } = {}) {
  const router = express.Router();
  if (!service) {
    router.use((_req, res) => res.status(503).json({ error: "Admin sign-in is unavailable." }));
    return router;
  }

  router.post("/login", asyncRoute(async (req, res) => {
    const username = typeof req.body?.username === "string" ? req.body.username.slice(0, 100) : "";
    const password = typeof req.body?.password === "string" ? req.body.password.slice(0, 1024) : "";
    const result = await service.login({
      username,
      password,
      ip: req.ip || req.socket?.remoteAddress || "",
      userAgent: req.get("user-agent") || "",
    });
    if (!result.ok) {
      if (result.retryAfterSeconds) res.setHeader("Retry-After", String(result.retryAfterSeconds));
      return res.status(result.status).json({ error: result.error });
    }
    res.cookie(service.cookieName, result.token, cookieOptions(req));
    return res.json({ identity: result.identity, csrfToken: result.csrfToken });
  }));

  router.get("/session", asyncRoute(async (req, res) => {
    const resolved = await service.resolveRequest(req);
    if (!resolved) return res.status(401).json({ error: "Authentication is required." });
    const issued = await service.issueCsrf(resolved.session);
    return res.json({ identity: resolved.identity, csrfToken: issued.csrfToken });
  }));

  router.post("/logout", asyncRoute(async (req, res) => {
    const resolved = await service.resolveRequest(req);
    if (!resolved) return res.status(401).json({ error: "Authentication is required." });
    if (!service.validateCsrf(resolved.session, req.get("x-csrf-token") || "")) {
      return res.status(403).json({ error: "The security token is invalid or expired." });
    }
    await service.logout(resolved);
    res.clearCookie(service.cookieName, { ...cookieOptions(req), maxAge: undefined });
    return res.status(204).end();
  }));

  router.use((_error, _req, res, _next) => {
    return res.status(500).json({ error: "Admin authentication could not complete this action." });
  });

  return router;
}
