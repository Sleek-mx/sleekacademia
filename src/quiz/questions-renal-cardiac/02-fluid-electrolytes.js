// R11–20 — Sodium and water disorders, potassium, calcium and phosphate, volume status.
// Original items written for Sleek Academia. No commercial test-bank content.

export default [
  {
    id: "r011",
    conceptKey: "serum-sodium-reports-water-balance",
    topic: "Sodium and water disorders",
    category: "Fluid and electrolyte balance",
    difficulty: 3,
    type: "mcq",
    stem: "A patient has a serum sodium of 122 mEq/L, urine osmolality of 620 mOsm/kg, and clinically normal volume status. Which mechanism best explains these findings?",
    options: [
      { id: "a", text: "Inappropriate antidiuretic hormone secretion retaining free water" },
      { id: "b", text: "Aldosterone deficiency causing renal sodium wasting" },
      { id: "c", text: "Osmotic diuresis from sustained hyperglycaemia" },
      { id: "d", text: "Excess free-water loss through insensible routes" },
    ],
    correct: ["a"],
    rationale:
      "Concentrated urine in the face of dilute serum is the diagnostic pairing. If serum sodium is low, the kidney should be excreting maximally dilute urine; instead antidiuretic hormone is still driving aquaporin insertion, so free water is retained and serum sodium is diluted. Volume looks normal because retained water distributes across all compartments.",
    distractorRationales: {
      b: "Aldosterone deficiency causes sodium loss with volume depletion and a rising potassium, so the patient would appear hypovolaemic rather than euvolaemic.",
      c: "Osmotic diuresis produces water loss and a rising, not falling, serum sodium, alongside a high urine glucose.",
      d: "Free-water loss concentrates the serum and raises sodium, which is the opposite of the value given.",
    },
    keyClue: "Dilute serum plus concentrated urine means antidiuretic hormone is acting when it should be switched off.",
    clinicalTakeaway:
      "Treatment is water restriction rather than sodium administration, because the problem is retained water rather than lost salt.",
    remediationConcept:
      "Serum sodium reports water balance, not salt stores. Pair the serum value with urine osmolality: dilute serum with concentrated urine means antidiuretic hormone is inappropriately active. Ask what the kidney should be doing and whether it is doing it.",
    safetyPriority: false,
    tags: ["sodium", "hyponatremia", "adh", "lab", "fluid"],
  },
  {
    id: "r012",
    topic: "Sodium and water disorders",
    category: "Fluid and electrolyte balance",
    difficulty: 4,
    type: "mcq",
    stem: "Why does correcting chronic hyponatraemia too rapidly cause neurological injury?",
    options: [
      { id: "a", text: "Brain cells have extruded osmoles, so a rapid rise pulls water out and demyelination follows" },
      { id: "b", text: "A rapid rise in sodium causes cerebral oedema from osmotic water entry" },
      { id: "c", text: "Sodium is directly neurotoxic at concentrations above the reference range" },
      { id: "d", text: "The rise triggers seizure activity by depolarising cortical neurones" },
    ],
    correct: ["a"],
    rationale:
      "In chronic hyponatraemia, neurones adapt over days by extruding intracellular osmoles so cell volume normalises. If serum sodium is then raised quickly, the adapted cells cannot regain osmoles fast enough, water leaves them, and the resulting shrinkage produces osmotic demyelination that may appear days later.",
    distractorRationales: {
      b: "Cerebral oedema is the risk of hyponatraemia developing acutely, not of correcting it; rapid correction shrinks brain cells rather than swelling them.",
      c: "Sodium is not directly neurotoxic at these concentrations; the injury is caused by the osmotic water shift.",
      d: "Seizures occur with acute severe hyponatraemia from cerebral oedema, not as the mechanism of overcorrection injury.",
    },
    keyClue: "Chronic adaptation is what makes fast correction dangerous — the slower it developed, the slower it must be fixed.",
    clinicalTakeaway:
      "Correction is typically limited to roughly 8 mEq/L in 24 hours, with sodium monitored frequently and the prescriber notified if the rise outpaces the plan.",
    remediationConcept:
      "Cells adapt to chronic hyponatraemia by losing osmoles, so they shrink if serum sodium rises faster than they can readapt. Acute hyponatraemia swells the brain; overcorrection of chronic hyponatraemia shrinks it. Duration determines both the risk and the permitted rate of correction.",
    safetyPriority: true,
    tags: ["sodium", "hyponatremia", "osmolality", "priority", "fluid"],
  },
  {
    id: "r013",
    topic: "Potassium balance",
    category: "Fluid and electrolyte balance",
    difficulty: 3,
    type: "mcq",
    stem: "Which electrocardiographic change is most characteristic of significant hyperkalaemia?",
    options: [
      { id: "a", text: "Tall, peaked T waves with progressive QRS widening" },
      { id: "b", text: "Flattened T waves with prominent U waves" },
      { id: "c", text: "A shortened QT interval with ST elevation" },
      { id: "d", text: "Progressive PR shortening with a delta wave" },
    ],
    correct: ["a"],
    rationale:
      "Rising extracellular potassium reduces the resting membrane potential gradient, which speeds repolarisation and slows conduction. The earliest change is tall peaked T waves; as potassium climbs further the P wave flattens, the PR interval lengthens, and the QRS widens until it merges with the T wave in a sine-wave pattern.",
    distractorRationales: {
      b: "Flattened T waves with U waves are the signature of hypokalaemia, the opposite disturbance.",
      c: "A shortened QT interval suggests hypercalcaemia; ST elevation points to myocardial injury rather than a potassium disturbance.",
      d: "A short PR interval with a delta wave describes an accessory conduction pathway, which is unrelated to potassium.",
    },
    keyClue: "Peaked T waves and a widening QRS point up; flat T waves and U waves point down.",
    clinicalTakeaway:
      "Electrocardiographic change in hyperkalaemia signals membrane instability and warrants urgent evaluation rather than waiting for a repeat laboratory value.",
    remediationConcept:
      "Potassium sets the resting membrane potential, so its disorders show up as conduction abnormalities. High potassium peaks T waves then widens the QRS; low potassium flattens T waves and adds U waves. Treat electrocardiographic change as evidence of physiological effect, not merely a number.",
    safetyPriority: true,
    tags: ["potassium", "hyperkalemia", "ecg", "priority", "lab"],
  },
  {
    id: "r014",
    conceptKey: "potassium-balance-inputs",
    topic: "Potassium balance",
    category: "Fluid and electrolyte balance",
    difficulty: 4,
    type: "sata",
    stem: "Which mechanisms contribute to hyperkalaemia in advanced kidney disease? Select all that apply.",
    options: [
      { id: "a", text: "Reduced filtered load available for distal potassium secretion" },
      { id: "b", text: "Metabolic acidosis shifting potassium out of cells" },
      { id: "c", text: "Reduced tubular responsiveness to aldosterone" },
      { id: "d", text: "Increased urinary potassium wasting from tubular injury" },
      { id: "e", text: "Enhanced cellular potassium uptake driven by insulin excess" },
    ],
    correct: ["a", "b", "c"],
    rationale:
      "Advanced kidney disease impairs potassium handling from several directions at once. Less filtrate reaches the distal nephron where secretion occurs, the accompanying metabolic acidosis drives potassium out of cells in exchange for hydrogen ions, and tubular responsiveness to aldosterone declines. Together these overwhelm the kidney's remaining excretory reserve.",
    distractorRationales: {
      d: "Potassium wasting produces hypokalaemia and is characteristic of specific tubular disorders rather than the retention seen in advanced kidney disease.",
      e: "Insulin drives potassium into cells and lowers serum potassium, which is why it is used therapeutically in hyperkalaemia rather than being a cause of it.",
    },
    keyClue: "Ask whether each mechanism adds potassium to the blood or removes it before selecting.",
    clinicalTakeaway:
      "Because several mechanisms act together, hyperkalaemia in advanced kidney disease can recur quickly after treatment unless the acidosis and dietary intake are addressed as well.",
    remediationConcept:
      "Serum potassium reflects the balance of intake, transcellular shift, and renal excretion. Advanced kidney disease impairs excretion while acidosis simultaneously shifts potassium out of cells. Sort every proposed mechanism by whether it adds potassium to serum or removes it.",
    safetyPriority: false,
    tags: ["potassium", "hyperkalemia", "acidosis", "ckd-link", "lab"],
  },
  {
    id: "r015",
    conceptKey: "potassium-balance-inputs",
    topic: "Potassium balance",
    category: "Fluid and electrolyte balance",
    difficulty: 3,
    type: "mcq",
    stem: "A patient on a loop diuretic develops muscle weakness and a serum potassium of 2.9 mEq/L. Which mechanism explains this result?",
    options: [
      { id: "a", text: "Increased distal sodium delivery driving potassium secretion" },
      { id: "b", text: "Direct blockade of the distal potassium channel" },
      { id: "c", text: "Reduced aldosterone release lowering sodium reabsorption" },
      { id: "d", text: "Impaired intestinal potassium absorption" },
    ],
    correct: ["a"],
    rationale:
      "Loop diuretics block the sodium-potassium-two-chloride transporter in the thick ascending limb, so more sodium reaches the distal nephron. There, sodium reabsorption through the principal cell is electrically coupled to potassium secretion, and the increased delivery plus secondary aldosterone activation drive potassium into the urine.",
    distractorRationales: {
      b: "Loop diuretics do not block distal potassium channels; the potassium loss is a downstream consequence of increased sodium delivery.",
      c: "Volume loss from a loop diuretic raises aldosterone rather than reducing it, which worsens potassium loss.",
      d: "These agents act in the nephron and do not impair intestinal potassium absorption.",
    },
    keyClue: "Sodium delivered distally is traded for potassium, so anything increasing distal sodium wastes potassium.",
    clinicalTakeaway:
      "Because hypokalaemia and hypomagnesaemia often occur together and low magnesium makes potassium hard to replace, magnesium is checked when potassium fails to correct.",
    remediationConcept:
      "The distal nephron trades sodium reabsorption for potassium secretion. Any drug or state that increases distal sodium delivery therefore wastes potassium, while blocking that exchange retains it. Classify diuretics by whether they raise or lower distal sodium delivery.",
    safetyPriority: false,
    tags: ["potassium", "hypokalemia", "diuretic", "tubule", "lab"],
  },
  {
    id: "r016",
    conceptKey: "ckd-mineral-bone-chain",
    topic: "Calcium and phosphate",
    category: "Fluid and electrolyte balance",
    difficulty: 4,
    type: "mcq",
    stem: "In chronic kidney disease, which sequence best explains the development of secondary hyperparathyroidism?",
    options: [
      { id: "a", text: "Phosphate retention and reduced vitamin D activation lower calcium, stimulating parathyroid hormone" },
      { id: "b", text: "Parathyroid adenoma formation raises hormone output and consequently raises calcium" },
      { id: "c", text: "Excess vitamin D activation raises calcium, which stimulates parathyroid hormone" },
      { id: "d", text: "Reduced phosphate absorption raises calcium and suppresses parathyroid hormone" },
    ],
    correct: ["a"],
    rationale:
      "Falling filtration retains phosphate, and loss of one-alpha-hydroxylase activity reduces conversion of vitamin D to its active form. Less active vitamin D means less intestinal calcium absorption, and retained phosphate binds calcium directly. The resulting hypocalcaemia is a continuous stimulus to parathyroid hormone secretion, which pulls calcium from bone.",
    distractorRationales: {
      b: "An autonomous adenoma with high calcium describes primary hyperparathyroidism; the secondary form is a response to low calcium.",
      c: "Vitamin D activation falls rather than rises in kidney disease, and high calcium suppresses parathyroid hormone rather than stimulating it.",
      d: "Phosphate is retained rather than poorly absorbed, and the calcium in this condition is low rather than high.",
    },
    keyClue: "Secondary hyperparathyroidism is a response to low calcium; primary is the cause of high calcium.",
    clinicalTakeaway:
      "Sustained parathyroid hormone excess produces renal osteodystrophy and vascular calcification, so phosphate and calcium are managed together rather than in isolation.",
    remediationConcept:
      "In chronic kidney disease, retained phosphate plus impaired vitamin D activation lowers calcium, and parathyroid hormone rises in response. Use calcium to tell the forms apart: high calcium with high hormone is primary, low calcium with high hormone is secondary. Bone pays the price in both.",
    safetyPriority: false,
    tags: ["calcium", "phosphate", "parathyroid", "ckd-link", "lab"],
  },
  {
    id: "r017",
    topic: "Volume status",
    category: "Fluid and electrolyte balance",
    difficulty: 2,
    type: "mcq",
    stem: "Which set of findings most suggests intravascular volume depletion?",
    options: [
      { id: "a", text: "Postural drop in blood pressure with rising heart rate and concentrated urine" },
      { id: "b", text: "Jugular venous distension with dependent oedema and crackles" },
      { id: "c", text: "Bounding pulses with a widened pulse pressure and clear lungs" },
      { id: "d", text: "Warm extremities with brisk capillary refill and dilute urine" },
    ],
    correct: ["a"],
    rationale:
      "Falling intravascular volume reduces stroke volume, so the sympathetic response raises heart rate and the blood pressure cannot be sustained on standing. The kidney simultaneously conserves salt and water, producing low-volume concentrated urine. These findings point in the same direction and together indicate depletion.",
    distractorRationales: {
      b: "Jugular venous distension, dependent oedema, and crackles indicate volume overload rather than depletion.",
      c: "Bounding pulses with a wide pulse pressure suggest a high-output or vasodilated state rather than low volume.",
      d: "Warm well-perfused extremities with dilute urine indicate adequate volume and normal renal water handling.",
    },
    keyClue: "Read the kidney's urine output alongside the vital signs — both report the same volume state.",
    clinicalTakeaway:
      "Volume assessment guides whether a rising creatinine is likely prerenal and fluid-responsive or reflects established tubular injury.",
    remediationConcept:
      "Assess volume from two independent directions: circulatory signs such as heart rate, postural blood pressure, and perfusion, and renal signs such as urine volume and concentration. When both point the same way, the assessment is reliable. Contradictory findings mean reconsider the diagnosis.",
    safetyPriority: false,
    tags: ["volume", "assessment", "fluid", "perfusion"],
  },
  {
    id: "r018",
    conceptKey: "serum-sodium-reports-water-balance",
    topic: "Sodium and water disorders",
    category: "Fluid and electrolyte balance",
    difficulty: 4,
    type: "mcq",
    stem: "A patient with a serum glucose of 780 mg/dL has a measured serum sodium of 128 mEq/L. How should this sodium value be interpreted?",
    options: [
      { id: "a", text: "As a dilutional effect of hyperglycaemia, with corrected sodium nearer the reference range" },
      { id: "b", text: "As true sodium depletion requiring hypertonic saline" },
      { id: "c", text: "As a laboratory artefact requiring no interpretation" },
      { id: "d", text: "As evidence of inappropriate antidiuretic hormone secretion" },
    ],
    correct: ["a"],
    rationale:
      "Glucose is an effective osmole that stays in the extracellular space and pulls water out of cells. That added water dilutes serum sodium without any change in total body sodium. Correcting for glucose typically adds roughly 2 mEq/L of sodium for every 100 mg/dL of glucose above normal, which brings this value close to the reference range.",
    distractorRationales: {
      b: "Total body sodium is not depleted here, and hypertonic saline would be inappropriate; treating the hyperglycaemia corrects the sodium.",
      c: "The value is real rather than artefactual — water genuinely has shifted — so it requires correction rather than dismissal.",
      d: "Inappropriate antidiuretic hormone secretion produces hyponatraemia with concentrated urine and normal glucose, which does not fit this picture.",
    },
    keyClue: "Check glucose before treating any low sodium; osmotic dilution mimics true hyponatraemia.",
    clinicalTakeaway:
      "As insulin lowers glucose, water moves back into cells and serum sodium rises on its own, so treating the measured value would risk overcorrection.",
    remediationConcept:
      "Effective osmoles such as glucose pull water into the extracellular space and dilute serum sodium without changing sodium stores. Correct the sodium for glucose before deciding whether hyponatraemia is real. Treating the uncorrected number risks overcorrection as glucose falls.",
    safetyPriority: false,
    tags: ["sodium", "hyponatremia", "osmolality", "lab", "fluid"],
  },
  {
    id: "r019",
    topic: "Calcium and phosphate",
    category: "Fluid and electrolyte balance",
    difficulty: 3,
    type: "mcq",
    stem: "Which finding would be expected in a patient with symptomatic hypocalcaemia?",
    options: [
      { id: "a", text: "Perioral numbness with carpopedal spasm and hyperreflexia" },
      { id: "b", text: "Profound muscle weakness with constipation and polyuria" },
      { id: "c", text: "A shortened QT interval with bone pain" },
      { id: "d", text: "Flushed dry skin with lethargy and thirst" },
    ],
    correct: ["a"],
    rationale:
      "Calcium stabilises the neuronal membrane by raising the threshold for depolarisation. When ionised calcium falls, nerves fire more readily, producing paraesthesia around the mouth and fingers, carpopedal spasm, hyperreflexia, and in severe cases laryngospasm or seizures. The electrocardiogram shows a prolonged QT interval.",
    distractorRationales: {
      b: "Weakness, constipation, and polyuria describe hypercalcaemia, in which excess calcium depresses neuromuscular excitability.",
      c: "A shortened QT interval indicates hypercalcaemia; hypocalcaemia prolongs the QT interval.",
      d: "Flushed dry skin with lethargy and thirst fits hypercalcaemia with its associated dehydration.",
    },
    keyClue: "Low calcium excites nerves and muscle; high calcium sedates them.",
    clinicalTakeaway:
      "Laryngospasm makes symptomatic hypocalcaemia an airway concern, so worsening symptoms warrant urgent evaluation rather than routine monitoring.",
    remediationConcept:
      "Calcium raises the threshold for nerve and muscle depolarisation, so low calcium causes hyperexcitability and high calcium causes depression. Spasm, tingling, and hyperreflexia mean low; weakness, constipation, and lethargy mean high. QT direction follows the same logic — long when low, short when high.",
    safetyPriority: true,
    tags: ["calcium", "hypocalcemia", "neuromuscular", "priority", "ecg"],
  },
  {
    id: "r020",
    topic: "Volume status",
    category: "Fluid and electrolyte balance",
    difficulty: 3,
    type: "mcq",
    stem: "A patient with decompensated cirrhosis has ascites, peripheral oedema, and a low urine sodium. Which statement best explains this combination?",
    options: [
      { id: "a", text: "Total body water is increased while effective circulating volume is sensed as low" },
      { id: "b", text: "Total body water and effective circulating volume are both increased" },
      { id: "c", text: "Total body water is reduced, causing appropriate sodium conservation" },
      { id: "d", text: "Sodium conservation reflects primary tubular injury rather than a volume signal" },
    ],
    correct: ["a"],
    rationale:
      "Splanchnic vasodilation and low oncotic pressure move fluid into the peritoneum and interstitium, so the patient is overloaded overall while arterial baroreceptors sense underfilling. That perceived deficit activates the renin-angiotensin-aldosterone system and antidiuretic hormone, producing avid sodium and water retention with a low urine sodium despite obvious oedema.",
    distractorRationales: {
      b: "If effective circulating volume were genuinely high, the kidney would excrete sodium rather than conserve it.",
      c: "Total body water is clearly increased in the presence of ascites and oedema, so conservation is inappropriate to the overall state.",
      d: "The avid sodium retention here is a hormonal response to a perceived volume deficit, not a sign of tubular damage.",
    },
    keyClue: "Oedema with a low urine sodium means the kidney is being told volume is low even though it is not.",
    clinicalTakeaway:
      "This is why giving saline worsens ascites while addressing the underlying circulatory abnormality and using sodium restriction is more effective.",
    remediationConcept:
      "The kidney responds to effective circulating volume, not total body water. In cirrhosis and heart failure the two diverge, so an overloaded patient conserves sodium avidly. A low urine sodium alongside oedema is the fingerprint of that mismatch.",
    safetyPriority: false,
    tags: ["volume", "sodium", "raas", "fluid", "compensation"],
  },
];
