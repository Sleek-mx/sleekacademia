// P41–50 — Renal, urologic, and gastrointestinal pharmacology: diuretics,
// bladder agents, acid suppression, and motility drugs.
// Original items written for Sleek Academia. No commercial test-bank content.

export default [
  {
    id: "p041",
    topic: "Bladder pharmacology",
    category: "Renal and urologic",
    difficulty: 4,
    type: "mcq",
    stem:
      "A patient with detrusor underactivity reports that the bladder contracts weakly, if at all, and voiding is incomplete. Which class of medication would most directly address this problem?",
    options: [
      { id: "a", text: "A cholinergic agonist to stimulate detrusor contraction" },
      { id: "b", text: "An anticholinergic to relax the detrusor muscle" },
      { id: "c", text: "A beta-3 agonist to relax the bladder" },
      { id: "d", text: "An alpha-1 blocker to relax the bladder neck only" },
    ],
    correct: ["a"],
    rationale:
      "Detrusor underactivity means the bladder muscle contracts weakly or not at all during voiding attempts. A cholinergic agonist such as bethanechol stimulates muscarinic receptors on the detrusor muscle, promoting contraction and helping the bladder empty more completely.",
    distractorRationales: {
      b: "Anticholinergics relax the detrusor and are used for overactive bladder, the opposite clinical problem.",
      c: "Beta-3 agonists such as mirabegron relax the detrusor to increase bladder capacity, used for overactive bladder, not underactivity.",
      d: "Alpha-1 blockers relax the bladder neck and prostate smooth muscle to reduce outlet resistance; they do not stimulate detrusor contraction itself.",
    },
    keyClue: "Detrusor underactivity needs a drug that makes the bladder squeeze more, which is a cholinergic agonist.",
    clinicalTakeaway:
      "Cholinergic agonists like bethanechol are contraindicated in bladder outlet obstruction, since stimulating a contraction against a blocked outlet can worsen retention.",
    remediationConcept:
      "Detrusor underactivity is a weak or absent bladder contraction, treated by stimulating contraction with a cholinergic agonist. This is the mechanistic opposite of overactive bladder therapy, which relaxes the detrusor.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["bladder", "cholinergic", "urologic"],
  },
  {
    id: "p042",
    topic: "Bladder pharmacology",
    category: "Renal and urologic",
    difficulty: 3,
    type: "mcq",
    stem:
      "A patient is started on oxybutynin for overactive bladder. Which adverse effect should the nurse practitioner anticipate due to the medication's anticholinergic activity?",
    options: [
      { id: "a", text: "Dry mouth and constipation" },
      { id: "b", text: "Increased salivation and diarrhea" },
      { id: "c", text: "Bradycardia and miosis" },
      { id: "d", text: "Increased sweating" },
    ],
    correct: ["a"],
    rationale:
      "Oxybutynin blocks muscarinic receptors throughout the body, not just in the bladder. This produces classic anticholinergic effects: dry mouth, constipation, blurred vision, and urinary retention risk, all reflecting reduced parasympathetic activity.",
    distractorRationales: {
      b: "Anticholinergic drugs decrease, rather than increase, salivation and gut motility, so diarrhea and increased salivation are the opposite of the expected effect.",
      c: "Anticholinergics typically cause tachycardia and mydriasis (pupil dilation), not bradycardia and miosis.",
      d: "Anticholinergic effects reduce sweating; increased sweating is not consistent with this mechanism.",
    },
    keyClue: "Any anticholinergic drug means dry mouth, constipation, blurred vision, and urinary retention risk.",
    clinicalTakeaway:
      "Anticholinergic bladder medications should be used cautiously in older adults, who are more susceptible to cognitive side effects and constipation from this drug class.",
    remediationConcept:
      "Anticholinergic bladder medications block muscarinic receptors systemically, producing dry mouth, constipation, blurred vision, and tachycardia rather than the opposite parasympathetic-stimulation effects.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["bladder", "anticholinergic", "adverse-effect"],
  },
  {
    id: "p043",
    topic: "Loop diuretics",
    category: "Renal and urologic",
    difficulty: 3,
    type: "mcq",
    stem:
      "A patient on furosemide for heart failure should be monitored closely for which electrolyte disturbance?",
    options: [
      { id: "a", text: "Hypokalemia" },
      { id: "b", text: "Hyperkalemia" },
      { id: "c", text: "Hypercalcemia" },
      { id: "d", text: "Hypernatremia" },
    ],
    correct: ["a"],
    rationale:
      "Loop diuretics such as furosemide inhibit sodium-potassium-chloride cotransport in the thick ascending limb, causing significant loss of sodium, chloride, potassium, and calcium in the urine. Hypokalemia is a common and clinically important adverse effect requiring monitoring, especially in patients also on digoxin.",
    distractorRationales: {
      b: "Loop diuretics cause potassium loss, leading to hypokalemia, not hyperkalemia.",
      c: "Loop diuretics increase calcium excretion, which can cause hypocalcemia, not hypercalcemia.",
      d: "Loop diuretics typically cause sodium loss along with water loss; significant hypernatremia is not the primary concern.",
    },
    keyClue: "Loop diuretics and hypokalemia should always be paired in memory.",
    clinicalTakeaway:
      "The hypokalemia risk from loop diuretics is especially dangerous when combined with digoxin, since low potassium potentiates digoxin toxicity.",
    remediationConcept:
      "Loop diuretics block sodium-potassium-chloride reabsorption, causing significant potassium and calcium loss. Hypokalemia is the key electrolyte disturbance to monitor, particularly alongside digoxin therapy.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["diuretic", "electrolytes", "hypokalemia"],
  },
  {
    id: "p044",
    topic: "Potassium-sparing diuretics",
    category: "Renal and urologic",
    difficulty: 3,
    type: "mcq",
    stem:
      "A patient on spironolactone for heart failure is also taking a potassium supplement. What is the priority concern?",
    options: [
      { id: "a", text: "Hyperkalemia, since spironolactone spares potassium while the supplement adds more" },
      { id: "b", text: "Hypokalemia from the combination" },
      { id: "c", text: "No additional risk, since both medications are safe together" },
      { id: "d", text: "Hypernatremia from the combination" },
    ],
    correct: ["a"],
    rationale:
      "Spironolactone is a potassium-sparing diuretic that blocks aldosterone's sodium-potassium exchange in the distal nephron, retaining potassium. Adding a potassium supplement on top of this mechanism significantly raises the risk of dangerous hyperkalemia, which can cause life-threatening arrhythmias.",
    distractorRationales: {
      b: "The combination raises, rather than lowers, potassium, since both interventions push potassium retention or intake upward.",
      c: "This combination carries a well-documented, significant hyperkalemia risk requiring careful monitoring.",
      d: "Sodium is not the electrolyte primarily affected by this combination; potassium is.",
    },
    keyClue: "Potassium-sparing diuretics plus a potassium supplement (or an ACE inhibitor/ARB) is a classic hyperkalemia setup.",
    clinicalTakeaway:
      "Serum potassium should be monitored closely whenever spironolactone is combined with potassium supplements, ACE inhibitors, ARBs, or NSAIDs.",
    remediationConcept:
      "Spironolactone spares potassium by blocking aldosterone. Adding potassium supplementation on top of this mechanism creates a significant hyperkalemia risk requiring close monitoring.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["diuretic", "hyperkalemia", "interaction"],
  },
  {
    id: "p045",
    topic: "Proton pump inhibitors",
    category: "Gastrointestinal",
    difficulty: 3,
    type: "mcq",
    stem:
      "A patient has taken omeprazole daily for five years for reflux. Which long-term risk should be discussed?",
    options: [
      { id: "a", text: "Increased risk of bone fracture and vitamin B12 deficiency" },
      { id: "b", text: "Increased risk of hypertension" },
      { id: "c", text: "Increased risk of hyperglycemia" },
      { id: "d", text: "No long-term risks are associated with proton pump inhibitors" },
    ],
    correct: ["a"],
    rationale:
      "Long-term proton pump inhibitor use is associated with reduced calcium absorption and increased fracture risk, as well as vitamin B12 deficiency due to decreased gastric acid needed to release B12 from food. Long-term use is periodically reevaluated to confirm ongoing need at the lowest effective dose.",
    distractorRationales: {
      b: "Hypertension is not a well-established long-term risk of proton pump inhibitor therapy.",
      c: "Hyperglycemia is not a documented long-term effect of this drug class.",
      d: "Long-term PPI use does carry documented risks, including fracture and B12 deficiency, contrary to this option.",
    },
    keyClue: "Long-term PPI use always raises the bone fracture and B12 deficiency discussion.",
    clinicalTakeaway:
      "Patients on long-term PPI therapy should have periodic reassessment of ongoing need, and B12 levels checked if on therapy for several years.",
    remediationConcept:
      "Long-term acid suppression with PPIs reduces calcium absorption and B12 release from food, raising fracture and B12 deficiency risk over years of use.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["ppi", "long-term-use", "adverse-effect"],
  },
  {
    id: "p046",
    topic: "Laxatives",
    category: "Gastrointestinal",
    difficulty: 2,
    type: "mcq",
    stem:
      "A patient with opioid-induced constipation asks why a stimulant laxative alone is not the first choice. What is the best explanation?",
    options: [
      { id: "a", text: "A stool softener or osmotic agent is often combined or tried first, since opioids slow motility and harden stool" },
      { id: "b", text: "Stimulant laxatives are always the correct first-line choice for any constipation" },
      { id: "c", text: "Opioid-induced constipation cannot be treated with any laxative" },
      { id: "d", text: "Fiber supplements alone fully resolve opioid-induced constipation" },
    ],
    correct: ["a"],
    rationale:
      "Opioids slow gastrointestinal motility and increase water reabsorption, producing hard, difficult-to-pass stool. A stimulant laxative combined with a stool softener, or an osmotic agent, addresses both reduced motility and stool consistency more effectively than either approach alone, and is a standard bowel regimen for patients on chronic opioids.",
    distractorRationales: {
      b: "Stimulant laxatives alone may not adequately address the hardened stool component of opioid-induced constipation.",
      c: "Opioid-induced constipation is treatable and is, in fact, expected and proactively managed with a bowel regimen.",
      d: "Fiber alone can worsen opioid-induced constipation in some patients if fluid intake and motility are not also addressed, since it adds bulk without necessarily improving transit.",
    },
    keyClue: "Opioid-induced constipation calls for a combination bowel regimen, not a single laxative type.",
    clinicalTakeaway:
      "A scheduled bowel regimen should be started proactively, not reactively, whenever a patient begins chronic opioid therapy.",
    remediationConcept:
      "Opioids slow motility and harden stool through two separate mechanisms, so effective treatment usually combines a stimulant laxative with a stool softener or osmotic agent rather than relying on one class alone.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["laxative", "opioid", "constipation"],
  },
  {
    id: "p047",
    topic: "Antiemetics",
    category: "Gastrointestinal",
    difficulty: 4,
    type: "mcq",
    stem:
      "A patient receiving ondansetron for chemotherapy-induced nausea has a baseline prolonged QT interval on ECG. What is the priority nursing consideration?",
    options: [
      { id: "a", text: "Ondansetron can further prolong the QT interval and should be used cautiously with cardiac monitoring" },
      { id: "b", text: "Ondansetron has no cardiac effects and can be given without concern" },
      { id: "c", text: "The QT interval finding is unrelated to antiemetic therapy" },
      { id: "d", text: "Ondansetron should always be given as a rapid IV push regardless of cardiac history" },
    ],
    correct: ["a"],
    rationale:
      "Ondansetron and other 5-HT3 receptor antagonists carry a dose-dependent risk of QT interval prolongation, which can predispose to torsades de pointes, a life-threatening arrhythmia. In a patient with a baseline prolonged QT, the medication should be used cautiously, at the lowest effective dose, with ECG monitoring as appropriate.",
    distractorRationales: {
      b: "Ondansetron does have a recognized cardiac effect on QT interval and is not free of cardiac risk.",
      c: "The QT prolongation is directly related to this drug class and is a known, labeled risk.",
      d: "Rapid IV push administration is specifically avoided with ondansetron because it can increase the risk of QT prolongation and arrhythmia; slower infusion is preferred.",
    },
    keyClue: "Ondansetron plus a prolonged QT interval should always raise a cardiac monitoring flag.",
    clinicalTakeaway:
      "Electrolyte abnormalities such as hypokalemia and hypomagnesemia further increase QT prolongation risk and should be corrected before or during ondansetron therapy when possible.",
    remediationConcept:
      "5-HT3 antagonists like ondansetron carry dose-dependent QT prolongation risk. A baseline prolonged QT warrants cautious use, slower administration, and possible cardiac monitoring rather than routine dosing.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["antiemetic", "qt-prolongation", "cardiac"],
  },
  {
    id: "p048",
    topic: "H2 receptor antagonists",
    category: "Gastrointestinal",
    difficulty: 3,
    type: "mcq",
    stem:
      "Which mechanism describes how famotidine reduces gastric acid secretion?",
    options: [
      { id: "a", text: "It blocks histamine H2 receptors on gastric parietal cells" },
      { id: "b", text: "It irreversibly inhibits the hydrogen-potassium ATPase pump" },
      { id: "c", text: "It neutralizes existing stomach acid directly" },
      { id: "d", text: "It coats the gastric mucosa to form a physical barrier" },
    ],
    correct: ["a"],
    rationale:
      "Famotidine is a histamine H2 receptor antagonist. By blocking H2 receptors on parietal cells, it reduces histamine-stimulated acid secretion. This mechanism is distinct from proton pump inhibitors, which act further downstream on the acid-secreting pump itself.",
    distractorRationales: {
      b: "Irreversible inhibition of the hydrogen-potassium ATPase pump describes proton pump inhibitors such as omeprazole, not H2 blockers.",
      c: "Direct neutralization of existing acid describes antacids like calcium carbonate, a different mechanism entirely.",
      d: "Forming a physical mucosal barrier describes agents like sucralfate, not H2 receptor antagonists.",
    },
    keyClue: "H2 blockers act on the histamine receptor upstream; PPIs act on the acid pump downstream.",
    clinicalTakeaway:
      "PPIs generally provide more potent and sustained acid suppression than H2 blockers because they act directly on the final common pathway of acid secretion.",
    remediationConcept:
      "H2 receptor antagonists block histamine-driven acid secretion at the parietal cell receptor, an earlier step in the pathway than proton pump inhibitors, which block the acid pump itself.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["h2-blocker", "mechanism", "gastrointestinal"],
  },
  {
    id: "p049",
    topic: "Renal drug dosing",
    category: "Renal and urologic",
    difficulty: 4,
    type: "mcq",
    stem:
      "A patient with a significantly reduced glomerular filtration rate is prescribed a medication that is primarily renally eliminated. What is the priority prescribing consideration?",
    options: [
      { id: "a", text: "The dose or dosing interval should be adjusted based on the degree of renal impairment to prevent drug accumulation" },
      { id: "b", text: "No dose adjustment is ever needed regardless of renal function" },
      { id: "c", text: "The medication should always be given at double the standard dose" },
      { id: "d", text: "Renal function is only relevant for medications given intravenously" },
    ],
    correct: ["a"],
    rationale:
      "When a medication is primarily cleared by the kidneys, reduced glomerular filtration slows its elimination, raising the risk of drug accumulation and toxicity. Dose or interval adjustment based on renal function, often guided by calculated creatinine clearance, is a core principle of safe prescribing in renal impairment.",
    distractorRationales: {
      b: "Renally eliminated drugs specifically require dose adjustment in impaired renal function; skipping this raises toxicity risk.",
      c: "Doubling the dose would worsen accumulation and toxicity risk in renal impairment, not correct it.",
      d: "Renal function affects clearance regardless of route of administration, including oral medications that are renally eliminated.",
    },
    keyClue: "Reduced GFR plus a renally eliminated drug should always trigger a dose-adjustment answer.",
    clinicalTakeaway:
      "Creatinine clearance, not serum creatinine alone, should guide renal dose adjustments, since serum creatinine can lag behind true kidney function changes.",
    remediationConcept:
      "Renally eliminated drugs accumulate when glomerular filtration is reduced. Dose or interval adjustment based on renal function is required to avoid toxicity, a principle that applies regardless of route.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["renal-dosing", "gfr", "safety"],
  },
  {
    id: "p050",
    topic: "Antiemetics",
    category: "Gastrointestinal",
    difficulty: 3,
    type: "mcq",
    stem:
      "A patient receiving metoclopramide for gastroparesis develops involuntary facial grimacing and repetitive movements after several months of use. What should be suspected?",
    options: [
      { id: "a", text: "Tardive dyskinesia from prolonged dopamine receptor blockade" },
      { id: "b", text: "A normal, expected effect of the medication" },
      { id: "c", text: "An allergic reaction requiring epinephrine" },
      { id: "d", text: "Simple anxiety unrelated to the medication" },
    ],
    correct: ["a"],
    rationale:
      "Metoclopramide is a dopamine receptor antagonist, and prolonged use carries a risk of extrapyramidal effects, including tardive dyskinesia, similar to antipsychotic medications. Because of this risk, metoclopramide is generally recommended only for short-term use, and any involuntary movement should prompt discontinuation and evaluation.",
    distractorRationales: {
      b: "Involuntary facial movements are an adverse effect, not a normal or expected therapeutic response.",
      c: "This presentation is a movement disorder, not an anaphylactic or allergic reaction requiring epinephrine.",
      d: "The involuntary, repetitive nature of the movements points to a drug-induced movement disorder rather than simple anxiety.",
    },
    keyClue: "Metoclopramide plus involuntary facial movements after prolonged use signals tardive dyskinesia, just as with antipsychotics.",
    clinicalTakeaway:
      "Metoclopramide carries a boxed warning limiting use to generally no longer than 12 weeks specifically because of this tardive dyskinesia risk.",
    remediationConcept:
      "Metoclopramide's dopamine-blocking mechanism carries the same tardive dyskinesia risk as antipsychotics with prolonged use, which is why therapy duration is limited and any involuntary movement warrants stopping the drug.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["metoclopramide", "tardive-dyskinesia", "adverse-effect"],
  },
];
