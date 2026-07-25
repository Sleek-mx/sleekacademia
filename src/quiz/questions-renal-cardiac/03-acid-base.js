// R21–30 — Acid-base disorders, anion gap, compensation, arterial blood gas reasoning.
// Original items written for Sleek Academia. No commercial test-bank content.

export default [
  {
    id: "r021",
    conceptKey: "abg-systematic-interpretation",
    topic: "Acid-base interpretation",
    category: "Acid-base balance",
    difficulty: 3,
    type: "mcq",
    stem: "An arterial blood gas shows pH 7.28, PaCO2 32 mm Hg, and bicarbonate 15 mEq/L. How is this best classified?",
    options: [
      { id: "a", text: "Metabolic acidosis with respiratory compensation" },
      { id: "b", text: "Respiratory acidosis with metabolic compensation" },
      { id: "c", text: "Metabolic alkalosis with respiratory compensation" },
      { id: "d", text: "A combined respiratory and metabolic alkalosis" },
    ],
    correct: ["a"],
    rationale:
      "The pH is acidotic, so the primary disorder is whichever value moves in the same direction. Bicarbonate is low, which is acidotic and therefore primary. The low PaCO2 is alkalotic and moves the opposite way, so it represents compensation: the lungs are blowing off carbon dioxide to limit the fall in pH.",
    distractorRationales: {
      b: "In respiratory acidosis the PaCO2 would be elevated rather than low, and bicarbonate would rise as compensation.",
      c: "Metabolic alkalosis would show a raised pH and a raised bicarbonate, neither of which is present.",
      d: "An alkalosis of any kind would raise the pH above the reference range rather than lowering it to 7.28.",
    },
    keyClue: "The value that moves in the same direction as the pH is the primary problem; the other one is compensating.",
    clinicalTakeaway:
      "Respiratory compensation is fast, so a low PaCO2 in metabolic acidosis is expected and reassuring; a normal or rising PaCO2 suggests the patient is tiring.",
    remediationConcept:
      "Interpret gases in a fixed order: read the pH, then decide which of bicarbonate or PaCO2 moves in that same direction to identify the primary disorder. The other value moving oppositely is compensation. Compensation limits the pH change but does not overshoot it.",
    safetyPriority: false,
    tags: ["abg", "acidosis", "compensation", "lab"],
  },
  {
    id: "r022",
    topic: "Metabolic acidosis",
    category: "Acid-base balance",
    difficulty: 4,
    type: "mcq",
    stem: "Which finding distinguishes a high anion gap metabolic acidosis from a normal anion gap acidosis?",
    options: [
      { id: "a", text: "Accumulation of an unmeasured acid rather than loss of bicarbonate" },
      { id: "b", text: "A lower serum bicarbonate concentration in every case" },
      { id: "c", text: "The presence of respiratory compensation" },
      { id: "d", text: "A higher serum chloride concentration" },
    ],
    correct: ["a"],
    rationale:
      "The anion gap estimates unmeasured anions. When acid is added — lactate, ketoacids, or retained uraemic anions — bicarbonate is consumed buffering it and the unmeasured anion takes its place, so the gap widens. When bicarbonate is instead lost directly through the gut or kidney, chloride is retained to preserve electroneutrality and the gap stays normal.",
    distractorRationales: {
      b: "Bicarbonate is low in both types; its level indicates severity rather than mechanism.",
      c: "Respiratory compensation occurs in both types and therefore cannot distinguish them.",
      d: "A higher chloride is characteristic of the normal gap type, so this points to the opposite classification.",
    },
    keyClue: "Added acid widens the gap; lost bicarbonate is replaced by chloride and keeps it normal.",
    clinicalTakeaway:
      "Because the gap separates acid gain from bicarbonate loss, calculating it narrows the differential before any further testing is ordered.",
    remediationConcept:
      "Metabolic acidosis arises either from adding acid or from losing bicarbonate. Added acid brings an unmeasured anion and widens the gap; lost bicarbonate is replaced by chloride and leaves the gap normal. Calculate the gap first, then work through the causes for that category.",
    safetyPriority: false,
    tags: ["anion-gap", "acidosis", "lab", "chloride"],
  },
  {
    id: "r023",
    topic: "Metabolic acidosis",
    category: "Acid-base balance",
    difficulty: 3,
    type: "mcq",
    stem: "Why does advanced kidney disease produce a metabolic acidosis?",
    options: [
      { id: "a", text: "The kidney cannot excrete the daily acid load or regenerate bicarbonate" },
      { id: "b", text: "The kidney excretes excessive bicarbonate into the urine" },
      { id: "c", text: "Reduced carbon dioxide clearance raises carbonic acid" },
      { id: "d", text: "Excess lactate is produced by underperfused renal tissue" },
    ],
    correct: ["a"],
    rationale:
      "Normal metabolism generates a fixed acid load daily that only the kidney can eliminate. The tubules excrete hydrogen ions buffered by ammonia and phosphate while regenerating bicarbonate. As functioning tubular mass falls, both capacities decline, so acid accumulates and bicarbonate falls, initially with a normal and later with a raised anion gap.",
    distractorRationales: {
      b: "Bicarbonate wasting describes proximal renal tubular acidosis, a specific tubular defect rather than the mechanism in advanced kidney disease.",
      c: "Impaired carbon dioxide clearance is a respiratory problem and would produce a respiratory acidosis.",
      d: "Lactate accumulation reflects tissue hypoperfusion and is not the mechanism of the chronic acidosis of kidney disease.",
    },
    keyClue: "Only the kidney clears fixed acid; only the lung clears carbon dioxide.",
    clinicalTakeaway:
      "Chronic acidosis in kidney disease accelerates bone demineralisation and muscle catabolism, which is why bicarbonate is monitored and supplemented rather than ignored.",
    remediationConcept:
      "The lung clears volatile acid as carbon dioxide; the kidney clears the daily fixed acid load and regenerates bicarbonate. Losing renal mass therefore causes a metabolic acidosis. Match the failing organ to the type of acid it was responsible for clearing.",
    safetyPriority: false,
    tags: ["acidosis", "ckd-link", "bicarbonate", "lab"],
  },
  {
    id: "r024",
    conceptKey: "compensation-never-fully-corrects",
    topic: "Acid-base interpretation",
    category: "Acid-base balance",
    difficulty: 5,
    type: "mcq",
    stem: "An arterial blood gas shows pH 7.42, PaCO2 26 mm Hg, and bicarbonate 17 mEq/L. Which interpretation is most accurate?",
    options: [
      { id: "a", text: "A mixed disorder, since compensation alone would not return the pH to normal" },
      { id: "b", text: "A fully compensated metabolic acidosis" },
      { id: "c", text: "A fully compensated respiratory alkalosis" },
      { id: "d", text: "A normal result requiring no further interpretation" },
    ],
    correct: ["a"],
    rationale:
      "Both bicarbonate and PaCO2 are substantially abnormal yet the pH sits in the middle of the reference range. Compensation reduces a pH deviation but does not fully correct it, so a normal pH with two markedly deranged values indicates two primary processes — here a metabolic acidosis together with a respiratory alkalosis.",
    distractorRationales: {
      b: "Compensation for metabolic acidosis would leave the pH still slightly below the reference range rather than mid-normal.",
      c: "Compensation for respiratory alkalosis is renal and slow, and it too would leave a residual pH deviation.",
      d: "The pH is normal but the bicarbonate and PaCO2 are not, so the result carries important information rather than none.",
    },
    keyClue: "A normal pH with two badly abnormal values means two processes, not perfect compensation.",
    clinicalTakeaway:
      "Recognising a mixed picture matters because each process may have a different cause, and treating only one can unmask the other.",
    remediationConcept:
      "Compensation blunts a pH change but never fully normalises it. A normal pH alongside markedly abnormal bicarbonate and PaCO2 therefore signals a mixed disorder. Always check whether the degree of compensation is physiologically plausible before calling a gas compensated.",
    safetyPriority: false,
    tags: ["abg", "mixed-disorder", "compensation", "lab"],
  },
  {
    id: "r025",
    topic: "Metabolic alkalosis",
    category: "Acid-base balance",
    difficulty: 3,
    type: "mcq",
    stem: "Which mechanism explains the metabolic alkalosis that accompanies prolonged vomiting?",
    options: [
      { id: "a", text: "Loss of gastric hydrogen and chloride with volume-driven bicarbonate retention" },
      { id: "b", text: "Loss of intestinal bicarbonate leading to chloride retention" },
      { id: "c", text: "Reduced ventilation raising serum bicarbonate" },
      { id: "d", text: "Increased renal ammonium excretion consuming hydrogen ions" },
    ],
    correct: ["a"],
    rationale:
      "Gastric fluid is rich in hydrogen and chloride, so vomiting removes acid directly and raises bicarbonate. The accompanying volume depletion then sustains the alkalosis: aldosterone rises, sodium is reabsorbed in exchange for hydrogen and potassium, and the low chloride limits the kidney's ability to excrete the excess bicarbonate.",
    distractorRationales: {
      b: "Loss of intestinal bicarbonate occurs with diarrhoea and produces a normal anion gap acidosis, the opposite disturbance.",
      c: "Reduced ventilation raises PaCO2 and causes a respiratory acidosis rather than a metabolic alkalosis.",
      d: "Increased ammonium excretion is a response to acidosis, in which the kidney disposes of hydrogen ions.",
    },
    keyClue: "Vomiting loses acid from above and causes alkalosis; diarrhoea loses bicarbonate from below and causes acidosis.",
    clinicalTakeaway:
      "This alkalosis is chloride-responsive, so correcting the volume and chloride deficit lets the kidney excrete the retained bicarbonate.",
    remediationConcept:
      "Upper gastrointestinal losses remove hydrogen and chloride and cause metabolic alkalosis; lower losses remove bicarbonate and cause metabolic acidosis. Volume depletion perpetuates the alkalosis by driving aldosterone and limiting chloride availability. Locate the loss anatomically and the disorder follows.",
    safetyPriority: false,
    tags: ["alkalosis", "chloride", "volume", "lab"],
  },
  {
    id: "r026",
    topic: "Respiratory acid-base",
    category: "Acid-base balance",
    difficulty: 3,
    type: "mcq",
    stem: "A patient with an acute asthma exacerbation initially has a PaCO2 of 28 mm Hg, which rises to 44 mm Hg over two hours. How should this change be interpreted?",
    options: [
      { id: "a", text: "As a warning sign of respiratory muscle fatigue despite a value inside the reference range" },
      { id: "b", text: "As evidence that the exacerbation is resolving appropriately" },
      { id: "c", text: "As expected renal compensation for the earlier alkalosis" },
      { id: "d", text: "As a laboratory error, since the value is now normal" },
    ],
    correct: ["a"],
    rationale:
      "Early in a severe exacerbation, tachypnoea drives PaCO2 down, so a low value is expected. A rise toward the reference range means minute ventilation is falling while airway obstruction persists — the patient is tiring. A normalising PaCO2 in this context signals impending respiratory failure rather than recovery.",
    distractorRationales: {
      b: "Resolution would be accompanied by improved air movement and work of breathing, not by rising carbon dioxide with continued obstruction.",
      c: "Renal compensation adjusts bicarbonate over days and does not raise PaCO2 within hours.",
      d: "The value is genuine; interpreting it requires the clinical context rather than comparison with the reference range alone.",
    },
    keyClue: "In severe asthma, a normal PaCO2 is an ominous value, not a reassuring one.",
    clinicalTakeaway:
      "A rising PaCO2 with continued obstruction warrants urgent evaluation for ventilatory support rather than continued observation.",
    remediationConcept:
      "Interpret every value against what the situation demands, not only against the reference range. Severe airway obstruction should drive PaCO2 down, so a normalising value means ventilation is failing. Trend plus context beats a single number.",
    safetyPriority: true,
    tags: ["abg", "respiratory", "priority", "lab"],
  },
  {
    id: "r027",
    topic: "Metabolic acidosis",
    category: "Acid-base balance",
    difficulty: 4,
    type: "mcq",
    stem: "Which laboratory pattern would be expected in distal renal tubular acidosis?",
    options: [
      { id: "a", text: "Normal anion gap acidosis with hypokalaemia and inappropriately alkaline urine" },
      { id: "b", text: "High anion gap acidosis with hyperkalaemia and maximally acid urine" },
      { id: "c", text: "Metabolic alkalosis with hypokalaemia and alkaline urine" },
      { id: "d", text: "Normal anion gap acidosis with hyperkalaemia and acid urine" },
    ],
    correct: ["a"],
    rationale:
      "In the distal form, the collecting duct cannot secrete hydrogen ions, so urine cannot be acidified even when the patient is systemically acidotic. Bicarbonate is lost rather than acid gained, so the gap stays normal, and the impaired hydrogen secretion is accompanied by potassium wasting.",
    distractorRationales: {
      b: "A high gap with maximally acid urine indicates added acid being appropriately excreted, which is the opposite of a distal secretory defect.",
      c: "This condition causes acidosis rather than alkalosis, so a raised pH does not fit.",
      d: "Hyperkalaemia with acid urine fits type 4 renal tubular acidosis from aldosterone deficiency rather than the distal secretory defect.",
    },
    keyClue: "Alkaline urine during systemic acidosis means the kidney cannot acidify — a distal defect.",
    clinicalTakeaway:
      "Persistently alkaline urine with hypokalaemia predisposes to calcium phosphate stones, which is why stone history is relevant to this diagnosis.",
    remediationConcept:
      "In renal tubular acidosis the gap stays normal because bicarbonate is lost rather than acid gained. Use urine pH and potassium to subtype: alkaline urine with low potassium is distal, while high potassium with acid urine suggests aldosterone deficiency. Ask whether the kidney can acidify the urine when it must.",
    safetyPriority: false,
    tags: ["rta", "acidosis", "anion-gap", "potassium", "lab"],
  },
  {
    id: "r028",
    conceptKey: "compensation-never-fully-corrects",
    topic: "Acid-base interpretation",
    category: "Acid-base balance",
    difficulty: 4,
    type: "mcq",
    stem: "A nursing student states that respiratory compensation for a metabolic acidosis will always return the pH fully to normal. Which response requires correction?",
    options: [
      { id: "a", text: "Compensation always normalises the pH completely" },
      { id: "b", text: "Compensation reduces but does not eliminate the pH deviation" },
      { id: "c", text: "Respiratory compensation begins within minutes of the acidosis" },
      { id: "d", text: "Renal compensation for a respiratory disorder takes days to develop" },
    ],
    correct: ["a"],
    rationale:
      "Compensation is a limiting response, not a corrective one. Chemoreceptors are driven by the pH deviation itself, so complete normalisation would remove the stimulus that sustains the response. A fully normal pH alongside markedly abnormal values therefore indicates a mixed disorder rather than successful compensation.",
    distractorRationales: {
      b: "This statement is accurate: compensation blunts the pH change without abolishing it, so it needs no correction.",
      c: "This is accurate. Chemoreceptor-driven changes in minute ventilation begin within minutes.",
      d: "This is accurate. Renal compensation requires two to five days to develop fully.",
    },
    keyClue: "Compensation is driven by the residual pH deviation, so it cannot erase it.",
    clinicalTakeaway:
      "Treating a compensated gas as though it were resolved risks missing the underlying disorder, which is still fully present.",
    remediationConcept:
      "Compensation limits a pH change but never fully corrects it, because the deviation is the stimulus that drives it. Respiratory compensation is quick and renal compensation is slow. A normal pH with grossly abnormal values means two processes, not one well-compensated process.",
    safetyPriority: false,
    tags: ["abg", "compensation", "negative-polarity", "lab"],
  },
  {
    id: "r029",
    topic: "Metabolic acidosis",
    category: "Acid-base balance",
    difficulty: 4,
    type: "mcq",
    stem: "A patient in shock has a lactate of 6.2 mmol/L and a widened anion gap. Which mechanism explains the lactate elevation?",
    options: [
      { id: "a", text: "Anaerobic glycolysis when oxygen delivery fails to meet tissue demand" },
      { id: "b", text: "Reduced hepatic lactate production during hypoperfusion" },
      { id: "c", text: "Renal retention of lactate as filtration falls" },
      { id: "d", text: "Increased lactate binding to albumin in the circulation" },
    ],
    correct: ["a"],
    rationale:
      "When oxygen delivery is inadequate, cells cannot complete oxidative phosphorylation and pyruvate is diverted to lactate to regenerate the cofactors glycolysis needs. Lactate therefore serves as a marker of the adequacy of oxygen delivery relative to demand, and rising values indicate worsening tissue perfusion.",
    distractorRationales: {
      b: "The liver clears lactate rather than producing it in this setting, and impaired hepatic clearance would add to the level rather than reduce it.",
      c: "Renal retention is not the mechanism; lactate accumulates because production outstrips clearance during hypoperfusion.",
      d: "Lactate circulates freely rather than being protein-bound, so binding does not explain the measured rise.",
    },
    keyClue: "Lactate is a perfusion marker: it rises when oxygen delivery cannot meet demand.",
    clinicalTakeaway:
      "Serial lactate measurement tracks whether resuscitation is restoring perfusion, which is why clearance over hours is followed rather than a single value.",
    remediationConcept:
      "Lactate accumulates when oxygen delivery fails to meet tissue demand and cells switch to anaerobic metabolism. It is a marker of perfusion adequacy rather than a primary disease. Falling lactate indicates improving perfusion; a persistent rise indicates the opposite.",
    safetyPriority: true,
    tags: ["lactate", "anion-gap", "perfusion", "shock-link", "priority"],
  },
  {
    id: "r030",
    conceptKey: "abg-systematic-interpretation",
    topic: "Respiratory acid-base",
    category: "Acid-base balance",
    difficulty: 3,
    type: "mcq",
    stem: "A patient with chronic obstructive pulmonary disease has pH 7.36, PaCO2 62 mm Hg, and bicarbonate 34 mEq/L. What does this pattern indicate?",
    options: [
      { id: "a", text: "A chronic respiratory acidosis with established renal compensation" },
      { id: "b", text: "An acute respiratory acidosis without time for compensation" },
      { id: "c", text: "A primary metabolic alkalosis with respiratory compensation" },
      { id: "d", text: "A mixed respiratory and metabolic acidosis" },
    ],
    correct: ["a"],
    rationale:
      "The PaCO2 is markedly raised yet the pH is only slightly below the reference range, and bicarbonate is substantially elevated. That degree of bicarbonate retention takes days to develop, so it indicates a chronic process in which the kidney has had time to compensate by retaining bicarbonate and excreting acid.",
    distractorRationales: {
      b: "In an acute rise, bicarbonate would still be near normal and the pH would be considerably lower than 7.36.",
      c: "A primary metabolic alkalosis would raise the pH above the reference range rather than leaving it slightly acidotic.",
      d: "A second acidotic process would drive the pH lower; the raised bicarbonate here is compensatory rather than a separate disorder.",
    },
    keyClue: "A large PaCO2 rise with only a small pH change means compensation has had days to develop.",
    clinicalTakeaway:
      "Recognising chronic retention matters because these patients depend on their hypoxic drive, so oxygen is titrated to a target saturation rather than given at a high fixed flow.",
    remediationConcept:
      "Judge acuity from how far the pH has moved relative to the PaCO2. A large carbon dioxide rise with a nearly normal pH and a high bicarbonate indicates chronic compensation, whereas the same PaCO2 with a low pH and normal bicarbonate is acute. Renal compensation takes days, so bicarbonate reports elapsed time.",
    safetyPriority: false,
    tags: ["abg", "respiratory", "compensation", "copd", "lab"],
  },
];
