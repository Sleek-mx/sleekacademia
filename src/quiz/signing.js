// HMAC helpers for the quiz.
//
// Two jobs:
//   1. Entitlement tokens — proof that a learner paid for Q51–100.
//   2. Opaque option ids — so the served payload leaks nothing about which
//      option is correct, even to someone reading the network response.
//
// Both derive from QUIZ_SIGNING_SECRET. If that is unset we fall back to a
// per-process random secret: tokens then die on restart, which is the safe
// failure direction (a learner may have to re-unlock; nobody gets free access).

import crypto from "node:crypto";

const FALLBACK_SECRET = crypto.randomBytes(32).toString("hex");

let warned = false;

function secret() {
  const configured = process.env.QUIZ_SIGNING_SECRET;
  if (configured && configured.length >= 16) return configured;
  if (!warned) {
    warned = true;
    console.warn(
      "[quiz] QUIZ_SIGNING_SECRET is unset or too short; using an ephemeral secret. " +
        "Unlock tokens will not survive a restart."
    );
  }
  return FALLBACK_SECRET;
}

function hmac(input) {
  return crypto.createHmac("sha256", secret()).update(input).digest();
}

function b64url(buf) {
  return Buffer.from(buf).toString("base64url");
}

/** Timing-safe string compare that tolerates differing lengths. */
function safeEqual(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

// ── Opaque option ids ──────────────────────────────────────────────────────
//
// id = first 12 base64url chars of HMAC(salt | questionId | realOptionId).
// Deterministic for a given attempt salt, so grading recomputes the mapping
// without any server-side session store.

export function opaqueOptionId(salt, questionId, realOptionId) {
  return b64url(hmac(`opt:${salt}:${questionId}:${realOptionId}`)).slice(0, 12);
}

/** @returns {Map<string,string>} opaque id → real option id */
export function optionIdMap(salt, question) {
  const map = new Map();
  for (const option of question.options) {
    map.set(opaqueOptionId(salt, question.id, option.id), option.id);
  }
  return map;
}

/**
 * Resolve opaque ids the client submitted back to real option ids.
 * Unknown ids are dropped rather than throwing, so a stale or tampered
 * submission grades as incorrect instead of erroring.
 */
export function resolveOptionIds(salt, question, submitted) {
  const map = optionIdMap(salt, question);
  const resolved = [];
  for (const id of submitted || []) {
    const real = map.get(id);
    if (real && !resolved.includes(real)) resolved.push(real);
  }
  return resolved;
}

// ── Deterministic shuffling ────────────────────────────────────────────────
//
// Option order is derived from the attempt salt so a learner who reloads sees
// the same order, but a new attempt reshuffles. This is what removes the
// "A" concentration inherited from the source material.

export function shuffleDeterministic(items, seedInput) {
  const out = [...items];
  // Fisher-Yates driven by successive HMAC bytes of the seed.
  let bytes = hmac(`shuffle:${seedInput}`);
  let cursor = 0;
  const nextByte = () => {
    if (cursor >= bytes.length) {
      bytes = hmac(`shuffle:${seedInput}:${cursor}`);
      cursor = 0;
    }
    return bytes[cursor++];
  };
  for (let i = out.length - 1; i > 0; i--) {
    // Rejection-free enough for <=8 options; bias is negligible here.
    const j = nextByte() % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// ── Entitlement tokens ─────────────────────────────────────────────────────
//
// Scope is what keeps the two quizzes separate: a token bought for one quiz must
// not unlock the other. The antimicrobial scope string is FROZEN at
// "antimicrobial-quiz:full" because unlocks carrying it have already been sold —
// changing it would lock a paying student out.

export const DEFAULT_SCOPE = "antimicrobial-quiz:full";

/**
 * @param {object} claims - { sub, source, orderId }
 * @param {number} ttlDays
 * @param {string} scope - quiz-specific entitlement scope
 * @returns {string} signed token: payload.signature
 */
export function issueEntitlement(claims, ttlDays = 365, scope = DEFAULT_SCOPE) {
  const payload = {
    ...claims,
    scope,
    iat: Date.now(),
    exp: Date.now() + ttlDays * 24 * 60 * 60 * 1000,
  };
  const body = b64url(JSON.stringify(payload));
  const sig = b64url(hmac(`ent:${body}`));
  return `${body}.${sig}`;
}

/**
 * @param {string} token
 * @param {string} scope - the scope the caller requires; a token for another
 *   quiz verifies its signature but is rejected as "wrong-scope".
 * @returns {{valid: boolean, reason?: string, claims?: object}}
 */
export function verifyEntitlement(token, scope = DEFAULT_SCOPE) {
  if (!token || typeof token !== "string") return { valid: false, reason: "missing" };
  const parts = token.split(".");
  if (parts.length !== 2) return { valid: false, reason: "malformed" };

  const [body, sig] = parts;
  if (!safeEqual(sig, b64url(hmac(`ent:${body}`)))) {
    return { valid: false, reason: "bad-signature" };
  }

  let claims;
  try {
    claims = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    return { valid: false, reason: "bad-payload" };
  }

  if (claims.scope !== scope) return { valid: false, reason: "wrong-scope" };
  if (!claims.exp || Date.now() > claims.exp) return { valid: false, reason: "expired" };

  return { valid: true, claims };
}

/** Extract a bearer-style entitlement from the request, if present. */
export function entitlementFromRequest(req, scope = DEFAULT_SCOPE) {
  const header = req.get?.("x-quiz-entitlement");
  const token = header || req.body?.entitlement;
  return verifyEntitlement(token, scope);
}

/**
 * Access-code escape hatch so the tutor can unlock a student without payment.
 * Disabled unless a code of at least 8 characters is configured.
 *
 * A quiz may name its own env var; the shared QUIZ_ACCESS_CODE is always also
 * accepted so one code in the vault unlocks everything Max needs to comp.
 *
 * @param {string} code
 * @param {string} [envName] - quiz-specific env var checked before the shared one
 */
export function checkAccessCode(code, envName) {
  if (typeof code !== "string" || !code) return false;

  const candidates = [];
  if (envName && envName !== "QUIZ_ACCESS_CODE") candidates.push(process.env[envName]);
  candidates.push(process.env.QUIZ_ACCESS_CODE);

  return candidates.some(
    (expected) =>
      typeof expected === "string" &&
      expected.length >= 8 &&
      code.length === expected.length &&
      safeEqual(code, expected)
  );
}
