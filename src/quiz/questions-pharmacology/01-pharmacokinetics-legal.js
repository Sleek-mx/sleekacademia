// P1–10 — Pharmacokinetics, pharmacodynamics, and prescriptive authority.
// Original items written for Sleek Academia. No commercial test-bank content.

export default [
  {
    id: "p001",
    topic: "Pharmacokinetic phases",
    category: "Pharmacokinetics",
    difficulty: 3,
    type: "sata",
    stem:
      "A nurse practitioner student is reviewing the four phases a medication moves through after it enters the body. Which processes belong to this sequence? Select all that apply.",
    options: [
      { id: "a", text: "Absorption" },
      { id: "b", text: "Distribution" },
      { id: "c", text: "Metabolism" },
      { id: "d", text: "Elimination" },
      { id: "e", text: "Titration" },
    ],
    correct: ["a", "b", "c", "d"],
    rationale:
      "Pharmacokinetics describes what the body does to a drug across four sequential phases: absorption into the bloodstream, distribution to tissues, metabolism (biotransformation, usually hepatic), and elimination from the body (usually renal).",
    distractorRationales: {
      e: "Titration is a dosing strategy — gradually adjusting a dose to effect — not a pharmacokinetic phase the drug itself passes through.",
    },
    keyClue: "Remember the order with the acronym A-D-M-E: absorption, distribution, metabolism, elimination.",
    clinicalTakeaway:
      "Organ impairment predicts which phase is affected: liver disease slows metabolism, kidney disease slows elimination, and both can cause drug accumulation.",
    remediationConcept:
      "Pharmacokinetics is what the body does to the drug, in four ordered phases: absorption, distribution, metabolism, elimination (ADME). Pharmacodynamics, by contrast, is what the drug does to the body.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["pharmacokinetics", "adme", "foundations"],
  },
  {
    id: "p002",
    topic: "Pharmacokinetic phases",
    category: "Pharmacokinetics",
    difficulty: 2,
    type: "mcq",
    stem:
      "A patient with cirrhosis is prescribed a medication that undergoes extensive first-pass biotransformation. Which pharmacokinetic phase is most likely to be impaired?",
    options: [
      { id: "a", text: "Metabolism" },
      { id: "b", text: "Absorption" },
      { id: "c", text: "Distribution" },
      { id: "d", text: "Excretion of inhaled gases" },
    ],
    correct: ["a"],
    rationale:
      "The liver is the primary site of drug metabolism (biotransformation). Cirrhosis reduces hepatocyte mass and enzyme activity, so drugs cleared mainly by the liver reach higher and longer-lasting plasma levels than expected.",
    distractorRationales: {
      b: "Absorption occurs mainly at the gut mucosa and is not directly altered by liver architecture, though portal hypertension can have secondary effects.",
      c: "Distribution depends on blood flow, protein binding, and tissue permeability rather than hepatocyte function specifically.",
      d: "Excretion of inhaled gases occurs at the lungs and is unrelated to hepatic disease.",
    },
    keyClue: "\"First-pass\" and \"biotransformation\" both point straight to the liver and the metabolism phase.",
    clinicalTakeaway:
      "Hepatically cleared drugs often need dose reduction in cirrhosis to avoid toxic accumulation.",
    remediationConcept:
      "First-pass metabolism happens in the liver before an oral drug reaches systemic circulation. Any disease that damages hepatocytes or shunts blood around the liver blunts this process and raises drug levels.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["pharmacokinetics", "hepatic", "metabolism"],
  },
  {
    id: "p003",
    topic: "Pharmacokinetic parameters",
    category: "Pharmacokinetics",
    difficulty: 3,
    type: "mcq",
    stem:
      "A medication has a half-life of 8 hours. Approximately how long will it take for the drug to reach steady-state plasma concentration with regular dosing?",
    options: [
      { id: "a", text: "About 40 hours (five half-lives)" },
      { id: "b", text: "About 8 hours (one half-life)" },
      { id: "c", text: "About 16 hours (two half-lives)" },
      { id: "d", text: "Steady state is reached immediately after the first dose" },
    ],
    correct: ["a"],
    rationale:
      "With repeated dosing at consistent intervals, a drug reaches steady state after approximately four to five half-lives, once the amount eliminated per interval equals the amount administered. For an 8-hour half-life, that is roughly 32 to 40 hours.",
    distractorRationales: {
      b: "One half-life only reduces the plasma level of a single dose by half; it does not describe steady state with repeated dosing.",
      c: "Two half-lives is still well short of the four-to-five multiple needed for accumulation to plateau.",
      d: "Steady state requires repeated dosing over multiple half-lives; a single dose alone cannot establish it.",
    },
    keyClue: "\"Steady state\" almost always maps to the rule of four to five half-lives.",
    clinicalTakeaway:
      "Loading doses exist specifically to bypass this multi-half-life wait when a therapeutic level is needed urgently.",
    remediationConcept:
      "Half-life is the time for plasma concentration to fall by 50%. Steady state with routine dosing takes about four to five half-lives, regardless of the dose size.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["pharmacokinetics", "half-life", "steady-state"],
  },
  {
    id: "p004",
    topic: "Bioavailability and routes",
    category: "Pharmacokinetics",
    difficulty: 3,
    type: "mcq",
    stem:
      "Which route of administration provides essentially 100% bioavailability by definition?",
    options: [
      { id: "a", text: "Intravenous" },
      { id: "b", text: "Oral" },
      { id: "c", text: "Sublingual" },
      { id: "d", text: "Transdermal" },
    ],
    correct: ["a"],
    rationale:
      "Intravenous administration delivers medication directly into systemic circulation, bypassing absorption entirely. By definition its bioavailability is set at 100% and used as the reference standard for every other route.",
    distractorRationales: {
      b: "Oral bioavailability is reduced by first-pass hepatic metabolism and variable gut absorption, so it is almost always less than 100%.",
      c: "Sublingual absorption avoids first-pass metabolism but still depends on mucosal absorption, so bioavailability is high but not guaranteed complete.",
      d: "Transdermal absorption is slow and depends on skin permeability and drug lipophilicity, giving variable and usually incomplete bioavailability.",
    },
    keyClue: "Any route that skips the gut and the liver's first pass has the least loss before reaching the bloodstream.",
    clinicalTakeaway:
      "When switching a patient from IV to oral dosing of the same drug, the oral dose is often higher to compensate for lower bioavailability.",
    remediationConcept:
      "Bioavailability is the fraction of an administered dose that reaches systemic circulation unchanged. IV bypasses absorption and first-pass metabolism entirely, so it is the 100% reference route.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["pharmacokinetics", "bioavailability", "routes"],
  },
  {
    id: "p005",
    topic: "Prescriptive authority",
    category: "Legal and regulatory",
    difficulty: 3,
    type: "mcq",
    stem:
      "A new nurse practitioner is trying to determine the scope of medications they may prescribe in their state. Which authority governs this scope of practice?",
    options: [
      { id: "a", text: "The state board of nursing" },
      { id: "b", text: "The employing hospital's pharmacy committee" },
      { id: "c", text: "The federal Drug Enforcement Administration alone" },
      { id: "d", text: "The professional nursing association the nurse belongs to" },
    ],
    correct: ["a"],
    rationale:
      "Prescriptive authority for nurse practitioners is granted and regulated at the state level, typically by the state board of nursing, which defines the scope of practice, any required collaborative agreements, and formulary restrictions.",
    distractorRationales: {
      b: "A pharmacy committee may set institutional protocols, but it does not have legal authority over an NP's prescriptive scope.",
      c: "The DEA regulates controlled substance registration nationally but does not define general prescriptive scope of practice.",
      d: "Professional associations advocate and set practice guidelines, but they hold no regulatory or legal authority over licensure.",
    },
    keyClue: "Scope-of-practice questions almost always resolve to the state board of nursing.",
    clinicalTakeaway:
      "Scope of practice varies significantly by state, so an NP relocating to a new state must verify local regulations before prescribing.",
    remediationConcept:
      "State boards of nursing regulate nurse practitioner prescriptive authority, including any collaborative practice requirements. This is separate from DEA registration, which governs controlled substances specifically.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["prescribing", "legal", "scope-of-practice"],
  },
  {
    id: "p006",
    topic: "Elements of a prescription",
    category: "Legal and regulatory",
    difficulty: 2,
    type: "sata",
    stem:
      "Which elements must be included on a complete, legally valid prescription? Select all that apply.",
    options: [
      { id: "a", text: "Prescriber name and contact information" },
      { id: "b", text: "Medication name, strength, and dosing frequency written out in full" },
      { id: "c", text: "Number of doses to dispense and number of refills" },
      { id: "d", text: "The indication written using only accepted abbreviations" },
      { id: "e", text: "Patient name and date of birth" },
    ],
    correct: ["a", "b", "c", "e"],
    rationale:
      "A legally complete prescription includes prescriber identification and contact information, the medication written out fully (name, strength, frequency), quantity and refills, and patient identifiers such as name and date of birth. Abbreviations are avoided; instructions are spelled out to prevent misinterpretation.",
    distractorRationales: {
      d: "Modern prescribing standards discourage abbreviations because they are a well-documented source of medication errors; instructions should be spelled out in full instead.",
    },
    keyClue: "If an option mentions relying on abbreviations, it is describing outdated and unsafe practice.",
    clinicalTakeaway:
      "The SIG (from the Latin signetur, \"let it be labeled\") is the patient-facing instruction line, written out in full sentences rather than shorthand.",
    remediationConcept:
      "A valid prescription needs prescriber identity, full patient identifiers, and the medication spelled out completely: name, strength, frequency, quantity, and refills. Abbreviations are avoided by design, not by preference.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["prescribing", "legal", "documentation"],
  },
  {
    id: "p007",
    topic: "Controlled substance scheduling",
    category: "Legal and regulatory",
    difficulty: 3,
    type: "mcq",
    stem:
      "A prescriber wants to prescribe a medication classified as a Schedule II controlled substance. Which statement about this schedule is accurate?",
    options: [
      { id: "a", text: "It has a recognized medical use but a high potential for abuse and dependence" },
      { id: "b", text: "It has no accepted medical use in the United States" },
      { id: "c", text: "It has the lowest abuse potential of all scheduled substances" },
      { id: "d", text: "Refills are permitted without a new prescription" },
    ],
    correct: ["a"],
    rationale:
      "Schedule II substances (such as certain opioids and stimulants) have an accepted medical use but carry a high potential for abuse and severe psychological or physical dependence, which is why they require a new written or electronically transmitted prescription for each fill with no refills.",
    distractorRationales: {
      b: "Substances with no accepted medical use, such as heroin, fall under Schedule I, not Schedule II.",
      c: "Schedule II drugs have high, not low, abuse potential among the scheduled categories that still have medical use.",
      d: "Schedule II prescriptions specifically do not allow refills; a new prescription is required each time.",
    },
    keyClue: "Schedule II = accepted medical use plus high abuse potential plus no refills.",
    clinicalTakeaway:
      "Because no refills are allowed on Schedule II prescriptions, prescribers must plan ahead for patients on chronic Schedule II therapy to avoid treatment gaps.",
    remediationConcept:
      "Controlled substance schedules rank abuse potential against accepted medical use. Schedule I has no medical use and high abuse potential; Schedule II has medical use but still high abuse potential and no refills.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["controlled-substances", "legal", "scheduling"],
  },
  {
    id: "p008",
    topic: "Pharmacodynamics",
    category: "Pharmacodynamics",
    difficulty: 3,
    type: "mcq",
    stem:
      "A medication binds to a receptor and produces the maximal biological response that receptor can produce. This medication is best described as a full:",
    options: [
      { id: "a", text: "Agonist" },
      { id: "b", text: "Antagonist" },
      { id: "c", text: "Partial agonist" },
      { id: "d", text: "Inverse agonist" },
    ],
    correct: ["a"],
    rationale:
      "A full agonist binds a receptor and produces the maximum response the receptor system is capable of. This is the defining pharmacodynamic behavior of an agonist, as opposed to drugs that block or dampen receptor activity.",
    distractorRationales: {
      b: "An antagonist binds the receptor but produces no response itself, and instead blocks agonists from acting.",
      c: "A partial agonist produces a submaximal response even at full receptor occupancy, unlike a full agonist.",
      d: "An inverse agonist binds the same receptor but produces the opposite effect of the agonist, reducing baseline activity.",
    },
    keyClue: "\"Maximal response\" is the hallmark phrase that identifies a full agonist.",
    clinicalTakeaway:
      "Knowing whether a drug is a full agonist, partial agonist, or antagonist predicts what happens when it is combined with another drug acting at the same receptor.",
    remediationConcept:
      "Pharmacodynamics classifies receptor-binding drugs by the response they produce: full agonists give maximal effect, partial agonists give submaximal effect, and antagonists block the receptor without activating it.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["pharmacodynamics", "receptors", "agonist"],
  },
  {
    id: "p009",
    topic: "Therapeutic index",
    category: "Pharmacokinetics",
    difficulty: 4,
    type: "mcq",
    stem:
      "A medication has a narrow therapeutic index. What does this mean for how the medication should be managed?",
    options: [
      { id: "a", text: "The difference between an effective dose and a toxic dose is small, so levels need close monitoring" },
      { id: "b", text: "The drug is safe at nearly any dose without monitoring" },
      { id: "c", text: "The drug cannot cause toxicity regardless of dose" },
      { id: "d", text: "Dosing frequency has no effect on plasma levels" },
    ],
    correct: ["a"],
    rationale:
      "A narrow therapeutic index means the effective dose and the toxic dose are close together, leaving little margin for error. Medications like warfarin, digoxin, and lithium require regular serum level or effect monitoring because small dose changes can shift a patient from subtherapeutic to toxic.",
    distractorRationales: {
      b: "The opposite is true: a narrow index means the drug is not safe across a wide dose range and needs careful monitoring.",
      c: "A narrow index specifically signals a real and closer risk of toxicity, not an absence of it.",
      d: "Dosing frequency directly affects peak and trough levels, which matters even more for narrow-index drugs.",
    },
    keyClue: "\"Narrow therapeutic index\" always signals close monitoring, not a safety margin.",
    clinicalTakeaway:
      "Digoxin, lithium, warfarin, and aminoglycosides are classic narrow-therapeutic-index drugs requiring serum level checks.",
    remediationConcept:
      "Therapeutic index compares the toxic dose to the effective dose. A narrow index means little room between helping and harming the patient, which is why these drugs need regular level monitoring.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["pharmacokinetics", "therapeutic-index", "monitoring"],
  },
  {
    id: "p010",
    topic: "Protein binding",
    category: "Pharmacokinetics",
    difficulty: 4,
    type: "mcq",
    stem:
      "A patient with low serum albumin is started on a highly protein-bound medication. What is the most likely clinical consequence?",
    options: [
      { id: "a", text: "A larger free (unbound) fraction of the drug is available, increasing the risk of toxicity" },
      { id: "b", text: "The drug will have no pharmacologic effect at all" },
      { id: "c", text: "The drug's half-life will always lengthen regardless of clearance" },
      { id: "d", text: "Protein binding has no relationship to drug effect" },
    ],
    correct: ["a"],
    rationale:
      "Only the unbound, free fraction of a drug is pharmacologically active. When albumin is low, fewer binding sites are available, so a larger proportion of the total drug circulates unbound, increasing both effect and the risk of toxicity at a given total dose.",
    distractorRationales: {
      b: "Low albumin increases the free, active fraction; it does not eliminate the drug's effect.",
      c: "Half-life depends on the combination of volume of distribution and clearance, not automatically on protein binding alone; the effect on half-life is variable.",
      d: "Protein binding directly determines how much drug is free to act at receptors, so it has a strong relationship to effect.",
    },
    keyClue: "Low albumin plus a highly protein-bound drug is a classic setup for increased free-drug toxicity.",
    clinicalTakeaway:
      "Malnourished, elderly, and hepatically impaired patients often have low albumin, so highly protein-bound drugs like phenytoin or warfarin need extra caution in these populations.",
    remediationConcept:
      "Only unbound drug is active. Low albumin reduces available binding sites, raising the free fraction of highly protein-bound drugs and the risk of exaggerated or toxic effect.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["pharmacokinetics", "protein-binding", "toxicity"],
  },
];
