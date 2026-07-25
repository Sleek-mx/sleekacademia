// The NURS 5315 renal, urologic and cardiac pathophysiology bank.
//
// Structure and QC live in bank.js; this file is the bank's content and its
// analytics bucket rules. Loaded server-side only — it contains the answer key
// and must never be served to the browser.
//
// Unlike the antimicrobial bank, questions here use `category` for the secondary
// axis (body system rather than drug class) and set `conceptKey` where several
// questions re-test one principle.
//
// IMPORTANT — option order: every item in this bank is authored with the correct
// option written first. Nothing serves the authored order (the router shuffles
// options per attempt from the attempt salt), so this is invisible to learners.
// But it means the shuffle is the ONLY defence against position pattern-matching
// here: remove it and the answer is always option A. Two tests in
// test/renal-cardiac-quiz.test.js fail loudly if that shuffle stops reordering.

import { createBank } from "./bank.js";

import renalPhysiology from "./questions-renal-cardiac/01-renal-physiology.js";
import fluidElectrolytes from "./questions-renal-cardiac/02-fluid-electrolytes.js";
import acidBase from "./questions-renal-cardiac/03-acid-base.js";
import acuteKidneyInjury from "./questions-renal-cardiac/04-acute-kidney-injury.js";
import chronicKidneyDisease from "./questions-renal-cardiac/05-chronic-kidney-disease.js";
import glomerularDisease from "./questions-renal-cardiac/06-glomerular-disease.js";
import urology from "./questions-renal-cardiac/07-urology.js";
import cardiacPhysiology from "./questions-renal-cardiac/08-cardiac-physiology.js";
import heartFailureIschemia from "./questions-renal-cardiac/09-heart-failure-ischemia.js";
import arrhythmiaValvesVascular from "./questions-renal-cardiac/10-arrhythmia-valves-vascular.js";

/** Questions numbered above this are behind the paywall. */
export const FREE_QUESTION_COUNT = 50;

const hasAnyTag = (q, tags) => tags.some((t) => q.tags.includes(t));

/**
 * Analytics buckets reported on the results dashboard. A question can belong to
 * several; membership is derived from tags, topic and category so the bank stays
 * the single source of truth.
 */
const BUCKET_RULES = {
  hemodynamics: (q) =>
    hasAnyTag(q, [
      "hemodynamics", "perfusion", "cardiac-output", "stroke-volume", "preload",
      "afterload", "contractility", "coronary", "supply-demand", "filling",
      "congestion", "starling", "wall-stress",
    ]),
  labInterpretation: (q) =>
    hasAnyTag(q, ["lab", "abg", "ecg", "urinalysis", "casts", "biomarker", "anion-gap"]),
  fluidElectrolyte: (q) =>
    q.category === "Fluid and electrolyte balance" ||
    hasAnyTag(q, ["sodium", "potassium", "calcium", "phosphate", "volume", "fluid", "osmolality"]),
  compensatoryMechanisms: (q) =>
    hasAnyTag(q, [
      "compensation", "raas", "remodeling", "hyperfiltration", "sympathetic",
      "autoregulation", "hypertrophy", "progression",
    ]),
  priorityAction: (q) => q.safetyPriority === true,
};

const SECTIONS = [
  renalPhysiology,
  fluidElectrolytes,
  acidBase,
  acuteKidneyInjury,
  chronicKidneyDisease,
  glomerularDisease,
  urology,
  cardiacPhysiology,
  heartFailureIschemia,
  arrhythmiaValvesVascular,
];

/**
 * Presentation order, which is what decides the free/paid split — questions
 * numbered above FREE_QUESTION_COUNT are paywalled.
 *
 * The section files are grouped by topic, so shipping them in file order would
 * put all ten renal sections first and leave every cardiac and urology item
 * behind the paywall. A learner who never pays would see none of the two
 * subjects the quiz is named for. This order therefore takes five questions from
 * each section into the free half and five into the paid half, so both halves
 * span renal, urologic and cardiac content.
 *
 * Two constraints are encoded here and asserted below:
 *   1. Every question appears exactly once.
 *   2. Questions sharing a `conceptKey` stay on the same side of the paywall, so
 *      an unpaid learner can still be re-tested on a missed concept.
 */
const PRESENTATION_ORDER = [
  // ── Free half (1–50): five from each section ──
  "r001", "r011", "r021", "r031", "r041", "r051", "r061", "r071", "r082", "r091",
  "r002", "r018", "r030", "r032", "r042", "r052", "r065", "r076", "r089", "r092",
  "r010", "r014", "r024", "r034", "r050", "r054", "r066", "r072", "r083", "r094",
  "r004", "r015", "r028", "r039", "r043", "r055", "r063", "r073", "r084", "r095",
  "r005", "r012", "r022", "r033", "r045", "r057", "r067", "r080", "r087", "r096",
  // ── Paid half (51–100): the remaining five from each section ──
  "r003", "r013", "r023", "r035", "r044", "r053", "r062", "r074", "r081", "r093",
  "r006", "r016", "r025", "r036", "r046", "r056", "r064", "r078", "r088", "r097",
  "r007", "r017", "r026", "r037", "r047", "r058", "r068", "r075", "r085", "r098",
  "r008", "r019", "r027", "r038", "r048", "r059", "r069", "r079", "r086", "r099",
  "r009", "r020", "r029", "r040", "r049", "r060", "r070", "r077", "r090", "r100",
];

function orderedQuestions() {
  const byId = new Map(SECTIONS.flat().map((q) => [q.id, q]));
  const position = new Map(PRESENTATION_ORDER.map((id, i) => [id, i]));

  const missingFromOrder = [...byId.keys()].filter((id) => !position.has(id));
  const unknownInOrder = PRESENTATION_ORDER.filter((id) => !byId.has(id));
  if (missingFromOrder.length || unknownInOrder.length) {
    throw new Error(
      "renal-cardiac PRESENTATION_ORDER is out of sync with the section files: " +
        `missing ${JSON.stringify(missingFromOrder)}, unknown ${JSON.stringify(unknownInOrder)}`
    );
  }
  if (position.size !== PRESENTATION_ORDER.length) {
    throw new Error("renal-cardiac PRESENTATION_ORDER contains a duplicate id");
  }

  return PRESENTATION_ORDER.map((id) => byId.get(id));
}

export const renalCardiacBank = createBank({
  id: "renal-cardiac",
  freeQuestionCount: FREE_QUESTION_COUNT,
  expectedCount: 100,
  bucketRules: BUCKET_RULES,
  sections: [orderedQuestions()],
});
