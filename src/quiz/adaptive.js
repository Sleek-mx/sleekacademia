// Adaptive selection, mastery rules and scoring.
//
// Runs server-side so the answer key, and the difficulty/topic metadata used to
// pick the next item, never need to reach the browser. The client posts back an
// attempt history; this module is otherwise stateless.
//
// IMPORTANT — difficulty range: the supplied bank spans levels 3–5 only. The
// brief describes a 1–5 ladder, so requests to descend below 3 resolve to the
// nearest level that actually exists (see nearestAvailableDifficulty). If
// level 1–2 items are added later this file needs no change.

import { QUESTIONS, FREE_QUESTION_COUNT, getQuestion } from "./question-bank.js";
import { shuffleDeterministic } from "./signing.js";

export const START_DIFFICULTY = 3;
export const PROMOTE_AFTER_CORRECT = 3;
export const DEMOTE_AFTER_INCORRECT = 2;
/** A concept re-test is scheduled this many questions ahead. */
export const REMEDIATION_GAP_MIN = 3;
export const REMEDIATION_GAP_MAX = 5;

export const MASTERY_MIN_ANSWERED = 4;
export const MASTERY_MIN_ACCURACY = 0.8;
export const MASTERY_HIGH_DIFFICULTY = 4;

const AVAILABLE_DIFFICULTIES = [...new Set(QUESTIONS.map((q) => q.difficulty))].sort();

export function nearestAvailableDifficulty(target) {
  if (AVAILABLE_DIFFICULTIES.includes(target)) return target;
  return AVAILABLE_DIFFICULTIES.reduce((best, d) =>
    Math.abs(d - target) < Math.abs(best - target) ? d : best
  );
}

/**
 * @typedef {object} HistoryEntry
 * @property {string} questionId
 * @property {boolean} correct         - fully correct on this attempt
 * @property {boolean} [isRemediation] - this was a scheduled concept re-test
 * @property {number} [index]          - position in the attempt (1-based)
 */

/**
 * Derive current adaptive state from the full history. Recomputing from scratch
 * keeps the client's stored state from drifting out of sync with the rules.
 */
export function deriveState(history = []) {
  let difficulty = START_DIFFICULTY;
  let consecutiveCorrect = 0;
  let consecutiveIncorrect = 0;

  for (const entry of history) {
    if (entry.correct) {
      consecutiveCorrect += 1;
      consecutiveIncorrect = 0;
      if (consecutiveCorrect >= PROMOTE_AFTER_CORRECT) {
        difficulty = Math.min(5, difficulty + 1);
        consecutiveCorrect = 0;
      }
    } else {
      consecutiveIncorrect += 1;
      consecutiveCorrect = 0;
      if (consecutiveIncorrect >= DEMOTE_AFTER_INCORRECT) {
        difficulty = Math.max(1, difficulty - 1);
        consecutiveIncorrect = 0;
      }
    }
  }

  return {
    difficulty,
    effectiveDifficulty: nearestAvailableDifficulty(difficulty),
    consecutiveCorrect,
    consecutiveIncorrect,
    answered: history.length,
  };
}

/** Concepts the learner missed and has not yet re-demonstrated. */
export function remediationQueue(history = []) {
  const missed = new Map(); // remediationConcept -> {concept, questionIds, dueAt}
  history.forEach((entry, i) => {
    const q = getQuestion(entry.questionId);
    if (!q) return;
    const key = q.remediationConcept;
    if (!entry.correct) {
      if (!missed.has(key)) {
        missed.set(key, { concept: key, topic: q.topic, questionIds: [], dueAfter: i + 1 });
      }
      missed.get(key).questionIds.push(q.id);
      missed.get(key).dueAfter = i + 1;
    }
  });

  // A concept leaves the queue once it has been answered correctly after being missed.
  for (const entry of history) {
    const q = getQuestion(entry.questionId);
    if (!q || !entry.correct) continue;
    const item = missed.get(q.remediationConcept);
    if (item && item.dueAfter < history.indexOf(entry) + 1) {
      missed.delete(q.remediationConcept);
    }
  }

  return [...missed.values()];
}

/**
 * Pick the next question.
 *
 * Priority:
 *   1. A due concept re-test (same remediationConcept, different question),
 *      scheduled 3–5 questions after the miss.
 *   2. An unseen question at the current effective difficulty.
 *   3. An unseen question at the nearest difficulty.
 *
 * @returns {{question: object|null, reason: string, isRemediation: boolean}}
 */
export function selectNext({ history = [], entitled = false, salt = "seed" } = {}) {
  const seen = new Set(history.map((h) => h.questionId));
  const state = deriveState(history);
  const position = history.length + 1;

  const pool = QUESTIONS.filter((q) => {
    if (seen.has(q.id)) return false;
    if (!entitled && !q.isFree) return false;
    return true;
  });

  if (pool.length === 0) {
    return { question: null, reason: "exhausted", isRemediation: false };
  }

  // 1. Due concept re-tests. Never the identical question, and only once the
  //    3-question gap has elapsed so the learner does not see it immediately.
  const queue = remediationQueue(history);
  for (const item of queue) {
    const gap = position - item.dueAfter;
    if (gap < REMEDIATION_GAP_MIN) continue;
    const candidates = pool.filter(
      (q) => q.remediationConcept === item.concept && !item.questionIds.includes(q.id)
    );
    if (candidates.length) {
      const picked = shuffleDeterministic(candidates, `${salt}:remed:${position}`)[0];
      return { question: picked, reason: "remediation-retest", isRemediation: true };
    }
    // No sibling item for that exact concept — fall back to the same topic.
    const topicMatches = pool.filter(
      (q) => q.topic === item.topic && !item.questionIds.includes(q.id)
    );
    if (topicMatches.length && gap <= REMEDIATION_GAP_MAX + 2) {
      const picked = shuffleDeterministic(topicMatches, `${salt}:remedtopic:${position}`)[0];
      return { question: picked, reason: "remediation-topic", isRemediation: true };
    }
  }

  // 2/3. Difficulty-targeted selection, widening outward until something fits.
  const target = state.effectiveDifficulty;
  const byDistance = [...pool].sort(
    (a, b) => Math.abs(a.difficulty - target) - Math.abs(b.difficulty - target)
  );
  const bestDistance = Math.abs(byDistance[0].difficulty - target);
  const atBest = byDistance.filter((q) => Math.abs(q.difficulty - target) === bestDistance);
  const picked = shuffleDeterministic(atBest, `${salt}:pick:${position}`)[0];

  return {
    question: picked,
    reason: bestDistance === 0 ? "difficulty-match" : "difficulty-nearest",
    isRemediation: false,
  };
}

// ── Grading ────────────────────────────────────────────────────────────────

/**
 * Grade one submission.
 * SATA earns its 2 points only when the selection matches exactly — no partial
 * credit in the primary score. Partial overlap is reported separately for
 * analytics, per the brief.
 */
export function gradeSubmission(question, selectedIds) {
  const selected = [...new Set(selectedIds || [])];
  const correct = question.correct;

  const hits = selected.filter((id) => correct.includes(id));
  const misses = correct.filter((id) => !selected.includes(id));
  const falsePositives = selected.filter((id) => !correct.includes(id));

  const isCorrect = misses.length === 0 && falsePositives.length === 0 && selected.length > 0;
  const partialCredit =
    question.type === "sata" && !isCorrect && hits.length > 0 && falsePositives.length === 0
      ? hits.length / correct.length
      : 0;

  return {
    isCorrect,
    pointsEarned: isCorrect ? question.points : 0,
    pointsPossible: question.points,
    partialUnderstanding: Number(partialCredit.toFixed(2)),
    selectedCount: selected.length,
    correctCount: correct.length,
    hitCount: hits.length,
    missedCount: misses.length,
    incorrectlySelectedCount: falsePositives.length,
  };
}

// ── Mastery and results ────────────────────────────────────────────────────

/**
 * A topic is mastered when the learner answered >=4 of its questions, reached
 * >=80% accuracy, and got at least one level 4 or 5 item right.
 */
export function topicMastery(history = []) {
  const topics = new Map();

  for (const entry of history) {
    const q = getQuestion(entry.questionId);
    if (!q) continue;
    if (!topics.has(q.topic)) {
      topics.set(q.topic, {
        topic: q.topic,
        answered: 0,
        correct: 0,
        highDifficultyCorrect: 0,
        difficultySum: 0,
      });
    }
    const t = topics.get(q.topic);
    t.answered += 1;
    t.difficultySum += q.difficulty;
    if (entry.correct) {
      t.correct += 1;
      if (q.difficulty >= MASTERY_HIGH_DIFFICULTY) t.highDifficultyCorrect += 1;
    }
  }

  return [...topics.values()]
    .map((t) => {
      const accuracy = t.answered ? t.correct / t.answered : 0;
      return {
        ...t,
        accuracy: Number(accuracy.toFixed(3)),
        averageDifficulty: Number((t.difficultySum / t.answered).toFixed(2)),
        mastered:
          t.answered >= MASTERY_MIN_ANSWERED &&
          accuracy >= MASTERY_MIN_ACCURACY &&
          t.highDifficultyCorrect >= 1,
      };
    })
    .sort((a, b) => b.accuracy - a.accuracy || b.answered - a.answered);
}

function accuracyGroup(history, keyFn) {
  const groups = new Map();
  for (const entry of history) {
    const q = getQuestion(entry.questionId);
    if (!q) continue;
    for (const key of [].concat(keyFn(q))) {
      if (key === undefined || key === null) continue;
      if (!groups.has(key)) groups.set(key, { key, answered: 0, correct: 0 });
      const g = groups.get(key);
      g.answered += 1;
      if (entry.correct) g.correct += 1;
    }
  }
  return [...groups.values()].map((g) => ({
    ...g,
    accuracy: g.answered ? Number((g.correct / g.answered).toFixed(3)) : 0,
  }));
}

export function performanceBand(percentage) {
  if (percentage >= 90) return { band: "Strong mastery", key: "strong" };
  if (percentage >= 80) return { band: "Developing mastery", key: "developing" };
  if (percentage >= 70) return { band: "Partial mastery", key: "partial" };
  return { band: "Focused review needed", key: "focused-review" };
}

const RECOMMENDATIONS = {
  pregnancySafety:
    "Review tetracyclines, aminoglycosides, folate antagonists, and risk-benefit assessment in pregnancy.",
  stewardship:
    "Review cultures, empiric versus definitive therapy, de-escalation, and asymptomatic bacteriuria.",
  toxicityRecognition:
    "Review vancomycin, aminoglycosides, sulfonamides, fluoroquinolones, linezolid, and amphotericin B toxicities.",
  medicationInteractions:
    "Review chelation, QT prolongation, serotonergic interactions, warfarin interactions, alcohol with metronidazole, and rifampin enzyme induction.",
  priorityAction:
    "Review nursing prioritization: airway-first reasoning, hold-per-protocol language, and when to obtain urgent evaluation.",
};

const BUCKET_LABELS = {
  pregnancySafety: "Pregnancy safety",
  stewardship: "Stewardship",
  toxicityRecognition: "Toxicity recognition",
  medicationInteractions: "Medication interactions",
  priorityAction: "Priority action",
};

/**
 * Build the full results payload for the dashboard.
 * @param {HistoryEntry[]} history
 * @param {boolean} entitled - whether all 100 questions were available
 */
export function buildResults(history = [], entitled = false) {
  const detailed = history
    .map((entry) => ({ entry, question: getQuestion(entry.questionId) }))
    .filter((x) => x.question);

  const firstAttempts = detailed.filter((x) => !x.entry.isRemediation);
  const remediationAttempts = detailed.filter((x) => x.entry.isRemediation);

  const pointsEarned = detailed.reduce(
    (sum, x) => sum + (x.entry.correct ? x.question.points : 0),
    0
  );
  const pointsPossible = detailed.reduce((sum, x) => sum + x.question.points, 0);
  const percentage = pointsPossible ? (pointsEarned / pointsPossible) * 100 : 0;

  const available = QUESTIONS.filter((q) => entitled || q.isFree).length;

  const buckets = {};
  for (const [key, label] of Object.entries(BUCKET_LABELS)) {
    const relevant = detailed.filter((x) => x.question.buckets.includes(key));
    const correct = relevant.filter((x) => x.entry.correct).length;
    buckets[key] = {
      key,
      label,
      answered: relevant.length,
      correct,
      accuracy: relevant.length ? Number((correct / relevant.length).toFixed(3)) : null,
    };
  }

  const topics = topicMastery(history);
  const withEnough = topics.filter((t) => t.answered >= 2);

  const difficultyPerformance = accuracyGroup(history, (q) => q.difficulty)
    .map((g) => ({ ...g, difficulty: g.key }))
    .sort((a, b) => a.difficulty - b.difficulty);

  const masteredDifficulties = difficultyPerformance.filter((d) => d.accuracy >= 0.8);
  const averageDifficultyMastered = masteredDifficulties.length
    ? Number(
        (
          masteredDifficulties.reduce((s, d) => s + d.difficulty * d.answered, 0) /
          masteredDifficulties.reduce((s, d) => s + d.answered, 0)
        ).toFixed(2)
      )
    : null;

  const recommendations = [];
  for (const [key, bucket] of Object.entries(buckets)) {
    if (bucket.accuracy !== null && bucket.accuracy < 0.8 && RECOMMENDATIONS[key]) {
      recommendations.push({ area: bucket.label, advice: RECOMMENDATIONS[key] });
    }
  }
  if (percentage < 80) {
    recommendations.push({
      area: "Overall",
      advice:
        "Run a focused remediation pass using only the concepts you missed before attempting new material.",
    });
  }

  const accuracyOf = (list) =>
    list.length ? Number((list.filter((x) => x.entry.correct).length / list.length).toFixed(3)) : null;

  return {
    student: "Bryton B.",
    course: "NURS 5334",
    entitled,
    totalScore: pointsEarned,
    pointsPossible,
    percentage: Number(percentage.toFixed(1)),
    ...performanceBand(percentage),
    questionsCompleted: detailed.length,
    questionsRemaining: Math.max(0, available - new Set(history.map((h) => h.questionId)).size),
    questionsAvailable: available,
    firstAttemptAccuracy: accuracyOf(firstAttempts),
    remediationAccuracy: accuracyOf(remediationAttempts),
    partialUnderstanding: detailed
      .filter((x) => x.question.type === "sata")
      .map((x) => ({ id: x.question.id, partial: x.entry.partialUnderstanding ?? 0 })),
    buckets,
    topics,
    medicationClasses: accuracyGroup(history, (q) => q.medicationClass)
      .map((g) => ({ ...g, medicationClass: g.key }))
      .sort((a, b) => b.accuracy - a.accuracy),
    difficultyPerformance,
    averageDifficultyMastered,
    strongestTopics: withEnough.slice(0, 3).map((t) => t.topic),
    weakestTopics: [...withEnough].reverse().slice(0, 3).map((t) => t.topic),
    // "Multiple classes" and "General principles" are bank-organisation labels,
    // not drug classes a learner can go and revise — keep them out of advice.
    weakMedicationClasses: accuracyGroup(history, (q) => q.medicationClass)
      .filter(
        (g) =>
          g.answered >= 2 &&
          g.accuracy < 0.8 &&
          !["Multiple classes", "General principles"].includes(g.key)
      )
      .sort((a, b) => a.accuracy - b.accuracy)
      .map((g) => g.key),
    missedQuestions: detailed
      .filter((x) => !x.entry.correct)
      .map((x) => ({
        id: x.question.id,
        number: x.question.number,
        topic: x.question.topic,
        medicationClass: x.question.medicationClass,
        difficulty: x.question.difficulty,
        type: x.question.type,
        stem: x.question.stem,
        options: x.question.options,
        correct: x.question.correct,
        rationale: x.question.rationale,
        distractorRationales: x.question.distractorRationales,
        keyClue: x.question.keyClue,
        clinicalTakeaway: x.question.clinicalTakeaway,
        remediationConcept: x.question.remediationConcept,
      })),
    recommendations,
    expertChallengeUnlocked: percentage >= 90,
  };
}
