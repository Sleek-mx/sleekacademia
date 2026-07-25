// Q61–70 — Tetracyclines and fluoroquinolones: chelation, oesophageal irritation,
// photosensitivity, tendinopathy, QT prolongation, peripheral neuropathy.

export default [
  {
    id: "q061",
    topic: "Drug interactions",
    medicationClass: "Tetracyclines",
    difficulty: 3,
    type: "mcq",
    stem: "A patient takes doxycycline with an antacid containing magnesium. What is the primary concern?",
    options: [
      { id: "a", text: "Reduced doxycycline absorption through chelation" },
      { id: "b", text: "Severe hypoglycemia" },
      { id: "c", text: "Immediate nephrotoxicity" },
      { id: "d", text: "Increased viral replication" },
    ],
    correct: ["a"],
    rationale:
      "Tetracyclines chelate divalent and trivalent cations. Magnesium in the antacid binds doxycycline in the gut, forming an insoluble complex that cannot be absorbed. Serum concentrations fall and treatment may fail, so administration should be separated in time.",
    distractorRationales: {
      b: "Neither doxycycline nor magnesium antacids cause hypoglycaemia.",
      c: "Doxycycline is not notably nephrotoxic; unlike other tetracyclines it is largely non-renally eliminated.",
      d: "Doxycycline is antibacterial and has no effect on viral replication.",
    },
    keyClue: "Chelation offenders: calcium, magnesium, aluminium, iron, zinc.",
    clinicalTakeaway:
      "This interaction causes silent treatment failure — the patient takes the drug faithfully and absorbs very little.",
    remediationConcept:
      "Tetracyclines and fluoroquinolones both chelate polyvalent cations found in antacids, dairy, iron and multivitamins. Separate doses by roughly two hours before or four to six hours after the cation source.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["interaction", "chelation", "tetracycline", "absorption"],
  },
  {
    id: "q062",
    topic: "Nursing prioritization and patient education",
    medicationClass: "Tetracyclines",
    difficulty: 3,
    type: "mcq",
    stem: "Which instruction is appropriate for oral doxycycline?",
    options: [
      { id: "a", text: "Lie down immediately after taking it." },
      { id: "b", text: "Take it with adequate water and remain upright to reduce esophageal irritation." },
      { id: "c", text: "Take it simultaneously with iron." },
      { id: "d", text: "Stop it as soon as symptoms improve." },
    ],
    correct: ["b"],
    rationale:
      "Doxycycline is directly caustic to oesophageal mucosa and can cause pill-induced oesophagitis or ulceration if it lodges there. A full glass of water plus remaining upright for at least 30 minutes keeps the tablet moving into the stomach.",
    distractorRationales: {
      a: "Lying down immediately is the specific behaviour that allows the tablet to lodge in the oesophagus and ulcerate.",
      c: "Iron chelates doxycycline and markedly reduces absorption; the doses must be separated.",
      d: "Stopping early risks relapse and promotes resistance. The prescribed course should be completed.",
    },
    keyClue: "Doxycycline: full glass of water, stay upright, avoid cations.",
    clinicalTakeaway:
      "Pill-induced oesophagitis presents as new painful swallowing or retrosternal pain and should never be dismissed.",
    remediationConcept:
      "Oral doxycycline teaching covers four points: adequate water, stay upright at least 30 minutes, separate from cations, and use sun protection. Report painful swallowing.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["tetracycline", "patient-education", "esophagitis"],
  },
  {
    id: "q063",
    topic: "Nursing prioritization and patient education",
    medicationClass: "Tetracyclines",
    difficulty: 3,
    type: "mcq",
    stem: "Which patient teaching is appropriate for tetracycline therapy?",
    options: [
      { id: "a", text: "Use sun protection because photosensitivity may occur." },
      { id: "b", text: "Double the dose after sun exposure." },
      { id: "c", text: "Take every dose with an aluminum antacid." },
      { id: "d", text: "Ignore painful swallowing." },
    ],
    correct: ["a"],
    rationale:
      "Tetracyclines cause phototoxicity: the drug absorbs ultraviolet energy and generates reactive species in the skin, producing exaggerated sunburn after limited exposure. Sunscreen, protective clothing and avoiding peak sun are appropriate precautions.",
    distractorRationales: {
      b: "Doubling a dose is never a response to sun exposure and would increase toxicity.",
      c: "Aluminium chelates tetracycline and blocks its absorption.",
      d: "Painful swallowing may indicate pill-induced oesophagitis and must be reported, not ignored.",
    },
    keyClue: "Photosensitivity classes: tetracyclines, fluoroquinolones, sulfonamides.",
    clinicalTakeaway:
      "Phototoxic reactions can occur through window glass and on overcast days, so precautions apply beyond obvious sunbathing.",
    remediationConcept:
      "Tetracyclines, fluoroquinolones and sulfonamides all cause photosensitivity. Teach sunscreen, protective clothing and avoidance of tanning beds for the duration of therapy.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["tetracycline", "patient-education", "photosensitivity"],
  },
  {
    id: "q064",
    topic: "Fluoroquinolones",
    medicationClass: "Fluoroquinolones",
    difficulty: 4,
    type: "mcq",
    stem: "A patient taking ciprofloxacin develops Achilles tendon pain. What is the best action?",
    options: [
      { id: "a", text: "Continue exercising to strengthen the tendon." },
      { id: "b", text: "Stop activity, hold the medication as directed, and contact the prescriber promptly." },
      { id: "c", text: "Take the medication with calcium." },
      { id: "d", text: "Massage the tendon aggressively." },
    ],
    correct: ["b"],
    rationale:
      "Fluoroquinolone tendinopathy most often affects the Achilles tendon and can progress to complete rupture. Resting the tendon, holding the drug as directed and contacting the prescriber promptly is the correct sequence. Tendon injury can occur early in therapy and may persist after discontinuation.",
    distractorRationales: {
      a: "Loading an inflamed tendon markedly increases rupture risk. Rest is required, not exercise.",
      c: "Calcium would chelate ciprofloxacin and reduce absorption, and it does nothing for tendon injury.",
      d: "Aggressive massage of an inflamed, weakened tendon risks precipitating rupture.",
    },
    keyClue: "Fluoroquinolone plus tendon pain equals stop loading it, hold the drug, call the prescriber.",
    clinicalTakeaway:
      "Tendon rupture may occur days to months after therapy ends, so patients need this warning even at discharge.",
    remediationConcept:
      "Fluoroquinolone tendinopathy is a boxed-warning effect, most commonly Achilles. Risk rises with age over 60, corticosteroid use and organ transplantation. Rest, hold per protocol, and report promptly.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["fluoroquinolone", "tendinopathy", "priority", "nursing-action"],
  },
  {
    id: "q065",
    topic: "Fluoroquinolones",
    medicationClass: "Fluoroquinolones",
    difficulty: 4,
    type: "mcq",
    stem: "Which patient has the greatest concern for fluoroquinolone-associated tendon injury?",
    options: [
      { id: "a", text: "A young adult using saline nasal spray" },
      { id: "b", text: "An older adult taking systemic corticosteroids" },
      { id: "c", text: "A child taking topical moisturizer" },
      { id: "d", text: "An adult taking oral iron alone" },
    ],
    correct: ["b"],
    rationale:
      "Two major risk factors combine here: age over 60 and systemic corticosteroid use. Corticosteroids impair collagen synthesis and tendon repair, and ageing tendons have reduced vascularity and elasticity. Together they substantially raise tendinopathy and rupture risk.",
    distractorRationales: {
      a: "Saline nasal spray has no systemic effect and youth is protective rather than a risk factor.",
      c: "A topical moisturiser carries no tendon risk. Fluoroquinolones are generally avoided in children for other reasons, chiefly cartilage concerns.",
      d: "Oral iron chelates the fluoroquinolone and reduces absorption. That is an absorption interaction, not a tendon risk factor.",
    },
    keyClue: "Age over 60 plus corticosteroids is the classic tendon-rupture combination.",
    clinicalTakeaway:
      "In an older adult on corticosteroids, consider whether a non-fluoroquinolone alternative would serve as well.",
    remediationConcept:
      "Fluoroquinolone tendon risk factors: age over 60, systemic corticosteroids, organ transplant, renal impairment and strenuous activity. Distinguish these from absorption interactions such as iron or calcium.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["fluoroquinolone", "tendinopathy", "risk-factors"],
  },
  {
    id: "q066",
    topic: "Drug interactions",
    medicationClass: "Fluoroquinolones",
    difficulty: 3,
    type: "mcq",
    stem: "Ciprofloxacin should be separated from calcium, iron, magnesium, and aluminum products primarily because:",
    options: [
      { id: "a", text: "These substances can reduce fluoroquinolone absorption." },
      { id: "b", text: "They cause bacterial resistance within minutes." },
      { id: "c", text: "They convert the medication into vancomycin." },
      { id: "d", text: "They cause red man syndrome." },
    ],
    correct: ["a"],
    rationale:
      "Fluoroquinolones chelate polyvalent cations, forming non-absorbable complexes in the gastrointestinal tract. Absorption can fall dramatically, producing sub-therapeutic levels, treatment failure and resistance selection. Separating administration times preserves bioavailability.",
    distractorRationales: {
      b: "Resistance develops through selection pressure over time, not within minutes of taking an antacid.",
      c: "Drugs cannot be chemically converted into other drugs in the gut; this is pharmacologically impossible.",
      d: "Red man syndrome is a rate-related vancomycin infusion reaction with no relationship to chelation.",
    },
    keyClue: "Both tetracyclines and fluoroquinolones are chelated by the same cations.",
    clinicalTakeaway:
      "Ask specifically about antacids, multivitamins, iron, calcium supplements and dairy — patients rarely volunteer these as medications.",
    remediationConcept:
      "Chelation blocks absorption of oral tetracyclines and fluoroquinolones. Give the antibiotic roughly two hours before or four to six hours after the cation-containing product.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["interaction", "chelation", "fluoroquinolone", "absorption"],
  },
  {
    id: "q067",
    topic: "Organ toxicity",
    medicationClass: "Fluoroquinolones",
    difficulty: 4,
    type: "mcq",
    stem: "Which cardiac concern may be relevant with some fluoroquinolones?",
    options: [
      { id: "a", text: "QT-interval prolongation" },
      { id: "b", text: "Permanent shortening of the PR interval in all patients" },
      { id: "c", text: "Universal heart block" },
      { id: "d", text: "Immediate valve calcification" },
    ],
    correct: ["a"],
    rationale:
      "Several fluoroquinolones block cardiac potassium channels and prolong the QT interval, which can precipitate torsades de pointes. Risk increases with hypokalaemia, hypomagnesaemia, bradycardia, pre-existing QT prolongation and other QT-prolonging drugs such as macrolides or ondansetron.",
    distractorRationales: {
      b: "Fluoroquinolones do not shorten the PR interval, and 'all patients' is an unsupportable absolute.",
      c: "Heart block is not a characteristic fluoroquinolone effect, and 'universal' is again absolute.",
      d: "Valve calcification is a chronic degenerative process, not an acute drug effect.",
    },
    keyClue: "QT-prolonging antimicrobials: fluoroquinolones, macrolides, and some azole antifungals.",
    clinicalTakeaway:
      "Correcting potassium and magnesium is a concrete way to reduce torsades risk in a patient on a QT-prolonging antimicrobial.",
    remediationConcept:
      "Fluoroquinolones and macrolides both prolong QT. Check electrolytes, review the full medication list for other QT-prolonging agents, and be alert to syncope or palpitations.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["fluoroquinolone", "qt-prolongation", "cardiac"],
  },
  {
    id: "q068",
    topic: "Organ toxicity",
    medicationClass: "Fluoroquinolones",
    difficulty: 4,
    type: "mcq",
    stem: "A patient taking levofloxacin reports burning and tingling in both feet. What should the nurse suspect?",
    options: [
      { id: "a", text: "Peripheral neuropathy" },
      { id: "b", text: "Biliary sludging" },
      { id: "c", text: "Tooth discoloration" },
      { id: "d", text: "Folate deficiency" },
    ],
    correct: ["a"],
    rationale:
      "Fluoroquinolone-associated peripheral neuropathy carries a boxed warning. It can begin within days, may affect small and large fibres, and can become permanent if the drug is continued. Burning, tingling, numbness or weakness warrants prompt reporting.",
    distractorRationales: {
      b: "Biliary sludging is a ceftriaxone effect and presents as right upper-quadrant pain.",
      c: "Tooth discoloration is a tetracycline effect in developing teeth.",
      d: "Folate deficiency relates to trimethoprim and sulfonamides; it would present haematologically rather than as acute paraesthesia.",
    },
    keyClue: "Fluoroquinolone plus new burning or tingling equals possible permanent neuropathy — report now.",
    clinicalTakeaway:
      "Fluoroquinolone neuropathy may be irreversible, so prompt discontinuation decisions matter more than with most adverse effects.",
    remediationConcept:
      "Fluoroquinolones carry boxed warnings for tendinopathy, peripheral neuropathy and central nervous system effects, plus aortic aneurysm risk. Any new neurologic symptom should be reported promptly because the damage may persist.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["fluoroquinolone", "neuropathy", "priority", "boxed-warning"],
  },
  {
    id: "q069",
    topic: "Pregnancy and antimicrobial safety",
    medicationClass: "Tetracyclines",
    difficulty: 3,
    type: "mcq",
    stem: "Which medication is generally avoided in pregnancy when safer effective alternatives are available because of concerns involving developing teeth and bone?",
    options: [
      { id: "a", text: "Doxycycline" },
      { id: "b", text: "Penicillin V" },
      { id: "c", text: "Cephalexin" },
      { id: "d", text: "Amoxicillin" },
    ],
    correct: ["a"],
    rationale:
      "Doxycycline is a tetracycline, and tetracyclines bind calcium in developing teeth and bone. This produces permanent tooth discoloration and potential effects on bone growth, so they are generally avoided in pregnancy and in children under eight when alternatives exist.",
    distractorRationales: {
      b: "Penicillin V does not affect calcified tissue and is considered appropriate in pregnancy.",
      c: "Cephalexin is a cephalosporin with a reassuring pregnancy record.",
      d: "Amoxicillin is among the most commonly used pregnancy-appropriate antibiotics.",
    },
    keyClue: "Only one tetracycline appears among three beta-lactams — the odd class is the answer.",
    clinicalTakeaway:
      "The qualifier 'when safer effective alternatives are available' is doing real work: severe rickettsial infection overrides it.",
    remediationConcept:
      "Tetracyclines are avoided in pregnancy and in children under eight because they chelate calcium in developing teeth and bone. Beta-lactams are the standard safer alternatives.",
    pregnancyRelated: true,
    safetyPriority: false,
    tags: ["pregnancy", "tetracycline", "safer-alternative"],
  },
  {
    id: "q070",
    topic: "Antimicrobial stewardship",
    medicationClass: "Fluoroquinolones",
    difficulty: 4,
    type: "mcq",
    stem: "A patient receiving ciprofloxacin has culture results supporting a safer narrow-spectrum agent. Which action best reflects stewardship?",
    options: [
      { id: "a", text: "Continue ciprofloxacin because it penetrates many tissues." },
      { id: "b", text: "Consider de-escalation to the targeted agent." },
      { id: "c", text: "Add the targeted agent without reassessment." },
      { id: "d", text: "Extend ciprofloxacin indefinitely." },
    ],
    correct: ["b"],
    rationale:
      "Fluoroquinolones carry substantial toxicity — tendinopathy, neuropathy, central nervous system effects, QT prolongation and C. difficile risk — and heavy use drives resistance. When culture results support a safer narrow agent, de-escalating reduces both individual harm and population resistance pressure.",
    distractorRationales: {
      a: "Excellent tissue penetration does not justify continuing a more toxic agent when a targeted alternative will reach the site adequately.",
      c: "Adding a second agent creates duplicate coverage with extra toxicity and no benefit.",
      d: "Indefinite therapy has no clinical justification and compounds every fluoroquinolone risk.",
    },
    keyClue: "Fluoroquinolones are high-toxicity, high-resistance drugs — de-escalate whenever culture allows.",
    clinicalTakeaway:
      "Fluoroquinolones are among the highest-priority targets for stewardship because their toxicities can be permanent.",
    remediationConcept:
      "De-escalate from fluoroquinolones as soon as susceptibilities permit. Their boxed-warning toxicities and strong association with C. difficile and resistance make continued unnecessary use a genuine patient-safety issue.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["stewardship", "de-escalation", "fluoroquinolone"],
  },
];
