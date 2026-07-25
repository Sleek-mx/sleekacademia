// Q41–50 — Vancomycin: infusion reaction vs anaphylaxis, nephrotoxicity,
// monitoring, oral route for C. difficile, MSSA de-escalation.
// NOTE: q050 is the last free question. Everything from q051 is paywalled.

export default [
  {
    id: "q041",
    topic: "Vancomycin",
    medicationClass: "Glycopeptides",
    difficulty: 3,
    type: "mcq",
    stem: "A patient receiving intravenous vancomycin develops flushing and itching during a rapid infusion but has no airway swelling. What is the most likely cause?",
    options: [
      { id: "a", text: "Stevens-Johnson syndrome" },
      { id: "b", text: "Vancomycin infusion reaction" },
      { id: "c", text: "Serum sickness" },
      { id: "d", text: "Tendon rupture" },
    ],
    correct: ["b"],
    rationale:
      "Rapid vancomycin infusion triggers direct, non-immunologic mast-cell histamine release. The result is flushing and pruritus of the face, neck and upper torso — historically called red man syndrome. The absence of airway involvement and the clear link to infusion rate distinguish it from anaphylaxis.",
    distractorRationales: {
      a: "Stevens-Johnson syndrome involves mucosal erosions, blistering and epidermal detachment developing over days, not flushing during an infusion.",
      c: "Serum sickness produces fever, rash, arthralgia and lymphadenopathy roughly one to three weeks after exposure.",
      d: "Tendon rupture is a fluoroquinolone effect and has no relationship to infusion reactions.",
    },
    keyClue: "Rate-related flushing without airway involvement equals infusion reaction, not allergy.",
    clinicalTakeaway:
      "Because this reaction is histamine-mediated rather than IgE-mediated, vancomycin can usually be continued at a slower rate.",
    remediationConcept:
      "Vancomycin infusion reaction is rate-dependent direct histamine release causing upper-body flushing and pruritus. Anaphylaxis is IgE-mediated and adds bronchospasm, angioedema and haemodynamic instability. Rate matters for one and not the other.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["vancomycin", "infusion-reaction", "adverse-effect"],
  },
  {
    id: "q042",
    topic: "Vancomycin",
    medicationClass: "Glycopeptides",
    difficulty: 4,
    type: "mcq",
    stem: "What is the priority nursing response to a suspected vancomycin infusion reaction?",
    options: [
      { id: "a", text: "Increase the infusion rate." },
      { id: "b", text: "Stop or slow the infusion according to protocol, assess the patient, and notify the appropriate clinician." },
      { id: "c", text: "Administer the next dose intramuscularly." },
      { id: "d", text: "Label the event as definite anaphylaxis without assessment." },
    ],
    correct: ["b"],
    rationale:
      "Because the reaction is rate-related, stopping or slowing the infusion addresses the cause directly. Assessment then confirms whether this is a histamine reaction or evolving anaphylaxis, and notification allows orders for premedication or a slower rate.",
    distractorRationales: {
      a: "Increasing the rate intensifies histamine release and worsens the reaction.",
      c: "Vancomycin is not given intramuscularly — it causes severe tissue injury by that route.",
      d: "Labelling the event anaphylaxis without assessment may permanently and wrongly remove a needed drug from the patient's options.",
    },
    keyClue: "Rate-related problem, rate-related fix — then assess, then notify.",
    clinicalTakeaway:
      "Extending the infusion time, often to at least 60 minutes or longer for larger doses, usually prevents recurrence.",
    remediationConcept:
      "For an infusion reaction: stop or slow per protocol, assess airway and haemodynamics, notify, and anticipate antihistamine premedication with a slower rate. Nurses act within protocol; they do not independently discontinue therapy outright.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["vancomycin", "infusion-reaction", "priority", "nursing-action"],
  },
  {
    id: "q043",
    topic: "Organ toxicity",
    medicationClass: "Glycopeptides",
    difficulty: 3,
    type: "mcq",
    stem: "Which finding most strongly suggests vancomycin-associated nephrotoxicity?",
    options: [
      { id: "a", text: "Rising serum creatinine" },
      { id: "b", text: "Increased appetite" },
      { id: "c", text: "Mild nasal congestion" },
      { id: "d", text: "Decreased platelet aggregation time" },
    ],
    correct: ["a"],
    rationale:
      "A rising serum creatinine reflects falling glomerular filtration and is the standard marker of vancomycin nephrotoxicity. Risk increases with higher exposure, longer duration, and concurrent nephrotoxins such as aminoglycosides, piperacillin-tazobactam, contrast or NSAIDs.",
    distractorRationales: {
      b: "Increased appetite is unrelated to renal injury; anorexia would be more consistent with uraemia.",
      c: "Nasal congestion has no relationship to vancomycin nephrotoxicity.",
      d: "Platelet aggregation is not a renal marker. Vancomycin can rarely cause thrombocytopenia, but that is a haematologic effect.",
    },
    keyClue: "Nephrotoxicity is tracked by creatinine and urine output.",
    clinicalTakeaway:
      "Creatinine lags behind actual injury, so declining urine output may signal nephrotoxicity before laboratory values move.",
    remediationConcept:
      "Monitor vancomycin nephrotoxicity with serum creatinine, estimated GFR and urine output. Risk multiplies with concurrent nephrotoxins — aminoglycosides above all.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["vancomycin", "nephrotoxicity", "monitoring"],
  },
  {
    id: "q044",
    topic: "Vancomycin",
    medicationClass: "Glycopeptides",
    difficulty: 3,
    type: "sata",
    stem: "Which parameters may be monitored during intravenous vancomycin therapy? Select all that apply.",
    options: [
      { id: "a", text: "Renal function" },
      { id: "b", text: "Serum drug exposure according to institutional protocol" },
      { id: "c", text: "Infusion-related reactions" },
      { id: "d", text: "Hearing symptoms in high-risk patients" },
      { id: "e", text: "Urine output" },
    ],
    correct: ["a", "b", "c", "d", "e"],
    rationale:
      "All five are legitimate. Renal function and urine output track nephrotoxicity; serum exposure monitoring (trough or AUC-guided per protocol) balances efficacy against toxicity; infusion reactions are rate-related and common; and ototoxicity, though less frequent than with aminoglycosides, warrants attention in high-risk patients such as those with renal impairment or concurrent ototoxins.",
    distractorRationales: {
      a: "Correct — vancomycin is renally cleared and nephrotoxic, making renal function central.",
      b: "Correct — many institutions have moved from trough-only monitoring to AUC-guided dosing.",
      c: "Correct — flushing and pruritus during infusion are rate-related and should be assessed.",
      d: "Correct — ototoxicity risk rises with high exposure, renal impairment and concurrent aminoglycosides.",
      e: "Correct — urine output may fall before creatinine rises.",
    },
    keyClue: "Vancomycin monitoring covers kidneys, drug exposure, infusion tolerance and hearing.",
    clinicalTakeaway:
      "Vancomycin is one of the few antibacterials requiring routine therapeutic drug monitoring.",
    remediationConcept:
      "Monitor renal function, urine output, serum exposure per protocol, infusion reactions, and hearing in high-risk patients. When all options in a select-all are genuine monitoring parameters, select them all.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["vancomycin", "monitoring", "nephrotoxicity", "ototoxicity"],
  },
  {
    id: "q045",
    topic: "Drug interactions",
    medicationClass: "Glycopeptides",
    difficulty: 4,
    type: "mcq",
    stem: "A patient receiving vancomycin and gentamicin has a rising creatinine. Why is this combination concerning?",
    options: [
      { id: "a", text: "Both drugs may contribute to nephrotoxicity." },
      { id: "b", text: "Both drugs cause folate deficiency." },
      { id: "c", text: "Both drugs reduce calcium absorption." },
      { id: "d", text: "Both drugs cause universal hypoglycemia." },
    ],
    correct: ["a"],
    rationale:
      "Vancomycin and aminoglycosides are each independently nephrotoxic, and together the risk is additive to synergistic. Both also carry ototoxic potential. This is a classic combination requiring close renal monitoring and prompt reassessment when creatinine rises.",
    distractorRationales: {
      b: "Folate antagonism belongs to trimethoprim and sulfonamides, not to these agents.",
      c: "Neither drug affects calcium absorption; that concern involves tetracycline and fluoroquinolone chelation.",
      d: "Neither causes hypoglycaemia, and 'universal' would overstate any such effect.",
    },
    keyClue: "Stacking nephrotoxins multiplies renal risk — vancomycin plus an aminoglycoside is the classic pair.",
    clinicalTakeaway:
      "This combination endangers both kidney and ear, so watch creatinine, urine output and new hearing or balance symptoms together.",
    remediationConcept:
      "Recognise additive nephrotoxicity: vancomycin, aminoglycosides, amphotericin B, NSAIDs, contrast and piperacillin-tazobactam. When two appear together, renal monitoring intensifies and de-escalation should be considered as soon as cultures permit.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["interaction", "nephrotoxicity", "vancomycin", "aminoglycoside"],
  },
  {
    id: "q046",
    topic: "Severe reactions",
    medicationClass: "Glycopeptides",
    difficulty: 4,
    type: "mcq",
    stem: "Which finding favors anaphylaxis rather than a vancomycin infusion reaction?",
    options: [
      { id: "a", text: "Flushing during rapid infusion" },
      { id: "b", text: "Pruritus without respiratory symptoms" },
      { id: "c", text: "Bronchospasm, angioedema, and cardiovascular instability" },
      { id: "d", text: "Redness of the upper torso only" },
    ],
    correct: ["c"],
    rationale:
      "Bronchospasm, angioedema and cardiovascular instability indicate systemic IgE-mediated mast-cell activation — anaphylaxis. This is a medical emergency requiring the drug to be stopped, airway support and epinephrine. Infusion reactions remain confined to cutaneous flushing and pruritus.",
    distractorRationales: {
      a: "Flushing tied to rapid infusion is the hallmark of the rate-related histamine reaction.",
      b: "Pruritus without respiratory involvement is consistent with an infusion reaction rather than anaphylaxis.",
      d: "Upper-torso redness is the classic distribution of vancomycin infusion reaction.",
    },
    keyClue: "Airway plus circulation involvement means anaphylaxis. Skin alone means infusion reaction.",
    clinicalTakeaway:
      "The distinction changes everything: an infusion reaction means slow the rate, anaphylaxis means stop the drug and give epinephrine.",
    remediationConcept:
      "Infusion reaction is cutaneous, rate-related and non-immunologic. Anaphylaxis is systemic and IgE-mediated, adding bronchospasm, angioedema and hypotension. Never dismiss airway or haemodynamic findings as red man syndrome.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["vancomycin", "anaphylaxis", "differentiation", "priority"],
  },
  {
    id: "q047",
    topic: "Vancomycin",
    medicationClass: "Glycopeptides",
    difficulty: 4,
    type: "mcq",
    stem: "Oral vancomycin is prescribed for Clostridioides difficile infection. Why is the oral route useful?",
    options: [
      { id: "a", text: "It produces high drug concentrations within the intestinal lumen." },
      { id: "b", text: "It guarantees high cerebrospinal fluid concentrations." },
      { id: "c", text: "It prevents every recurrence." },
      { id: "d", text: "It eliminates the need for isolation precautions." },
    ],
    correct: ["a"],
    rationale:
      "Oral vancomycin is minimally absorbed, which is exactly what makes it effective here. The drug remains in the intestinal lumen at high concentration, acting locally on C. difficile. That same poor absorption is why oral vancomycin cannot treat systemic infection.",
    distractorRationales: {
      b: "Poor absorption means negligible systemic and cerebrospinal fluid levels. Central nervous system infection requires intravenous therapy.",
      c: "Recurrence occurs in a substantial minority of patients even after appropriate treatment.",
      d: "Contact precautions remain essential; C. difficile spores resist alcohol-based hand rub, so soap and water are required.",
    },
    keyClue: "Poor oral absorption is the therapeutic feature, not a limitation, for luminal C. difficile.",
    clinicalTakeaway:
      "Route determines site of action: oral vancomycin treats the colon, intravenous vancomycin treats the bloodstream, and neither substitutes for the other.",
    remediationConcept:
      "Oral vancomycin stays in the gut lumen and treats C. difficile locally; intravenous vancomycin treats systemic infection but does not reach the colonic lumen. Maintain contact precautions and soap-and-water hand hygiene regardless.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["vancomycin", "c-difficile", "route", "pharmacokinetics"],
  },
  {
    id: "q048",
    topic: "Vancomycin",
    medicationClass: "Glycopeptides",
    difficulty: 4,
    type: "mcq",
    stem: "A patient's vancomycin exposure is above the institutional target, and renal function is worsening. What should the nurse anticipate?",
    options: [
      { id: "a", text: "Dose or interval adjustment" },
      { id: "b", text: "Automatic addition of gentamicin" },
      { id: "c", text: "Doubling the next dose" },
      { id: "d", text: "Elimination of renal monitoring" },
    ],
    correct: ["a"],
    rationale:
      "Supratherapeutic exposure with declining renal function indicates accumulation. The expected response is to reduce the dose or extend the interval, guided by pharmacy and renal function, to bring exposure back into the target range and limit further injury.",
    distractorRationales: {
      b: "Adding gentamicin would stack a second nephrotoxin onto worsening renal function — the opposite of appropriate care.",
      c: "Doubling the dose in the setting of accumulation and renal decline would accelerate nephrotoxicity.",
      d: "Renal monitoring becomes more important, not less, when function is deteriorating.",
    },
    keyClue: "High level plus falling renal function equals hold or adjust, never escalate.",
    clinicalTakeaway:
      "Vancomycin dosing is a moving target; each change in renal function requires reassessment of dose and interval.",
    remediationConcept:
      "When exposure exceeds target and renal function worsens, anticipate dose reduction or interval extension and continued monitoring. Recognise that adding another nephrotoxin or increasing the dose are always wrong in this scenario.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["vancomycin", "monitoring", "dose-adjustment"],
  },
  {
    id: "q049",
    topic: "Vancomycin",
    medicationClass: "Glycopeptides",
    difficulty: 3,
    type: "mcq",
    stem: "Which patient statement requires correction?",
    options: [
      { id: "a", text: "\"I should report reduced urine output.\"" },
      { id: "b", text: "\"The infusion rate can influence infusion reactions.\"" },
      { id: "c", text: "\"Kidney function does not matter once treatment begins.\"" },
      { id: "d", text: "\"The care team may monitor serum exposure.\"" },
    ],
    correct: ["c"],
    rationale:
      "Renal function matters throughout vancomycin therapy, not merely at initiation. It governs clearance, dictates dose and interval, and can change during treatment because vancomycin itself is nephrotoxic. Ongoing monitoring is essential.",
    distractorRationales: {
      a: "Correct understanding. Falling urine output may be the earliest sign of nephrotoxicity and should be reported.",
      b: "Correct understanding. Infusion reactions are rate-related, which is why slower administration helps.",
      d: "Correct understanding. Serum exposure monitoring, whether trough-based or AUC-guided, is routine.",
    },
    keyClue: "Any statement dismissing ongoing monitoring is the one needing correction.",
    clinicalTakeaway:
      "Vancomycin creates a feedback loop: the drug can injure the kidney, and the injured kidney then accumulates more drug.",
    remediationConcept:
      "Renal monitoring continues throughout vancomycin therapy because the drug is both renally cleared and nephrotoxic. In 'requires correction' questions, identify the false statement rather than the true ones.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["vancomycin", "patient-education", "monitoring"],
  },
  {
    id: "q050",
    topic: "Antimicrobial stewardship",
    medicationClass: "Glycopeptides",
    difficulty: 5,
    type: "mcq",
    stem: "A patient with methicillin-sensitive Staphylococcus aureus bacteremia is improving on vancomycin. Susceptibility results support an antistaphylococcal beta-lactam, and no severe allergy exists. What is the stewardship-focused action?",
    options: [
      { id: "a", text: "Continue vancomycin solely because it was started first." },
      { id: "b", text: "Consider changing to the preferred targeted beta-lactam." },
      { id: "c", text: "Add the beta-lactam while continuing vancomycin indefinitely." },
      { id: "d", text: "Stop all antimicrobial therapy." },
    ],
    correct: ["b"],
    rationale:
      "For MSSA bacteraemia, nafcillin, oxacillin or cefazolin outperform vancomycin — faster clearance and better outcomes. Clinical improvement does not justify staying on the inferior agent. Switching also removes ongoing nephrotoxicity risk and the need for drug-level monitoring.",
    distractorRationales: {
      a: "Inertia is not a clinical rationale. 'It was started first' ignores the susceptibility data now available.",
      c: "Indefinite dual therapy adds toxicity and monitoring burden without benefit. De-escalation replaces rather than adds.",
      d: "Staphylococcus aureus bacteraemia requires a complete course; stopping early risks relapse, endocarditis and seeding.",
    },
    keyClue: "For MSSA, the beta-lactam is not merely narrower — it is more effective.",
    clinicalTakeaway:
      "Here stewardship and individual patient benefit point the same way, which is the strongest possible case for switching.",
    remediationConcept:
      "MSSA bacteraemia is treated with an antistaphylococcal beta-lactam; vancomycin is the alternative for MRSA or severe allergy. Improvement on an inferior agent is not a reason to continue it once susceptibilities are known.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["stewardship", "de-escalation", "mssa", "vancomycin"],
  },
];
