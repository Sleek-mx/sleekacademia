// Q11–20 — Antimicrobial stewardship, empiric vs definitive therapy,
// colonisation vs infection, duplicate coverage, treatment duration.

export default [
  {
    id: "q011",
    topic: "Antimicrobial stewardship",
    medicationClass: "General principles",
    difficulty: 4,
    type: "mcq",
    stem: "A patient in septic shock requires immediate empiric antibiotics. Which action is best?",
    options: [
      { id: "a", text: "Delay antibiotics until all cultures are finalized." },
      { id: "b", text: "Obtain cultures promptly, then begin appropriate broad-spectrum therapy without harmful delay." },
      { id: "c", text: "Begin the narrowest drug before evaluating the likely source." },
      { id: "d", text: "Wait for the procalcitonin result before treating." },
    ],
    correct: ["b"],
    rationale:
      "In septic shock, mortality rises measurably with each hour antimicrobials are delayed. Cultures should be drawn promptly because they guide later de-escalation, but obtaining them must not postpone treatment. Broad empiric coverage is appropriate here and is narrowed once results return.",
    distractorRationales: {
      a: "Final cultures take 24 to 72 hours. Waiting that long in shock is indefensible and directly increases mortality.",
      c: "Narrow therapy before the source is known risks missing the pathogen entirely. Narrow spectrum is the goal after identification, not before it.",
      d: "Procalcitonin is an adjunct that may support stopping antibiotics later. It is never a reason to withhold initial therapy in shock.",
    },
    keyClue: "Septic shock: cultures first if immediately feasible, antibiotics fast either way.",
    clinicalTakeaway:
      "Broad and early in shock, narrow and targeted once cultures return. Stewardship is about the second step, not delaying the first.",
    remediationConcept:
      "Empiric therapy is chosen before the organism is known, based on likely source and local resistance. It is deliberately broad in critical illness. Definitive therapy follows susceptibility results and is deliberately narrow.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["stewardship", "empiric", "sepsis", "priority"],
  },
  {
    id: "q012",
    topic: "Empiric versus definitive therapy",
    medicationClass: "Multiple classes",
    difficulty: 4,
    type: "mcq",
    stem: "Blood cultures identify methicillin-sensitive Staphylococcus aureus in a patient receiving vancomycin and cefepime. The isolate is susceptible to nafcillin. What is the best action?",
    options: [
      { id: "a", text: "Continue both empiric drugs." },
      { id: "b", text: "Add nafcillin to the existing regimen." },
      { id: "c", text: "De-escalate to targeted antistaphylococcal therapy." },
      { id: "d", text: "Stop treatment because the organism has been identified." },
    ],
    correct: ["c"],
    rationale:
      "For methicillin-sensitive Staphylococcus aureus bacteraemia, an antistaphylococcal beta-lactam such as nafcillin is superior to vancomycin — it achieves faster bacterial clearance and better outcomes. Identification of a susceptible organism is the trigger to de-escalate from two broad agents to one targeted agent.",
    distractorRationales: {
      a: "Continuing unnecessary vancomycin and cefepime prolongs nephrotoxicity risk and flora disruption while providing inferior therapy for MSSA.",
      b: "Adding a third antibiotic increases toxicity and cost with no benefit. De-escalation replaces agents rather than stacking them.",
      d: "Staphylococcus aureus bacteraemia requires a full treatment course. Identifying the organism refines therapy; it never ends it.",
    },
    keyClue: "MSSA is a beta-lactam infection. Vancomycin is the backup, not the preferred drug.",
    clinicalTakeaway:
      "Vancomycin is inferior to nafcillin, oxacillin or cefazolin for MSSA — de-escalating here improves the outcome as well as the stewardship.",
    remediationConcept:
      "For MSSA use an antistaphylococcal beta-lactam. Reserve vancomycin for MRSA or severe beta-lactam allergy. De-escalation is not merely narrowing spectrum; here it is also a switch to the more effective drug.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["stewardship", "de-escalation", "mssa", "definitive"],
  },
  {
    id: "q013",
    topic: "Colonization versus infection",
    medicationClass: "General principles",
    difficulty: 4,
    type: "mcq",
    stem: "An older adult has bacteriuria but no urinary symptoms, fever, pregnancy, or planned urologic procedure. Which action best supports stewardship?",
    options: [
      { id: "a", text: "Treat based solely on the culture." },
      { id: "b", text: "Avoid antibiotics and assess for other causes of nonspecific symptoms." },
      { id: "c", text: "Prescribe prophylactic ciprofloxacin." },
      { id: "d", text: "Repeat cultures until no bacteria grow." },
    ],
    correct: ["b"],
    rationale:
      "This is asymptomatic bacteriuria, which is common in older adults and does not warrant antibiotics. Treating it does not prevent symptomatic infection and does expose the patient to adverse effects, Clostridioides difficile risk and resistance. Nonspecific findings such as confusion or fatigue should prompt evaluation for other causes.",
    distractorRationales: {
      a: "A positive culture alone does not establish infection. Bacteriuria without clinical findings is colonisation.",
      c: "Prophylaxis is not indicated, and fluoroquinolones carry tendon, neuropathy and QT risks that are unjustifiable here.",
      d: "Repeat culturing until sterile is not a therapeutic goal. Bacteriuria frequently persists and does not require eradication.",
    },
    keyClue: "Treat the patient, not the culture. The exceptions are pregnancy and pre-urologic-procedure.",
    clinicalTakeaway:
      "Only two routine indications exist for treating asymptomatic bacteriuria: pregnancy, and before an invasive urologic procedure.",
    remediationConcept:
      "Colonisation is organism presence without tissue invasion or host response; infection adds clinical evidence of injury. Asymptomatic bacteriuria is the classic example — treat it only in pregnancy or before urologic instrumentation.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["stewardship", "colonization", "asymptomatic-bacteriuria"],
  },
  {
    id: "q014",
    topic: "Colonization versus infection",
    medicationClass: "General principles",
    difficulty: 3,
    type: "mcq",
    stem: "Which finding most strongly supports colonization rather than active infection?",
    options: [
      { id: "a", text: "Positive culture with compatible local and systemic symptoms" },
      { id: "b", text: "Organism isolated from a nonsterile site without clinical manifestations" },
      { id: "c", text: "New hypotension and elevated lactate" },
      { id: "d", text: "Purulent drainage with surrounding erythema" },
    ],
    correct: ["b"],
    rationale:
      "Colonisation means an organism is present and multiplying without invading tissue or provoking a host response. An isolate from a nonsterile site — skin, wound surface, sputum, urine — with no clinical findings is the defining picture.",
    distractorRationales: {
      a: "A positive culture together with compatible symptoms is the definition of infection, not colonisation.",
      c: "Hypotension with elevated lactate indicates tissue hypoperfusion and possible septic shock — severe infection requiring urgent treatment.",
      d: "Purulence with surrounding erythema demonstrates local inflammation and tissue invasion, which is infection.",
    },
    keyClue: "No host response equals colonisation. Look for fever, leukocytosis, erythema, purulence or organ dysfunction.",
    clinicalTakeaway:
      "Wound-surface and sputum cultures frequently grow colonisers; correlate every result with the clinical picture before treating.",
    remediationConcept:
      "Ask two questions of any positive culture: was the site sterile, and is there a host response? A nonsterile site with no host response points to colonisation and generally needs no antibiotic.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["colonization", "infection", "assessment"],
  },
  {
    id: "q015",
    topic: "Antimicrobial stewardship",
    medicationClass: "General principles",
    difficulty: 4,
    type: "mcq",
    stem: "A stable patient has positive influenza testing, low bacterial suspicion, and improving respiratory symptoms. What is the most appropriate antibiotic action?",
    options: [
      { id: "a", text: "Continue antibiotics because pneumonia was initially suspected." },
      { id: "b", text: "Reassess and discontinue antibacterial therapy when bacterial infection is unsupported." },
      { id: "c", text: "Add a second antibacterial drug." },
      { id: "d", text: "Continue antibiotics until the cough completely resolves." },
    ],
    correct: ["b"],
    rationale:
      "Antibacterials have no activity against influenza. With a confirmed viral cause, low suspicion of bacterial co-infection and clinical improvement, the correct step is an antibiotic time-out: reassess the indication and stop therapy that is no longer supported.",
    distractorRationales: {
      a: "Empiric therapy is a working hypothesis, not a commitment. New data disproving bacterial infection should change the plan.",
      c: "Escalating antibacterial coverage for a viral illness adds toxicity and resistance pressure with no possible benefit.",
      d: "Post-viral cough routinely persists for weeks. Cough resolution is not an antibiotic endpoint.",
    },
    keyClue: "A confirmed viral diagnosis plus clinical improvement is a stop signal for antibacterials.",
    clinicalTakeaway:
      "The antibiotic time-out at 48 to 72 hours exists precisely to catch therapy that new data no longer justify.",
    remediationConcept:
      "Stewardship includes stopping antibiotics, not only choosing them well. Reassess every regimen once diagnostic data return and discontinue when bacterial infection is unsupported.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["stewardship", "viral", "discontinuation", "time-out"],
  },
  {
    id: "q016",
    topic: "Antimicrobial stewardship",
    medicationClass: "General principles",
    difficulty: 3,
    type: "sata",
    stem: "Which actions are components of antimicrobial stewardship? Select all that apply.",
    options: [
      { id: "a", text: "Obtain appropriate cultures." },
      { id: "b", text: "Use the shortest effective duration." },
      { id: "c", text: "Treat all positive cultures." },
      { id: "d", text: "Review therapy after susceptibility results." },
      { id: "e", text: "De-escalate when appropriate." },
    ],
    correct: ["a", "b", "d", "e"],
    rationale:
      "Stewardship rests on obtaining cultures before therapy where feasible, limiting duration to the shortest effective course, reassessing once susceptibilities return, and de-escalating to targeted therapy. Together these preserve efficacy while limiting harm.",
    distractorRationales: {
      a: "Correct — cultures enable later de-escalation and are ideally obtained before the first dose.",
      b: "Correct — shorter evidence-based courses reduce adverse effects, Clostridioides difficile risk and resistance without compromising cure.",
      c: "This is the opposite of stewardship. Many positive cultures represent colonisation or contamination; treating all of them drives unnecessary antibiotic use.",
      d: "Correct — the antibiotic time-out at 48 to 72 hours is a core stewardship intervention.",
      e: "Correct — narrowing to the most targeted effective agent limits collateral damage to normal flora.",
    },
    keyClue: "Any option saying 'treat all' or 'always treat' conflicts with stewardship.",
    clinicalTakeaway:
      "Stewardship optimises therapy for the individual patient and for the community; it is not simply using fewer antibiotics.",
    remediationConcept:
      "The stewardship checklist is: right indication, right drug, right dose, right route, right duration, and reassessment. Treating every positive culture violates the first item.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["stewardship", "principles"],
  },
  {
    id: "q017",
    topic: "Culture and susceptibility",
    medicationClass: "General principles",
    difficulty: 4,
    type: "mcq",
    stem: "A urine culture grows an organism susceptible to several agents. Which factor should be considered in addition to susceptibility?",
    options: [
      { id: "a", text: "The medication name preferred by the patient's family" },
      { id: "b", text: "Infection site, organ function, allergies, interactions, and patient-specific risks" },
      { id: "c", text: "Whether the medication is the newest available drug" },
      { id: "d", text: "Whether the drug has the broadest possible spectrum" },
    ],
    correct: ["b"],
    rationale:
      "Susceptibility establishes that a drug can kill the organism in vitro. Suitability for this patient additionally requires that the drug reach the infection site in adequate concentration, be safe given renal and hepatic function, avoid documented allergies, and avoid significant interactions.",
    distractorRationales: {
      a: "Family preference does not determine antimicrobial selection, though education about the chosen agent is appropriate.",
      c: "Novelty is not an advantage. Newer agents should be reserved for resistant organisms to preserve their usefulness.",
      d: "The broadest spectrum is the wrong goal once the organism is known — it maximises flora disruption and resistance pressure.",
    },
    keyClue: "Susceptible on paper does not mean suitable for this patient at this site.",
    clinicalTakeaway:
      "Site penetration is a frequent trap: some agents adequate for cystitis never achieve therapeutic renal or bloodstream concentrations.",
    remediationConcept:
      "Distinguish organism susceptibility from patient-specific suitability. After identifying susceptible options, filter by site penetration, organ function, allergy, interactions, pregnancy or lactation status, and toxicity profile.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["culture", "susceptibility", "selection"],
  },
  {
    id: "q018",
    topic: "Culture and susceptibility",
    medicationClass: "General principles",
    difficulty: 3,
    type: "mcq",
    stem: "A nurse collects blood cultures after two antibiotic doses have been administered. What is the primary concern?",
    options: [
      { id: "a", text: "The cultures may have reduced diagnostic yield." },
      { id: "b", text: "The antibiotics will become bacteriostatic." },
      { id: "c", text: "The blood specimen will become toxic." },
      { id: "d", text: "The patient will automatically develop resistance." },
    ],
    correct: ["a"],
    rationale:
      "Antibiotic already circulating can suppress bacterial growth in the culture bottle, producing a false-negative or partially inhibited result. Without an organism and susceptibilities, therapy cannot be targeted or de-escalated, so the patient may remain on unnecessarily broad treatment.",
    distractorRationales: {
      b: "A drug's bactericidal or bacteriostatic character is an intrinsic property and does not change with the timing of specimen collection.",
      c: "The specimen does not become toxic. The issue is diagnostic sensitivity, not hazard.",
      d: "Resistance arises through selection pressure over time, not automatically from one mistimed specimen.",
    },
    keyClue: "Cultures before antibiotics whenever feasible — one dose can blind the result.",
    clinicalTakeaway:
      "Do not delay antibiotics in sepsis to obtain cultures, but do draw them first whenever it is immediately practical.",
    remediationConcept:
      "Circulating antibiotic inhibits growth in the culture bottle and lowers yield. Cultures should precede the first dose when feasible, since they are what later permits de-escalation.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["culture", "timing", "diagnostics"],
  },
  {
    id: "q019",
    topic: "Antimicrobial stewardship",
    medicationClass: "Multiple classes",
    difficulty: 5,
    type: "mcq",
    stem: "Which prescription most clearly represents unnecessary duplicate antimicrobial coverage?",
    options: [
      { id: "a", text: "Two agents deliberately prescribed for tuberculosis" },
      { id: "b", text: "Two beta-lactams covering substantially the same organisms without a documented indication" },
      { id: "c", text: "A beta-lactam plus a beta-lactamase inhibitor in one product" },
      { id: "d", text: "Empiric combination therapy for septic shock before culture results" },
    ],
    correct: ["b"],
    rationale:
      "Two beta-lactams with overlapping spectra and no documented rationale add toxicity, cost and resistance pressure without extending coverage. This redundant double coverage is a standard stewardship target.",
    distractorRationales: {
      a: "Multidrug tuberculosis therapy is deliberate and essential. Combination treatment prevents resistance and targets organisms in different metabolic states.",
      c: "This is a single rational product. The inhibitor protects the beta-lactam from enzymatic destruction rather than duplicating its coverage.",
      d: "Empiric combination therapy in septic shock is an accepted strategy to ensure the pathogen is covered before susceptibilities are known.",
    },
    keyClue: "Duplication means overlapping spectrum with no added benefit — not every use of two drugs.",
    clinicalTakeaway:
      "Combination therapy is justified to broaden coverage, prevent resistance or achieve synergy; overlapping same-class agents achieve none of these.",
    remediationConcept:
      "Redundant coverage is two agents treating the same organisms with no documented reason. Legitimate combinations exist for tuberculosis, empiric sepsis and synergy. Ask what the second drug adds.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["stewardship", "duplicate-therapy", "combination"],
  },
  {
    id: "q020",
    topic: "Antimicrobial stewardship",
    medicationClass: "General principles",
    difficulty: 4,
    type: "mcq",
    stem: "A patient is improving after seven days of therapy. The original order states \"continue until symptoms completely disappear.\" Which stewardship concern is most relevant?",
    options: [
      { id: "a", text: "Treatment duration should be based on evidence and infection type rather than an indefinite symptom endpoint." },
      { id: "b", text: "All infections require at least 21 days of treatment." },
      { id: "c", text: "Antibiotics should be stopped after the first normal temperature." },
      { id: "d", text: "Symptom resolution proves the initial diagnosis was viral." },
    ],
    correct: ["a"],
    rationale:
      "Duration should be set by the infection type and the evidence supporting it, with a defined stop date. An open-ended order tied to complete symptom resolution invites prolonged unnecessary exposure, because residual symptoms such as cough or fatigue often outlast the infection.",
    distractorRationales: {
      b: "There is no universal 21-day minimum. Evidence increasingly supports shorter courses for many common infections.",
      c: "A single normal temperature is not a stop criterion. Stopping too early risks relapse in established infection.",
      d: "Improvement on antibiotics does not establish a viral cause; if anything it is consistent with a treated bacterial infection.",
    },
    keyClue: "Every antibiotic order should carry an indication and a planned stop date.",
    clinicalTakeaway:
      "Shorter evidence-based courses achieve comparable cure rates with less toxicity, less Clostridioides difficile and less resistance.",
    remediationConcept:
      "Duration is determined by infection type and evidence, not by complete symptom resolution. Watch for orders lacking a defined endpoint, and for absolute claims such as 'all infections require'.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["stewardship", "duration"],
  },
];
