// Tests for the automated quiz unlock triggered by a verified Gumroad sale.
//
// No network: the mail channel is left unconfigured except where a send is
// exercised, and there the Resend transport is stubbed through axios.

import assert from "node:assert/strict";
import test from "node:test";

import axios from "axios";

import { unlockQuizFromGumroadSale } from "../src/quiz/gumroad-unlock.js";
import { verifyEntitlement } from "../src/quiz/signing.js";
import { antimicrobialQuiz, renalCardiacQuiz } from "../src/quiz/quizzes.js";

const MAIL_ENV = ["RESEND_API_KEY", "RESEND_FROM", "SMTP_HOST", "SMTP_USER", "SMTP_PASS", "SMTP_PORT", "QUIZ_NOTIFY_EMAIL", "NOTIFICATION_EMAIL", "PUBLIC_BASE_URL"];

async function withEnv(overrides, fn) {
  const saved = {};
  for (const key of MAIL_ENV) saved[key] = process.env[key];
  for (const key of MAIL_ENV) delete process.env[key];
  Object.assign(process.env, overrides);
  try {
    return await fn();
  } finally {
    for (const key of MAIL_ENV) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
  }
}

function captureSends(fn) {
  const sent = [];
  const original = axios.post;
  axios.post = async (url, body) => {
    sent.push({ url, body });
    return { data: { id: "stub" } };
  };
  return Promise.resolve(fn(sent)).finally(() => { axios.post = original; });
}

test("an unknown quiz id is reported, not thrown", async () => {
  const result = await unlockQuizFromGumroadSale({
    quizId: "not-a-real-quiz", buyerEmail: "buyer@example.com", saleId: "gum_1", priceCents: 1000,
  });
  assert.equal(result.ok, false);
  assert.equal(result.reason, "unknown-quiz");
});

test("a verified sale mints an entitlement scoped to the right quiz", async () => {
  const result = await withEnv({}, () => unlockQuizFromGumroadSale({
    quizId: renalCardiacQuiz.id, buyerEmail: "buyer@example.com", saleId: "gum_2", priceCents: 1000,
  }));
  assert.equal(result.ok, true);
  assert.match(result.link, /\/renal-cardiac-quiz#unlock=/);

  const verified = verifyEntitlement(decodeURIComponent(result.link.split("#unlock=")[1]), renalCardiacQuiz.scope);
  assert.equal(verified.valid, true);

  // The same token must not unlock a different quiz.
  const wrongQuiz = verifyEntitlement(decodeURIComponent(result.link.split("#unlock=")[1]), antimicrobialQuiz.scope);
  assert.equal(wrongQuiz.valid, false);
});

test("the buyer gets an access-link email and Max gets a sale alert", async () => {
  await withEnv({ RESEND_API_KEY: "test-key" }, () => captureSends(async (sent) => {
    await unlockQuizFromGumroadSale({
      quizId: renalCardiacQuiz.id, buyerEmail: "buyer@example.com", saleId: "gum_3", priceCents: 1000,
    });
    assert.equal(sent.length, 2);
    const buyerMail = sent.find((entry) => entry.body.to.includes("buyer@example.com"));
    assert.ok(buyerMail, "the buyer must receive their access link");
    assert.match(buyerMail.body.html, /#unlock=/);
    const ownerMail = sent.find((entry) => !entry.body.to.includes("buyer@example.com"));
    assert.ok(ownerMail, "Max must be alerted of the sale");
    assert.match(ownerMail.body.html, /gumroad/i);
    assert.match(ownerMail.body.html, /gum_3/);
  }));
});

test("a missing buyer email still returns the link so it can be forwarded by hand", async () => {
  const result = await withEnv({}, () => unlockQuizFromGumroadSale({
    quizId: renalCardiacQuiz.id, buyerEmail: "", saleId: "gum_4", priceCents: 1000,
  }));
  assert.equal(result.ok, true);
  assert.match(result.link, /#unlock=/);
});
