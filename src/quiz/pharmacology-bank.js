// The NURS 5334 general pharmacology bank (final exam review).
//
// Structure and QC live in bank.js; this file is the bank's content and its
// analytics bucket rules. Loaded server-side only — it contains the answer key
// and must never be served to the browser.
//
// Unlike the antimicrobial bank (organized by medication class) or the
// renal-cardiac bank (organized by body system), this bank spans the breadth of
// a general pharmacology final: pharmacokinetics/legal, cardiovascular, CNS and
// psychiatric, endocrine, renal/urologic/GI, pain and opioids, and autonomic and
// general medication safety.

import { createBank } from "./bank.js";

import pharmacokineticsLegal from "./questions-pharmacology/01-pharmacokinetics-legal.js";
import cardiovascular from "./questions-pharmacology/02-cardiovascular.js";
import cnsPsychiatric from "./questions-pharmacology/03-cns-psychiatric.js";
import endocrine from "./questions-pharmacology/04-endocrine.js";
import renalUrologicGi from "./questions-pharmacology/05-renal-urologic-gi.js";
import painOpioids from "./questions-pharmacology/06-pain-opioids.js";
import autonomicSafety from "./questions-pharmacology/07-autonomic-safety.js";

/** Questions numbered above this are behind the paywall. */
export const FREE_QUESTION_COUNT = 30;

const hasAnyTag = (q, tags) => tags.some((t) => q.tags.includes(t));

/**
 * Analytics buckets reported on the results dashboard. A question can belong to
 * several; membership is derived from tags and flags so the bank stays the
 * single source of truth.
 */
const BUCKET_RULES = {
  pregnancySafety: (q) => q.pregnancyRelated === true,
  toxicityRecognition: (q) =>
    hasAnyTag(q, [
      "toxicity", "overdose", "rhabdomyolysis", "serotonin-syndrome",
      "cardiotoxicity", "hyperkalemia", "tardive-dyskinesia", "hypoglycemia",
    ]),
  medicationInteractions: (q) => hasAnyTag(q, ["interaction", "contraindication"]),
  priorityAction: (q) => q.safetyPriority === true,
  patientEducationAdherence: (q) => hasAnyTag(q, ["patient-education", "adherence", "access"]),
};

const SECTIONS = [
  pharmacokineticsLegal,
  cardiovascular,
  cnsPsychiatric,
  endocrine,
  renalUrologicGi,
  painOpioids,
  autonomicSafety,
];

/**
 * Presentation order, which is what decides the free/paid split — questions
 * numbered above FREE_QUESTION_COUNT are paywalled.
 *
 * The section files are topic-grouped, so shipping them in file order would put
 * all of pharmacokinetics, cardiovascular and part of CNS content in the free
 * half and leave endocrine, renal/GI, pain and autonomic pharmacology entirely
 * behind the paywall. This order instead takes a slice of every section into the
 * free half, so a non-paying learner sees the breadth of the exam, not just its
 * first three topics.
 */
const PRESENTATION_ORDER = [
  // ── Free half (1–30): a slice of every section ──
  "p001", "p002", "p003", "p004", "p005",
  "p011", "p012", "p013", "p014", "p015",
  "p021", "p022", "p023", "p024",
  "p031", "p032", "p033", "p034",
  "p041", "p042", "p043", "p045",
  "p051", "p052", "p053", "p054",
  "p061", "p062", "p063", "p064",
  // ── Paid half (31–70): the remainder of every section ──
  "p006", "p007", "p008", "p009", "p010",
  "p016", "p017", "p018", "p019", "p020",
  "p025", "p026", "p027", "p028", "p029", "p030",
  "p035", "p036", "p037", "p038", "p039", "p040",
  "p044", "p046", "p047", "p048", "p049", "p050",
  "p055", "p056", "p057", "p058", "p059", "p060",
  "p065", "p066", "p067", "p068", "p069", "p070",
];

function orderedQuestions() {
  const byId = new Map(SECTIONS.flat().map((q) => [q.id, q]));
  const position = new Map(PRESENTATION_ORDER.map((id, i) => [id, i]));

  const missingFromOrder = [...byId.keys()].filter((id) => !position.has(id));
  const unknownInOrder = PRESENTATION_ORDER.filter((id) => !byId.has(id));
  if (missingFromOrder.length || unknownInOrder.length) {
    throw new Error(
      "pharmacology PRESENTATION_ORDER is out of sync with the section files: " +
        `missing ${JSON.stringify(missingFromOrder)}, unknown ${JSON.stringify(unknownInOrder)}`
    );
  }
  if (position.size !== PRESENTATION_ORDER.length) {
    throw new Error("pharmacology PRESENTATION_ORDER contains a duplicate id");
  }

  return PRESENTATION_ORDER.map((id) => byId.get(id));
}

export const pharmacologyBank = createBank({
  id: "pharmacology",
  freeQuestionCount: FREE_QUESTION_COUNT,
  expectedCount: 70,
  bucketRules: BUCKET_RULES,
  sections: [orderedQuestions()],
});
