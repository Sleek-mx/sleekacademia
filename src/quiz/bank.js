// Generic question-bank factory.
//
// A "bank" is a frozen, numbered list of questions plus the metadata the scoring
// engine derives from it. Two banks exist today (antimicrobial pharmacology and
// renal/cardiac pathophysiology) and they differ only in their questions, their
// free/paid boundary and their analytics bucket rules.
//
// Loaded server-side only — a bank contains the answer key and must never be
// serialised to the browser.
//
// Secondary axis naming: the antimicrobial bank groups questions by
// `medicationClass`, the pathophysiology bank by `category`. `decorate` maps
// whichever is present onto BOTH names so every consumer can read `category`
// while the older bank keeps the field name its 100 question objects already use.

/**
 * @param {object} spec
 * @param {string} spec.id                 - stable slug, e.g. "antimicrobial"
 * @param {object[][]} spec.sections       - arrays of raw question objects, in order
 * @param {number} [spec.freeQuestionCount] - questions numbered above this are paywalled
 * @param {number} [spec.expectedCount]    - QC asserts the bank is exactly this long
 * @param {Record<string, (q: object) => boolean>} [spec.bucketRules]
 */
export function createBank({
  id,
  sections,
  freeQuestionCount = 50,
  expectedCount = 100,
  bucketRules = {},
}) {
  const bucketKeys = Object.keys(bucketRules);

  function decorate(question, index) {
    const number = index + 1;
    const category = question.category ?? question.medicationClass ?? null;
    const withCategory = { ...question, category, medicationClass: category };

    const buckets = Object.entries(bucketRules)
      .filter(([, matches]) => matches(withCategory))
      .map(([bucket]) => bucket);

    return Object.freeze({
      ...withCategory,
      number,
      // Identity of the concept for remediation grouping, kept separate from the
      // teaching prose in `remediationConcept` so several questions can re-test
      // one concept while each still explains it in its own words. Defaults to
      // the prose, which makes every question its own concept unless grouped.
      conceptKey: question.conceptKey ?? question.remediationConcept,
      isFree: number <= freeQuestionCount,
      points: question.type === "sata" ? 2 : 1,
      buckets: Object.freeze(buckets),
      options: Object.freeze(question.options.map((o) => Object.freeze({ ...o }))),
      correct: Object.freeze([...question.correct]),
      tags: Object.freeze([...(question.tags || [])]),
    });
  }

  const QUESTIONS = Object.freeze(sections.flat().map(decorate));
  const byId = new Map(QUESTIONS.map((q) => [q.id, q]));

  const TOPICS = Object.freeze([...new Set(QUESTIONS.map((q) => q.topic))].sort());
  const CATEGORIES = Object.freeze([...new Set(QUESTIONS.map((q) => q.category))].sort());
  const DIFFICULTIES = Object.freeze([...new Set(QUESTIONS.map((q) => q.difficulty))].sort());

  function getQuestion(questionId) {
    return byId.get(questionId) || null;
  }

  /**
   * Structural QC. Run by the test suite and at server start so a malformed
   * question can never reach a learner.
   * @returns {string[]} human-readable problems; empty means the bank is sound.
   */
  function validateBank(questions = QUESTIONS) {
    const problems = [];
    const seenIds = new Set();
    const seenStems = new Set();

    if (questions.length !== expectedCount) {
      problems.push(`expected ${expectedCount} questions, found ${questions.length}`);
    }

    for (const q of questions) {
      const at = `${q.id || "<no id>"}`;
      const category = q.category ?? q.medicationClass;

      // q001 (antimicrobial) / r001 (renal-cardiac): a short prefix then 3 digits.
      if (!q.id || !/^[a-z]{1,4}\d{3}$/.test(q.id)) problems.push(`${at}: id must match q000`);
      if (seenIds.has(q.id)) problems.push(`${at}: duplicate id`);
      seenIds.add(q.id);

      const stemKey = q.stem?.trim().toLowerCase();
      if (!stemKey) problems.push(`${at}: missing stem`);
      else if (seenStems.has(stemKey)) problems.push(`${at}: duplicate stem`);
      seenStems.add(stemKey);

      if (!["mcq", "sata"].includes(q.type)) problems.push(`${at}: type must be mcq or sata`);
      if (!Number.isInteger(q.difficulty) || q.difficulty < 1 || q.difficulty > 5) {
        problems.push(`${at}: difficulty must be an integer 1-5`);
      }
      if (!q.topic) problems.push(`${at}: missing topic`);
      if (!category) problems.push(`${at}: missing category`);
      if (!Array.isArray(q.tags) || q.tags.length === 0) problems.push(`${at}: missing tags`);

      // Options
      if (!Array.isArray(q.options) || q.options.length < 3) {
        problems.push(`${at}: needs at least 3 options`);
        continue;
      }
      const optionIds = q.options.map((o) => o.id);
      if (new Set(optionIds).size !== optionIds.length) {
        problems.push(`${at}: duplicate option ids`);
      }
      for (const o of q.options) {
        if (!o.id || typeof o.text !== "string" || !o.text.trim()) {
          problems.push(`${at}: option ${o.id} malformed`);
        }
      }

      // Answer key
      if (!Array.isArray(q.correct) || q.correct.length === 0) {
        problems.push(`${at}: missing correct answer`);
      } else {
        const unknown = q.correct.filter((c) => !optionIds.includes(c));
        if (unknown.length) {
          problems.push(`${at}: correct ids not in options: ${unknown.join(",")}`);
        }
        if (new Set(q.correct).size !== q.correct.length) {
          problems.push(`${at}: duplicate entries in correct`);
        }
        if (q.type === "mcq" && q.correct.length !== 1) {
          problems.push(
            `${at}: mcq must have exactly one correct answer, found ${q.correct.length}`
          );
        }
        if (q.type === "sata") {
          if (q.correct.length < 2) {
            problems.push(`${at}: sata must have at least 2 correct answers`);
          }
          if (q.correct.length === q.options.length && !/select all that apply/i.test(q.stem)) {
            problems.push(`${at}: all-correct sata must say "select all that apply" in the stem`);
          }
        }
      }

      // Teaching content
      if (!q.rationale?.trim()) problems.push(`${at}: missing rationale`);
      if (!q.keyClue?.trim()) problems.push(`${at}: missing keyClue`);
      if (!q.clinicalTakeaway?.trim()) problems.push(`${at}: missing clinicalTakeaway`);
      if (!q.remediationConcept?.trim()) problems.push(`${at}: missing remediationConcept`);
      else if (q.remediationConcept.split(/(?<=[.!?])\s+/).filter(Boolean).length > 3) {
        problems.push(`${at}: remediationConcept exceeds three sentences`);
      }

      // Every incorrect option needs its own explanation. Correct options may
      // carry one too (useful for SATA) but are not required to.
      const rationales = q.distractorRationales || {};
      for (const o of q.options) {
        if (q.correct.includes(o.id)) continue;
        if (!rationales[o.id]?.trim()) {
          problems.push(`${at}: missing distractorRationale for incorrect option ${o.id}`);
        }
      }
      for (const key of Object.keys(rationales)) {
        if (!optionIds.includes(key)) {
          problems.push(`${at}: distractorRationale for unknown option ${key}`);
        }
      }

      // Guard against the giveaway where the correct option is far longest.
      const lengths = q.options.map((o) => ({ id: o.id, len: o.text.length }));
      const longest = lengths.reduce((a, b) => (b.len > a.len ? b : a));
      const others = lengths.filter((l) => l.id !== longest.id).map((l) => l.len);
      const meanOthers = others.reduce((a, b) => a + b, 0) / others.length;
      if (
        q.correct.includes(longest.id) &&
        q.correct.length === 1 &&
        longest.len > meanOthers * 2.6
      ) {
        problems.push(
          `${at}: correct option is ${Math.round(
            longest.len / meanOthers
          )}x the mean length of the others`
        );
      }
    }

    return problems;
  }

  function bankStats(questions = QUESTIONS) {
    const byDifficulty = {};
    const byType = {};
    const byBucket = {};
    for (const q of questions) {
      byDifficulty[q.difficulty] = (byDifficulty[q.difficulty] || 0) + 1;
      byType[q.type] = (byType[q.type] || 0) + 1;
      for (const b of q.buckets) byBucket[b] = (byBucket[b] || 0) + 1;
    }
    return {
      total: questions.length,
      free: questions.filter((q) => q.isFree).length,
      paid: questions.filter((q) => !q.isFree).length,
      totalPoints: questions.reduce((sum, q) => sum + q.points, 0),
      byDifficulty,
      byType,
      byBucket,
      topics: TOPICS.length,
      categories: CATEGORIES.length,
    };
  }

  return {
    id,
    QUESTIONS,
    FREE_QUESTION_COUNT: freeQuestionCount,
    TOPICS,
    CATEGORIES,
    DIFFICULTIES,
    BUCKET_KEYS: Object.freeze(bucketKeys),
    getQuestion,
    validateBank,
    bankStats,
  };
}
