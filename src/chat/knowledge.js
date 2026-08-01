// Knowledge base for the site chatbot.
//
// The corpus is a handful of markdown files in ./kb, concatenated once at boot into a single
// system context. The site is small enough that retrieval would add latency and a dependency
// without adding accuracy — the whole KB is a few kilobytes and fits in the prompt.
//
// Prices are NOT written into the markdown. They are interpolated from DEFAULT_PRICING so the
// bot cannot drift from what the server actually charges. The previous chatbot quoted
// "$400/month" plans that never existed in the product; this is the fix for that class of bug.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { DEFAULT_PRICING } from "../platform/pricing.js";

const kbDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "kb");

function usd(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

const TOKENS = {
  WRITING_PAGE: usd(DEFAULT_PRICING.writingPageCents),
  URGENT_PAGE: usd(DEFAULT_PRICING.urgentWritingPageCents),
  EXAM_HOUR: usd(DEFAULT_PRICING.examHourCents),
  PAGE_WORDS: String(DEFAULT_PRICING.writingPageWords),
};

/** `pages:` lines declare which public pages a KB file speaks for. The coverage test reads these. */
function parsePages(markdown) {
  const match = markdown.match(/^pages:\s*(.+)$/m);
  if (!match) return [];
  return match[1]
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function interpolate(markdown) {
  return markdown.replace(/\{\{(\w+)\}\}/g, (whole, key) => {
    if (!(key in TOKENS)) throw new Error(`Unknown knowledge-base token ${whole}`);
    return TOKENS[key];
  });
}

function loadDocuments() {
  return fs
    .readdirSync(kbDir)
    .filter((name) => name.endsWith(".md"))
    .sort()
    .map((name) => {
      const raw = fs.readFileSync(path.join(kbDir, name), "utf8");
      return { name, pages: parsePages(raw), body: interpolate(raw).trim() };
    });
}

const documents = loadDocuments();

/** Every public page any KB document claims to cover. */
export const COVERED_PAGES = Object.freeze(
  Array.from(new Set(documents.flatMap((doc) => doc.pages))).sort()
);

export const KNOWLEDGE_BASE = documents.map((doc) => doc.body).join("\n\n---\n\n");

export const KB_DOCUMENTS = Object.freeze(documents.map((doc) => Object.freeze({ ...doc })));

export const PRICE_TOKENS = Object.freeze({ ...TOKENS });
