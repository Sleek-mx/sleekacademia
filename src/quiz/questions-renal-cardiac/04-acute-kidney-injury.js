// R31–40 — Prerenal, intrinsic and postrenal acute kidney injury; urinary sediment.
// Original items written for Sleek Academia. No commercial test-bank content.

export default [
  {
    id: "r031",
    topic: "Prerenal injury",
    category: "Acute kidney injury",
    difficulty: 3,
    type: "mcq",
    stem: "Which laboratory pattern is most consistent with prerenal acute kidney injury?",
    options: [
      { id: "a", text: "Urine sodium below 20 mEq/L with a urea-to-creatinine ratio above 20 to 1" },
      { id: "b", text: "Urine sodium above 40 mEq/L with muddy brown granular casts" },
      { id: "c", text: "Urine sodium above 40 mEq/L with red cell casts and proteinuria" },
      { id: "d", text: "Urine sodium below 20 mEq/L with white cell casts and eosinophils" },
    ],
    correct: ["a"],
    rationale:
      "In prerenal injury the tubules are intact but underperfused, so they conserve sodium and water avidly. Urine sodium and fractional excretion of sodium are therefore low and the urine is concentrated. Urea is reabsorbed along with that water while creatinine is not, which disproportionately raises the urea-to-creatinine ratio.",
    distractorRationales: {
      b: "High urine sodium with muddy brown granular casts indicates acute tubular necrosis, in which damaged tubules can no longer conserve sodium.",
      c: "Red cell casts with proteinuria point to glomerular inflammation rather than a perfusion problem.",
      d: "White cell casts with urinary eosinophils suggest acute interstitial nephritis, and the low sodium does not fit that pattern.",
    },
    keyClue: "Intact but thirsty tubules hoard sodium; dead tubules leak it.",
    clinicalTakeaway:
      "Prerenal injury is potentially reversible with restored perfusion, so distinguishing it early changes management.",
    remediationConcept:
      "Ask one question of every acute kidney injury: can the tubules still conserve sodium? If yes, urine sodium is low and the cause is upstream perfusion. If no, urine sodium is high and the tubules themselves are damaged.",
    safetyPriority: false,
    tags: ["aki", "prerenal", "urinalysis", "sodium", "lab"],
  },
  {
    id: "r032",
    topic: "Intrinsic injury",
    category: "Acute kidney injury",
    difficulty: 3,
    type: "mcq",
    stem: "Which urinary finding is most characteristic of established acute tubular necrosis?",
    options: [
      { id: "a", text: "Muddy brown granular casts" },
      { id: "b", text: "Red blood cell casts" },
      { id: "c", text: "White blood cell casts" },
      { id: "d", text: "Broad waxy casts" },
    ],
    correct: ["a"],
    rationale:
      "Muddy brown granular casts are sloughed, degenerating tubular epithelial cells packed into the lumen. Their presence indicates that tubular cells have died and detached, which is the defining event of acute tubular necrosis, and it accompanies the loss of concentrating and sodium-conserving ability.",
    distractorRationales: {
      b: "Red cell casts indicate glomerular bleeding and point to glomerulonephritis rather than tubular injury.",
      c: "White cell casts suggest interstitial inflammation or pyelonephritis rather than tubular cell death.",
      d: "Broad waxy casts form in dilated tubules of chronically scarred kidneys and indicate long-standing rather than acute disease.",
    },
    keyClue: "The cast type names the compartment: tubular cells from tubules, red cells from glomeruli, white cells from interstitium.",
    clinicalTakeaway:
      "Because the basement membrane usually survives, tubular cells can regenerate, so recovery is possible over one to three weeks if further insults are avoided.",
    remediationConcept:
      "Urinary casts localise injury within the nephron. Muddy brown granular casts mean dead tubular cells, red cell casts mean glomerular inflammation, and white cell casts mean interstitial inflammation. Read the sediment as a map of which compartment is damaged.",
    safetyPriority: false,
    tags: ["aki", "atn", "urinalysis", "casts", "lab"],
  },
  {
    id: "r033",
    topic: "Intrinsic injury",
    category: "Acute kidney injury",
    difficulty: 4,
    type: "mcq",
    stem: "Why is the proximal tubule and thick ascending limb the region most vulnerable to ischaemic injury?",
    options: [
      { id: "a", text: "High active transport workload creates high oxygen demand in a poorly oxygenated medulla" },
      { id: "b", text: "These segments receive no arterial blood supply of their own" },
      { id: "c", text: "These segments lack any capacity for cellular regeneration" },
      { id: "d", text: "Filtrate reaching these segments carries a high concentration of toxins" },
    ],
    correct: ["a"],
    rationale:
      "These segments perform the bulk of active sodium reabsorption, so their oxygen consumption is very high. They also sit in the outer medulla, a region already relatively hypoxic because the countercurrent vascular arrangement shunts oxygen away. High demand in a low-supply environment leaves almost no reserve when perfusion falls.",
    distractorRationales: {
      b: "These segments are perfused by the peritubular capillary network; the problem is marginal oxygen delivery rather than absent supply.",
      c: "Tubular epithelial cells retain considerable regenerative capacity, which is why recovery from tubular necrosis is possible.",
      d: "Toxin concentration contributes to nephrotoxic injury but does not explain vulnerability to ischaemia specifically.",
    },
    keyClue: "Highest workload plus lowest oxygen tension equals least reserve.",
    clinicalTakeaway:
      "This is why hypotension and nephrotoxin exposure together cause far more injury than either alone, and why perfusion is protected during nephrotoxic therapy.",
    remediationConcept:
      "Ischaemic vulnerability follows the ratio of oxygen demand to supply. The proximal tubule and thick ascending limb do the most transport work while sitting in the relatively hypoxic outer medulla. Any fall in perfusion strikes there first.",
    safetyPriority: false,
    tags: ["aki", "atn", "ischemia", "tubule", "physiology"],
  },
  {
    id: "r034",
    conceptKey: "postrenal-obstruction",
    topic: "Postrenal obstruction",
    category: "Acute kidney injury",
    difficulty: 3,
    type: "mcq",
    stem: "An older patient with a history of prostatic enlargement presents with anuria, suprapubic fullness, and a rising creatinine. Which category of injury is most likely?",
    options: [
      { id: "a", text: "Postrenal obstruction" },
      { id: "b", text: "Prerenal hypoperfusion" },
      { id: "c", text: "Acute tubular necrosis" },
      { id: "d", text: "Acute glomerulonephritis" },
    ],
    correct: ["a"],
    rationale:
      "Bladder outlet obstruction raises pressure retrogradely through the ureters into the collecting systems, which opposes filtration and reduces urine output. Suprapubic fullness with anuria in a patient with known prostatic enlargement points to a mechanical cause, and bladder scanning or catheterisation confirms it quickly.",
    distractorRationales: {
      b: "Prerenal injury typically produces low-volume concentrated urine rather than complete anuria with a distended bladder.",
      c: "Acute tubular necrosis usually presents with non-oliguric or oliguric output and an active sediment, without suprapubic distension.",
      d: "Glomerulonephritis presents with haematuria, proteinuria, and often hypertension rather than bladder distension.",
    },
    keyClue: "Abrupt anuria with a palpable bladder is mechanical until proven otherwise.",
    clinicalTakeaway:
      "Obstruction is the most rapidly reversible cause of acute kidney injury, so relieving it early can prevent permanent damage — which makes prompt evaluation a priority.",
    remediationConcept:
      "Classify acute kidney injury by location: before the kidney is perfusion, within it is tubular, glomerular or interstitial, and after it is obstruction. Obstruction is the most reversible, so exclude it early with bladder assessment and imaging. Sudden anuria always raises it.",
    safetyPriority: true,
    tags: ["aki", "postrenal", "obstruction", "priority", "urology-link"],
  },
  {
    id: "r035",
    topic: "Intrinsic injury",
    category: "Acute kidney injury",
    difficulty: 4,
    type: "sata",
    stem: "Which factors increase the risk of contrast-associated acute kidney injury? Select all that apply.",
    options: [
      { id: "a", text: "Pre-existing chronic kidney disease" },
      { id: "b", text: "Intravascular volume depletion at the time of exposure" },
      { id: "c", text: "Concurrent use of other nephrotoxic agents" },
      { id: "d", text: "A high urine output in the hours before the study" },
      { id: "e", text: "Youth with normal baseline renal function" },
    ],
    correct: ["a", "b", "c"],
    rationale:
      "Contrast causes injury through medullary vasoconstriction and direct tubular toxicity, so risk rises whenever renal reserve is already reduced or perfusion is marginal. Reduced baseline function, volume depletion, and simultaneous nephrotoxin exposure each shrink that reserve, and their effects compound when present together.",
    distractorRationales: {
      d: "Good urine output before the study reflects adequate volume and perfusion, which is protective rather than harmful.",
      e: "Youth with normal baseline function indicates ample renal reserve and therefore lower risk.",
    },
    keyClue: "Risk tracks how little renal reserve remains before the insult arrives.",
    clinicalTakeaway:
      "This is why volume status is optimised and other nephrotoxins are reviewed before contrast rather than after creatinine has risen.",
    remediationConcept:
      "Contrast injures the kidney by constricting medullary vessels and damaging tubular cells directly. Anything that lowers renal reserve or perfusion beforehand raises the risk, and the factors compound. Assess reserve before the exposure, since prevention is far more effective than treatment.",
    safetyPriority: false,
    tags: ["aki", "contrast", "nephrotoxin", "prevention"],
  },
  {
    id: "r036",
    topic: "Intrinsic injury",
    category: "Acute kidney injury",
    difficulty: 4,
    type: "mcq",
    stem: "A patient develops a rising creatinine, fever, rash, and urinary white cells with eosinophils several days after starting a new medication. Which mechanism is most likely?",
    options: [
      { id: "a", text: "Acute interstitial nephritis from a hypersensitivity reaction" },
      { id: "b", text: "Acute tubular necrosis from direct tubular toxicity" },
      { id: "c", text: "Rapidly progressive glomerulonephritis" },
      { id: "d", text: "Cholesterol embolisation to the renal arterioles" },
    ],
    correct: ["a"],
    rationale:
      "The combination of fever, rash, and an inflammatory urinary sediment containing eosinophils several days after a new drug points to an immune-mediated reaction in the renal interstitium rather than a direct toxic effect. Inflammatory oedema surrounding the tubules impairs their function and reduces filtration.",
    distractorRationales: {
      b: "Direct tubular toxicity produces granular casts without the systemic allergic features of fever, rash, and eosinophils.",
      c: "Rapidly progressive glomerulonephritis presents with red cell casts and heavy proteinuria rather than an eosinophilic sediment.",
      d: "Cholesterol embolisation follows arterial instrumentation and causes livedo and distal ischaemic lesions rather than this allergic picture.",
    },
    keyClue: "Fever, rash, and urinary eosinophils after a new drug means interstitial, not tubular.",
    clinicalTakeaway:
      "Recovery usually depends on stopping the offending agent, so the medication list is reviewed with the prescriber promptly once this pattern is recognised.",
    remediationConcept:
      "Drugs injure the kidney by two distinct routes: direct tubular toxicity and immune-mediated interstitial inflammation. Systemic allergic features with urinary white cells and eosinophils indicate the interstitial route. Timing after drug initiation and the sediment together separate them.",
    safetyPriority: false,
    tags: ["aki", "interstitial-nephritis", "drug-induced", "urinalysis", "lab"],
  },
  {
    id: "r037",
    conceptKey: "renal-perfusion-determinants",
    topic: "Prerenal injury",
    category: "Acute kidney injury",
    difficulty: 5,
    type: "mcq",
    stem: "A patient with decompensated heart failure has a creatinine rising despite obvious peripheral oedema. Which mechanism best explains the renal impairment?",
    options: [
      { id: "a", text: "Low cardiac output and venous congestion together reducing the renal perfusion gradient" },
      { id: "b", text: "Excessive glomerular filtration from volume overload damaging the nephrons" },
      { id: "c", text: "Immune complex deposition within the glomerular capillaries" },
      { id: "d", text: "Direct pressure from peripheral oedema compressing the renal parenchyma" },
    ],
    correct: ["a"],
    rationale:
      "Renal perfusion depends on the difference between arterial inflow pressure and renal venous pressure. In decompensated heart failure, forward output falls while central venous pressure rises, so the gradient narrows from both ends. The kidney is congested rather than dry, which is why it can fail in a patient who is visibly overloaded.",
    distractorRationales: {
      b: "Volume overload does not raise filtration to injurious levels; filtration falls in this setting because the perfusion gradient narrows.",
      c: "Immune complex deposition describes glomerulonephritis and would produce an active urinary sediment.",
      d: "Peripheral oedema does not mechanically compress the kidney; the relevant pressure is within the renal veins.",
    },
    keyClue: "Perfusion is a gradient, so a high venous pressure impairs it just as a low arterial pressure does.",
    clinicalTakeaway:
      "This explains why careful decongestion can improve renal function in these patients, whereas giving fluid for a rising creatinine often worsens it.",
    remediationConcept:
      "Renal perfusion depends on the arterial-to-venous pressure gradient, not arterial pressure alone. Venous congestion narrows that gradient, so an overloaded patient can still have underperfused kidneys. Always assess both ends of the circuit before deciding a rising creatinine needs fluid.",
    safetyPriority: true,
    tags: ["aki", "prerenal", "congestion", "heart-failure-link", "hemodynamics", "priority"],
  },
  {
    id: "r038",
    topic: "Acute kidney injury staging",
    category: "Acute kidney injury",
    difficulty: 3,
    type: "mcq",
    stem: "Which parameters are used to stage the severity of acute kidney injury?",
    options: [
      { id: "a", text: "The magnitude of creatinine rise and the degree of urine output reduction" },
      { id: "b", text: "The serum potassium and the bicarbonate concentration" },
      { id: "c", text: "The degree of proteinuria and the presence of haematuria" },
      { id: "d", text: "The blood pressure and the presence of peripheral oedema" },
    ],
    correct: ["a"],
    rationale:
      "Staging systems grade acute kidney injury on two axes: the rise in serum creatinine from baseline, or a fall in estimated filtration rate, and the reduction in urine output measured over defined intervals. Either axis alone can establish a stage, and the higher of the two determines the final classification.",
    distractorRationales: {
      b: "Potassium and bicarbonate reflect complications that guide urgency of treatment but do not define the stage.",
      c: "Proteinuria and haematuria help identify the cause, particularly glomerular disease, rather than grade severity.",
      d: "Blood pressure and oedema describe volume status and contribute to the cause rather than the staging criteria.",
    },
    keyClue: "Staging asks how much filtration was lost and how little urine is being made.",
    clinicalTakeaway:
      "Because a baseline creatinine is needed to judge the rise, an unknown baseline makes staging uncertain and shifts weight onto urine output.",
    remediationConcept:
      "Acute kidney injury is staged on creatinine rise from baseline and on urine output over time, taking whichever is worse. Complications such as hyperkalaemia drive urgency but not stage. Cause and severity are separate assessments.",
    safetyPriority: false,
    tags: ["aki", "staging", "creatinine", "urine-output", "lab"],
  },
  {
    id: "r039",
    conceptKey: "postrenal-obstruction",
    topic: "Postrenal obstruction",
    category: "Acute kidney injury",
    difficulty: 4,
    type: "mcq",
    stem: "After relief of a prolonged urinary obstruction, a patient produces four litres of urine over six hours. Which mechanism explains this diuresis?",
    options: [
      { id: "a", text: "Retained solute load plus impaired tubular concentrating ability after obstruction" },
      { id: "b", text: "A surge in antidiuretic hormone release once pressure is relieved" },
      { id: "c", text: "Rebound aldosterone excess driving sodium and water retention" },
      { id: "d", text: "Recovery of glomerular filtration to supranormal levels" },
    ],
    correct: ["a"],
    rationale:
      "During obstruction, urea and other solutes accumulate and the pressure damages the tubules' ability to concentrate urine. When flow is restored, the retained solute acts as an osmotic load in tubules that cannot reabsorb water effectively, producing a large obligatory diuresis that can cause volume depletion and electrolyte loss.",
    distractorRationales: {
      b: "A surge in antidiuretic hormone would concentrate the urine and reduce volume, which is the opposite of what occurs.",
      c: "Aldosterone excess promotes sodium retention rather than the marked loss of salt and water seen here.",
      d: "Filtration recovers toward baseline rather than exceeding it, and the diuresis is driven by tubular and osmotic factors.",
    },
    keyClue: "Post-obstructive diuresis is osmotic plus tubular, so the patient can become volume depleted quickly.",
    clinicalTakeaway:
      "Urine output, volume status, and electrolytes are monitored closely after obstruction is relieved, with replacement guided by ongoing losses.",
    remediationConcept:
      "Relieving prolonged obstruction unmasks a retained solute load in tubules that have lost concentrating ability, causing a brisk diuresis. The risk shifts immediately from overload to depletion. Anticipate large losses of water and electrolytes and monitor accordingly.",
    safetyPriority: true,
    tags: ["aki", "postrenal", "diuresis", "priority", "fluid"],
  },
  {
    id: "r040",
    topic: "Intrinsic injury",
    category: "Acute kidney injury",
    difficulty: 4,
    type: "mcq",
    stem: "A patient found down after a prolonged period of immobility has a creatine kinase of 42,000 units/L and dark urine. Which mechanism threatens renal function?",
    options: [
      { id: "a", text: "Myoglobin precipitating in tubules with associated vasoconstriction and direct toxicity" },
      { id: "b", text: "Immune complex deposition along the glomerular basement membrane" },
      { id: "c", text: "Ureteral obstruction from crystal formation in the collecting system" },
      { id: "d", text: "Haemolysis producing free haemoglobin that blocks the glomerular filter" },
    ],
    correct: ["a"],
    rationale:
      "Injured muscle releases myoglobin, which is filtered and then precipitates in the acidic tubular environment, obstructing flow. It is also directly toxic to tubular cells and triggers renal vasoconstriction, while the fluid sequestered in damaged muscle causes volume depletion that worsens perfusion.",
    distractorRationales: {
      b: "Immune complex deposition causes glomerulonephritis and does not follow crush or immobility injury.",
      c: "Crystal-related obstruction occurs with certain drugs and metabolic disorders rather than with muscle breakdown.",
      d: "Haemolysis releases haemoglobin rather than myoglobin, and the very high creatine kinase points to muscle as the source.",
    },
    keyClue: "A very high creatine kinase with dark urine means myoglobin, and myoglobin threatens tubules.",
    clinicalTakeaway:
      "Early and generous fluid resuscitation to maintain urine flow is the mainstay of preventing this injury, alongside monitoring for hyperkalaemia from muscle breakdown.",
    remediationConcept:
      "Rhabdomyolysis injures the kidney three ways at once: tubular obstruction by precipitated myoglobin, direct tubular toxicity, and hypovolaemia from fluid sequestered in muscle. Maintaining urine flow addresses all three. Watch potassium closely, since damaged muscle releases it.",
    safetyPriority: true,
    tags: ["aki", "rhabdomyolysis", "myoglobin", "priority", "potassium"],
  },
];
