// NVIDIA NIM / Nemotron 3 Super integration for the interactive remediation loop.
//
// Flow after a missed question:
//   1. notes   — short targeted teaching notes on the missed concept
//   2. probe   — two open-ended questions testing that concept
//   3. evaluate — feedback on the learner's free-text answers, then the quiz resumes
//
// Model note: nemotron-3-super-120b-a12b is a reasoning model and returns a
// `reasoning_content` field alongside `content`. Only `content` is ever shown —
// see extractContent.

import axios from "axios";

export const NEMOTRON_MODEL = "nvidia/nemotron-3-super-120b-a12b";
const NIM_ENDPOINT = "https://integrate.api.nvidia.com/v1/chat/completions";

// Kept well under the edge proxy's ~100s ceiling. A request that exceeds this is
// abandoned in favour of the bank-derived fallback, which is instant.
const REQUEST_TIMEOUT_MS = 25_000;
const RETRY_TIMEOUT_MS = 15_000;

/**
 * Per-quiz tutor framing. Everything domain-specific in the prompts comes from
 * here so one tutor implementation serves every quiz.
 *
 * @typedef {object} TutorDomain
 * @property {string} subject       - what the tutor teaches, e.g. "antimicrobial pharmacology"
 * @property {string} course        - course context, e.g. "NURS 5334 antimicrobial pharmacology"
 * @property {string} categoryLabel - label for the bank's secondary axis
 * @property {string} inventionRule - the "never invent X" guard for this domain
 * @property {string} absolutesRule - the "never claim universal X" guard
 */

/** @type {TutorDomain} */
export const DEFAULT_DOMAIN = {
  subject: "nursing pharmacology",
  course: "NURS 5334 antimicrobial pharmacology",
  categoryLabel: "Medication class",
  inventionRule: "Never invent drug facts.",
  absolutesRule:
    "Never state that a medication is universally safe or universally contraindicated.",
};

function systemPrompt(domain) {
  return [
    `You are a graduate-level ${domain.subject} tutor for Sleek Academia, coaching a`,
    `Doctor of Nursing Practice student through ${domain.course}.`,
    "",
    "Rules:",
    "- Be precise and clinically accurate. Graduate level, not undergraduate.",
    "- Be concise. No filler, no praise padding, no emoji, no exclamation marks.",
    `- ${domain.inventionRule} If something is genuinely uncertain, say so plainly.`,
    `- ${domain.absolutesRule}`,
    "- Use 'notify the prescriber', 'hold according to protocol' or 'obtain urgent evaluation'",
    "  rather than implying a nurse independently discontinues therapy.",
    "- Never include patient-identifying information.",
    "- Return only the JSON object requested. No markdown fences, no commentary.",
  ].join("\n");
}

export function isConfigured() {
  return Boolean(process.env.NVIDIA_API_KEY);
}

/**
 * Reasoning models put chain-of-thought in `reasoning_content`. Return only the
 * answer text, and strip any stray fences or <think> blocks defensively.
 */
function extractContent(response) {
  const message = response?.choices?.[0]?.message;
  let text = message?.content;
  if (typeof text !== "string" || !text.trim()) return "";
  text = text.replace(/<think>[\s\S]*?<\/think>/gi, "");
  text = text.replace(/^\s*```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "");
  return text.trim();
}

function parseJsonObject(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    // Model occasionally wraps the object in prose — recover the outermost braces.
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end <= start) return null;
    try {
      return JSON.parse(text.slice(start, end + 1));
    } catch {
      return null;
    }
  }
}

async function postOnce(apiKey, userPrompt, maxTokens, temperature, timeout, domain) {
  const { data } = await axios.post(
    NIM_ENDPOINT,
    {
      model: NEMOTRON_MODEL,
      messages: [
        { role: "system", content: systemPrompt(domain) },
        { role: "user", content: userPrompt },
      ],
      max_tokens: maxTokens,
      temperature,
      top_p: 0.9,
      // Nemotron 3 Super is a reasoning model. Left on, it spent ~3200 chars of
      // reasoning before answering and latency swung from 3s to 13s+, which is
      // what pushed slow calls past the edge proxy timeout and surfaced as
      // "Feedback is unavailable right now". These tasks are short and
      // structured, so the reasoning pass buys nothing.
      chat_template_kwargs: { thinking: false },
    },
    {
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      timeout,
    }
  );
  return extractContent(data);
}

/**
 * One retry on a transient failure (timeout, 5xx, empty body). A second failure
 * returns empty so the caller uses its bank-derived fallback rather than
 * blocking the learner.
 */
async function callNemotron(
  userPrompt,
  { maxTokens = 900, temperature = 0.3, domain = DEFAULT_DOMAIN } = {}
) {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) throw Object.assign(new Error("NVIDIA_API_KEY is not configured"), { code: "NO_KEY" });

  try {
    const first = await postOnce(
      apiKey, userPrompt, maxTokens, temperature, REQUEST_TIMEOUT_MS, domain
    );
    if (first) return first;
    console.warn("[quiz] Nemotron returned empty content; retrying once");
  } catch (error) {
    const status = error.response?.status;
    const retryable = !status || status >= 500 || error.code === "ECONNABORTED";
    if (!retryable) throw error;
    console.warn(`[quiz] Nemotron transient failure (${status || error.code}); retrying once`);
  }

  return postOnce(apiKey, userPrompt, maxTokens, temperature, RETRY_TIMEOUT_MS, domain);
}

function questionContext(question, domain = DEFAULT_DOMAIN) {
  return [
    `Topic: ${question.topic}`,
    `${domain.categoryLabel}: ${question.category ?? question.medicationClass}`,
    `Difficulty level: ${question.difficulty} of 5`,
    `Question: ${question.stem}`,
    `Correct answer: ${question.correct
      .map((id) => question.options.find((o) => o.id === id)?.text)
      .filter(Boolean)
      .join(" | ")}`,
    `Why: ${question.rationale}`,
    `Key clue: ${question.keyClue}`,
    `Concept to reinforce: ${question.remediationConcept}`,
  ].join("\n");
}

// ── Stage 1: short teaching notes ──────────────────────────────────────────

/**
 * @returns {Promise<{heading: string, notes: string[], pitfall: string, source: 'ai'|'fallback'}>}
 */
export async function generateNotes(question, learnerAnswerText, domain = DEFAULT_DOMAIN) {
  const prompt = [
    "The student just answered this question incorrectly.",
    "",
    questionContext(question, domain),
    learnerAnswerText ? `The student chose: ${learnerAnswerText}` : "",
    "",
    "Write short remediation notes that close this specific knowledge gap.",
    "Return JSON exactly of the form:",
    '{"heading": "<=8 words", "notes": ["3 to 4 bullet strings, <=30 words each"], "pitfall": "one sentence naming the trap in this question"}',
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const parsed = parseJsonObject(await callNemotron(prompt, { maxTokens: 800, domain }));
    if (parsed && Array.isArray(parsed.notes) && parsed.notes.length) {
      return {
        heading: String(parsed.heading || question.topic).slice(0, 90),
        notes: parsed.notes.slice(0, 5).map((n) => String(n).slice(0, 260)),
        pitfall: String(parsed.pitfall || question.keyClue).slice(0, 300),
        source: "ai",
      };
    }
  } catch (error) {
    console.error("[quiz] Nemotron notes failed:", error.message);
  }

  return fallbackNotes(question);
}

/** Deterministic notes built from the bank, used whenever the model is unavailable. */
export function fallbackNotes(question) {
  return {
    heading: question.topic,
    notes: [question.rationale, question.remediationConcept, question.clinicalTakeaway].filter(
      Boolean
    ),
    pitfall: question.keyClue,
    source: "fallback",
  };
}

// ── Stage 2: two open-ended probes ─────────────────────────────────────────

/**
 * @returns {Promise<{questions: string[], source: 'ai'|'fallback'}>}
 */
export async function generateProbes(question, domain = DEFAULT_DOMAIN) {
  const prompt = [
    "The student just missed this question and has read remediation notes.",
    "",
    questionContext(question, domain),
    "",
    "Write exactly two open-ended questions that make the student reason aloud about this",
    "concept. Not multiple choice. The first should test the underlying mechanism or",
    "principle; the second should apply it to a brief clinical situation.",
    "Each question must be answerable in two or three sentences.",
    "Return JSON exactly of the form:",
    '{"questions": ["first question", "second question"]}',
  ].join("\n");

  try {
    const parsed = parseJsonObject(await callNemotron(prompt, { maxTokens: 500, domain }));
    if (parsed && Array.isArray(parsed.questions) && parsed.questions.length >= 2) {
      return {
        questions: parsed.questions.slice(0, 2).map((q) => String(q).slice(0, 400)),
        source: "ai",
      };
    }
  } catch (error) {
    console.error("[quiz] Nemotron probes failed:", error.message);
  }

  return fallbackProbes(question);
}

export function fallbackProbes(question) {
  const category = String(question.category ?? question.medicationClass ?? "this area");
  return {
    questions: [
      `In your own words, explain the underlying principle behind ${question.topic.toLowerCase()} as it applies to ${category.toLowerCase()}.`,
      `Describe how you would recognise and respond to this issue in a patient on your unit, and say who you would notify.`,
    ],
    source: "fallback",
  };
}

// ── Stage 3: evaluate the free-text answers ────────────────────────────────

/**
 * @returns {Promise<{verdict: string, feedback: string[], corrected: string, understood: boolean, source: 'ai'|'fallback'}>}
 */
export async function evaluateAnswers(question, probes, answers, domain = DEFAULT_DOMAIN) {
  const pairs = probes
    .map((p, i) => `Q${i + 1}: ${p}\nStudent answer ${i + 1}: ${answers[i] || "(no answer given)"}`)
    .join("\n\n");

  const prompt = [
    "Evaluate this student's free-text answers about the concept below.",
    "",
    questionContext(question, domain),
    "",
    pairs,
    "",
    "Judge whether the student now demonstrates understanding of the concept.",
    "Be honest — do not credit a vague or incorrect answer. If an answer is empty or",
    "off-topic, understood must be false.",
    "Return JSON exactly of the form:",
    '{"understood": true or false, "verdict": "one short sentence", "feedback": ["one specific comment per answer"], "corrected": "two-sentence statement of the correct reasoning"}',
  ].join("\n");

  try {
    const parsed = parseJsonObject(
      await callNemotron(prompt, { maxTokens: 900, temperature: 0.2, domain })
    );
    if (parsed && typeof parsed.understood === "boolean") {
      return {
        understood: parsed.understood,
        verdict: String(parsed.verdict || "").slice(0, 300),
        feedback: (Array.isArray(parsed.feedback) ? parsed.feedback : [])
          .slice(0, 3)
          .map((f) => String(f).slice(0, 400)),
        corrected: String(parsed.corrected || question.remediationConcept).slice(0, 600),
        source: "ai",
      };
    }
  } catch (error) {
    console.error("[quiz] Nemotron evaluation failed:", error.message);
  }

  return fallbackEvaluation(question, answers);
}

export function fallbackEvaluation(question, answers) {
  const answered = (answers || []).filter((a) => String(a || "").trim().length >= 15).length;
  return {
    understood: answered >= 2,
    verdict:
      answered >= 2
        ? "Answers recorded. Compare your reasoning against the summary below."
        : "Your answers were brief — review the correct reasoning below before continuing.",
    feedback: [],
    corrected: `${question.remediationConcept} ${question.clinicalTakeaway}`,
    source: "fallback",
  };
}
