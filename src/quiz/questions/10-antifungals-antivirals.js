// Q91–100 — Antifungals and antivirals: amphotericin B toxicity, electrolytes,
// fluconazole interactions, nystatin, acyclovir crystal nephropathy, oseltamivir
// timing, latency, and a final integrated clinical-judgement item.

export default [
  {
    id: "q091",
    topic: "Antifungal medications",
    medicationClass: "Polyene antifungals",
    difficulty: 4,
    type: "mcq",
    stem: "A patient receiving amphotericin B develops fever and chills during infusion. Which additional toxicity requires close monitoring?",
    options: [
      { id: "a", text: "Nephrotoxicity" },
      { id: "b", text: "Tendon rupture" },
      { id: "c", text: "Tooth discoloration" },
      { id: "d", text: "Serotonin syndrome" },
    ],
    correct: ["a"],
    rationale:
      "Amphotericin B binds ergosterol in fungal membranes but also has affinity for cholesterol in human cell membranes, which drives its dose-limiting nephrotoxicity. Injury includes reduced glomerular filtration and renal tubular acidosis with potassium and magnesium wasting. Infusion-related fever and chills are separate, expected, and manageable with premedication.",
    distractorRationales: {
      b: "Tendon rupture is a fluoroquinolone effect.",
      c: "Tooth discoloration is a tetracycline effect in developing teeth.",
      d: "Serotonin syndrome relates to linezolid and serotonergic drugs, not to amphotericin B.",
    },
    keyClue: "Amphotericin B — 'ampho-terrible' — is defined by nephrotoxicity and electrolyte wasting.",
    clinicalTakeaway:
      "Adequate hydration and sodium loading, plus lipid formulations where available, reduce amphotericin B nephrotoxicity.",
    remediationConcept:
      "Amphotericin B causes infusion reactions (fever, chills, rigors) and dose-limiting nephrotoxicity with potassium and magnesium wasting. Separate the immediate infusion reaction from the cumulative renal injury — both need attention.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["amphotericin", "nephrotoxicity", "antifungal", "priority"],
  },
  {
    id: "q092",
    topic: "Antifungal medications",
    medicationClass: "Polyene antifungals",
    difficulty: 4,
    type: "mcq",
    stem: "Which laboratory values are especially important during amphotericin B therapy?",
    options: [
      { id: "a", text: "Creatinine, potassium, and magnesium" },
      { id: "b", text: "Hemoglobin A1c only" },
      { id: "c", text: "Troponin only" },
      { id: "d", text: "Thyroid-stimulating hormone only" },
    ],
    correct: ["a"],
    rationale:
      "Amphotericin B injures renal tubules, so creatinine tracks glomerular function while potassium and magnesium track tubular wasting. Hypokalaemia can become severe enough to cause dysrhythmias, and hypomagnesaemia both worsens hypokalaemia and independently prolongs QT.",
    distractorRationales: {
      b: "Haemoglobin A1c reflects long-term glycaemic control and is irrelevant to amphotericin toxicity.",
      c: "Troponin indicates myocardial injury, which is not the characteristic toxicity.",
      d: "Thyroid-stimulating hormone has no bearing on amphotericin B monitoring.",
    },
    keyClue: "Tubular wasting means potassium and magnesium fall together.",
    clinicalTakeaway:
      "Hypomagnesaemia makes hypokalaemia refractory to replacement, so magnesium must be corrected alongside potassium.",
    remediationConcept:
      "Monitor creatinine, potassium and magnesium during amphotericin B therapy, and anticipate aggressive replacement. Note that options containing 'only' are usually wrong when several parameters genuinely matter.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["amphotericin", "monitoring", "electrolytes", "antifungal"],
  },
  {
    id: "q093",
    topic: "Antifungal medications",
    medicationClass: "Azole antifungals",
    difficulty: 4,
    type: "mcq",
    stem: "A patient taking fluconazole also uses other hepatotoxic medications. Which monitoring is most relevant?",
    options: [
      { id: "a", text: "Liver function and drug interactions" },
      { id: "b", text: "Tooth development" },
      { id: "c", text: "Tendon ultrasound in every patient" },
      { id: "d", text: "Serum gentamicin concentration" },
    ],
    correct: ["a"],
    rationale:
      "Fluconazole can cause hepatotoxicity, and that risk is additive with other hepatotoxic drugs. It is also a CYP2C9 and CYP3A4 inhibitor, raising levels of warfarin, phenytoin, some statins and sulfonylureas, and it prolongs QT. Liver enzymes and a full interaction review are therefore the priorities.",
    distractorRationales: {
      b: "Tooth development is a tetracycline concern in children, not an azole one.",
      c: "Tendon imaging relates to fluoroquinolones, and 'every patient' makes the option absolute as well as wrong.",
      d: "Gentamicin levels are irrelevant unless the patient is receiving gentamicin.",
    },
    keyClue: "Azoles inhibit CYP enzymes and stress the liver.",
    clinicalTakeaway:
      "Azole antifungals are among the most interaction-prone drug classes, so every new co-prescription warrants a check.",
    remediationConcept:
      "Azole antifungals inhibit CYP2C9 and CYP3A4, raising levels of warfarin, phenytoin, statins and sulfonylureas, and they carry hepatotoxicity and QT risk. Monitor liver enzymes and screen interactions rather than treating them as benign.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["fluconazole", "interaction", "hepatotoxicity", "antifungal"],
  },
  {
    id: "q094",
    topic: "Antifungal medications",
    medicationClass: "Polyene antifungals",
    difficulty: 3,
    type: "mcq",
    stem: "Which statement about nystatin oral suspension is correct?",
    options: [
      { id: "a", text: "It is commonly used locally for oral candidiasis." },
      { id: "b", text: "It is the preferred systemic treatment for bacterial meningitis." },
      { id: "c", text: "It treats influenza." },
      { id: "d", text: "It is an aminoglycoside used for sepsis." },
    ],
    correct: ["a"],
    rationale:
      "Nystatin is a polyene antifungal that is not absorbed from the gastrointestinal tract. That property makes it ideal for topical treatment of oral candidiasis: the suspension is swished to contact the mucosa directly, with negligible systemic exposure and therefore minimal systemic toxicity.",
    distractorRationales: {
      b: "Nystatin has no antibacterial activity and no systemic absorption, so it cannot treat meningitis.",
      c: "Nystatin is an antifungal with no antiviral activity.",
      d: "Nystatin is a polyene antifungal, not an aminoglycoside, and it cannot treat sepsis.",
    },
    keyClue: "Poor absorption makes nystatin a local agent — swish and swallow or swish and spit.",
    clinicalTakeaway:
      "Instruct patients to hold the suspension in the mouth as long as possible, since contact time determines effect.",
    remediationConcept:
      "Nystatin is a non-absorbed topical antifungal for oral and intestinal candidiasis. Match drug to organism class first: antifungals do not treat bacteria or viruses, and lack of absorption defines the site of action.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["nystatin", "candidiasis", "antifungal", "route"],
  },
  {
    id: "q095",
    topic: "Antiviral medications",
    medicationClass: "Antivirals",
    difficulty: 4,
    type: "mcq",
    stem: "A patient prescribed acyclovir intravenously is at risk for crystal-associated kidney injury. Which intervention is important?",
    options: [
      { id: "a", text: "Maintain appropriate hydration and monitor renal function." },
      { id: "b", text: "Restrict all fluids." },
      { id: "c", text: "Administer it with calcium." },
      { id: "d", text: "Encourage prolonged sun exposure." },
    ],
    correct: ["a"],
    rationale:
      "Acyclovir has limited solubility and can crystallise in renal tubules, causing obstructive crystal nephropathy. Adequate hydration keeps urine flow high and the drug in solution, and slower infusion further reduces risk. Renal function should be monitored throughout.",
    distractorRationales: {
      b: "Fluid restriction concentrates the urine and directly promotes crystal formation — the opposite of what is needed.",
      c: "Calcium offers no protection and is not co-administered with acyclovir.",
      d: "Sun exposure is unrelated to acyclovir; photosensitivity concerns tetracyclines, fluoroquinolones and sulfonamides.",
    },
    keyClue: "Poorly soluble drug plus concentrated urine equals crystals. Dilute the urine.",
    clinicalTakeaway:
      "Hydration before and during intravenous acyclovir is a nursing intervention that directly prevents renal injury.",
    remediationConcept:
      "Intravenous acyclovir crystallises in renal tubules when urine is concentrated. Prevent it with adequate hydration, slower infusion and renal dose adjustment, monitoring creatinine and urine output.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["acyclovir", "nephrotoxicity", "antiviral", "prevention"],
  },
  {
    id: "q096",
    topic: "Antiviral medications",
    medicationClass: "Antivirals",
    difficulty: 4,
    type: "mcq",
    stem: "When is oseltamivir generally most effective?",
    options: [
      { id: "a", text: "When started early in the course of influenza, while still considering treatment for high-risk or severe cases presenting later" },
      { id: "b", text: "Only after bacterial blood cultures return positive, since antiviral selection depends on first excluding a bacterial coinfection" },
      { id: "c", text: "After symptoms have been absent for at least seven days, once the immune response has fully cleared the acute illness" },
      { id: "d", text: "As first-line treatment for streptococcal pharyngitis, given in place of a narrow-spectrum penicillin" },
    ],
    correct: ["a"],
    rationale:
      "Oseltamivir inhibits viral neuraminidase and limits release of new virions, so benefit is greatest when started early — ideally within 48 hours of symptom onset, while viral replication is still active. Hospitalised, severe or high-risk patients may still benefit beyond that window, so late presentation does not automatically exclude treatment.",
    distractorRationales: {
      b: "Bacterial cultures are irrelevant to a viral illness, and waiting for them would forfeit the treatment window.",
      c: "Treating after symptoms have resolved for a week offers no benefit; replication has ceased.",
      d: "Streptococcal pharyngitis is bacterial and requires an antibacterial such as penicillin.",
    },
    keyClue: "Antivirals work during active replication — early is better.",
    clinicalTakeaway:
      "The 48-hour target is a guideline rather than a hard cut-off; severe or high-risk patients may still be treated later.",
    remediationConcept:
      "Oseltamivir inhibits neuraminidase and works best within 48 hours of onset. High-risk or hospitalised patients may benefit later. Note that the nuanced option acknowledging exceptions is usually the correct one.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["oseltamivir", "influenza", "antiviral", "timing"],
  },
  {
    id: "q097",
    topic: "Antiviral medications",
    medicationClass: "Antivirals",
    difficulty: 4,
    type: "mcq",
    stem: "A patient taking valacyclovir asks whether treatment permanently eradicates latent herpes virus. What is the best response?",
    options: [
      { id: "a", text: "\"It suppresses viral replication but does not eliminate latent virus.\"" },
      { id: "b", text: "\"It permanently removes the virus after one dose.\"" },
      { id: "c", text: "\"It works by destroying bacterial cell walls.\"" },
      { id: "d", text: "\"It prevents every future recurrence.\"" },
    ],
    correct: ["a"],
    rationale:
      "Valacyclovir is converted to acyclovir, which inhibits viral DNA polymerase during active replication. Latent virus residing in sensory ganglia is not replicating, so the drug cannot reach or eliminate it. Therapy shortens outbreaks and suppressive dosing reduces recurrence frequency, but latency persists for life.",
    distractorRationales: {
      b: "No antiviral eradicates latent herpes virus, and certainly not after a single dose.",
      c: "Cell-wall destruction is an antibacterial mechanism; viruses have no cell wall.",
      d: "Suppressive therapy reduces but does not abolish recurrences, and transmission remains possible.",
    },
    keyClue: "Antivirals act only on replicating virus, so latency is untouchable.",
    clinicalTakeaway:
      "Patients should understand that reduced transmission risk is not zero transmission risk.",
    remediationConcept:
      "Acyclovir and valacyclovir inhibit viral DNA polymerase during replication and cannot eliminate latent virus in sensory ganglia. Counsel honestly: shorter outbreaks and fewer recurrences, but lifelong latency and residual transmission risk.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["valacyclovir", "antiviral", "patient-education", "latency"],
  },
  {
    id: "q098",
    topic: "Nursing prioritization and patient education",
    medicationClass: "Antifungals",
    difficulty: 4,
    type: "mcq",
    stem: "Which finding in an immunocompromised patient receiving an antifungal requires the most immediate follow-up?",
    options: [
      { id: "a", text: "Rising creatinine with decreasing urine output" },
      { id: "b", text: "Mild temporary unpleasant taste" },
      { id: "c", text: "Preference for cold beverages" },
      { id: "d", text: "One missed television program" },
    ],
    correct: ["a"],
    rationale:
      "A rising creatinine with falling urine output indicates evolving acute kidney injury — an organ-threatening development, particularly with amphotericin B. It also impairs clearance of other renally eliminated drugs, compounding risk in an already vulnerable patient.",
    distractorRationales: {
      b: "An unpleasant taste is a benign, self-limiting effect requiring no urgent action.",
      c: "Beverage preference is not a clinical finding.",
      d: "A missed television programme has no clinical significance.",
    },
    keyClue: "Prioritise the finding that reflects failing organ function.",
    clinicalTakeaway:
      "Falling urine output frequently precedes the creatinine rise, so trending both catches injury earlier.",
    remediationConcept:
      "Prioritise findings by physiologic threat: airway and breathing first, then circulation and organ perfusion, then comfort. Rising creatinine with falling urine output signals organ injury and outranks benign symptoms.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["prioritization", "nephrotoxicity", "antifungal", "priority"],
  },
  {
    id: "q099",
    topic: "Tuberculosis medications",
    medicationClass: "Antituberculars",
    difficulty: 5,
    type: "sata",
    stem: "A patient taking rifampin, isoniazid, pyrazinamide, and ethambutol should be taught to report which findings promptly? Select all that apply.",
    options: [
      { id: "a", text: "Vision changes" },
      { id: "b", text: "Severe abdominal pain or jaundice" },
      { id: "c", text: "New numbness or tingling" },
      { id: "d", text: "Significant weakness or persistent vomiting" },
      { id: "e", text: "Dark urine accompanied by symptoms of liver injury" },
    ],
    correct: ["a", "b", "c", "d", "e"],
    rationale:
      "Each finding maps to a specific regimen toxicity. Vision change suggests ethambutol optic neuritis. Abdominal pain or jaundice suggests hepatotoxicity from isoniazid, rifampin or pyrazinamide. Numbness or tingling suggests isoniazid-related pyridoxine-deficiency neuropathy. Weakness or persistent vomiting may indicate hepatic decompensation. Dark urine with other liver symptoms suggests hepatitis rather than harmless rifampin discoloration.",
    distractorRationales: {
      a: "Correct — ethambutol optic neuritis may become permanent if therapy continues.",
      b: "Correct — three of the four drugs are hepatotoxic, making this the regimen's most serious risk.",
      c: "Correct — isoniazid depletes pyridoxine and causes peripheral neuropathy.",
      d: "Correct — these are systemic warning signs of hepatic injury requiring urgent evaluation.",
      e: "Correct — the qualifier matters: rifampin alone discolours urine harmlessly, but dark urine with liver symptoms suggests hepatitis.",
    },
    keyClue: "Note the qualifier on dark urine — 'accompanied by symptoms of liver injury' changes its meaning.",
    clinicalTakeaway:
      "Isolated orange-red urine on rifampin is expected; dark urine with jaundice, pain or vomiting is a hepatic emergency.",
    remediationConcept:
      "Map each RIPE drug to its toxicity: rifampin to induction and orange fluids, isoniazid to liver and neuropathy, pyrazinamide to urate and liver, ethambutol to eyes. Read qualifiers carefully — they distinguish benign from dangerous findings.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["tuberculosis", "patient-education", "hepatotoxicity", "priority"],
  },
  {
    id: "q100",
    topic: "Integrated clinical judgment",
    medicationClass: "Multiple classes",
    difficulty: 5,
    type: "mcq",
    stem: "A patient with chronic kidney disease is hospitalized for a serious infection. Empiric vancomycin and gentamicin were started. The patient now has tinnitus, reduced urine output, and a rising creatinine. Cultures identify an organism susceptible to a less nephrotoxic narrow-spectrum beta-lactam, and the patient has no beta-lactam allergy. What is the best recommendation?",
    options: [
      { id: "a", text: "Continue both medications because the patient has received several doses." },
      { id: "b", text: "Increase both doses to overcome reduced renal clearance." },
      { id: "c", text: "Promptly reassess the regimen, hold potentially toxic therapy as clinically directed, and de-escalate to the targeted beta-lactam when appropriate." },
      { id: "d", text: "Add ciprofloxacin while continuing the current medications." },
    ],
    correct: ["c"],
    rationale:
      "Three problems converge. Tinnitus indicates probable aminoglycoside ototoxicity, which may be permanent. Reduced urine output with rising creatinine indicates nephrotoxicity, likely additive from both agents on a background of chronic kidney disease. And culture results now permit a less toxic targeted beta-lactam. The correct response addresses all three: reassess promptly, hold the toxic agents as clinically directed, and de-escalate.",
    distractorRationales: {
      a: "Doses already given are not a reason to continue causing harm. Ongoing exposure risks permanent hearing loss and worsening renal failure.",
      b: "This inverts the pharmacology. Reduced clearance causes accumulation, so raising doses would accelerate both toxicities.",
      d: "Adding a fluoroquinolone piles on further toxicity — tendinopathy, neuropathy, QT — while leaving the nephrotoxic and ototoxic agents running.",
    },
    keyClue: "When toxicity is developing and culture allows a safer drug, the answer does both: stop the harm and target the organism.",
    clinicalTakeaway:
      "Recognising ototoxicity early is what preserves hearing; unlike renal injury, cochlear damage frequently does not recover.",
    remediationConcept:
      "Integrate three threads: recognise the toxicity and which drug causes it, appreciate that reduced clearance worsens accumulation, and use culture results to de-escalate to a safer targeted agent. Nurses reassess and hold per protocol while communicating with the prescriber.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["integrated", "ototoxicity", "nephrotoxicity", "de-escalation", "priority"],
  },
];
