// Assembles the 100-item antimicrobial bank and derives the metadata the
// scoring engine needs. Loaded server-side only — this module contains the
// answer key and must never be served to the browser.

import foundations from "./questions/01-foundations.js";
import stewardship from "./questions/02-stewardship.js";
import pregnancy from "./questions/03-pregnancy.js";
import betaLactams from "./questions/04-beta-lactams.js";
import vancomycin from "./questions/05-vancomycin.js";
import aminoglycosides from "./questions/06-aminoglycosides.js";
import tetracyclinesFq from "./questions/07-tetracyclines-fluoroquinolones.js";
import macrolidesSulfas from "./questions/08-macrolides-sulfas-others.js";
import linezolidRifampinTb from "./questions/09-linezolid-rifampin-tb.js";
import antifungalsAntivirals from "./questions/10-antifungals-antivirals.js";

/** Questions numbered above this are behind the paywall. */
export const FREE_QUESTION_COUNT = 50;

const SECTIONS = [
  foundations,
  stewardship,
  pregnancy,
  betaLactams,
  vancomycin,
  aminoglycosides,
  tetracyclinesFq,
  macrolidesSulfas,
  linezolidRifampinTb,
  antifungalsAntivirals,
];

/**
 * Analytics buckets reported on the results dashboard. A question can belong to
 * several; membership is derived from tags/topic so the bank stays the single
 * source of truth.
 */
const BUCKET_RULES = {
  pregnancySafety: (q) => q.pregnancyRelated === true,
  stewardship: (q) =>
    q.topic === "Antimicrobial stewardship" ||
    q.topic === "Empiric versus definitive therapy" ||
    q.topic === "Colonization versus infection" ||
    q.topic === "Culture and susceptibility" ||
    q.tags.includes("stewardship") ||
    q.tags.includes("de-escalation"),
  toxicityRecognition: (q) =>
    q.topic === "Organ toxicity" ||
    q.topic === "Severe cutaneous reactions" ||
    q.topic === "Severe reactions" ||
    ["nephrotoxicity", "ototoxicity", "hepatotoxicity", "neurotoxicity", "myelosuppression",
      "sjs-ten", "severe-cutaneous", "neuropathy", "qt-prolongation", "optic-neuritis",
      "neuromuscular-blockade", "hyperkalemia", "serotonin-syndrome", "toxicity",
    ].some((t) => q.tags.includes(t)),
  medicationInteractions: (q) =>
    q.topic === "Drug interactions" || q.tags.includes("interaction"),
  priorityAction: (q) => q.safetyPriority === true,
};

function decorate(question, index) {
  const number = index + 1;
  const buckets = Object.entries(BUCKET_RULES)
    .filter(([, matches]) => matches(question))
    .map(([bucket]) => bucket);

  return Object.freeze({
    ...question,
    number,
    isFree: number <= FREE_QUESTION_COUNT,
    points: question.type === "sata" ? 2 : 1,
    buckets: Object.freeze(buckets),
    options: Object.freeze(question.options.map((o) => Object.freeze({ ...o }))),
    correct: Object.freeze([...question.correct]),
  });
}

export const QUESTIONS = Object.freeze(SECTIONS.flat().map(decorate));

const BY_ID = new Map(QUESTIONS.map((q) => [q.id, q]));

export function getQuestion(id) {
  return BY_ID.get(id) || null;
}

export const TOPICS = Object.freeze([...new Set(QUESTIONS.map((q) => q.topic))].sort());
export const MEDICATION_CLASSES = Object.freeze(
  [...new Set(QUESTIONS.map((q) => q.medicationClass))].sort()
);
export const BUCKET_KEYS = Object.freeze(Object.keys(BUCKET_RULES));

/**
 * Structural QC over the bank. Run by the test suite and at server start so a
 * malformed question can never reach a learner.
 * @returns {string[]} human-readable problems; empty means the bank is sound.
 */
export function validateBank(questions = QUESTIONS) {
  const problems = [];
  const seenIds = new Set();
  const seenStems = new Set();

  if (questions.length !== 100) {
    problems.push(`expected 100 questions, found ${questions.length}`);
  }

  for (const q of questions) {
    const at = `${q.id || "<no id>"}`;

    if (!q.id || !/^q\d{3}$/.test(q.id)) problems.push(`${at}: id must match q000`);
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
    if (!q.medicationClass) problems.push(`${at}: missing medicationClass`);
    if (!Array.isArray(q.tags) || q.tags.length === 0) problems.push(`${at}: missing tags`);

    // Options
    if (!Array.isArray(q.options) || q.options.length < 3) {
      problems.push(`${at}: needs at least 3 options`);
      continue;
    }
    const optionIds = q.options.map((o) => o.id);
    if (new Set(optionIds).size !== optionIds.length) problems.push(`${at}: duplicate option ids`);
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
      if (unknown.length) problems.push(`${at}: correct ids not in options: ${unknown.join(",")}`);
      if (new Set(q.correct).size !== q.correct.length) {
        problems.push(`${at}: duplicate entries in correct`);
      }
      if (q.type === "mcq" && q.correct.length !== 1) {
        problems.push(`${at}: mcq must have exactly one correct answer, found ${q.correct.length}`);
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
    if (q.correct.includes(longest.id) && q.correct.length === 1 && longest.len > meanOthers * 2.6) {
      problems.push(
        `${at}: correct option is ${Math.round(longest.len / meanOthers)}x the mean length of the others`
      );
    }
  }

  return problems;
}

export function bankStats(questions = QUESTIONS) {
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
    medicationClasses: MEDICATION_CLASSES.length,
  };
}
