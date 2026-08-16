// Express router for a Sleek Academia adaptive quiz. One instance per quiz —
// see quizzes.js for the definitions.
//
// Three invariants the whole design rests on:
//
//   1. The answer key never leaves this process before submission. Questions are
//      sanitised, option ids are HMAC-derived per attempt, and grading happens
//      here — not in the browser.
//   2. Paid questions are neither served nor graded without a verified
//      entitlement. Entitlements are only ever issued by this server — either
//      from a verified Gumroad sale, or by the operator's access code after
//      manually confirming a backup payment. A client's own claim is never trusted.
//   3. Entitlements are scoped per quiz, so unlocking one quiz does not unlock
//      another.
//
// Gumroad is the primary automated checkout. The manual MoneyGram-to-mobile-money
// claim below remains available only as a backup when Gumroad cannot be used.

import express from "express";
import {
  opaqueOptionId,
  resolveOptionIds,
  shuffleDeterministic,
  issueEntitlement,
  entitlementFromRequest,
  checkAccessCode,
} from "./signing.js";
import { gradeSubmission } from "./engine.js";
import * as nemotron from "./nemotron.js";
import * as notify from "./notify.js";
import { MONEYGRAM_RECIPIENT, isPlausibleReference } from "./moneygram.js";
import { antimicrobialQuiz } from "./quizzes.js";

const MAX_HISTORY = 400;
const MAX_ANSWER_CHARS = 1500;

/**
 * @param {object} quiz - a definition from quizzes.js
 */
export function createQuizRouter(quiz = antimicrobialQuiz) {
  const router = express.Router();
  const { bank, engine, scope, tutorDomain, order } = quiz;
  const { QUESTIONS, FREE_QUESTION_COUNT, getQuestion } = bank;

  const bankProblems = bank.validateBank();
  if (bankProblems.length) {
    // Loud but non-fatal: the rest of the site should not fail to boot because
    // one question is malformed.
    console.error(`[quiz:${quiz.id}] question bank has ${bankProblems.length} problem(s):`);
    bankProblems.forEach((p) => console.error(`  - ${p}`));
  }

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
      category: question.category,
      medicationClass: question.category,
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
    return entitlementFromRequest(req, scope).valid;
  }

  /**
   * Guard for any route that must not serve a paid question to a learner who has
   * not unlocked. Returns the question, or null once it has answered the request.
   */
  function requireQuestion(req, res) {
    const question = getQuestion(req.body?.questionId);
    if (!question) {
      res.status(404).json({ error: "Unknown question." });
      return null;
    }
    if (!question.isFree && !isEntitled(req)) {
      res.status(402).json({ error: "This question requires the full-access unlock.", paywalled: true });
      return null;
    }
    return question;
  }

  // ── Config for the client ────────────────────────────────────────────────
  router.get("/config", (req, res) => {
    res.json({
      quizId: quiz.id,
      title: quiz.title,
      student: quiz.meta.student,
      course: quiz.meta.course,
      categoryLabel: quiz.categoryLabel,
      categoryLabelPlural: quiz.categoryLabelPlural,
      totalQuestions: QUESTIONS.length,
      freeQuestions: FREE_QUESTION_COUNT,
      unlockPriceUsd: order.price,
      entitled: isEntitled(req),
      moneygram: {
        phone: MONEYGRAM_RECIPIENT.phone,
        countryCode: MONEYGRAM_RECIPIENT.countryCode,
        recipientName: MONEYGRAM_RECIPIENT.recipientName,
        country: MONEYGRAM_RECIPIENT.country,
        receiveMethod: MONEYGRAM_RECIPIENT.receiveMethod,
      },
      tutor: { configured: nemotron.isConfigured(), model: nemotron.NEMOTRON_MODEL },
      bank: bankProblems.length
        ? { healthy: false, problems: bankProblems.length }
        : { healthy: true },
    });
  });

  // ── Next question ────────────────────────────────────────────────────────
  router.post("/next", (req, res) => {
    const salt = readSalt(req.body);
    if (!salt) return res.status(400).json({ error: "A valid attempt salt is required." });

    const history = readHistory(req.body);
    const entitled = isEntitled(req);

    const { question, reason, isRemediation } = engine.selectNext({ history, entitled, salt });

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
      state: engine.deriveState(history),
      answered: history.length,
      available: QUESTIONS.filter((q) => entitled || q.isFree).length,
    });
  });

  // ── Grade a submission ───────────────────────────────────────────────────
  router.post("/answer", (req, res) => {
    const salt = readSalt(req.body);
    if (!salt) return res.status(400).json({ error: "A valid attempt salt is required." });

    const question = requireQuestion(req, res);
    if (!question) return undefined;

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

    return res.json({
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
    const question = requireQuestion(req, res);
    if (!question) return undefined;

    const chosen = typeof req.body?.chosenText === "string" ? req.body.chosenText.slice(0, 400) : "";
    try {
      return res.json(await nemotron.generateNotes(question, chosen, tutorDomain));
    } catch (error) {
      console.error(`[quiz:${quiz.id}] notes error:`, error.message);
      return res.json(nemotron.fallbackNotes(question));
    }
  });

  router.post("/tutor/probes", async (req, res) => {
    const question = requireQuestion(req, res);
    if (!question) return undefined;

    try {
      return res.json(await nemotron.generateProbes(question, tutorDomain));
    } catch (error) {
      console.error(`[quiz:${quiz.id}] probes error:`, error.message);
      return res.json(nemotron.fallbackProbes(question));
    }
  });

  router.post("/tutor/evaluate", async (req, res) => {
    const question = requireQuestion(req, res);
    if (!question) return undefined;

    const probes = (Array.isArray(req.body?.probes) ? req.body.probes : [])
      .slice(0, 2)
      .map((p) => String(p).slice(0, 400));
    const answers = (Array.isArray(req.body?.answers) ? req.body.answers : [])
      .slice(0, 2)
      .map((a) => String(a ?? "").slice(0, MAX_ANSWER_CHARS));

    // Never fail this call with a 4xx. The learner is mid-remediation and a hard
    // error would strand them; the bank-derived fallback is always usable.
    if (probes.length < 2) {
      console.warn(`[quiz:${quiz.id}] evaluate called with ${probes.length} probe(s); using fallback`);
      return res.json(nemotron.fallbackEvaluation(question, answers));
    }

    try {
      return res.json(await nemotron.evaluateAnswers(question, probes, answers, tutorDomain));
    } catch (error) {
      console.error(`[quiz:${quiz.id}] evaluate error:`, error.message);
      return res.json(nemotron.fallbackEvaluation(question, answers));
    }
  });

  // ── Results ──────────────────────────────────────────────────────────────
  router.post("/results", (req, res) => {
    const history = readHistory(req.body);
    if (history.length === 0) return res.status(400).json({ error: "No answers to score." });
    return res.json(engine.buildResults(history, isEntitled(req)));
  });

  // ── Paywall: manual MoneyGram claim ──────────────────────────────────────
  //
  // No automated verification — MoneyGram has no public API for it. This route
  // only records the claim and alerts the operator; it never issues an
  // entitlement. The learner gets access once the operator confirms the payout
  // on the M-Pesa line and sends an access code by email (see "/unlock/code").
  router.post("/unlock/manual-claim", async (req, res) => {
    const email = typeof req.body?.email === "string" ? req.body.email.trim().slice(0, 200) : "";
    const reference =
      typeof req.body?.reference === "string" ? req.body.reference.trim().slice(0, 40) : "";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Enter a valid email address." });
    }
    if (!isPlausibleReference(reference)) {
      return res.status(400).json({
        error: "Enter the MoneyGram reference number shown on your receipt.",
      });
    }

    console.log(`[quiz:${quiz.id}] manual MoneyGram claim from ${email} (reference ${reference})`);

    // Respond first — a slow or failed notification must not make the buyer
    // think their claim was lost.
    res.json({ received: true });

    const claimAlert = await notify.notifyManualPaymentClaim(quiz, { email, reference });
    if (!claimAlert.sent) {
      console.error(`[quiz:${quiz.id}] claim alert did not send: ${claimAlert.reason}`);
    }
    await notify.confirmClaimReceived(quiz, email);
    return undefined;
  });

  // ── Paywall: tutor access code ───────────────────────────────────────────
  router.post("/unlock/code", (req, res) => {
    const code = typeof req.body?.code === "string" ? req.body.code : "";
    if (!checkAccessCode(code, quiz.accessCodeEnv)) {
      return res.status(403).json({ error: "That access code is not valid." });
    }
    return res.json({
      entitlement: issueEntitlement(
        { sub: "access-code", source: "access-code", quiz: quiz.id },
        180,
        scope
      ),
      source: "access-code",
    });
  });

  // ── Diagnostics ──────────────────────────────────────────────────────────
  router.get("/health", (_req, res) => {
    res.json({
      ok: bankProblems.length === 0,
      quizId: quiz.id,
      bank: bank.bankStats(),
      bankProblems: bankProblems.length,
      tutorConfigured: nemotron.isConfigured(),
      paywallMode: "gumroad-primary",
      paywallBackup: "manual-moneygram",
      moneygramRecipient: MONEYGRAM_RECIPIENT.phone,
      notifications: {
        configured: notify.isConfigured(),
        channel: notify.channel(),
        alertsTo: notify.notifyAddress(),
      },
    });
  });

  return router;
}
