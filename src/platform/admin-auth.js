import {
  createHmac,
  randomBytes as systemRandomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const SESSION_COOKIE = "sa_admin_session";
const IDLE_MILLISECONDS = 30 * 60 * 1000;
const ABSOLUTE_MILLISECONDS = 8 * 60 * 60 * 1000;
const FAILURE_WINDOW_MILLISECONDS = 15 * 60 * 1000;
const MAX_FAILURES = 5;

export const ADMIN_AUTH_ERROR = "Sign-in details could not be verified.";

function validScryptParameters(cost, blockSize, parallelization) {
  return (
    Number.isSafeInteger(cost) && cost >= 16384 && cost <= 262144 && (cost & (cost - 1)) === 0 &&
    Number.isSafeInteger(blockSize) && blockSize >= 8 && blockSize <= 32 &&
    Number.isSafeInteger(parallelization) && parallelization >= 1 && parallelization <= 8
  );
}

function scryptOptions(cost, blockSize, parallelization) {
  return {
    N: cost,
    r: blockSize,
    p: parallelization,
    maxmem: Math.max(64 * 1024 * 1024, 128 * cost * blockSize + 1024 * 1024),
  };
}

function decodePasswordHash(encodedHash) {
  const parts = String(encodedHash || "").split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return null;
  const cost = Number(parts[1]);
  const blockSize = Number(parts[2]);
  const parallelization = Number(parts[3]);
  if (!validScryptParameters(cost, blockSize, parallelization)) return null;
  try {
    const salt = Buffer.from(parts[4], "base64url");
    const digest = Buffer.from(parts[5], "base64url");
    if (salt.length < 16 || salt.length > 64 || digest.length < 32 || digest.length > 128) return null;
    return { cost, blockSize, parallelization, salt, digest };
  } catch {
    return null;
  }
}

export async function hashAdminPassword(password, {
  cost = 16384,
  blockSize = 8,
  parallelization = 1,
  saltBytes = 16,
  keyLength = 64,
  randomBytes = systemRandomBytes,
} = {}) {
  const value = String(password || "");
  if (value.length < 12 || value.length > 1024) {
    throw new RangeError("Admin passwords must be between 12 and 1,024 characters.");
  }
  if (!validScryptParameters(cost, blockSize, parallelization)) {
    throw new RangeError("Choose secure scrypt parameters.");
  }
  if (!Number.isSafeInteger(saltBytes) || saltBytes < 16 || saltBytes > 64) {
    throw new RangeError("Choose a secure scrypt salt length.");
  }
  if (!Number.isSafeInteger(keyLength) || keyLength < 32 || keyLength > 128) {
    throw new RangeError("Choose a secure scrypt key length.");
  }
  const salt = randomBytes(saltBytes);
  const digest = await scrypt(value, salt, keyLength, scryptOptions(cost, blockSize, parallelization));
  return `scrypt$${cost}$${blockSize}$${parallelization}$${salt.toString("base64url")}$${Buffer.from(digest).toString("base64url")}`;
}

export async function verifyAdminPassword(password, encodedHash) {
  const parsed = decodePasswordHash(encodedHash);
  if (!parsed) return false;
  try {
    const actual = Buffer.from(await scrypt(
      String(password || ""),
      parsed.salt,
      parsed.digest.length,
      scryptOptions(parsed.cost, parsed.blockSize, parsed.parallelization),
    ));
    return actual.length === parsed.digest.length && timingSafeEqual(actual, parsed.digest);
  } catch {
    return false;
  }
}

function hmac(value, secret) {
  return createHmac("sha256", secret).update(String(value || "")).digest("hex");
}

function safeEqualHex(left, right) {
  const a = Buffer.from(String(left || ""), "hex");
  const b = Buffer.from(String(right || ""), "hex");
  return a.length === 32 && b.length === 32 && timingSafeEqual(a, b);
}

function cookieValue(req, name) {
  const header = req?.get?.("cookie") || req?.headers?.cookie || "";
  for (const pair of String(header).split(";")) {
    const separator = pair.indexOf("=");
    if (separator < 0 || pair.slice(0, separator).trim() !== name) continue;
    try {
      return decodeURIComponent(pair.slice(separator + 1).trim());
    } catch {
      return "";
    }
  }
  return "";
}

function dateValue(value) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isFinite(date.getTime()) ? date : null;
}

export function createAdminSessionService({
  store,
  username = "MCX",
  passwordHash,
  sessionSecret,
  now = () => new Date(),
  randomBytes = systemRandomBytes,
  sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)),
} = {}) {
  if (!store?.available || typeof store.createAdminSession !== "function") {
    throw new Error("Admin session storage is required.");
  }
  if (!decodePasswordHash(passwordHash)) throw new Error("A valid ADMIN_PASSWORD_HASH is required.");
  if (String(sessionSecret || "").length < 32) throw new Error("ADMIN_SESSION_SECRET must be at least 32 characters.");

  const configuredUsername = String(username || "MCX").trim().toUpperCase();
  const identity = Object.freeze({
    userId: "admin:mcx",
    role: "admin",
    email: "",
    fullName: "MCX",
    demo: false,
  });

  function currentDate() {
    const value = dateValue(now());
    if (!value) throw new Error("Admin session clock returned an invalid date.");
    return value;
  }

  function contextHashes({ ip = "", userAgent = "" } = {}) {
    return {
      ipHash: hmac(ip || "unknown", sessionSecret),
      userAgentHash: hmac(userAgent || "unknown", sessionSecret),
    };
  }

  async function appendEvent(type, { ipHash = "", userAgentHash = "", data = {} } = {}) {
    return store.appendSecurityEvent({ type, actor: "MCX", ipHash, userAgentHash, data });
  }

  async function recentFailures(attemptKey, at) {
    const cutoff = at.getTime() - FAILURE_WINDOW_MILLISECONDS;
    const events = await store.listSecurityEvents();
    const relevant = events.filter((event) => {
      const created = dateValue(event.createdAt)?.getTime() || 0;
      return created >= cutoff && event.data?.attemptKey === attemptKey;
    });
    const lastSuccess = relevant
      .filter((event) => event.type === "admin.login_succeeded")
      .reduce((latest, event) => Math.max(latest, dateValue(event.createdAt)?.getTime() || 0), 0);
    return relevant.filter((event) => (
      event.type === "admin.login_failed" && (dateValue(event.createdAt)?.getTime() || 0) >= lastSuccess
    ));
  }

  async function issueSession({ ipHash, userAgentHash, eventType = "admin.login_succeeded" }) {
    const at = currentDate();
    const token = randomBytes(32).toString("base64url");
    const csrfToken = randomBytes(32).toString("base64url");
    const session = await store.createAdminSession({
      tokenHash: hmac(token, sessionSecret),
      csrfHash: hmac(csrfToken, sessionSecret),
      username: configuredUsername,
      ipHash,
      userAgentHash,
      createdAt: at.toISOString(),
      lastSeenAt: at.toISOString(),
      idleExpiresAt: new Date(at.getTime() + IDLE_MILLISECONDS).toISOString(),
      absoluteExpiresAt: new Date(at.getTime() + ABSOLUTE_MILLISECONDS).toISOString(),
    });
    await appendEvent(eventType, { ipHash, userAgentHash, data: { sessionId: session.id } });
    return { ok: true, token, csrfToken, session, identity };
  }

  async function login({ username: submittedUsername, password, ip = "", userAgent = "" } = {}) {
    const at = currentDate();
    const hashes = contextHashes({ ip, userAgent });
    const attemptKey = hashes.ipHash;
    const failures = await recentFailures(attemptKey, at);
    if (failures.length >= MAX_FAILURES) {
      const retryAfterSeconds = Math.max(1, Math.ceil((FAILURE_WINDOW_MILLISECONDS - (at.getTime() - dateValue(failures[0].createdAt).getTime())) / 1000));
      await appendEvent("admin.login_locked", { ...hashes, data: { attemptKey, retryAfterSeconds } });
      return { ok: false, status: 429, error: ADMIN_AUTH_ERROR, retryAfterSeconds };
    }

    const usernameMatches = String(submittedUsername || "").trim().toUpperCase() === configuredUsername;
    const passwordMatches = await verifyAdminPassword(password, passwordHash);
    if (!usernameMatches || !passwordMatches) {
      const delayMs = Math.min(2000, 250 * (2 ** failures.length));
      await appendEvent("admin.login_failed", { ...hashes, data: { attemptKey, failureCount: failures.length + 1 } });
      await sleep(delayMs);
      return { ok: false, status: 401, error: ADMIN_AUTH_ERROR, retryAfterMs: delayMs };
    }

    return issueSession(hashes);
  }

  async function resolveRequest(req) {
    const token = cookieValue(req, SESSION_COOKIE);
    if (!token) return null;
    const session = await store.getAdminSessionByTokenHash(hmac(token, sessionSecret));
    if (!session || session.revokedAt) return null;
    const at = currentDate();
    const idleExpiry = dateValue(session.idleExpiresAt);
    const absoluteExpiry = dateValue(session.absoluteExpiresAt);
    if (!idleExpiry || !absoluteExpiry || at.getTime() > idleExpiry.getTime() || at.getTime() > absoluteExpiry.getTime()) {
      await store.revokeAdminSession(session.id, at.toISOString());
      await appendEvent("admin.session_expired", session);
      return null;
    }
    const requestUserAgentHash = hmac(req?.get?.("user-agent") || "unknown", sessionSecret);
    if (session.userAgentHash && !safeEqualHex(session.userAgentHash, requestUserAgentHash)) {
      await store.revokeAdminSession(session.id, at.toISOString());
      await appendEvent("admin.session_revoked", { ...session, data: { reason: "user-agent-mismatch", sessionId: session.id } });
      return null;
    }
    const idleExpiresAt = new Date(Math.min(at.getTime() + IDLE_MILLISECONDS, absoluteExpiry.getTime())).toISOString();
    const updated = await store.touchAdminSession(session.id, { lastSeenAt: at.toISOString(), idleExpiresAt });
    return { identity, session: updated, tokenHash: updated.tokenHash };
  }

  async function rotate(resolved) {
    if (!resolved?.session || resolved.session.revokedAt) throw new Error("An active admin session is required.");
    await store.revokeAdminSession(resolved.session.id, currentDate().toISOString());
    return issueSession({
      ipHash: resolved.session.ipHash,
      userAgentHash: resolved.session.userAgentHash,
      eventType: "admin.session_rotated",
    });
  }

  async function logout(resolved) {
    if (!resolved?.session) return false;
    const revokedAt = currentDate().toISOString();
    await store.revokeAdminSession(resolved.session.id, revokedAt);
    await appendEvent("admin.logout", { ...resolved.session, data: { sessionId: resolved.session.id } });
    return true;
  }

  async function issueCsrf(session) {
    if (!session || session.revokedAt) throw new Error("An active admin session is required.");
    const csrfToken = randomBytes(32).toString("base64url");
    const updated = await store.touchAdminSession(session.id, { csrfHash: hmac(csrfToken, sessionSecret) });
    return { session: updated, csrfToken };
  }

  function validateCsrf(session, csrfToken) {
    return Boolean(session?.csrfHash && safeEqualHex(session.csrfHash, hmac(csrfToken, sessionSecret)));
  }

  return Object.freeze({
    cookieName: SESSION_COOKIE,
    identity,
    login,
    resolveRequest,
    rotate,
    logout,
    issueCsrf,
    validateCsrf,
  });
}
