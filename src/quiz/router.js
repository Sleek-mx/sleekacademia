// Express router for the NURS 5334 Antimicrobial Mastery Challenge.
//
// Two invariants the whole design rests on:
//
//   1. The answer key never leaves this process before submission. Questions are
//      sanitised, option ids are HMAC-derived per attempt, and grading happens
//      here — not in the browser.
//   2. Questions 51–100 are neither served nor graded without a verified
//      entitlement. Paying is proven by a server-side PayPal capture, never by
//      a client claim.

import express from "express";
import {
  QUESTIONS,
  FREE_QUESTION_COUNT,
  getQuestion,
  bankStats,
  validateBank,
} from "./question-bank.js";
import {
  opaqueOptionId,
  resolveOptionIds,
  shuffleDeterministic,
  issueEntitlement,
  entitlementFromRequest,
  checkAccessCode,
} from "./signing.js";
import { selectNext, deriveState, gradeSubmission, buildResults } from "./adaptive.js";
import * as nemotron from "./nemotron.js";
import * as paypal from "./paypal.js";

const MAX_HISTORY = 400;
const MAX_ANSWER_CHARS = 1500;

/**
 * Strip a question down to what the browser may see. Notably absent:
 * `correct`, `rationale`, `distractorRationales`, `clinicalTakeaway`.
 * Option order is shuffled and ids are opaque, so the payload carries no
 * signal about the answer.
 */
function sanitizeQuestion(question, salt) {
  const options = shuffleDeterministic(question.options, `${salt}:${question.id}`).map((o) => ({
    id: opaqueOptionId(salt, question.id, o.id),
    text: o.text,
  }));

  return {
    id: question.id,
    number: question.number,
    topic: question.topic,
    medicationClass: question.medicationClass,
    difficulty: question.difficulty,
    type: question.type,
    stem: question.stem,
    options,
    selectionCount: question.type === "sata" ? question.correct.length : 1,
    points: question.points,
    isFree: question.isFree,
  };
}

/** Normalise and bound the client-supplied history. */
function readHistory(body) {
  const raw = Array.isArray(body?.history) ? body.history : [];
  const seen = new Set();
  const history = [];

  for (const entry of raw.slice(0, MAX_HISTORY)) {
    const questionId = typeof entry?.questionId === "string" ? entry.questionId : null;
    if (!questionId || !getQuestion(questionId) || seen.has(questionId)) continue;
    seen.add(questionId);
    history.push({
      questionId,
      correct: entry.correct === true,
      isRemediation: entry.isRemediation === true,
      partialUnderstanding:
        typeof entry.partialUnderstanding === "number" ? entry.partialUnderstanding : 0,
    });
  }
  return history;
}

function readSalt(body) {
  const salt = body?.salt;
  if (typeof salt !== "string" || !/^[A-Za-z0-9_-]{8,64}$/.test(salt)) return null;
  return salt;
}

function isEntitled(req) {
  return entitlementFromRequest(req).valid;
}

export function createQuizRouter() {
  const router = express.Router();

  const bankProblems = validateBank();
  if (bankProblems.length) {
    // Loud but non-fatal: the rest of the site should not fail to boot because
    // one question is malformed.
    console.error(`[quiz] question bank has ${bankProblems.length} problem(s):`);
    bankProblems.forEach((p) => console.error(`  - ${p}`));
  }

  // ── Config for the client ────────────────────────────────────────────────
  router.get("/config", (req, res) => {
    const entitled = isEntitled(req);
    res.json({
      title: "NURS 5334 Antimicrobial Mastery Challenge",
      student: "Bryton B.",
      course: "NURS 5334",
      totalQuestions: QUESTIONS.length,
      freeQuestions: FREE_QUESTION_COUNT,
      unlockPriceUsd: paypal.UNLOCK_PRICE_USD,
      entitled,
      paypal: {
        configured: paypal.isConfigured(),
        clientId: paypal.clientId(),
        live: paypal.isLive(),
      },
      tutor: { configured: nemotron.isConfigured(), model: nemotron.NEMOTRON_MODEL },
      bank: bankProblems.length ? { healthy: false, problems: bankProblems.length } : { healthy: true },
    });
  });

  // ── Next question ────────────────────────────────────────────────────────
  router.post("/next", (req, res) => {
    const salt = readSalt(req.body);
    if (!salt) return res.status(400).json({ error: "A valid attempt salt is required." });

    const history = readHistory(req.body);
    const entitled = isEntitled(req);

    const { question, reason, isRemediation } = selectNext({ history, entitled, salt });

    if (!question) {
      const seenAll = history.length >= QUESTIONS.length;
      return res.json({
        question: null,
        complete: true,
        paywalled: !entitled && !seenAll,
        reason,
        answered: history.length,
      });
    }

    res.json({
      question: sanitizeQuestion(question, salt),
      isRemediation,
      reason,
      state: deriveState(history),
      answered: history.length,
      available: QUESTIONS.filter((q) => entitled || q.isFree).length,
    });
  });

  // ── Grade a submission ───────────────────────────────────────────────────
  router.post("/answer", (req, res) => {
    const salt = readSalt(req.body);
    if (!salt) return res.status(400).json({ error: "A valid attempt salt is required." });

    const question = getQuestion(req.body?.questionId);
    if (!question) return res.status(404).json({ error: "Unknown question." });

    if (!question.isFree && !isEntitled(req)) {
      return res.status(402).json({ error: "This question requires the full-access unlock.", paywalled: true });
    }

    const submitted = Array.isArray(req.body?.selected) ? req.body.selected.slice(0, 10) : [];
    if (submitted.length === 0) {
      return res.status(400).json({ error: "Select an answer before submitting." });
    }
    if (question.type === "sata" && submitted.length < question.correct.length) {
      return res.status(400).json({
        error: `This item requires ${question.correct.length} selections.`,
        selectionCount: question.correct.length,
      });
    }

    const selectedReal = resolveOptionIds(salt, question, submitted);
    const grade = gradeSubmission(question, selectedReal);

    // Only now does any answer-key information leave the server.
    const optionFeedback = question.options.map((o) => ({
      id: opaqueOptionId(salt, question.id, o.id),
      text: o.text,
      isCorrect: question.correct.includes(o.id),
      wasSelected: selectedReal.includes(o.id),
      explanation:
        question.distractorRationales?.[o.id] ||
        (question.correct.includes(o.id) ? "Correct — see the rationale below." : null),
    }));

    res.json({
      questionId: question.id,
      ...grade,
      options: optionFeedback,
      rationale: question.rationale,
      keyClue: question.keyClue,
      clinicalTakeaway: question.clinicalTakeaway,
      remediationConcept: question.remediationConcept,
      difficulty: question.difficulty,
      topic: question.topic,
    });
  });

  // ── Nemotron remediation loop ────────────────────────────────────────────

  router.post("/tutor/notes", async (req, res) => {
    const question = getQuestion(req.body?.questionId);
    if (!question) return res.status(404).json({ error: "Unknown question." });
    if (!question.isFree && !isEntitled(req)) {
      return res.status(402).json({ error: "Full access required.", paywalled: true });
    }

    const chosen = typeof req.body?.chosenText === "string" ? req.body.chosenText.slice(0, 400) : "";
    try {
      res.json(await nemotron.generateNotes(question, chosen));
    } catch (error) {
      console.error("[quiz] notes error:", error.message);
      res.json(nemotron.fallbackNotes(question));
    }
  });

  router.post("/tutor/probes", async (req, res) => {
    const question = getQuestion(req.body?.questionId);
    if (!question) return res.status(404).json({ error: "Unknown question." });
    if (!question.isFree && !isEntitled(req)) {
      return res.status(402).json({ error: "Full access required.", paywalled: true });
    }

    try {
      res.json(await nemotron.generateProbes(question));
    } catch (error) {
      console.error("[quiz] probes error:", error.message);
      res.json(nemotron.fallbackProbes(question));
    }
  });

  router.post("/tutor/evaluate", async (req, res) => {
    const question = getQuestion(req.body?.questionId);
    if (!question) return res.status(404).json({ error: "Unknown question." });
    if (!question.isFree && !isEntitled(req)) {
      return res.status(402).json({ error: "Full access required.", paywalled: true });
    }

    const probes = (Array.isArray(req.body?.probes) ? req.body.probes : [])
      .slice(0, 2)
      .map((p) => String(p).slice(0, 400));
    const answers = (Array.isArray(req.body?.answers) ? req.body.answers : [])
      .slice(0, 2)
      .map((a) => String(a ?? "").slice(0, MAX_ANSWER_CHARS));

    if (probes.length < 2) return res.status(400).json({ error: "Two probe questions are required." });

    try {
      res.json(await nemotron.evaluateAnswers(question, probes, answers));
    } catch (error) {
      console.error("[quiz] evaluate error:", error.message);
      res.json(nemotron.fallbackEvaluation(question, answers));
    }
  });

  // ── Results ──────────────────────────────────────────────────────────────
  router.post("/results", (req, res) => {
    const history = readHistory(req.body);
    if (history.length === 0) return res.status(400).json({ error: "No answers to score." });
    res.json(buildResults(history, isEntitled(req)));
  });

  // ── Paywall: PayPal ──────────────────────────────────────────────────────

  router.post("/unlock/paypal/create", async (req, res) => {
    if (!paypal.isConfigured()) {
      return res.status(503).json({ error: "Payment is not configured on this server." });
    }
    try {
      const order = await paypal.createOrder();
      res.json({ orderId: order.id, status: order.status });
    } catch (error) {
      console.error("[quiz] create order failed:", error.response?.data || error.message);
      res.status(502).json({ error: "Could not start checkout. Please try again." });
    }
  });

  router.post("/unlock/paypal/capture", async (req, res) => {
    if (!paypal.isConfigured()) {
      return res.status(503).json({ error: "Payment is not configured on this server." });
    }

    try {
      const result = await paypal.captureOrder(req.body?.orderId);
      if (!result.ok) {
        return res.status(402).json({ error: "Payment was not completed.", reason: result.reason });
      }

      const entitlement = issueEntitlement({
        sub: result.payer || "paypal-payer",
        source: "paypal",
        orderId: result.orderId,
        captureId: result.captureId,
      });

      console.log(
        `[quiz] unlock granted via PayPal order ${result.orderId} (capture ${result.captureId}, ${result.amount} USD)`
      );
      res.json({ entitlement, amount: result.amount, orderId: result.orderId });
    } catch (error) {
      console.error("[quiz] capture failed:", error.response?.data || error.message);
      res.status(502).json({ error: "Could not confirm payment. Please contact support." });
    }
  });

  // ── Paywall: tutor access code ───────────────────────────────────────────
  router.post("/unlock/code", (req, res) => {
    const code = typeof req.body?.code === "string" ? req.body.code : "";
    if (!checkAccessCode(code)) {
      return res.status(403).json({ error: "That access code is not valid." });
    }
    res.json({
      entitlement: issueEntitlement({ sub: "access-code", source: "access-code" }, 180),
      source: "access-code",
    });
  });

  // ── Diagnostics ──────────────────────────────────────────────────────────
  router.get("/health", (_req, res) => {
    res.json({
      ok: bankProblems.length === 0,
      bank: bankStats(),
      bankProblems: bankProblems.length,
      tutorConfigured: nemotron.isConfigured(),
      paypalConfigured: paypal.isConfigured(),
      paypalLive: paypal.isLive(),
      payee: paypal.payeeEmail(),
    });
  });

  return router;
}
