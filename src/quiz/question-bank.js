// The NURS 5334 antimicrobial bank.
//
// Structure and QC live in bank.js; this file is just the antimicrobial bank's
// content and its bucket rules. Loaded server-side only — it contains the answer
// key and must never be served to the browser.
//
// The named exports here are the ones the original single-quiz implementation
// published. They are kept as-is so existing callers and tests need no changes.

import { createBank } from "./bank.js";

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

export const antimicrobialBank = createBank({
  id: "antimicrobial",
  freeQuestionCount: FREE_QUESTION_COUNT,
  expectedCount: 100,
  bucketRules: BUCKET_RULES,
  sections: [
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
  ],
});

export const QUESTIONS = antimicrobialBank.QUESTIONS;
export const TOPICS = antimicrobialBank.TOPICS;
export const MEDICATION_CLASSES = antimicrobialBank.CATEGORIES;
export const BUCKET_KEYS = antimicrobialBank.BUCKET_KEYS;
export const getQuestion = antimicrobialBank.getQuestion;
export const validateBank = antimicrobialBank.validateBank;
export const bankStats = antimicrobialBank.bankStats;
