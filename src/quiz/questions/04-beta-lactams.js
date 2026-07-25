// Q31–40 — Penicillins and cephalosporins: hypersensitivity, cross-reactivity,
// C. difficile, renal dosing, cefepime neurotoxicity, biliary sludging.

export default [
  {
    id: "q031",
    topic: "Penicillins and cephalosporins",
    medicationClass: "Penicillins",
    difficulty: 4,
    type: "mcq",
    stem: "A patient reports anaphylaxis after penicillin. Which new prescription requires immediate clarification?",
    options: [
      { id: "a", text: "Piperacillin-tazobactam" },
      { id: "b", text: "Azithromycin" },
      { id: "c", text: "Doxycycline" },
      { id: "d", text: "Levofloxacin" },
    ],
    correct: ["a"],
    rationale:
      "Piperacillin is a penicillin. Giving any penicillin to a patient with documented penicillin anaphylaxis risks a life-threatening reaction, so the order must be clarified before administration.",
    distractorRationales: {
      b: "Azithromycin is a macrolide with no structural relationship to penicillin, which is why it is a common alternative in penicillin-allergic patients.",
      c: "Doxycycline is a tetracycline and shares no beta-lactam ring, so cross-reactivity is not a concern.",
      d: "Levofloxacin is a fluoroquinolone and structurally unrelated to penicillins.",
    },
    keyClue: "Read past the brand-style combination name — 'piperacillin' contains '-cillin'.",
    clinicalTakeaway:
      "Combination product names can hide the offending class; always identify each component before administering.",
    remediationConcept:
      "In documented penicillin anaphylaxis, avoid all penicillins. Learn the class by stem: '-cillin' is a penicillin, 'cef-' or 'ceph-' is a cephalosporin, '-penem' is a carbapenem. Macrolides, tetracyclines and fluoroquinolones are structurally unrelated.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["allergy", "penicillin", "clarify-order", "priority"],
  },
  {
    id: "q032",
    topic: "Penicillins and cephalosporins",
    medicationClass: "Penicillins",
    difficulty: 3,
    type: "mcq",
    stem: "Which finding after the first dose of amoxicillin requires immediate intervention?",
    options: [
      { id: "a", text: "Mild nausea" },
      { id: "b", text: "Metallic taste" },
      { id: "c", text: "Wheezing and facial swelling" },
      { id: "d", text: "Temporary appetite reduction" },
    ],
    correct: ["c"],
    rationale:
      "Wheezing with facial swelling indicates bronchospasm and angioedema — evolving anaphylaxis. This threatens the airway and requires immediate action: stop the drug, assess airway, breathing and circulation, call for help and anticipate epinephrine.",
    distractorRationales: {
      a: "Mild nausea is a common, expected gastrointestinal effect that can often be reduced by taking the drug with food.",
      b: "Metallic taste is associated with metronidazole and is not an emergency in any case.",
      d: "Temporary appetite reduction is a minor expected effect requiring monitoring, not intervention.",
    },
    keyClue: "Airway involvement — wheeze, stridor, facial or tongue swelling — always outranks everything else.",
    clinicalTakeaway:
      "Distinguish an adverse effect from a true hypersensitivity reaction: nausea is intolerance, angioedema is allergy.",
    remediationConcept:
      "Anaphylaxis presents with airway compromise, bronchospasm, angioedema and cardiovascular instability, typically within minutes to an hour. Prioritise any airway finding above gastrointestinal complaints.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["allergy", "anaphylaxis", "priority", "penicillin"],
  },
  {
    id: "q033",
    topic: "Penicillins and cephalosporins",
    medicationClass: "Penicillins",
    difficulty: 3,
    type: "mcq",
    stem: "Why is piperacillin combined with tazobactam?",
    options: [
      { id: "a", text: "Tazobactam inhibits certain beta-lactamases." },
      { id: "b", text: "Tazobactam prevents renal excretion." },
      { id: "c", text: "Piperacillin prevents tazobactam allergy." },
      { id: "d", text: "Both medications inhibit bacterial DNA gyrase." },
    ],
    correct: ["a"],
    rationale:
      "Tazobactam is a beta-lactamase inhibitor with little intrinsic antibacterial activity. By inactivating beta-lactamases it protects piperacillin from enzymatic destruction, extending coverage to many beta-lactamase-producing gram-negative organisms and anaerobes.",
    distractorRationales: {
      b: "Tazobactam does not block renal excretion; both components are renally eliminated and require dose adjustment in kidney impairment.",
      c: "Neither component prevents allergy to the other. The combination remains contraindicated in penicillin anaphylaxis.",
      d: "DNA gyrase is the fluoroquinolone target. Piperacillin acts on the cell wall and tazobactam inhibits an enzyme.",
    },
    keyClue: "A second component ending in '-bactam' signals a beta-lactamase inhibitor.",
    clinicalTakeaway:
      "Piperacillin-tazobactam is broad but still inactive against MRSA, because altered PBP resistance is not enzyme-mediated.",
    remediationConcept:
      "Beta-lactamase inhibitors — tazobactam, clavulanate, sulbactam, avibactam, vaborbactam — shield their partner drug from destruction. They extend spectrum but do not reduce allergy risk or defeat altered-PBP resistance.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["beta-lactamase-inhibitor", "combination", "mechanism"],
  },
  {
    id: "q034",
    topic: "Penicillins and cephalosporins",
    medicationClass: "Penicillins",
    difficulty: 4,
    type: "mcq",
    stem: "A patient with a vague childhood history of \"penicillin allergy\" cannot describe the reaction. What is the best nursing action?",
    options: [
      { id: "a", text: "Document anaphylaxis without further assessment." },
      { id: "b", text: "Remove the allergy from the record." },
      { id: "c", text: "Obtain a detailed allergy history and communicate uncertainty to the prescriber." },
      { id: "d", text: "Administer a full dose to test the reaction." },
    ],
    correct: ["c"],
    rationale:
      "Most reported penicillin allergies are not true IgE-mediated hypersensitivity. A structured history — what happened, how soon, how it was treated, whether penicillins have been tolerated since — lets the team decide whether the label is accurate. Unverified labels push patients toward broader, more toxic and less effective alternatives.",
    distractorRationales: {
      a: "Documenting anaphylaxis that was never established falsifies the record and permanently narrows future options.",
      b: "The nurse cannot unilaterally delete an allergy. Removal follows evaluation, sometimes including skin testing.",
      d: "Deliberately provoking a reaction is unsafe and outside nursing scope. Any challenge occurs only under supervised protocol.",
    },
    keyClue: "Vague allergy history means clarify and document, not assume in either direction.",
    clinicalTakeaway:
      "Inaccurate penicillin allergy labels are associated with worse outcomes, more C. difficile and more resistant infections.",
    remediationConcept:
      "A useful allergy history captures the specific reaction, its timing, its treatment and any subsequent tolerance. Distinguish intolerance such as nausea from true hypersensitivity. Communicate uncertainty rather than resolving it by assumption.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["allergy", "assessment", "documentation"],
  },
  {
    id: "q035",
    topic: "Penicillins and cephalosporins",
    medicationClass: "Cephalosporins",
    difficulty: 4,
    type: "mcq",
    stem: "Which statement about cephalosporins is most accurate?",
    options: [
      { id: "a", text: "All patients with any penicillin reaction must avoid every cephalosporin." },
      { id: "b", text: "Cross-reactivity risk depends partly on the reaction type and structural similarity." },
      { id: "c", text: "Cephalosporins cannot cause anaphylaxis." },
      { id: "d", text: "Cephalosporins are antivirals." },
    ],
    correct: ["b"],
    rationale:
      "Cross-reactivity is driven largely by side-chain similarity rather than the shared beta-lactam ring, and by whether the original reaction was IgE-mediated. Cephalosporins with dissimilar side chains carry low cross-reactivity risk, so many patients with a mild penicillin history can receive them safely.",
    distractorRationales: {
      a: "'All' and 'any' overstate the risk. Blanket avoidance after a mild or non-immunologic reaction needlessly restricts effective therapy.",
      c: "Cephalosporins can absolutely cause anaphylaxis independently of any penicillin history.",
      d: "Cephalosporins are antibacterial beta-lactams with no antiviral activity.",
    },
    keyClue: "Side-chain similarity, not the beta-lactam ring, drives most cross-reactivity.",
    clinicalTakeaway:
      "Severe IgE-mediated penicillin anaphylaxis still warrants caution, but the older blanket 10 percent cross-reactivity figure substantially overstates modern risk.",
    remediationConcept:
      "Cephalosporin cross-reactivity depends on the reaction type and on R-group side-chain similarity. Reject absolute statements in either direction, and remember cephalosporins carry their own independent anaphylaxis risk.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["allergy", "cross-reactivity", "cephalosporin"],
  },
  {
    id: "q036",
    topic: "Organ toxicity",
    medicationClass: "Penicillins",
    difficulty: 3,
    type: "mcq",
    stem: "A patient taking amoxicillin-clavulanate develops severe watery diarrhea. What is the priority concern?",
    options: [
      { id: "a", text: "Expected therapeutic effect" },
      { id: "b", text: "Clostridioides difficile infection" },
      { id: "c", text: "Hypoglycemia" },
      { id: "d", text: "Iron overload" },
    ],
    correct: ["b"],
    rationale:
      "Severe watery diarrhoea during or after antibiotic therapy raises concern for Clostridioides difficile infection. Disruption of normal colonic flora permits C. difficile overgrowth and toxin production, which can progress to pseudomembranous colitis, toxic megacolon and perforation.",
    distractorRationales: {
      a: "Diarrhoea is never a therapeutic effect. Mild loose stools may be an expected adverse effect, but severe watery diarrhoea requires evaluation.",
      c: "Hypoglycaemia is not associated with amoxicillin-clavulanate.",
      d: "Iron overload is unrelated to antibiotic therapy and would not present as acute diarrhoea.",
    },
    keyClue: "Severe watery diarrhoea plus recent antibiotics equals evaluate for C. difficile.",
    clinicalTakeaway:
      "Do not give antimotility agents for suspected C. difficile — retaining toxin can precipitate toxic megacolon.",
    remediationConcept:
      "Any antibiotic can precipitate C. difficile, though clindamycin, fluoroquinolones, broad cephalosporins and amoxicillin-clavulanate are frequent culprits. Evaluate, implement contact precautions, and avoid antimotility drugs.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["c-difficile", "adverse-effect", "priority"],
  },
  {
    id: "q037",
    topic: "Organ toxicity",
    medicationClass: "Cephalosporins",
    difficulty: 3,
    type: "mcq",
    stem: "Which assessment is most important before administering a renally eliminated beta-lactam to a patient with acute kidney injury?",
    options: [
      { id: "a", text: "Current body weight and last recorded temperature" },
      { id: "b", text: "Renal function and prescribed dose interval" },
      { id: "c", text: "Intravenous site appearance and dressing type" },
      { id: "d", text: "Daily calcium intake and usual meal schedule" },
    ],
    correct: ["b"],
    rationale:
      "Most beta-lactams are cleared by the kidneys. In acute kidney injury, unadjusted dosing causes accumulation and dose-dependent toxicity, most notably neurotoxicity with seizures. Verifying current renal function against the prescribed dose and interval is the essential safety check.",
    distractorRationales: {
      a: "Weight and temperature are routine assessments and weight informs some dosing, but neither identifies the accumulation risk created by falling renal clearance.",
      c: "Inspecting the intravenous site detects phlebitis or infiltration. It is appropriate care but does not address the dose-related risk in kidney injury.",
      d: "Calcium intake and meal timing matter for oral tetracycline and fluoroquinolone absorption, not for a parenteral renally eliminated beta-lactam.",
    },
    keyClue: "Renally cleared drug plus kidney injury equals verify the dose and interval.",
    clinicalTakeaway:
      "Beta-lactams are generally well tolerated, but accumulation in renal failure produces genuine neurotoxicity.",
    remediationConcept:
      "Check renal function before renally eliminated antimicrobials: beta-lactams, vancomycin, aminoglycosides, fluconazole and acyclovir. Dose reduction or interval extension prevents accumulation toxicity.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["renal-dosing", "assessment", "beta-lactam"],
  },
  {
    id: "q038",
    topic: "Organ toxicity",
    medicationClass: "Cephalosporins",
    difficulty: 5,
    type: "mcq",
    stem: "A patient receiving high-dose cefepime with severe renal impairment develops confusion and myoclonus. Which adverse effect should be suspected?",
    options: [
      { id: "a", text: "Cefepime-associated neurotoxicity" },
      { id: "b", text: "Red man syndrome" },
      { id: "c", text: "Tendon rupture" },
      { id: "d", text: "Tooth discoloration" },
    ],
    correct: ["a"],
    rationale:
      "Cefepime accumulates when renal clearance falls and is the beta-lactam most associated with neurotoxicity. Presentations include confusion, encephalopathy, myoclonus, non-convulsive status epilepticus and seizures. It is frequently misattributed to sepsis-related delirium, which delays recognition.",
    distractorRationales: {
      b: "Red man syndrome is a rate-related vancomycin infusion reaction causing flushing and pruritus, not a neurologic syndrome.",
      c: "Tendon rupture is a fluoroquinolone adverse effect.",
      d: "Tooth discoloration is a tetracycline effect in developing teeth.",
    },
    keyClue: "Cefepime plus renal impairment plus new confusion or myoclonus equals drug neurotoxicity.",
    clinicalTakeaway:
      "Cefepime neurotoxicity is reversible when caught early, so the key intervention is recognising it and reporting for dose adjustment.",
    remediationConcept:
      "Cefepime neurotoxicity arises from accumulation in renal impairment and presents as confusion, myoclonus or seizures. Verify renal dose adjustment and report new neurologic change rather than attributing it to the underlying illness.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["neurotoxicity", "cefepime", "renal-dosing", "priority"],
  },
  {
    id: "q039",
    topic: "Organ toxicity",
    medicationClass: "Cephalosporins",
    difficulty: 4,
    type: "mcq",
    stem: "A patient receiving ceftriaxone reports right upper-quadrant discomfort. Which complication may require evaluation?",
    options: [
      { id: "a", text: "Biliary sludging" },
      { id: "b", text: "Tendon rupture" },
      { id: "c", text: "Optic neuritis" },
      { id: "d", text: "Gray baby syndrome" },
    ],
    correct: ["a"],
    rationale:
      "Ceftriaxone is substantially excreted in bile and can precipitate as calcium-ceftriaxone salts in the gallbladder, producing biliary sludging or pseudolithiasis. Right upper-quadrant pain during therapy should prompt evaluation. It is usually reversible after discontinuation.",
    distractorRationales: {
      b: "Tendon rupture is associated with fluoroquinolones.",
      c: "Optic neuritis with reduced visual acuity and colour discrimination is the classic ethambutol toxicity.",
      d: "Gray baby syndrome is a chloramphenicol effect in neonates.",
    },
    keyClue: "Ceftriaxone is the biliary cephalosporin — right upper quadrant pain points to sludging.",
    clinicalTakeaway:
      "Ceftriaxone also binds calcium in solution, which is why it must not be co-administered with calcium-containing intravenous fluids in neonates.",
    remediationConcept:
      "Ceftriaxone is unusual among cephalosporins in being largely biliary excreted, so it causes biliary sludging and needs little renal adjustment. Match the adverse effect to the organ of elimination.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["ceftriaxone", "biliary", "adverse-effect"],
  },
  {
    id: "q040",
    topic: "Antimicrobial stewardship",
    medicationClass: "Multiple classes",
    difficulty: 4,
    type: "mcq",
    stem: "A culture identifies an organism susceptible to a narrow-spectrum penicillin. The patient is stable on meropenem. Which action is best?",
    options: [
      { id: "a", text: "Continue meropenem because broader is always safer." },
      { id: "b", text: "Consider de-escalation to the narrow-spectrum agent." },
      { id: "c", text: "Add the penicillin without stopping meropenem." },
      { id: "d", text: "Stop all treatment immediately." },
    ],
    correct: ["b"],
    rationale:
      "Meropenem is a last-line carbapenem. Once a narrow-spectrum penicillin is shown to cover the organism, de-escalating preserves carbapenem activity for resistant infections while reducing the patient's exposure to broad flora disruption and C. difficile risk.",
    distractorRationales: {
      a: "Broader is not safer. Broad coverage increases resistance selection, C. difficile risk and secondary fungal infection.",
      c: "Adding a redundant agent creates duplicate coverage with extra toxicity and no benefit.",
      d: "Stopping all therapy abandons a treated infection before the course is complete and risks relapse.",
    },
    keyClue: "Stable patient plus susceptible narrow agent equals de-escalate.",
    clinicalTakeaway:
      "Carbapenem-sparing is a priority stewardship goal, since carbapenem resistance leaves very few options.",
    remediationConcept:
      "De-escalation switches from broad to targeted therapy once susceptibilities return. Preserving carbapenems matters because carbapenem-resistant organisms have severely limited treatment options.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["stewardship", "de-escalation", "carbapenem-sparing"],
  },
];
