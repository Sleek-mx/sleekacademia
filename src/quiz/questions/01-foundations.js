// Q1–10 — Foundations, mechanisms of action, pharmacodynamics, resistance.
// Original items written for Sleek Academia. No commercial test-bank content.

export default [
  {
    id: "q001",
    topic: "Mechanisms of action",
    medicationClass: "Cephalosporins",
    difficulty: 3,
    type: "mcq",
    stem: "A patient is prescribed ceftriaxone for bacterial meningitis. Which bacterial process is directly inhibited by this medication?",
    options: [
      { id: "a", text: "DNA gyrase activity" },
      { id: "b", text: "Cell-wall cross-linking" },
      { id: "c", text: "Folic-acid activation" },
      { id: "d", text: "Ribosomal translocation" },
    ],
    correct: ["b"],
    rationale:
      "Ceftriaxone is a third-generation cephalosporin. Like all beta-lactams it binds penicillin-binding proteins, the transpeptidases that cross-link peptidoglycan strands. Without cross-linking the cell wall cannot withstand internal osmotic pressure, so the organism lyses.",
    distractorRationales: {
      a: "DNA gyrase (topoisomerase II) is the target of fluoroquinolones such as ciprofloxacin, not of beta-lactams.",
      c: "Folate pathway inhibition describes sulfonamides and trimethoprim, which block sequential steps in bacterial folate synthesis.",
      d: "Blocking ribosomal translocation is the macrolide mechanism at the 50S subunit; ceftriaxone does not enter the ribosome at all.",
    },
    keyClue: "Any drug name containing 'cef-' or ending in '-cillin' is a cell-wall agent.",
    clinicalTakeaway:
      "Ceftriaxone is a first-line meningitis choice because it is bactericidal and penetrates inflamed meninges well.",
    remediationConcept:
      "Beta-lactams (penicillins, cephalosporins, carbapenems, monobactams) all inhibit cell-wall synthesis by binding penicillin-binding proteins. Sort every antimicrobial by target first: cell wall, ribosome, nucleic acid, or folate pathway. That single sort answers a large share of mechanism questions.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["mechanism", "beta-lactam", "cns-infection"],
  },
  {
    id: "q002",
    topic: "Mechanisms of action",
    medicationClass: "Tetracyclines",
    difficulty: 3,
    type: "mcq",
    stem: "Which medication inhibits bacterial protein synthesis by binding primarily to the 30S ribosomal subunit?",
    options: [
      { id: "a", text: "Azithromycin" },
      { id: "b", text: "Vancomycin" },
      { id: "c", text: "Doxycycline" },
      { id: "d", text: "Cefepime" },
    ],
    correct: ["c"],
    rationale:
      "Doxycycline is a tetracycline. Tetracyclines bind the 30S ribosomal subunit and block attachment of aminoacyl transfer RNA to the acceptor site, halting peptide elongation. The effect is generally bacteriostatic.",
    distractorRationales: {
      a: "Azithromycin is a macrolide and binds the 50S subunit, not the 30S.",
      b: "Vancomycin is a glycopeptide that binds D-alanyl-D-alanine peptidoglycan precursors — a cell-wall mechanism, not a ribosomal one.",
      d: "Cefepime is a fourth-generation cephalosporin and acts on penicillin-binding proteins in the cell wall.",
    },
    keyClue: "Aminoglycosides and tetracyclines act at 30S; macrolides, clindamycin and linezolid act at 50S.",
    clinicalTakeaway:
      "Two drug classes share the 30S target but differ sharply in effect: aminoglycosides are bactericidal, tetracyclines bacteriostatic.",
    remediationConcept:
      "Memorise the ribosome split: 30S is aminoglycosides plus tetracyclines, 50S is macrolides, clindamycin, linezolid and chloramphenicol. Then layer on which are bactericidal. Same subunit does not mean same clinical behaviour.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["mechanism", "ribosome", "protein-synthesis"],
  },
  {
    id: "q003",
    topic: "Resistance",
    medicationClass: "Penicillins",
    difficulty: 4,
    type: "mcq",
    stem: "A bacterial isolate develops an altered penicillin-binding protein. Which antimicrobial is most directly affected by this resistance mechanism?",
    options: [
      { id: "a", text: "Nafcillin" },
      { id: "b", text: "Gentamicin" },
      { id: "c", text: "Ciprofloxacin" },
      { id: "d", text: "Azithromycin" },
    ],
    correct: ["a"],
    rationale:
      "Nafcillin is a beta-lactam and its activity depends entirely on binding penicillin-binding proteins. If the organism expresses an altered PBP with low beta-lactam affinity, the drug can no longer inhibit cross-linking. This is precisely the mecA/PBP2a mechanism that defines methicillin-resistant Staphylococcus aureus.",
    distractorRationales: {
      a: null,
      b: "Gentamicin binds the 30S ribosome; PBP changes do not affect a ribosomal target.",
      c: "Ciprofloxacin inhibits DNA gyrase and topoisomerase IV, so altered PBPs are irrelevant to it.",
      d: "Azithromycin acts at the 50S subunit and is unaffected by PBP alteration.",
    },
    keyClue: "Altered PBP is the structural definition of MRSA — it defeats every beta-lactam, not just methicillin.",
    clinicalTakeaway:
      "Because altered PBP2a resists all standard beta-lactams, MRSA requires an agent with a different target such as vancomycin or linezolid.",
    remediationConcept:
      "Match the resistance mechanism to the drug target it disables, so altered PBP defeats beta-lactams while ribosomal methylation defeats macrolides. Beta-lactamase enzymes also defeat beta-lactams, but by destroying the drug rather than changing its target. That distinction is why a beta-lactamase inhibitor rescues amoxicillin but does nothing against MRSA.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["resistance", "mrsa", "beta-lactam"],
  },
  {
    id: "q004",
    topic: "Bactericidal therapy",
    medicationClass: "Multiple classes",
    difficulty: 4,
    type: "sata",
    stem: "Which medications are generally considered bactericidal? Select all that apply.",
    options: [
      { id: "a", text: "Penicillin G" },
      { id: "b", text: "Gentamicin" },
      { id: "c", text: "Doxycycline" },
      { id: "d", text: "Ciprofloxacin" },
      { id: "e", text: "Vancomycin" },
    ],
    correct: ["a", "b", "d", "e"],
    rationale:
      "Penicillin G (beta-lactam), gentamicin (aminoglycoside), ciprofloxacin (fluoroquinolone) and vancomycin (glycopeptide) all kill bacteria directly. Beta-lactams and vancomycin destroy the cell wall, aminoglycosides cause irreversible ribosomal misreading, and fluoroquinolones produce lethal DNA strand breaks.",
    distractorRationales: {
      a: "Correct — beta-lactams lyse the organism by disabling cell-wall cross-linking.",
      b: "Correct — aminoglycosides bind 30S irreversibly and are concentration-dependent killers.",
      c: "Doxycycline is the exception. Tetracyclines reversibly block transfer RNA binding, which suppresses growth rather than killing, so they are generally bacteriostatic.",
      d: "Correct — fluoroquinolones cause double-strand DNA breaks via gyrase and topoisomerase IV inhibition.",
      e: "Correct — vancomycin blocks peptidoglycan polymerisation and is bactericidal against most susceptible gram-positive organisms.",
    },
    keyClue: "Bacteriostatic short list: tetracyclines, macrolides (mostly), clindamycin, linezolid, sulfonamides.",
    clinicalTakeaway:
      "Bactericidal agents are preferred for endocarditis, meningitis, osteomyelitis and neutropenic infection, where host immunity cannot finish the job.",
    remediationConcept:
      "Learn the shorter bacteriostatic list rather than the long bactericidal one. If a drug is not a tetracycline, macrolide, clindamycin, linezolid or sulfonamide, it is probably bactericidal. The distinction matters most in immunocompromised or deep-seated infection.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["bactericidal", "pharmacodynamics", "multi-class"],
  },
  {
    id: "q005",
    topic: "Pharmacodynamics",
    medicationClass: "Aminoglycosides",
    difficulty: 5,
    type: "mcq",
    stem: "Which antimicrobial property best predicts the effectiveness of an aminoglycoside?",
    options: [
      { id: "a", text: "Time above the minimum inhibitory concentration" },
      { id: "b", text: "Peak concentration relative to the minimum inhibitory concentration" },
      { id: "c", text: "Duration of intestinal exposure" },
      { id: "d", text: "Percentage bound to albumin" },
    ],
    correct: ["b"],
    rationale:
      "Aminoglycosides demonstrate concentration-dependent killing. The higher the peak relative to the organism's minimum inhibitory concentration (the Cmax/MIC ratio), the greater the bacterial kill. This is why a large once-daily dose can outperform the same total amount divided into small frequent doses.",
    distractorRationales: {
      a: "Time above the MIC governs beta-lactams, which are time-dependent killers — the opposite pharmacodynamic profile.",
      c: "Intestinal exposure is irrelevant: aminoglycosides are poorly absorbed orally and are given parenterally for systemic infection.",
      d: "Aminoglycosides are minimally protein-bound, so albumin binding does not predict their efficacy.",
    },
    keyClue: "Concentration-dependent: aminoglycosides and fluoroquinolones. Time-dependent: beta-lactams and vancomycin.",
    clinicalTakeaway:
      "The concentration-dependent profile is the pharmacologic justification for extended-interval (once-daily) aminoglycoside dosing.",
    remediationConcept:
      "Sort antimicrobials into concentration-dependent versus time-dependent killers, because that single property dictates the dosing strategy. High peaks matter for aminoglycosides; sustained levels matter for beta-lactams, which is why they are given frequently or by extended infusion.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["pharmacodynamics", "dosing", "aminoglycoside"],
  },
  {
    id: "q006",
    topic: "Pharmacodynamics",
    medicationClass: "Aminoglycosides",
    difficulty: 4,
    type: "mcq",
    stem: "Why might an extended-interval aminoglycoside regimen be prescribed?",
    options: [
      { id: "a", text: "It eliminates the need to monitor kidney function." },
      { id: "b", text: "It maintains a constant low serum concentration." },
      { id: "c", text: "It uses concentration-dependent killing and a post-antibiotic effect." },
      { id: "d", text: "It prevents all forms of ototoxicity." },
    ],
    correct: ["c"],
    rationale:
      "Extended-interval dosing exploits two properties. High peaks maximise concentration-dependent killing, and the post-antibiotic effect means bacterial suppression persists after the serum level falls. The resulting low-level trough period also allows renal tubular cells to clear accumulated drug, which may reduce nephrotoxicity.",
    distractorRationales: {
      a: "Renal monitoring becomes more important, not less. Aminoglycosides are renally cleared and remain nephrotoxic on any schedule.",
      b: "This describes the opposite intent. Extended-interval dosing deliberately produces high peaks and low troughs, not a constant level.",
      d: "No aminoglycoside regimen abolishes ototoxicity. Cochlear and vestibular damage may be irreversible and can occur even with appropriate dosing.",
    },
    keyClue: "'Extended interval' means bigger dose, less often — high peak, low trough.",
    clinicalTakeaway:
      "Extended-interval dosing may lower nephrotoxicity risk, but it never removes the need for renal and auditory monitoring.",
    remediationConcept:
      "Extended-interval aminoglycoside dosing works because killing depends on peak concentration and continues after levels drop. Beware answer options containing absolutes such as 'eliminates' or 'prevents all' — toxicity risk is reduced, never abolished.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["pharmacodynamics", "dosing", "aminoglycoside", "toxicity"],
  },
  {
    id: "q007",
    topic: "Resistance",
    medicationClass: "Penicillins",
    difficulty: 4,
    type: "mcq",
    stem: "A bacterium produces an enzyme that opens the beta-lactam ring. Which resistance mechanism is present?",
    options: [
      { id: "a", text: "Efflux pump activation" },
      { id: "b", text: "Enzymatic drug inactivation" },
      { id: "c", text: "Reduced folate synthesis" },
      { id: "d", text: "Ribosomal methylation" },
    ],
    correct: ["b"],
    rationale:
      "Beta-lactamases hydrolyse the beta-lactam ring, the structural feature required for binding penicillin-binding proteins. The drug is chemically destroyed before it can act, which is enzymatic inactivation.",
    distractorRationales: {
      a: "Efflux pumps physically transport intact drug out of the cell. The drug is not destroyed, and this mechanism is prominent for tetracyclines and fluoroquinolones.",
      c: "Altered folate synthesis is a resistance route against sulfonamides and trimethoprim, and it does not involve cleaving a beta-lactam ring.",
      d: "Ribosomal methylation (erm genes) blocks macrolide, clindamycin and streptogramin binding at the 50S subunit — a ribosomal target, not a beta-lactam one.",
    },
    keyClue: "'-ase' enzyme opening a ring means the drug is destroyed, not merely blocked or expelled.",
    clinicalTakeaway:
      "Enzymatic inactivation is the mechanism a beta-lactamase inhibitor is designed to defeat, which is why combination products exist.",
    remediationConcept:
      "There are four broad resistance strategies: destroy the drug (beta-lactamase), change the target (altered PBP), pump the drug out (efflux), or block entry (porin loss). Read the stem for which of those four is being described.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["resistance", "beta-lactamase"],
  },
  {
    id: "q008",
    topic: "Resistance",
    medicationClass: "Penicillins",
    difficulty: 5,
    type: "mcq",
    stem: "Clavulanate is added to amoxicillin primarily to:",
    options: [
      { id: "a", text: "Improve renal excretion" },
      { id: "b", text: "Block bacterial protein synthesis" },
      { id: "c", text: "Inhibit certain beta-lactamases" },
      { id: "d", text: "Prevent hypersensitivity reactions" },
    ],
    correct: ["c"],
    rationale:
      "Clavulanate has minimal antibacterial activity of its own. It acts as a suicide inhibitor of many beta-lactamases, sacrificing itself so amoxicillin survives to reach penicillin-binding proteins. This restores amoxicillin activity against beta-lactamase-producing organisms.",
    distractorRationales: {
      a: "Clavulanate does not enhance excretion. Probenecid is the classic agent that alters penicillin renal handling, and it delays excretion rather than improving it.",
      b: "Neither component targets the ribosome; amoxicillin is a cell-wall agent and clavulanate is an enzyme inhibitor.",
      d: "Clavulanate does not reduce allergy risk. A patient allergic to amoxicillin remains allergic to amoxicillin-clavulanate, and clavulanate itself adds gastrointestinal effects.",
    },
    keyClue: "Inhibitor partners: clavulanate, tazobactam, sulbactam, vaborbactam, avibactam.",
    clinicalTakeaway:
      "Adding a beta-lactamase inhibitor extends spectrum; it does nothing for allergy risk and does not overcome altered-PBP resistance such as MRSA.",
    remediationConcept:
      "A beta-lactamase inhibitor protects its partner drug from enzymatic destruction. It cannot overcome resistance that works by changing the target, so amoxicillin-clavulanate still fails against MRSA.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["resistance", "beta-lactamase-inhibitor", "combination"],
  },
  {
    id: "q009",
    topic: "Antimicrobial stewardship",
    medicationClass: "General principles",
    difficulty: 4,
    type: "mcq",
    stem: "Which action most effectively reduces unnecessary disruption of normal flora after culture results are available?",
    options: [
      { id: "a", text: "Add a second broad-spectrum drug." },
      { id: "b", text: "Continue empiric therapy unchanged." },
      { id: "c", text: "Change to the narrowest effective antimicrobial." },
      { id: "d", text: "Reduce every antimicrobial dose by half." },
    ],
    correct: ["c"],
    rationale:
      "Once susceptibility data identify the organism, narrowing therapy — de-escalation — targets the pathogen while sparing commensal flora. This lowers the risk of Clostridioides difficile infection, candidal overgrowth and selection of resistant organisms.",
    distractorRationales: {
      a: "Adding a second broad agent increases flora disruption and toxicity risk without therapeutic benefit once the organism is known.",
      b: "Continuing unnecessarily broad empiric therapy is the specific practice de-escalation is meant to correct.",
      d: "Halving doses produces sub-therapeutic concentrations, which risks treatment failure and actively promotes resistance. Dose is adjusted for organ function, never to narrow spectrum.",
    },
    keyClue: "Culture result available equals reassess and narrow.",
    clinicalTakeaway:
      "Broad empiric therapy is appropriate at presentation; failing to narrow it once results return is the stewardship error.",
    remediationConcept:
      "De-escalation means switching from broad empiric coverage to the narrowest agent that treats the identified organism, at a full therapeutic dose. Narrow the spectrum, never the dose.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["stewardship", "de-escalation", "spectrum"],
  },
  {
    id: "q010",
    topic: "Culture and susceptibility",
    medicationClass: "General principles",
    difficulty: 5,
    type: "mcq",
    stem: "An organism has minimum inhibitory concentrations of 0.25 mcg/mL for Drug X and 1 mcg/mL for Drug Y. Which conclusion is most appropriate?",
    options: [
      { id: "a", text: "Drug X is automatically safer." },
      { id: "b", text: "Drug X is always clinically superior." },
      { id: "c", text: "The values must be interpreted using drug-specific susceptibility breakpoints." },
      { id: "d", text: "Drug Y is resistant because its value is higher." },
    ],
    correct: ["c"],
    rationale:
      "Minimum inhibitory concentrations cannot be compared across different drugs. Each agent has its own breakpoint reflecting achievable concentrations at the infection site, dosing and pharmacokinetics. A value of 1 mcg/mL may be well within the susceptible range for one drug while 0.25 mcg/mL is resistant for another.",
    distractorRationales: {
      a: "The MIC measures microbiologic potency, not patient safety. Toxicity depends on the drug's adverse-effect profile, organ function and interactions — none of which the MIC reflects.",
      b: "A lower MIC does not confer clinical superiority. Site penetration matters more: an agent with a low MIC that cannot reach cerebrospinal fluid or urine will fail regardless.",
      d: "Susceptibility is determined by the breakpoint, not by the absolute number. The laboratory reports the interpretation as susceptible, intermediate or resistant.",
    },
    keyClue: "Never compare MIC numbers between different drugs — compare each to its own breakpoint.",
    clinicalTakeaway:
      "Read the laboratory's S/I/R interpretation, then select among susceptible agents using infection site, organ function, allergy and toxicity.",
    remediationConcept:
      "The MIC is the lowest concentration inhibiting visible growth, and it is only meaningful against that drug's own breakpoint. Susceptibility on a report is not the same as suitability for this patient at this site.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["culture", "mic", "susceptibility", "interpretation"],
  },
];
