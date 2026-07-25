/**
 * Sleek Academia quick-quote module.
 *
 * Renders a live-estimate quote form into any container with
 * id="quick-quote-root" (writing) or id="quick-quote-course-root" (course).
 *
 * Rates mirror src/platform/pricing.js: standard writing is $15.00 per
 * 275-word page; six-hour urgent writing is $16.50 per page. A deadline
 * within 24 hours is quoted at the urgent rate.
 *
 * On submit the lead is POSTed to /api/lead when that endpoint is
 * available, persisted locally either way, and handed to the onboard
 * wizard at /onboard.html with the details encoded in the URL so the
 * wizard can pre-fill. The safe fallback is a plain /onboard.html
 * redirect.
 */

const PAGE_WORDS = 275;
const STANDARD_PAGE_CENTS = 1500;
const URGENT_PAGE_CENTS = 1650;
const URGENT_WINDOW_MS = 24 * 60 * 60 * 1000;
const STORAGE_KEY = "sleekAcademia.quickQuote.v1";
const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

const WRITING_SUBJECTS = ["Nursing", "Law", "Accounting", "IT", "Other"];
const PAPER_TYPES = [
  "Essay",
  "Research paper",
  "Report",
  "Case study",
  "Discussion post",
  "Literature review",
  "Presentation",
  "Other",
];
const COURSE_PLATFORMS = ["Canvas", "Blackboard", "Moodle", "Brightspace", "D2L", "Other"];

function dollars(cents) {
  return (cents / 100).toFixed(2);
}

function optionTags(values, placeholder) {
  const first = placeholder ? `<option value="">${placeholder}</option>` : "";
  return first + values.map(function (value) {
    return `<option value="${value}">${value}</option>`;
  }).join("");
}

function injectStyles() {
  if (document.getElementById("quick-quote-styles")) return;
  const style = document.createElement("style");
  style.id = "quick-quote-styles";
  style.textContent = `
    .quick-quote { max-width: 880px; margin-inline: auto; }
    .quick-quote__panel { display: grid; gap: 20px; padding: 26px; border: 1px solid var(--ws-line, rgba(70,53,103,.14)); border-radius: 20px; background: var(--ws-panel, #fff); box-shadow: var(--ws-shadow, 0 20px 65px rgba(39,25,72,.1)); }
    .quick-quote__estimate { display: grid; gap: 6px; padding: 18px 20px; border-radius: 16px; background: var(--ws-wash, #f2eefb); border: 1px solid rgba(111,63,245,.18); }
    .quick-quote__estimate strong { font-family: "Plus Jakarta Sans", system-ui, sans-serif; font-size: 1.05rem; color: var(--ws-violet-dark, #4d28be); }
    .quick-quote__estimate span { color: var(--ws-muted, #666b7b); font-size: .78rem; line-height: 1.5; }
    .quick-quote__actions { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; }
    .quick-quote__note { color: var(--ws-muted, #666b7b); font-size: .74rem; line-height: 1.5; margin: 0; }
    @media (max-width: 640px) { .quick-quote__panel { padding: 18px; } .quick-quote .form-grid { grid-template-columns: 1fr; } }
  `;
  document.head.appendChild(style);
}

function setError(form, field, message) {
  const target = form.querySelector(`[data-error-for="${field}"]`);
  if (target) target.textContent = message;
}

function validEmail(value) {
  return EMAIL_PATTERN.test(String(value || "").trim());
}

function isUrgentDeadline(value) {
  if (!value) return false;
  const deadline = new Date(value);
  if (Number.isNaN(deadline.getTime())) return false;
  return deadline.getTime() - Date.now() <= URGENT_WINDOW_MS;
}

function writingUnits(form) {
  const unit = form.elements.quoteUnit.value;
  if (unit === "words") {
    const words = Number(form.elements.wordCount.value);
    if (!Number.isSafeInteger(words) || words < 1) return null;
    return Math.max(1, Math.ceil(words / PAGE_WORDS));
  }
  const pages = Number(form.elements.pageCount.value);
  if (!Number.isSafeInteger(pages) || pages < 1) return null;
  return pages;
}

function updateWritingEstimate(form) {
  const estimate = form.querySelector("[data-estimate]");
  if (!estimate) return;
  const pages = writingUnits(form);
  if (!pages) {
    estimate.innerHTML = "<strong>Estimated from $15.00</strong><span>Add your page or word count to see a live estimate. Each page is 275 words.</span>";
    return;
  }
  const urgent = isUrgentDeadline(form.elements.deadline.value);
  const rateCents = urgent ? URGENT_PAGE_CENTS : STANDARD_PAGE_CENTS;
  const total = pages * rateCents;
  const note = urgent
    ? `${pages} ${pages === 1 ? "page" : "pages"} at the urgent rate of $${dollars(rateCents)} per page. Your deadline is within 24 hours.`
    : `${pages} ${pages === 1 ? "page" : "pages"} at the standard rate of $${dollars(rateCents)} per page. Deadlines within 24 hours are quoted at $${dollars(URGENT_PAGE_CENTS)} per page.`;
  estimate.innerHTML = `<strong>Estimated from $${dollars(total)}</strong><span>${note} The confirmed quote is calculated in your workspace.</span>`;
}

async function submitLead(data, goal) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, savedAt: new Date().toISOString() }));
  } catch (error) {
    // Local persistence is best-effort; the redirect still carries the details.
  }
  try {
    await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (error) {
    // Safe fallback: no backend yet — the wizard redirect below carries the lead.
  }
  try {
    const params = new URLSearchParams({ goal, source: "quick-quote" });
    Object.keys(data).forEach(function (key) {
      if (data[key] !== undefined && data[key] !== null && String(data[key]).trim() !== "") {
        params.set(key, String(data[key]).trim());
      }
    });
    window.location.assign(`/onboard.html?${params.toString()}`);
  } catch (error) {
    window.location.assign("/onboard.html");
  }
}

function writingFormMarkup() {
  return `
    <form class="quick-quote__panel" novalidate>
      <div class="form-grid">
        <div class="form-field">
          <label for="qq-subject">Subject</label>
          <select id="qq-subject" name="subject" required>${optionTags(WRITING_SUBJECTS, "Choose a subject")}</select>
          <span class="field-error" data-error-for="subject"></span>
        </div>
        <div class="form-field">
          <label for="qq-paper-type">Paper type</label>
          <select id="qq-paper-type" name="paperType" required>${optionTags(PAPER_TYPES, "Choose a paper type")}</select>
          <span class="field-error" data-error-for="paperType"></span>
        </div>
        <div class="form-field">
          <label for="qq-unit">Estimate by</label>
          <select id="qq-unit" name="quoteUnit"><option value="pages">Pages</option><option value="words">Word count</option></select>
          <span class="form-hint">Each page is 275 words.</span>
        </div>
        <div class="form-field" data-quote-unit="pages">
          <label for="qq-pages">Pages</label>
          <input id="qq-pages" name="pageCount" type="number" min="1" step="1" inputmode="numeric" placeholder="6" />
          <span class="form-hint">Standard writing is $15 per page.</span>
          <span class="field-error" data-error-for="units"></span>
        </div>
        <div class="form-field" data-quote-unit="words" hidden>
          <label for="qq-words">Words</label>
          <input id="qq-words" name="wordCount" type="number" min="1" step="1" inputmode="numeric" placeholder="1650" />
          <span class="form-hint">We round up to the next 275-word page.</span>
          <span class="field-error" data-error-for="units"></span>
        </div>
        <div class="form-field">
          <label for="qq-deadline">Deadline</label>
          <input id="qq-deadline" name="deadline" type="datetime-local" required />
          <span class="field-error" data-error-for="deadline"></span>
        </div>
        <div class="form-field">
          <label for="qq-email">Email</label>
          <input id="qq-email" name="email" type="email" maxlength="320" autocomplete="email" placeholder="you@school.edu" required />
          <span class="field-error" data-error-for="email"></span>
        </div>
      </div>
      <div class="quick-quote__estimate" data-estimate aria-live="polite">
        <strong>Estimated from $15.00</strong>
        <span>Add your page or word count to see a live estimate. Each page is 275 words.</span>
      </div>
      <div class="quick-quote__actions">
        <button class="ws-button primary" type="submit">Get my estimate</button>
        <p class="quick-quote__note">Free and no-obligation. Your details carry into the order wizard, and the confirmed quote appears in your private workspace.</p>
      </div>
    </form>`;
}

function courseFormMarkup() {
  return `
    <form class="quick-quote__panel" novalidate>
      <div class="form-grid">
        <div class="form-field">
          <label for="qqc-course">Course name</label>
          <input id="qqc-course" name="courseName" maxlength="180" autocomplete="off" placeholder="NURS 5334 Advanced Pathophysiology" required />
          <span class="field-error" data-error-for="courseName"></span>
        </div>
        <div class="form-field">
          <label for="qqc-platform">Platform</label>
          <select id="qqc-platform" name="platform" required>${optionTags(COURSE_PLATFORMS, "Choose your platform")}</select>
          <span class="field-error" data-error-for="platform"></span>
        </div>
        <div class="form-field">
          <label for="qqc-weeks">Weeks remaining</label>
          <input id="qqc-weeks" name="weeksRemaining" type="number" min="1" max="52" step="1" inputmode="numeric" placeholder="8" required />
          <span class="field-error" data-error-for="weeksRemaining"></span>
        </div>
        <div class="form-field">
          <label for="qqc-email">Email</label>
          <input id="qqc-email" name="email" type="email" maxlength="320" autocomplete="email" placeholder="you@school.edu" required />
          <span class="field-error" data-error-for="email"></span>
        </div>
      </div>
      <div class="quick-quote__estimate" aria-live="polite">
        <strong>Custom weekly pricing</strong>
        <span>Course support is quoted weekly, based on your deliverables, subject level, and weeks remaining. The confirmed quote appears in your workspace before anything is final.</span>
      </div>
      <div class="quick-quote__actions">
        <button class="ws-button primary" type="submit">Get my course quote</button>
        <p class="quick-quote__note">Free and no-obligation. Your details carry into the order wizard, so nothing needs to be repeated.</p>
      </div>
    </form>`;
}

function renderWritingForm(root) {
  root.innerHTML = `<div class="quick-quote">${writingFormMarkup()}</div>`;
  const form = root.querySelector("form");
  const unitSelect = form.elements.quoteUnit;
  const deadline = form.elements.deadline;

  deadline.min = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);

  unitSelect.addEventListener("change", function () {
    form.querySelectorAll("[data-quote-unit]").forEach(function (field) {
      field.hidden = field.dataset.quoteUnit !== unitSelect.value;
    });
    updateWritingEstimate(form);
  });
  form.addEventListener("input", function () { updateWritingEstimate(form); });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    setError(form, "subject", "");
    setError(form, "paperType", "");
    setError(form, "deadline", "");
    setError(form, "email", "");
    let valid = true;
    if (!form.elements.subject.value) { setError(form, "subject", "Choose a subject."); valid = false; }
    if (!form.elements.paperType.value) { setError(form, "paperType", "Choose a paper type."); valid = false; }
    if (!form.elements.deadline.value) { setError(form, "deadline", "Add your deadline."); valid = false; }
    if (!validEmail(form.elements.email.value)) { setError(form, "email", "Enter a valid email address."); valid = false; }
    form.querySelectorAll('[data-error-for="units"]').forEach(function (target) { target.textContent = ""; });
    if (!writingUnits(form)) {
      form.querySelectorAll('[data-error-for="units"]').forEach(function (target) {
        if (!target.closest("[hidden]")) target.textContent = "Add a positive whole page or word count.";
      });
      valid = false;
    }
    if (!valid || !form.checkValidity()) return;

    const pages = writingUnits(form);
    const data = {
      type: "writing",
      subject: form.elements.subject.value,
      paperType: form.elements.paperType.value,
      quoteUnit: form.elements.quoteUnit.value,
      pageCount: pages ? String(pages) : "",
      wordCount: form.elements.quoteUnit.value === "words" ? form.elements.wordCount.value.trim() : "",
      deadline: form.elements.deadline.value,
      urgency: isUrgentDeadline(form.elements.deadline.value) ? "six-hour" : "standard",
      email: form.elements.email.value.trim(),
    };
    void submitLead(data, "essay");
  });

  updateWritingEstimate(form);
}

function renderCourseForm(root) {
  root.innerHTML = `<div class="quick-quote">${courseFormMarkup()}</div>`;
  const form = root.querySelector("form");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    setError(form, "courseName", "");
    setError(form, "platform", "");
    setError(form, "weeksRemaining", "");
    setError(form, "email", "");
    let valid = true;
    if (!form.elements.courseName.value.trim()) { setError(form, "courseName", "Add the course name."); valid = false; }
    if (!form.elements.platform.value) { setError(form, "platform", "Choose your platform."); valid = false; }
    const weeks = Number(form.elements.weeksRemaining.value);
    if (!Number.isSafeInteger(weeks) || weeks < 1) { setError(form, "weeksRemaining", "Add the weeks remaining in your course."); valid = false; }
    if (!validEmail(form.elements.email.value)) { setError(form, "email", "Enter a valid email address."); valid = false; }
    if (!valid || !form.checkValidity()) return;

    const data = {
      type: "course",
      courseName: form.elements.courseName.value.trim(),
      platform: form.elements.platform.value,
      weeksRemaining: String(weeks),
      email: form.elements.email.value.trim(),
    };
    void submitLead(data, "other");
  });
}

export function initQuickQuote() {
  injectStyles();
  const writingRoot = document.getElementById("quick-quote-root");
  if (writingRoot) renderWritingForm(writingRoot);
  const courseRoot = document.getElementById("quick-quote-course-root");
  if (courseRoot) renderCourseForm(courseRoot);
}

export { renderWritingForm, renderCourseForm };

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initQuickQuote);
} else {
  initQuickQuote();
}
