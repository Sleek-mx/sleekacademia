#!/usr/bin/env node
// Adds (or refreshes) the chat widget include on every public page except the paid quizzes.
//
//   node scripts/inject-chat-widget.mjs          # write
//   node scripts/inject-chat-widget.mjs --check  # exit 1 if any page is missing or stale
//
// Kept as a script rather than a hand edit because the version query string has to be bumped on
// every widget change across ~18 files, and a missed file silently serves a stale widget for
// four hours (static assets are max-age=14400).

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");

export const WIDGET_VERSION = "2026081601";
export const EXCLUDED_PAGES = Object.freeze([
  "antimicrobial-quiz.html",
  "renal-cardiac-quiz.html",
  "pharmacology-quiz.html",
]);

const CSS_TAG = `<link rel="stylesheet" href="/css/chat-widget.css?v=${WIDGET_VERSION}" />`;
const JS_TAG = `<script src="/js/chat-widget.js?v=${WIDGET_VERSION}" defer></script>`;
const BLOCK_PATTERN =
  /[ \t]*<!-- Sleek Academia chat widget -->[\s\S]*?<script src="\/js\/chat-widget\.js[^>]*><\/script>\n?/;

/** Every page under public/, blog posts included, as a path relative to public/. */
export function targetPages() {
  const found = [];

  const walk = (dir, prefix) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) walk(path.join(dir, entry.name), relative);
      else if (entry.name.endsWith(".html") && !EXCLUDED_PAGES.includes(relative)) {
        found.push(relative);
      }
    }
  };

  walk(publicDir, "");
  return found.sort();
}

function apply(html) {
  const stripped = html.replace(BLOCK_PATTERN, "");
  const closing = stripped.lastIndexOf("</body>");
  if (closing === -1) return null;

  // Reuse whatever indentation </body> already had, otherwise the first run and every run after
  // it disagree by a few spaces and --check reports the file as permanently stale.
  const head = stripped.slice(0, closing);
  const indent = (head.match(/[ \t]*$/) || [""])[0];
  const before = head.slice(0, head.length - indent.length);
  const block =
    `${indent}<!-- Sleek Academia chat widget -->\n` +
    `${indent}${CSS_TAG}\n` +
    `${indent}${JS_TAG}\n`;

  return before + block + indent + stripped.slice(closing);
}

const check = process.argv.includes("--check");
const stale = [];

for (const name of targetPages()) {
  const file = path.join(publicDir, name);
  const html = fs.readFileSync(file, "utf8");
  const next = apply(html);

  if (next === null) {
    console.error(`! ${name} has no </body> — skipped`);
    stale.push(name);
    continue;
  }

  if (next === html) continue;

  if (check) {
    stale.push(name);
  } else {
    fs.writeFileSync(file, next);
    console.log(`updated ${name}`);
  }
}

if (check && stale.length) {
  console.error(`Stale chat widget include in: ${stale.join(", ")}`);
  process.exit(1);
}

if (check) console.log("chat widget include is current on every target page");
