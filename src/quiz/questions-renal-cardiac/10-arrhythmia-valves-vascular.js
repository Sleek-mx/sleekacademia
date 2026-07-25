// R91–100 — Arrhythmia and conduction, valvular lesions, hypertension, vascular disease, shock.
// Original items written for Sleek Academia. No commercial test-bank content.

export default [
  {
    id: "r091",
    conceptKey: "atrial-fibrillation-consequences",
    topic: "Atrial fibrillation",
    category: "Arrhythmias and conduction",
    difficulty: 3,
    type: "mcq",
    stem: "Which two consequences of atrial fibrillation account for most of its clinical impact?",
    options: [
      { id: "a", text: "Loss of organised atrial contraction and stasis predisposing to thrombus" },
      { id: "b", text: "Complete failure of ventricular depolarisation and asystole" },
      { id: "c", text: "Loss of sinus node function and permanent bradycardia" },
      { id: "d", text: "Reduced coronary artery calibre and fixed ischaemia" },
    ],
    correct: ["a"],
    rationale:
      "Chaotic atrial activity abolishes coordinated contraction, so the ventricle loses the final filling increment that atrial systole normally provides. Blood also stagnates in the fibrillating atrium, particularly in the appendage, where it can form thrombus that embolises to the brain or elsewhere.",
    distractorRationales: {
      b: "The ventricles continue to depolarise, though irregularly, as impulses are conducted variably through the atrioventricular node.",
      c: "Sinus node activity is overwhelmed rather than abolished, and the ventricular rate is often rapid rather than slow.",
      d: "Coronary calibre is unchanged; any ischaemia arises from rate-related supply and demand mismatch.",
    },
    keyClue: "Two problems: lost atrial contraction and stagnant blood that clots.",
    clinicalTakeaway:
      "Because the embolic risk exists regardless of symptoms, thromboembolic risk is assessed even in patients who feel entirely well.",
    remediationConcept:
      "Atrial fibrillation causes harm two ways: losing organised atrial contraction reduces filling, and stasis in the atrium allows thrombus to form and embolise. Rate control addresses symptoms while anticoagulation addresses embolic risk. The two problems need separate consideration.",
    safetyPriority: false,
    tags: ["atrial-fibrillation", "thrombus", "filling", "arrhythmia"],
  },
  {
    id: "r092",
    conceptKey: "atrial-fibrillation-consequences",
    topic: "Atrial fibrillation",
    category: "Arrhythmias and conduction",
    difficulty: 4,
    type: "mcq",
    stem: "Why does the loss of atrial contraction in atrial fibrillation affect a stiff hypertrophied ventricle more than a compliant one?",
    options: [
      { id: "a", text: "A stiff ventricle relies more on the atrial contribution to complete its filling" },
      { id: "b", text: "A stiff ventricle has a higher ejection fraction and needs more volume" },
      { id: "c", text: "A stiff ventricle cannot increase its heart rate to compensate" },
      { id: "d", text: "A stiff ventricle has reduced coronary reserve during diastole" },
    ],
    correct: ["a"],
    rationale:
      "Passive early filling depends on ventricular compliance. When the ventricle is stiff, less blood enters passively, so the atrial contribution to end-diastolic volume becomes proportionally larger. Losing that contribution therefore causes a disproportionate fall in stroke volume and a sharp rise in filling pressure.",
    distractorRationales: {
      b: "Ejection fraction may be preserved, but the limitation is filling volume rather than the fraction ejected.",
      c: "The heart rate in atrial fibrillation is typically raised rather than fixed, and rate is not the limiting factor here.",
      d: "Reduced coronary reserve is a genuine feature of hypertrophy but does not explain the dependence on atrial contraction.",
    },
    keyClue: "The stiffer the ventricle, the more it needs the atrial kick.",
    clinicalTakeaway:
      "This explains why some patients decompensate abruptly when they develop atrial fibrillation, even at a controlled rate.",
    remediationConcept:
      "Atrial contraction adds a final increment to ventricular filling, and its importance rises as compliance falls. A stiff ventricle therefore tolerates atrial fibrillation poorly. Relate the impact of losing atrial systole to how well the ventricle fills passively.",
    safetyPriority: false,
    tags: ["atrial-fibrillation", "compliance", "filling", "hfpef-link"],
  },
  {
    id: "r093",
    topic: "Conduction abnormalities",
    category: "Arrhythmias and conduction",
    difficulty: 4,
    type: "mcq",
    stem: "Which electrocardiographic pattern indicates third-degree atrioventricular block?",
    options: [
      { id: "a", text: "P waves and QRS complexes occurring independently with no consistent relationship" },
      { id: "b", text: "A fixed prolonged PR interval with every P wave conducted" },
      { id: "c", text: "Progressive PR lengthening until a beat is dropped" },
      { id: "d", text: "Absent P waves with an irregularly irregular ventricular rhythm" },
    ],
    correct: ["a"],
    rationale:
      "In complete block, no atrial impulse reaches the ventricles. The atria continue at the sinus rate while a subsidiary pacemaker below the block drives the ventricles at its own slower rate, so the two rhythms are entirely dissociated and the PR interval varies randomly.",
    distractorRationales: {
      b: "A fixed prolonged PR interval with every beat conducted describes first-degree block, which is a delay rather than a failure.",
      c: "Progressive PR lengthening before a dropped beat describes second-degree block of the Mobitz I pattern.",
      d: "Absent P waves with an irregularly irregular rhythm describes atrial fibrillation rather than block.",
    },
    keyClue: "Complete block means the atria and ventricles have stopped talking to each other entirely.",
    clinicalTakeaway:
      "Because the escape rhythm may be slow and unreliable, complete block with haemodynamic compromise warrants urgent evaluation for pacing.",
    remediationConcept:
      "Grade atrioventricular block by what happens to conduction: first-degree delays every impulse, second-degree drops some, and third-degree conducts none so the chambers dissociate. Read the relationship between P waves and QRS complexes rather than the rate alone.",
    safetyPriority: true,
    tags: ["conduction", "av-block", "ecg", "priority", "arrhythmia"],
  },
  {
    id: "r094",
    conceptKey: "valve-stenosis-vs-regurgitation",
    topic: "Valvular disease",
    category: "Valvular disease",
    difficulty: 4,
    type: "mcq",
    stem: "Which pattern of ventricular adaptation would be expected in chronic aortic stenosis?",
    options: [
      { id: "a", text: "Concentric hypertrophy from pressure overload with a preserved chamber size" },
      { id: "b", text: "Eccentric dilation from volume overload with a thin wall" },
      { id: "c", text: "Atrophy of the ventricular wall from reduced workload" },
      { id: "d", text: "Right ventricular hypertrophy with a normal left ventricle" },
    ],
    correct: ["a"],
    rationale:
      "A stenotic aortic valve obstructs outflow, so the ventricle must generate much higher pressure to eject. That pressure overload raises wall stress, and the myocardium responds by adding sarcomeres in parallel, thickening the wall while the cavity size stays near normal. The thickened wall is stiff and fills at higher pressures.",
    distractorRationales: {
      b: "Eccentric dilation with a thin wall follows volume overload, as occurs in chronic regurgitant lesions.",
      c: "Workload is markedly increased rather than reduced, so atrophy would not occur.",
      d: "The left ventricle bears the load in aortic stenosis; right ventricular hypertrophy follows pulmonary rather than aortic obstruction.",
    },
    keyClue: "Stenosis is a pressure problem and thickens the wall; regurgitation is a volume problem and dilates the chamber.",
    clinicalTakeaway:
      "Because the hypertrophied ventricle depends on adequate preload and coronary perfusion, these patients tolerate hypovolaemia and tachycardia poorly.",
    remediationConcept:
      "Classify valve lesions by the overload they impose: stenosis obstructs outflow and causes pressure overload with concentric hypertrophy, while regurgitation returns volume and causes eccentric dilation. Predict the adaptation from the type of overload rather than memorising each lesion.",
    safetyPriority: false,
    tags: ["valve", "aortic-stenosis", "hypertrophy", "remodeling"],
  },
  {
    id: "r095",
    conceptKey: "valve-stenosis-vs-regurgitation",
    topic: "Valvular disease",
    category: "Valvular disease",
    difficulty: 4,
    type: "sata",
    stem: "Which findings would be expected in chronic mitral regurgitation? Select all that apply.",
    options: [
      { id: "a", text: "Left atrial enlargement from regurgitant volume" },
      { id: "b", text: "Eccentric left ventricular dilation" },
      { id: "c", text: "Pulmonary congestion as left atrial pressure rises" },
      { id: "d", text: "Concentric left ventricular hypertrophy with a small cavity" },
      { id: "e", text: "Reduced left ventricular end-diastolic volume" },
    ],
    correct: ["a", "b", "c"],
    rationale:
      "Blood regurgitating into the left atrium during systole enlarges it and raises its pressure, which is transmitted to the pulmonary veins and produces congestion. The ventricle receives that regurgitant volume back during diastole in addition to normal inflow, so it dilates eccentrically to accommodate the increased load.",
    distractorRationales: {
      d: "Concentric hypertrophy with a small cavity follows pressure overload from stenosis rather than volume overload from regurgitation.",
      e: "End-diastolic volume rises rather than falls, because the ventricle handles both normal inflow and the regurgitant volume.",
    },
    keyClue: "Regurgitant volume goes backwards then comes back, so both chambers enlarge.",
    clinicalTakeaway:
      "Because the ventricle unloads partly into the atrium, ejection fraction can look reassuring while contractile function is already deteriorating.",
    remediationConcept:
      "Follow the regurgitant volume: it enters the atrium during systole, enlarging it and raising pulmonary pressures, then returns to the ventricle in diastole, dilating it. Volume overload causes eccentric dilation, unlike the concentric hypertrophy of stenosis. Tracing the blood predicts the findings.",
    safetyPriority: false,
    tags: ["valve", "mitral-regurgitation", "volume-overload", "congestion"],
  },
  {
    id: "r096",
    topic: "Hypertension",
    category: "Vascular disorders",
    difficulty: 3,
    type: "mcq",
    stem: "Which mechanism contributes most to the rise in blood pressure in primary hypertension?",
    options: [
      { id: "a", text: "Increased systemic vascular resistance from arteriolar remodelling and vasoconstriction" },
      { id: "b", text: "A sustained increase in cardiac output with normal resistance" },
      { id: "c", text: "Reduced blood viscosity increasing flow velocity" },
      { id: "d", text: "Increased venous capacitance raising central pressure" },
    ],
    correct: ["a"],
    rationale:
      "Mean arterial pressure is the product of cardiac output and systemic vascular resistance. In established primary hypertension, output is typically normal while resistance is raised through increased arteriolar tone and structural narrowing of the vessel wall, with renal sodium handling and the renin-angiotensin system contributing.",
    distractorRationales: {
      b: "Output may be modestly raised early in the disease, but established hypertension is characterised by raised resistance with a normal output.",
      c: "Reduced viscosity would tend to lower rather than raise resistance and pressure.",
      d: "Increased venous capacitance holds blood peripherally and lowers central pressure.",
    },
    keyClue: "Pressure equals output times resistance — established hypertension is a resistance disease.",
    clinicalTakeaway:
      "Because the vessel wall remodels structurally over time, longstanding hypertension becomes progressively harder to reverse, which is why early control matters.",
    remediationConcept:
      "Mean arterial pressure is cardiac output multiplied by systemic vascular resistance. Established primary hypertension raises resistance through arteriolar tone and wall remodelling while output stays normal. Decide which term an intervention or mechanism changes.",
    safetyPriority: false,
    tags: ["hypertension", "resistance", "remodeling", "vascular"],
  },
  {
    id: "r097",
    topic: "Aortic disease",
    category: "Vascular disorders",
    difficulty: 5,
    type: "mcq",
    stem: "A patient reports abrupt severe chest pain radiating to the back, with a 20 mm Hg difference in blood pressure between the arms. Which mechanism best explains these findings?",
    options: [
      { id: "a", text: "A tear in the aortic intima creating a false lumen that compromises branch flow" },
      { id: "b", text: "Thrombotic occlusion of a single coronary artery" },
      { id: "c", text: "Pulmonary arterial obstruction raising right heart pressures" },
      { id: "d", text: "Pericardial inflammation producing positional chest pain" },
    ],
    correct: ["a"],
    rationale:
      "An intimal tear allows blood to enter the aortic wall and propagate along it, creating a false lumen. As that lumen extends it can compress or occlude branch vessels, so pressures differ between limbs. The tearing quality radiating to the back reflects progressive separation of the aortic layers.",
    distractorRationales: {
      b: "Coronary occlusion causes pressure-like chest pain without a pressure differential between the arms.",
      c: "Pulmonary arterial obstruction causes dyspnoea and right heart strain rather than interarm pressure differences.",
      d: "Pericardial inflammation produces positional pleuritic pain and a friction rub rather than this pattern.",
    },
    keyClue: "Different pressures in each arm points to something interrupting flow into the branch vessels.",
    clinicalTakeaway:
      "This presentation is time-critical and warrants urgent evaluation, since extension can involve the coronary arteries, pericardium, or cerebral circulation.",
    remediationConcept:
      "A pressure or pulse difference between limbs indicates obstruction of a branch vessel rather than a problem within the heart. In aortic dissection a false lumen propagates along the wall and compromises branches as it extends. Abrupt tearing pain radiating to the back with asymmetric pressures is the pattern to recognise.",
    safetyPriority: true,
    tags: ["dissection", "aorta", "priority", "vascular", "assessment"],
  },
  {
    id: "r098",
    conceptKey: "arterial-vs-venous-vascular-disease",
    topic: "Peripheral vascular disease",
    category: "Vascular disorders",
    difficulty: 3,
    type: "mcq",
    stem: "Which findings distinguish chronic arterial insufficiency from chronic venous insufficiency in the lower limb?",
    options: [
      { id: "a", text: "Cool skin, absent hair, diminished pulses, and pain relieved by dependency" },
      { id: "b", text: "Warm oedematous skin with brown pigmentation and pain relieved by elevation" },
      { id: "c", text: "Localised warmth with fever and a rapidly spreading margin" },
      { id: "d", text: "Symmetrical pitting oedema with jugular venous distension" },
    ],
    correct: ["a"],
    rationale:
      "Inadequate arterial inflow starves the tissue, so the limb is cool, hair is lost, pulses are weak, and dependency helps because gravity assists perfusion. Venous disease is the mirror image: the limb is congested and warm with pigmentation from haemosiderin, and elevation relieves symptoms by aiding drainage.",
    distractorRationales: {
      b: "These are the features of chronic venous insufficiency, which is the comparison rather than the arterial pattern.",
      c: "Warmth with fever and a spreading margin describes cellulitis.",
      d: "Symmetrical oedema with jugular distension suggests a central cause such as heart failure.",
    },
    keyClue: "Arterial disease is relieved by hanging the limb down; venous disease is relieved by raising it.",
    clinicalTakeaway:
      "The distinction changes care directly, since compression helps venous disease but can be harmful when arterial inflow is inadequate.",
    remediationConcept:
      "Arterial disease is a supply problem: the limb is cool and pulseless, and dependency helps. Venous disease is a drainage problem: the limb is warm, pigmented, and oedematous, and elevation helps. Use the effect of limb position to separate them.",
    safetyPriority: false,
    tags: ["pad", "venous-insufficiency", "perfusion", "assessment"],
  },
  {
    id: "r099",
    conceptKey: "arterial-vs-venous-vascular-disease",
    topic: "Venous thromboembolism",
    category: "Vascular disorders",
    difficulty: 4,
    type: "mcq",
    stem: "Which three factors of Virchow's triad predispose to venous thrombosis?",
    options: [
      { id: "a", text: "Venous stasis, endothelial injury, and hypercoagulability" },
      { id: "b", text: "Arterial stenosis, platelet excess, and hypertension" },
      { id: "c", text: "Anaemia, dehydration, and hyperlipidaemia" },
      { id: "d", text: "Valvular disease, atrial enlargement, and bradycardia" },
    ],
    correct: ["a"],
    rationale:
      "Venous thrombosis requires one or more of three conditions: blood moving too slowly, a damaged vessel lining, or blood that clots too readily. Most clinical risk factors map onto one of these, which is why immobility, surgery, and inherited or acquired thrombophilias so often appear together in a risk assessment.",
    distractorRationales: {
      b: "These describe arterial disease mechanisms rather than the determinants of venous thrombosis.",
      c: "Anaemia, dehydration, and hyperlipidaemia influence risk indirectly at most and are not the triad.",
      d: "These cardiac factors predispose to intracardiac thrombus but are not the classical triad.",
    },
    keyClue: "Slow flow, damaged wall, sticky blood — every venous risk factor fits one of the three.",
    clinicalTakeaway:
      "Because immobility acts through stasis, early mobilisation and mechanical or pharmacological prophylaxis target the mechanism directly.",
    remediationConcept:
      "Venous thrombosis arises from stasis, endothelial injury, or hypercoagulability. Map every risk factor onto one of the three rather than memorising lists. Prophylaxis works by removing whichever element is modifiable.",
    safetyPriority: false,
    tags: ["vte", "virchow", "thrombosis", "prevention"],
  },
  {
    id: "r100",
    topic: "Shock",
    category: "Shock and perfusion failure",
    difficulty: 5,
    type: "mcq",
    stem: "A patient has hypotension, warm extremities, a wide pulse pressure, and a raised cardiac output. Which category of shock does this suggest?",
    options: [
      { id: "a", text: "Distributive shock from pathological vasodilation" },
      { id: "b", text: "Cardiogenic shock from pump failure" },
      { id: "c", text: "Hypovolaemic shock from volume loss" },
      { id: "d", text: "Obstructive shock from impaired cardiac filling" },
    ],
    correct: ["a"],
    rationale:
      "Warm extremities with a wide pulse pressure and raised output indicate that the circulation is dilated rather than underfilled or failing. Loss of vascular tone drops systemic resistance, so pressure falls despite a compensatory rise in output, and blood is distributed away from where it is needed.",
    distractorRationales: {
      b: "Cardiogenic shock produces cool extremities, a narrow pulse pressure, and low output because the pump has failed.",
      c: "Hypovolaemic shock also produces cool extremities with a narrow pulse pressure and low output from inadequate filling.",
      d: "Obstructive shock impairs filling or ejection mechanically, again giving low output with poor peripheral perfusion.",
    },
    keyClue: "Warm and vasodilated with high output means the vessels failed, not the pump or the volume.",
    clinicalTakeaway:
      "Because the deficit is vascular tone rather than volume alone, fluid resuscitation is combined with restoring tone and treating the underlying cause.",
    remediationConcept:
      "Classify shock by cardiac output and peripheral perfusion. Distributive shock gives high output with warm dilated extremities; hypovolaemic, cardiogenic, and obstructive shock all give low output with cool constricted extremities. Examine the periphery to narrow the category quickly.",
    safetyPriority: true,
    tags: ["shock", "distributive", "perfusion", "priority", "hemodynamics"],
  },
];
