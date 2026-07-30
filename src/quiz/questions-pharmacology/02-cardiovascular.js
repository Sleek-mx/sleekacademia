// P11–20 — Cardiovascular pharmacology: nitrates, antihypertensives,
// anticoagulants, digoxin, and lipid-lowering therapy.
// Original items written for Sleek Academia. No commercial test-bank content.

export default [
  {
    id: "p011",
    topic: "Nitrate therapy",
    category: "Cardiovascular",
    difficulty: 3,
    type: "mcq",
    stem:
      "A patient on long-term transdermal nitroglycerin for angina asks why the patch is removed for 10 to 12 hours each day. What is the nurse's best explanation?",
    options: [
      { id: "a", text: "A nitrate-free interval prevents the development of tolerance to the medication" },
      { id: "b", text: "It reduces the total daily cost of the medication" },
      { id: "c", text: "It prevents the patch adhesive from irritating the skin" },
      { id: "d", text: "It allows the patient's blood pressure to rise overnight" },
    ],
    correct: ["a"],
    rationale:
      "Continuous nitrate exposure leads to tolerance, where the vascular smooth muscle stops responding to the drug's vasodilating effect. A daily nitrate-free interval of 10 to 12 hours allows sulfhydryl groups to regenerate, restoring the medication's effectiveness for the following dosing period.",
    distractorRationales: {
      b: "Cost is not the pharmacologic reason for the interval; tolerance prevention is.",
      c: "Skin irritation can occur with any patch, but rotating sites addresses that, not removing the medication daily.",
      d: "Raising blood pressure is not the goal; avoiding tolerance to the antianginal effect is.",
    },
    keyClue: "\"Nitrate-free interval\" is always the tolerance-prevention answer.",
    clinicalTakeaway:
      "Patients should be counseled to schedule the nitrate-free interval during a low-risk period, typically overnight, since anginal protection is reduced during the gap.",
    remediationConcept:
      "Continuous nitrate exposure causes tolerance because sulfhydryl groups needed for vasodilation become depleted. A daily nitrate-free interval restores drug effectiveness.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["nitrates", "tolerance", "angina"],
  },
  {
    id: "p012",
    topic: "Nitrate therapy",
    category: "Cardiovascular",
    difficulty: 5,
    type: "mcq",
    stem:
      "A patient taking sublingual nitroglycerin for chest pain also uses a medication for erectile dysfunction. Why is this combination dangerous?",
    options: [
      { id: "a", text: "Both medications cause vasodilation, and together they can cause severe, life-threatening hypotension" },
      { id: "b", text: "The combination causes hypertensive crisis" },
      { id: "c", text: "The combination has no significant interaction" },
      { id: "d", text: "The combination increases blood clotting risk" },
    ],
    correct: ["a"],
    rationale:
      "Phosphodiesterase type 5 inhibitors and nitrates both increase cyclic GMP-mediated vasodilation through the nitric oxide pathway. Combined, they produce profound, potentially fatal hypotension. This combination is absolutely contraindicated.",
    distractorRationales: {
      b: "The mechanism produces severe hypotension, not hypertension.",
      c: "This is one of the most well-documented and dangerous drug interactions in cardiovascular pharmacology.",
      d: "The danger is vasodilation and hypotension, not a change in clotting.",
    },
    keyClue: "Nitrates plus PDE5 inhibitors (like sildenafil) is a classic absolute contraindication question.",
    clinicalTakeaway:
      "Patients prescribed nitrates should always be screened for PDE5 inhibitor use, and vice versa, before either is started.",
    remediationConcept:
      "Nitrates and PDE5 inhibitors both potentiate nitric oxide-mediated vasodilation through cyclic GMP. Combined, the additive effect can cause profound hypotension, so the combination is contraindicated.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["nitrates", "interaction", "contraindication"],
  },
  {
    id: "p013",
    topic: "ACE inhibitors",
    category: "Cardiovascular",
    difficulty: 3,
    type: "mcq",
    stem:
      "A patient newly started on lisinopril develops a persistent dry cough. What is the most likely explanation?",
    options: [
      { id: "a", text: "ACE inhibitors reduce bradykinin breakdown, and accumulated bradykinin can irritate the airway" },
      { id: "b", text: "The patient has developed a viral upper respiratory infection unrelated to the medication" },
      { id: "c", text: "Lisinopril directly damages lung tissue" },
      { id: "d", text: "The cough indicates the medication is not being absorbed" },
    ],
    correct: ["a"],
    rationale:
      "ACE inhibitors block the enzyme that both converts angiotensin I to angiotensin II and normally degrades bradykinin. The resulting bradykinin accumulation is thought to irritate airway tissue, producing the characteristic dry, persistent cough seen in up to 20% of patients.",
    distractorRationales: {
      b: "While possible, a persistent dry cough beginning after starting an ACE inhibitor should first be attributed to the medication given how common this effect is.",
      c: "ACE inhibitors do not cause direct structural lung damage; the mechanism is bradykinin-mediated irritation.",
      d: "A cough is not a marker of drug absorption; it is a class-specific adverse effect.",
    },
    keyClue: "Dry cough plus an \"-april\" drug name points to ACE inhibitor bradykinin accumulation.",
    clinicalTakeaway:
      "Patients who cannot tolerate an ACE inhibitor cough are typically switched to an angiotensin receptor blocker, which does not affect bradykinin.",
    remediationConcept:
      "ACE inhibitors block angiotensin-converting enzyme, which also normally breaks down bradykinin. Bradykinin buildup causes the characteristic dry cough and contributes to angioedema risk.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["ace-inhibitor", "adverse-effect", "bradykinin"],
  },
  {
    id: "p014",
    topic: "ACE inhibitors",
    category: "Cardiovascular",
    difficulty: 4,
    type: "mcq",
    stem:
      "A patient of childbearing age is prescribed an ACE inhibitor for hypertension. What teaching is most important?",
    options: [
      { id: "a", text: "The medication must be discontinued immediately if pregnancy occurs, as it can cause fetal renal damage" },
      { id: "b", text: "The medication is completely safe throughout pregnancy" },
      { id: "c", text: "The medication should only be taken during the first trimester" },
      { id: "d", text: "Pregnancy has no bearing on this medication choice" },
    ],
    correct: ["a"],
    rationale:
      "ACE inhibitors are associated with fetal renal damage, oligohydramnios, and skull ossification defects, especially in the second and third trimesters. Patients of childbearing potential need contraception counseling or a switch to a pregnancy-safer antihypertensive before conception.",
    distractorRationales: {
      b: "ACE inhibitors are contraindicated in pregnancy due to well-documented fetotoxic effects, not safe.",
      c: "The greatest risk is in the second and third trimesters, not limited to the first; the drug is generally avoided throughout pregnancy when possible.",
      d: "Pregnancy status is directly relevant, since this class carries significant teratogenic risk.",
    },
    keyClue: "ACE inhibitors and ARBs are both pregnancy-category drugs to avoid due to fetal renal effects.",
    clinicalTakeaway:
      "Labetalol, nifedipine, and methyldopa are commonly used pregnancy-safer alternatives for hypertension management.",
    remediationConcept:
      "ACE inhibitors cause fetal renal injury and oligohydramnios, particularly later in pregnancy. Anyone of childbearing potential on this class needs contraception counseling or a proactive medication switch before conception.",
    pregnancyRelated: true,
    safetyPriority: true,
    tags: ["ace-inhibitor", "pregnancy", "teratogenicity"],
  },
  {
    id: "p015",
    topic: "Beta blockers",
    category: "Cardiovascular",
    difficulty: 3,
    type: "mcq",
    stem:
      "A patient with asthma and hypertension is being evaluated for a beta blocker. Which consideration is most important?",
    options: [
      { id: "a", text: "Nonselective beta blockers can trigger bronchospasm by blocking beta-2 receptors in the lungs" },
      { id: "b", text: "Beta blockers have no effect on the pulmonary system" },
      { id: "c", text: "All beta blockers are absolutely contraindicated in every patient with any respiratory disease" },
      { id: "d", text: "Beta blockers should be paired with a short-acting bronchodilator automatically" },
    ],
    correct: ["a"],
    rationale:
      "Nonselective beta blockers (such as propranolol) block both beta-1 (cardiac) and beta-2 (bronchial and vascular smooth muscle) receptors. Blocking beta-2 receptors in the airway can precipitate bronchospasm in patients with reactive airway disease, so cardioselective agents are generally preferred if a beta blocker is needed.",
    distractorRationales: {
      b: "Beta-2 receptor blockade directly affects bronchial smooth muscle tone.",
      c: "Cardioselective beta-1 blockers (such as metoprolol) can often be used cautiously in stable asthma; an absolute blanket contraindication is not accurate for the whole class.",
      d: "Adding a bronchodilator does not address the underlying receptor-selectivity concern and is not a routine automatic pairing.",
    },
    keyClue: "Nonselective beta blockade plus asthma is the classic bronchospasm-risk pairing.",
    clinicalTakeaway:
      "When a beta blocker is truly necessary in a patient with reactive airway disease, a cardioselective agent is chosen and the patient is monitored closely for respiratory symptoms.",
    remediationConcept:
      "Nonselective beta blockers affect both beta-1 and beta-2 receptors, and beta-2 blockade in the airway risks bronchospasm. Cardioselective beta-1 blockers carry less of this risk.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["beta-blocker", "asthma", "receptor-selectivity"],
  },
  {
    id: "p016",
    topic: "Beta blockers",
    category: "Cardiovascular",
    difficulty: 4,
    type: "mcq",
    stem:
      "A patient who has taken metoprolol for two years wants to stop it because they feel fine. What is the priority teaching?",
    options: [
      { id: "a", text: "Beta blockers must be tapered gradually to avoid rebound tachycardia and hypertension" },
      { id: "b", text: "The medication can be stopped abruptly at any time without concern" },
      { id: "c", text: "Stopping the medication will have no cardiovascular effect" },
      { id: "d", text: "The medication should be doubled before stopping" },
    ],
    correct: ["a"],
    rationale:
      "Abrupt beta blocker discontinuation can cause a rebound phenomenon: upregulated beta receptors, unmasked during withdrawal, respond excessively to circulating catecholamines, producing rebound tachycardia, hypertension, and in patients with coronary disease, potentially myocardial ischemia or infarction. A gradual taper over one to two weeks under prescriber guidance is required.",
    distractorRationales: {
      b: "Abrupt discontinuation carries real risk of rebound cardiovascular events and should never be done without a taper plan.",
      c: "Stopping abruptly has a well-documented rebound cardiovascular effect.",
      d: "Doubling the dose before stopping is not a recognized or safe discontinuation strategy.",
    },
    keyClue: "Any question about stopping a beta blocker should trigger the taper-to-avoid-rebound answer.",
    clinicalTakeaway:
      "Patients should be taught never to stop a beta blocker on their own and to contact the prescriber to arrange a supervised taper.",
    remediationConcept:
      "Chronic beta blockade upregulates beta receptor density. Abrupt withdrawal exposes these extra receptors to catecholamines, causing rebound tachycardia and hypertension, so tapering is required.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["beta-blocker", "discontinuation", "rebound"],
  },
  {
    id: "p017",
    topic: "Calcium channel blockers",
    category: "Cardiovascular",
    difficulty: 3,
    type: "mcq",
    stem:
      "A patient prescribed a non-dihydropyridine calcium channel blocker such as verapamil for rate control should avoid which food or beverage due to a significant interaction?",
    options: [
      { id: "a", text: "Grapefruit juice" },
      { id: "b", text: "Leafy green vegetables" },
      { id: "c", text: "Dairy products" },
      { id: "d", text: "Caffeinated coffee" },
    ],
    correct: ["a"],
    rationale:
      "Grapefruit juice inhibits intestinal CYP3A4 metabolism of calcium channel blockers, increasing systemic drug levels and the risk of hypotension, bradycardia, and other toxicity. Patients on calcium channel blockers are counseled to avoid grapefruit products.",
    distractorRationales: {
      b: "Leafy greens are relevant to warfarin due to vitamin K content, not to calcium channel blockers.",
      c: "Dairy products interact with medications like tetracyclines and fluoroquinolones through calcium chelation, not with calcium channel blockers.",
      d: "Caffeine is not a documented major interaction with this drug class.",
    },
    keyClue: "Grapefruit juice and CYP3A4 inhibition is a recurring interaction theme across several drug classes.",
    clinicalTakeaway:
      "The grapefruit-CYP3A4 interaction also applies to statins and some benzodiazepines, so it is worth screening for broadly.",
    remediationConcept:
      "Grapefruit juice inhibits intestinal CYP3A4, raising blood levels of drugs metabolized by that enzyme, including calcium channel blockers and several statins.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["calcium-channel-blocker", "interaction", "cyp3a4"],
  },
  {
    id: "p018",
    topic: "Digoxin",
    category: "Cardiovascular",
    difficulty: 4,
    type: "mcq",
    stem:
      "A patient on digoxin reports nausea, visual halos around lights, and a new irregular heartbeat. Which lab value is the priority to check?",
    options: [
      { id: "a", text: "Serum digoxin level and serum potassium" },
      { id: "b", text: "Serum glucose" },
      { id: "c", text: "Serum calcium only" },
      { id: "d", text: "Liver function tests only" },
    ],
    correct: ["a"],
    rationale:
      "Nausea, visual disturbances (classically yellow-green halos), and arrhythmia are hallmark signs of digoxin toxicity. Because hypokalemia potentiates digoxin's effect at the cellular level, both the digoxin level and serum potassium must be checked together to guide safe management.",
    distractorRationales: {
      b: "Glucose is not directly related to digoxin toxicity presentation.",
      c: "Calcium can influence digoxin toxicity risk, but potassium is the more directly linked and higher-priority electrolyte in this presentation.",
      d: "Digoxin is renally, not hepatically, cleared, so renal function is more relevant than liver function here.",
    },
    keyClue: "Visual halos plus GI symptoms plus arrhythmia is the classic digoxin toxicity triad.",
    clinicalTakeaway:
      "Hypokalemia, hypomagnesemia, and renal impairment all increase the risk of digoxin toxicity even at a \"normal\" dose.",
    remediationConcept:
      "Digoxin toxicity presents with GI upset, visual disturbances, and arrhythmia. Because low potassium worsens digoxin's binding and effect, checking both digoxin level and potassium together is essential.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["digoxin", "toxicity", "electrolytes"],
  },
  {
    id: "p019",
    topic: "Anticoagulation",
    category: "Cardiovascular",
    difficulty: 3,
    type: "mcq",
    stem:
      "A patient stabilized on warfarin asks why their dose was just decreased after starting a course of an antibiotic. What is the most likely explanation?",
    options: [
      { id: "a", text: "The antibiotic reduced vitamin K-producing gut flora, increasing warfarin's anticoagulant effect" },
      { id: "b", text: "The antibiotic has no interaction with warfarin" },
      { id: "c", text: "The antibiotic decreased warfarin absorption" },
      { id: "d", text: "The antibiotic increased vitamin K levels, reducing warfarin's effect" },
    ],
    correct: ["a"],
    rationale:
      "Many broad-spectrum antibiotics suppress gut flora that normally synthesize vitamin K. With less vitamin K available, warfarin's inhibition of vitamin K-dependent clotting factors becomes relatively stronger, raising the INR and bleeding risk, which is why a dose reduction and closer INR monitoring are needed.",
    distractorRationales: {
      b: "Antibiotic-warfarin interactions are common and clinically significant, particularly with broad-spectrum agents.",
      c: "The mechanism is vitamin K suppression via gut flora disruption, not reduced absorption of warfarin itself.",
      d: "The interaction reduces, not increases, vitamin K availability, which strengthens rather than weakens warfarin's effect.",
    },
    keyClue: "Antibiotics plus warfarin dose changes should trigger the gut-flora, vitamin K reasoning.",
    clinicalTakeaway:
      "INR should be checked more frequently whenever a warfarin patient starts or stops any antibiotic course.",
    remediationConcept:
      "Warfarin blocks vitamin K-dependent clotting factor synthesis. Antibiotics that suppress vitamin K-producing gut flora amplify this effect, raising INR and bleeding risk.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["anticoagulation", "warfarin", "interaction"],
  },
  {
    id: "p020",
    topic: "Statins",
    category: "Cardiovascular",
    difficulty: 3,
    type: "mcq",
    stem:
      "A patient started on atorvastatin reports new, unexplained muscle pain and dark urine. What is the priority concern?",
    options: [
      { id: "a", text: "Rhabdomyolysis, which requires prompt evaluation of creatine kinase and renal function" },
      { id: "b", text: "A normal, expected side effect requiring no follow-up" },
      { id: "c", text: "Dehydration unrelated to the medication" },
      { id: "d", text: "An allergic skin reaction" },
    ],
    correct: ["a"],
    rationale:
      "Muscle pain combined with dark urine raises concern for statin-induced rhabdomyolysis, a rare but serious adverse effect in which muscle breakdown releases myoglobin that can cause acute kidney injury. Creatine kinase and renal function should be checked promptly, and the statin held pending results.",
    distractorRationales: {
      b: "Muscle pain with dark urine is not a benign expected effect; it needs urgent evaluation.",
      c: "While dehydration can contribute to muscle symptoms, the combination described here specifically points to rhabdomyolysis risk from the statin.",
      d: "Dark urine and muscle pain are not characteristic of an allergic skin reaction.",
    },
    keyClue: "Muscle pain plus dark or cola-colored urine on a statin is the classic rhabdomyolysis pairing.",
    clinicalTakeaway:
      "Statins are typically held and creatine kinase checked whenever a patient reports significant new myalgia, especially if urine changes color.",
    remediationConcept:
      "Statin-associated rhabdomyolysis causes muscle breakdown that releases myoglobin, which can injure the kidneys and darken urine. Muscle pain plus dark urine on a statin warrants prompt creatine kinase and renal testing.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["statin", "rhabdomyolysis", "adverse-effect"],
  },
];
