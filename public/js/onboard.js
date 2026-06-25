const onboardExams = [
  { name: "NCLEX-RN", category: "nursing" },
  { name: "HESI A2", category: "nursing" },
  { name: "TEAS", category: "nursing" },
  { name: "CFA Level I", category: "finance" },
  { name: "CFA Level II", category: "finance" },
  { name: "CFA Level III", category: "finance" },
  { name: "CPA", category: "finance" },
  { name: "ACCA", category: "finance" },
  { name: "CIFA", category: "finance" },
  { name: "LSAT", category: "law" },
  { name: "UBE", category: "law" },
  { name: "LPC", category: "law" },
  { name: "ATP", category: "law" },
  { name: "CompTIA A+", category: "ict" },
  { name: "CompTIA Security+", category: "ict" },
  { name: "AWS Architect", category: "ict" },
  { name: "CCNA", category: "ict" },
  { name: "CEH", category: "ict" },
];

async function initOnboarding() {
  const params = new URLSearchParams(window.location.search);
  const hasPreselectedExam = params.has("exam");
  const selectedExam = params.get("exam") || "NCLEX-RN";
  const selectedCategory = params.get("category") || findCategory(selectedExam);
  const state = {
    exam: selectedExam,
    category: selectedCategory,
    attemptStatus: "",
    examOption: "",
    assistanceType: "",
  };

  const steps = [...document.querySelectorAll("[data-onboard-step]")];
  const progressBar = document.getElementById("progress-bar");
  const nextButton = document.getElementById("next-step");
  const backButton = document.getElementById("prev-step");
  const examOptionSelect = document.getElementById("exam-option-select");
  const assistanceTypeSelect = document.getElementById("assistance-type-select");
  const examChoiceGrid = document.getElementById("exam-choice-grid");
  if (hasPreselectedExam && steps[0]) {
    steps[0].remove();
    steps.shift();
  }

  let authMounted = false;
  let currentStep = 0;

  renderExamChoices(examChoiceGrid, state);
  syncSummary(state);

  async function updateStep() {
    steps.forEach((step, index) => {
      step.classList.toggle("hidden", index !== currentStep);
    });

    const progress = ((currentStep + 1) / steps.length) * 100;
    progressBar.style.width = `${progress}%`;
    backButton.classList.toggle("invisible", currentStep === 0);
    nextButton.classList.toggle("hidden", currentStep === steps.length - 1);
    setText("step-indicator", `Step ${currentStep + 1} of ${steps.length}`);
    syncSummary(state);

    if (currentStep === steps.length - 1 && !authMounted) {
      authMounted = true;
      await mountClerkSignUp(state);
    }
  }

  document.querySelectorAll("[data-attempt]").forEach((button) => {
    button.addEventListener("click", () => {
      state.attemptStatus = button.dataset.attempt;
      document.querySelectorAll("[data-attempt]").forEach((candidate) => {
        candidate.dataset.active = String(candidate.dataset.attempt === state.attemptStatus);
      });
      syncSummary(state);
    });
  });

  nextButton.addEventListener("click", () => {
    if (currentStep === 0 && !state.exam) return;
    if (currentStep === 1 && !state.attemptStatus) return;
    if (currentStep === 2) {
      state.examOption = examOptionSelect.value;
      if (!state.examOption) return;
    }
    if (currentStep === 3) {
      state.assistanceType = assistanceTypeSelect.value;
      if (!state.assistanceType) return;
    }
    currentStep += 1;
    void updateStep();
  });

  backButton.addEventListener("click", () => {
    if (currentStep === 0) return;
    currentStep -= 1;
    void updateStep();
  });

  examOptionSelect.addEventListener("input", () => {
    state.examOption = examOptionSelect.value;
    syncSummary(state);
  });

  assistanceTypeSelect.addEventListener("input", () => {
    state.assistanceType = assistanceTypeSelect.value;
    syncSummary(state);
  });

  void updateStep();
}

function renderExamChoices(container, state) {
  container.innerHTML = "";
  onboardExams.forEach((exam) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.examChoice = exam.name;
    button.className =
      "choice-card rounded-[1.5rem] border border-zinc-800 bg-zinc-950 px-5 py-5 text-left transition-all duration-200 hover:-translate-y-1 hover:border-orange-500 hover:bg-zinc-900";
    button.dataset.active = String(exam.name === state.exam);
    button.innerHTML = `
      <span class="block text-lg font-extrabold text-white">${escapeHtml(exam.name)}</span>
      <span class="mt-2 block text-xs font-bold uppercase tracking-[0.3em] text-zinc-400">${escapeHtml(formatLabel(exam.category))}</span>
    `;
    button.addEventListener("click", () => {
      state.exam = exam.name;
      state.category = exam.category;
      container.querySelectorAll("[data-exam-choice]").forEach((candidate) => {
        candidate.dataset.active = String(candidate.dataset.examChoice === exam.name);
      });
      syncSummary(state);
    });
    container.appendChild(button);
  });
}

async function mountClerkSignUp(state) {
  const authTarget = document.getElementById("clerk-onboard-sign-up");
  const configResponse = await fetch("/api/config", {
    credentials: "same-origin",
  });
  const config = await configResponse.json();

  if (!config.publishableKey || !config.clerkJsUrl) {
    throw new Error("Missing Clerk configuration.");
  }

  await loadClerkScript(config.clerkJsUrl, config.publishableKey);
  await window.Clerk.load({
    signInUrl: config.signInUrl,
    signUpUrl: "/onboard.html",
    afterSignInUrl: buildRedirect(state),
    afterSignUpUrl: buildRedirect(state),
    appearance: {
      options: {
        unsafe_disableDevelopmentModeWarnings: true,
      },
    },
  });

  if (window.Clerk.isSignedIn) {
    window.location.replace(buildRedirect(state));
    return;
  }

  window.Clerk.mountSignUp(authTarget, {
    signInUrl: config.signInUrl,
    appearance: {
      variables: {
        colorPrimary: "#f97316",
        colorBackground: "#111111",
        colorText: "#ffffff",
        colorTextSecondary: "#d4d4d8",
        colorInputBackground: "#171717",
        colorInputText: "#ffffff",
        borderRadius: "1rem",
      },
      options: {
        unsafe_disableDevelopmentModeWarnings: true,
      },
      elements: {
        card: "shadow-none bg-transparent border border-zinc-800 rounded-[1.75rem]",
        formButtonPrimary:
          "bg-[#f97316] hover:bg-[#ea580c] text-white rounded-2xl font-semibold",
        socialButtonsBlockButton:
          "rounded-2xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-white",
        formFieldInput:
          "rounded-2xl border border-zinc-800 bg-zinc-950 text-white focus:border-orange-500",
        footerActionLink: "text-[#f97316] hover:text-[#fb923c]",
      },
    },
    afterSignUpUrl: buildRedirect(state),
    afterSignInUrl: buildRedirect(state),
  });
}

function buildRedirect(state) {
  const params = new URLSearchParams({
    selectedExam: state.exam,
    selectedCategory: state.category,
    attemptStatus: state.attemptStatus,
    examOption: state.examOption,
    assistanceType: state.assistanceType,
  });
  return `/dashboard.html?${params.toString()}`;
}

function loadClerkScript(src, publishableKey) {
  return new Promise((resolve, reject) => {
    if (window.Clerk) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.dataset.clerkPublishableKey = publishableKey;
    script.src = src;
    script.type = "text/javascript";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load ClerkJS."));
    document.head.appendChild(script);
  });
}

function syncSummary(state) {
  setText("selected-exam", state.exam);
  setText("selected-category", formatLabel(state.category));
  setText("summary-exam", state.exam || "Pending");
  setText("summary-attempt", state.attemptStatus || "Pending");
  setText("summary-exam-option", state.examOption || "Pending");
  setText("summary-assistance-type", state.assistanceType || "Pending");
}

function findCategory(examName) {
  return onboardExams.find((exam) => exam.name === examName)?.category || "nursing";
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function formatLabel(value = "") {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

window.addEventListener("DOMContentLoaded", initOnboarding);
