// P51–60 — Pain management, opioids, and controlled substance safety.
// Original items written for Sleek Academia. No commercial test-bank content.

export default [
  {
    id: "p051",
    topic: "Opioid overdose",
    category: "Pain management",
    difficulty: 3,
    type: "mcq",
    stem:
      "A patient found unresponsive with pinpoint pupils and a respiratory rate of 4 breaths per minute is suspected of opioid overdose. Which medication should be administered first?",
    options: [
      { id: "a", text: "Naloxone" },
      { id: "b", text: "Flumazenil" },
      { id: "c", text: "Additional opioid to reverse tolerance" },
      { id: "d", text: "Activated charcoal" },
    ],
    correct: ["a"],
    rationale:
      "Pinpoint pupils, severe respiratory depression, and unresponsiveness form the classic opioid overdose triad. Naloxone is a competitive opioid receptor antagonist that rapidly reverses respiratory depression and is the priority intervention, along with supporting ventilation.",
    distractorRationales: {
      b: "Flumazenil reverses benzodiazepine, not opioid, effects and would not address this presentation's underlying cause.",
      c: "Giving more opioid would worsen respiratory depression and is dangerous.",
      d: "Activated charcoal is used for certain oral ingestions within a specific time window and does not address acute respiratory depression; it is not the priority action here.",
    },
    keyClue: "Pinpoint pupils plus respiratory depression is the classic opioid overdose triad calling for naloxone.",
    clinicalTakeaway:
      "Because naloxone's duration of action can be shorter than some opioids, patients must be monitored for re-sedation after reversal and may need repeat dosing.",
    remediationConcept:
      "Opioid overdose presents with pinpoint pupils, respiratory depression, and decreased consciousness. Naloxone, a competitive opioid antagonist, rapidly reverses this and is the priority intervention alongside airway support.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["opioid", "overdose", "naloxone"],
  },
  {
    id: "p052",
    topic: "Opioid safety",
    category: "Pain management",
    difficulty: 3,
    type: "sata",
    stem:
      "A patient is newly started on an opioid for chronic pain. Which teaching points should be included? Select all that apply.",
    options: [
      { id: "a", text: "Avoid alcohol and other CNS depressants due to additive respiratory depression risk" },
      { id: "b", text: "Start a bowel regimen proactively, since constipation is expected" },
      { id: "c", text: "Driving is completely safe immediately after starting the medication" },
      { id: "d", text: "Report new or worsening sedation and slowed breathing right away" },
      { id: "e", text: "The medication carries a real risk of misuse and dependence with long-term use" },
    ],
    correct: ["a", "b", "d", "e"],
    rationale:
      "Safe opioid teaching includes avoiding other CNS depressants due to additive respiratory depression, starting a proactive bowel regimen since near-universal constipation is expected, reporting sedation or breathing changes immediately, and understanding the real risk of misuse and dependence with ongoing use.",
    distractorRationales: {
      c: "Driving should be avoided until the patient knows how the medication affects alertness and coordination, since opioids can impair reaction time and judgment, especially early in therapy or after a dose change.",
    },
    keyClue: "Opioid teaching always covers CNS depressant interactions, constipation, sedation/respiratory monitoring, and dependence risk.",
    clinicalTakeaway:
      "Naloxone co-prescribing is increasingly recommended for patients on higher-dose or long-term opioid therapy, or those with additional overdose risk factors.",
    remediationConcept:
      "Safe opioid teaching covers additive CNS depression with other substances, proactive constipation management, sedation and respiratory monitoring, and honest discussion of dependence risk — but never assumes driving safety is unaffected.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["opioid", "patient-education", "safety"],
  },
  {
    id: "p053",
    topic: "Opioid tolerance and dependence",
    category: "Pain management",
    difficulty: 4,
    type: "mcq",
    stem:
      "A patient on stable long-term opioid therapy for chronic pain asks the nurse practitioner to explain the difference between physical dependence and addiction. What is the most accurate response?",
    options: [
      { id: "a", text: "Physical dependence is an expected physiologic adaptation with withdrawal on abrupt stop, while addiction is compulsive use despite harm" },
      { id: "b", text: "Physical dependence and addiction describe exactly the same underlying phenomenon and can be used interchangeably in documentation" },
      { id: "c", text: "Only patients who misuse or divert their opioid prescription ever go on to develop true physical dependence on the medication" },
      { id: "d", text: "Physical dependence is something that only occurs with illicit, non-prescribed drug use and never with medically supervised therapy" },
    ],
    correct: ["a"],
    rationale:
      "Physical dependence is a predictable physiologic adaptation to sustained opioid exposure, producing withdrawal symptoms if the drug is stopped abruptly or reversed; it can occur in any patient on chronic therapy, appropriately prescribed or not. Addiction, in contrast, is a behavioral disorder characterized by compulsive use despite negative consequences, loss of control, and craving.",
    distractorRationales: {
      b: "These are distinct clinical concepts; conflating them stigmatizes patients who are appropriately dependent but not addicted.",
      c: "Physical dependence develops in essentially any patient on sustained opioid therapy, regardless of whether use is appropriate or misused.",
      d: "Physical dependence can occur with legitimately prescribed, appropriately used opioids just as it can with illicit use.",
    },
    keyClue: "Dependence is physiologic and expected; addiction is behavioral and defined by compulsive, harmful use.",
    clinicalTakeaway:
      "Understanding this distinction helps prescribers avoid under-treating pain out of unfounded addiction fears in patients who are simply physically dependent.",
    remediationConcept:
      "Physical dependence is a predictable physiologic adaptation producing withdrawal on abrupt cessation, distinct from addiction, which is a behavioral pattern of compulsive use despite harm. Any chronic opioid patient can be dependent without being addicted.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["opioid", "dependence", "addiction"],
  },
  {
    id: "p054",
    topic: "Acetaminophen toxicity",
    category: "Pain management",
    difficulty: 4,
    type: "mcq",
    stem:
      "A patient presents 10 hours after an intentional large acetaminophen overdose. Which treatment is the priority?",
    options: [
      { id: "a", text: "N-acetylcysteine to replenish hepatic glutathione stores" },
      { id: "b", text: "Naloxone" },
      { id: "c", text: "Flumazenil" },
      { id: "d", text: "Observation only, since acetaminophen overdose is rarely serious" },
    ],
    correct: ["a"],
    rationale:
      "Acetaminophen overdose depletes hepatic glutathione, allowing a toxic metabolite (NAPQI) to accumulate and cause severe, potentially fatal hepatotoxicity. N-acetylcysteine replenishes glutathione and is most effective when started within 8 to 10 hours of ingestion, though it still provides benefit later and should be given as soon as toxicity is confirmed or strongly suspected.",
    distractorRationales: {
      b: "Naloxone reverses opioid, not acetaminophen, toxicity and has no role here.",
      c: "Flumazenil reverses benzodiazepine effects and is unrelated to acetaminophen toxicity.",
      d: "Acetaminophen overdose can cause severe, life-threatening liver failure and requires active treatment, not passive observation alone.",
    },
    keyClue: "Acetaminophen overdose always points to N-acetylcysteine and hepatotoxicity risk.",
    clinicalTakeaway:
      "Acetaminophen levels are plotted on the Rumack-Matthew nomogram against time since ingestion to help determine whether N-acetylcysteine treatment is indicated.",
    remediationConcept:
      "Acetaminophen overdose depletes glutathione, allowing toxic NAPQI to cause liver injury. N-acetylcysteine restores glutathione and is most effective early, making prompt recognition and treatment essential.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["acetaminophen", "toxicity", "antidote"],
  },
  {
    id: "p055",
    topic: "NSAIDs",
    category: "Pain management",
    difficulty: 3,
    type: "sata",
    stem:
      "Which adverse effects are associated with chronic NSAID use? Select all that apply.",
    options: [
      { id: "a", text: "Gastrointestinal ulceration and bleeding" },
      { id: "b", text: "Reduced renal blood flow and acute kidney injury risk" },
      { id: "c", text: "Increased cardiovascular thrombotic risk" },
      { id: "d", text: "Improved platelet aggregation" },
      { id: "e", text: "Fluid retention and worsened blood pressure control" },
    ],
    correct: ["a", "b", "c", "e"],
    rationale:
      "Chronic NSAID use inhibits prostaglandin synthesis, which protects gastric mucosa and maintains renal blood flow. This can cause gastrointestinal ulceration, reduced renal perfusion, fluid retention with worsened blood pressure, and for some agents, increased cardiovascular thrombotic risk.",
    distractorRationales: {
      d: "NSAIDs, particularly aspirin, tend to inhibit rather than improve platelet aggregation by blocking thromboxane synthesis.",
    },
    keyClue: "Prostaglandin inhibition explains nearly every major NSAID adverse effect: gut, kidney, and cardiovascular.",
    clinicalTakeaway:
      "NSAIDs should be used cautiously or avoided in patients with heart failure, chronic kidney disease, or a history of GI bleeding given this shared mechanism.",
    remediationConcept:
      "NSAIDs block prostaglandin synthesis, which normally protects gastric mucosa and renal perfusion. This explains their shared risks of GI bleeding, kidney injury, fluid retention, and cardiovascular thrombotic events, and why platelet aggregation is inhibited rather than enhanced.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["nsaid", "adverse-effect", "mechanism"],
  },
  {
    id: "p056",
    topic: "NSAIDs in pregnancy",
    category: "Pain management",
    difficulty: 4,
    type: "mcq",
    stem:
      "A pregnant patient in the third trimester asks about using ibuprofen for back pain. What is the priority safety concern?",
    options: [
      { id: "a", text: "NSAIDs can cause premature closure of the fetal ductus arteriosus late in pregnancy" },
      { id: "b", text: "NSAIDs are completely safe throughout pregnancy" },
      { id: "c", text: "NSAIDs are only a concern in the first trimester" },
      { id: "d", text: "NSAIDs have no effect on fetal cardiovascular structures" },
    ],
    correct: ["a"],
    rationale:
      "NSAIDs inhibit prostaglandin synthesis, and prostaglandins help keep the fetal ductus arteriosus open. Use in the third trimester, particularly after about 30 weeks, carries a risk of premature ductal closure, leading to fetal pulmonary hypertension. NSAIDs are generally avoided in the third trimester for this reason.",
    distractorRationales: {
      b: "NSAIDs carry a specific, well-documented risk in late pregnancy and are not considered universally safe throughout gestation.",
      c: "The ductal closure risk is specifically a third-trimester concern, not a first-trimester one.",
      d: "NSAIDs directly affect fetal cardiovascular structures through this prostaglandin-dependent mechanism.",
    },
    keyClue: "NSAIDs plus third trimester should always trigger the ductus arteriosus closure concern.",
    clinicalTakeaway:
      "Acetaminophen is generally preferred over NSAIDs for pain relief throughout pregnancy given this ductal closure risk.",
    remediationConcept:
      "NSAIDs inhibit prostaglandins that keep the fetal ductus arteriosus open. Third-trimester use risks premature ductal closure and fetal pulmonary hypertension, which is why NSAIDs are avoided late in pregnancy in favor of acetaminophen.",
    pregnancyRelated: true,
    safetyPriority: true,
    tags: ["nsaid", "pregnancy", "ductus-arteriosus"],
  },
  {
    id: "p057",
    topic: "Opioid rotation and dosing",
    category: "Pain management",
    difficulty: 4,
    type: "mcq",
    stem:
      "A patient is being switched from oral morphine to a different opioid for improved pain control. What principle should guide the new starting dose?",
    options: [
      { id: "a", text: "Use an equianalgesic conversion and typically reduce the calculated dose to account for incomplete cross-tolerance" },
      { id: "b", text: "Use the exact same milligram dose regardless of the new medication" },
      { id: "c", text: "Start at the maximum possible dose of the new opioid immediately" },
      { id: "d", text: "Cross-tolerance between opioids is always complete, so no dose reduction is needed" },
    ],
    correct: ["a"],
    rationale:
      "Different opioids vary in potency, so an equianalgesic conversion table is used to estimate a comparable dose. Because cross-tolerance between opioids is often incomplete, the calculated dose of the new opioid is typically reduced by 25 to 50% to avoid inadvertent overdose, then titrated based on response.",
    distractorRationales: {
      b: "Different opioids have different potencies; using the same milligram dose ignores this and risks significant under- or overdosing.",
      c: "Starting at the maximum dose risks serious overdose, especially given incomplete cross-tolerance.",
      d: "Cross-tolerance between opioids is frequently incomplete, which is precisely why a dose reduction is built into safe rotation practice.",
    },
    keyClue: "Opioid rotation always involves an equianalgesic conversion plus a safety dose reduction.",
    clinicalTakeaway:
      "Careful opioid rotation with dose reduction is one of the most important safety practices in pain management to prevent iatrogenic overdose.",
    remediationConcept:
      "Opioid rotation requires an equianalgesic dose conversion, then a reduction of roughly 25 to 50% to account for incomplete cross-tolerance between different opioids, followed by careful titration.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["opioid", "rotation", "dosing"],
  },
  {
    id: "p058",
    topic: "Neuropathic pain agents",
    category: "Pain management",
    difficulty: 3,
    type: "mcq",
    stem:
      "A patient with diabetic peripheral neuropathy is started on gabapentin. What teaching point is most important regarding onset of effect?",
    options: [
      { id: "a", text: "Pain relief may take several weeks of consistent use to become fully apparent" },
      { id: "b", text: "Pain relief occurs immediately after the first dose" },
      { id: "c", text: "The medication should be stopped if pain does not improve within 24 hours" },
      { id: "d", text: "Gabapentin works only for acute, not chronic, pain" },
    ],
    correct: ["a"],
    rationale:
      "Gabapentin's analgesic effect for neuropathic pain typically requires gradual dose titration and several weeks of consistent use before its full benefit is apparent. Setting this expectation helps prevent patients from discontinuing prematurely, believing the medication is not working.",
    distractorRationales: {
      b: "Neuropathic pain relief with gabapentin is gradual, not immediate, and requires titration to an effective dose.",
      c: "A trial of at least several weeks at an adequately titrated dose is generally needed before concluding the medication is ineffective.",
      d: "Gabapentin is specifically used for chronic neuropathic pain conditions like diabetic neuropathy, not primarily for acute pain.",
    },
    keyClue: "Gabapentin for neuropathic pain always requires patience and gradual titration, not a fast result.",
    clinicalTakeaway:
      "Gabapentin should also be tapered rather than stopped abruptly, since sudden discontinuation can cause withdrawal symptoms including anxiety and insomnia.",
    remediationConcept:
      "Gabapentin requires gradual titration and several weeks of use before neuropathic pain relief is fully apparent, and like other CNS-active agents, it should be tapered rather than stopped abruptly.",
    pregnancyRelated: false,
    safetyPriority: false,
    tags: ["gabapentin", "neuropathic-pain", "patient-education"],
  },
  {
    id: "p059",
    topic: "Controlled substance monitoring",
    category: "Pain management",
    difficulty: 3,
    type: "mcq",
    stem:
      "A prescriber is establishing a long-term opioid therapy plan for chronic noncancer pain. Which practice best supports safe prescribing and monitoring?",
    options: [
      { id: "a", text: "Checking the state prescription drug monitoring program before prescribing and periodically thereafter" },
      { id: "b", text: "Relying solely on the patient's verbal report of other prescriptions" },
      { id: "c", text: "Avoiding any urine drug screening once trust is established" },
      { id: "d", text: "Prescribing the largest supply possible to minimize office visits" },
    ],
    correct: ["a"],
    rationale:
      "Prescription drug monitoring programs allow prescribers to verify controlled substance prescriptions a patient has received from other providers, helping identify duplicate therapy, diversion risk, or dangerous combinations such as concurrent benzodiazepine prescribing. Checking this database before initiating and periodically during long-term opioid therapy is a recommended safety practice.",
    distractorRationales: {
      b: "Verbal report alone is unreliable and does not substitute for objective verification through the monitoring program.",
      c: "Periodic urine drug screening remains part of recommended long-term opioid monitoring regardless of established trust, to support both safety and appropriate use.",
      d: "Prescribing large supplies increases diversion and overdose risk rather than supporting safe monitoring.",
    },
    keyClue: "Safe long-term opioid prescribing always includes prescription drug monitoring program checks and periodic urine screening.",
    clinicalTakeaway:
      "Concurrent benzodiazepine and opioid prescribing, easily identified through the monitoring program, significantly increases overdose risk and should prompt a careful risk-benefit discussion.",
    remediationConcept:
      "Safe long-term opioid prescribing includes checking the prescription drug monitoring program before and during therapy and continuing periodic urine drug screening, rather than relying on patient report or established trust alone.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["controlled-substances", "opioid", "monitoring"],
  },
  {
    id: "p060",
    topic: "Opioid-induced respiratory depression",
    category: "Pain management",
    difficulty: 4,
    type: "mcq",
    stem:
      "A postoperative patient receiving IV opioid pain control via patient-controlled analgesia becomes difficult to arouse, with a respiratory rate of 6 breaths per minute. What is the priority nursing action?",
    options: [
      { id: "a", text: "Stop the opioid infusion, stimulate the patient, and prepare naloxone" },
      { id: "b", text: "Increase the opioid dose to improve comfort" },
      { id: "c", text: "Document the finding and reassess in one hour" },
      { id: "d", text: "Encourage the patient to press the PCA button more frequently" },
    ],
    correct: ["a"],
    rationale:
      "A respiratory rate of 6 breaths per minute with decreased arousability in a patient on opioid PCA indicates significant opioid-induced respiratory depression, an emergency. The priority is to stop the opioid, attempt to arouse and stimulate the patient, ensure adequate oxygenation, and have naloxone ready for administration if the patient does not respond promptly.",
    distractorRationales: {
      b: "Increasing the opioid dose would worsen an already dangerous respiratory depression.",
      c: "Waiting an hour to reassess delays intervention for a rapidly life-threatening situation.",
      d: "Encouraging more PCA use would deliver more opioid and worsen the respiratory depression.",
    },
    keyClue: "Respiratory rate under 8 with sedation on opioids is always a stop-the-infusion, prepare-naloxone emergency.",
    clinicalTakeaway:
      "Sedation scales are used alongside respiratory rate during opioid PCA monitoring, since increasing sedation often precedes respiratory depression and gives an earlier warning sign.",
    remediationConcept:
      "Opioid-induced respiratory depression with decreased arousability is a medical emergency requiring immediate cessation of the opioid, stimulation, oxygenation support, and naloxone readiness rather than continued or increased dosing.",
    pregnancyRelated: false,
    safetyPriority: true,
    tags: ["opioid", "respiratory-depression", "priority-action"],
  },
];
