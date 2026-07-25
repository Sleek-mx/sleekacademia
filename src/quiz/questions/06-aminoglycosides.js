// Q51–60 — Aminoglycosides: ototoxicity, nephrotoxicity, renal dosing,
// neuromuscular blockade, monitoring, differentiating from vancomycin reactions.
// First paywalled block.

export default [
  {
    id: "q051",
    topic: "Aminoglycosides",
    medicationClass: "Aminoglycosides",
    difficulty: 4,
    type: "mcq",
    stem: "A patient receiving gentamicin reports tinnitus and has a rising creatinine. What is the priority action?",
    options: [
      { id: "a", text: "Give the next dose early." },
      { id: "b", text: "Hold the medication and notify the prescriber according to protocol." },
      { id: "c", text: "Administer calcium with the dose." },
      { id: "d", text: "Encourage loud-noise exposure to test hearing." },
    ],
    correct: ["b"],
    rationale:
      "Tinnitus signals possible cochlear injury and a rising creatinine signals renal injury. Both are dose-related aminoglycoside toxicities, and cochlear damage may be permanent. Holding the dose per protocol and notifying the prescriber prevents further exposure while the regimen is reassessed.",
    distractorRationales: {
      a: "Giving the dose early increases total exposure and accelerates both toxicities.",
      c: "Calcium does not protect against aminoglycoside toxicity and has no role here.",
      d: "Deliberate noise exposure is harmful and is not a hearing assessment. Formal audiometry is the appropriate test.",
    },
    keyClue: "Tinnitus during aminoglycoside therapy is an early warning of irreversible hearing loss.",
    clinicalTakeaway:
      "Nephrotoxicity is usually reversible; ototoxicity often is not. That asymmetry is why tinnitus demands urgent action.",
    remediationConcept:
      "Report tinnitus, vertigo, hearing change or balance problems promptly during aminoglycoside therapy, along with rising creatinine or falling urine output. Nurses hold per protocol and notify — they do not independently discontinue therapy.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["aminoglycoside", "ototoxicity", "nephrotoxicity", "priority"],
  },
  {
    id: "q052",
    topic: "Organ toxicity",
    medicationClass: "Aminoglycosides",
    difficulty: 3,
    type: "mcq",
    stem: "Which adverse effects are most characteristic of aminoglycosides?",
    options: [
      { id: "a", text: "Nephrotoxicity and ototoxicity" },
      { id: "b", text: "Hyperglycemia and constipation" },
      { id: "c", text: "Tooth staining and photosensitivity only" },
      { id: "d", text: "Biliary sludging and pancreatitis" },
    ],
    correct: ["a"],
    rationale:
      "Aminoglycosides accumulate in renal proximal tubular cells and in cochlear and vestibular hair cells. This produces the defining toxicity pair: nephrotoxicity, usually reversible, and ototoxicity, frequently permanent.",
    distractorRationales: {
      b: "Neither hyperglycaemia nor constipation is characteristic of aminoglycosides.",
      c: "Tooth staining and photosensitivity describe tetracyclines, and 'only' would wrongly exclude the real toxicities.",
      d: "Biliary sludging is a ceftriaxone effect; pancreatitis is not an aminoglycoside hallmark.",
    },
    keyClue: "Aminoglycosides: think kidneys and ears, every time.",
    clinicalTakeaway:
      "Ototoxicity splits into cochlear damage (tinnitus, hearing loss) and vestibular damage (vertigo, imbalance) — assess for both.",
    remediationConcept:
      "The aminoglycoside toxicity pair is nephrotoxicity plus ototoxicity. Both are dose- and duration-related and worsen with other nephrotoxins or ototoxins such as vancomycin or loop diuretics.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["aminoglycoside", "toxicity", "adverse-effect"],
  },
  {
    id: "q053",
    topic: "Aminoglycosides",
    medicationClass: "Aminoglycosides",
    difficulty: 3,
    type: "sata",
    stem: "Which findings should be reported in a patient receiving gentamicin? Select all that apply.",
    options: [
      { id: "a", text: "Tinnitus" },
      { id: "b", text: "Vertigo" },
      { id: "c", text: "Decreased urine output" },
      { id: "d", text: "Rising creatinine" },
      { id: "e", text: "New balance problems" },
    ],
    correct: ["a", "b", "c", "d", "e"],
    rationale:
      "All five map onto the two organs aminoglycosides injure. Tinnitus reflects cochlear damage; vertigo and balance problems reflect vestibular damage; decreased urine output and rising creatinine reflect renal injury. Each warrants prompt reporting because early recognition limits permanent harm.",
    distractorRationales: {
      a: "Correct — an early cochlear warning sign.",
      b: "Correct — vestibular toxicity, which may be permanent.",
      c: "Correct — often the earliest renal indicator, preceding creatinine change.",
      d: "Correct — the standard laboratory marker of nephrotoxicity.",
      e: "Correct — vestibular injury presenting as unsteadiness, which also creates a fall risk.",
    },
    keyClue: "Group the findings by organ: ear symptoms and kidney symptoms. All belong.",
    clinicalTakeaway:
      "Vestibular toxicity creates a genuine fall risk, so balance assessment is a safety intervention as well as a toxicity screen.",
    remediationConcept:
      "Report any ear finding (tinnitus, hearing change, vertigo, imbalance) and any kidney finding (falling urine output, rising creatinine) during aminoglycoside therapy. Ototoxicity is frequently irreversible, so early reporting matters.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["aminoglycoside", "monitoring", "ototoxicity", "nephrotoxicity"],
  },
  {
    id: "q054",
    topic: "Aminoglycosides",
    medicationClass: "Aminoglycosides",
    difficulty: 3,
    type: "mcq",
    stem: "Why may gentamicin doses require adjustment in renal impairment?",
    options: [
      { id: "a", text: "It is substantially cleared by the kidneys." },
      { id: "b", text: "It is activated by gastric acid." },
      { id: "c", text: "Renal impairment makes it ineffective against bacteria." },
      { id: "d", text: "It is eliminated only through the lungs." },
    ],
    correct: ["a"],
    rationale:
      "Gentamicin is eliminated almost entirely unchanged by glomerular filtration. When filtration falls, the drug accumulates, prolonging exposure of cochlear and renal tubular cells and increasing toxicity. Doses are reduced or intervals extended accordingly.",
    distractorRationales: {
      b: "Aminoglycosides are destroyed rather than activated by gastric acid, which is why they are given parenterally.",
      c: "Renal impairment does not change intrinsic antibacterial activity; it changes clearance and therefore toxicity risk.",
      d: "Aminoglycosides are not eliminated through the lungs.",
    },
    keyClue: "Renally cleared plus renally toxic — accumulation feeds further injury.",
    clinicalTakeaway:
      "Aminoglycoside toxicity is self-reinforcing: the drug damages the kidney that clears it, so exposure climbs.",
    remediationConcept:
      "Match the route of elimination to the required dose adjustment. Aminoglycosides are renally filtered, so impaired filtration causes accumulation. Both dose reduction and interval extension are used, guided by levels.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["aminoglycoside", "renal-dosing", "pharmacokinetics"],
  },
  {
    id: "q055",
    topic: "Drug interactions",
    medicationClass: "Aminoglycosides",
    difficulty: 3,
    type: "mcq",
    stem: "Which medication combination presents an increased nephrotoxicity concern?",
    options: [
      { id: "a", text: "Gentamicin and vancomycin" },
      { id: "b", text: "Amoxicillin and acetaminophen" },
      { id: "c", text: "Azithromycin and saline" },
      { id: "d", text: "Nystatin and topical moisturizer" },
    ],
    correct: ["a"],
    rationale:
      "Gentamicin and vancomycin are each nephrotoxic and each ototoxic. Given together the renal risk is at least additive, which is why this pairing requires intensified monitoring of creatinine and urine output and prompt de-escalation once cultures allow.",
    distractorRationales: {
      b: "Neither amoxicillin nor acetaminophen is meaningfully nephrotoxic at therapeutic doses; acetaminophen's dose-related toxicity is hepatic.",
      c: "Azithromycin is not nephrotoxic and saline is not a nephrotoxin.",
      d: "Nystatin acts locally with negligible absorption, and a topical moisturiser has no renal effect.",
    },
    keyClue: "Two nephrotoxins together equals more than twice the vigilance.",
    clinicalTakeaway:
      "This pairing is common empiric therapy, so the interaction is encountered often and must be actively monitored.",
    remediationConcept:
      "Learn the nephrotoxin list: aminoglycosides, vancomycin, amphotericin B, NSAIDs, contrast, and piperacillin-tazobactam combined with vancomycin. Overlap demands closer monitoring and earlier de-escalation.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["interaction", "nephrotoxicity", "aminoglycoside"],
  },
  {
    id: "q056",
    topic: "Organ toxicity",
    medicationClass: "Aminoglycosides",
    difficulty: 5,
    type: "mcq",
    stem: "A patient receiving an aminoglycoside develops progressive muscle weakness and respiratory difficulty. Which rare complication should be considered?",
    options: [
      { id: "a", text: "Neuromuscular blockade" },
      { id: "b", text: "Tooth discoloration" },
      { id: "c", text: "Biliary obstruction" },
      { id: "d", text: "Folate excess" },
    ],
    correct: ["a"],
    rationale:
      "Aminoglycosides inhibit presynaptic acetylcholine release and reduce postsynaptic sensitivity, producing a curare-like neuromuscular blockade. Progressive weakness with respiratory compromise is the feared presentation. Risk rises with rapid infusion, hypocalcaemia, hypomagnesaemia, concurrent neuromuscular blocking agents, and pre-existing myasthenia gravis.",
    distractorRationales: {
      b: "Tooth discoloration is a tetracycline effect and unrelated to neuromuscular transmission.",
      c: "Biliary obstruction is not an aminoglycoside effect; biliary sludging belongs to ceftriaxone.",
      d: "Folate excess is not a recognised adverse effect of any antimicrobial in this context.",
    },
    keyClue: "Aminoglycoside plus new weakness and respiratory difficulty equals neuromuscular blockade.",
    clinicalTakeaway:
      "Aminoglycosides are relatively contraindicated in myasthenia gravis because they can precipitate respiratory crisis.",
    remediationConcept:
      "Aminoglycoside neuromuscular blockade is rare but life-threatening, presenting as progressive weakness and respiratory compromise. Risk increases with myasthenia gravis, concurrent neuromuscular blockers, and low calcium or magnesium.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["aminoglycoside", "neuromuscular-blockade", "priority", "rare"],
  },
  {
    id: "q057",
    topic: "Aminoglycosides",
    medicationClass: "Aminoglycosides",
    difficulty: 3,
    type: "mcq",
    stem: "Which statement about aminoglycoside monitoring is best?",
    options: [
      { id: "a", text: "Serum concentrations may be monitored to balance efficacy and toxicity." },
      { id: "b", text: "Drug levels are never clinically useful." },
      { id: "c", text: "Kidney function only needs evaluation after therapy ends." },
      { id: "d", text: "Hearing symptoms are unrelated to therapy." },
    ],
    correct: ["a"],
    rationale:
      "Aminoglycosides have a narrow therapeutic window. Peaks must be high enough for concentration-dependent killing while troughs must fall low enough to allow renal and cochlear recovery. Therapeutic drug monitoring is how that balance is maintained.",
    distractorRationales: {
      b: "Aminoglycosides are among the clearest indications for therapeutic drug monitoring, so this is plainly false.",
      c: "Renal function must be assessed at baseline and throughout therapy, since injury developing mid-course requires dose change.",
      d: "Hearing symptoms are directly related to therapy and are a critical early toxicity signal.",
    },
    keyClue: "Narrow therapeutic window equals monitor levels.",
    clinicalTakeaway:
      "High peaks kill bacteria and low troughs protect the patient — monitoring serves both aims at once.",
    remediationConcept:
      "Only a few antimicrobials need routine level monitoring: aminoglycosides and vancomycin chiefly. Monitor peaks for efficacy, troughs for toxicity, plus renal function and auditory symptoms throughout.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["aminoglycoside", "monitoring", "therapeutic-drug-monitoring"],
  },
  {
    id: "q058",
    topic: "Aminoglycosides",
    medicationClass: "Aminoglycosides",
    difficulty: 4,
    type: "mcq",
    stem: "An older adult has dehydration and chronic kidney disease. What is the most important implication before gentamicin administration?",
    options: [
      { id: "a", text: "The risk of accumulation and toxicity is increased." },
      { id: "b", text: "The drug will be absorbed more rapidly from the stomach." },
      { id: "c", text: "Ototoxicity becomes impossible." },
      { id: "d", text: "Renal dosing is unnecessary." },
    ],
    correct: ["a"],
    rationale:
      "Three risks compound here. Age-related decline in glomerular filtration, chronic kidney disease and dehydration all reduce clearance and concentrate the drug in renal tubules. Accumulation raises both nephrotoxicity and ototoxicity risk, so baseline renal assessment, hydration and careful dosing are essential.",
    distractorRationales: {
      b: "Gentamicin is not absorbed from the stomach; it is destroyed by gastric acid and given parenterally.",
      c: "Reduced clearance makes ototoxicity more likely, not impossible.",
      d: "Renal dosing is more critical in this patient, not less.",
    },
    keyClue: "Age plus chronic kidney disease plus dehydration equals stacked accumulation risk.",
    clinicalTakeaway:
      "Correcting volume depletion before an aminoglycoside dose is a practical way to reduce nephrotoxicity risk.",
    remediationConcept:
      "Identify compounding risk factors for aminoglycoside toxicity: advanced age, chronic kidney disease, volume depletion, prolonged therapy, and concurrent nephrotoxins. Each one lowers clearance and raises exposure.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["aminoglycoside", "geriatric", "renal-dosing", "risk-factors"],
  },
  {
    id: "q059",
    topic: "Nursing prioritization and patient education",
    medicationClass: "Aminoglycosides",
    difficulty: 4,
    type: "mcq",
    stem: "A patient says, \"My ringing ears are minor, so I will mention them at my next appointment.\" What is the best response?",
    options: [
      { id: "a", text: "\"That symptom may indicate ototoxicity and should be reported promptly.\"" },
      { id: "b", text: "\"Tinnitus shows the medication is working.\"" },
      { id: "c", text: "\"Take an extra dose if the ringing worsens.\"" },
      { id: "d", text: "\"Drink milk with every dose.\"" },
    ],
    correct: ["a"],
    rationale:
      "Tinnitus may be the first sign of cochlear injury, and continued exposure can progress to permanent hearing loss. Delaying the report until a future appointment allows avoidable, irreversible damage. Prompt reporting permits dose adjustment or a change of agent.",
    distractorRationales: {
      b: "Tinnitus is toxicity, never evidence of therapeutic effect. Telling a patient otherwise causes real harm.",
      c: "Increasing the dose in response to a toxicity signal would accelerate permanent hearing loss.",
      d: "Milk is irrelevant to gentamicin, which is given parenterally. Dairy affects oral tetracycline and fluoroquinolone absorption.",
    },
    keyClue: "Correct any patient belief that a toxicity symptom is minor or therapeutic.",
    clinicalTakeaway:
      "Teach patients on aminoglycosides to report ear ringing, hearing change, dizziness or reduced urination the same day.",
    remediationConcept:
      "Patients need explicit instruction that tinnitus and balance change during aminoglycoside therapy are urgent, because cochlear damage may be permanent. Correct minimising statements directly and specify what to report and how soon.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["aminoglycoside", "patient-education", "ototoxicity", "priority"],
  },
  {
    id: "q060",
    topic: "Nursing prioritization and patient education",
    medicationClass: "Multiple classes",
    difficulty: 5,
    type: "mcq",
    stem: "Which assessment best distinguishes aminoglycoside toxicity from vancomycin infusion reaction?",
    options: [
      { id: "a", text: "New hearing or balance changes" },
      { id: "b", text: "Upper-body flushing during infusion" },
      { id: "c", text: "Mild itching during a rapid infusion" },
      { id: "d", text: "Temporary redness at the intravenous site" },
    ],
    correct: ["a"],
    rationale:
      "Hearing and balance changes point specifically to aminoglycoside cochlear and vestibular injury. They are cumulative, dose-related and independent of infusion rate. Vancomycin infusion reaction is by contrast a rate-related cutaneous event that resolves when the infusion is slowed.",
    distractorRationales: {
      b: "Upper-body flushing during infusion is the hallmark of the vancomycin reaction, so it does not distinguish in favour of aminoglycoside toxicity.",
      c: "Itching during rapid infusion again describes the vancomycin histamine reaction.",
      d: "Local intravenous site redness suggests irritation or phlebitis and is not specific to either problem.",
    },
    keyClue: "Ears equal aminoglycoside. Skin during infusion equals vancomycin.",
    clinicalTakeaway:
      "Both drugs are often given together, so the nurse must be able to attribute a new symptom to the right agent.",
    remediationConcept:
      "Aminoglycoside toxicity is cumulative and organ-specific (ear, kidney). Vancomycin infusion reaction is immediate, rate-related and cutaneous. Timing relative to the infusion and the organ involved separate them.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["differentiation", "aminoglycoside", "vancomycin", "assessment"],
  },
];
