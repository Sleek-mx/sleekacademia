// R81–90 — Heart failure phenotypes, neurohormonal compensation, atherosclerosis, ACS.
// Original items written for Sleek Academia. No commercial test-bank content.

export default [
  {
    id: "r081",
    conceptKey: "hf-reduced-vs-preserved-ef",
    topic: "Heart failure phenotypes",
    category: "Heart failure",
    difficulty: 3,
    type: "mcq",
    stem: "Which abnormality defines heart failure with preserved ejection fraction?",
    options: [
      { id: "a", text: "Impaired ventricular relaxation and filling despite normal ejection fraction" },
      { id: "b", text: "Reduced contractile force with a dilated ventricle" },
      { id: "c", text: "Valvular regurgitation causing chronic volume overload" },
      { id: "d", text: "Persistently elevated cardiac output with low resistance" },
    ],
    correct: ["a"],
    rationale:
      "In this phenotype the ventricle contracts normally but is stiff, so it cannot fill at normal pressures. Filling pressures rise and are transmitted back to the pulmonary circulation, producing congestion and exertional breathlessness even though the fraction of blood ejected remains within the reference range.",
    distractorRationales: {
      b: "Reduced contractile force with dilation describes heart failure with reduced ejection fraction, the systolic phenotype.",
      c: "Valvular regurgitation is a specific structural cause rather than a definition of this phenotype.",
      d: "High output with low resistance describes states such as severe anaemia or thyrotoxicosis rather than this condition.",
    },
    keyClue: "Preserved fraction means a filling problem, not an emptying problem.",
    clinicalTakeaway:
      "Because the problem is stiffness, these patients are sensitive both to volume loading and to loss of atrial contraction.",
    remediationConcept:
      "Sort heart failure by whether the ventricle cannot empty or cannot fill. Reduced ejection fraction is a contraction problem with a dilated ventricle; preserved ejection fraction is a compliance problem with a stiff one. Both raise filling pressures and cause congestion.",
    safetyPriority: false,
    tags: ["heart-failure", "hfpef", "diastolic", "compliance"],
  },
  {
    id: "r082",
    conceptKey: "hf-left-vs-right",
    topic: "Heart failure phenotypes",
    category: "Heart failure",
    difficulty: 2,
    type: "mcq",
    stem: "Which findings are most characteristic of predominantly right-sided heart failure?",
    options: [
      { id: "a", text: "Jugular venous distension, hepatomegaly, and dependent oedema" },
      { id: "b", text: "Orthopnoea, crackles, and paroxysmal nocturnal dyspnoea" },
      { id: "c", text: "Pleuritic chest pain with a pericardial friction rub" },
      { id: "d", text: "Exertional syncope with a harsh systolic murmur" },
    ],
    correct: ["a"],
    rationale:
      "When the right ventricle fails, blood backs up into the systemic venous circulation. Pressure rises in the jugular veins, the liver becomes congested and enlarges, and fluid accumulates in dependent tissues. The lungs are relatively spared because congestion is behind rather than beyond the pulmonary circulation.",
    distractorRationales: {
      b: "Orthopnoea, crackles, and nocturnal dyspnoea reflect pulmonary congestion from left-sided failure.",
      c: "Pleuritic pain with a friction rub suggests pericarditis rather than ventricular failure.",
      d: "Exertional syncope with a harsh systolic murmur suggests aortic stenosis.",
    },
    keyClue: "Failure backs up behind the failing side: right into the body, left into the lungs.",
    clinicalTakeaway:
      "Because left-sided failure is the commonest cause of right-sided failure, finding right-sided signs prompts assessment of the left ventricle too.",
    remediationConcept:
      "Congestion accumulates upstream of the failing ventricle. Right-sided failure congests the systemic veins, producing jugular distension, hepatomegaly, and dependent oedema; left-sided failure congests the lungs. Trace the direction of blood flow backwards from the failing chamber.",
    safetyPriority: false,
    tags: ["heart-failure", "right-sided", "congestion", "assessment"],
  },
  {
    id: "r083",
    conceptKey: "neurohormonal-compensation",
    topic: "Neurohormonal compensation",
    category: "Heart failure",
    difficulty: 4,
    type: "sata",
    stem: "Which compensatory responses to reduced cardiac output eventually worsen heart failure? Select all that apply.",
    options: [
      { id: "a", text: "Sympathetic activation raising heart rate and vascular tone" },
      { id: "b", text: "Renin-angiotensin-aldosterone activation retaining sodium and water" },
      { id: "c", text: "Ventricular remodelling with hypertrophy and dilation" },
      { id: "d", text: "Natriuretic peptide release promoting sodium excretion" },
      { id: "e", text: "Increased nitric oxide-mediated arterial vasodilation" },
    ],
    correct: ["a", "b", "c"],
    rationale:
      "The responses that defend perfusion acutely become harmful when sustained. Sympathetic activation raises afterload and myocardial oxygen demand while promoting arrhythmia, the renin-angiotensin-aldosterone axis adds volume to a ventricle that cannot handle it, and remodelling progressively degrades mechanical efficiency.",
    distractorRationales: {
      d: "Natriuretic peptides oppose volume retention and vasoconstriction, so they are a counter-regulatory and beneficial response.",
      e: "Nitric oxide-mediated vasodilation reduces afterload and is beneficial rather than harmful.",
    },
    keyClue: "Ask whether the response adds load and demand to a failing ventricle or removes it.",
    clinicalTakeaway:
      "This explains why treatments that blunt sympathetic and renin-angiotensin activity improve survival, even though they oppose the body's own compensation.",
    remediationConcept:
      "Compensation in heart failure is adaptive briefly and maladaptive chronically: sympathetic and renin-angiotensin activation plus remodelling all raise load and demand. Natriuretic peptides and nitric oxide oppose them. Sort each response by whether it loads or unloads the ventricle.",
    safetyPriority: false,
    tags: ["heart-failure", "compensation", "raas", "remodeling", "sympathetic"],
  },
  {
    id: "r084",
    conceptKey: "neurohormonal-compensation",
    topic: "Neurohormonal compensation",
    category: "Heart failure",
    difficulty: 4,
    type: "mcq",
    stem: "Which mechanism explains the elevated B-type natriuretic peptide measured in decompensated heart failure?",
    options: [
      { id: "a", text: "Ventricular wall stretch from raised filling pressures stimulates its release" },
      { id: "b", text: "Reduced renal clearance alone accounts for the elevation" },
      { id: "c", text: "Myocardial necrosis releases it from damaged cells" },
      { id: "d", text: "Pulmonary endothelial injury triggers its synthesis" },
    ],
    correct: ["a"],
    rationale:
      "Ventricular myocytes synthesise and release this peptide in response to wall stretch, which reflects raised filling pressure and volume. Its actions oppose the harmful compensations by promoting natriuresis and vasodilation. The concentration therefore tracks the degree of ventricular loading rather than the presence of cell death.",
    distractorRationales: {
      b: "Reduced renal clearance does raise levels and must be considered when interpreting results, but stretch-driven release is the primary mechanism.",
      c: "Markers released by myocardial necrosis are troponins; this peptide reflects loading rather than infarction.",
      d: "It is produced by cardiac myocytes rather than by pulmonary endothelium.",
    },
    keyClue: "This peptide measures ventricular stretch, so it reports loading rather than damage.",
    clinicalTakeaway:
      "Because kidney disease and obesity shift the values, results are interpreted alongside renal function and body habitus rather than against a single threshold.",
    remediationConcept:
      "B-type natriuretic peptide is released in response to ventricular wall stretch, so it reports filling pressure and volume load. Troponin reports myocyte injury instead. Match each biomarker to the process it actually measures, and account for renal clearance.",
    safetyPriority: false,
    tags: ["heart-failure", "bnp", "biomarker", "lab", "compensation"],
  },
  {
    id: "r085",
    conceptKey: "atherosclerosis-plaque",
    topic: "Atherosclerosis",
    category: "Ischemic heart disease",
    difficulty: 3,
    type: "mcq",
    stem: "Which event initiates atherosclerotic plaque formation?",
    options: [
      { id: "a", text: "Endothelial injury allowing lipid entry and monocyte recruitment into the intima" },
      { id: "b", text: "Calcium deposition within the arterial adventitia" },
      { id: "c", text: "Thrombus formation on an intact endothelial surface" },
      { id: "d", text: "Smooth muscle necrosis within the arterial media" },
    ],
    correct: ["a"],
    rationale:
      "Atherosclerosis begins with endothelial dysfunction from shear stress, hypertension, smoking, hyperglycaemia, or dyslipidaemia. The damaged endothelium becomes permeable to low-density lipoprotein and expresses adhesion molecules, so monocytes enter, become macrophages, and ingest oxidised lipid to form foam cells. Smooth muscle migration then builds a fibrous cap.",
    distractorRationales: {
      b: "Calcification occurs later and within the plaque itself rather than initiating the process in the adventitia.",
      c: "Thrombosis follows plaque disruption; an intact endothelium actively resists clot formation.",
      d: "Medial smooth muscle cells migrate into the intima to form the cap rather than dying to start the lesion.",
    },
    keyClue: "The endothelium is the gatekeeper — plaque begins when it is injured.",
    clinicalTakeaway:
      "Because the process starts with endothelial injury, risk-factor control addresses the mechanism rather than only the consequences.",
    remediationConcept:
      "Atherosclerosis is an inflammatory response to endothelial injury: lipid enters the intima, monocytes follow and become foam cells, and smooth muscle builds a fibrous cap. Every major risk factor injures endothelium. Follow that sequence rather than treating plaque as passive lipid deposition.",
    safetyPriority: false,
    tags: ["atherosclerosis", "endothelium", "inflammation", "lipid"],
  },
  {
    id: "r086",
    conceptKey: "atherosclerosis-plaque",
    topic: "Acute coronary syndrome",
    category: "Ischemic heart disease",
    difficulty: 4,
    type: "mcq",
    stem: "Which mechanism explains why an acute coronary syndrome can occur in an artery that was only moderately narrowed?",
    options: [
      { id: "a", text: "Rupture of a lipid-rich plaque with a thin cap triggering rapid thrombosis" },
      { id: "b", text: "Gradual growth of a stable fibrous plaque across the lumen" },
      { id: "c", text: "Progressive calcification slowly occluding the vessel" },
      { id: "d", text: "Increased myocardial oxygen demand alone without any plaque change" },
    ],
    correct: ["a"],
    rationale:
      "Risk of an acute event depends on plaque composition rather than size. A large lipid core beneath a thin inflamed cap is mechanically unstable, and when the cap ruptures the exposed core is intensely thrombogenic. Thrombus can occlude the vessel within minutes even though the original narrowing was modest.",
    distractorRationales: {
      b: "Gradual growth of a stable plaque produces predictable exertional angina and allows collateral development rather than an abrupt event.",
      c: "Calcification tends to stabilise plaque mechanically and progresses too slowly to cause an abrupt syndrome.",
      d: "Raised demand alone causes ischaemia in the presence of fixed obstruction but does not explain acute thrombotic occlusion.",
    },
    keyClue: "Vulnerability is about plaque composition, not the percentage of narrowing.",
    clinicalTakeaway:
      "This is why plaque-stabilising treatment reduces events, and why a previously reassuring stress test does not exclude a future acute syndrome.",
    remediationConcept:
      "Plaque composition determines the risk of an acute event: a large lipid core under a thin inflamed cap can rupture and thrombose even when narrowing is moderate. Stable fibrous plaques cause predictable exertional symptoms instead. Judge risk by stability rather than by degree of stenosis.",
    safetyPriority: false,
    tags: ["acs", "plaque-rupture", "thrombosis", "atherosclerosis"],
  },
  {
    id: "r087",
    topic: "Acute coronary syndrome",
    category: "Ischemic heart disease",
    difficulty: 4,
    type: "mcq",
    stem: "Which finding best distinguishes unstable angina from a non-ST-elevation myocardial infarction?",
    options: [
      { id: "a", text: "Troponin remains within the reference range in unstable angina" },
      { id: "b", text: "Chest discomfort occurs only with exertion in unstable angina" },
      { id: "c", text: "The electrocardiogram is always normal in unstable angina" },
      { id: "d", text: "Unstable angina is not associated with plaque disruption" },
    ],
    correct: ["a"],
    rationale:
      "Both conditions arise from the same process of plaque disruption with partial obstruction and both may show ischaemic electrocardiographic changes. The distinction is whether ischaemia was severe or prolonged enough to kill myocytes: a rise in troponin indicates that necrosis occurred and reclassifies the event as infarction.",
    distractorRationales: {
      b: "Unstable angina characteristically occurs at rest or with progressively less exertion, which is what makes it unstable.",
      c: "Ischaemic changes such as ST depression or T wave inversion may well be present.",
      d: "Both syndromes share plaque disruption as the underlying mechanism.",
    },
    keyClue: "Troponin answers one question: did myocytes die?",
    clinicalTakeaway:
      "Because troponin rises over hours, a single early normal value does not exclude infarction and serial sampling is used.",
    remediationConcept:
      "Unstable angina and non-ST-elevation infarction share the same mechanism and differ only by whether necrosis occurred, which troponin detects. Timing matters, since troponin takes hours to rise. Use serial values rather than a single early result.",
    safetyPriority: true,
    tags: ["acs", "troponin", "biomarker", "priority", "lab"],
  },
  {
    id: "r088",
    conceptKey: "hf-reduced-vs-preserved-ef",
    topic: "Heart failure phenotypes",
    category: "Heart failure",
    difficulty: 4,
    type: "mcq",
    stem: "Why does a dilated ventricle with reduced ejection fraction become progressively less efficient?",
    options: [
      { id: "a", text: "A larger radius raises wall stress and oxygen demand for the same pressure generated" },
      { id: "b", text: "A larger chamber reduces preload and therefore stroke volume" },
      { id: "c", text: "Dilation shortens sarcomeres below their optimal length" },
      { id: "d", text: "Dilation reduces wall stress and so weakens the contractile stimulus" },
    ],
    correct: ["a"],
    rationale:
      "Wall stress rises with chamber pressure and radius and falls with wall thickness. A dilated ventricle therefore needs greater wall stress, and so greater oxygen consumption, to generate the same ejection pressure. The extra demand worsens ischaemia and drives further dilation in a self-reinforcing cycle.",
    distractorRationales: {
      b: "Dilation increases rather than decreases end-diastolic volume, so preload is not reduced.",
      c: "Dilation stretches sarcomeres beyond rather than below their optimal overlap.",
      d: "Dilation raises wall stress rather than reducing it.",
    },
    keyClue: "Bigger radius means more wall stress for the same pressure, so dilation costs oxygen.",
    clinicalTakeaway:
      "This is the rationale for reducing afterload and volume in these patients: both lower wall stress and interrupt the cycle.",
    remediationConcept:
      "Wall stress rises with pressure and radius and falls with thickness. Dilation therefore raises oxygen demand for the same output and feeds further dilation. Reducing volume and afterload lowers wall stress and interrupts that cycle.",
    safetyPriority: false,
    tags: ["heart-failure", "remodeling", "wall-stress", "hfref"],
  },
  {
    id: "r089",
    conceptKey: "hf-left-vs-right",
    topic: "Heart failure phenotypes",
    category: "Heart failure",
    difficulty: 5,
    type: "mcq",
    stem: "A patient with acute decompensation has cool extremities, a narrow pulse pressure, and pulmonary crackles. Which haemodynamic profile does this suggest?",
    options: [
      { id: "a", text: "Congested with inadequate perfusion, indicating low output with high filling pressures" },
      { id: "b", text: "Congested with adequate perfusion, indicating high filling pressures alone" },
      { id: "c", text: "Dry with adequate perfusion, indicating a non-cardiac cause" },
      { id: "d", text: "Dry with inadequate perfusion, indicating hypovolaemia" },
    ],
    correct: ["a"],
    rationale:
      "Crackles indicate raised left-sided filling pressures, so the patient is congested. Cool extremities and a narrow pulse pressure indicate a low stroke volume with compensatory vasoconstriction, so perfusion is inadequate. The combination identifies the profile carrying the worst prognosis and needing the most careful management.",
    distractorRationales: {
      b: "Adequate perfusion would be suggested by warm extremities and a normal pulse pressure, neither of which is present.",
      c: "Crackles indicate congestion, so the patient is not dry.",
      d: "Congestion is evident, which excludes a dry profile despite the poor perfusion.",
    },
    keyClue: "Assess congestion and perfusion separately, then combine them into a profile.",
    clinicalTakeaway:
      "Because this profile combines congestion with poor perfusion, giving fluid worsens congestion while aggressive diuresis alone may worsen perfusion — it warrants urgent specialist evaluation.",
    remediationConcept:
      "Classify acute heart failure on two independent axes: congestion, judged by crackles and venous pressure, and perfusion, judged by extremity temperature and pulse pressure. The four resulting profiles guide very different management. Never infer one axis from the other.",
    safetyPriority: true,
    tags: ["heart-failure", "perfusion", "congestion", "priority", "hemodynamics"],
  },
  {
    id: "r090",
    topic: "Acute coronary syndrome",
    category: "Ischemic heart disease",
    difficulty: 4,
    type: "mcq",
    stem: "Which mechanism explains why an inferior myocardial infarction may be accompanied by bradycardia and heart block?",
    options: [
      { id: "a", text: "The vessel supplying the inferior wall also commonly supplies the sinus and atrioventricular nodes" },
      { id: "b", text: "Inferior wall damage directly severs the bundle of His" },
      { id: "c", text: "Inferior infarction always produces complete atrioventricular dissociation" },
      { id: "d", text: "Bradycardia results from reduced coronary flow to the left bundle branch" },
    ],
    correct: ["a"],
    rationale:
      "In most people the right coronary artery supplies the inferior wall and also gives branches to the sinus and atrioventricular nodes. Occlusion therefore causes both inferior wall injury and conduction system ischaemia, so bradycardia and varying degrees of atrioventricular block are common and are often transient.",
    distractorRationales: {
      b: "The bundle of His is not mechanically severed; conduction disturbance results from ischaemia of nodal tissue.",
      c: "Complete dissociation is one possible outcome rather than an invariable consequence, and lesser degrees of block are more common.",
      d: "Left bundle branch involvement is associated with anterior rather than inferior infarction and does not cause bradycardia by this route.",
    },
    keyClue: "Conduction problems follow the blood supply to the conduction system.",
    clinicalTakeaway:
      "Because these blocks reflect nodal ischaemia rather than structural destruction, they frequently resolve as perfusion is restored, though haemodynamic compromise still warrants urgent evaluation.",
    remediationConcept:
      "Predict complications of infarction from coronary anatomy: the artery supplying the inferior wall usually also supplies the sinus and atrioventricular nodes, so inferior infarction commonly causes bradycardia and block. Anterior infarction threatens pump function and the bundle branches instead. Map the territory to the complication.",
    safetyPriority: true,
    tags: ["acs", "inferior-mi", "conduction", "priority", "anatomy"],
  },
];
