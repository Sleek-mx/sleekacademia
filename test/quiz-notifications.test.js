// Tests for unlock email notifications.
//
// No network: the mail channel is unconfigured for most cases, and where a send
// is exercised the axios transport is stubbed.

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import * as notify from "../src/quiz/notify.js";
import { renalCardiacQuiz, antimicrobialQuiz } from "../src/quiz/quizzes.js";
import { issueEntitlement, verifyEntitlement } from "../src/quiz/signing.js";

const MAIL_ENV = [
  "RESEND_API_KEY", "RESEND_FROM", "SMTP_HOST", "SMTP_USER", "SMTP_PASS", "SMTP_PORT",
  "QUIZ_NOTIFY_EMAIL", "NOTIFICATION_EMAIL", "PUBLIC_BASE_URL",
];

function withEnv(overrides, fn) {
  const saved = {};
  for (const key of MAIL_ENV) saved[key] = process.env[key];
  for (const key of MAIL_ENV) delete process.env[key];
  Object.assign(process.env, overrides);
  try {
    return fn();
  } finally {
    for (const key of MAIL_ENV) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
  }
}

const CAPTURE = Object.freeze({
  ok: true,
  orderId: "ORDER123",
  captureId: "CAPTURE456",
  amount: "10.00",
  payer: "buyer@example.com",
});

// ── Channel selection ──────────────────────────────────────────────────────

test("channel selection prefers Resend, falls back to SMTP, else disabled", () => {
  withEnv({}, () => {
    assert.equal(notify.isConfigured(), false);
    assert.equal(notify.channel(), "disabled");
  });

  withEnv({ SMTP_HOST: "mail.example.com", SMTP_USER: "u", SMTP_PASS: "p" }, () => {
    assert.equal(notify.isConfigured(), true);
    assert.equal(notify.channel(), "smtp");
  });

  withEnv(
    { RESEND_API_KEY: "re_test", SMTP_HOST: "mail.example.com", SMTP_USER: "u", SMTP_PASS: "p" },
    () => {
      assert.equal(notify.channel(), "resend", "Resend must win when both are set");
    }
  );
});

test("partial SMTP configuration counts as unconfigured", () => {
  withEnv({ SMTP_HOST: "mail.example.com", SMTP_USER: "u" }, () => {
    assert.equal(notify.isConfigured(), false, "a missing password must not look configured");
  });
});

test("alerts default to the PayPal payee when no notify address is set", () => {
  withEnv({}, () => {
    assert.equal(notify.notifyAddress(), process.env.QUIZ_PAYEE_EMAIL || "macsiemoney@gmail.com");
  });
  withEnv({ QUIZ_NOTIFY_EMAIL: "alerts@example.com" }, () => {
    assert.equal(notify.notifyAddress(), "alerts@example.com");
  });
});

// ── The access link ────────────────────────────────────────────────────────

test("the access link carries the token in the fragment, never the query string", () => {
  const token = issueEntitlement({ sub: "buyer" }, 365, renalCardiacQuiz.scope);
  const link = withEnv({}, () => notify.accessLink(renalCardiacQuiz, token));

  const url = new URL(link);
  assert.equal(url.origin, "https://sleekacademia.com");
  assert.equal(url.pathname, renalCardiacQuiz.pagePath);
  assert.equal(url.search, "", "a token in the query string would land in server logs");
  assert.match(url.hash, /^#unlock=/);

  const carried = decodeURIComponent(url.hash.replace("#unlock=", ""));
  assert.equal(carried, token, "the token must survive the round trip intact");
  assert.equal(verifyEntitlement(carried, renalCardiacQuiz.scope).valid, true);
});

test("each quiz's link points at its own page", () => {
  const token = issueEntitlement({ sub: "b" }, 365, antimicrobialQuiz.scope);
  withEnv({}, () => {
    assert.ok(notify.accessLink(antimicrobialQuiz, token).includes("/antimicrobial-quiz#unlock="));
    assert.ok(notify.accessLink(renalCardiacQuiz, token).includes("/renal-cardiac-quiz#unlock="));
  });
});

test("a link redeemed for the wrong quiz does not unlock it", () => {
  const renalToken = issueEntitlement({ sub: "b" }, 365, renalCardiacQuiz.scope);
  assert.equal(verifyEntitlement(renalToken, antimicrobialQuiz.scope).valid, false);
});

// ── Failure containment ────────────────────────────────────────────────────

test("every notification resolves rather than throwing when mail is unconfigured", async () => {
  const token = issueEntitlement({ sub: "buyer" }, 365, renalCardiacQuiz.scope);

  const results = await withEnv({}, async () => [
    await notify.emailBuyerAccessLink(renalCardiacQuiz, CAPTURE, token),
    await notify.notifyUnlock(renalCardiacQuiz, CAPTURE),
    await notify.notifyCaptureFailure(renalCardiacQuiz, "ORDER123", new Error("boom")),
  ]);

  for (const result of results) {
    assert.equal(result.sent, false);
    assert.ok(result.reason, "an unsent notification must say why");
  }
});

test("the buyer link is still returned when the email cannot be sent", async () => {
  // This is what keeps a mail outage from stranding a paying learner: the link
  // reaches Max's alert so he can forward it by hand.
  const token = issueEntitlement({ sub: "buyer" }, 365, renalCardiacQuiz.scope);
  const outcome = await withEnv({}, () =>
    notify.emailBuyerAccessLink(renalCardiacQuiz, CAPTURE, token)
  );

  assert.equal(outcome.sent, false);
  assert.ok(outcome.link.includes("#unlock="), "the link must be returned even on failure");
});

test("a capture with no buyer email is reported, not thrown", async () => {
  const token = issueEntitlement({ sub: "buyer" }, 365, renalCardiacQuiz.scope);
  const outcome = await withEnv({ RESEND_API_KEY: "re_test" }, () =>
    notify.emailBuyerAccessLink(renalCardiacQuiz, { ...CAPTURE, payer: undefined }, token)
  );

  assert.equal(outcome.sent, false);
  assert.match(outcome.reason, /buyer email/i);
  assert.ok(outcome.link, "Max still needs the link to forward");
});

test("send() rejects an empty recipient list", async () => {
  await withEnv({ RESEND_API_KEY: "re_test" }, async () => {
    await assert.rejects(() => notify.send({ to: "  ", subject: "s", html: "h" }), /no recipient/);
  });
});

test("send() throws a typed error when no channel is configured", async () => {
  await withEnv({}, async () => {
    await assert.rejects(
      () => notify.send({ to: "someone@example.com", subject: "s", html: "h" }),
      (error) => error.code === "NO_MAIL"
    );
  });
});

// ── Content ────────────────────────────────────────────────────────────────

test("the manual-claim route notifies only after the response is sent", () => {
  // Ordering is the guarantee that a slow mail provider cannot delay, or a
  // failing one cannot break, the buyer's confirmation that their claim landed.
  const source = fs.readFileSync(path.join(process.cwd(), "src", "quiz", "router.js"), "utf8");
  const claimRoute = source.indexOf("/unlock/manual-claim");
  const respond = source.indexOf("res.json({ received: true })", claimRoute);
  const operatorMail = source.indexOf("notify.notifyManualPaymentClaim", claimRoute);
  const buyerMail = source.indexOf("notify.confirmClaimReceived", claimRoute);

  assert.ok(
    claimRoute > -1 && respond > -1 && operatorMail > -1 && buyerMail > -1,
    "manual-claim route wiring not found"
  );
  assert.ok(respond < operatorMail, "the response must be sent before the operator alert");
  assert.ok(respond < buyerMail, "the response must be sent before the buyer confirmation");
});

test("the manual-claim route never issues an entitlement on its own", () => {
  // Nothing about this route is verified — MoneyGram has no API to check
  // against. Only the operator's access code (a separate route) may grant access.
  const source = fs.readFileSync(path.join(process.cwd(), "src", "quiz", "router.js"), "utf8");
  const claimRoute = source.slice(
    source.indexOf('router.post("/unlock/manual-claim"'),
    source.indexOf('router.post("/unlock/code"')
  );
  assert.doesNotMatch(claimRoute, /issueEntitlement/);
});

// ── Client redemption ──────────────────────────────────────────────────────

test("the client redeems an unlock link and strips it from the address bar", () => {
  const js = fs.readFileSync(path.join(process.cwd(), "public", "js", "quiz-engine.js"), "utf8");

  assert.match(js, /adoptUnlockFromLink/, "the engine must redeem access links");
  assert.match(js, /unlock=/, "it reads the unlock fragment");
  assert.match(js, /replaceState/, "the token must not be left in the address bar");
  // Redemption has to run before the stored token is read, or the link is ignored
  // on any device that already has an attempt saved.
  assert.ok(
    js.indexOf("adoptUnlockFromLink() || loadEntitlement()") > -1,
    "the link must take precedence over stored state"
  );
});

test("both pages ship the asset version that contains link redemption", () => {
  for (const page of ["antimicrobial-quiz.html", "renal-cardiac-quiz.html"]) {
    const html = fs.readFileSync(path.join(process.cwd(), "public", page), "utf8");
    const css = html.match(/href="\/css\/quiz\.css\?v=(\d+)"/);
    const js = html.match(/src="\/js\/quiz-engine\.js\?v=(\d+)"/);
    assert.ok(css && js, `${page}: assets must carry a ?v= version`);
    assert.equal(css[1], js[1], `${page}: versions must be bumped together`);
    assert.ok(Number(js[1]) >= 5, `${page}: must ship at least v5, which added link redemption`);
  }
});
