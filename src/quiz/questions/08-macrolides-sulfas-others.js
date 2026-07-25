// Q71–80 — Macrolides, sulfonamides/trimethoprim, metronidazole, clindamycin:
// QT risk, CYP inhibition, SJS/TEN, hyperkalaemia, warfarin, disulfiram-like
// reaction, C. difficile.

export default [
  {
    id: "q071",
    topic: "Macrolides",
    medicationClass: "Macrolides",
    difficulty: 4,
    type: "mcq",
    stem: "A patient taking azithromycin has a history of prolonged QT interval. What is the primary concern?",
    options: [
      { id: "a", text: "Increased risk of dysrhythmia" },
      { id: "b", text: "Fetal tooth staining" },
      { id: "c", text: "Neuromuscular blockade" },
      { id: "d", text: "Red man syndrome" },
    ],
    correct: ["a"],
    rationale:
      "Macrolides prolong the QT interval by blocking cardiac potassium channels. In a patient with baseline QT prolongation this compounds the risk of torsades de pointes, a polymorphic ventricular tachycardia that can degenerate into ventricular fibrillation.",
    distractorRationales: {
      b: "Fetal tooth staining is a tetracycline effect. Azithromycin is in fact one of the macrolides considered acceptable in pregnancy.",
      c: "Neuromuscular blockade is a rare aminoglycoside complication.",
      d: "Red man syndrome is a rate-related vancomycin infusion reaction.",
    },
    keyClue: "Existing QT prolongation plus a QT-prolonging drug equals additive dysrhythmia risk.",
    clinicalTakeaway:
      "Review the whole medication list — antipsychotics, ondansetron, fluoroquinolones and azoles all add QT risk.",
    remediationConcept:
      "Macrolides and fluoroquinolones prolong QT. Assess baseline ECG when indicated, correct potassium and magnesium, and avoid stacking multiple QT-prolonging agents.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["macrolide", "qt-prolongation", "cardiac", "priority"],
  },
  {
    id: "q072",
    topic: "Drug interactions",
    medicationClass: "Macrolides",
    difficulty: 4,
    type: "mcq",
    stem: "Which medication is a strong inhibitor of several cytochrome P450 pathways and has substantial interaction potential?",
    options: [
      { id: "a", text: "Clarithromycin" },
      { id: "b", text: "Penicillin V" },
      { id: "c", text: "Cephalexin" },
      { id: "d", text: "Nitrofurantoin" },
    ],
    correct: ["a"],
    rationale:
      "Clarithromycin is a potent CYP3A4 inhibitor. It raises concentrations of many co-administered drugs including statins (rhabdomyolysis risk), warfarin (bleeding), certain calcium channel blockers (hypotension), and some immunosuppressants. Azithromycin has substantially less CYP interaction potential.",
    distractorRationales: {
      b: "Penicillin V is renally eliminated with minimal cytochrome P450 involvement.",
      c: "Cephalexin is renally eliminated and not a significant enzyme inhibitor.",
      d: "Nitrofurantoin is not a notable CYP inhibitor; its concerns are pulmonary and neurologic toxicity with long-term use.",
    },
    keyClue: "Among macrolides, clarithromycin and erythromycin inhibit CYP3A4; azithromycin largely does not.",
    clinicalTakeaway:
      "Switching clarithromycin to azithromycin is a practical way to avoid a CYP3A4 interaction when a macrolide is needed.",
    remediationConcept:
      "Clarithromycin and erythromycin inhibit CYP3A4, raising levels of statins, warfarin, calcium channel blockers and immunosuppressants. Contrast this with rifampin, which induces enzymes and lowers levels instead.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["interaction", "macrolide", "cyp450"],
  },
  {
    id: "q073",
    topic: "Severe cutaneous reactions",
    medicationClass: "Sulfonamides and trimethoprim",
    difficulty: 4,
    type: "mcq",
    stem: "A patient taking trimethoprim-sulfamethoxazole develops fever, painful mucosal sores, blistering, and skin sloughing. What is the priority concern?",
    options: [
      { id: "a", text: "Stevens-Johnson syndrome or toxic epidermal necrolysis" },
      { id: "b", text: "Vancomycin infusion reaction" },
      { id: "c", text: "Tendon rupture" },
      { id: "d", text: "Expected photosensitivity" },
    ],
    correct: ["a"],
    rationale:
      "Fever with painful mucosal erosions, blistering and epidermal detachment is the defining picture of Stevens-Johnson syndrome and toxic epidermal necrolysis. Sulfonamides are among the most frequent causes. These are life-threatening reactions with substantial mortality, requiring immediate drug discontinuation and urgent evaluation.",
    distractorRationales: {
      b: "The patient is not receiving vancomycin, and infusion reactions cause transient flushing without mucosal involvement or skin sloughing.",
      c: "Tendon rupture is a fluoroquinolone effect and involves no skin or mucosal findings.",
      d: "Photosensitivity produces an exaggerated sunburn in sun-exposed areas. Mucosal erosion and epidermal detachment are categorically different and never 'expected'.",
    },
    keyClue: "Mucosal involvement plus skin sloughing equals SJS or TEN, not a rash.",
    clinicalTakeaway:
      "Mucosal membrane involvement is the finding that separates a severe cutaneous adverse reaction from a benign drug rash.",
    remediationConcept:
      "Sulfonamides, anticonvulsants and allopurinol are classic SJS/TEN triggers. Distinguish four entities: simple drug rash, photosensitivity, infusion reaction, and severe cutaneous adverse reaction. Fever plus mucosal erosion plus blistering identifies the last.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["sulfonamide", "sjs-ten", "severe-cutaneous", "priority"],
  },
  {
    id: "q074",
    topic: "Severe cutaneous reactions",
    medicationClass: "Sulfonamides and trimethoprim",
    difficulty: 4,
    type: "mcq",
    stem: "What is the priority action for suspected Stevens-Johnson syndrome caused by an antimicrobial?",
    options: [
      { id: "a", text: "Continue the medication and reassess next week." },
      { id: "b", text: "Hold the suspected medication and obtain urgent medical evaluation." },
      { id: "c", text: "Take the next dose with food." },
      { id: "d", text: "Reduce the dose by one-quarter without contacting the provider." },
    ],
    correct: ["b"],
    rationale:
      "Stevens-Johnson syndrome progresses rapidly, and continued exposure to the causative drug worsens outcomes. The immediate priority is to stop the suspected agent and obtain urgent evaluation, since severe cases require burn-unit level supportive care.",
    distractorRationales: {
      a: "Waiting a week could be fatal. Epidermal detachment can extend dramatically within days.",
      c: "Food does not modify an immune-mediated severe cutaneous reaction, and any further dose is harmful.",
      d: "Dose reduction does not address an immunologic reaction, and changing doses without contacting the provider is outside safe practice.",
    },
    keyClue: "Severe cutaneous reaction equals stop the drug and escalate urgently.",
    clinicalTakeaway:
      "The offending drug and its close relatives must be permanently documented as allergies — re-exposure can be lethal.",
    remediationConcept:
      "For suspected SJS/TEN: hold the drug immediately, obtain urgent evaluation, support fluids and skin integrity, and document the allergy permanently. Time to discontinuation directly affects survival.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["sjs-ten", "priority", "nursing-action", "severe-cutaneous"],
  },
  {
    id: "q075",
    topic: "Organ toxicity",
    medicationClass: "Sulfonamides and trimethoprim",
    difficulty: 4,
    type: "mcq",
    stem: "Which laboratory abnormality may occur with trimethoprim-sulfamethoxazole, especially in susceptible patients?",
    options: [
      { id: "a", text: "Hyperkalemia" },
      { id: "b", text: "Severe hypokalemia in every patient" },
      { id: "c", text: "Hypercalcemia" },
      { id: "d", text: "Increased bicarbonate in all patients" },
    ],
    correct: ["a"],
    rationale:
      "Trimethoprim is structurally similar to amiloride and blocks epithelial sodium channels in the distal nephron, reducing potassium excretion. The resulting hyperkalaemia is most pronounced in chronic kidney disease, in older adults, and with ACE inhibitors, ARBs, spironolactone or potassium supplements.",
    distractorRationales: {
      b: "The effect is the opposite — potassium rises, not falls — and 'every patient' is an unsupportable absolute.",
      c: "Trimethoprim-sulfamethoxazole does not raise calcium. It may raise creatinine by blocking tubular secretion without true injury.",
      d: "Bicarbonate does not predictably rise, and 'all patients' is again absolute.",
    },
    keyClue: "Trimethoprim behaves like a potassium-sparing diuretic — potassium goes up.",
    clinicalTakeaway:
      "Trimethoprim-sulfamethoxazole plus an ACE inhibitor or spironolactone is a genuinely dangerous, and common, combination.",
    remediationConcept:
      "Trimethoprim blocks distal sodium channels like amiloride, causing potassium retention. Monitor potassium in renal impairment, older adults and anyone on ACE inhibitors, ARBs, spironolactone or potassium supplements.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["sulfonamide", "hyperkalemia", "monitoring", "interaction"],
  },
  {
    id: "q076",
    topic: "Drug interactions",
    medicationClass: "Sulfonamides and trimethoprim",
    difficulty: 4,
    type: "mcq",
    stem: "A patient taking warfarin begins trimethoprim-sulfamethoxazole. What is the priority concern?",
    options: [
      { id: "a", text: "Increased anticoagulant effect and bleeding risk" },
      { id: "b", text: "Loss of all warfarin activity" },
      { id: "c", text: "Immediate tendon rupture" },
      { id: "d", text: "Tooth staining" },
    ],
    correct: ["a"],
    rationale:
      "Sulfamethoxazole inhibits CYP2C9, the enzyme that metabolises the more potent S-warfarin enantiomer, and it also displaces warfarin from albumin. Both effects raise free active drug, so INR and bleeding risk climb. Antibiotic suppression of gut flora that produce vitamin K adds a further contribution.",
    distractorRationales: {
      b: "Warfarin activity increases rather than disappears. Loss of effect would instead be expected with an enzyme inducer such as rifampin.",
      c: "Tendon rupture is a fluoroquinolone effect, not a warfarin interaction.",
      d: "Tooth staining is a tetracycline effect in developing teeth.",
    },
    keyClue: "Trimethoprim-sulfamethoxazole plus warfarin equals INR up and bleeding risk up.",
    clinicalTakeaway:
      "Expect more frequent INR monitoring and possible warfarin dose reduction whenever this antibiotic is started.",
    remediationConcept:
      "Sulfamethoxazole inhibits CYP2C9 and displaces warfarin from protein binding, raising INR. Contrast with rifampin, a potent inducer that lowers INR and can cause thrombosis. Know which direction each interaction pushes.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["interaction", "warfarin", "sulfonamide", "bleeding", "priority"],
  },
  {
    id: "q077",
    topic: "Metronidazole",
    medicationClass: "Metronidazole",
    difficulty: 3,
    type: "mcq",
    stem: "Which instruction is most important for a patient taking metronidazole?",
    options: [
      { id: "a", text: "Avoid alcohol during treatment and for the recommended period afterward." },
      { id: "b", text: "Take the medication with iron." },
      { id: "c", text: "Stop after the first symptom-free day." },
      { id: "d", text: "Increase alcohol intake to reduce nausea." },
    ],
    correct: ["a"],
    rationale:
      "Metronidazole inhibits aldehyde dehydrogenase, allowing acetaldehyde to accumulate if alcohol is consumed. This disulfiram-like reaction causes flushing, severe nausea and vomiting, headache, tachycardia and hypotension. Patients should avoid alcohol during therapy and for the recommended period after the final dose.",
    distractorRationales: {
      b: "Iron does not need to be taken with metronidazole; chelation concerns belong to tetracyclines and fluoroquinolones.",
      c: "Stopping at the first symptom-free day risks relapse and resistance. The full course should be completed.",
      d: "Increasing alcohol would precipitate the very reaction that must be avoided.",
    },
    keyClue: "Metronidazole and alcohol equals disulfiram-like reaction.",
    clinicalTakeaway:
      "Warn patients about hidden alcohol in mouthwash, cough syrups and some oral solutions, not only in drinks.",
    remediationConcept:
      "Metronidazole blocks aldehyde dehydrogenase, so alcohol causes acetaldehyde accumulation with flushing, vomiting, tachycardia and hypotension. Avoid alcohol during therapy and for the recommended interval afterwards.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["metronidazole", "patient-education", "alcohol", "interaction"],
  },
  {
    id: "q078",
    topic: "Metronidazole",
    medicationClass: "Metronidazole",
    difficulty: 3,
    type: "mcq",
    stem: "A patient taking metronidazole reports a metallic taste. How should the nurse interpret this finding?",
    options: [
      { id: "a", text: "It can be a medication-related adverse effect." },
      { id: "b", text: "It proves anaphylaxis." },
      { id: "c", text: "It indicates tendon rupture." },
      { id: "d", text: "It confirms renal failure." },
    ],
    correct: ["a"],
    rationale:
      "A metallic or unpleasant taste is a common, well-recognised and benign metronidazole effect. It causes no harm and resolves after therapy ends, so it warrants reassurance and support rather than discontinuation.",
    distractorRationales: {
      b: "Anaphylaxis involves airway compromise, angioedema and cardiovascular instability, none of which are present.",
      c: "Tendon rupture is a fluoroquinolone effect with no relationship to taste change.",
      d: "Metallic taste does not indicate renal failure, which would be identified by creatinine and urine output.",
    },
    keyClue: "Metronidazole signature effects: metallic taste, dark urine, disulfiram-like alcohol reaction.",
    clinicalTakeaway:
      "Recognising a benign expected effect prevents unnecessary discontinuation of effective therapy.",
    remediationConcept:
      "Metronidazole commonly causes metallic taste, nausea and darkened urine — all benign. Serious effects, seen mainly with prolonged use, include peripheral neuropathy and central nervous system toxicity.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["metronidazole", "adverse-effect", "benign"],
  },
  {
    id: "q079",
    topic: "Clindamycin",
    medicationClass: "Clindamycin",
    difficulty: 3,
    type: "mcq",
    stem: "Which antimicrobial is strongly associated with Clostridioides difficile infection risk?",
    options: [
      { id: "a", text: "Clindamycin" },
      { id: "b", text: "Nystatin" },
      { id: "c", text: "Acyclovir" },
      { id: "d", text: "Oseltamivir" },
    ],
    correct: ["a"],
    rationale:
      "Clindamycin carries one of the highest C. difficile risks of any antibacterial. Its potent anaerobic activity destroys the colonic flora that normally suppress C. difficile, permitting overgrowth and toxin production.",
    distractorRationales: {
      b: "Nystatin is an antifungal that acts locally with negligible absorption and does not disrupt bacterial flora.",
      c: "Acyclovir is an antiviral with no antibacterial activity, so it does not alter colonic flora.",
      d: "Oseltamivir is an antiviral for influenza and does not disturb bacterial flora.",
    },
    keyClue: "Only antibacterials disturb gut flora — antivirals and antifungals do not cause C. difficile.",
    clinicalTakeaway:
      "Clindamycin, fluoroquinolones and broad-spectrum cephalosporins are the highest-risk C. difficile classes.",
    remediationConcept:
      "C. difficile follows disruption of protective colonic flora, so only antibacterials cause it. Clindamycin's strong anaerobic activity makes it a leading culprit.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["clindamycin", "c-difficile", "adverse-effect"],
  },
  {
    id: "q080",
    topic: "Clindamycin",
    medicationClass: "Clindamycin",
    difficulty: 4,
    type: "mcq",
    stem: "A patient develops profuse watery diarrhea after clindamycin therapy. What is the best nursing action?",
    options: [
      { id: "a", text: "Recommend an over-the-counter antidiarrheal without assessment." },
      { id: "b", text: "Promptly evaluate for Clostridioides difficile infection and notify the appropriate clinician." },
      { id: "c", text: "Reassure the patient that severe diarrhea proves cure." },
      { id: "d", text: "Double the clindamycin dose." },
    ],
    correct: ["b"],
    rationale:
      "Profuse watery diarrhoea after clindamycin requires prompt evaluation for C. difficile, including stool testing, assessment of hydration and electrolytes, contact precautions and notification. Early recognition prevents progression to pseudomembranous colitis and toxic megacolon.",
    distractorRationales: {
      a: "Antimotility agents retain toxin in the colon and may precipitate toxic megacolon. They are avoided in suspected C. difficile.",
      c: "Severe diarrhoea never indicates cure; here it signals a potentially life-threatening complication.",
      d: "Increasing the causative drug would worsen flora disruption and the infection itself.",
    },
    keyClue: "Suspected C. difficile means no antimotility agents.",
    clinicalTakeaway:
      "Use soap and water rather than alcohol-based rub, since alcohol does not kill C. difficile spores.",
    remediationConcept:
      "For suspected C. difficile: assess and test, institute contact precautions, maintain hydration and electrolytes, notify the clinician, avoid antimotility agents, and use soap-and-water hand hygiene.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["clindamycin", "c-difficile", "priority", "nursing-action"],
  },
];
