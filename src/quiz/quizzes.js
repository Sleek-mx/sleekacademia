// Quiz registry — one definition per quiz, consumed by createQuizRouter.
//
// A definition is everything that differs between quizzes: its bank, its
// entitlement scope, the tutor's subject framing, the PayPal order text and the
// copy shown to the learner. The router, engine, tutor and paywall code are shared.
//
// ── Frozen values ──────────────────────────────────────────────────────────
// `antimicrobialQuiz.scope` must stay "antimicrobial-quiz:full" forever: unlocks
// carrying that scope have been sold, and a paying student's saved token is
// verified against this exact string. Same for `apiBase` "/api/quiz" — a returning
// learner's browser calls those paths.

import { createEngine } from "./engine.js";
import { antimicrobialBank, FREE_QUESTION_COUNT } from "./question-bank.js";
import { renalCardiacBank } from "./renal-cardiac-bank.js";
import { pharmacologyBank } from "./pharmacology-bank.js";

// PayPal is restricted on the account behind this quiz, so the paywall runs on
// a manual MoneyGram-to-mobile-money claim for now (see src/quiz/router.js
// "/unlock/manual-claim" and public/js/quiz-engine.js "MoneyGram wizard").
// PayPal was removed from the codebase after the account was restricted.
export const UNLOCK_PRICE_USD = "10.00";

// ── NURS 5334 — Antimicrobial pharmacology ─────────────────────────────────

const ANTIMICROBIAL_META = {
  student: "Bryton B.",
  course: "NURS 5334",
  bucketLabels: {
    pregnancySafety: "Pregnancy safety",
    stewardship: "Stewardship",
    toxicityRecognition: "Toxicity recognition",
    medicationInteractions: "Medication interactions",
    priorityAction: "Priority action",
  },
  recommendations: {
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
  },
  // Bank-organisation labels, not drug classes a learner can go and revise.
  excludeFromAdvice: ["Multiple classes", "General principles"],
};

export const antimicrobialQuiz = Object.freeze({
  id: "antimicrobial",
  title: "NURS 5334 Antimicrobial Mastery Challenge",
  shortTitle: "Antimicrobial Mastery Challenge",
  scope: "antimicrobial-quiz:full", // FROZEN — unlocks with this scope are sold
  apiBase: "/api/quiz", // FROZEN — returning learners call these paths
  pagePath: "/antimicrobial-quiz",
  accessCodeEnv: "QUIZ_ACCESS_CODE",
  categoryLabel: "Medication class",
  categoryLabelPlural: "Medication classes",
  bank: antimicrobialBank,
  meta: ANTIMICROBIAL_META,
  engine: createEngine(antimicrobialBank, ANTIMICROBIAL_META),
  tutorDomain: {
    subject: "nursing pharmacology",
    course: "NURS 5334 antimicrobial pharmacology",
    categoryLabel: "Medication class",
    inventionRule: "Never invent drug facts.",
    absolutesRule:
      "Never state that a medication is universally safe or universally contraindicated.",
  },
  order: {
    referenceId: "antimicrobial-quiz-full",
    description: "NURS 5334 Antimicrobial Mastery Challenge — questions 51 to 100",
    customId: "antimicrobial-quiz",
    price: UNLOCK_PRICE_USD,
  },
});

// ── NURS 5315 — Renal, urologic and cardiac pathophysiology ────────────────

const RENAL_CARDIAC_META = {
  student: "NURS 5315 student",
  course: "NURS 5315",
  bucketLabels: {
    hemodynamics: "Hemodynamics",
    labInterpretation: "Lab and tracing interpretation",
    fluidElectrolyte: "Fluid and electrolyte balance",
    compensatoryMechanisms: "Compensatory mechanisms",
    priorityAction: "Priority action",
  },
  recommendations: {
    hemodynamics:
      "Review preload, afterload, contractility, the Frank-Starling relationship, and how coronary perfusion depends on diastolic time and pressure.",
    labInterpretation:
      "Review systematic arterial blood gas interpretation, the anion gap, urinary sediment and casts, and what troponin and natriuretic peptide each actually measure.",
    fluidElectrolyte:
      "Review sodium as a marker of water balance, potassium's effect on membrane potential, the calcium-phosphate-parathyroid chain, and effective circulating volume.",
    compensatoryMechanisms:
      "Review renal autoregulation, the renin-angiotensin-aldosterone axis, respiratory versus renal compensation, hyperfiltration, and ventricular remodelling.",
    priorityAction:
      "Review which findings demand urgent evaluation: electrocardiographic change with hyperkalaemia, acute retention, obstruction with fever, rapid creatinine rise, and shock with poor perfusion.",
  },
  // Bank-organisation labels rather than something a learner can go and revise.
  excludeFromAdvice: ["Shock and perfusion failure"],
};

export const renalCardiacQuiz = Object.freeze({
  id: "renal-cardiac",
  title: "NURS 5315 Renal, Urologic & Cardiac Pathophysiology Challenge",
  shortTitle: "Renal, Urologic & Cardiac Challenge",
  scope: "renal-cardiac-quiz:full",
  apiBase: "/api/patho-quiz",
  pagePath: "/renal-cardiac-quiz",
  accessCodeEnv: "QUIZ_ACCESS_CODE_RENAL_CARDIAC",
  categoryLabel: "Body system",
  categoryLabelPlural: "Body systems",
  bank: renalCardiacBank,
  meta: RENAL_CARDIAC_META,
  engine: createEngine(renalCardiacBank, RENAL_CARDIAC_META),
  tutorDomain: {
    subject: "nursing pathophysiology",
    course: "NURS 5315 renal, urologic and cardiovascular pathophysiology",
    categoryLabel: "Body system",
    inventionRule: "Never invent clinical facts, laboratory values, or mechanisms.",
    absolutesRule:
      "Never state that a finding is universally present or universally absent in a condition.",
  },
  order: {
    referenceId: "renal-cardiac-quiz-full",
    description:
      "NURS 5315 Renal, Urologic & Cardiac Pathophysiology Challenge — questions 51 to 100",
    customId: "renal-cardiac-quiz",
    price: UNLOCK_PRICE_USD,
  },
});

// ── NURS 5334 — General pharmacology (final exam review) ──────────────────

const PHARMACOLOGY_META = {
  student: "NURS 5334 student",
  course: "NURS 5334",
  bucketLabels: {
    pregnancySafety: "Pregnancy safety",
    toxicityRecognition: "Toxicity recognition",
    medicationInteractions: "Medication interactions",
    priorityAction: "Priority action",
    patientEducationAdherence: "Patient education and adherence",
  },
  recommendations: {
    pregnancySafety:
      "Review ACE inhibitors/ARBs, valproic acid, and NSAIDs in the third trimester, and which antihypertensives are considered pregnancy-safer.",
    toxicityRecognition:
      "Review digoxin, lithium, acetaminophen, and statin (rhabdomyolysis) toxicity presentations and their priority labs.",
    medicationInteractions:
      "Review nitrates with PDE5 inhibitors, MAOIs with tyramine, St. John's Wort with SSRIs, grapefruit juice with CYP3A4 substrates, and warfarin with antibiotics.",
    priorityAction:
      "Review opioid and benzodiazepine overdose response, anaphylaxis management, neuroleptic malignant syndrome, and serotonin syndrome recognition.",
    patientEducationAdherence:
      "Review beta blocker and steroid tapering, levothyroxine timing, opioid bowel regimens, and addressing cost-related nonadherence.",
  },
  // Bank-organisation labels, not drug classes a learner can go and revise.
  excludeFromAdvice: [],
};

export const pharmacologyQuiz = Object.freeze({
  id: "pharmacology",
  title: "NURS 5334 Pharmacology Final Exam Review Challenge",
  shortTitle: "Pharmacology Final Exam Review",
  scope: "pharmacology-quiz:full",
  apiBase: "/api/pharm-quiz",
  pagePath: "/pharmacology-quiz",
  accessCodeEnv: "QUIZ_ACCESS_CODE_PHARMACOLOGY",
  categoryLabel: "Topic area",
  categoryLabelPlural: "Topic areas",
  bank: pharmacologyBank,
  meta: PHARMACOLOGY_META,
  engine: createEngine(pharmacologyBank, PHARMACOLOGY_META),
  tutorDomain: {
    subject: "nursing pharmacology",
    course: "NURS 5334 general pharmacology",
    categoryLabel: "Topic area",
    inventionRule: "Never invent drug facts.",
    absolutesRule:
      "Never state that a medication is universally safe or universally contraindicated.",
  },
  order: {
    referenceId: "pharmacology-quiz-full",
    description: "NURS 5334 Pharmacology Final Exam Review Challenge — questions 31 to 70",
    customId: "pharmacology-quiz",
    price: UNLOCK_PRICE_USD,
  },
});

export const FREE_QUESTIONS = FREE_QUESTION_COUNT;

export const QUIZZES = Object.freeze({
  [antimicrobialQuiz.id]: antimicrobialQuiz,
  [renalCardiacQuiz.id]: renalCardiacQuiz,
  [pharmacologyQuiz.id]: pharmacologyQuiz,
});
