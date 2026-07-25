// Structural, security and scoring tests for the NURS 5315 Renal, Urologic &
// Cardiac Pathophysiology Challenge, plus the cross-quiz isolation guarantees
// introduced when the engine was made multi-bank.
//
// No network: the Nemotron and PayPal integrations are exercised manually and by
// the fallback paths asserted here.

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { antimicrobialQuiz, renalCardiacQuiz, QUIZZES } from "../src/quiz/quizzes.js";
import {
  issueEntitlement,
  verifyEntitlement,
  opaqueOptionId,
  shuffleDeterministic,
} from "../src/quiz/signing.js";
import { gradeSubmission } from "../src/quiz/engine.js";
import { fallbackNotes, fallbackProbes, fallbackEvaluation } from "../src/quiz/nemotron.js";

const quiz = renalCardiacQuiz;
const bank = quiz.bank;
const engine = quiz.engine;
const QUESTIONS = bank.QUESTIONS;
const SALT = "renaltestsalt123";

// ── Bank integrity ─────────────────────────────────────────────────────────

test("bank holds exactly 100 questions and passes structural QC", () => {
  assert.equal(QUESTIONS.length, 100);
  assert.deepEqual(bank.validateBank(), []);
});

test("bank splits 50 free / 50 paid at the documented boundary", () => {
  const stats = bank.bankStats();
  assert.equal(stats.free, 50);
  assert.equal(stats.paid, 50);
  assert.equal(QUESTIONS.filter((q) => q.number <= 50).every((q) => q.isFree), true);
  assert.equal(QUESTIONS.filter((q) => q.number > 50).every((q) => !q.isFree), true);
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
  assert.equal(bank.bankStats().totalPoints, 106);
});

test("the ladder has questions at every difficulty it can reach", () => {
  // The ladder starts at 3, promotes to 5 and demotes to 2, so each of those
  // levels needs real items or selection silently collapses onto a neighbour.
  for (const level of [2, 3, 4, 5]) {
    const atLevel = QUESTIONS.filter((q) => q.difficulty === level);
    assert.ok(atLevel.length >= 2, `only ${atLevel.length} questions at level ${level}`);
  }
  assert.deepEqual([...bank.DIFFICULTIES], [2, 3, 4, 5]);
});

// ── Free/paid split integrity ──────────────────────────────────────────────

test("both halves span renal, urologic and cardiac content", () => {
  // The section files are topic-grouped, so a naive order would leave every
  // cardiac and urology item behind the paywall.
  const domainOf = (q) => {
    if (/Cardiac|Heart|Ischemic|Arrhythmi|Valvular|Vascular|Shock/.test(q.category)) return "cardiac";
    if (/Urologic/.test(q.category)) return "urologic";
    return "renal";
  };
  for (const half of ["free", "paid"]) {
    const questions = QUESTIONS.filter((q) => (half === "free" ? q.isFree : !q.isFree));
    const domains = new Set(questions.map(domainOf));
    for (const domain of ["renal", "urologic", "cardiac"]) {
      assert.ok(domains.has(domain), `${half} half has no ${domain} questions`);
    }
  }
});

test("no concept group straddles the paywall", () => {
  // A group split across the boundary would leave an unpaid learner unable to be
  // re-tested on a concept they missed.
  const groups = new Map();
  for (const q of QUESTIONS) {
    if (!groups.has(q.conceptKey)) groups.set(q.conceptKey, []);
    groups.get(q.conceptKey).push(q);
  }
  for (const [key, members] of groups) {
    if (members.length < 2) continue;
    const free = members.filter((q) => q.isFree).length;
    assert.ok(
      free === 0 || free === members.length,
      `concept "${key}" straddles the paywall: ${members.map((q) => `${q.id}:${q.isFree}`).join(" ")}`
    );
  }
});

test("the free half can re-test a missed concept without paying", () => {
  const freeGroups = new Map();
  for (const q of QUESTIONS.filter((x) => x.isFree)) {
    if (!freeGroups.has(q.conceptKey)) freeGroups.set(q.conceptKey, 0);
    freeGroups.set(q.conceptKey, freeGroups.get(q.conceptKey) + 1);
  }
  const withSiblings = [...freeGroups.values()].filter((n) => n > 1).length;
  assert.ok(withSiblings >= 8, `only ${withSiblings} re-testable concepts in the free half`);
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
  // The bank is authored with the correct option written first throughout, so the
  // per-attempt shuffle is the ONLY thing preventing a learner from pattern
  // matching on position. This asserts the property at the layer that reaches the
  // browser. See also the companion test below, which fails loudly if the shuffle
  // is ever removed.
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
  assert.ok(positions >= 4, `correct answers only reached ${positions} positions`);
  for (const [position, n] of Object.entries(counts)) {
    assert.ok(
      n <= total * 0.4,
      `position ${position} holds ${n} of ${total} served correct answers`
    );
  }
});

test("shuffling actually reorders options rather than passing them through", () => {
  // Guards the test above. Because every item is authored answer-first, a
  // pass-through shuffle would put the correct answer in position 0 every time
  // and hand learners a trivial strategy.
  const mcq = QUESTIONS.filter((q) => q.type === "mcq");
  const salt = "shufflecheck1";
  const movedFromFirst = mcq.filter((q) => {
    const order = shuffleDeterministic(q.options, `${salt}:${q.id}`);
    return order[0].id !== q.correct[0];
  }).length;

  assert.ok(
    movedFromFirst >= mcq.length * 0.5,
    `shuffle left the correct answer first in ${mcq.length - movedFromFirst} of ${mcq.length} items`
  );
});

// ── Cross-quiz entitlement isolation ───────────────────────────────────────

test("each quiz has its own entitlement scope and api base", () => {
  assert.notEqual(antimicrobialQuiz.scope, renalCardiacQuiz.scope);
  assert.notEqual(antimicrobialQuiz.apiBase, renalCardiacQuiz.apiBase);
  // The antimicrobial scope and path are frozen: unlocks have been sold on them.
  assert.equal(antimicrobialQuiz.scope, "antimicrobial-quiz:full");
  assert.equal(antimicrobialQuiz.apiBase, "/api/quiz");
});

test("paying for one quiz does not unlock the other", () => {
  const paidRenal = issueEntitlement({ sub: "buyer" }, 365, renalCardiacQuiz.scope);
  const paidAntimicrobial = issueEntitlement({ sub: "buyer" }, 365, antimicrobialQuiz.scope);

  assert.equal(verifyEntitlement(paidRenal, renalCardiacQuiz.scope).valid, true);
  assert.equal(verifyEntitlement(paidAntimicrobial, antimicrobialQuiz.scope).valid, true);

  assert.deepEqual(verifyEntitlement(paidRenal, antimicrobialQuiz.scope), {
    valid: false,
    reason: "wrong-scope",
  });
  assert.deepEqual(verifyEntitlement(paidAntimicrobial, renalCardiacQuiz.scope), {
    valid: false,
    reason: "wrong-scope",
  });
});

test("a legacy token with no quiz claim still unlocks the antimicrobial quiz", () => {
  // Tokens issued before the second quiz existed carry no `quiz` claim. They must
  // keep working, or a student who already paid loses access.
  const legacy = issueEntitlement({ sub: "old-buyer", source: "paypal" });
  const result = verifyEntitlement(legacy, antimicrobialQuiz.scope);
  assert.equal(result.valid, true);
  assert.equal(result.claims.quiz, undefined);
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
  for (let i = 0; i < 60; i += 1) {
    const { question } = engine.selectNext({ history, entitled: false, salt: SALT });
    if (!question) break;
    assert.equal(question.isFree, true, `${question.id} is paywalled`);
    history.push({ questionId: question.id, correct: i % 2 === 0 });
  }
  assert.equal(history.length, 50, "an unentitled learner should reach exactly 50 questions");
});

test("an entitled learner can reach all 100 questions", () => {
  const history = [];
  for (let i = 0; i < 120; i += 1) {
    const { question } = engine.selectNext({ history, entitled: true, salt: SALT });
    if (!question) break;
    history.push({ questionId: question.id, correct: i % 3 !== 0 });
  }
  assert.equal(history.length, 100);
  assert.equal(new Set(history.map((h) => h.questionId)).size, 100, "no question repeated");
});

test("difficulty starts at 3, rises after 3 correct and falls after 2 wrong", () => {
  const ids = QUESTIONS.map((q) => q.id);
  assert.equal(engine.deriveState([]).difficulty, 3);

  const threeRight = ids.slice(0, 3).map((id) => ({ questionId: id, correct: true }));
  assert.equal(engine.deriveState(threeRight).difficulty, 4);

  const twoWrong = ids.slice(0, 2).map((id) => ({ questionId: id, correct: false }));
  assert.equal(engine.deriveState(twoWrong).difficulty, 2);
});

test("a demotion below the bank's range resolves to the lowest level present", () => {
  assert.equal(engine.nearestAvailableDifficulty(1), 2);
  assert.equal(engine.nearestAvailableDifficulty(3), 3);
  assert.equal(engine.nearestAvailableDifficulty(5), 5);
});

test("a missed concept is re-tested with a different question in the same group", () => {
  // Find a free concept group with siblings, miss one, and confirm a sibling is
  // offered once the 3-question gap has elapsed.
  const groups = new Map();
  for (const q of QUESTIONS.filter((x) => x.isFree)) {
    if (!groups.has(q.conceptKey)) groups.set(q.conceptKey, []);
    groups.get(q.conceptKey).push(q);
  }
  const group = [...groups.values()].find((members) => members.length >= 2);
  assert.ok(group, "the free half must contain a concept group with siblings");

  const missed = group[0];
  const filler = QUESTIONS.filter(
    (q) => q.isFree && q.conceptKey !== missed.conceptKey && q.id !== missed.id
  ).slice(0, 3);

  const history = [
    { questionId: missed.id, correct: false },
    ...filler.map((q) => ({ questionId: q.id, correct: true })),
  ];

  const { question, isRemediation } = engine.selectNext({ history, entitled: false, salt: SALT });
  assert.ok(question, "a question should be offered");
  assert.equal(isRemediation, true, `expected a re-test, got ${question.id}`);
  assert.equal(question.conceptKey, missed.conceptKey);
  assert.notEqual(question.id, missed.id, "must not repeat the identical question");
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
  assert.ok(short.partialUnderstanding > 0, "partial overlap is tracked for analytics");

  const wrongExtra = sata.options.find((o) => !sata.correct.includes(o.id));
  const overreach = gradeSubmission(sata, [...sata.correct, wrongExtra.id]);
  assert.equal(overreach.isCorrect, false);
  assert.equal(overreach.pointsEarned, 0);
  assert.equal(overreach.partialUnderstanding, 0, "a false positive earns no partial credit");
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
  assert.equal(r.course, "NURS 5315");
  assert.equal(r.questionsAvailable, 100);
  // The page reads `categories`; `medicationClasses` stays as a compatibility alias.
  assert.deepEqual(r.categories, r.medicationClasses);
});

test("an unentitled results run reports only the free half as available", () => {
  const history = QUESTIONS.filter((q) => q.isFree)
    .slice(0, 10)
    .map((q) => ({ questionId: q.id, correct: true }));
  const r = engine.buildResults(history, false);
  assert.equal(r.questionsAvailable, 50);
  assert.equal(r.entitled, false);
});

test("missed questions carry their rationale for the review section", () => {
  const missed = QUESTIONS[0];
  const r = engine.buildResults([{ questionId: missed.id, correct: false }], false);
  assert.equal(r.missedQuestions.length, 1);
  const entry = r.missedQuestions[0];
  assert.equal(entry.id, missed.id);
  assert.ok(entry.rationale && entry.keyClue && entry.clinicalTakeaway);
  assert.ok(entry.category, "review entries need a category label");
});

// ── Tutor fallbacks ────────────────────────────────────────────────────────

test("tutor fallbacks always return usable content from the bank", () => {
  const q = QUESTIONS[0];

  const notes = fallbackNotes(q);
  assert.equal(notes.source, "fallback");
  assert.ok(notes.notes.length >= 1);
  assert.ok(notes.heading && notes.pitfall);

  const probes = fallbackProbes(q);
  assert.equal(probes.questions.length, 2);
  for (const p of probes.questions) assert.ok(p.trim().length > 10);

  const thin = fallbackEvaluation(q, ["", ""]);
  assert.equal(thin.understood, false);
  const full = fallbackEvaluation(q, [
    "Filtration happens at the glomerulus and everything after it edits the filtrate.",
    "I would assess perfusion and urine output, then notify the prescriber.",
  ]);
  assert.equal(full.understood, true);
  assert.ok(full.corrected.length > 0);
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

test("correct options avoid unsupported absolutes", () => {
  const absolutes = /\b(?:always|never|every patient|all patients|automatically|universal(?:ly)?)\b/i;
  const negativePolarity = /requires? (?:correction|clarification|immediate clarification)|needs? further teaching|indicates? a need for|most clearly represents/i;

  for (const q of QUESTIONS) {
    if (negativePolarity.test(q.stem)) continue;
    for (const id of q.correct) {
      const opt = q.options.find((o) => o.id === id);
      assert.doesNotMatch(opt.text, absolutes, `${q.id} correct option "${opt.text}"`);
    }
  }
});

test("no question text contains patient-identifying information", () => {
  // Ages and genders are fine; named individuals and identifiers are not.
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

// ── Registry and page wiring ───────────────────────────────────────────────

test("both quizzes are registered and their banks are independent", () => {
  assert.deepEqual(Object.keys(QUIZZES).sort(), ["antimicrobial", "renal-cardiac"]);
  const renalIds = new Set(QUESTIONS.map((q) => q.id));
  for (const q of antimicrobialQuiz.bank.QUESTIONS) {
    assert.equal(renalIds.has(q.id), false, `${q.id} appears in both banks`);
  }
  // A question id from one bank must not resolve in the other.
  assert.equal(bank.getQuestion("q001"), null);
  assert.equal(antimicrobialQuiz.bank.getQuestion("r001"), null);
});

test("the page wires itself to this quiz with its own storage keys", () => {
  const html = fs.readFileSync(
    path.join(process.cwd(), "public", "renal-cardiac-quiz.html"),
    "utf8"
  );

  assert.match(html, /apiBase:\s*"\/api\/patho-quiz"/);
  assert.match(html, /storeKey:\s*"sleek\.renalcardiac\.attempt\.v1"/);
  assert.match(html, /entitlementKey:\s*"sleek\.renalcardiac\.entitlement\.v1"/);
  assert.match(html, /name="robots"\s+content="noindex/);

  // Shared, versioned assets — bumped together.
  const css = html.match(/href="\/css\/quiz\.css\?v=(\d+)"/);
  const js = html.match(/src="\/js\/quiz-engine\.js\?v=(\d+)"/);
  assert.ok(css && js, "assets must carry a ?v= version");
  assert.equal(css[1], js[1]);

  // The two pages must not share storage keys, or progress would cross over.
  const other = fs.readFileSync(
    path.join(process.cwd(), "public", "antimicrobial-quiz.html"),
    "utf8"
  );
  assert.doesNotMatch(other, /sleek\.renalcardiac/);
  assert.doesNotMatch(html, /sleek\.antimicrobial/);
});
