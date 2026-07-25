// R51–60 — Nephrotic and nephritic syndromes, glomerulonephritis, inherited disease.
// R051 is the first question behind the unlock.
// Original items written for Sleek Academia. No commercial test-bank content.

export default [
  {
    id: "r051",
    conceptKey: "nephrotic-vs-nephritic",
    topic: "Nephrotic syndrome",
    category: "Glomerular disease",
    difficulty: 3,
    type: "mcq",
    stem: "Which combination of findings defines nephrotic syndrome?",
    options: [
      { id: "a", text: "Heavy proteinuria, hypoalbuminaemia, oedema, and hyperlipidaemia" },
      { id: "b", text: "Haematuria, hypertension, oliguria, and red cell casts" },
      { id: "c", text: "Pyuria, bacteriuria, flank pain, and fever" },
      { id: "d", text: "Glycosuria, polyuria, ketonuria, and weight loss" },
    ],
    correct: ["a"],
    rationale:
      "Nephrotic syndrome reflects a leaky filtration barrier rather than an inflamed one. Podocyte injury allows large amounts of albumin through, so serum albumin falls, oncotic pressure drops and oedema develops. The liver responds to low oncotic pressure by increasing lipoprotein synthesis, producing the accompanying hyperlipidaemia.",
    distractorRationales: {
      b: "Haematuria with red cell casts, hypertension, and oliguria describes nephritic syndrome, in which inflammation rather than leakiness dominates.",
      c: "Pyuria, bacteriuria, flank pain, and fever indicate urinary tract infection involving the kidney.",
      d: "Glycosuria with polyuria and ketonuria reflects uncontrolled diabetes rather than a glomerular syndrome.",
    },
    keyClue: "Nephrotic leaks protein; nephritic leaks blood.",
    clinicalTakeaway:
      "Loss of antithrombin and other regulatory proteins in the urine creates a hypercoagulable state, so these patients face a real thrombotic risk.",
    remediationConcept:
      "Separate the two glomerular syndromes by what escapes the barrier. Nephrotic disease is a leak: heavy protein loss, low albumin, oedema, and hyperlipidaemia. Nephritic disease is inflammation: blood, red cell casts, hypertension, and falling filtration.",
    safetyPriority: false,
    tags: ["nephrotic", "proteinuria", "albumin", "glomerulus"],
  },
  {
    id: "r052",
    conceptKey: "nephrotic-vs-nephritic",
    topic: "Nephritic syndrome",
    category: "Glomerular disease",
    difficulty: 3,
    type: "mcq",
    stem: "A patient develops haematuria, hypertension, and reduced urine output two weeks after a streptococcal throat infection. Which mechanism explains these findings?",
    options: [
      { id: "a", text: "Immune complex deposition triggering glomerular inflammation" },
      { id: "b", text: "Direct bacterial invasion of the glomerular capillaries" },
      { id: "c", text: "Podocyte fusion causing selective albumin loss" },
      { id: "d", text: "Obstruction of the renal collecting system by debris" },
    ],
    correct: ["a"],
    rationale:
      "Antibodies formed against streptococcal antigens create circulating immune complexes that lodge in the glomerular capillary wall. Complement activation and neutrophil recruitment follow, so the capillary becomes inflamed and leaks red cells while filtration falls. The delay of one to three weeks is the time needed to mount that antibody response.",
    distractorRationales: {
      b: "The organism is not present in the kidney; the injury is immune-mediated and occurs after the infection has resolved.",
      c: "Podocyte fusion with selective albumin loss describes minimal change disease, a nephrotic rather than nephritic process.",
      d: "Obstruction is a postrenal mechanism and would not follow a throat infection or produce red cell casts.",
    },
    keyClue: "The one-to-three week delay is the fingerprint of an immune-complex process.",
    clinicalTakeaway:
      "Because the process is immune rather than infective, antibiotics do not treat the nephritis; care is supportive while inflammation resolves.",
    remediationConcept:
      "Separate the two glomerular syndromes by what escapes the barrier. Nephritic disease is inflammatory: red cells and red cell casts appear, blood pressure rises, and filtration falls. A latency of one to three weeks after infection points to immune complex deposition rather than direct infection.",
    safetyPriority: false,
    tags: ["nephritic", "immune-complex", "hematuria", "glomerulus"],
  },
  {
    id: "r053",
    topic: "Glomerulonephritis",
    category: "Glomerular disease",
    difficulty: 5,
    type: "mcq",
    stem: "A patient has haemoptysis, a rising creatinine over days, and red cell casts. Which process most likely accounts for this combination?",
    options: [
      { id: "a", text: "Antibodies directed against the shared alveolar and glomerular basement membrane" },
      { id: "b", text: "Bacterial pneumonia with secondary prerenal azotaemia" },
      { id: "c", text: "Pulmonary oedema from acute volume overload" },
      { id: "d", text: "Minimal change disease with an incidental respiratory infection" },
    ],
    correct: ["a"],
    rationale:
      "The alveolar and glomerular basement membranes share collagen epitopes, so an antibody raised against one attacks both. The result is simultaneous alveolar haemorrhage and rapidly progressive glomerulonephritis. The pace matters: creatinine rising over days with an active sediment defines a rapidly progressive process needing prompt diagnosis.",
    distractorRationales: {
      b: "Pneumonia with prerenal azotaemia would not produce red cell casts, which indicate glomerular bleeding.",
      c: "Pulmonary oedema causes frothy pink sputum rather than frank haemoptysis and does not cause red cell casts.",
      d: "Minimal change disease causes heavy proteinuria without haematuria or pulmonary involvement.",
    },
    keyClue: "Lung bleeding plus red cell casts means one antibody attacking two basement membranes.",
    clinicalTakeaway:
      "Rapidly progressive glomerulonephritis can destroy renal function within weeks, so this presentation warrants urgent evaluation rather than routine outpatient workup.",
    remediationConcept:
      "When a single antibody targets an antigen shared by two organs, both are injured together. Pulmonary haemorrhage with an active urinary sediment is the classic pairing. Judge urgency by the rate of creatinine rise, since rapidly progressive disease is measured in days to weeks.",
    safetyPriority: true,
    tags: ["glomerulonephritis", "rpgn", "autoantibody", "priority"],
  },
  {
    id: "r054",
    conceptKey: "nephrotic-vs-nephritic",
    topic: "Nephrotic syndrome",
    category: "Glomerular disease",
    difficulty: 4,
    type: "mcq",
    stem: "Why does nephrotic syndrome predispose to venous thromboembolism?",
    options: [
      { id: "a", text: "Urinary loss of anticoagulant proteins alongside increased hepatic procoagulant synthesis" },
      { id: "b", text: "Platelet counts rising above one million per microlitre" },
      { id: "c", text: "Direct activation of factor X by filtered albumin" },
      { id: "d", text: "Reduced hepatic clearance of activated clotting factors" },
    ],
    correct: ["a"],
    rationale:
      "The damaged barrier is not selective for albumin alone. Smaller regulatory proteins including antithrombin are lost in the urine, while the liver responds to low oncotic pressure by increasing synthesis of fibrinogen and other procoagulants. Losing brakes while adding accelerator produces a genuinely hypercoagulable state.",
    distractorRationales: {
      b: "Platelet counts are not typically raised to that degree; the risk comes from altered plasma protein balance rather than platelet number.",
      c: "Filtered albumin does not activate the coagulation cascade directly.",
      d: "Hepatic clearance of clotting factors is not the limiting problem; synthesis and urinary loss are.",
    },
    keyClue: "Losing anticoagulants in urine while making more procoagulants tips the balance toward clotting.",
    clinicalTakeaway:
      "Renal vein thrombosis presenting as flank pain with worsening function is a recognised complication and warrants prompt evaluation.",
    remediationConcept:
      "A damaged glomerular barrier leaks more than albumin: anticoagulant proteins such as antithrombin escape too, while the liver ramps up procoagulant synthesis. The net effect is hypercoagulability. Think of clotting as a balance of brakes and accelerators rather than a single factor.",
    safetyPriority: false,
    tags: ["nephrotic", "thrombosis", "antithrombin", "coagulation"],
  },
  {
    id: "r055",
    topic: "Inherited kidney disease",
    category: "Glomerular disease",
    difficulty: 3,
    type: "mcq",
    stem: "Which finding is most characteristic of autosomal dominant polycystic kidney disease?",
    options: [
      { id: "a", text: "Bilaterally enlarged kidneys with progressive cyst formation and hypertension" },
      { id: "b", text: "Small scarred kidneys with heavy proteinuria in childhood" },
      { id: "c", text: "A single obstructing cyst causing unilateral hydronephrosis" },
      { id: "d", text: "Normal-sized kidneys with isolated microscopic haematuria" },
    ],
    correct: ["a"],
    rationale:
      "Mutations in polycystin genes cause tubular epithelial cells to proliferate and secrete fluid, forming cysts that expand over decades. The kidneys enlarge substantially while functional parenchyma is compressed and replaced. Cyst expansion activates the renin-angiotensin system locally, so hypertension often appears before filtration declines.",
    distractorRationales: {
      b: "Small scarred kidneys with childhood proteinuria suggest reflux nephropathy or a congenital glomerular disorder rather than this condition.",
      c: "A single obstructing cyst is a simple structural finding, not the diffuse bilateral cystic replacement of this disease.",
      d: "Isolated microscopic haematuria with normal-sized kidneys suggests a thin basement membrane condition instead.",
    },
    keyClue: "Bilateral enlargement with early hypertension distinguishes this from scarring diseases, which shrink kidneys.",
    clinicalTakeaway:
      "Associated intracranial aneurysms mean that a severe sudden headache in these patients warrants urgent evaluation rather than symptomatic treatment.",
    remediationConcept:
      "Kidney size helps sort chronic disease: cystic disease enlarges the kidneys, while most scarring processes shrink them. In polycystic disease, hypertension often precedes any fall in filtration because expanding cysts activate the renin-angiotensin system locally. Remember the extrarenal associations.",
    safetyPriority: true,
    tags: ["pkd", "genetic", "hypertension", "priority"],
  },
  {
    id: "r056",
    topic: "Nephrotic syndrome",
    category: "Glomerular disease",
    difficulty: 4,
    type: "mcq",
    stem: "Why does oedema develop in nephrotic syndrome?",
    options: [
      { id: "a", text: "Reduced plasma oncotic pressure plus renal sodium retention favouring interstitial fluid accumulation" },
      { id: "b", text: "Increased capillary hydrostatic pressure from expanded arterial volume" },
      { id: "c", text: "Lymphatic obstruction preventing interstitial fluid return" },
      { id: "d", text: "Increased interstitial oncotic pressure drawing fluid outward" },
    ],
    correct: ["a"],
    rationale:
      "Two mechanisms act together. Loss of albumin lowers plasma oncotic pressure, so less fluid is drawn back into the capillary at its venous end. The kidney simultaneously retains sodium, both as a response to reduced effective circulating volume and through primary tubular sodium avidity, which expands the interstitium further.",
    distractorRationales: {
      b: "Arterial volume is typically reduced or normal rather than expanded, and raised hydrostatic pressure is the mechanism in heart failure.",
      c: "Lymphatic obstruction causes localised lymphoedema rather than the generalised oedema of this syndrome.",
      d: "Interstitial oncotic pressure does not rise appreciably; the driving change is the fall in plasma oncotic pressure.",
    },
    keyClue: "Low albumin explains part of the oedema; renal sodium retention explains the rest.",
    clinicalTakeaway:
      "Because sodium retention contributes independently, sodium restriction and diuretics help even when serum albumin remains low.",
    remediationConcept:
      "Oedema results from an imbalance in Starling forces plus renal sodium handling. In nephrotic syndrome, low albumin reduces oncotic pressure while the kidney retains sodium. Name which Starling force has changed before explaining any oedema.",
    safetyPriority: false,
    tags: ["nephrotic", "edema", "oncotic", "sodium"],
  },
  {
    id: "r057",
    topic: "Glomerulonephritis",
    category: "Glomerular disease",
    difficulty: 4,
    type: "mcq",
    stem: "Which urinary finding best indicates that haematuria originates in the glomerulus rather than the lower urinary tract?",
    options: [
      { id: "a", text: "Dysmorphic red cells with red cell casts and proteinuria" },
      { id: "b", text: "Bright red blood with clots at the end of voiding" },
      { id: "c", text: "Uniform red cells with abundant squamous epithelial cells" },
      { id: "d", text: "Blood appearing only at the start of the urinary stream" },
    ],
    correct: ["a"],
    rationale:
      "Red cells squeezed through a damaged glomerular basement membrane are deformed, and some become trapped in tubular protein to form casts. Accompanying proteinuria reflects the same barrier damage. Together these three findings localise bleeding to the glomerulus rather than anywhere downstream.",
    distractorRationales: {
      b: "Clots indicate brisk bleeding from a lower tract source, since blood arising in the nephron does not usually clot.",
      c: "Uniform red cells with squamous cells suggest a lower tract or contamination source rather than glomerular bleeding.",
      d: "Blood confined to the start of the stream points to a urethral source.",
    },
    keyClue: "Deformed red cells, casts, and protein together mean the bleeding started in the glomerulus.",
    clinicalTakeaway:
      "This distinction directs the workup: glomerular haematuria prompts renal evaluation, while lower tract bleeding prompts urological imaging and cystoscopy.",
    remediationConcept:
      "Localise haematuria before investigating it. Dysmorphic red cells, red cell casts, and proteinuria indicate a glomerular source; clots, uniform red cells, and timing within the stream indicate a lower tract source. The sediment answers the question more cheaply than imaging.",
    safetyPriority: false,
    tags: ["hematuria", "urinalysis", "glomerulus", "lab"],
  },
  {
    id: "r058",
    topic: "Nephrotic syndrome",
    category: "Glomerular disease",
    difficulty: 5,
    type: "mcq",
    stem: "A patient with long-standing diabetes has an albumin-to-creatinine ratio of 850 mg/g and an estimated filtration rate of 44 mL/min. Which statement best characterises the stage of disease?",
    options: [
      { id: "a", text: "Both damage and function are substantially abnormal, indicating high risk of progression" },
      { id: "b", text: "Damage is present but function is normal, indicating low risk" },
      { id: "c", text: "Function is reduced but damage is absent, suggesting a prerenal cause" },
      { id: "d", text: "Neither value is abnormal enough to warrant a diagnosis" },
    ],
    correct: ["a"],
    rationale:
      "The two staging axes are read together. An albumin-to-creatinine ratio above 300 mg/g represents severely increased albuminuria, and a filtration rate of 44 mL/min represents a moderate to severe reduction. Abnormality on both axes places the patient in a high-risk category for progression and for cardiovascular events.",
    distractorRationales: {
      b: "Filtration is clearly reduced at 44 mL/min, so function is not normal.",
      c: "Heavy albuminuria indicates structural glomerular damage, which is inconsistent with a purely prerenal explanation.",
      d: "Both values are well outside their reference ranges and each independently meets criteria for chronic kidney disease.",
    },
    keyClue: "Read filtration and albuminuria as two axes; abnormality on both compounds risk.",
    clinicalTakeaway:
      "High-risk staging shortens monitoring intervals and strengthens the case for therapies that reduce proteinuria and slow progression.",
    remediationConcept:
      "Stage chronic kidney disease on filtration rate and albuminuria together, since they measure function and damage separately. Risk rises as either worsens and compounds when both do. Interpret the pair rather than whichever number is more familiar.",
    safetyPriority: false,
    tags: ["ckd", "albuminuria", "diabetes", "staging", "lab"],
  },
  {
    id: "r059",
    topic: "Nephritic syndrome",
    category: "Glomerular disease",
    difficulty: 4,
    type: "mcq",
    stem: "Why does hypertension commonly accompany acute nephritic syndrome?",
    options: [
      { id: "a", text: "Reduced filtration causes sodium and water retention that expands intravascular volume" },
      { id: "b", text: "Inflamed glomeruli release renin in quantities that directly raise pressure" },
      { id: "c", text: "Red cells in the tubular lumen obstruct flow and raise systemic pressure" },
      { id: "d", text: "Loss of albumin raises plasma oncotic pressure and expands volume" },
    ],
    correct: ["a"],
    rationale:
      "Glomerular inflammation reduces the filtering surface, so sodium and water excretion falls. The retained volume expands the intravascular space and raises blood pressure. This is a volume-dependent hypertension, which is why it responds to sodium restriction and diuresis rather than requiring vasodilators alone.",
    distractorRationales: {
      b: "Renin is typically suppressed rather than elevated in volume-expanded nephritic states.",
      c: "Tubular red cells do not obstruct enough flow to raise systemic pressure.",
      d: "Albumin loss lowers rather than raises oncotic pressure, and heavy albumin loss characterises nephrotic rather than nephritic syndrome.",
    },
    keyClue: "Nephritic hypertension is a volume problem, so it answers to sodium and diuresis.",
    clinicalTakeaway:
      "Recognising the volume basis prevents the error of treating this hypertension while continuing generous fluid administration.",
    remediationConcept:
      "Identify whether hypertension is volume-dependent or vasoconstriction-dependent, because the mechanism dictates the treatment. Reduced filtration in nephritic syndrome retains sodium and water, producing volume-dependent hypertension. Sodium restriction and diuresis address the cause.",
    safetyPriority: false,
    tags: ["nephritic", "hypertension", "volume", "sodium"],
  },
  {
    id: "r060",
    topic: "Glomerulonephritis",
    category: "Glomerular disease",
    difficulty: 4,
    type: "mcq",
    stem: "Which mechanism explains the proteinuria of glomerular disease?",
    options: [
      { id: "a", text: "Loss of the size and charge selectivity of the filtration barrier" },
      { id: "b", text: "Saturation of proximal tubular protein reabsorption by normal filtered load" },
      { id: "c", text: "Increased hepatic albumin synthesis exceeding renal clearance" },
      { id: "d", text: "Reduced antidiuretic hormone activity concentrating urinary protein" },
    ],
    correct: ["a"],
    rationale:
      "The healthy barrier restricts protein by both size and charge: the basement membrane and podocyte slit diaphragm exclude large molecules, and fixed negative charges repel albumin. Damage to podocytes or the basement membrane removes that selectivity, so albumin passes in quantities that overwhelm tubular reabsorption.",
    distractorRationales: {
      b: "Under normal conditions very little protein is filtered, so tubular capacity is not saturated unless filtration becomes abnormal.",
      c: "Hepatic synthesis rises in response to urinary losses; it is a consequence rather than the cause of proteinuria.",
      d: "Antidiuretic hormone affects water handling and can alter concentration but does not cause true protein loss.",
    },
    keyClue: "The barrier filters by size and by charge, so losing either lets albumin through.",
    clinicalTakeaway:
      "Because albumin is negatively charged, loss of charge selectivity alone can produce significant albuminuria before any structural gap is visible.",
    remediationConcept:
      "The glomerular barrier excludes protein by size and by negative charge. Losing either form of selectivity produces proteinuria, and tubular reabsorption is quickly overwhelmed. Ask which property of the barrier has failed rather than treating proteinuria as a single finding.",
    safetyPriority: false,
    tags: ["proteinuria", "glomerulus", "barrier", "podocyte"],
  },
];
