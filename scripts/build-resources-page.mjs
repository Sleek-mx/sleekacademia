import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { STORE_PRODUCTS, formatPrice, productUrl } from "../src/data/store-products.js";
import { QUIZZES } from "../src/quiz/quizzes.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pagePath = path.join(root, "public", "resources.html");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
function quizTone(quiz) {
  return quiz.id === "renal-cardiac" ? "pathophysiology" : "pharmacology";
}

function productCategory(product) {
  return /pathophysiology|exam\s*[25]/i.test(`${product.cardTitle} ${product.schemaName}`)
    ? "pathophysiology"
    : "pharmacology";
}

export function renderFreeTools() {
  return Object.values(QUIZZES)
    .map((quiz, index) => {
      const free = quiz.bank.FREE_QUESTION_COUNT;
      const paid = quiz.bank.QUESTIONS.length - free;
      return `              <article class="gc-quiz-sheet gc-quiz-sheet--${index + 1}" data-tone="${quizTone(quiz)}">
                <div class="gc-quiz-sheet__top"><span>Free adaptive quiz</span><strong>${free} questions free</strong></div>
                <p class="gc-quiz-sheet__course">${escapeHtml(quiz.meta.course)}</p>
                <h3>${escapeHtml(quiz.shortTitle)}</h3>
                <p>Answer explanations and performance feedback now. ${paid} more after unlock.</p>
                <div class="gc-quiz-sheet__foot"><span>${quiz.bank.QUESTIONS.length} total · $${Number(quiz.order.price)} full access</span><a href="${quiz.pagePath}.html">Start free quiz <span aria-hidden="true">→</span></a></div>
              </article>`;
    })
    .join("\n");
}

export function renderPaidTools() {
  return STORE_PRODUCTS.map((product) => `              <article class="gc-pack-card" data-tool-card data-category="${productCategory(product)}">
                <a class="gc-pack-card__cover" href="${productUrl(product)}?wanted=true" target="_blank" rel="noopener" aria-label="View ${escapeHtml(product.cardTitle)} on Gumroad">
                  <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.cardTitle)} cover" loading="lazy" />
                  <span>${escapeHtml(product.icon)}</span>
                </a>
                <div class="gc-pack-card__body">
                  <p class="gc-pack-card__meta"><span>${productCategory(product)}</span><strong>${formatPrice(product)} one-time</strong></p>
                  <h3>${escapeHtml(product.cardTitle)}</h3>
                  <p>${escapeHtml(product.description)}</p>
                  <a class="gc-pack-card__link" href="${productUrl(product)}?wanted=true" target="_blank" rel="noopener">View on Gumroad <span aria-hidden="true">↗</span></a>
                </div>
              </article>`).join("\n");
}

function replaceMarked(html, name, content) {
  const start = `<!-- study-tools:${name}:start -->`;
  const end = `<!-- study-tools:${name}:end -->`;
  const pattern = new RegExp(`${start}[\\s\\S]*?${end}`);
  if (!pattern.test(html)) throw new Error(`Missing ${name} build markers in public/resources.html`);
  return html.replace(pattern, `${start}\n${content}\n              ${end}`);
}

export function render(html) {
  return replaceMarked(replaceMarked(html, "free", renderFreeTools()), "paid", renderPaidTools());
}

const current = fs.readFileSync(pagePath, "utf8");
const next = render(current);

if (process.argv.includes("--check")) {
  if (next !== current) {
    console.error("resources.html is stale — run: npm run build:resources");
    process.exitCode = 1;
  }
} else if (next !== current) {
  fs.writeFileSync(pagePath, next);
  console.log("Updated public/resources.html from quiz and store product data");
} else {
  console.log("resources.html already matches quiz and store product data");
}
