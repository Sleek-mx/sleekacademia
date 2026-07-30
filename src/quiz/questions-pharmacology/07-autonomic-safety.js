// P61–70 — Autonomic pharmacology and general medication safety principles.
// Original items written for Sleek Academia. No commercial test-bank content.

export default [
  {
    id: "p061",
    topic: "Anaphylaxis management",
    category: "Autonomic and safety",
    difficulty: 3,
    type: "mcq",
    stem:
      "A patient develops sudden hives, throat tightness, and hypotension after a medication is administered. Which medication should be given first?",
    options: [
      { id: "a", text: "Intramuscular epinephrine" },
      { id: "b", text: "Oral diphenhydramine" },
      { id: "c", text: "Inhaled albuterol only" },
      { id: "d", text: "Intravenous corticosteroid only" },
    ],
    correct: ["a"],
    rationale:
      "Anaphylaxis is a life-threatening emergency requiring immediate intramuscular epinephrine as the first-line treatment. Epinephrine's alpha-1 effects reverse hypotension and mucosal edema, while its beta-2 effects relieve bronchospasm, addressing the emergency faster and more completely than any other single agent.",
    distractorRationales: {
      b: "Diphenhydramine may help with hives but works too slowly and does not reverse hypotension or airway compromise on its own; it is adjunctive, not first-line.",
      c: "Albuterol addresses bronchospasm but does not treat the hypotension or mucosal swelling of anaphylaxis; it is adjunctive, not the first medication given.",
      d: "Corticosteroids act too slowly to address the acute presentation and are given to help prevent a biphasic reaction, not as the first intervention.",
    },
    keyClue: "Anaphylaxis always means epinephrine first, everything else is adjunctive.",
    clinicalTakeaway:
      "Patients with a history of anaphylaxis should be prescribed an epinephrine auto-injector and taught to use it immediately at the first sign of a reaction, not to wait and see.",
    remediationConcept:
      "Epinephrine is first-line in anaphylaxis because its combined alpha and beta effects reverse hypotension, mucosal edema, and bronchospasm simultaneously, faster than antihistamines, steroids, or bronchodilators alone.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["anaphylaxis", "epinephrine", "emergency"],
  },
  {
    id: "p062",
    topic: "Adrenergic receptors",
    category: "Autonomic and safety",
    difficulty: 4,
    type: "mcq",
    stem:
      "A patient is prescribed tamsulosin for benign prostatic hyperplasia. Which receptor does this medication target?",
    options: [
      { id: "a", text: "Alpha-1 receptors in the prostate and bladder neck" },
      { id: "b", text: "Beta-2 receptors in bronchial smooth muscle" },
      { id: "c", text: "Muscarinic receptors in the detrusor muscle" },
      { id: "d", text: "Beta-1 receptors in the heart" },
    ],
    correct: ["a"],
    rationale:
      "Tamsulosin is an alpha-1 adrenergic antagonist selective for receptors concentrated in the prostate and bladder neck smooth muscle. Blocking these receptors relaxes smooth muscle tone, reducing outlet resistance and improving urinary flow in benign prostatic hyperplasia.",
    distractorRationales: {
      b: "Beta-2 receptors in the bronchi are the target of bronchodilators like albuterol, unrelated to tamsulosin's mechanism.",
      c: "Muscarinic receptors in the detrusor are targeted by anticholinergic bladder medications, not alpha-1 blockers.",
      d: "Beta-1 receptors in the heart are targeted by beta blockers, a different receptor system entirely from tamsulosin's alpha-1 selectivity.",
    },
    keyClue: "Tamsulosin and other \"-osin\" drugs for BPH always point to alpha-1 blockade.",
    clinicalTakeaway:
      "Because alpha-1 blockers can cause orthostatic hypotension, especially with the first dose, patients are often counseled to take the first dose at bedtime and rise slowly.",
    remediationConcept:
      "Alpha-1 adrenergic antagonists like tamsulosin relax prostate and bladder neck smooth muscle by blocking alpha-1 receptors, distinct from the beta and muscarinic receptor systems targeted by other classes.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["alpha-blocker", "adrenergic", "bph"],
  },
  {
    id: "p063",
    topic: "Cholinergic crisis",
    category: "Autonomic and safety",
    difficulty: 4,
    type: "mcq",
    stem:
      "A patient exposed to an organophosphate pesticide develops excessive salivation, lacrimation, urination, diarrhea, and bradycardia. Which medication is the priority antidote?",
    options: [
      { id: "a", text: "Atropine" },
      { id: "b", text: "Naloxone" },
      { id: "c", text: "Flumazenil" },
      { id: "d", text: "Epinephrine alone" },
    ],
    correct: ["a"],
    rationale:
      "Organophosphate poisoning causes excess acetylcholine accumulation by inhibiting acetylcholinesterase, producing the classic cholinergic toxidrome (salivation, lacrimation, urination, diarrhea, bradycardia). Atropine, a muscarinic antagonist, directly blocks these excess cholinergic effects and is the priority antidote, often alongside pralidoxime.",
    distractorRationales: {
      b: "Naloxone reverses opioid effects and has no role in cholinergic toxicity.",
      c: "Flumazenil reverses benzodiazepine effects and is unrelated to this toxidrome.",
      d: "Epinephrine is not the primary antidote for organophosphate poisoning; atropine's muscarinic blockade is the targeted mechanism needed.",
    },
    keyClue: "Excess salivation, lacrimation, urination, diarrhea, and bradycardia together spell out the cholinergic toxidrome treated with atropine.",
    clinicalTakeaway:
      "Atropine is typically titrated to drying of secretions and improved heart rate rather than to a fixed dose, since severe poisoning may require very large cumulative doses.",
    remediationConcept:
      "Organophosphate poisoning causes acetylcholinesterase inhibition and cholinergic excess. Atropine's muscarinic antagonism directly reverses this toxidrome and is the priority antidote alongside pralidoxime.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["cholinergic-crisis", "atropine", "antidote"],
  },
  {
    id: "p064",
    topic: "Beta-2 agonists",
    category: "Autonomic and safety",
    difficulty: 2,
    type: "mcq",
    stem:
      "A patient using albuterol frequently for asthma reports palpitations and tremor. What is the most likely explanation?",
    options: [
      { id: "a", text: "Beta-2 agonists can have some beta-1 cross-reactivity, causing cardiac stimulation and skeletal muscle tremor" },
      { id: "b", text: "This indicates an allergic reaction to the medication" },
      { id: "c", text: "Albuterol has no cardiovascular or muscular effects" },
      { id: "d", text: "This is a sign the medication is not working" },
    ],
    correct: ["a"],
    rationale:
      "While albuterol is selective for beta-2 receptors, at higher or frequent doses some beta-1 cross-stimulation occurs, causing tachycardia and palpitations, while direct beta-2 stimulation of skeletal muscle causes tremor. These are expected, dose-related effects rather than signs of allergy or treatment failure.",
    distractorRationales: {
      b: "Tremor and palpitations are expected pharmacologic effects of the drug class, not a hypersensitivity reaction.",
      c: "Albuterol does have measurable cardiovascular and skeletal muscle effects, particularly with frequent or high-dose use.",
      d: "These symptoms reflect the drug's known adverse effect profile, not a lack of therapeutic effect on the airway.",
    },
    keyClue: "Albuterol plus tremor and palpitations is an expected beta-adrenergic side effect, not an allergy.",
    clinicalTakeaway:
      "Frequent rescue inhaler use with worsening tremor or palpitations should also prompt reassessment of asthma control, since overuse of a rescue inhaler can signal poorly controlled disease.",
    remediationConcept:
      "Beta-2 agonists like albuterol are selective but not perfectly so; expected effects include some beta-1 cardiac stimulation and direct beta-2 skeletal muscle tremor, especially with frequent dosing.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["beta-agonist", "adverse-effect", "asthma"],
  },
  {
    id: "p065",
    topic: "Herbal-drug interactions",
    category: "Autonomic and safety",
    difficulty: 4,
    type: "mcq",
    stem:
      "A patient taking sertraline for depression starts taking St. John's Wort, an over-the-counter herbal supplement, without telling the prescriber. What is the priority concern?",
    options: [
      { id: "a", text: "St. John's Wort has serotonergic activity and can increase the risk of serotonin syndrome when combined with an SSRI" },
      { id: "b", text: "Herbal supplements never interact with prescription medications" },
      { id: "c", text: "St. John's Wort will have no effect on the SSRI's action" },
      { id: "d", text: "St. John's Wort only affects blood pressure medications" },
    ],
    correct: ["a"],
    rationale:
      "St. John's Wort has serotonergic properties and also induces certain cytochrome P450 enzymes. Combined with an SSRI, it raises the risk of serotonin syndrome, and separately can reduce the effectiveness of other medications metabolized through the same enzyme pathways. Patients should be specifically asked about herbal and over-the-counter supplement use.",
    distractorRationales: {
      b: "Many herbal supplements, St. John's Wort prominently among them, have clinically significant interactions with prescription medications.",
      c: "St. John's Wort has direct serotonergic activity that can meaningfully affect SSRI therapy, not a neutral effect.",
      d: "St. John's Wort's relevant interactions extend well beyond blood pressure medications, notably to serotonergic drugs and CYP-metabolized medications broadly.",
    },
    keyClue: "St. John's Wort plus an SSRI should always raise a serotonin syndrome and enzyme induction concern.",
    clinicalTakeaway:
      "A complete medication reconciliation should always include a specific, direct question about herbal and over-the-counter supplement use, since patients often do not volunteer this information.",
    remediationConcept:
      "St. John's Wort has serotonergic activity and induces certain metabolic enzymes, creating real interaction risk with SSRIs and other medications, which is why supplement use must be asked about directly during reconciliation.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["herbal-supplement", "interaction", "serotonin-syndrome"],
  },
  {
    id: "p066",
    topic: "Medication safety",
    category: "Autonomic and safety",
    difficulty: 2,
    type: "sata",
    stem:
      "Which elements are part of the traditional \"rights\" of safe medication administration? Select all that apply.",
    options: [
      { id: "a", text: "Right patient" },
      { id: "b", text: "Right medication" },
      { id: "c", text: "Right dose" },
      { id: "d", text: "Right time" },
      { id: "e", text: "Right insurance coverage" },
    ],
    correct: ["a", "b", "c", "d"],
    rationale:
      "The traditional rights of medication administration include right patient, right medication, right dose, right route, and right time (often extended to include right documentation and right reason). These checks are designed to prevent medication errors at the point of administration.",
    distractorRationales: {
      e: "Insurance coverage is a billing and access consideration, not one of the clinical safety checks performed at the point of administration.",
    },
    keyClue: "The \"rights\" of medication administration are all about identity, drug, dose, route, and timing accuracy, not payment logistics.",
    clinicalTakeaway:
      "Many organizations have expanded the traditional five rights to include right documentation and right reason, reflecting a broader view of medication safety.",
    remediationConcept:
      "The rights of medication administration are safety checks confirming patient identity, correct drug, dose, route, and time, distinct from unrelated administrative concerns like insurance coverage.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["medication-safety", "administration", "foundations"],
  },
  {
    id: "p067",
    topic: "Adverse drug reactions",
    category: "Autonomic and safety",
    difficulty: 3,
    type: "mcq",
    stem:
      "A patient develops hives and wheezing minutes after receiving penicillin. A different patient develops nausea after taking the same medication. How should these two reactions be classified?",
    options: [
      { id: "a", text: "The first is a hypersensitivity (allergic) reaction; the second is a common side effect" },
      { id: "b", text: "Both reactions are identical in mechanism and severity" },
      { id: "c", text: "Both reactions represent a true drug allergy" },
      { id: "d", text: "Neither reaction is related to the medication" },
    ],
    correct: ["a"],
    rationale:
      "A hypersensitivity or allergic reaction, such as hives and wheezing, involves an immune-mediated response (often IgE-mediated) and can range from mild to life-threatening anaphylaxis. A side effect, like nausea, is a predictable, non-immune pharmacologic effect of the drug that is not classified as a true allergy. Distinguishing these matters clinically, since a documented true allergy changes future prescribing decisions.",
    distractorRationales: {
      b: "These two reactions differ fundamentally in mechanism (immune-mediated versus pharmacologic) and clinical significance.",
      c: "Only the first reaction, with hives and wheezing, reflects a true immune-mediated allergic response; nausea is a common non-allergic side effect.",
      d: "Both reactions are related to the medication; they simply represent two different categories of drug reaction.",
    },
    keyClue: "Hives and wheezing signal true allergy; nausea alone is typically a non-allergic side effect.",
    clinicalTakeaway:
      "Accurately documenting the specific nature of a reported \"allergy\" (true hypersensitivity versus intolerance) prevents patients from being unnecessarily denied first-line medications in the future.",
    remediationConcept:
      "True drug allergy involves immune-mediated hypersensitivity (hives, wheezing, anaphylaxis), while side effects like nausea are predictable, non-immune pharmacologic effects. This distinction should be documented precisely, not lumped together as \"allergy.\"",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["drug-allergy", "adverse-reaction", "documentation"],
  },
  {
    id: "p068",
    topic: "Pregnancy risk categorization",
    category: "Autonomic and safety",
    difficulty: 3,
    type: "mcq",
    stem:
      "A prescriber is evaluating medication options for a pregnant patient and wants the most current, comprehensive safety information available. What is the best approach?",
    options: [
      { id: "a", text: "Review current pregnancy and lactation labeling information and available clinical data rather than relying on outdated letter categories alone" },
      { id: "b", text: "Rely solely on an old letter category (such as A, B, C, D, X) as a complete safety answer" },
      { id: "c", text: "Assume all medications are equally risky in pregnancy" },
      { id: "d", text: "Avoid all medications in pregnancy regardless of maternal risk from an untreated condition" },
    ],
    correct: ["a"],
    rationale:
      "The FDA has moved away from the old letter categories toward narrative labeling that describes actual risk data, dosing considerations, and clinical context for pregnancy and lactation. Prescribers should review current labeling and available evidence rather than relying on the older, often oversimplified letter system, and must weigh the risk of untreated maternal disease against medication risk.",
    distractorRationales: {
      b: "The older letter category system has been phased out of new labeling specifically because it oversimplified nuanced risk information.",
      c: "Medications vary widely in pregnancy risk profile; treating them as uniformly risky ignores important clinical differences.",
      d: "Untreated maternal conditions, such as epilepsy or severe hypertension, can carry significant risk to both parent and fetus, so medication avoidance is not automatically the safest choice.",
    },
    keyClue: "Modern pregnancy prescribing relies on narrative risk labeling and clinical judgment, not the old A-B-C-D-X letters alone.",
    clinicalTakeaway:
      "Shared decision-making that weighs maternal disease risk against medication risk is central to safe prescribing in pregnancy, rather than a reflexive avoid-everything approach.",
    remediationConcept:
      "Pregnancy prescribing now relies on detailed narrative labeling and current evidence rather than the retired letter category system, and requires weighing medication risk against the risk of leaving maternal disease untreated.",
    pregnancyRelated: true,
    safetyPriority: false,
    tags: ["pregnancy", "prescribing", "risk-assessment"],
  },
  {
    id: "p069",
    topic: "Black box warnings",
    category: "Autonomic and safety",
    difficulty: 3,
    type: "mcq",
    stem:
      "A medication carries an FDA black box warning. What does this designation indicate?",
    options: [
      { id: "a", text: "The medication carries a serious or life-threatening risk that must be prominently highlighted in prescribing information" },
      { id: "b", text: "The medication has been removed from the market" },
      { id: "c", text: "The medication is only available over the counter" },
      { id: "d", text: "The warning is purely a marketing designation with no clinical significance" },
    ],
    correct: ["a"],
    rationale:
      "A black box warning is the FDA's most serious labeling requirement, used to highlight a significant risk of serious or life-threatening adverse effects. It does not mean the drug is banned; it means prescribers and patients must be clearly informed of a specific, important safety concern before use.",
    distractorRationales: {
      b: "A black box warning does not mean the medication is removed from the market; many widely used drugs carry one.",
      c: "Black box warnings apply to prescription medications with serious risk profiles, not a marker of over-the-counter status.",
      d: "This is a formal regulatory requirement reflecting genuine, significant clinical risk, not a marketing designation.",
    },
    keyClue: "A black box warning always means \"serious risk, still may be used, but must be clearly disclosed.\"",
    clinicalTakeaway:
      "Prescribers should specifically discuss any relevant black box warning with the patient as part of informed consent before starting the medication.",
    remediationConcept:
      "A black box warning is the FDA's strongest label alert for a serious or life-threatening risk. The medication remains available, but the risk must be clearly disclosed and factored into the prescribing decision.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["black-box-warning", "regulatory", "safety"],
  },
  {
    id: "p070",
    topic: "Medication adherence",
    category: "Autonomic and safety",
    difficulty: 2,
    type: "mcq",
    stem:
      "A patient with hypertension admits to skipping doses of an antihypertensive because of cost. What is the most appropriate first response?",
    options: [
      { id: "a", text: "Explore lower-cost alternatives or assistance programs while addressing the underlying barrier directly" },
      { id: "b", text: "Assume the patient is simply noncompliant and document this without further discussion" },
      { id: "c", text: "Increase the dose to compensate for missed doses" },
      { id: "d", text: "Discontinue all antihypertensive therapy" },
    ],
    correct: ["a"],
    rationale:
      "Cost-related nonadherence is common and addressable. Exploring generic alternatives, patient assistance programs, or pharmacy discount options directly targets the barrier the patient identified, which is more effective and more respectful than labeling the patient noncompliant without addressing the root cause.",
    distractorRationales: {
      b: "Labeling the patient noncompliant without addressing the identified cost barrier does nothing to improve adherence and misses an actionable solution.",
      c: "Increasing the dose does not address the reason doses are being skipped and could increase risk if the patient later becomes able to take the medication consistently.",
      d: "Discontinuing therapy entirely abandons treatment of the underlying hypertension rather than solving the access problem.",
    },
    keyClue: "Cost-related nonadherence should always trigger a problem-solving response, not a compliance label.",
    clinicalTakeaway:
      "Asking directly and nonjudgmentally about barriers to adherence, including cost, uncovers solvable problems far more often than assuming a patient simply is not trying.",
    remediationConcept:
      "Cost-related nonadherence is a solvable access problem. Effective response means addressing the specific barrier, such as through lower-cost alternatives, rather than labeling the patient noncompliant or changing therapy without addressing the cause.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["adherence", "patient-education", "access"],
  },
];
