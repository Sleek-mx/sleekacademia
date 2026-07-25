// Q21–30 — Pregnancy and lactation: risk-benefit reasoning, safer alternatives,
// gestational timing, folate antagonism, fetal ototoxicity.

export default [
  {
    id: "q021",
    topic: "Pregnancy and antimicrobial safety",
    medicationClass: "Tetracyclines",
    difficulty: 4,
    type: "mcq",
    stem: "A patient at 20 weeks' gestation is prescribed doxycycline for an infection with safer susceptible alternatives. What should the nurse do?",
    options: [
      { id: "a", text: "Administer it because susceptibility overrides pregnancy concerns." },
      { id: "b", text: "Question the prescription because tetracyclines may affect developing teeth and bone." },
      { id: "c", text: "Give it with calcium to protect fetal teeth." },
      { id: "d", text: "Delay treatment until the third trimester." },
    ],
    correct: ["b"],
    rationale:
      "Tetracyclines chelate calcium and deposit in developing teeth and bone. After roughly the second trimester, when fetal calcification begins, this can cause permanent tooth discoloration and affect bone growth. When a safer susceptible alternative exists, the nurse should clarify the order before administering.",
    distractorRationales: {
      a: "Susceptibility never overrides patient-specific safety. In vitro activity is only one input into drug selection.",
      c: "Calcium does not protect the fetus. It would instead chelate the doxycycline in the maternal gut and reduce absorption, undermining treatment.",
      d: "Delaying makes the risk worse, since calcium deposition risk increases later in gestation, and it leaves a real infection untreated.",
    },
    keyClue: "Tetracyclines plus developing calcium tissue equals permanent staining and bone effects.",
    clinicalTakeaway:
      "Question tetracyclines in pregnancy and in children under eight whenever a safer effective alternative is available.",
    remediationConcept:
      "Tetracyclines are generally avoided after early pregnancy because they bind calcium in developing teeth and bone. The decisive question is whether a safer susceptible alternative exists — if so, clarify the order.",
    pregnancyRelated: true,
    safetyPriority: true,
    tags: ["pregnancy", "tetracycline", "clarify-order"],
  },
  {
    id: "q022",
    topic: "Pregnancy and antimicrobial safety",
    medicationClass: "General principles",
    difficulty: 4,
    type: "mcq",
    stem: "Which statement by a pregnant patient prescribed an antibiotic requires correction?",
    options: [
      { id: "a", text: "\"I should report signs of an allergic reaction.\"" },
      { id: "b", text: "\"A culture can help identify an effective medication.\"" },
      { id: "c", text: "\"If the organism is susceptible, the medication is automatically safe in pregnancy.\"" },
      { id: "d", text: "\"The provider should consider both maternal benefit and fetal risk.\"" },
    ],
    correct: ["c"],
    rationale:
      "Susceptibility and safety are separate questions. A culture may report susceptibility to doxycycline, a fluoroquinolone or an aminoglycoside, yet each raises specific fetal concerns. Susceptibility describes what kills the organism; it says nothing about fetal exposure risk.",
    distractorRationales: {
      a: "Correct understanding. Hypersensitivity can occur with any antimicrobial and warrants prompt reporting.",
      b: "Correct understanding. Culture and susceptibility testing narrows the field to agents that will work.",
      d: "Correct understanding. This is precisely the risk-benefit reasoning that governs prescribing in pregnancy.",
    },
    keyClue: "Watch for 'automatically' and 'always' — susceptibility never equals safety.",
    clinicalTakeaway:
      "The pregnancy question is always two-sided: how dangerous is the untreated infection, and how risky is this specific agent?",
    remediationConcept:
      "Susceptibility is a microbiology finding; pregnancy safety is a separate clinical judgement. Selection in pregnancy requires both, plus gestational age and whether safer alternatives exist.",
    pregnancyRelated: true,
    safetyPriority: false,
    tags: ["pregnancy", "patient-education", "susceptibility"],
  },
  {
    id: "q023",
    topic: "Pregnancy and antimicrobial safety",
    medicationClass: "Penicillins",
    difficulty: 3,
    type: "mcq",
    stem: "Which antimicrobial is generally considered an appropriate option in pregnancy when clinically indicated and no severe allergy exists?",
    options: [
      { id: "a", text: "Amoxicillin" },
      { id: "b", text: "Tetracycline" },
      { id: "c", text: "Streptomycin" },
      { id: "d", text: "Chloramphenicol" },
    ],
    correct: ["a"],
    rationale:
      "Penicillins including amoxicillin have the longest record of safe use in pregnancy. They do not disturb fetal calcium deposition, carry no established fetal ototoxicity, and do not interfere with folate metabolism, which makes them a common first choice when the organism is susceptible.",
    distractorRationales: {
      b: "Tetracycline deposits in developing teeth and bone and is generally avoided after early pregnancy.",
      c: "Streptomycin, an aminoglycoside, is associated with fetal eighth cranial nerve damage and congenital hearing loss.",
      d: "Chloramphenicol is linked to gray baby syndrome in the neonate and is avoided near term.",
    },
    keyClue: "Penicillins and most cephalosporins are the reliable pregnancy-friendly backbone.",
    clinicalTakeaway:
      "Beta-lactams and macrolides such as azithromycin are the usual pregnancy workhorses; tetracyclines, aminoglycosides and fluoroquinolones require specific justification.",
    remediationConcept:
      "Build two mental lists. Generally acceptable in pregnancy: penicillins, most cephalosporins, azithromycin. Generally avoided unless compelling: tetracyclines, aminoglycosides, fluoroquinolones, and trimethoprim in the first trimester.",
    pregnancyRelated: true,
    safetyPriority: false,
    tags: ["pregnancy", "penicillin", "safer-alternative"],
  },
  {
    id: "q024",
    topic: "Pregnancy and antimicrobial safety",
    medicationClass: "Aminoglycosides",
    difficulty: 4,
    type: "mcq",
    stem: "Which medication is associated with fetal ototoxicity risk and is generally avoided during pregnancy unless a compelling indication exists?",
    options: [
      { id: "a", text: "Cephalexin" },
      { id: "b", text: "Azithromycin" },
      { id: "c", text: "Streptomycin" },
      { id: "d", text: "Amoxicillin" },
    ],
    correct: ["c"],
    rationale:
      "Streptomycin crosses the placenta and can damage the developing eighth cranial nerve, causing congenital hearing loss and vestibular dysfunction. This risk applies broadly to aminoglycosides, so they are reserved for situations where the maternal infection is serious and alternatives are inadequate.",
    distractorRationales: {
      a: "Cephalexin is a cephalosporin with a reassuring pregnancy record and no established fetal ototoxicity.",
      b: "Azithromycin is a macrolide commonly used in pregnancy, including for chlamydial infection.",
      d: "Amoxicillin is among the best-established pregnancy-appropriate antibiotics.",
    },
    keyClue: "Aminoglycosides damage the eighth cranial nerve — in the fetus as in the adult.",
    clinicalTakeaway:
      "Aminoglycoside fetal ototoxicity may be irreversible, which is why the indication must be genuinely compelling.",
    remediationConcept:
      "Aminoglycosides ending in '-micin' or '-mycin' carry ototoxic and nephrotoxic risk that extends to the fetus. Avoid in pregnancy unless the maternal infection is serious and no adequate alternative exists.",
    pregnancyRelated: true,
    safetyPriority: true,
    tags: ["pregnancy", "aminoglycoside", "ototoxicity"],
  },
  {
    id: "q025",
    topic: "Pregnancy and antimicrobial safety",
    medicationClass: "Tetracyclines",
    difficulty: 5,
    type: "mcq",
    stem: "A pregnant patient has a life-threatening rickettsial infection for which doxycycline is the most effective therapy. Which principle should guide treatment?",
    options: [
      { id: "a", text: "Doxycycline can never be used during pregnancy." },
      { id: "b", text: "Untreated maternal disease presents no fetal risk." },
      { id: "c", text: "Maternal benefit and infection severity may outweigh potential medication risk." },
      { id: "d", text: "Therapy must be delayed until delivery." },
    ],
    correct: ["c"],
    rationale:
      "Risk-benefit reasoning governs prescribing in pregnancy. Rocky Mountain spotted fever and related rickettsial infections carry substantial maternal mortality untreated, and doxycycline is the only reliably effective therapy. The dental staining risk is real but far outweighed by the risk of untreated life-threatening infection.",
    distractorRationales: {
      a: "'Never' is too absolute. Doxycycline is generally avoided, but severe rickettsial infection is the accepted exception.",
      b: "Untreated severe maternal infection endangers the fetus directly through hypoxia, fever, sepsis, preterm labour and fetal demise.",
      d: "Delaying treatment of a life-threatening infection risks maternal death, which is the worst possible fetal outcome.",
    },
    keyClue: "'Generally avoided' is not 'absolutely contraindicated'. Severity can flip the decision.",
    clinicalTakeaway:
      "A dead or critically ill mother is the greatest fetal risk of all; treating severe maternal infection protects the fetus.",
    remediationConcept:
      "Weigh the risk of the untreated infection against the risk of the drug. When the infection is life-threatening and the drug is uniquely effective, the usually-avoided agent becomes correct. Reject options containing 'never' or 'always'.",
    pregnancyRelated: true,
    safetyPriority: true,
    tags: ["pregnancy", "risk-benefit", "tetracycline", "exception"],
  },
  {
    id: "q026",
    topic: "Pregnancy and antimicrobial safety",
    medicationClass: "General principles",
    difficulty: 4,
    type: "sata",
    stem: "Which factors should be evaluated before selecting an antimicrobial during pregnancy? Select all that apply.",
    options: [
      { id: "a", text: "Gestational age" },
      { id: "b", text: "Infection severity" },
      { id: "c", text: "Organism susceptibility" },
      { id: "d", text: "Availability of safer effective alternatives" },
      { id: "e", text: "Maternal renal and hepatic function" },
    ],
    correct: ["a", "b", "c", "d", "e"],
    rationale:
      "All five are required. Gestational age determines which organ systems are vulnerable; severity sets how much risk is acceptable; susceptibility defines what could work; availability of safer alternatives usually decides between them; and maternal organ function governs dosing and accumulation.",
    distractorRationales: {
      a: "Correct — first-trimester organogenesis raises teratogenic concern, while later gestation raises calcium-deposition and near-term neonatal concerns.",
      b: "Correct — a life-threatening infection justifies accepting risk that a mild infection would not.",
      c: "Correct — an agent the organism resists is not an option regardless of its safety profile.",
      d: "Correct — when two agents both work, the safer one is chosen; this is usually the decisive factor.",
      e: "Correct — pregnancy alters renal clearance and volume of distribution, and impaired function risks accumulation and toxicity.",
    },
    keyClue: "When every option is a legitimate clinical consideration, select all of them.",
    clinicalTakeaway:
      "Pregnancy prescribing is a five-part filter, not a memorised safe-drug list.",
    remediationConcept:
      "Antimicrobial choice in pregnancy integrates gestational age, infection severity, susceptibility, safer alternatives and maternal organ function. No single factor decides alone.",
    pregnancyRelated: true,
    safetyPriority: false,
    tags: ["pregnancy", "selection", "risk-benefit"],
  },
  {
    id: "q027",
    topic: "Pregnancy and antimicrobial safety",
    medicationClass: "Sulfonamides and trimethoprim",
    difficulty: 4,
    type: "mcq",
    stem: "A pregnant patient asks why trimethoprim-containing therapy may require special consideration early in pregnancy. What is the best response?",
    options: [
      { id: "a", text: "Trimethoprim interferes with folate metabolism." },
      { id: "b", text: "Trimethoprim permanently blocks insulin secretion." },
      { id: "c", text: "It causes fetal tooth staining through calcium binding." },
      { id: "d", text: "It causes universal fetal hearing loss." },
    ],
    correct: ["a"],
    rationale:
      "Trimethoprim inhibits dihydrofolate reductase. Because neural tube closure during the first trimester depends on adequate folate, this antifolate action raises concern for neural tube defects, making the first trimester the period of greatest caution.",
    distractorRationales: {
      b: "Trimethoprim does not block insulin secretion. Sulfonamides may rarely cause hypoglycaemia, but that is a different mechanism and not the pregnancy concern.",
      c: "Calcium-mediated tooth staining is the tetracycline mechanism, not an antifolate effect.",
      d: "Fetal hearing loss is the aminoglycoside concern, and 'universal' overstates even that risk.",
    },
    keyClue: "Trimethoprim is an antifolate; folate deficiency in the first trimester means neural tube risk.",
    clinicalTakeaway:
      "Trimethoprim-sulfamethoxazole also raises neonatal kernicterus concern near term, so both ends of pregnancy warrant caution.",
    remediationConcept:
      "Trimethoprim blocks dihydrofolate reductase, and first-trimester neural tube closure requires folate. Late pregnancy adds a separate concern: sulfonamides displace bilirubin and risk neonatal kernicterus.",
    pregnancyRelated: true,
    safetyPriority: false,
    tags: ["pregnancy", "trimethoprim", "folate", "patient-education"],
  },
  {
    id: "q028",
    topic: "Pregnancy and antimicrobial safety",
    medicationClass: "General principles",
    difficulty: 3,
    type: "mcq",
    stem: "Which patient statement demonstrates correct understanding of pregnancy-related medication counseling?",
    options: [
      { id: "a", text: "\"Natural infections are safer than antibiotics.\"" },
      { id: "b", text: "\"The safest decision considers both the danger of the infection and the medication.\"" },
      { id: "c", text: "\"All antibiotics are contraindicated in every trimester.\"" },
      { id: "d", text: "\"Only topical antibiotics can be used.\"" },
    ],
    correct: ["b"],
    rationale:
      "This statement captures the governing principle: the decision weighs the harm of the untreated infection against the potential harm of the drug. Untreated infection in pregnancy carries real risks including preterm labour, sepsis and fetal loss.",
    distractorRationales: {
      a: "Untreated infection is not safer. Pyelonephritis, chorioamnionitis and sepsis all threaten mother and fetus.",
      c: "Many antibiotics are used safely throughout pregnancy, penicillins and cephalosporins foremost among them.",
      d: "Topical therapy cannot treat systemic infection, and restricting to it would leave serious infections untreated.",
    },
    keyClue: "The correct pregnancy answer usually weighs two risks rather than eliminating one.",
    clinicalTakeaway:
      "Reassure patients that withholding needed antibiotics is itself a risk, not a neutral choice.",
    remediationConcept:
      "Pregnancy counselling balances infection risk against medication risk. Reject options that treat all antibiotics as contraindicated or all infections as harmless.",
    pregnancyRelated: true,
    safetyPriority: false,
    tags: ["pregnancy", "patient-education", "risk-benefit"],
  },
  {
    id: "q029",
    topic: "Pregnancy and antimicrobial safety",
    medicationClass: "Multiple classes",
    difficulty: 4,
    type: "mcq",
    stem: "A pregnant patient receives a culture report showing susceptibility to doxycycline and amoxicillin. Both are expected to reach the infection site. Which drug is generally preferred when clinically appropriate?",
    options: [
      { id: "a", text: "Doxycycline because it is bacteriostatic" },
      { id: "b", text: "Doxycycline because it has a longer name" },
      { id: "c", text: "Amoxicillin because it is generally a safer pregnancy option" },
      { id: "d", text: "Neither medication because pregnancy prohibits antibiotics" },
    ],
    correct: ["c"],
    rationale:
      "When two agents are both susceptible and both reach the site, the safety profile decides. Amoxicillin has a long record of safe use in pregnancy, while doxycycline carries fetal dental and bone concerns. This is the textbook application of preferring the safer effective alternative.",
    distractorRationales: {
      a: "Bacteriostatic activity is not an advantage here, and it certainly does not offset a fetal safety concern.",
      b: "Drug name length is clinically meaningless.",
      d: "Pregnancy does not prohibit antibiotics; untreated infection endangers both mother and fetus.",
    },
    keyClue: "Two agents both work, so pick the safer one — that is the whole question.",
    clinicalTakeaway:
      "This is the practical form of the pregnancy rule: the existence of a safer effective alternative is what makes avoiding the riskier drug mandatory.",
    remediationConcept:
      "When multiple susceptible agents can reach the infection site, choose the one with the best safety profile for this patient. In pregnancy that usually means the beta-lactam over the tetracycline.",
    pregnancyRelated: true,
    safetyPriority: false,
    tags: ["pregnancy", "safer-alternative", "selection"],
  },
  {
    id: "q030",
    topic: "Pregnancy and antimicrobial safety",
    medicationClass: "General principles",
    difficulty: 4,
    type: "mcq",
    stem: "A lactating patient is prescribed an antimicrobial. Which nursing action is best?",
    options: [
      { id: "a", text: "State that all antimicrobial therapy requires permanent cessation of breastfeeding." },
      { id: "b", text: "Evaluate the specific drug, dose, infant age, milk transfer, and clinical indication." },
      { id: "c", text: "Assume no medication enters breast milk." },
      { id: "d", text: "Recommend taking half of every prescribed dose." },
    ],
    correct: ["b"],
    rationale:
      "Lactation decisions are drug-specific. Relevant factors include how much drug transfers into milk, its oral bioavailability in the infant, the infant's age and health, and whether the mother genuinely needs this agent. Most common antibiotics are compatible with continued breastfeeding.",
    distractorRationales: {
      a: "Permanent cessation is almost never required. Blanket advice to stop breastfeeding causes avoidable harm to the infant and the feeding relationship.",
      c: "Most drugs do enter milk to some degree; the question is whether the amount is clinically significant.",
      d: "Halving doses produces sub-therapeutic maternal levels, risking treatment failure and resistance. Dose is never reduced simply because a patient is lactating.",
    },
    keyClue: "Lactation questions are answered drug by drug, never by blanket rule.",
    clinicalTakeaway:
      "Penicillins, cephalosporins and macrolides are generally compatible with breastfeeding; treating the mother adequately serves the infant too.",
    remediationConcept:
      "Assess milk transfer, infant oral bioavailability, infant age and health, and the maternal indication. Reject both extremes: 'all medications require stopping' and 'nothing enters milk'. Never reduce a therapeutic dose for lactation.",
    pregnancyRelated: true,
    safetyPriority: false,
    tags: ["lactation", "patient-education", "selection"],
  },
];
