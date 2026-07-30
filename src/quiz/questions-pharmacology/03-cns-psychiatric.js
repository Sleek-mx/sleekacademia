// P21–30 — CNS and psychiatric pharmacology: SSRIs, serotonin syndrome,
// benzodiazepines, antipsychotics, mood stabilizers, and anticonvulsants.
// Original items written for Sleek Academia. No commercial test-bank content.

export default [
  {
    id: "p021",
    topic: "SSRIs",
    category: "CNS and psychiatric",
    difficulty: 2,
    type: "mcq",
    stem:
      "A patient started on paroxetine for major depressive disorder reports new difficulty achieving an erection. What should the nurse practitioner recognize about this report?",
    options: [
      { id: "a", text: "Sexual dysfunction, including erectile difficulty, is a well-documented class effect of SSRIs" },
      { id: "b", text: "This symptom is unrelated to the medication and requires urology referral only" },
      { id: "c", text: "Paroxetine is known to improve sexual function" },
      { id: "d", text: "This symptom indicates the medication is not being absorbed" },
    ],
    correct: ["a"],
    rationale:
      "Sexual dysfunction, including delayed orgasm, decreased libido, and erectile difficulty, is one of the most common and persistent adverse effects across the SSRI class, thought to relate to serotonergic effects on dopamine and nitric oxide pathways involved in sexual response.",
    distractorRationales: {
      b: "While ruling out other causes has value, this presentation should first be recognized as a known SSRI effect rather than assumed unrelated.",
      c: "SSRIs are far more commonly associated with worsening, not improving, sexual function.",
      d: "Sexual dysfunction is a pharmacologic effect of the drug being present and active, not a sign of poor absorption.",
    },
    keyClue: "Any SSRI plus a new sexual side effect points to a class effect, not a coincidence.",
    clinicalTakeaway:
      "Persistent SSRI-related sexual dysfunction is a common reason patients discontinue therapy without telling their prescriber, so it should be asked about directly.",
    remediationConcept:
      "SSRIs commonly cause sexual dysfunction as a class effect through their serotonergic action. This should be proactively discussed, since patients may otherwise stop the medication silently.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["ssri", "adverse-effect", "sexual-dysfunction"],
  },
  {
    id: "p022",
    topic: "Serotonin syndrome",
    category: "CNS and psychiatric",
    difficulty: 4,
    type: "sata",
    stem:
      "A patient taking sertraline is started on tramadol for pain and develops agitation, hyperthermia, tremor, and hyperreflexia. Which findings support a diagnosis of serotonin syndrome? Select all that apply.",
    options: [
      { id: "a", text: "Hyperthermia" },
      { id: "b", text: "Hyperreflexia and clonus" },
      { id: "c", text: "Agitation and confusion" },
      { id: "d", text: "Bradycardia and hypotension" },
      { id: "e", text: "Diaphoresis and tremor" },
    ],
    correct: ["a", "b", "c", "e"],
    rationale:
      "Serotonin syndrome presents with a triad of autonomic instability (hyperthermia, diaphoresis, tachycardia), neuromuscular abnormalities (hyperreflexia, clonus, tremor), and altered mental status (agitation, confusion). It classically occurs when two serotonergic agents, such as an SSRI and tramadol, are combined.",
    distractorRationales: {
      d: "Serotonin syndrome typically causes tachycardia and hypertension, not bradycardia and hypotension, as part of its autonomic instability.",
    },
    keyClue: "SSRI plus tramadol (or another serotonergic drug) presenting with hyperthermia and neuromuscular findings is the classic serotonin syndrome setup.",
    clinicalTakeaway:
      "Tramadol, triptans, MAOIs, and St. John's wort all carry serotonergic activity and should be used cautiously, if at all, with SSRIs.",
    remediationConcept:
      "Serotonin syndrome combines autonomic instability, neuromuscular hyperactivity, and altered mental status, triggered by combining serotonergic agents. It typically causes tachycardia and hyperthermia, not bradycardia.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["serotonin-syndrome", "interaction", "priority-assessment"],
  },
  {
    id: "p023",
    topic: "Benzodiazepines",
    category: "CNS and psychiatric",
    difficulty: 3,
    type: "mcq",
    stem:
      "A patient who has taken lorazepam daily for six months for anxiety wants to stop it abruptly this week. What is the priority safety concern?",
    options: [
      { id: "a", text: "Abrupt discontinuation can precipitate withdrawal seizures" },
      { id: "b", text: "Stopping abruptly has no physiologic risk after long-term use" },
      { id: "c", text: "The medication should be doubled the day before stopping" },
      { id: "d", text: "Withdrawal only causes mild, self-limited nausea" },
    ],
    correct: ["a"],
    rationale:
      "Long-term benzodiazepine use produces physical dependence through GABA receptor adaptation. Abrupt discontinuation can precipitate a withdrawal syndrome that includes anxiety, tremor, autonomic instability, and in more severe cases, life-threatening seizures. A gradual, supervised taper is required.",
    distractorRationales: {
      b: "Physical dependence develops with chronic use, making abrupt discontinuation genuinely risky.",
      c: "Doubling the dose before stopping is not a safe or recognized tapering method.",
      d: "Withdrawal can progress well beyond mild nausea to seizures and autonomic crisis in significant cases.",
    },
    keyClue: "Long-term benzodiazepine use plus abrupt stop always raises the seizure-risk answer.",
    clinicalTakeaway:
      "Benzodiazepine tapers are typically extended over weeks to months depending on dose and duration of use, longer than most other medication tapers.",
    remediationConcept:
      "Chronic benzodiazepine use causes GABA receptor adaptation and physical dependence. Abrupt withdrawal can cause seizures, so a slow, supervised taper is required rather than stopping suddenly.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["benzodiazepine", "withdrawal", "seizure-risk"],
  },
  {
    id: "p024",
    topic: "Antipsychotics",
    category: "CNS and psychiatric",
    difficulty: 5,
    type: "mcq",
    stem:
      "A patient on haloperidol develops fever, muscle rigidity, altered mental status, and autonomic instability. Which condition should be suspected?",
    options: [
      { id: "a", text: "Neuroleptic malignant syndrome" },
      { id: "b", text: "A common, benign extrapyramidal side effect" },
      { id: "c", text: "Simple dehydration" },
      { id: "d", text: "An expected therapeutic response" },
    ],
    correct: ["a"],
    rationale:
      "Neuroleptic malignant syndrome is a rare but potentially fatal reaction to antipsychotic medications, especially first-generation agents like haloperidol. It presents with the classic tetrad of hyperthermia, severe muscle rigidity ('lead-pipe'), altered mental status, and autonomic instability, and requires immediate discontinuation of the antipsychotic and emergency management.",
    distractorRationales: {
      b: "This presentation is a medical emergency, not a benign or minor extrapyramidal symptom such as simple tremor.",
      c: "Dehydration alone does not explain the full tetrad of rigidity, fever, autonomic instability, and altered mentation.",
      d: "This is a dangerous adverse reaction requiring emergent intervention, not an expected or desired therapeutic effect.",
    },
    keyClue: "Fever plus rigidity plus altered mental status plus autonomic instability on an antipsychotic is neuroleptic malignant syndrome until proven otherwise.",
    clinicalTakeaway:
      "The antipsychotic must be stopped immediately and the patient managed in an acute care setting; supportive care and sometimes dantrolene or bromocriptine are used.",
    remediationConcept:
      "Neuroleptic malignant syndrome is an antipsychotic-induced emergency with hyperthermia, rigidity, altered mentation, and autonomic instability. Immediate drug discontinuation and emergency evaluation are required.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["antipsychotic", "neuroleptic-malignant-syndrome", "emergency"],
  },
  {
    id: "p025",
    topic: "Lithium",
    category: "CNS and psychiatric",
    difficulty: 4,
    type: "mcq",
    stem:
      "A patient stabilized on lithium for bipolar disorder starts a low-sodium diet and a thiazide diuretic for newly diagnosed hypertension. What is the priority concern?",
    options: [
      { id: "a", text: "Reduced sodium intake and thiazide use both increase lithium reabsorption, raising the risk of lithium toxicity" },
      { id: "b", text: "These changes have no effect on lithium levels" },
      { id: "c", text: "The thiazide diuretic will lower the lithium level" },
      { id: "d", text: "A low-sodium diet always increases lithium excretion" },
    ],
    correct: ["a"],
    rationale:
      "Lithium is handled by the kidney similarly to sodium; the body compensates for low sodium or thiazide-induced sodium loss by increasing proximal tubular reabsorption of both sodium and lithium. This raises serum lithium levels and the risk of toxicity, so lithium levels must be monitored closely whenever sodium intake or diuretic therapy changes.",
    distractorRationales: {
      b: "Both changes have well-documented, clinically significant effects on lithium clearance.",
      c: "Thiazide diuretics raise, not lower, lithium levels through this sodium-reabsorption mechanism.",
      d: "Low sodium intake decreases, rather than increases, lithium excretion because the kidney reabsorbs more of both ions together.",
    },
    keyClue: "Anything that lowers sodium (low-salt diet, thiazides, dehydration) raises lithium levels.",
    clinicalTakeaway:
      "Lithium levels should be rechecked whenever a patient's sodium intake, diuretic regimen, or hydration status changes significantly.",
    remediationConcept:
      "The kidney handles lithium similarly to sodium. Anything that reduces sodium, such as a low-salt diet or thiazide diuretics, increases lithium reabsorption and raises toxicity risk.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["lithium", "interaction", "toxicity"],
  },
  {
    id: "p026",
    topic: "Lithium",
    category: "CNS and psychiatric",
    difficulty: 3,
    type: "sata",
    stem:
      "Which findings are consistent with early lithium toxicity? Select all that apply.",
    options: [
      { id: "a", text: "Coarse hand tremor" },
      { id: "b", text: "Nausea and vomiting" },
      { id: "c", text: "Ataxia and slurred speech" },
      { id: "d", text: "Improved fine motor coordination" },
      { id: "e", text: "Confusion" },
    ],
    correct: ["a", "b", "c", "e"],
    rationale:
      "Early to moderate lithium toxicity presents with gastrointestinal symptoms (nausea, vomiting, diarrhea), a coarse tremor (as opposed to the fine tremor seen at therapeutic levels), ataxia, slurred speech, and confusion. Severe toxicity can progress to seizures, coma, and arrhythmia.",
    distractorRationales: {
      d: "Lithium toxicity impairs, rather than improves, coordination; ataxia and clumsiness are the expected finding.",
    },
    keyClue: "A shift from fine tremor to coarse tremor is a key sign that a patient has crossed from therapeutic to toxic lithium levels.",
    clinicalTakeaway:
      "Lithium levels should be drawn as a trough, just before the next dose, to accurately reflect steady-state concentration.",
    remediationConcept:
      "Lithium toxicity progresses from GI upset and coarse tremor to ataxia, confusion, and eventually seizures or coma. A fine tremor is expected at therapeutic levels; a coarse tremor signals toxicity.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["lithium", "toxicity", "assessment"],
  },
  {
    id: "p027",
    topic: "MAOIs",
    category: "CNS and psychiatric",
    difficulty: 4,
    type: "mcq",
    stem:
      "A patient taking phenelzine, a monoamine oxidase inhibitor, asks which food to avoid. Which item is correct?",
    options: [
      { id: "a", text: "Aged cheeses, which are high in tyramine" },
      { id: "b", text: "Bananas eaten in small amounts" },
      { id: "c", text: "Plain white rice" },
      { id: "d", text: "Fresh, unprocessed poultry" },
    ],
    correct: ["a"],
    rationale:
      "MAOIs prevent the breakdown of tyramine, a substance found in aged, fermented, or cured foods such as aged cheeses, cured meats, and some fermented soy products. Excess circulating tyramine triggers massive catecholamine release, causing a hypertensive crisis.",
    distractorRationales: {
      b: "Fresh bananas in small amounts contain relatively little tyramine and are not the primary food restricted with MAOIs; overripe or dried bananas carry more concern.",
      c: "Plain rice has no meaningful tyramine content and is not restricted.",
      d: "Fresh, unprocessed poultry is not high in tyramine; the concern is with aged, fermented, or cured foods.",
    },
    keyClue: "MAOIs plus \"aged\" or \"fermented\" foods always points to a tyramine hypertensive crisis risk.",
    clinicalTakeaway:
      "Patients starting or stopping an MAOI need dietary counseling that continues for about two weeks after discontinuation, since MAO enzyme regeneration takes that long.",
    remediationConcept:
      "MAOIs block tyramine breakdown. Tyramine-rich aged, fermented, or cured foods can then trigger a hypertensive crisis through unopposed catecholamine release.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["maoi", "tyramine", "hypertensive-crisis"],
  },
  {
    id: "p028",
    topic: "Anticonvulsants",
    category: "CNS and psychiatric",
    difficulty: 4,
    type: "mcq",
    stem:
      "A patient of childbearing age with epilepsy is being counseled about valproic acid before conception. What is the priority teaching point?",
    options: [
      { id: "a", text: "Valproic acid carries a significant risk of neural tube defects and should be avoided if possible during pregnancy" },
      { id: "b", text: "Valproic acid is the safest anticonvulsant to use during pregnancy" },
      { id: "c", text: "Pregnancy has no bearing on anticonvulsant choice" },
      { id: "d", text: "Folic acid supplementation is unnecessary with this medication" },
    ],
    correct: ["a"],
    rationale:
      "Valproic acid is strongly associated with neural tube defects and other congenital malformations when used during pregnancy, particularly in the first trimester. Whenever possible, an alternative anticonvulsant is used in patients of childbearing potential, and high-dose folic acid supplementation is recommended if valproic acid cannot be avoided.",
    distractorRationales: {
      b: "Valproic acid carries one of the higher teratogenic risks among anticonvulsants, not the lowest.",
      c: "Pregnancy status significantly changes anticonvulsant selection given valproic acid's teratogenic profile.",
      d: "Folic acid supplementation is specifically recommended to help offset neural tube defect risk in patients who must remain on this medication.",
    },
    keyClue: "Valproic acid plus childbearing potential should trigger a teratogenicity and folic acid discussion.",
    clinicalTakeaway:
      "Preconception counseling for patients on valproic acid should include a conversation about switching anticonvulsants when clinically feasible.",
    remediationConcept:
      "Valproic acid carries a high risk of neural tube defects in pregnancy. Preconception counseling should address alternative anticonvulsants and folic acid supplementation when the drug cannot be avoided.",
    pregnancyRelated: true,
    safetyPriority: true,
    tags: ["anticonvulsant", "pregnancy", "teratogenicity"],
  },
  {
    id: "p029",
    topic: "Tricyclic antidepressants",
    category: "CNS and psychiatric",
    difficulty: 4,
    type: "mcq",
    stem:
      "A patient who intentionally overdosed on amitriptyline is brought to the emergency department. Which finding is the priority concern?",
    options: [
      { id: "a", text: "Widened QRS complex on ECG" },
      { id: "b", text: "Mild drowsiness only" },
      { id: "c", text: "Dry mouth" },
      { id: "d", text: "Constipation" },
    ],
    correct: ["a"],
    rationale:
      "Tricyclic antidepressants have quinidine-like sodium channel blocking effects on cardiac tissue. In overdose, this causes QRS widening, which predicts ventricular arrhythmia and cardiovascular collapse. A widened QRS is the priority finding requiring immediate cardiac monitoring and treatment, such as sodium bicarbonate.",
    distractorRationales: {
      b: "Drowsiness can occur but is not the life-threatening finding that determines acuity in TCA overdose.",
      c: "Dry mouth is an expected anticholinergic effect at therapeutic doses, not the priority finding in overdose.",
      d: "Constipation is a common anticholinergic side effect, not the marker of cardiotoxicity in overdose.",
    },
    keyClue: "TCA overdose plus ECG changes should always point to QRS widening as the priority.",
    clinicalTakeaway:
      "Sodium bicarbonate is used in TCA overdose specifically to counteract sodium channel blockade and narrow the QRS complex.",
    remediationConcept:
      "TCAs block cardiac sodium channels. In overdose this widens the QRS complex and predicts arrhythmia, making ECG monitoring the priority over anticholinergic symptoms like dry mouth or constipation.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["tricyclic-antidepressant", "overdose", "cardiotoxicity"],
  },
  {
    id: "p030",
    topic: "Antipsychotics",
    category: "CNS and psychiatric",
    difficulty: 3,
    type: "mcq",
    stem:
      "A patient on long-term risperidone develops repetitive, involuntary lip-smacking and tongue movements. This finding is most consistent with:",
    options: [
      { id: "a", text: "Tardive dyskinesia" },
      { id: "b", text: "Acute dystonia" },
      { id: "c", text: "Akathisia" },
      { id: "d", text: "Parkinsonism" },
    ],
    correct: ["a"],
    rationale:
      "Tardive dyskinesia is a delayed-onset movement disorder from prolonged dopamine receptor blockade, characterized by repetitive, involuntary movements of the face, lips, and tongue, such as lip-smacking or tongue protrusion. It can become irreversible if not recognized and addressed promptly.",
    distractorRationales: {
      b: "Acute dystonia presents as sudden, sustained muscle spasms, often of the neck or eyes, occurring early in treatment, not the delayed orofacial movements described here.",
      c: "Akathisia is a subjective sense of inner restlessness with an inability to sit still, not repetitive facial movements.",
      d: "Drug-induced parkinsonism presents with bradykinesia, rigidity, and tremor, not orofacial dyskinetic movements.",
    },
    keyClue: "Repetitive lip-smacking or tongue movements after long-term antipsychotic use is the classic tardive dyskinesia presentation.",
    clinicalTakeaway:
      "Tardive dyskinesia can persist even after the antipsychotic is stopped, which is why regular screening with a standardized involuntary movement scale is recommended during long-term therapy.",
    remediationConcept:
      "Tardive dyskinesia is a delayed, potentially irreversible movement disorder from chronic dopamine blockade, distinct from the earlier-onset acute dystonia, akathisia, and parkinsonism seen with antipsychotics.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["antipsychotic", "tardive-dyskinesia", "movement-disorder"],
  },
];
