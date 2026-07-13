export const REQUEST_STATUSES = Object.freeze([
  "Draft",
  "Submitted",
  "Reviewing",
  "Quoted",
  "Deposit Due",
  "In Progress",
  "Ready for Review",
  "Balance Due",
  "Completed",
  "Cancelled",
]);

const ALLOWED_SERVICES = new Set(["essay", "exam", "tutoring", "other"]);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TRANSITIONS = new Map([
  ["Draft", new Set(["Submitted", "Cancelled"])],
  ["Submitted", new Set(["Reviewing", "Cancelled"])],
  ["Reviewing", new Set(["Quoted", "Cancelled"])],
  ["Quoted", new Set(["Deposit Due", "Cancelled"])],
  ["Deposit Due", new Set(["In Progress", "Cancelled"])],
  ["In Progress", new Set(["Ready for Review", "Cancelled"])],
  ["Ready for Review", new Set(["Balance Due", "Cancelled"])],
  ["Balance Due", new Set(["Completed", "Cancelled"])],
  ["Completed", new Set()],
  ["Cancelled", new Set()],
]);

const REQUEST_FIELDS = Object.freeze({
  service: 40,
  subject: 180,
  title: 240,
  description: 5000,
  deadline: 40,
  citationStyle: 80,
  pageCount: 20,
  wordCount: 20,
  examName: 160,
  examDate: 40,
  examHours: 20,
  urgency: 40,
  attemptStatus: 80,
  assistanceType: 160,
  name: 160,
  email: 320,
  urgentPhone: 80,
  school: 180,
});

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

function positiveCents(value) {
  const cents = Number(value);
  return Number.isSafeInteger(cents) && cents > 0 ? cents : 0;
}

export function validateRequestInput(input = {}) {
  const value = {};
  const errors = {};

  for (const [field, maxLength] of Object.entries(REQUEST_FIELDS)) {
    const normalized = clean(input[field]);
    if (normalized.length > maxLength) {
      errors[field] = `${field} must be ${maxLength.toLocaleString("en-US")} characters or fewer.`;
    }
    value[field] = normalized.slice(0, maxLength);
  }

  value.service = value.service.toLowerCase();
  value.email = value.email.toLowerCase();

  if (!ALLOWED_SERVICES.has(value.service)) {
    errors.service = "Choose a valid support type.";
  }
  if (!value.subject) errors.subject = "Subject is required.";
  if (!value.description) errors.description = "Description is required.";
  if (!value.name) errors.name = "Name is required.";
  if (!EMAIL_PATTERN.test(value.email)) errors.email = "Enter a valid email address.";

  return Object.keys(errors).length
    ? { ok: false, errors }
    : { ok: true, value };
}

export function amountDueForMilestone(request, milestone) {
  const quoteCents = positiveCents(request?.quoteCents);
  const paidCents = Math.max(0, Number.isSafeInteger(request?.paidCents) ? request.paidCents : 0);
  if (!quoteCents) return 0;

  if (milestone === "deposit") {
    return Math.max(0, Math.ceil(quoteCents / 2) - paidCents);
  }
  if (milestone === "balance") {
    return Math.max(0, quoteCents - paidCents);
  }
  return 0;
}

export function nextPaymentMilestone(request) {
  const quoteCents = positiveCents(request?.quoteCents);
  const paidCents = Math.max(0, Number.isSafeInteger(request?.paidCents) ? request.paidCents : 0);
  if (!quoteCents || paidCents >= quoteCents) return null;
  return paidCents < Math.ceil(quoteCents / 2) ? "deposit" : "balance";
}

export function canTransitionRequest(request, nextStatus) {
  const currentStatus = clean(request?.status);
  const allowed = TRANSITIONS.get(currentStatus);
  if (!allowed || !allowed.has(nextStatus)) {
    return { ok: false, error: `A request cannot move from ${currentStatus || "an unknown status"} to ${nextStatus}.` };
  }

  const quoteCents = positiveCents(request?.quoteCents);
  const paidCents = Math.max(0, Number.isSafeInteger(request?.paidCents) ? request.paidCents : 0);

  if (nextStatus === "Deposit Due" && !quoteCents) {
    return { ok: false, error: "Set a valid quote before requesting a deposit." };
  }
  if (nextStatus === "In Progress" && paidCents < Math.ceil(quoteCents / 2)) {
    return { ok: false, error: "A confirmed 50 percent deposit is required before work begins." };
  }
  if (nextStatus === "Completed" && (!quoteCents || paidCents < quoteCents)) {
    return { ok: false, error: "Confirmed full payment is required before completion." };
  }

  return { ok: true };
}

export function canDownloadAttachment(request, attachment) {
  if (!attachment?.deliveryLocked) return true;
  if (!new Set(["final", "ai-report"]).has(attachment?.category)) return true;
  const quoteCents = positiveCents(request?.quoteCents);
  const paidCents = Math.max(0, Number.isSafeInteger(request?.paidCents) ? request.paidCents : 0);
  return Boolean(quoteCents && paidCents >= quoteCents);
}
