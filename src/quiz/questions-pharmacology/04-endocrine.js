// P31–40 — Endocrine pharmacology: corticosteroids, diabetes medications,
// and thyroid replacement therapy.
// Original items written for Sleek Academia. No commercial test-bank content.

export default [
  {
    id: "p031",
    topic: "Glucocorticoids",
    category: "Endocrine",
    difficulty: 3,
    type: "sata",
    stem:
      "A patient begins long-term oral prednisone therapy. Which adverse effects should the nurse practitioner anticipate monitoring for? Select all that apply.",
    options: [
      { id: "a", text: "Hyperglycemia" },
      { id: "b", text: "Osteoporosis with long-term use" },
      { id: "c", text: "Adrenal suppression" },
      { id: "d", text: "Hypotension" },
      { id: "e", text: "Weight gain and fluid retention" },
    ],
    correct: ["a", "b", "c", "e"],
    rationale:
      "Long-term glucocorticoid therapy can cause hyperglycemia through increased gluconeogenesis and insulin resistance, osteoporosis through impaired bone formation and calcium absorption, adrenal suppression from negative feedback on the hypothalamic-pituitary-adrenal axis, and weight gain with fluid retention from mineralocorticoid-like effects.",
    distractorRationales: {
      d: "Glucocorticoids typically cause fluid retention and can raise, not lower, blood pressure due to their mineralocorticoid activity.",
    },
    keyClue: "Long-term steroid use touches nearly every body system: glucose, bone, adrenal axis, and fluid balance.",
    clinicalTakeaway:
      "Long-term steroids must be tapered rather than stopped abruptly, because the adrenal glands need time to resume normal cortisol production.",
    remediationConcept:
      "Chronic glucocorticoid therapy causes hyperglycemia, osteoporosis, adrenal suppression, and fluid retention with weight gain, but tends to raise rather than lower blood pressure.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["glucocorticoid", "adverse-effect", "monitoring"],
  },
  {
    id: "p032",
    topic: "Glucocorticoids",
    category: "Endocrine",
    difficulty: 4,
    type: "mcq",
    stem:
      "A patient who has taken prednisone for eight months wants to stop the medication because they feel better. What is the priority teaching?",
    options: [
      { id: "a", text: "The dose must be tapered gradually to allow the adrenal glands to resume cortisol production" },
      { id: "b", text: "The medication can be stopped immediately with no risk" },
      { id: "c", text: "Stopping abruptly will only cause mild fatigue" },
      { id: "d", text: "The dose should be doubled the day before stopping" },
    ],
    correct: ["a"],
    rationale:
      "Prolonged exogenous corticosteroid use suppresses the hypothalamic-pituitary-adrenal axis, reducing the adrenal glands' own cortisol production. Abrupt discontinuation can precipitate acute adrenal insufficiency, a life-threatening emergency with hypotension, shock, and electrolyte derangement. A slow taper allows the axis to recover.",
    distractorRationales: {
      b: "Abrupt discontinuation after prolonged use carries real risk of adrenal crisis, not zero risk.",
      c: "The risk extends well beyond mild fatigue to potentially life-threatening adrenal insufficiency.",
      d: "Doubling the dose before stopping is not a recognized or safe way to discontinue chronic steroid therapy.",
    },
    keyClue: "Long-term steroid use plus wanting to stop should always trigger the taper-to-avoid-adrenal-crisis answer.",
    clinicalTakeaway:
      "Patients on chronic steroids should carry medical alert identification in case of trauma or illness requiring stress-dose steroid coverage.",
    remediationConcept:
      "Chronic exogenous steroids suppress the adrenal glands' own cortisol production. Abrupt discontinuation risks adrenal crisis, so tapering is required to allow the axis to recover.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["glucocorticoid", "adrenal-suppression", "discontinuation"],
  },
  {
    id: "p033",
    topic: "Insulin therapy",
    category: "Endocrine",
    difficulty: 3,
    type: "mcq",
    stem:
      "A patient using regular insulin before meals reports sweating, shakiness, and confusion two hours after the morning dose. What is the priority action?",
    options: [
      { id: "a", text: "Check blood glucose immediately and treat hypoglycemia if confirmed" },
      { id: "b", text: "Administer an additional dose of insulin" },
      { id: "c", text: "Have the patient lie down and wait 30 minutes before reassessing" },
      { id: "d", text: "Withhold all further food intake" },
    ],
    correct: ["a"],
    rationale:
      "Sweating, shakiness, and confusion two hours after a rapid or short-acting insulin dose are classic signs of hypoglycemia. The priority is to confirm with a point-of-care glucose check and treat promptly with fast-acting carbohydrate if hypoglycemia is confirmed, since untreated severe hypoglycemia can progress to seizure or loss of consciousness.",
    distractorRationales: {
      b: "Giving more insulin would worsen hypoglycemia and is dangerous in this presentation.",
      c: "Waiting without confirming and treating delays care for a potentially rapidly worsening emergency.",
      d: "Withholding food is the opposite of the needed intervention; fast-acting carbohydrate is indicated once hypoglycemia is confirmed.",
    },
    keyClue: "Sweating, shakiness, and confusion after insulin should always trigger an immediate glucose check.",
    clinicalTakeaway:
      "The 15-15 rule (15 grams of fast-acting carbohydrate, recheck glucose in 15 minutes) is the standard initial treatment for confirmed hypoglycemia in an alert patient.",
    remediationConcept:
      "Insulin's peak action window is the highest-risk period for hypoglycemia. Neuroglycopenic symptoms like confusion and shakiness require immediate glucose confirmation and treatment, not more insulin.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["insulin", "hypoglycemia", "priority-action"],
  },
  {
    id: "p034",
    topic: "Metformin",
    category: "Endocrine",
    difficulty: 4,
    type: "mcq",
    stem:
      "A patient on metformin is scheduled for a contrast-enhanced CT scan. What is the priority safety consideration?",
    options: [
      { id: "a", text: "Metformin may need to be held around the time of contrast administration due to lactic acidosis risk with reduced renal function" },
      { id: "b", text: "Metformin has no interaction with contrast dye" },
      { id: "c", text: "The dose of metformin should be doubled before the scan" },
      { id: "d", text: "Metformin must be given intravenously before the scan" },
    ],
    correct: ["a"],
    rationale:
      "Iodinated contrast dye can transiently impair renal function. Because metformin is renally cleared, reduced clearance can allow it to accumulate and increase the risk of lactic acidosis, a rare but serious adverse effect. Many protocols hold metformin around the time of contrast administration and resume it after renal function is confirmed stable.",
    distractorRationales: {
      b: "This is a well-recognized interaction due to the renal clearance pathway both share.",
      c: "Doubling the dose would increase, not decrease, lactic acidosis risk and is never indicated here.",
      d: "Metformin is an oral medication; it is not given intravenously, and this option does not address the actual safety concern.",
    },
    keyClue: "Metformin plus contrast dye should always raise the lactic acidosis and renal function question.",
    clinicalTakeaway:
      "Renal function should be reassessed after contrast administration before resuming metformin in patients with any baseline renal impairment.",
    remediationConcept:
      "Metformin is renally cleared, and contrast dye can transiently reduce renal function, raising lactic acidosis risk. Protocols often hold metformin around contrast administration and resume once renal function is confirmed stable.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["metformin", "contrast", "lactic-acidosis"],
  },
  {
    id: "p035",
    topic: "Levothyroxine",
    category: "Endocrine",
    difficulty: 2,
    type: "mcq",
    stem:
      "A patient newly prescribed levothyroxine for hypothyroidism asks the best time to take it. What is the correct teaching?",
    options: [
      { id: "a", text: "Take it on an empty stomach in the morning, at least 30 to 60 minutes before food or other medications" },
      { id: "b", text: "Take it with a large breakfast for best absorption" },
      { id: "c", text: "Take it at bedtime with dairy products" },
      { id: "d", text: "Timing does not affect absorption" },
    ],
    correct: ["a"],
    rationale:
      "Levothyroxine absorption is significantly reduced by food, coffee, calcium, and iron supplements. Taking it on an empty stomach, at least 30 to 60 minutes before breakfast or other medications, maximizes and stabilizes absorption, which is important given the medication's narrow therapeutic window.",
    distractorRationales: {
      b: "Food, especially high-fiber or high-calcium meals, reduces levothyroxine absorption rather than enhancing it.",
      c: "Dairy products contain calcium, which binds levothyroxine and reduces its absorption.",
      d: "Timing significantly affects absorption; inconsistent timing can cause fluctuating thyroid hormone levels.",
    },
    keyClue: "Levothyroxine and \"empty stomach, morning, away from other pills\" go together.",
    clinicalTakeaway:
      "Patients should also be taught to take levothyroxine consistently at the same time each day, since erratic timing can cause TSH levels to swing.",
    remediationConcept:
      "Levothyroxine absorption is impaired by food, calcium, and iron. Consistent, empty-stomach morning dosing away from other substances keeps thyroid hormone levels stable.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["levothyroxine", "administration", "absorption"],
  },
  {
    id: "p036",
    topic: "Thyroid replacement",
    category: "Endocrine",
    difficulty: 4,
    type: "mcq",
    stem:
      "An older adult with known coronary artery disease is started on levothyroxine for newly diagnosed hypothyroidism. What is the priority prescribing consideration?",
    options: [
      { id: "a", text: "Start at a low dose and titrate slowly to avoid precipitating angina or arrhythmia" },
      { id: "b", text: "Start at the full replacement dose immediately for fastest symptom relief" },
      { id: "c", text: "Coronary artery disease has no bearing on levothyroxine dosing" },
      { id: "d", text: "Levothyroxine should be avoided entirely in any patient with cardiac disease" },
    ],
    correct: ["a"],
    rationale:
      "Rapidly correcting hypothyroidism increases myocardial oxygen demand as metabolic rate rises. In patients with underlying coronary artery disease, this can precipitate angina, myocardial infarction, or arrhythmia. Starting at a low dose and titrating slowly, with cardiac monitoring, allows the heart to adjust safely.",
    distractorRationales: {
      b: "Full-dose replacement risks provoking cardiac ischemia in this population and is not the safer approach.",
      c: "Cardiac history is directly relevant and changes the starting dose and titration pace.",
      d: "Levothyroxine is not avoided outright in cardiac patients; it is dosed more cautiously.",
    },
    keyClue: "Older adult, known coronary disease, new hypothyroidism treatment should always trigger the low-and-slow titration answer.",
    clinicalTakeaway:
      "TSH and clinical response are reassessed roughly every 6 to 8 weeks after a dose change to guide further titration.",
    remediationConcept:
      "Correcting hypothyroidism raises metabolic demand on the heart. In coronary artery disease, levothyroxine is started low and titrated slowly to avoid provoking ischemia or arrhythmia.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["levothyroxine", "cardiac", "titration"],
  },
  {
    id: "p037",
    topic: "Sulfonylureas",
    category: "Endocrine",
    difficulty: 3,
    type: "mcq",
    stem:
      "Which mechanism describes how sulfonylureas such as glipizide lower blood glucose?",
    options: [
      { id: "a", text: "They stimulate insulin release from pancreatic beta cells" },
      { id: "b", text: "They increase peripheral insulin sensitivity" },
      { id: "c", text: "They slow carbohydrate absorption in the gut" },
      { id: "d", text: "They block glucose reabsorption in the kidney" },
    ],
    correct: ["a"],
    rationale:
      "Sulfonylureas bind to ATP-sensitive potassium channels on pancreatic beta cells, causing depolarization and calcium influx that trigger insulin release. Because this mechanism depends on functioning beta cells, sulfonylureas are ineffective in type 1 diabetes and carry a real risk of hypoglycemia.",
    distractorRationales: {
      b: "Increasing peripheral insulin sensitivity describes the mechanism of thiazolidinediones, not sulfonylureas.",
      c: "Slowing carbohydrate absorption describes alpha-glucosidase inhibitors such as acarbose.",
      d: "Blocking renal glucose reabsorption describes SGLT2 inhibitors such as empagliflozin.",
    },
    keyClue: "Sulfonylureas always mean \"squeeze more insulin out of the pancreas.\"",
    clinicalTakeaway:
      "Because sulfonylureas cause insulin release regardless of glucose level, they carry a meaningfully higher hypoglycemia risk than mechanisms that depend on elevated glucose, such as SGLT2 inhibitors.",
    remediationConcept:
      "Sulfonylureas stimulate pancreatic beta cells to release insulin. This mechanism requires functioning beta cells and carries a real hypoglycemia risk, distinguishing it from insulin-sensitizing or glucose-excreting drug classes.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["sulfonylurea", "mechanism", "diabetes"],
  },
  {
    id: "p038",
    topic: "SGLT2 inhibitors",
    category: "Endocrine",
    difficulty: 4,
    type: "mcq",
    stem:
      "A patient on empagliflozin reports frequent genital yeast infections since starting the medication. What is the most likely explanation?",
    options: [
      { id: "a", text: "The medication causes glucosuria, promoting yeast growth in the genital area" },
      { id: "b", text: "This is unrelated to the medication and is coincidental" },
      { id: "c", text: "Empagliflozin suppresses the immune system directly" },
      { id: "d", text: "Empagliflozin causes severe dehydration that leads to yeast infections" },
    ],
    correct: ["a"],
    rationale:
      "SGLT2 inhibitors work by blocking renal glucose reabsorption, deliberately causing glucose to be excreted in the urine (glucosuria). This sugar-rich environment in the genital area promotes yeast overgrowth, making genital mycotic infections one of the most common class-specific adverse effects.",
    distractorRationales: {
      b: "This is a well-documented, mechanism-based adverse effect, not a coincidental finding.",
      c: "SGLT2 inhibitors do not have a direct immunosuppressive mechanism; the effect is due to local glucose excretion.",
      d: "While mild volume depletion can occur with SGLT2 inhibitors, it is not the mechanism behind genital yeast infections; glucosuria is.",
    },
    keyClue: "SGLT2 inhibitors and genital yeast infections are a classic paired fact due to glucosuria.",
    clinicalTakeaway:
      "Patients started on SGLT2 inhibitors should receive proactive genital hygiene counseling given how common this adverse effect is.",
    remediationConcept:
      "SGLT2 inhibitors intentionally cause glucosuria to lower blood sugar, but the sugar-rich urine promotes genital yeast infections, a predictable class-specific adverse effect.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["sglt2-inhibitor", "adverse-effect", "mechanism"],
  },
  {
    id: "p039",
    topic: "Insulin",
    category: "Endocrine",
    difficulty: 3,
    type: "mcq",
    stem:
      "A patient asks why NPH insulin looks cloudy while regular insulin is clear. What is the best explanation?",
    options: [
      { id: "a", text: "NPH is an intermediate-acting suspension with protamine, which gives it a cloudy appearance" },
      { id: "b", text: "NPH insulin has expired and should not be used" },
      { id: "c", text: "Cloudiness indicates the insulin has been contaminated" },
      { id: "d", text: "All insulins are naturally cloudy and this is not significant" },
    ],
    correct: ["a"],
    rationale:
      "NPH insulin is formulated as a suspension with protamine and zinc, which delays absorption and extends its duration of action. This formulation gives it a characteristic cloudy appearance, unlike rapid- or short-acting insulins such as regular insulin, which remain clear solutions.",
    distractorRationales: {
      b: "Cloudiness is the expected, normal appearance of NPH insulin, not a sign of expiration.",
      c: "The cloudy appearance is due to the suspension's formulation, not contamination.",
      d: "Rapid-, short-, and long-acting insulins such as regular, lispro, and glargine are all clear; only intermediate-acting NPH is characteristically cloudy.",
    },
    keyClue: "Cloudy insulin should always be recognized as NPH's normal suspension appearance.",
    clinicalTakeaway:
      "Patients mixing NPH with regular insulin in the same syringe are taught to draw up the clear insulin first to avoid contaminating the regular insulin vial with protamine.",
    remediationConcept:
      "NPH insulin's protamine-zinc suspension gives it a cloudy appearance and intermediate duration of action, distinguishing it visually and pharmacokinetically from clear rapid-, short-, and long-acting insulins.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["insulin", "nph", "formulation"],
  },
  {
    id: "p040",
    topic: "Glucocorticoids",
    category: "Endocrine",
    difficulty: 3,
    type: "mcq",
    stem:
      "A patient on chronic corticosteroid therapy is exposed to varicella (chickenpox) for the first time and has no prior immunity. What is the priority concern?",
    options: [
      { id: "a", text: "Immunosuppression from the corticosteroid increases risk of severe or disseminated infection" },
      { id: "b", text: "Corticosteroids provide protection against viral infections" },
      { id: "c", text: "This exposure carries no additional risk compared to the general population" },
      { id: "d", text: "The corticosteroid should be increased to fight the infection" },
    ],
    correct: ["a"],
    rationale:
      "Chronic corticosteroid therapy suppresses cell-mediated immunity, increasing susceptibility to severe, disseminated, or atypical presentations of infections that are usually self-limited in immunocompetent hosts, including varicella. Nonimmune patients on significant steroid therapy who are exposed need prompt evaluation for post-exposure prophylaxis.",
    distractorRationales: {
      b: "Corticosteroids suppress, rather than support, the immune response needed to fight viral infection.",
      c: "Immunosuppressed patients face substantially higher risk of severe disease from this exposure than the general population.",
      d: "Increasing the corticosteroid dose would worsen immunosuppression and increase infection risk, not help fight it.",
    },
    keyClue: "Chronic steroids plus a new infectious exposure should always raise the immunosuppression risk flag.",
    clinicalTakeaway:
      "Live vaccines are generally avoided in patients on significant chronic corticosteroid doses due to the risk of vaccine-strain infection in an immunosuppressed host.",
    remediationConcept:
      "Chronic corticosteroids suppress cell-mediated immunity, raising the risk of severe or disseminated infection from otherwise mild illnesses like varicella, and this same suppression is why live vaccines are avoided on this therapy.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["glucocorticoid", "immunosuppression", "infection-risk"],
  },
];
