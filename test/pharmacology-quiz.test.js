// Structural, security and scoring tests for the NURS 5334 Pharmacology Final
// Exam Review Challenge, plus the cross-quiz isolation guarantees the shared
// engine provides.
//
// No network: the Nemotron integration is exercised manually and by the
// fallback paths asserted here. MoneyGram has no automated verification to
// test — that path is covered by src/quiz/moneygram.js's own logic and by
// router.js's manual-claim route, which are shared with the other quizzes.

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { antimicrobialQuiz, renalCardiacQuiz, pharmacologyQuiz, QUIZZES } from "../src/quiz/quizzes.js";
import {
  issueEntitlement,
  verifyEntitlement,
  opaqueOptionId,
  shuffleDeterministic,
} from "../src/quiz/signing.js";
import { gradeSubmission } from "../src/quiz/engine.js";
import { fallbackNotes, fallbackProbes, fallbackEvaluation } from "../src/quiz/nemotron.js";

const quiz = pharmacologyQuiz;
const bank = quiz.bank;
const engine = quiz.engine;
const QUESTIONS = bank.QUESTIONS;
const SALT = "pharmtestsalt123";

// ── Bank integrity ─────────────────────────────────────────────────────────

test("bank holds exactly 70 questions and passes structural QC", () => {
  assert.equal(QUESTIONS.length, 70);
  assert.deepEqual(bank.validateBank(), []);
});

test("bank splits 30 free / 40 paid at the documented boundary", () => {
  const stats = bank.bankStats();
  assert.equal(stats.free, 30);
  assert.equal(stats.paid, 40);
  assert.equal(QUESTIONS.filter((q) => q.number <= 30).every((q) => q.isFree), true);
  assert.equal(QUESTIONS.filter((q) => q.number > 30).every((q) => !q.isFree), true);
});

test("every question carries the teaching fields the brief requires", () => {
  for (const q of QUESTIONS) {
    assert.ok(q.rationale?.trim(), `${q.id} rationale`);
    assert.ok(q.keyClue?.trim(), `${q.id} keyClue`);
    assert.ok(q.clinicalTakeaway?.trim(), `${q.id} clinicalTakeaway`);
    assert.ok(q.remediationConcept?.trim(), `${q.id} remediationConcept`);
    assert.ok(q.topic?.trim(), `${q.id} topic`);
    assert.ok(q.category?.trim(), `${q.id} category`);
    for (const opt of q.options) {
      if (q.correct.includes(opt.id)) continue;
      assert.ok(q.distractorRationales?.[opt.id]?.trim(), `${q.id} option ${opt.id}`);
    }
  }
});

test("remediationConcept stays within three sentences", () => {
  for (const q of QUESTIONS) {
    const sentences = q.remediationConcept.split(/(?<=[.!?])\s+/).filter(Boolean).length;
    assert.ok(sentences <= 3, `${q.id} has ${sentences} sentences`);
  }
});

test("sata items are worth 2 points and mcq items 1", () => {
  for (const q of QUESTIONS) {
    assert.equal(q.points, q.type === "sata" ? 2 : 1, `${q.id}`);
  }
});

test("the ladder has questions at every difficulty it can reach", () => {
  for (const level of [2, 3, 4, 5]) {
    const atLevel = QUESTIONS.filter((q) => q.difficulty === level);
    assert.ok(atLevel.length >= 2, `only ${atLevel.length} questions at level ${level}`);
  }
});

// ── Free/paid split integrity ──────────────────────────────────────────────

test("every section of the bank is represented in the free half", () => {
  // The section files are topic-grouped, so a naive file-order split would
  // leave endocrine, renal/GI, pain and autonomic pharmacology entirely behind
  // the paywall. Confirm the presentation order actually spreads sections.
  const categories = new Set(QUESTIONS.filter((q) => q.isFree).map((q) => q.category));
  for (const category of [
    "Pharmacokinetics", "Legal and regulatory", "Cardiovascular",
    "CNS and psychiatric", "Endocrine", "Renal and urologic",
    "Gastrointestinal", "Pain management", "Autonomic and safety",
  ]) {
    assert.ok(categories.has(category), `free half has no "${category}" questions`);
  }
});

test("every analytics bucket is represented in the free half", () => {
  const counts = {};
  for (const q of QUESTIONS.filter((x) => x.isFree)) {
    for (const b of q.buckets) counts[b] = (counts[b] || 0) + 1;
  }
  for (const key of bank.BUCKET_KEYS) {
    assert.ok(counts[key] > 0, `bucket ${key} has no free questions`);
  }
});

// ── Answer-key confidentiality ─────────────────────────────────────────────

test("option ids served to the browser are opaque and attempt-specific", () => {
  const q = QUESTIONS[0];
  const a = q.options.map((o) => opaqueOptionId(SALT, q.id, o.id));
  const b = q.options.map((o) => opaqueOptionId("differentsalt999", q.id, o.id));

  assert.equal(new Set(a).size, a.length, "ids collide within a question");
  for (const id of a) {
    assert.equal(id.length, 12);
    assert.match(id, /^[A-Za-z0-9_-]+$/);
  }
  assert.notDeepEqual(a, b, "ids must differ between attempts");
});

test("the correct answer is spread across option positions as served", () => {
  const mcq = QUESTIONS.filter((q) => q.type === "mcq");
  const counts = {};
  const salts = ["saltalpha111", "saltbravo222", "saltcharlie3"];

  for (const salt of salts) {
    for (const q of mcq) {
      const order = shuffleDeterministic(q.options, `${salt}:${q.id}`);
      const index = order.findIndex((o) => o.id === q.correct[0]);
      counts[index] = (counts[index] || 0) + 1;
    }
  }

  const total = mcq.length * salts.length;
  const positions = Object.keys(counts).length;
  assert.ok(positions >= 3, `correct answers only reached ${positions} positions`);
  for (const [position, n] of Object.entries(counts)) {
    assert.ok(
      n <= total * 0.5,
      `position ${position} holds ${n} of ${total} served correct answers`
    );
  }
});

// ── Cross-quiz entitlement isolation ───────────────────────────────────────

test("this quiz has its own entitlement scope and api base", () => {
  assert.notEqual(quiz.scope, antimicrobialQuiz.scope);
  assert.notEqual(quiz.scope, renalCardiacQuiz.scope);
  assert.notEqual(quiz.apiBase, antimicrobialQuiz.apiBase);
  assert.notEqual(quiz.apiBase, renalCardiacQuiz.apiBase);
  assert.equal(quiz.scope, "pharmacology-quiz:full");
  assert.equal(quiz.apiBase, "/api/pharm-quiz");
});

test("paying for another quiz does not unlock this one", () => {
  const paidRenal = issueEntitlement({ sub: "buyer" }, 365, renalCardiacQuiz.scope);
  const paidPharm = issueEntitlement({ sub: "buyer" }, 365, quiz.scope);

  assert.equal(verifyEntitlement(paidPharm, quiz.scope).valid, true);
  assert.deepEqual(verifyEntitlement(paidRenal, quiz.scope), {
    valid: false,
    reason: "wrong-scope",
  });
  assert.deepEqual(verifyEntitlement(paidPharm, renalCardiacQuiz.scope), {
    valid: false,
    reason: "wrong-scope",
  });
});

test("tampered and expired entitlements are rejected for this quiz", () => {
  const good = issueEntitlement({ sub: "buyer" }, 365, quiz.scope);
  const [body] = good.split(".");

  assert.equal(verifyEntitlement(`${body}.forgedsignature`, quiz.scope).valid, false);
  assert.equal(verifyEntitlement("not-a-token", quiz.scope).valid, false);
  assert.equal(verifyEntitlement(undefined, quiz.scope).valid, false);
  assert.equal(verifyEntitlement(issueEntitlement({ sub: "x" }, -1, quiz.scope), quiz.scope).reason, "expired");
});

// ── Adaptive selection and the paywall ─────────────────────────────────────

test("selection never offers a paid question to an unentitled learner", () => {
  const history = [];
  for (let i = 0; i < 45; i += 1) {
    const { question } = engine.selectNext({ history, entitled: false, salt: SALT });
    if (!question) break;
    assert.equal(question.isFree, true, `${question.id} is paywalled`);
    history.push({ questionId: question.id, correct: i % 2 === 0 });
  }
  assert.equal(history.length, 30, "an unentitled learner should reach exactly 30 questions");
});

test("an entitled learner can reach all 70 questions", () => {
  const history = [];
  for (let i = 0; i < 90; i += 1) {
    const { question } = engine.selectNext({ history, entitled: true, salt: SALT });
    if (!question) break;
    history.push({ questionId: question.id, correct: i % 3 !== 0 });
  }
  assert.equal(history.length, 70);
  assert.equal(new Set(history.map((h) => h.questionId)).size, 70, "no question repeated");
});

test("difficulty starts at 3, rises after 3 correct and falls after 2 wrong", () => {
  const ids = QUESTIONS.map((q) => q.id);
  assert.equal(engine.deriveState([]).difficulty, 3);

  const threeRight = ids.slice(0, 3).map((id) => ({ questionId: id, correct: true }));
  assert.equal(engine.deriveState(threeRight).difficulty, 4);

  const twoWrong = ids.slice(0, 2).map((id) => ({ questionId: id, correct: false }));
  assert.equal(engine.deriveState(twoWrong).difficulty, 2);
});

// ── Grading ────────────────────────────────────────────────────────────────

test("sata scores 2 points only on an exact match, with no partial credit", () => {
  const sata = QUESTIONS.find((q) => q.type === "sata");
  assert.ok(sata, "the bank contains sata items");

  const exact = gradeSubmission(sata, [...sata.correct]);
  assert.equal(exact.isCorrect, true);
  assert.equal(exact.pointsEarned, 2);

  const short = gradeSubmission(sata, sata.correct.slice(0, 1));
  assert.equal(short.isCorrect, false);
  assert.equal(short.pointsEarned, 0);
});

test("mcq grading awards a point only for the correct option", () => {
  const mcq = QUESTIONS.find((q) => q.type === "mcq");
  const wrong = mcq.options.find((o) => !mcq.correct.includes(o.id));

  assert.equal(gradeSubmission(mcq, mcq.correct).pointsEarned, 1);
  assert.equal(gradeSubmission(mcq, [wrong.id]).pointsEarned, 0);
  assert.equal(gradeSubmission(mcq, []).isCorrect, false);
});

// ── Results ────────────────────────────────────────────────────────────────

test("results expose the dashboard fields the page renders", () => {
  const history = QUESTIONS.slice(0, 20).map((q, i) => ({
    questionId: q.id,
    correct: i % 4 !== 0,
    isRemediation: false,
    partialUnderstanding: 0,
  }));
  const r = engine.buildResults(history, true);

  for (const field of [
    "student", "course", "totalScore", "pointsPossible", "percentage", "band",
    "questionsCompleted", "questionsRemaining", "questionsAvailable",
    "firstAttemptAccuracy", "buckets", "topics", "categories", "difficultyPerformance",
    "strongestTopics", "weakestTopics", "weakCategories", "missedQuestions",
    "recommendations",
  ]) {
    assert.ok(field in r, `results missing ${field}`);
  }
  assert.equal(r.course, "NURS 5334");
  assert.equal(r.questionsAvailable, 70);
});

test("an unentitled results run reports only the free half as available", () => {
  const history = QUESTIONS.filter((q) => q.isFree)
    .slice(0, 10)
    .map((q) => ({ questionId: q.id, correct: true }));
  const r = engine.buildResults(history, false);
  assert.equal(r.questionsAvailable, 30);
  assert.equal(r.entitled, false);
});

// ── Tutor fallbacks ────────────────────────────────────────────────────────

test("tutor fallbacks always return usable content from the bank", () => {
  const q = QUESTIONS[0];

  const notes = fallbackNotes(q);
  assert.equal(notes.source, "fallback");
  assert.ok(notes.notes.length >= 1);

  const probes = fallbackProbes(q);
  assert.equal(probes.questions.length, 2);

  const full = fallbackEvaluation(q, [
    "Absorption, distribution, metabolism and elimination happen in that order.",
    "I would check the level and any other interacting medications before dosing.",
  ]);
  assert.equal(full.understood, true);
});

// ── Content-safety guards the brief calls for ──────────────────────────────

test("no question implies a nurse independently discontinues therapy", () => {
  const banned = /\b(?:the nurse (?:should )?)?(?:independently|unilaterally) (?:stop|discontinue)/i;
  for (const q of QUESTIONS) {
    for (const opt of q.options) {
      if (!q.correct.includes(opt.id)) continue;
      assert.doesNotMatch(opt.text, banned, `${q.id} correct option`);
    }
    assert.doesNotMatch(q.rationale, banned, `${q.id} rationale`);
  }
});

test("no question text contains patient-identifying information", () => {
  const identifiers = /\b(?:MRN|MR#|SSN|date of birth|DOB)\b/i;
  for (const q of QUESTIONS) {
    assert.doesNotMatch(q.stem, identifiers, `${q.id} stem`);
  }
});

test("every stem is unique so no question is asked twice", () => {
  const stems = QUESTIONS.map((q) => q.stem.trim().toLowerCase());
  assert.equal(new Set(stems).size, stems.length);
});

test("stems do not reference commercial test-bank sources", () => {
  const banned = /\b(?:Elsevier|EAQ|NCLEX|ATI|HESI|Quizlet)\b/i;
  for (const q of QUESTIONS) {
    assert.doesNotMatch(q.stem, banned, `${q.id} stem`);
    assert.doesNotMatch(q.rationale, banned, `${q.id} rationale`);
  }
});

test("the quiz never names a specific student", () => {
  assert.doesNotMatch(quiz.meta.student, /\b[A-Z][a-z]+\s+[A-Z]\.?\b/, "meta.student looks like a real name");
});

// ── Registry and page wiring ───────────────────────────────────────────────

test("all three quizzes are registered and their banks are independent", () => {
  assert.deepEqual(Object.keys(QUIZZES).sort(), ["antimicrobial", "pharmacology", "renal-cardiac"]);
  const pharmIds = new Set(QUESTIONS.map((q) => q.id));
  for (const q of antimicrobialQuiz.bank.QUESTIONS) {
    assert.equal(pharmIds.has(q.id), false, `${q.id} appears in both banks`);
  }
  for (const q of renalCardiacQuiz.bank.QUESTIONS) {
    assert.equal(pharmIds.has(q.id), false, `${q.id} appears in both banks`);
  }
  assert.equal(bank.getQuestion("q001"), null);
  assert.equal(bank.getQuestion("r001"), null);
  assert.equal(antimicrobialQuiz.bank.getQuestion("p001"), null);
});

test("the page wires itself to this quiz with its own storage keys", () => {
  const html = fs.readFileSync(
    path.join(process.cwd(), "public", "pharmacology-quiz.html"),
    "utf8"
  );

  assert.match(html, /apiBase:\s*"\/api\/pharm-quiz"/);
  assert.match(html, /storeKey:\s*"sleek\.pharmacology\.attempt\.v1"/);
  assert.match(html, /entitlementKey:\s*"sleek\.pharmacology\.entitlement\.v1"/);
  assert.match(html, /name="robots"\s+content="noindex/);

  const css = html.match(/href="\/css\/quiz\.css\?v=(\d+)"/);
  const js = html.match(/src="\/js\/quiz-engine\.js\?v=(\d+)"/);
  assert.ok(css && js, "assets must carry a ?v= version");
  assert.equal(css[1], js[1]);

  const others = [
    fs.readFileSync(path.join(process.cwd(), "public", "antimicrobial-quiz.html"), "utf8"),
    fs.readFileSync(path.join(process.cwd(), "public", "renal-cardiac-quiz.html"), "utf8"),
  ];
  for (const other of others) {
    assert.doesNotMatch(other, /sleek\.pharmacology/);
  }
  assert.doesNotMatch(html, /sleek\.antimicrobial/);
  assert.doesNotMatch(html, /sleek\.renalcardiac/);
});
