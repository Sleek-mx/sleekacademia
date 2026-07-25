// R71–80 — Cardiac output determinants, preload, afterload, contractility, coronary perfusion.
// Original items written for Sleek Academia. No commercial test-bank content.

export default [
  {
    id: "r071",
    conceptKey: "cardiac-output-determinants",
    topic: "Cardiac output",
    category: "Cardiac physiology",
    difficulty: 2,
    type: "mcq",
    stem: "Cardiac output is determined by which two variables?",
    options: [
      { id: "a", text: "Heart rate and stroke volume" },
      { id: "b", text: "Heart rate and mean arterial pressure" },
      { id: "c", text: "Stroke volume and systemic vascular resistance" },
      { id: "d", text: "Ejection fraction and pulse pressure" },
    ],
    correct: ["a"],
    rationale:
      "Cardiac output is the volume ejected per minute, so it is the product of the volume ejected per beat and the number of beats per minute. Every other influence — preload, afterload, contractility, rhythm, and autonomic tone — acts by changing one of those two terms.",
    distractorRationales: {
      b: "Mean arterial pressure is a consequence of cardiac output and vascular resistance rather than a determinant of output.",
      c: "Systemic vascular resistance affects output indirectly by altering afterload, so it is not one of the two direct terms.",
      d: "Ejection fraction describes the proportion of ventricular volume ejected, and pulse pressure is a downstream arterial measure.",
    },
    keyClue: "Output equals volume per beat times beats per minute — everything else works through those two.",
    clinicalTakeaway:
      "This is why a very fast rhythm can lower output: shortened filling time reduces stroke volume more than the rate increase adds.",
    remediationConcept:
      "Cardiac output is heart rate multiplied by stroke volume. Trace every haemodynamic influence to whichever term it changes, and remember the two can move in opposite directions. Preload, afterload, and contractility all act through stroke volume.",
    safetyPriority: false,
    tags: ["cardiac-output", "stroke-volume", "hemodynamics", "physiology"],
  },
  {
    id: "r072",
    conceptKey: "preload-frank-starling",
    topic: "Preload",
    category: "Cardiac physiology",
    difficulty: 3,
    type: "mcq",
    stem: "Which statement best describes preload?",
    options: [
      { id: "a", text: "The degree of ventricular myocyte stretch at the end of diastole" },
      { id: "b", text: "The resistance the ventricle must overcome to eject blood" },
      { id: "c", text: "The intrinsic force of contraction independent of fibre length" },
      { id: "d", text: "The proportion of end-diastolic volume ejected each beat" },
    ],
    correct: ["a"],
    rationale:
      "Preload is the stretch on the myocardium immediately before contraction, which depends on the volume in the ventricle at the end of filling. Within physiological limits, greater stretch improves the overlap of contractile filaments and increases the force of the next contraction, which is the Frank-Starling relationship.",
    distractorRationales: {
      b: "Resistance to ejection defines afterload rather than preload.",
      c: "Force independent of fibre length describes contractility, which is a separate determinant.",
      d: "The proportion of end-diastolic volume ejected defines ejection fraction.",
    },
    keyClue: "Preload is stretch before the beat; afterload is the load against the beat.",
    clinicalTakeaway:
      "Because preload depends on venous return, changes in volume status and position alter stroke volume within a few beats.",
    remediationConcept:
      "Keep the three determinants of stroke volume distinct: preload is end-diastolic stretch, afterload is resistance to ejection, and contractility is force independent of stretch. Name which one an intervention changes before predicting its effect. Confusing preload with afterload reverses the prediction.",
    safetyPriority: false,
    tags: ["preload", "starling", "stroke-volume", "physiology"],
  },
  {
    id: "r073",
    conceptKey: "preload-frank-starling",
    topic: "Preload",
    category: "Cardiac physiology",
    difficulty: 4,
    type: "mcq",
    stem: "In a failing ventricle operating on the flat portion of its Frank-Starling curve, what is the expected effect of a further fluid bolus?",
    options: [
      { id: "a", text: "Little gain in stroke volume with a rise in filling pressure and pulmonary congestion" },
      { id: "b", text: "A proportional rise in stroke volume with no change in filling pressure" },
      { id: "c", text: "A fall in filling pressure as the ventricle empties more completely" },
      { id: "d", text: "An increase in contractility that restores the normal curve" },
    ],
    correct: ["a"],
    rationale:
      "On the flat part of the curve, additional stretch produces almost no additional force, so stroke volume barely improves. The added volume still raises end-diastolic and therefore atrial and pulmonary venous pressure, which pushes fluid into the pulmonary interstitium. The patient gains congestion without gaining output.",
    distractorRationales: {
      b: "A proportional rise in stroke volume occurs on the steep part of the curve, which a failing ventricle has already exceeded.",
      c: "Filling pressure rises rather than falls when volume is added to a poorly compliant, poorly contracting ventricle.",
      d: "Volume administration does not improve contractility, which is an intrinsic property of the myocardium.",
    },
    keyClue: "On the flat part of the curve, extra volume buys pressure rather than output.",
    clinicalTakeaway:
      "This is why fluid responsiveness is assessed rather than assumed, and why a bolus can worsen a patient with congestion and a rising creatinine.",
    remediationConcept:
      "The Frank-Starling curve flattens as the ventricle fails, so additional preload adds filling pressure without adding stroke volume. Predict the response by asking where on the curve the ventricle is operating. Congestion without improved output is the signature of the flat portion.",
    safetyPriority: true,
    tags: ["preload", "starling", "heart-failure-link", "congestion", "priority"],
  },
  {
    id: "r074",
    conceptKey: "afterload-determinants",
    topic: "Afterload",
    category: "Cardiac physiology",
    difficulty: 3,
    type: "mcq",
    stem: "Which change would increase left ventricular afterload?",
    options: [
      { id: "a", text: "Systemic arteriolar vasoconstriction" },
      { id: "b", text: "Systemic arteriolar vasodilation" },
      { id: "c", text: "Reduced circulating blood volume" },
      { id: "d", text: "Increased venous capacitance" },
    ],
    correct: ["a"],
    rationale:
      "Afterload is the load the ventricle must overcome to open the aortic valve and eject. Arteriolar constriction raises systemic vascular resistance and therefore aortic pressure, so the ventricle must generate more pressure for the same stroke volume. Aortic stenosis and increased arterial stiffness raise it by similar logic.",
    distractorRationales: {
      b: "Vasodilation lowers resistance and reduces the pressure the ventricle must generate, decreasing afterload.",
      c: "Reduced blood volume lowers venous return and therefore preload rather than raising afterload.",
      d: "Increased venous capacitance holds blood in the venous system and reduces preload.",
    },
    keyClue: "Afterload lives on the arterial side; preload lives on the venous side.",
    clinicalTakeaway:
      "Because a failing ventricle is highly afterload-sensitive, reducing systemic resistance can substantially improve its stroke volume.",
    remediationConcept:
      "Afterload is set by arterial resistance, arterial stiffness, and any obstruction to outflow. Preload is set on the venous side by volume and capacitance. Locate a change on the arterial or venous side of the circuit to know which it alters.",
    safetyPriority: false,
    tags: ["afterload", "resistance", "hemodynamics", "physiology"],
  },
  {
    id: "r075",
    conceptKey: "coronary-perfusion",
    topic: "Coronary perfusion",
    category: "Cardiac physiology",
    difficulty: 4,
    type: "mcq",
    stem: "Why is the left ventricular myocardium perfused mainly during diastole?",
    options: [
      { id: "a", text: "Systolic compression of intramural vessels obstructs flow until the muscle relaxes" },
      { id: "b", text: "Coronary arteries fill only when the aortic valve is open" },
      { id: "c", text: "Coronary venous pressure exceeds arterial pressure during systole" },
      { id: "d", text: "Oxygen extraction is possible only when the muscle is contracting" },
    ],
    correct: ["a"],
    rationale:
      "Coronary vessels run through the myocardial wall, so ventricular contraction squeezes them and sharply limits flow. Perfusion therefore occurs mainly after relaxation, when the vessels reopen and aortic root pressure drives flow. This dependence on diastole is greatest in the left ventricle, which generates the highest wall tension.",
    distractorRationales: {
      b: "The coronary ostia arise just above the aortic valve and flow continues after valve closure, driven by aortic root pressure.",
      c: "Coronary venous pressure remains well below arterial pressure throughout the cycle.",
      d: "Oxygen extraction continues throughout the cycle; the limiting factor is delivery, not extraction timing.",
    },
    keyClue: "The heart feeds itself while relaxed, so anything shortening diastole starves it.",
    clinicalTakeaway:
      "Tachycardia shortens diastole disproportionately, which is why a fast rate can provoke ischaemia even without a change in coronary anatomy.",
    remediationConcept:
      "Coronary perfusion depends on diastolic time and aortic root pressure, because systolic compression limits flow. Tachycardia shortens diastole and reduces supply just as demand rises. Assess supply and demand together when reasoning about ischaemia.",
    safetyPriority: false,
    tags: ["coronary", "perfusion", "diastole", "ischemia-link", "physiology"],
  },
  {
    id: "r076",
    conceptKey: "cardiac-output-determinants",
    topic: "Cardiac output",
    category: "Cardiac physiology",
    difficulty: 4,
    type: "mcq",
    stem: "A patient's heart rate rises abruptly to 190 beats per minute and blood pressure falls. Which mechanism explains the drop in output?",
    options: [
      { id: "a", text: "Shortened diastolic filling time reducing stroke volume more than the rate rise adds" },
      { id: "b", text: "Increased contractility overwhelming the aortic valve" },
      { id: "c", text: "Reduced systemic vascular resistance from the rapid rate" },
      { id: "d", text: "A rise in preload beyond the ventricle's capacity to relax" },
    ],
    correct: ["a"],
    rationale:
      "Diastole shortens far more than systole as rate rises, so the ventricle has less time to fill. Below a certain filling time, stroke volume falls proportionally more than the rate increases, so the product of the two declines. Coronary perfusion suffers at the same time, since it also depends on diastole.",
    distractorRationales: {
      b: "Contractility does not rise enough to compromise valve function, and the limiting problem is filling rather than ejection force.",
      c: "Resistance typically rises reflexively as pressure falls rather than dropping because of the rate.",
      d: "Preload falls rather than rises when filling time is curtailed.",
    },
    keyClue: "Above a threshold rate, lost filling time costs more stroke volume than the extra beats gain.",
    clinicalTakeaway:
      "A rapid rhythm with hypotension indicates haemodynamic compromise and warrants urgent evaluation rather than observation.",
    remediationConcept:
      "Cardiac output is rate multiplied by stroke volume, and the two can oppose each other. Very fast rates shorten diastolic filling, so stroke volume falls faster than rate rises and output declines. The same lost diastole also reduces coronary perfusion.",
    safetyPriority: true,
    tags: ["cardiac-output", "tachycardia", "filling", "priority", "hemodynamics"],
  },
  {
    id: "r077",
    topic: "Contractility",
    category: "Cardiac physiology",
    difficulty: 4,
    type: "mcq",
    stem: "Which change represents an increase in contractility rather than a change in loading conditions?",
    options: [
      { id: "a", text: "A greater stroke volume at the same end-diastolic volume and aortic pressure" },
      { id: "b", text: "A greater stroke volume after a fluid bolus raises end-diastolic volume" },
      { id: "c", text: "A greater stroke volume after systemic vascular resistance falls" },
      { id: "d", text: "A greater cardiac output produced by a faster heart rate" },
    ],
    correct: ["a"],
    rationale:
      "Contractility is the force of contraction at a given fibre length and load, so demonstrating it requires holding preload and afterload constant. If stroke volume improves while end-diastolic volume and aortic pressure are unchanged, the myocardium itself must be performing better.",
    distractorRationales: {
      b: "Improvement following a rise in end-diastolic volume is a preload effect operating through the Frank-Starling relationship.",
      c: "Improvement following a fall in resistance is an afterload effect rather than a change in intrinsic force.",
      d: "A faster rate raises output through the rate term without altering the force of each contraction.",
    },
    keyClue: "Contractility only counts when preload and afterload are held still.",
    clinicalTakeaway:
      "This is why ejection fraction is interpreted alongside loading conditions, since severe afterload changes can move it without any change in intrinsic muscle function.",
    remediationConcept:
      "Contractility is force at a fixed fibre length and load, so it can only be identified when preload and afterload are unchanged. Improvements after fluid or vasodilation are loading effects, not contractility. Always ask what else changed.",
    safetyPriority: false,
    tags: ["contractility", "stroke-volume", "hemodynamics", "physiology"],
  },
  {
    id: "r078",
    conceptKey: "afterload-determinants",
    topic: "Afterload",
    category: "Cardiac physiology",
    difficulty: 5,
    type: "mcq",
    stem: "Which mechanism explains why long-standing hypertension leads to left ventricular hypertrophy?",
    options: [
      { id: "a", text: "Chronically raised wall stress stimulates myocyte thickening to normalise that stress" },
      { id: "b", text: "Increased preload stretches myocytes until they permanently lengthen" },
      { id: "c", text: "Coronary vasodilation delivers excess nutrients that enlarge myocytes" },
      { id: "d", text: "Reduced afterload allows the ventricle to remodel into a thicker shape" },
    ],
    correct: ["a"],
    rationale:
      "Wall stress rises with chamber pressure and radius and falls with wall thickness. Sustained pressure overload therefore raises wall stress, and the myocardium responds by adding sarcomeres in parallel so the wall thickens and stress returns toward normal. The adaptation succeeds mechanically but costs compliance.",
    distractorRationales: {
      b: "Volume overload adds sarcomeres in series and causes chamber dilation, which is a different pattern of remodelling.",
      c: "Hypertrophy is a response to mechanical stress and neurohormonal signalling rather than to nutrient excess.",
      d: "Afterload is increased rather than reduced in hypertension, and it is that increase that drives the response.",
    },
    keyClue: "Pressure overload thickens the wall; volume overload dilates the chamber.",
    clinicalTakeaway:
      "The thickened, stiff ventricle fills poorly, which is the substrate for heart failure with preserved ejection fraction.",
    remediationConcept:
      "The ventricle remodels to normalise wall stress: pressure overload adds sarcomeres in parallel and thickens the wall, while volume overload adds them in series and dilates the chamber. Each adaptation carries a cost — thickening reduces compliance. Identify the overload type to predict the pattern.",
    safetyPriority: false,
    tags: ["afterload", "hypertrophy", "remodeling", "hypertension-link"],
  },
  {
    id: "r079",
    conceptKey: "coronary-perfusion",
    topic: "Coronary perfusion",
    category: "Cardiac physiology",
    difficulty: 4,
    type: "mcq",
    stem: "Which combination would most reduce myocardial oxygen supply while simultaneously raising demand?",
    options: [
      { id: "a", text: "Tachycardia with hypotension and left ventricular hypertrophy" },
      { id: "b", text: "Bradycardia with hypertension and a normal wall thickness" },
      { id: "c", text: "A normal rate with mild anaemia and normal blood pressure" },
      { id: "d", text: "Bradycardia with hypotension and a dilated chamber" },
    ],
    correct: ["a"],
    rationale:
      "Tachycardia shortens diastole and so reduces perfusion time while increasing the number of contractions per minute. Hypotension lowers the aortic root pressure driving coronary flow. Hypertrophied muscle has more tissue to supply and higher wall tension. Every element reduces supply or raises demand.",
    distractorRationales: {
      b: "Bradycardia lengthens diastole and improves perfusion time, and higher pressure supports coronary flow, though hypertension does add wall tension.",
      c: "Mild anaemia modestly reduces oxygen-carrying capacity but the other parameters remain favourable.",
      d: "Bradycardia preserves diastolic filling and perfusion time, which partly offsets the low pressure.",
    },
    keyClue: "Supply needs diastolic time and pressure; demand rises with rate, tension, and muscle mass.",
    clinicalTakeaway:
      "Because these factors compound, correcting rate and pressure often relieves ischaemia even when coronary anatomy is unchanged.",
    remediationConcept:
      "Myocardial ischaemia reflects the balance of supply and demand. Supply depends on diastolic duration, aortic root pressure, and oxygen-carrying capacity; demand depends on rate, wall tension, and contractility. Evaluate both sides before attributing ischaemia to anatomy alone.",
    safetyPriority: false,
    tags: ["coronary", "supply-demand", "ischemia-link", "hemodynamics"],
  },
  {
    id: "r080",
    topic: "Cardiac cycle",
    category: "Cardiac physiology",
    difficulty: 3,
    type: "mcq",
    stem: "During which phase of the cardiac cycle does the majority of ventricular filling occur?",
    options: [
      { id: "a", text: "Early diastole, through passive flow after the mitral valve opens" },
      { id: "b", text: "Late diastole, driven almost entirely by atrial contraction" },
      { id: "c", text: "Isovolumetric relaxation, before the mitral valve opens" },
      { id: "d", text: "Early systole, during isovolumetric contraction" },
    ],
    correct: ["a"],
    rationale:
      "When ventricular pressure falls below atrial pressure the mitral valve opens and blood flows in passively down the pressure gradient. This rapid early filling accounts for most of the end-diastolic volume, while atrial contraction contributes a smaller final increment, often described as around a fifth.",
    distractorRationales: {
      b: "Atrial contraction adds a useful but minor final portion; most filling has already occurred passively.",
      c: "During isovolumetric relaxation all valves are closed, so no filling can occur.",
      d: "Isovolumetric contraction is part of systole with the mitral valve closed, so filling has ended.",
    },
    keyClue: "Most filling is passive and early; the atrium only tops up the ventricle.",
    clinicalTakeaway:
      "Because the atrial contribution matters more when the ventricle is stiff, losing organised atrial contraction can noticeably reduce output in those patients.",
    remediationConcept:
      "Ventricular filling is mostly passive and occurs early in diastole once the mitral valve opens, with atrial contraction adding a final increment. That increment matters more when the ventricle is stiff or the rate is fast. This explains why losing atrial contraction is tolerated poorly by some patients.",
    safetyPriority: false,
    tags: ["cardiac-cycle", "diastole", "filling", "physiology"],
  },
];
