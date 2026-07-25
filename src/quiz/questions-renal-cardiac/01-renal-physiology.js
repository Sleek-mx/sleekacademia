// R1–10 — Nephron function, glomerular filtration, autoregulation, RAAS, ADH.
// Original items written for Sleek Academia. No commercial test-bank content.

export default [
  {
    id: "r001",
    topic: "Glomerular filtration",
    category: "Renal physiology",
    difficulty: 2,
    type: "mcq",
    stem: "Which structure of the nephron performs the filtration that produces the initial filtrate?",
    options: [
      { id: "a", text: "The glomerulus" },
      { id: "b", text: "The loop of Henle" },
      { id: "c", text: "The collecting duct" },
      { id: "d", text: "The peritubular capillary" },
    ],
    correct: ["a"],
    rationale:
      "The glomerulus is a high-pressure capillary tuft. Hydrostatic pressure drives plasma water and small solutes across the three-layer filtration barrier — fenestrated endothelium, basement membrane, and podocyte foot processes — into Bowman capsule. Every nephron segment distal to this point modifies filtrate that has already been formed.",
    distractorRationales: {
      b: "The loop of Henle establishes the medullary concentration gradient by countercurrent multiplication; it modifies existing filtrate rather than creating it.",
      c: "The collecting duct performs final water reabsorption under the influence of antidiuretic hormone, well downstream of filtration.",
      d: "Peritubular capillaries receive reabsorbed water and solute and return them to the circulation, which is the opposite direction of flow.",
    },
    keyClue: "Filtration happens once, at the glomerulus. Everything distal to it edits the filtrate.",
    clinicalTakeaway:
      "Damage at the glomerulus shows up as protein or blood in the urine, whereas tubular damage shows up as a concentrating or electrolyte-handling defect.",
    remediationConcept:
      "Sort every renal finding by where in the nephron it originates: glomerulus (filtration), proximal tubule (bulk reabsorption), loop of Henle (concentration gradient), distal tubule and collecting duct (fine regulation). Glomerular problems leak things that should stay in blood. Tubular problems mishandle things already filtered.",
    safetyPriority: false,
    tags: ["nephron", "filtration", "physiology"],
  },
  {
    id: "r002",
    conceptKey: "glomerular-arteriolar-tone",
    topic: "Glomerular filtration",
    category: "Renal physiology",
    difficulty: 3,
    type: "mcq",
    stem: "Which change would be expected to raise the glomerular filtration rate?",
    options: [
      { id: "a", text: "Constriction of the efferent arteriole" },
      { id: "b", text: "Constriction of the afferent arteriole" },
      { id: "c", text: "A fall in systemic arterial pressure" },
      { id: "d", text: "A rise in plasma oncotic pressure" },
    ],
    correct: ["a"],
    rationale:
      "Glomerular filtration depends on the hydrostatic pressure inside the glomerular capillary. Constricting the efferent arteriole restricts outflow, so pressure builds up within the tuft and filtration rises. This is precisely how angiotensin II defends filtration rate when perfusion falls.",
    distractorRationales: {
      b: "The afferent arteriole is the inflow vessel; constricting it reduces the blood delivered to the tuft and lowers glomerular pressure and filtration.",
      c: "Lower systemic pressure reduces the driving pressure reaching the glomerulus, so filtration falls once autoregulation is exhausted.",
      d: "Higher plasma oncotic pressure pulls fluid back into the capillary, opposing filtration and reducing the net filtration pressure.",
    },
    keyClue: "Efferent constriction dams the outflow and raises glomerular pressure; afferent constriction starves the inflow.",
    clinicalTakeaway:
      "This is why an ACE inhibitor can drop filtration rate in a volume-depleted patient: removing angiotensin II relaxes the efferent arteriole the kidney was relying on.",
    remediationConcept:
      "Picture the glomerulus as a tub between two taps: the afferent arteriole fills it and the efferent arteriole drains it. Narrowing the drain raises pressure and filtration; narrowing the inflow lowers both. Reason through every filtration question with that image before recalling a rule.",
    safetyPriority: false,
    tags: ["gfr", "arteriole", "hemodynamics", "physiology"],
  },
  {
    id: "r003",
    conceptKey: "renal-perfusion-determinants",
    topic: "Renal autoregulation",
    category: "Renal physiology",
    difficulty: 4,
    type: "mcq",
    stem: "A patient's mean arterial pressure falls from 95 to 72 mm Hg, yet urine output and creatinine remain unchanged. Which mechanism best explains this stability?",
    options: [
      { id: "a", text: "Autoregulation maintaining filtration across a range of perfusion pressures" },
      { id: "b", text: "Increased antidiuretic hormone release preserving filtration" },
      { id: "c", text: "Aldosterone-driven sodium reabsorption raising filtration" },
      { id: "d", text: "Reduced tubular oxygen demand protecting filtration" },
    ],
    correct: ["a"],
    rationale:
      "Renal autoregulation holds filtration relatively constant across a mean arterial pressure of roughly 80 to 180 mm Hg. The myogenic reflex plus tubuloglomerular feedback adjust afferent arteriolar tone, and angiotensin II adds efferent constriction, so a modest pressure drop is absorbed without a measurable change in filtration.",
    distractorRationales: {
      b: "Antidiuretic hormone governs water reabsorption in the collecting duct and changes urine concentration, not glomerular filtration rate.",
      c: "Aldosterone drives distal sodium reabsorption. It affects volume status over hours to days rather than defending filtration minute to minute.",
      d: "Falling tubular oxygen demand is a consequence of reduced filtered load, not a mechanism that sustains filtration when pressure drops.",
    },
    keyClue: "Stable creatinine despite a moderate pressure fall means autoregulation is still within its range.",
    clinicalTakeaway:
      "Once mean arterial pressure falls below roughly 80 mm Hg, autoregulation is exhausted and filtration begins to track pressure directly — the point where prerenal injury starts.",
    remediationConcept:
      "Autoregulation buys the kidney a buffer of roughly 80 to 180 mm Hg mean arterial pressure. Inside that window, filtration is defended and labs stay flat. Outside it, filtration follows perfusion pressure and injury becomes possible.",
    safetyPriority: false,
    tags: ["autoregulation", "gfr", "hemodynamics", "compensation"],
  },
  {
    id: "r004",
    conceptKey: "raas-axis",
    topic: "Renin-angiotensin-aldosterone system",
    category: "Renal physiology",
    difficulty: 3,
    type: "mcq",
    stem: "Which stimulus most directly triggers renin release from the juxtaglomerular cells?",
    options: [
      { id: "a", text: "Reduced sodium chloride delivery to the macula densa" },
      { id: "b", text: "A rise in serum potassium concentration" },
      { id: "c", text: "Elevated plasma osmolality detected by the hypothalamus" },
      { id: "d", text: "Increased stretch of the atrial wall" },
    ],
    correct: ["a"],
    rationale:
      "Renin release has three triggers: reduced perfusion pressure sensed by the juxtaglomerular cells, sympathetic beta-1 stimulation, and reduced sodium chloride delivery to the macula densa. Low distal salt delivery signals inadequate effective circulating volume, so the cells release renin to begin the cascade that restores it.",
    distractorRationales: {
      b: "Rising potassium stimulates aldosterone secretion directly from the adrenal cortex, bypassing renin entirely.",
      c: "Rising osmolality triggers antidiuretic hormone release and thirst, which is the water-conserving axis rather than the sodium-conserving one.",
      d: "Atrial stretch releases natriuretic peptides, which oppose the renin-angiotensin-aldosterone system rather than activating it.",
    },
    keyClue: "Renin answers low volume and low salt delivery; antidiuretic hormone answers high osmolality.",
    clinicalTakeaway:
      "Because potassium drives aldosterone independently of renin, a patient can be hyperkalaemic with a suppressed renin level and still have an aldosterone response.",
    remediationConcept:
      "Keep the two homeostatic axes separate: renin-angiotensin-aldosterone defends volume and sodium, antidiuretic hormone defends osmolality and water. Ask what the stimulus threatens — volume or concentration — and the axis follows. Potassium is the one input that drives aldosterone without renin.",
    safetyPriority: false,
    tags: ["raas", "renin", "compensation", "physiology"],
  },
  {
    id: "r005",
    conceptKey: "raas-axis",
    topic: "Renin-angiotensin-aldosterone system",
    category: "Renal physiology",
    difficulty: 4,
    type: "mcq",
    stem: "Which combination of effects is produced by angiotensin II?",
    options: [
      { id: "a", text: "Systemic vasoconstriction, aldosterone release, and proximal sodium reabsorption" },
      { id: "b", text: "Systemic vasodilation, aldosterone release, and distal potassium retention" },
      { id: "c", text: "Systemic vasoconstriction, natriuresis, and suppressed thirst" },
      { id: "d", text: "Systemic vasodilation, cortisol release, and free-water clearance" },
    ],
    correct: ["a"],
    rationale:
      "Angiotensin II raises blood pressure through several routes at once: it constricts arterioles systemically, stimulates adrenal aldosterone release, promotes sodium and water reabsorption in the proximal tubule, constricts the efferent arteriole to defend filtration, and stimulates thirst and antidiuretic hormone release.",
    distractorRationales: {
      b: "Angiotensin II is a vasoconstrictor, not a vasodilator, and aldosterone causes potassium excretion rather than retention.",
      c: "Angiotensin II promotes sodium retention rather than natriuresis, and it stimulates thirst rather than suppressing it.",
      d: "Vasodilation and free-water clearance are the opposite of this hormone's actions, and it does not drive cortisol release.",
    },
    keyClue: "Angiotensin II is the body's pressure-and-volume rescue signal, so every action it takes adds volume or tone.",
    clinicalTakeaway:
      "Sustained angiotensin II activity also drives cardiac and vascular remodelling, which is why blocking this axis improves outcomes in heart failure beyond its effect on blood pressure.",
    remediationConcept:
      "Angiotensin II has one goal — restore perfusion pressure — so predict its effects rather than memorising them. Anything that adds tone, sodium, or water is consistent; anything that dumps volume or dilates is not. Aldosterone trades sodium retention for potassium loss.",
    safetyPriority: false,
    tags: ["raas", "angiotensin", "compensation", "remodeling"],
  },
  {
    id: "r006",
    topic: "Water balance and antidiuretic hormone",
    category: "Renal physiology",
    difficulty: 3,
    type: "mcq",
    stem: "Antidiuretic hormone produces its water-conserving effect by which mechanism?",
    options: [
      { id: "a", text: "Inserting aquaporin channels into the collecting duct membrane" },
      { id: "b", text: "Increasing sodium reabsorption in the distal tubule" },
      { id: "c", text: "Raising the glomerular filtration rate" },
      { id: "d", text: "Blocking the countercurrent gradient in the medulla" },
    ],
    correct: ["a"],
    rationale:
      "Antidiuretic hormone binds V2 receptors on the basolateral membrane of collecting duct cells and triggers insertion of aquaporin-2 water channels into the apical membrane. Water then moves osmotically from filtrate into the hypertonic medullary interstitium, concentrating the urine without moving sodium.",
    distractorRationales: {
      b: "Distal sodium reabsorption is aldosterone's action; antidiuretic hormone moves water independently of sodium, which is why it changes serum sodium concentration.",
      c: "Antidiuretic hormone acts on the collecting duct and does not meaningfully alter filtration rate.",
      d: "The medullary countercurrent gradient is what makes water reabsorption possible, so this hormone depends on that gradient rather than blocking it.",
    },
    keyClue: "Antidiuretic hormone moves water alone, so it dilutes serum sodium; aldosterone moves sodium with water.",
    clinicalTakeaway:
      "Because this hormone reabsorbs water without sodium, excess activity produces a dilutional hyponatraemia with concentrated urine — the signature of inappropriate antidiuretic hormone secretion.",
    remediationConcept:
      "Antidiuretic hormone reabsorbs pure water through aquaporins in the collecting duct; aldosterone reabsorbs sodium and water together. Water alone changes serum sodium concentration, while salt and water together change volume. That distinction explains most sodium disorders.",
    safetyPriority: false,
    tags: ["adh", "water-balance", "aquaporin", "physiology"],
  },
  {
    id: "r007",
    topic: "Tubular transport",
    category: "Renal physiology",
    difficulty: 3,
    type: "mcq",
    stem: "Roughly two-thirds of filtered sodium and water is reabsorbed at which nephron segment?",
    options: [
      { id: "a", text: "The proximal convoluted tubule" },
      { id: "b", text: "The thick ascending limb" },
      { id: "c", text: "The distal convoluted tubule" },
      { id: "d", text: "The cortical collecting duct" },
    ],
    correct: ["a"],
    rationale:
      "The proximal convoluted tubule performs bulk isosmotic reabsorption, recovering about 65 to 70 percent of filtered sodium and water along with nearly all filtered glucose, amino acids, and bicarbonate. Its brush border and dense mitochondria support this high-volume transport, which also makes it the segment most vulnerable to ischaemia.",
    distractorRationales: {
      b: "The thick ascending limb reclaims roughly a quarter of filtered sodium through the sodium-potassium-two-chloride transporter, a large share but not the majority.",
      c: "The distal convoluted tubule fine-tunes about 5 to 10 percent of sodium through the sodium-chloride cotransporter.",
      d: "The cortical collecting duct adjusts only the final few percent under aldosterone and antidiuretic hormone control.",
    },
    keyClue: "Reabsorption runs from bulk to fine-tuning as filtrate moves down the nephron.",
    clinicalTakeaway:
      "Because the proximal tubule does the most work and has the highest oxygen demand, it is the first segment to die in ischaemic acute tubular necrosis.",
    remediationConcept:
      "Sodium reabsorption is front-loaded: about 65 percent proximal, 25 percent in the thick ascending limb, 5 to 10 percent distal, and a few percent in the collecting duct. High workload means high oxygen demand. That is why proximal cells and the thick ascending limb are the first casualties of ischaemia.",
    safetyPriority: false,
    tags: ["tubule", "sodium", "reabsorption", "physiology"],
  },
  {
    id: "r008",
    topic: "Renal endocrine function",
    category: "Renal physiology",
    difficulty: 3,
    type: "mcq",
    stem: "A patient with long-standing kidney disease develops a normocytic anaemia. Which failure of renal endocrine function explains this finding?",
    options: [
      { id: "a", text: "Reduced erythropoietin production by peritubular interstitial cells" },
      { id: "b", text: "Reduced activation of vitamin D by the proximal tubule" },
      { id: "c", text: "Reduced renin release by the juxtaglomerular cells" },
      { id: "d", text: "Reduced clearance of parathyroid hormone by the tubule" },
    ],
    correct: ["a"],
    rationale:
      "The kidney is an endocrine organ as well as a filter. Peritubular interstitial cells sense tissue oxygen tension and release erythropoietin, which drives erythroid maturation in the marrow. As functioning renal mass is lost this signal falls, producing the normocytic normochromic anaemia typical of chronic kidney disease.",
    distractorRationales: {
      b: "Impaired vitamin D activation causes hypocalcaemia and renal bone disease, not anaemia.",
      c: "Reduced renin release would affect blood pressure and volume regulation rather than red cell production.",
      d: "Retained rather than cleared parathyroid hormone contributes to bone disease; it is not a cause of normocytic anaemia.",
    },
    keyClue: "The kidney makes erythropoietin, activates vitamin D, and releases renin — anaemia points to the first.",
    clinicalTakeaway:
      "This anaemia responds to erythropoiesis-stimulating agents only when iron stores are adequate, so iron status is assessed before and during treatment.",
    remediationConcept:
      "The kidney has three endocrine jobs: erythropoietin for red cells, one-alpha-hydroxylation to activate vitamin D for calcium, and renin for volume. Match the deficiency to the failing job — anaemia to erythropoietin, hypocalcaemia and bone disease to vitamin D. Chronic kidney disease eventually impairs all three.",
    safetyPriority: false,
    tags: ["erythropoietin", "endocrine", "anemia", "ckd-link"],
  },
  {
    id: "r009",
    topic: "Glomerular filtration",
    category: "Renal physiology",
    difficulty: 4,
    type: "mcq",
    stem: "Why does serum creatinine underestimate the severity of early kidney impairment?",
    options: [
      { id: "a", text: "Remaining nephrons hyperfiltrate, holding creatinine near normal until much function is lost" },
      { id: "b", text: "Creatinine is secreted by the proximal tubule faster than it is filtered" },
      { id: "c", text: "Creatinine production rises as filtration falls, masking the change" },
      { id: "d", text: "Creatinine is reabsorbed in the distal tubule when filtration declines" },
    ],
    correct: ["a"],
    rationale:
      "Surviving nephrons compensate by raising their individual filtration rates, so total filtration falls far less than nephron number. The relationship between creatinine and filtration rate is hyperbolic rather than linear: creatinine stays within the reference range until roughly half of function is gone, then rises steeply.",
    distractorRationales: {
      b: "A small amount of creatinine is secreted by the proximal tubule, but secretion does not exceed filtration and is not why early disease is hidden.",
      c: "Creatinine production reflects muscle mass and stays relatively stable; it does not rise in response to falling filtration.",
      d: "Creatinine is not appreciably reabsorbed, which is exactly why it serves as a filtration marker.",
    },
    keyClue: "The creatinine-to-filtration curve is hyperbolic, so early losses hide in the flat part.",
    clinicalTakeaway:
      "A creatinine rise from 0.8 to 1.6 mg/dL represents roughly a halving of filtration even though both values can look unremarkable at a glance.",
    remediationConcept:
      "Creatinine tracks filtration hyperbolically, not linearly, because surviving nephrons hyperfiltrate. Small absolute rises at low values represent large functional losses. Judge trend and estimated filtration rate rather than whether a single value sits inside the reference range.",
    safetyPriority: false,
    tags: ["creatinine", "gfr", "lab", "compensation"],
  },
  {
    id: "r010",
    conceptKey: "glomerular-arteriolar-tone",
    topic: "Renal autoregulation",
    category: "Renal physiology",
    difficulty: 5,
    type: "mcq",
    stem: "A patient with bilateral renal artery stenosis is started on an ACE inhibitor and creatinine rises sharply within days. Which mechanism accounts for this deterioration?",
    options: [
      { id: "a", text: "Loss of angiotensin II-mediated efferent arteriolar tone that was sustaining filtration pressure" },
      { id: "b", text: "Direct toxic injury to proximal tubular cells from the medication" },
      { id: "c", text: "Obstruction of the collecting system by interstitial oedema" },
      { id: "d", text: "Immune-mediated damage to the glomerular basement membrane" },
    ],
    correct: ["a"],
    rationale:
      "Behind a stenotic renal artery, perfusion pressure is already low and filtration is maintained almost entirely by angiotensin II constricting the efferent arteriole. Removing that constriction lets glomerular pressure fall, so filtration drops abruptly. The change is haemodynamic and typically reverses when the drug is withdrawn.",
    distractorRationales: {
      b: "ACE inhibitors are not directly tubulotoxic; the rise in creatinine reflects altered glomerular haemodynamics rather than cell death.",
      c: "Obstruction is a postrenal mechanism and would not be produced by starting this medication.",
      d: "Immune-mediated basement membrane injury describes glomerulonephritis, which follows a different course and is accompanied by an active urinary sediment.",
    },
    keyClue: "A prompt, reversible creatinine rise after starting an ACE inhibitor is haemodynamic, not structural.",
    clinicalTakeaway:
      "Renal function is rechecked within one to two weeks of starting these agents; a modest stable rise is often accepted, while a steep rise prompts the prescriber to reassess.",
    remediationConcept:
      "When renal perfusion is marginal, filtration depends on angiotensin II holding the efferent arteriole tight. Blocking that axis removes the support and filtration falls, which is haemodynamic and usually reversible. Distinguish it from structural injury by its speed and its recovery on withdrawal.",
    safetyPriority: true,
    tags: ["autoregulation", "raas", "gfr", "hemodynamics", "priority"],
  },
];
