// R61–70 — Urinary tract infection, stones, prostatic obstruction, bladder dysfunction.
// Original items written for Sleek Academia. No commercial test-bank content.

export default [
  {
    id: "r061",
    conceptKey: "upper-vs-lower-urinary-infection",
    topic: "Urinary tract infection",
    category: "Urologic disorders",
    difficulty: 3,
    type: "mcq",
    stem: "Which findings distinguish pyelonephritis from uncomplicated cystitis?",
    options: [
      { id: "a", text: "Fever, flank pain, and costovertebral tenderness" },
      { id: "b", text: "Dysuria, urinary frequency, and suprapubic discomfort" },
      { id: "c", text: "Cloudy urine with a positive nitrite result" },
      { id: "d", text: "Urinary urgency with incomplete bladder emptying" },
    ],
    correct: ["a"],
    rationale:
      "Both conditions produce lower tract irritation, so dysuria and frequency cannot separate them. Systemic features are the discriminator: fever, rigors, flank pain, and costovertebral angle tenderness indicate that infection has reached the renal parenchyma, where it can cause scarring and enter the bloodstream.",
    distractorRationales: {
      b: "Dysuria, frequency, and suprapubic discomfort occur in cystitis and may also accompany upper tract infection, so they do not localise it.",
      c: "Cloudy urine with a positive nitrite result confirms bacteriuria without indicating how far up the tract infection has spread.",
      d: "Urgency with incomplete emptying suggests bladder outlet or storage dysfunction rather than upper tract infection.",
    },
    keyClue: "Systemic signs mean the kidney is involved; local irritation alone does not.",
    clinicalTakeaway:
      "Upper tract infection carries a risk of bacteraemia and permanent scarring, so it is treated more aggressively and for longer than cystitis.",
    remediationConcept:
      "Localise urinary infection by looking for systemic involvement rather than by symptoms of bladder irritation, which occur in both. Fever, flank pain, and costovertebral tenderness indicate renal parenchymal infection. That distinction drives the difference in urgency and treatment duration.",
    safetyPriority: false,
    tags: ["uti", "pyelonephritis", "infection", "assessment"],
  },
  {
    id: "r062",
    topic: "Urinary tract infection",
    category: "Urologic disorders",
    difficulty: 4,
    type: "sata",
    stem: "Which factors increase the risk of urinary tract infection by impairing normal defences? Select all that apply.",
    options: [
      { id: "a", text: "Incomplete bladder emptying leaving residual urine" },
      { id: "b", text: "An indwelling urinary catheter" },
      { id: "c", text: "Vesicoureteral reflux allowing retrograde urine flow" },
      { id: "d", text: "A high daily fluid intake with frequent voiding" },
      { id: "e", text: "An acidic urinary pH with normal urine osmolality" },
    ],
    correct: ["a", "b", "c"],
    rationale:
      "The urinary tract defends itself chiefly by flushing organisms out and by maintaining an unbroken mucosal barrier. Residual urine provides a reservoir for multiplication, a catheter bypasses the urethral barrier and offers a surface for biofilm, and reflux carries organisms upward toward the kidney. Each defeats one of those defences.",
    distractorRationales: {
      d: "Generous intake with frequent voiding enhances mechanical flushing and is protective rather than harmful.",
      e: "An acidic pH inhibits growth of many uropathogens, so it supports rather than impairs defence.",
    },
    keyClue: "Ask whether the factor interrupts flushing or breaches the mucosal barrier.",
    clinicalTakeaway:
      "Because catheters defeat the barrier directly, limiting their use and duration is the single most effective preventive measure.",
    remediationConcept:
      "The urinary tract's main defences are unidirectional flow that flushes organisms out and an intact mucosal barrier. Stasis, instrumentation, and reflux each defeat one of them. Classify every risk factor by which defence it removes.",
    safetyPriority: false,
    tags: ["uti", "risk-factors", "catheter", "stasis", "prevention"],
  },
  {
    id: "r063",
    topic: "Nephrolithiasis",
    category: "Urologic disorders",
    difficulty: 3,
    type: "mcq",
    stem: "Which mechanism explains the severe colicky flank pain of an obstructing ureteral stone?",
    options: [
      { id: "a", text: "Ureteral distension and spasm proximal to the obstruction" },
      { id: "b", text: "Direct erosion of the stone through the ureteral wall" },
      { id: "c", text: "Inflammation of the renal capsule from infection" },
      { id: "d", text: "Ischaemia of the bladder wall from raised pressure" },
    ],
    correct: ["a"],
    rationale:
      "Urine continues to be produced behind the obstruction, so pressure rises and the ureter distends. Stretch receptors in the smooth muscle trigger vigorous peristaltic contraction against the blockage, and this combination of distension and spasm produces pain that waxes and wanes rather than staying constant.",
    distractorRationales: {
      b: "Stones rarely erode the wall; the pain arises from pressure and muscular contraction rather than perforation.",
      c: "Capsular inflammation from infection produces steady rather than colicky pain and is accompanied by fever.",
      d: "Bladder wall ischaemia is not a feature of ureteral obstruction, and the pain localises to the flank rather than the suprapubic area.",
    },
    keyClue: "Colicky pain means a hollow muscular tube is contracting against something blocking it.",
    clinicalTakeaway:
      "Obstruction combined with fever suggests infection behind the blockage, which is a urological emergency requiring urgent evaluation for drainage.",
    remediationConcept:
      "Colic arises when a hollow muscular organ contracts against an obstruction, so the pain rises and falls with peristalsis. Distension plus spasm explains its severity. Constant pain with fever suggests infection or inflammation instead.",
    safetyPriority: true,
    tags: ["stones", "obstruction", "pain", "priority", "urology"],
  },
  {
    id: "r064",
    topic: "Nephrolithiasis",
    category: "Urologic disorders",
    difficulty: 4,
    type: "mcq",
    stem: "Which condition most favours the formation of calcium oxalate stones?",
    options: [
      { id: "a", text: "Persistently concentrated urine with hypercalciuria and low citrate" },
      { id: "b", text: "Persistently alkaline urine with a urea-splitting organism" },
      { id: "c", text: "A high urine volume with an alkaline pH and high citrate" },
      { id: "d", text: "Low urinary uric acid with a neutral urinary pH" },
    ],
    correct: ["a"],
    rationale:
      "Stone formation requires supersaturation plus a shortage of inhibitors. Concentrated urine raises solute concentration, hypercalciuria supplies more calcium, and citrate normally binds calcium to keep it in solution, so low citrate removes that protection. All three factors push the same direction.",
    distractorRationales: {
      b: "Alkaline urine with a urea-splitting organism favours struvite stones, which have a different composition and mechanism.",
      c: "High volume with abundant citrate is protective, since it lowers concentration and supplies an inhibitor.",
      d: "Low urinary uric acid reduces rather than increases the risk of uric acid stone formation.",
    },
    keyClue: "Stones need supersaturation plus missing inhibitors — check both sides of the balance.",
    clinicalTakeaway:
      "This is why increasing fluid intake is the most broadly effective preventive measure across nearly all stone types.",
    remediationConcept:
      "Stones form when urine is supersaturated with a salt and short of inhibitors such as citrate. Concentration, solute load, and pH determine which salt precipitates. Assess both supersaturation and inhibitor availability rather than one alone.",
    safetyPriority: false,
    tags: ["stones", "calcium", "citrate", "urine-ph", "prevention"],
  },
  {
    id: "r065",
    conceptKey: "bladder-outlet-obstruction",
    topic: "Prostatic obstruction",
    category: "Urologic disorders",
    difficulty: 3,
    type: "mcq",
    stem: "Which symptoms would be expected from bladder outlet obstruction caused by prostatic enlargement?",
    options: [
      { id: "a", text: "Hesitancy, a weak stream, and a sensation of incomplete emptying" },
      { id: "b", text: "Painless gross haematuria with clot passage" },
      { id: "c", text: "Sudden flank pain radiating to the groin" },
      { id: "d", text: "Continuous leakage of urine without any urge" },
    ],
    correct: ["a"],
    rationale:
      "Obstruction raises the resistance the detrusor must overcome. Voiding therefore starts slowly, the stream is weak, and the bladder empties incompletely, which leaves residual urine. Over time the detrusor hypertrophies and becomes overactive, adding storage symptoms such as frequency and nocturia.",
    distractorRationales: {
      b: "Painless gross haematuria with clots raises concern for a urothelial tumour and requires separate evaluation.",
      c: "Flank pain radiating to the groin is characteristic of ureteral colic from a stone.",
      d: "Continuous leakage without urge suggests a fistula or sphincter incompetence rather than obstruction.",
    },
    keyClue: "Obstruction produces voiding difficulty first; the storage symptoms follow as the detrusor changes.",
    clinicalTakeaway:
      "Persistent residual urine predisposes to infection and, if obstruction is unrelieved, to hydronephrosis and postrenal kidney injury.",
    remediationConcept:
      "Separate voiding symptoms from storage symptoms. Obstruction impairs emptying first, producing hesitancy, weak stream, and residual urine; detrusor changes later add frequency and urgency. Sorting the symptoms this way localises the problem.",
    safetyPriority: false,
    tags: ["bph", "obstruction", "voiding", "urology"],
  },
  {
    id: "r066",
    conceptKey: "bladder-outlet-obstruction",
    topic: "Hydronephrosis",
    category: "Urologic disorders",
    difficulty: 4,
    type: "mcq",
    stem: "How does chronic unrelieved lower urinary tract obstruction damage the kidney?",
    options: [
      { id: "a", text: "Transmitted back-pressure dilates the collecting system and compresses the parenchyma" },
      { id: "b", text: "Bacteria ascend the ureters and cause immune complex glomerulonephritis" },
      { id: "c", text: "Reduced arterial inflow causes cortical infarction" },
      { id: "d", text: "Filtered protein precipitates within the tubular lumen" },
    ],
    correct: ["a"],
    rationale:
      "Pressure generated below is transmitted retrogradely through the ureters into the renal pelvis and calyces, which dilate. Sustained raised pressure compresses the surrounding parenchyma, opposes filtration, and progressively destroys tubules, producing atrophy and permanent loss of function if the obstruction is not relieved.",
    distractorRationales: {
      b: "Ascending infection causes pyelonephritis rather than immune complex glomerulonephritis, and infection is a complication rather than the mechanism of pressure injury.",
      c: "The primary injury is pressure-mediated compression rather than arterial occlusion, though severe pressure does reduce medullary blood flow.",
      d: "Protein precipitation within tubules occurs in specific disorders and is not the mechanism of obstructive damage.",
    },
    keyClue: "Obstruction injures by pressure transmitted backwards, so the damage is mechanical.",
    clinicalTakeaway:
      "Because recovery depends on how long pressure persisted, prompt relief of obstruction protects function and warrants urgent evaluation.",
    remediationConcept:
      "Obstruction anywhere below the kidney transmits pressure backwards, dilating the collecting system and compressing the parenchyma. The injury is mechanical and time-dependent, so early relief preserves function. Duration matters more than the degree of dilation.",
    safetyPriority: true,
    tags: ["hydronephrosis", "obstruction", "postrenal", "priority"],
  },
  {
    id: "r067",
    topic: "Bladder dysfunction",
    category: "Urologic disorders",
    difficulty: 4,
    type: "mcq",
    stem: "Which mechanism best explains stress urinary incontinence?",
    options: [
      { id: "a", text: "Weakened pelvic support allowing abdominal pressure to exceed urethral closing pressure" },
      { id: "b", text: "Involuntary detrusor contractions during bladder filling" },
      { id: "c", text: "Loss of the sensation of bladder fullness from neuropathy" },
      { id: "d", text: "Chronic outlet obstruction producing overflow leakage" },
    ],
    correct: ["a"],
    rationale:
      "Continence depends on urethral closing pressure exceeding bladder pressure. When pelvic floor support weakens, a cough or lift raises abdominal and therefore bladder pressure above the closing pressure and urine escapes. There is no urge, because the detrusor is not contracting.",
    distractorRationales: {
      b: "Involuntary detrusor contractions during filling produce urge incontinence, in which leakage is preceded by a strong urge.",
      c: "Loss of fullness sensation contributes to neurogenic bladder with retention and overflow rather than pressure-related leakage.",
      d: "Overflow from chronic obstruction produces continuous dribbling with a distended bladder rather than leakage on exertion.",
    },
    keyClue: "Leakage on effort without urge is a pressure problem; leakage after urge is a detrusor problem.",
    clinicalTakeaway:
      "Distinguishing the type matters because pelvic floor training targets stress incontinence while bladder retraining targets urge incontinence.",
    remediationConcept:
      "Continence is a contest between bladder pressure and urethral closing pressure. Stress incontinence occurs when effort raises bladder pressure above a weakened closing pressure; urge incontinence occurs when the detrusor contracts on its own. Ask whether urge preceded the leak.",
    safetyPriority: false,
    tags: ["incontinence", "bladder", "pelvic-floor", "urology"],
  },
  {
    id: "r068",
    topic: "Urinary tract infection",
    category: "Urologic disorders",
    difficulty: 4,
    type: "mcq",
    stem: "An older patient with bacteriuria has no dysuria, frequency, fever, or suprapubic pain. Which interpretation is most appropriate?",
    options: [
      { id: "a", text: "Asymptomatic bacteriuria, which generally does not require antibiotic treatment" },
      { id: "b", text: "Early pyelonephritis requiring immediate broad antibiotic therapy" },
      { id: "c", text: "Contamination that should be disregarded entirely" },
      { id: "d", text: "Chronic cystitis requiring long-term suppressive therapy" },
    ],
    correct: ["a"],
    rationale:
      "Bacteriuria without urinary symptoms or systemic features represents colonisation rather than infection, and it becomes more common with age. Treating it does not reduce symptomatic episodes or mortality, while it does promote resistance and adverse effects, so the finding is interpreted alongside the clinical picture.",
    distractorRationales: {
      b: "Pyelonephritis requires systemic features such as fever and flank pain, none of which are present.",
      c: "The result is meaningful information about colonisation rather than something to disregard; it simply does not by itself indicate treatment.",
      d: "Suppressive therapy is reserved for specific recurrent symptomatic infection rather than asymptomatic colonisation.",
    },
    keyClue: "Bacteria in urine is a laboratory finding; infection requires symptoms.",
    clinicalTakeaway:
      "Because confusion in an older adult has many causes, bacteriuria alone does not establish infection as the explanation, so other causes are evaluated too.",
    remediationConcept:
      "Distinguish colonisation from infection: bacteriuria is a laboratory finding, while infection requires clinical features. Treating asymptomatic bacteriuria adds resistance and adverse effects without benefit in most groups. Interpret every culture alongside the patient.",
    safetyPriority: false,
    tags: ["uti", "asymptomatic-bacteriuria", "stewardship", "lab"],
  },
  {
    id: "r069",
    topic: "Bladder dysfunction",
    category: "Urologic disorders",
    difficulty: 5,
    type: "mcq",
    stem: "A patient with a spinal cord injury above the level of the sacral micturition centre develops reflex bladder contractions with simultaneous sphincter contraction. What is the principal risk?",
    options: [
      { id: "a", text: "High intravesical pressure transmitted to the upper tracts causing renal damage" },
      { id: "b", text: "Progressive bladder atony with painless overdistension only" },
      { id: "c", text: "Urethral stricture formation from repeated contraction" },
      { id: "d", text: "Loss of renal concentrating ability from sacral denervation" },
    ],
    correct: ["a"],
    rationale:
      "When the detrusor contracts while the sphincter fails to relax, the bladder generates high pressure against a closed outlet. That pressure is transmitted retrogradely to the ureters and kidneys, promoting reflux and hydronephrosis. The threat to the kidneys, rather than the incontinence itself, is what drives management.",
    distractorRationales: {
      b: "Atony with painless overdistension follows injury at or below the sacral centre, which abolishes the reflex rather than making it uncoordinated.",
      c: "Stricture formation is not a typical consequence of this coordination failure.",
      d: "Concentrating ability depends on the nephron rather than on sacral innervation of the bladder.",
    },
    keyClue: "Detrusor contracting against a closed sphincter generates the pressure that endangers the kidneys.",
    clinicalTakeaway:
      "Because upper tract damage can progress silently, surveillance of renal function and bladder pressure matters even when continence appears manageable.",
    remediationConcept:
      "Bladder pressure, not incontinence, threatens the kidneys. When the detrusor contracts against a sphincter that does not relax, high pressure transmits upward and causes reflux and hydronephrosis. Injury level predicts whether the bladder becomes overactive or areflexic.",
    safetyPriority: true,
    tags: ["neurogenic-bladder", "pressure", "hydronephrosis", "priority"],
  },
  {
    id: "r070",
    topic: "Prostatic obstruction",
    category: "Urologic disorders",
    difficulty: 3,
    type: "mcq",
    stem: "A patient is unable to pass urine for ten hours and has a tender distended suprapubic mass. Which action is the priority?",
    options: [
      { id: "a", text: "Arrange urgent bladder decompression after confirming retention" },
      { id: "b", text: "Encourage increased oral fluids and reassess in the morning" },
      { id: "c", text: "Obtain a urine culture before taking any further action" },
      { id: "d", text: "Apply a warm compress and provide privacy to promote voiding" },
    ],
    correct: ["a"],
    rationale:
      "Acute retention causes progressive bladder distension, severe discomfort, and rising pressure that can be transmitted to the kidneys. Confirming retention by bladder scan and then decompressing relieves pain and protects renal function. Delay risks detrusor injury and postrenal kidney injury.",
    distractorRationales: {
      b: "Increasing fluids adds volume to a bladder that cannot empty, worsening distension and pain.",
      c: "A culture may be appropriate later, but obtaining it does not address the distension that is causing harm now.",
      d: "Comfort measures are reasonable for hesitancy but are inadequate for established retention with a distended bladder.",
    },
    keyClue: "A distended painful bladder that cannot empty needs decompression, not more fluid or more time.",
    clinicalTakeaway:
      "Output is monitored after decompression, since a large retained volume can be followed by a brisk post-obstructive diuresis.",
    remediationConcept:
      "Acute urinary retention is a mechanical emergency: relieve the obstruction to stop pain and protect the kidneys. Adding fluid or waiting worsens distension. Anticipate post-obstructive diuresis once the bladder is decompressed.",
    safetyPriority: true,
    tags: ["retention", "obstruction", "priority", "urology"],
  },
];
