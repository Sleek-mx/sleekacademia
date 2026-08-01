// Site chatbot API.
//
//   POST /api/chat          -> { reply, ready, source }
//   GET  /api/chat/health   -> { ok, configured, model, kbBytes }
//
// The intake email route stays at POST /api/chat/send-summary in server.js — it predates this
// router and returning browsers still call it.

import axios from "axios";
import express from "express";
import { KNOWLEDGE_BASE } from "./knowledge.js";
import {
  buildSystemPrompt,
  isOutOfScope,
  OUT_OF_SCOPE_REPLY,
  READY_MARKER,
  UNAVAILABLE_REPLY,
} from "./prompt.js";

const NIM_ENDPOINT = "https://integrate.api.nvidia.com/v1/chat/completions";
export const CHAT_MODEL = "nvidia/nemotron-3-super-120b-a12b";

// Well under the edge proxy ceiling. A visitor waiting on a chat bubble has far less patience
// than a learner mid-quiz, so this is tighter than the quiz tutor's 25s.
const REQUEST_TIMEOUT_MS = 18_000;
const RETRY_TIMEOUT_MS = 10_000;

const MAX_TURNS = 12;
const MAX_MESSAGE_CHARS = 1200;

// Built once — the KB is static and the string is a few kilobytes.
const SYSTEM_PROMPT = buildSystemPrompt();

/**
 * Nemotron 3 Super is a reasoning model that returns `reasoning_content` beside `content`.
 * Only `content` may ever be shown.
 */
function extractContent(response) {
  const text = response?.choices?.[0]?.message?.content;
  if (typeof text !== "string") return "";
  return text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
}

export function sanitiseMessages(input) {
  if (!Array.isArray(input)) return [];
  return input
    .filter((m) => m && (m.role === "user" || m.role === "assistant"))
    .map((m) => ({
      role: m.role,
      content: String(m.content ?? "").slice(0, MAX_MESSAGE_CHARS),
    }))
    .filter((m) => m.content.trim().length > 0)
    .slice(-MAX_TURNS);
}

async function postOnce(apiKey, messages, timeout) {
  const { data } = await axios.post(
    NIM_ENDPOINT,
    {
      model: CHAT_MODEL,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 400,
      temperature: 0.4,
      top_p: 0.9,
      // Reasoning buys nothing on short scripted intake turns and costs seconds of latency —
      // the same finding as the quiz tutor. Leaving it on strands visitors on the typing dots.
      chat_template_kwargs: { thinking: false },
    },
    {
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      timeout,
    }
  );
  return extractContent(data);
}

async function callModel(messages) {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) return "";

  try {
    const first = await postOnce(apiKey, messages, REQUEST_TIMEOUT_MS);
    if (first) return first;
    console.warn("[chat] empty completion; retrying once");
  } catch (error) {
    const status = error.response?.status;
    const retryable = !status || status >= 500 || error.code === "ECONNABORTED";
    if (!retryable) {
      console.error(`[chat] upstream ${status}: ${error.message}`);
      return "";
    }
    console.warn(`[chat] transient failure (${status || error.code}); retrying once`);
  }

  try {
    return await postOnce(apiKey, messages, RETRY_TIMEOUT_MS);
  } catch (error) {
    console.error("[chat] retry failed:", error.message);
    return "";
  }
}

export function createChatRouter() {
  const router = express.Router();

  router.get("/health", (_req, res) => {
    res.json({
      ok: true,
      configured: Boolean(process.env.NVIDIA_API_KEY),
      model: CHAT_MODEL,
      kbBytes: Buffer.byteLength(KNOWLEDGE_BASE, "utf8"),
    });
  });

  router.post("/", async (req, res) => {
    const messages = sanitiseMessages(req.body?.messages);
    if (!messages.length) {
      return res.status(400).json({ error: "A message is required." });
    }

    const latest = messages[messages.length - 1];
    if (latest.role === "user" && isOutOfScope(latest.content)) {
      return res.json({ reply: OUT_OF_SCOPE_REPLY, ready: false, source: "guard" });
    }

    const raw = await callModel(messages);
    if (!raw) {
      return res.json({ reply: UNAVAILABLE_REPLY, ready: false, source: "fallback" });
    }

    const ready = raw.includes(READY_MARKER);
    const reply = raw.split(READY_MARKER).join("").trim();
    return res.json({ reply, ready, source: "ai" });
  });

  return router;
}
