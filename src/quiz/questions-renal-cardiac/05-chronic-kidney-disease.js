// R41–50 — CKD staging and progression, uraemia, bone disease, anaemia, dialysis need.
// R050 is the last free question; R051 onward is behind the unlock.
// Original items written for Sleek Academia. No commercial test-bank content.

export default [
  {
    id: "r041",
    topic: "Chronic kidney disease staging",
    category: "Chronic kidney disease",
    difficulty: 3,
    type: "mcq",
    stem: "Which two measures are used together to classify chronic kidney disease?",
    options: [
      { id: "a", text: "Estimated glomerular filtration rate and albuminuria" },
      { id: "b", text: "Serum potassium and serum bicarbonate" },
      { id: "c", text: "Blood pressure and haemoglobin concentration" },
      { id: "d", text: "Urine output and fractional excretion of sodium" },
    ],
    correct: ["a"],
    rationale:
      "Classification uses two independent axes because they carry different prognostic information. Estimated filtration rate describes how much excretory function remains, while albuminuria describes the degree of glomerular barrier damage. A patient with preserved filtration but heavy albuminuria can face higher risk than one with lower filtration and no albuminuria.",
    distractorRationales: {
      b: "Potassium and bicarbonate reflect complications of reduced function rather than the staging axes themselves.",
      c: "Blood pressure and haemoglobin are important comorbid measures but do not define the stage.",
      d: "Urine output and fractional excretion of sodium are used to evaluate acute injury rather than to stage chronic disease.",
    },
    keyClue: "Two axes: how much filtration is left, and how much protein is leaking.",
    clinicalTakeaway:
      "Because albuminuria independently predicts progression and cardiovascular events, it is measured even when filtration rate looks reassuring.",
    remediationConcept:
      "Chronic kidney disease is classified on filtration rate and albuminuria together, because function and damage are distinct dimensions. Heavy albuminuria signals risk even when filtration is preserved. Always ask for both before judging severity.",
    safetyPriority: false,
    tags: ["ckd", "staging", "albuminuria", "gfr", "lab"],
  },
  {
    id: "r042",
    conceptKey: "hyperfiltration-drives-progression",
    topic: "Chronic kidney disease progression",
    category: "Chronic kidney disease",
    difficulty: 4,
    type: "mcq",
    stem: "Which mechanism explains why chronic kidney disease tends to progress even after the original insult has resolved?",
    options: [
      { id: "a", text: "Hyperfiltration in surviving nephrons causing progressive glomerular sclerosis" },
      { id: "b", text: "Continued immune attack on the tubular basement membrane" },
      { id: "c", text: "Progressive obstruction of the collecting system by scar tissue" },
      { id: "d", text: "Ongoing loss of erythropoietin production accelerating nephron death" },
    ],
    correct: ["a"],
    rationale:
      "When nephrons are lost, the survivors raise their individual filtration rates to maintain total function. That sustained hyperfiltration raises intraglomerular pressure, stretches the capillary wall, promotes protein leakage and fibrosis, and eventually destroys those nephrons too. Each loss increases the burden on the remainder, creating a self-perpetuating cycle.",
    distractorRationales: {
      b: "Immune attack drives specific immune-mediated diseases; it does not explain progression common to all causes of chronic kidney disease.",
      c: "Scarring within the parenchyma does not obstruct the collecting system, and obstruction is not the general mechanism of progression.",
      d: "Loss of erythropoietin causes anaemia but does not itself destroy remaining nephrons.",
    },
    keyClue: "The compensation that preserves function in the short term is what destroys nephrons in the long term.",
    clinicalTakeaway:
      "This is the rationale for blocking the renin-angiotensin system in proteinuric disease: reducing intraglomerular pressure slows progression independently of blood pressure.",
    remediationConcept:
      "Surviving nephrons compensate by hyperfiltering, which raises intraglomerular pressure and eventually scars them. Progression therefore continues after the original insult resolves. Treatments that lower intraglomerular pressure and proteinuria slow that cycle.",
    safetyPriority: false,
    tags: ["ckd", "progression", "hyperfiltration", "proteinuria", "compensation"],
  },
  {
    id: "r043",
    topic: "Uraemia",
    category: "Chronic kidney disease",
    difficulty: 3,
    type: "mcq",
    stem: "Which finding reflects the effect of accumulated uraemic toxins on platelet function?",
    options: [
      { id: "a", text: "Prolonged bleeding time with a normal platelet count" },
      { id: "b", text: "Thrombocytopenia with a normal bleeding time" },
      { id: "c", text: "A prolonged prothrombin time with normal platelet function" },
      { id: "d", text: "Spontaneous arterial thrombosis with a raised platelet count" },
    ],
    correct: ["a"],
    rationale:
      "Uraemic toxins impair platelet adhesion and aggregation and interfere with the interaction between platelets and the vessel wall. The defect is qualitative, so platelets are present in normal numbers but function poorly, producing a prolonged bleeding time and a tendency to bruising and mucosal bleeding.",
    distractorRationales: {
      b: "The count is typically preserved; the problem is how platelets behave rather than how many there are.",
      c: "The prothrombin time reflects the coagulation cascade, which uraemia does not primarily impair.",
      d: "Uraemia produces a bleeding tendency rather than a prothrombotic state with a raised count.",
    },
    keyClue: "Uraemia breaks platelet function, not platelet numbers.",
    clinicalTakeaway:
      "Because the defect is functional, bleeding risk is not predicted by the platelet count, so procedural planning accounts for uraemia itself.",
    remediationConcept:
      "Uraemia causes a qualitative platelet defect: normal count, impaired adhesion and aggregation, prolonged bleeding time. Distinguish qualitative defects from quantitative ones when interpreting bleeding risk. Dialysis improves the defect by removing the responsible toxins.",
    safetyPriority: false,
    tags: ["ckd", "uremia", "platelet", "bleeding", "lab"],
  },
  {
    id: "r044",
    conceptKey: "ckd-mineral-bone-chain",
    topic: "Renal bone disease",
    category: "Chronic kidney disease",
    difficulty: 4,
    type: "sata",
    stem: "Which findings would be expected in the mineral and bone disorder of advanced chronic kidney disease? Select all that apply.",
    options: [
      { id: "a", text: "Hyperphosphataemia" },
      { id: "b", text: "Elevated parathyroid hormone" },
      { id: "c", text: "Reduced active vitamin D" },
      { id: "d", text: "Elevated serum bicarbonate" },
      { id: "e", text: "Suppressed parathyroid hormone with hypercalcaemia" },
    ],
    correct: ["a", "b", "c"],
    rationale:
      "Falling filtration retains phosphate while loss of one-alpha-hydroxylase reduces conversion of vitamin D to its active form. Both lower serum calcium, which drives a sustained rise in parathyroid hormone. That hormone then mobilises calcium from bone, producing the characteristic bone disease and contributing to vascular calcification.",
    distractorRationales: {
      d: "Bicarbonate falls rather than rises in advanced kidney disease, because the kidney cannot excrete the daily acid load.",
      e: "Suppressed parathyroid hormone with high calcium is the opposite pattern and does not occur in this disorder.",
    },
    keyClue: "Phosphate up, active vitamin D down, calcium down, parathyroid hormone up.",
    clinicalTakeaway:
      "Vascular calcification from this disorder contributes substantially to the cardiovascular mortality of chronic kidney disease, so phosphate control matters beyond bone health.",
    remediationConcept:
      "In advanced kidney disease, retained phosphate and impaired vitamin D activation lower calcium and drive parathyroid hormone up. Work the chain in order rather than memorising four separate values. The accompanying metabolic acidosis lowers bicarbonate at the same time.",
    safetyPriority: false,
    tags: ["ckd", "phosphate", "calcium", "parathyroid", "lab"],
  },
  {
    id: "r045",
    topic: "Anaemia of chronic kidney disease",
    category: "Chronic kidney disease",
    difficulty: 3,
    type: "mcq",
    stem: "Which red cell indices are most typical of the anaemia of chronic kidney disease?",
    options: [
      { id: "a", text: "Normocytic and normochromic" },
      { id: "b", text: "Microcytic and hypochromic" },
      { id: "c", text: "Macrocytic with hypersegmented neutrophils" },
      { id: "d", text: "Normocytic with a markedly raised reticulocyte count" },
    ],
    correct: ["a"],
    rationale:
      "The problem is inadequate erythropoietin signalling rather than a deficiency of a building block. Fewer red cells are produced, but those that are made are structurally normal, so cell size and haemoglobin content stay within the reference range and the reticulocyte response is inappropriately low.",
    distractorRationales: {
      b: "Microcytic hypochromic indices indicate iron deficiency, which can coexist but is a different mechanism.",
      c: "Macrocytosis with hypersegmented neutrophils indicates vitamin B12 or folate deficiency.",
      d: "A raised reticulocyte count indicates a marrow responding vigorously, which is the opposite of the hypoproliferative picture here.",
    },
    keyClue: "Missing signal makes normal cells in low numbers; missing building blocks makes abnormal cells.",
    clinicalTakeaway:
      "Iron studies are checked before and during treatment with erythropoiesis-stimulating agents, because functional iron deficiency commonly limits the response.",
    remediationConcept:
      "Classify anaemia by whether the marrow lacks a signal or a substrate. Lacking erythropoietin gives normocytic normochromic cells with a low reticulocyte count; lacking iron or B12 alters cell size. Chronic kidney disease is a signal problem, though iron deficiency often coexists.",
    safetyPriority: false,
    tags: ["ckd", "anemia", "erythropoietin", "lab"],
  },
  {
    id: "r046",
    topic: "Cardiovascular risk",
    category: "Chronic kidney disease",
    difficulty: 4,
    type: "mcq",
    stem: "Why is cardiovascular disease the leading cause of death in chronic kidney disease?",
    options: [
      { id: "a", text: "Volume overload, hypertension, calcification, and inflammation act together on the heart and vessels" },
      { id: "b", text: "Uraemic toxins directly cause coronary artery thrombosis" },
      { id: "c", text: "Anaemia alone accounts for the excess cardiac mortality" },
      { id: "d", text: "Dialysis access invariably produces high-output cardiac failure" },
    ],
    correct: ["a"],
    rationale:
      "Chronic kidney disease imposes several cardiovascular stresses at once. Sodium and water retention raise preload, hypertension and arterial stiffening raise afterload, disordered mineral metabolism calcifies vessels and valves, and chronic inflammation with anaemia adds further strain. Together these drive left ventricular hypertrophy, heart failure, and accelerated atherosclerosis.",
    distractorRationales: {
      b: "Uraemic toxins contribute to a diffuse inflammatory and platelet-dysfunction state rather than directly causing coronary thrombosis.",
      c: "Anaemia contributes to the burden but is one factor among several rather than the whole explanation.",
      d: "High-output failure from an arteriovenous access can occur but is uncommon and does not explain the general excess risk.",
    },
    keyClue: "The kidney raises preload, afterload, and vascular stiffness at the same time.",
    clinicalTakeaway:
      "Because risk is multifactorial, management targets blood pressure, volume, phosphate, and anaemia together rather than any single factor.",
    remediationConcept:
      "Chronic kidney disease loads the heart from several directions: volume raises preload, hypertension and stiff arteries raise afterload, and mineral disorder calcifies vessels. Inflammation and anaemia compound it. Expect ventricular hypertrophy and heart failure as the common endpoint.",
    safetyPriority: false,
    tags: ["ckd", "cardiovascular", "hypertrophy", "calcification", "hemodynamics"],
  },
  {
    id: "r047",
    topic: "Uraemia",
    category: "Chronic kidney disease",
    difficulty: 4,
    type: "mcq",
    stem: "Which finding would most strongly suggest that a patient with advanced kidney disease needs urgent evaluation for dialysis?",
    options: [
      { id: "a", text: "A pericardial friction rub with pleuritic chest pain" },
      { id: "b", text: "A haemoglobin of 10.2 g/dL with normal indices" },
      { id: "c", text: "A phosphate of 5.4 mg/dL with mild bone pain" },
      { id: "d", text: "An estimated filtration rate that has fallen by three units over a year" },
    ],
    correct: ["a"],
    rationale:
      "Uraemic pericarditis reflects toxin accumulation sufficient to inflame the pericardium and carries a risk of effusion and tamponade. Along with refractory overload, resistant hyperkalaemia, severe acidosis, and uraemic encephalopathy, it is an indication that clearance can no longer be managed conservatively.",
    distractorRationales: {
      b: "This degree of anaemia is expected in advanced disease and is managed medically rather than by starting dialysis.",
      c: "A modestly raised phosphate with mild symptoms is managed with diet and phosphate binders.",
      d: "A gradual decline is expected in progressive disease and prompts planning rather than urgent initiation.",
    },
    keyClue: "Dialysis urgency comes from complications that are dangerous now, not from the filtration number alone.",
    clinicalTakeaway:
      "A friction rub in this population warrants urgent evaluation, since progression to tamponade can be rapid.",
    remediationConcept:
      "The urgent indications for dialysis are complications, not a threshold filtration rate: refractory overload, resistant hyperkalaemia, severe acidosis, uraemic pericarditis, and encephalopathy. Ask whether the finding is dangerous now. Gradual decline drives planning rather than urgency.",
    safetyPriority: true,
    tags: ["ckd", "uremia", "pericarditis", "dialysis", "priority"],
  },
  {
    id: "r048",
    topic: "Chronic kidney disease progression",
    category: "Chronic kidney disease",
    difficulty: 3,
    type: "mcq",
    stem: "Which finding indicates that albuminuria is being used correctly as a marker of kidney damage?",
    options: [
      { id: "a", text: "An albumin-to-creatinine ratio on a spot urine sample, repeated to confirm persistence" },
      { id: "b", text: "A single dipstick protein result during an acute febrile illness" },
      { id: "c", text: "A serum albumin level measured on a routine panel" },
      { id: "d", text: "A urine specific gravity measured on a first morning sample" },
    ],
    correct: ["a"],
    rationale:
      "Indexing urine albumin to urine creatinine corrects for how dilute the sample is, which makes a spot specimen interpretable without a timed collection. Because transient albuminuria occurs with fever, exercise, and hyperglycaemia, a raised result is confirmed on a repeat sample before it is accepted as evidence of chronic damage.",
    distractorRationales: {
      b: "Dipstick protein is insensitive to the lower range of albuminuria, and an acute illness commonly causes transient elevation.",
      c: "Serum albumin reflects nutrition, inflammation, and losses; it does not quantify urinary albumin excretion.",
      d: "Specific gravity measures urine concentration and says nothing about albumin excretion.",
    },
    keyClue: "Indexing to creatinine corrects for dilution; repeating confirms persistence.",
    clinicalTakeaway:
      "Confirming persistence prevents labelling someone with chronic kidney disease on the basis of a transient rise during an acute illness.",
    remediationConcept:
      "Quantify albuminuria as an albumin-to-creatinine ratio so dilution does not distort the result, and confirm persistence on a repeat sample. Fever, exercise, and hyperglycaemia cause transient elevations. Chronicity requires the abnormality to persist over months.",
    safetyPriority: false,
    tags: ["ckd", "albuminuria", "lab", "diagnosis"],
  },
  {
    id: "r049",
    topic: "Uraemia",
    category: "Chronic kidney disease",
    difficulty: 2,
    type: "mcq",
    stem: "Which cluster of symptoms is most characteristic of accumulating uraemic toxins?",
    options: [
      { id: "a", text: "Fatigue, anorexia, nausea, pruritus, and difficulty concentrating" },
      { id: "b", text: "Fever, productive cough, and pleuritic chest pain" },
      { id: "c", text: "Polyphagia, weight loss, and heat intolerance" },
      { id: "d", text: "Episodic headache, palpitations, and drenching sweats" },
    ],
    correct: ["a"],
    rationale:
      "Retained nitrogenous waste affects many systems at once but produces symptoms that are individually non-specific. Fatigue and poor concentration reflect central nervous system effects, anorexia and nausea reflect gastrointestinal effects, and pruritus reflects both toxin retention and mineral disturbance.",
    distractorRationales: {
      b: "Fever with productive cough and pleuritic pain describes a respiratory infection rather than toxin accumulation.",
      c: "Polyphagia with weight loss and heat intolerance suggests thyroid overactivity.",
      d: "Episodic headache, palpitations, and sweating suggest catecholamine excess.",
    },
    keyClue: "Uraemic symptoms are multisystem and vague, which is why they are often attributed to something else.",
    clinicalTakeaway:
      "Because these symptoms creep up gradually, patients often normalise them, so symptom burden is asked about directly rather than waited for.",
    remediationConcept:
      "Uraemia produces diffuse, non-specific multisystem symptoms: fatigue, poor concentration, anorexia, nausea, and pruritus. No single symptom is diagnostic; the pattern and the context are. Take a gradual accumulation of vague symptoms in kidney disease seriously.",
    safetyPriority: false,
    tags: ["ckd", "uremia", "symptoms", "assessment"],
  },
  {
    id: "r050",
    conceptKey: "hyperfiltration-drives-progression",
    topic: "Chronic kidney disease progression",
    category: "Chronic kidney disease",
    difficulty: 4,
    type: "mcq",
    stem: "Which mechanism explains why poorly controlled diabetes damages the glomerulus?",
    options: [
      { id: "a", text: "Chronic hyperglycaemia causes hyperfiltration, mesangial expansion, and basement membrane thickening" },
      { id: "b", text: "Insulin deficiency directly destroys podocytes through receptor blockade" },
      { id: "c", text: "Glucose crystallises within the tubular lumen and obstructs flow" },
      { id: "d", text: "Immune complexes containing glucose deposit in the capillary wall" },
    ],
    correct: ["a"],
    rationale:
      "Sustained hyperglycaemia drives glycation of proteins and activates pathways that thicken the basement membrane and expand the mesangium. Early on it also causes afferent vasodilation and hyperfiltration, which raises intraglomerular pressure. The barrier becomes leaky, producing albuminuria that progresses as sclerosis advances.",
    distractorRationales: {
      b: "Podocyte injury in this disease results from metabolic and haemodynamic stress rather than direct receptor-mediated destruction by insulin deficiency.",
      c: "Glucose remains in solution at physiological concentrations and does not crystallise in the tubule.",
      d: "Immune complex deposition characterises immune-mediated glomerulonephritis, not diabetic kidney disease.",
    },
    keyClue: "Early diabetic kidney disease hyperfilters before it fails — albuminuria appears while filtration still looks normal.",
    clinicalTakeaway:
      "Because damage begins during the hyperfiltration phase, albuminuria is screened for annually rather than waiting for creatinine to rise.",
    remediationConcept:
      "Chronic hyperglycaemia damages the glomerulus by thickening the basement membrane, expanding the mesangium, and raising intraglomerular pressure through hyperfiltration. Albuminuria therefore appears before filtration falls. Screening targets that early window.",
    safetyPriority: false,
    tags: ["ckd", "diabetes", "hyperfiltration", "albuminuria", "progression"],
  },
];
