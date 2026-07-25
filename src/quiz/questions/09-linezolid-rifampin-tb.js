// Q81–90 — Linezolid, rifampin, and tuberculosis therapy: serotonin syndrome,
// myelosuppression, enzyme induction, hepatotoxicity, pyridoxine, ethambutol
// optic toxicity, pyrazinamide, multidrug rationale.

export default [
  {
    id: "q081",
    topic: "Linezolid",
    medicationClass: "Oxazolidinones",
    difficulty: 4,
    type: "mcq",
    stem: "A patient taking linezolid also uses a serotonergic antidepressant. Which complication is the priority concern?",
    options: [
      { id: "a", text: "Serotonin syndrome" },
      { id: "b", text: "Tooth discoloration" },
      { id: "c", text: "Tendon rupture" },
      { id: "d", text: "Red man syndrome" },
    ],
    correct: ["a"],
    rationale:
      "Linezolid is a weak, reversible monoamine oxidase inhibitor. Combined with an SSRI, SNRI, triptan, tramadol or other serotonergic agent, it can raise central serotonin activity enough to precipitate serotonin syndrome — a potentially fatal reaction.",
    distractorRationales: {
      b: "Tooth discoloration is a tetracycline effect and unrelated to serotonergic activity.",
      c: "Tendon rupture is a fluoroquinolone effect.",
      d: "Red man syndrome is a rate-related vancomycin infusion reaction.",
    },
    keyClue: "Linezolid is an MAO inhibitor — that single fact drives its interactions.",
    clinicalTakeaway:
      "Linezolid's MAO inhibition also creates tyramine interaction risk, so aged cheeses and cured meats warrant counselling.",
    remediationConcept:
      "Linezolid is a reversible MAO inhibitor, so it interacts with serotonergic drugs to risk serotonin syndrome and with tyramine-rich foods and sympathomimetics to risk hypertensive crisis. Always review the antidepressant list before it is started.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["linezolid", "serotonin-syndrome", "interaction", "priority"],
  },
  {
    id: "q082",
    topic: "Linezolid",
    medicationClass: "Oxazolidinones",
    difficulty: 4,
    type: "mcq",
    stem: "Which finding in a patient taking linezolid requires evaluation for bone-marrow suppression?",
    options: [
      { id: "a", text: "New bruising and thrombocytopenia" },
      { id: "b", text: "Orange urine" },
      { id: "c", text: "Mild metallic taste" },
      { id: "d", text: "Achilles tendon pain" },
    ],
    correct: ["a"],
    rationale:
      "Linezolid causes dose- and duration-dependent myelosuppression, with thrombocytopenia the most common manifestation. New bruising with a falling platelet count is the classic presentation, and risk rises markedly beyond about two weeks of therapy. Weekly complete blood counts are standard.",
    distractorRationales: {
      b: "Orange discoloration of urine and other body fluids is the expected, harmless rifampin effect.",
      c: "Metallic taste is a benign metronidazole effect and unrelated to haematologic toxicity.",
      d: "Achilles tendon pain points to fluoroquinolone tendinopathy.",
    },
    keyClue: "Linezolid plus therapy beyond two weeks equals check the platelets.",
    clinicalTakeaway:
      "Linezolid myelosuppression is generally reversible on discontinuation, which makes weekly monitoring genuinely protective.",
    remediationConcept:
      "Linezolid causes duration-dependent thrombocytopenia, anaemia and leukopenia. Monitor weekly complete blood counts and report bruising, bleeding, unusual fatigue or new infection.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["linezolid", "myelosuppression", "monitoring", "priority"],
  },
  {
    id: "q083",
    topic: "Linezolid",
    medicationClass: "Oxazolidinones",
    difficulty: 4,
    type: "mcq",
    stem: "A patient taking linezolid develops agitation, diaphoresis, hyperreflexia, and fever. What should the nurse suspect?",
    options: [
      { id: "a", text: "Serotonin syndrome" },
      { id: "b", text: "Clostridioides difficile infection" },
      { id: "c", text: "Ototoxicity" },
      { id: "d", text: "Biliary sludging" },
    ],
    correct: ["a"],
    rationale:
      "This cluster is the serotonin syndrome triad: altered mental status (agitation), autonomic hyperactivity (diaphoresis, fever) and neuromuscular excitability (hyperreflexia, clonus). Linezolid's MAO inhibition is the likely contributor, particularly alongside another serotonergic agent.",
    distractorRationales: {
      b: "C. difficile presents with profuse watery diarrhoea and abdominal pain, not hyperreflexia or diaphoresis.",
      c: "Ototoxicity presents with tinnitus, hearing loss or vertigo and belongs chiefly to aminoglycosides.",
      d: "Biliary sludging presents as right upper-quadrant pain and is a ceftriaxone effect.",
    },
    keyClue: "Hyperreflexia and clonus are the findings that point to serotonin syndrome rather than sepsis.",
    clinicalTakeaway:
      "Serotonin syndrome is easily mistaken for worsening infection; neuromuscular hyperexcitability is the distinguishing feature.",
    remediationConcept:
      "Serotonin syndrome has three components: mental status change, autonomic instability, and neuromuscular hyperactivity including hyperreflexia and clonus. Stop the serotonergic agents and provide urgent supportive care.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["linezolid", "serotonin-syndrome", "priority", "assessment"],
  },
  {
    id: "q084",
    topic: "Rifampin",
    medicationClass: "Rifamycins",
    difficulty: 3,
    type: "mcq",
    stem: "What teaching is appropriate for rifampin?",
    options: [
      { id: "a", text: "Body fluids may become orange-red." },
      { id: "b", text: "Permanent blue discoloration is expected." },
      { id: "c", text: "It has no clinically meaningful drug interactions." },
      { id: "d", text: "It should always be used alone for active tuberculosis." },
    ],
    correct: ["a"],
    rationale:
      "Rifampin turns urine, sweat, tears and saliva orange-red. The effect is harmless and reversible, but patients must be warned because it is alarming if unexpected and it can permanently stain soft contact lenses and light clothing.",
    distractorRationales: {
      b: "The discoloration is orange-red, not blue, and it is temporary rather than permanent.",
      c: "Rifampin is one of the most interaction-prone drugs in clinical use, being a potent enzyme inducer.",
      d: "Monotherapy for active tuberculosis rapidly selects resistance. Multidrug therapy is mandatory.",
    },
    keyClue: "Rifampin equals orange body fluids plus enzyme induction.",
    clinicalTakeaway:
      "Warn contact-lens wearers specifically — permanent lens staining is a common, avoidable complaint.",
    remediationConcept:
      "Rifampin causes harmless orange-red discoloration of body fluids. Its serious feature is potent CYP450 induction, which lowers levels of many drugs including oral contraceptives, warfarin and antiretrovirals.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["rifampin", "patient-education", "tuberculosis"],
  },
  {
    id: "q085",
    topic: "Drug interactions",
    medicationClass: "Rifamycins",
    difficulty: 4,
    type: "mcq",
    stem: "Why can rifampin reduce the effectiveness of many other medications?",
    options: [
      { id: "a", text: "It induces hepatic drug-metabolizing enzymes." },
      { id: "b", text: "It blocks all renal filtration." },
      { id: "c", text: "It binds calcium in the intestine." },
      { id: "d", text: "It inhibits bacterial cell walls in human cells." },
    ],
    correct: ["a"],
    rationale:
      "Rifampin is a potent inducer of CYP3A4 and other enzymes plus P-glycoprotein transport. Induction accelerates metabolism of co-administered drugs, lowering their concentrations and effectiveness. Clinically important victims include oral contraceptives, warfarin, many antiretrovirals, azole antifungals and immunosuppressants.",
    distractorRationales: {
      b: "Rifampin does not block renal filtration; it is chiefly hepatically metabolised and biliary excreted.",
      c: "Calcium binding in the intestine describes tetracycline and fluoroquinolone chelation.",
      d: "Human cells have no cell wall, so this option is biologically incoherent.",
    },
    keyClue: "Rifampin induces, so partner drug levels fall. Clarithromycin inhibits, so they rise.",
    clinicalTakeaway:
      "Patients on rifampin need an alternative or additional contraceptive method — oral contraceptive failure is a well-documented consequence.",
    remediationConcept:
      "Enzyme induction lowers the concentration of co-administered drugs; enzyme inhibition raises it. Rifampin is the classic inducer, clarithromycin and azole antifungals classic inhibitors. Always identify the direction of the interaction.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["interaction", "rifampin", "cyp450", "enzyme-induction"],
  },
  {
    id: "q086",
    topic: "Tuberculosis medications",
    medicationClass: "Antituberculars",
    difficulty: 3,
    type: "mcq",
    stem: "Which adverse effect is most important to monitor during isoniazid therapy?",
    options: [
      { id: "a", text: "Hepatotoxicity" },
      { id: "b", text: "Tendon rupture" },
      { id: "c", text: "Red man syndrome" },
      { id: "d", text: "Tooth staining" },
    ],
    correct: ["a"],
    rationale:
      "Isoniazid causes dose-independent hepatocellular injury ranging from asymptomatic transaminase elevation to fulminant hepatic failure. Risk rises with age, alcohol use, pre-existing liver disease and concurrent rifampin. Baseline and periodic liver enzymes plus symptom education are essential.",
    distractorRationales: {
      b: "Tendon rupture is a fluoroquinolone effect.",
      c: "Red man syndrome is a vancomycin infusion reaction.",
      d: "Tooth staining is a tetracycline effect in developing teeth.",
    },
    keyClue: "Isoniazid, rifampin and pyrazinamide are all hepatotoxic — three of the four RIPE drugs.",
    clinicalTakeaway:
      "Teach patients to report nausea, anorexia, right upper-quadrant pain, jaundice or dark urine immediately rather than waiting for the next visit.",
    remediationConcept:
      "Isoniazid's two signature toxicities are hepatotoxicity and peripheral neuropathy, the latter from pyridoxine depletion. Monitor liver enzymes and educate on hepatitis symptoms, since alcohol markedly increases risk.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["isoniazid", "hepatotoxicity", "tuberculosis", "monitoring"],
  },
  {
    id: "q087",
    topic: "Tuberculosis medications",
    medicationClass: "Antituberculars",
    difficulty: 3,
    type: "mcq",
    stem: "Why may pyridoxine be prescribed with isoniazid?",
    options: [
      { id: "a", text: "To reduce the risk of peripheral neuropathy" },
      { id: "b", text: "To prevent orange urine" },
      { id: "c", text: "To increase nephrotoxicity" },
      { id: "d", text: "To block all hepatic metabolism" },
    ],
    correct: ["a"],
    rationale:
      "Isoniazid interferes with pyridoxine (vitamin B6) metabolism and increases its urinary excretion, and B6 deficiency causes peripheral neuropathy. Supplementing pyridoxine prevents this, particularly in patients with diabetes, alcohol use disorder, malnutrition, pregnancy or HIV.",
    distractorRationales: {
      b: "Orange urine is a rifampin effect that is harmless and cannot be prevented by pyridoxine.",
      c: "No drug is added to increase toxicity; isoniazid's main organ toxicity is hepatic in any case.",
      d: "Pyridoxine does not block hepatic metabolism, and doing so would be harmful rather than protective.",
    },
    keyClue: "Isoniazid depletes B6, so B6 is replaced.",
    clinicalTakeaway:
      "Pyridoxine prevents neuropathy but offers no protection against isoniazid hepatotoxicity — liver monitoring is still required.",
    remediationConcept:
      "Isoniazid depletes pyridoxine, causing peripheral neuropathy that pyridoxine supplementation prevents. Higher-risk groups include patients with diabetes, alcohol use disorder, malnutrition, pregnancy or HIV.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["isoniazid", "pyridoxine", "neuropathy", "tuberculosis"],
  },
  {
    id: "q088",
    topic: "Tuberculosis medications",
    medicationClass: "Antituberculars",
    difficulty: 3,
    type: "mcq",
    stem: "Which assessment is essential during ethambutol therapy?",
    options: [
      { id: "a", text: "Visual acuity and color discrimination" },
      { id: "b", text: "Achilles tendon strength only" },
      { id: "c", text: "Tooth-enamel thickness" },
      { id: "d", text: "Serum vancomycin exposure" },
    ],
    correct: ["a"],
    rationale:
      "Ethambutol causes dose-related optic neuritis, which characteristically impairs red-green colour discrimination and central visual acuity. Baseline and periodic visual assessment allows early detection, since the change may be reversible if the drug is stopped promptly but permanent if continued.",
    distractorRationales: {
      b: "Tendon assessment relates to fluoroquinolones, and 'only' would wrongly exclude the essential eye examination.",
      c: "Tooth-enamel assessment relates to tetracyclines in children, not to ethambutol.",
      d: "Vancomycin levels are irrelevant in a patient receiving ethambutol for tuberculosis.",
    },
    keyClue: "Ethambutol equals eyes. The two E's link the drug to the organ.",
    clinicalTakeaway:
      "Teach patients to report any change in vision or colour perception immediately, because early discontinuation preserves sight.",
    remediationConcept:
      "Ethambutol causes optic neuritis affecting acuity and red-green discrimination. Obtain baseline and periodic visual assessment, and report changes promptly since continued therapy risks permanent loss.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["ethambutol", "optic-neuritis", "tuberculosis", "monitoring"],
  },
  {
    id: "q089",
    topic: "Tuberculosis medications",
    medicationClass: "Antituberculars",
    difficulty: 4,
    type: "mcq",
    stem: "Which adverse effect is classically associated with pyrazinamide?",
    options: [
      { id: "a", text: "Hyperuricemia and hepatotoxicity" },
      { id: "b", text: "Red man syndrome" },
      { id: "c", text: "Gray baby syndrome" },
      { id: "d", text: "Permanent tooth staining" },
    ],
    correct: ["a"],
    rationale:
      "Pyrazinamide reduces renal uric acid excretion, raising serum urate and potentially precipitating gout or polyarthralgia. It is also hepatotoxic, adding to the risk from isoniazid and rifampin in a standard four-drug regimen.",
    distractorRationales: {
      b: "Red man syndrome is a vancomycin infusion reaction.",
      c: "Gray baby syndrome is a chloramphenicol effect in neonates.",
      d: "Permanent tooth staining is a tetracycline effect in developing teeth.",
    },
    keyClue: "Pyrazinamide equals uric acid up plus liver risk.",
    clinicalTakeaway:
      "New joint pain during tuberculosis therapy should prompt a uric acid check rather than being dismissed as unrelated.",
    remediationConcept:
      "Pyrazinamide causes hyperuricaemia, arthralgia and hepatotoxicity. Map each RIPE drug to its signature toxicity: rifampin to orange fluids and induction, isoniazid to liver and neuropathy, pyrazinamide to urate and liver, ethambutol to eyes.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["pyrazinamide", "hyperuricemia", "hepatotoxicity", "tuberculosis"],
  },
  {
    id: "q090",
    topic: "Tuberculosis medications",
    medicationClass: "Antituberculars",
    difficulty: 4,
    type: "mcq",
    stem: "Why is active tuberculosis treated with multiple medications?",
    options: [
      { id: "a", text: "To reduce the emergence of resistance and target organisms in different metabolic states" },
      { id: "b", text: "Because no tuberculosis drug has any antimicrobial activity alone" },
      { id: "c", text: "To prevent all adverse effects" },
      { id: "d", text: "To eliminate the need for adherence" },
    ],
    correct: ["a"],
    rationale:
      "Large tuberculosis populations contain spontaneous mutants resistant to any single drug, so monotherapy selects them and produces resistant disease. Multidrug therapy makes simultaneous resistance vastly less likely, and the drugs also act on organisms in different metabolic states — actively dividing, semi-dormant and intracellular.",
    distractorRationales: {
      b: "Each RIPE drug has genuine antimycobacterial activity alone; the problem with monotherapy is resistance, not inactivity.",
      c: "Combining drugs increases the total adverse-effect burden rather than preventing it, with three of the four being hepatotoxic.",
      d: "Adherence becomes more critical, not less, which is why directly observed therapy is widely used.",
    },
    keyClue: "Multidrug therapy exists to prevent resistance, not to reduce side effects.",
    clinicalTakeaway:
      "Non-adherence is the primary driver of multidrug-resistant tuberculosis, which is why directly observed therapy exists.",
    remediationConcept:
      "Multidrug tuberculosis therapy prevents selection of resistant mutants and reaches bacilli in different metabolic states. Long duration is required because semi-dormant organisms persist. Adherence is essential.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["tuberculosis", "resistance", "combination-therapy"],
  },
];
