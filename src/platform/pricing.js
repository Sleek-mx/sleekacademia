export const DEFAULT_PRICING = Object.freeze({
  writingPageWords: 275,
  writingPageCents: 1500,
  urgentWritingPageCents: 1650,
  examHourCents: 15000,
  revisionDays: 7,
  includedRevisions: 1,
});

const WRITING_SERVICES = new Set(["essay", "writing", "coursework", "report", "presentation"]);
const CUSTOM_SERVICES = new Set(["tutoring", "other"]);

function clean(value) {
  return typeof value === "string" ? value.trim() : value;
}

function positiveWhole(value, label) {
  const normalized = clean(value);
  const number = typeof normalized === "string" && /^\d+$/.test(normalized)
    ? Number(normalized)
    : normalized;
  if (!Number.isSafeInteger(number) || number <= 0) {
    throw new RangeError(`${label} must be a positive whole number.`);
  }
  return number;
}

function wholeHours(value) {
  const normalized = clean(value);
  const number = typeof normalized === "string" && /^\d+$/.test(normalized)
    ? Number(normalized)
    : normalized;
  if (!Number.isSafeInteger(number) || number < 1) {
    throw new RangeError("Exam assistance must be booked in at least one whole hour.");
  }
  return number;
}

function safeTotal(units, unitRateCents) {
  const totalCents = units * unitRateCents;
  if (!Number.isSafeInteger(totalCents)) {
    throw new RangeError("The calculated total must remain a safe integer number of cents.");
  }
  return totalCents;
}

export function splitMilestones(totalCents) {
  if (!Number.isSafeInteger(totalCents) || totalCents <= 0) {
    throw new RangeError("The order total must be a positive safe integer number of cents.");
  }
  const depositCents = Math.ceil(totalCents / 2);
  return Object.freeze({
    depositCents,
    balanceCents: totalCents - depositCents,
  });
}

function snapshot(fields) {
  const milestones = splitMilestones(fields.totalCents);
  return Object.freeze({
    ...fields,
    ...milestones,
    currency: "usd",
  });
}

export function calculateWritingQuote(input = {}, settings = DEFAULT_PRICING) {
  const hasWords = input.words !== undefined && input.words !== null && String(input.words).trim() !== "";
  const requestedWords = hasWords ? positiveWhole(input.words, "Words") : null;
  const requestedPages = hasWords ? null : positiveWhole(input.pages, "Pages");
  const units = hasWords
    ? Math.max(1, Math.ceil(requestedWords / settings.writingPageWords))
    : requestedPages;
  const urgency = clean(input.urgency || "standard");
  if (!new Set(["standard", "six-hour"]).has(urgency)) {
    throw new RangeError("Choose a valid writing urgency.");
  }
  const unitRateCents = urgency === "six-hour"
    ? settings.urgentWritingPageCents
    : settings.writingPageCents;
  const totalCents = safeTotal(units, unitRateCents);

  return snapshot({
    pricingType: "writing",
    unitName: "page",
    units,
    unitRateCents,
    requestedPages,
    requestedWords,
    equivalentWords: units * settings.writingPageWords,
    pageWords: settings.writingPageWords,
    urgency,
    totalCents,
  });
}

export function calculateExamQuote(input = {}, settings = DEFAULT_PRICING) {
  const units = wholeHours(input.hours);
  const unitRateCents = settings.examHourCents;
  const totalCents = safeTotal(units, unitRateCents);

  return snapshot({
    pricingType: "exam",
    unitName: "hour",
    units,
    unitRateCents,
    requestedHours: units,
    equivalentWords: null,
    urgency: "scheduled",
    totalCents,
  });
}

export function calculateCustomQuote(input = {}) {
  const totalCents = Number(input.totalCents);
  if (!Number.isSafeInteger(totalCents) || totalCents < 100) {
    throw new RangeError("A custom quote must be at least 100 cents.");
  }
  const reason = String(input.reason || "").trim();
  if (!reason) throw new RangeError("A custom quote reason is required.");
  if (reason.length > 500) throw new RangeError("A custom quote reason must be 500 characters or fewer.");

  return snapshot({
    pricingType: "custom",
    unitName: "custom order",
    units: 1,
    unitRateCents: totalCents,
    equivalentWords: null,
    urgency: "custom",
    reason,
    totalCents,
  });
}

export function calculateOrderQuote(input = {}, settings = DEFAULT_PRICING) {
  const service = String(input.service || "").trim().toLowerCase();
  if (WRITING_SERVICES.has(service)) {
    return calculateWritingQuote({
      pages: input.pages ?? input.pageCount,
      words: input.words ?? input.wordCount,
      urgency: input.urgency,
    }, settings);
  }
  if (service === "exam") {
    return calculateExamQuote({ hours: input.hours ?? input.examHours }, settings);
  }
  if (CUSTOM_SERVICES.has(service)) {
    if (input.customQuoteCents === undefined || input.customQuoteCents === null) {
      throw new RangeError("This service requires a custom quote.");
    }
    return calculateCustomQuote({
      totalCents: input.customQuoteCents,
      reason: input.customQuoteReason,
    });
  }
  throw new RangeError("Choose a valid service for pricing.");
}
