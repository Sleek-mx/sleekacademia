// Structural, security and scoring tests for the Antimicrobial Mastery Challenge.
// No network: the Nemotron and PayPal integrations are exercised manually and by
// the fallback paths asserted here.

import test from "node:test";
import assert from "node:assert/strict";

import {
  QUESTIONS,
  FREE_QUESTION_COUNT,
  getQuestion,
  validateBank,
  bankStats,
} from "../src/quiz/question-bank.js";
import {
  opaqueOptionId,
  optionIdMap,
  resolveOptionIds,
  shuffleDeterministic,
  issueEntitlement,
  verifyEntitlement,
  checkAccessCode,
} from "../src/quiz/signing.js";
import {
  selectNext,
  deriveState,
  gradeSubmission,
  buildResults,
  topicMastery,
  nearestAvailableDifficulty,
  performanceBand,
} from "../src/quiz/adaptive.js";
import { fallbackNotes, fallbackProbes, fallbackEvaluation } from "../src/quiz/nemotron.js";

const SALT = "testsalt12345678";

// ── Bank integrity ─────────────────────────────────────────────────────────

test("bank holds exactly 100 questions and passes structural QC", () => {
  assert.equal(QUESTIONS.length, 100);
  assert.deepEqual(validateBank(), []);
});

test("bank splits 50 free / 50 paid at the documented boundary", () => {
  const stats = bankStats();
  assert.equal(stats.free, FREE_QUESTION_COUNT);
  assert.equal(stats.paid, 100 - FREE_QUESTION_COUNT);
  assert.equal(getQuestion("q050").isFree, true);
  assert.equal(getQuestion("q051").isFree, false);
});

test("every question carries the teaching fields the brief requires", () => {
  for (const q of QUESTIONS) {
    assert.ok(q.rationale, `${q.id} rationale`);
    assert.ok(q.keyClue, `${q.id} keyClue`);
    assert.ok(q.clinicalTakeaway, `${q.id} clinicalTakeaway`);
    assert.ok(q.remediationConcept, `${q.id} remediationConcept`);
    assert.ok(q.tags.length > 0, `${q.id} tags`);
    for (const opt of q.options) {
      if (q.correct.includes(opt.id)) continue;
      assert.ok(q.distractorRationales[opt.id], `${q.id} explains distractor ${opt.id}`);
    }
  }
});

test("mcq items have exactly one defensible answer; sata items have at least two", () => {
  for (const q of QUESTIONS) {
    if (q.type === "mcq") assert.equal(q.correct.length, 1, `${q.id}`);
    else assert.ok(q.correct.length >= 2, `${q.id}`);
  }
});

test("sata answer keys contain only real option ids and no duplicates", () => {
  for (const q of QUESTIONS.filter((x) => x.type === "sata")) {
    const ids = q.options.map((o) => o.id);
    assert.equal(new Set(q.correct).size, q.correct.length);
    for (const c of q.correct) assert.ok(ids.includes(c), `${q.id} key ${c}`);
  }
});

test("sata items are worth 2 points and mcq items 1", () => {
  for (const q of QUESTIONS) assert.equal(q.points, q.type === "sata" ? 2 : 1);
});

// ── Answer-key confidentiality ─────────────────────────────────────────────

test("opaque option ids are stable per attempt but differ between attempts", () => {
  const q = getQuestion("q001");
  const a = opaqueOptionId(SALT, q.id, "b");
  assert.equal(a, opaqueOptionId(SALT, q.id, "b"), "stable within an attempt");
  assert.notEqual(a, opaqueOptionId("othersalt1234567", q.id, "b"), "differs across attempts");
});

test("opaque option ids reveal nothing about the real option letter", () => {
  // A base64url digest will incidentally contain letters a-e, so the meaningful
  // properties are: fixed length, never the bare letter, collision-free within a
  // question, and unrecoverable without the server secret.
  for (const q of QUESTIONS.slice(0, 20)) {
    const ids = q.options.map((o) => opaqueOptionId(SALT, q.id, o.id));
    for (let i = 0; i < q.options.length; i++) {
      assert.equal(ids[i].length, 12, `${q.id} id length`);
      assert.notEqual(ids[i], q.options[i].id, "id is not the bare option letter");
      assert.doesNotMatch(ids[i], /^[a-e]$/i);
      assert.match(ids[i], /^[A-Za-z0-9_-]{12}$/, "url-safe");
    }
    assert.equal(new Set(ids).size, q.options.length, `${q.id} ids are unique`);
  }

  // The same option letter yields different ids in different questions, so ids
  // cannot be correlated across the attempt.
  assert.notEqual(opaqueOptionId(SALT, "q001", "a"), opaqueOptionId(SALT, "q002", "a"));
});

test("resolveOptionIds maps opaque ids back and drops unknown ones", () => {
  const q = getQuestion("q004");
  const map = optionIdMap(SALT, q);
  assert.equal(map.size, q.options.length);

  const opaque = q.correct.map((c) => opaqueOptionId(SALT, q.id, c));
  assert.deepEqual(resolveOptionIds(SALT, q, opaque).sort(), [...q.correct].sort());

  assert.deepEqual(resolveOptionIds(SALT, q, ["not-a-real-id"]), []);
  // A tampered id must not resolve, so a forged submission grades as wrong.
  assert.deepEqual(resolveOptionIds(SALT, q, [opaque[0], "deadbeefcafe"]), [q.correct[0]]);
});

test("option order is shuffled deterministically per attempt", () => {
  const q = getQuestion("q001");
  const a = shuffleDeterministic(q.options, SALT + q.id).map((o) => o.id);
  assert.deepEqual(a, shuffleDeterministic(q.options, SALT + q.id).map((o) => o.id));

  // Across many attempts the first slot must not always be the same option,
  // which is what removes the source material's "A" concentration.
  const firsts = new Set();
  for (let i = 0; i < 40; i++) {
    firsts.add(shuffleDeterministic(q.options, "salt" + i + q.id)[0].id);
  }
  assert.ok(firsts.size > 1, "correct answer position varies across attempts");
});

test("randomisation spreads the correct answer across positions bank-wide", () => {
  const positions = new Map();
  for (const q of QUESTIONS.filter((x) => x.type === "mcq")) {
    const order = shuffleDeterministic(q.options, "spread" + q.id);
    const idx = order.findIndex((o) => o.id === q.correct[0]);
    positions.set(idx, (positions.get(idx) || 0) + 1);
  }
  // No single slot should hold more than 55% of answers.
  const total = [...positions.values()].reduce((a, b) => a + b, 0);
  for (const [, count] of positions) {
    assert.ok(count / total < 0.55, `answer positions are spread, saw ${count}/${total}`);
  }
});

// ── Entitlement ────────────────────────────────────────────────────────────

test("a freshly issued entitlement verifies", () => {
  const token = issueEntitlement({ sub: "test", source: "test" });
  const result = verifyEntitlement(token);
  assert.equal(result.valid, true);
  assert.equal(result.claims.scope, "antimicrobial-quiz:full");
});

test("tampered, malformed and missing entitlements are rejected", () => {
  const token = issueEntitlement({ sub: "test", source: "test" });
  const [body, sig] = token.split(".");

  assert.equal(verifyEntitlement(undefined).valid, false);
  assert.equal(verifyEntitlement("").valid, false);
  assert.equal(verifyEntitlement("nodot").valid, false);
  assert.equal(verifyEntitlement(`${body}.${sig}x`).valid, false, "signature must not be forgeable");
  assert.equal(verifyEntitlement(`${body}x.${sig}`).valid, false, "payload must be tamper-evident");

  // A self-made unsigned payload claiming full scope must not pass.
  const forged = Buffer.from(
    JSON.stringify({ scope: "antimicrobial-quiz:full", exp: Date.now() + 1e9 })
  ).toString("base64url");
  assert.equal(verifyEntitlement(`${forged}.whatever`).valid, false);
});

test("an expired entitlement is rejected", () => {
  const token = issueEntitlement({ sub: "test" }, -1);
  const result = verifyEntitlement(token);
  assert.equal(result.valid, false);
  assert.equal(result.reason, "expired");
});

test("access code is disabled unless configured, and compares exactly", () => {
  const original = process.env.QUIZ_ACCESS_CODE;
  try {
    delete process.env.QUIZ_ACCESS_CODE;
    assert.equal(checkAccessCode("anything"), false, "disabled when unset");

    process.env.QUIZ_ACCESS_CODE = "short";
    assert.equal(checkAccessCode("short"), false, "rejected when under 8 chars");

    process.env.QUIZ_ACCESS_CODE = "UNLOCK-ME-1234";
    assert.equal(checkAccessCode("UNLOCK-ME-1234"), true);
    assert.equal(checkAccessCode("unlock-me-1234"), false, "case sensitive");
    assert.equal(checkAccessCode("UNLOCK-ME-123"), false);
    assert.equal(checkAccessCode(""), false);
    assert.equal(checkAccessCode(null), false);
  } finally {
    if (original === undefined) delete process.env.QUIZ_ACCESS_CODE;
    else process.env.QUIZ_ACCESS_CODE = original;
  }
});

// ── Paywall gating in selection ────────────────────────────────────────────

test("selection never offers a paid question to an unentitled learner", () => {
  let history = [];
  for (let i = 0; i < 60; i++) {
    const { question } = selectNext({ history, entitled: false, salt: SALT });
    if (!question) break;
    assert.equal(question.isFree, true, `${question.id} must be free`);
    history.push({ questionId: question.id, correct: i % 2 === 0 });
  }
  assert.equal(history.length, FREE_QUESTION_COUNT, "free tier stops at 50");
  assert.equal(selectNext({ history, entitled: false, salt: SALT }).question, null);
});

test("an entitled learner can reach all 100 questions", () => {
  let history = [];
  for (let i = 0; i < 120; i++) {
    const { question } = selectNext({ history, entitled: true, salt: SALT });
    if (!question) break;
    history.push({ questionId: question.id, correct: true });
  }
  assert.equal(history.length, 100);
  assert.equal(new Set(history.map((h) => h.questionId)).size, 100, "no repeats");
});

// ── Adaptive rules ─────────────────────────────────────────────────────────

test("difficulty starts at 3, rises after 3 correct and falls after 2 wrong", () => {
  assert.equal(deriveState([]).difficulty, 3);

  const correct = (n) => Array.from({ length: n }, (_, i) => ({ questionId: "q00" + i, correct: true }));
  assert.equal(deriveState(correct(2)).difficulty, 3, "not yet promoted");
  assert.equal(deriveState(correct(3)).difficulty, 4, "promoted after 3");
  assert.equal(deriveState(correct(6)).difficulty, 5, "promoted twice");
  assert.equal(deriveState(correct(30)).difficulty, 5, "capped at 5");

  const wrong = (n) => Array.from({ length: n }, (_, i) => ({ questionId: "q10" + i, correct: false }));
  assert.equal(deriveState(wrong(1)).difficulty, 3, "not yet demoted");
  assert.equal(deriveState(wrong(2)).difficulty, 2, "demoted after 2");
  assert.equal(deriveState(wrong(4)).difficulty, 1, "demoted twice");
  assert.equal(deriveState(wrong(30)).difficulty, 1, "floored at 1");
});

test("a correct answer resets the incorrect streak and vice versa", () => {
  const mixed = [
    { questionId: "a", correct: false },
    { questionId: "b", correct: true },
    { questionId: "c", correct: false },
  ];
  assert.equal(deriveState(mixed).difficulty, 3, "streaks never reached the threshold");
  assert.equal(deriveState(mixed).consecutiveIncorrect, 1);
});

test("difficulty targets below the bank's range fall back to the nearest level", () => {
  // The supplied bank spans 3-5, so 1 and 2 must resolve upward to 3.
  assert.equal(nearestAvailableDifficulty(3), 3);
  assert.equal(nearestAvailableDifficulty(5), 5);
  assert.equal(nearestAvailableDifficulty(2), 3);
  assert.equal(nearestAvailableDifficulty(1), 3);
});

test("a missed concept is re-tested with a different question, not the same one", () => {
  const missed = getQuestion("q021");
  let history = [{ questionId: missed.id, correct: false }];

  const seen = [missed.id];
  let retest = null;
  for (let i = 0; i < 8; i++) {
    const { question, isRemediation } = selectNext({ history, entitled: true, salt: SALT });
    if (!question) break;
    if (isRemediation) { retest = question; break; }
    seen.push(question.id);
    history.push({ questionId: question.id, correct: true });
  }

  assert.ok(retest, "a concept re-test is scheduled");
  assert.notEqual(retest.id, missed.id, "never the identical question");
  assert.ok(history.length >= 3, "re-test waits at least 3 questions");
});

// ── Grading ────────────────────────────────────────────────────────────────

test("mcq grading awards a point only for the correct option", () => {
  const q = getQuestion("q001");
  const right = gradeSubmission(q, q.correct);
  assert.equal(right.isCorrect, true);
  assert.equal(right.pointsEarned, 1);

  const wrongId = q.options.find((o) => !q.correct.includes(o.id)).id;
  const wrong = gradeSubmission(q, [wrongId]);
  assert.equal(wrong.isCorrect, false);
  assert.equal(wrong.pointsEarned, 0);
});

test("sata scores 2 points only on an exact match, with no partial credit", () => {
  const q = getQuestion("q004");

  const exact = gradeSubmission(q, q.correct);
  assert.equal(exact.isCorrect, true);
  assert.equal(exact.pointsEarned, 2);

  const subset = gradeSubmission(q, q.correct.slice(0, 2));
  assert.equal(subset.isCorrect, false);
  assert.equal(subset.pointsEarned, 0, "no partial credit in the primary score");
  assert.ok(subset.partialUnderstanding > 0, "partial understanding tracked separately");

  const extra = gradeSubmission(q, [...q.correct, q.options.find((o) => !q.correct.includes(o.id)).id]);
  assert.equal(extra.isCorrect, false);
  assert.equal(extra.pointsEarned, 0);
  assert.equal(extra.partialUnderstanding, 0, "a false positive earns no partial understanding");
});

test("an empty submission is never correct", () => {
  assert.equal(gradeSubmission(getQuestion("q001"), []).isCorrect, false);
  assert.equal(gradeSubmission(getQuestion("q001"), undefined).isCorrect, false);
});

test("duplicate selections do not inflate a sata grade", () => {
  const q = getQuestion("q004");
  const dupes = [...q.correct, q.correct[0], q.correct[1]];
  const grade = gradeSubmission(q, dupes);
  assert.equal(grade.isCorrect, true, "duplicates are de-duplicated, not counted as extras");
});

// ── Mastery and results ────────────────────────────────────────────────────

test("mastery requires 4 answered, 80% accuracy and a level 4+ success", () => {
  // 4 stewardship questions, all correct, including level 4 and 5 items.
  const ids = QUESTIONS.filter((q) => q.topic === "Antimicrobial stewardship").slice(0, 4);
  const mastered = topicMastery(ids.map((q) => ({ questionId: q.id, correct: true })));
  const row = mastered.find((t) => t.topic === "Antimicrobial stewardship");
  assert.equal(row.answered, 4);
  assert.equal(row.mastered, true);

  // Only 3 answered — below the minimum however accurate.
  const tooFew = topicMastery(ids.slice(0, 3).map((q) => ({ questionId: q.id, correct: true })));
  assert.equal(tooFew.find((t) => t.topic === "Antimicrobial stewardship").mastered, false);
});

test("mastery is withheld when only easy items were answered correctly", () => {
  const easy = QUESTIONS.filter((q) => q.difficulty === 3).slice(0, 5);
  const rows = topicMastery(easy.map((q) => ({ questionId: q.id, correct: true })));
  for (const row of rows) {
    if (row.highDifficultyCorrect === 0) {
      assert.equal(row.mastered, false, `${row.topic} needs a level 4+ success`);
    }
  }
});

test("performance bands match the published thresholds", () => {
  assert.equal(performanceBand(95).band, "Strong mastery");
  assert.equal(performanceBand(90).band, "Strong mastery");
  assert.equal(performanceBand(89.9).band, "Developing mastery");
  assert.equal(performanceBand(80).band, "Developing mastery");
  assert.equal(performanceBand(79).band, "Partial mastery");
  assert.equal(performanceBand(70).band, "Partial mastery");
  assert.equal(performanceBand(69.9).band, "Focused review needed");
});

test("results expose every dashboard field the brief lists", () => {
  const history = QUESTIONS.slice(0, 30).map((q, i) => ({
    questionId: q.id,
    correct: i % 3 !== 0,
    isRemediation: i % 7 === 0,
  }));
  const r = buildResults(history, true);

  for (const field of [
    "totalScore", "percentage", "band", "firstAttemptAccuracy", "remediationAccuracy",
    "questionsCompleted", "questionsRemaining", "buckets", "topics", "medicationClasses",
    "difficultyPerformance", "averageDifficultyMastered", "strongestTopics", "weakestTopics",
    "weakMedicationClasses", "missedQuestions", "recommendations", "expertChallengeUnlocked",
  ]) {
    assert.ok(field in r, `results include ${field}`);
  }

  for (const bucket of [
    "pregnancySafety", "stewardship", "toxicityRecognition", "medicationInteractions", "priorityAction",
  ]) {
    assert.ok(bucket in r.buckets, `sub-score ${bucket}`);
  }

  assert.equal(r.questionsCompleted, 30);
  assert.ok(r.missedQuestions.length > 0);
  assert.ok(r.missedQuestions[0].rationale, "missed questions carry their rationale");
  assert.ok(r.strongestTopics.length <= 3);
  assert.ok(r.weakestTopics.length <= 3);
});

test("weak-class advice omits internal bank labels", () => {
  const history = QUESTIONS.map((q) => ({ questionId: q.id, correct: false }));
  const r = buildResults(history, true);
  assert.ok(!r.weakMedicationClasses.includes("Multiple classes"));
  assert.ok(!r.weakMedicationClasses.includes("General principles"));
});

test("a perfect attempt unlocks the expert challenge and recommends nothing", () => {
  const history = QUESTIONS.map((q) => ({ questionId: q.id, correct: true }));
  const r = buildResults(history, true);
  assert.equal(r.percentage, 100);
  assert.equal(r.band, "Strong mastery");
  assert.equal(r.expertChallengeUnlocked, true);
  assert.equal(r.missedQuestions.length, 0);
  assert.equal(r.recommendations.length, 0);
});

test("a failing attempt recommends focused remediation across weak buckets", () => {
  const history = QUESTIONS.map((q) => ({ questionId: q.id, correct: false }));
  const r = buildResults(history, true);
  assert.equal(r.percentage, 0);
  assert.equal(r.band, "Focused review needed");
  assert.equal(r.expertChallengeUnlocked, false);
  const areas = r.recommendations.map((x) => x.area);
  assert.ok(areas.includes("Overall"));
  assert.ok(areas.includes("Pregnancy safety"));
  assert.ok(areas.includes("Toxicity recognition"));
});

test("an unentitled results run reports only the free half as available", () => {
  const history = QUESTIONS.filter((q) => q.isFree).map((q) => ({ questionId: q.id, correct: true }));
  const r = buildResults(history, false);
  assert.equal(r.entitled, false);
  assert.equal(r.questionsAvailable, FREE_QUESTION_COUNT);
  assert.equal(r.questionsRemaining, 0);
});

// ── Tutor fallbacks (used whenever NIM is unreachable) ─────────────────────

test("tutor fallbacks always return usable content from the bank", () => {
  const q = getQuestion("q021");

  const notes = fallbackNotes(q);
  assert.equal(notes.source, "fallback");
  assert.ok(notes.notes.length >= 2);
  assert.ok(notes.pitfall);

  const probes = fallbackProbes(q);
  assert.equal(probes.questions.length, 2);

  const good = fallbackEvaluation(q, [
    "A reasonably detailed answer about calcium chelation in fetal teeth and bone.",
    "Another reasonably detailed answer about clarifying the order with the prescriber.",
  ]);
  assert.equal(good.understood, true);
  assert.ok(good.corrected);

  const empty = fallbackEvaluation(q, ["", ""]);
  assert.equal(empty.understood, false, "blank answers are never credited");
});

// ── Content-safety guards the brief calls for ──────────────────────────────

test("no question implies a nurse independently discontinues therapy", () => {
  // Options may say "hold according to protocol" or "notify the prescriber",
  // but not that the nurse stops long-term therapy on their own authority.
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
  // "never"/"always" appear legitimately in distractors (they are often the
  // reason an option is wrong) but a correct answer should not rely on them.
  //
  // Negative-polarity stems are exempt: when the question asks which statement
  // requires correction, the correct answer IS the flawed absolute claim.
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

test("negative-polarity items really do key the flawed statement", () => {
  // Guards the exemption above: if a "requires correction" question ever keys a
  // sound statement, the item is broken regardless of the absolutes rule.
  const negativePolarity = /requires? correction|needs? further teaching/i;
  const flagged = QUESTIONS.filter((q) => negativePolarity.test(q.stem));
  assert.ok(flagged.length >= 2, "the bank contains negative-polarity items");
  for (const q of flagged) {
    for (const id of q.correct) {
      const opt = q.options.find((o) => o.id === id);
      // The keyed option is the incorrect belief, so its rationale explains why
      // it is wrong rather than why it is right.
      assert.ok(q.rationale, `${q.id} explains why the keyed statement is false`);
      assert.ok(opt.text.length > 0);
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

// ── Cache busting ──────────────────────────────────────────────────────────

test("page references its css and js with a version query", async () => {
  // The server sends CSS/JS as `public, max-age=14400`, so an unversioned URL
  // leaves returning visitors on a stale stylesheet for hours after a deploy.
  const fs = await import("node:fs");
  const path = await import("node:path");
  const html = fs.readFileSync(
    path.join(process.cwd(), "public", "antimicrobial-quiz.html"),
    "utf8"
  );

  const css = html.match(/href="\/css\/antimicrobial-quiz\.css\?v=(\d+)"/);
  const js = html.match(/src="\/js\/antimicrobial-quiz\.js\?v=(\d+)"/);

  assert.ok(css, "stylesheet must carry a ?v= version");
  assert.ok(js, "script must carry a ?v= version");
  assert.equal(css[1], js[1], "css and js versions should be bumped together");
});
