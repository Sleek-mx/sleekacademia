const categoryThemes = {
  nursing: {
    primary: "#06b6d4",
    secondary: "#67e8f9",
    text: "#0e7490",
    surface: "#ecfeff",
  },
  law: {
    primary: "#ef4444",
    secondary: "#fca5a5",
    text: "#dc2626",
    surface: "#fef2f2",
  },
  finance: {
    primary: "#22c55e",
    secondary: "#86efac",
    text: "#15803d",
    surface: "#f0fdf4",
  },
  ict: {
    primary: "#f97316",
    secondary: "#fdba74",
    text: "#ea580c",
    surface: "#fff7ed",
  },
};

const exams = [
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

const courseModalContent = {
  nclex: {
    exam: "NCLEX-RN",
    category: "nursing",
    price: 9700,
    title: "NCLEX-RN / PN Mastery",
    definition:
      "NCLEX preparation at Sleek Academia trains learners to think like safe, entry-level nurses under adaptive exam conditions. The course turns broad nursing content into decisive clinical judgment, prioritization, and delegation skills. It is built for candidates who want structure, clarity, and confidence before test day.",
    pillars: [
      "Clinical judgment and prioritization drills",
      "Delegation and safety decision frameworks",
      "Question deconstruction for adaptive exams",
      "Scenario-based remediation with rationale review",
    ],
    quote:
      "What changed everything for me was learning how to think through NCLEX questions systematically instead of second-guessing every answer.",
  },
  pathophysiology: {
    exam: "Pathophysiology",
    category: "nursing",
    price: 9700,
    title: "Pathophysiology Intensive",
    definition:
      "Pathophysiology examines how disease processes alter normal body function across systems and clinical contexts. It helps learners connect symptoms, labs, disease progression, and interventions with real clinical reasoning. The course is designed to make difficult concepts feel coherent, practical, and exam-ready.",
    pillars: [
      "Disease mechanism mapping across body systems",
      "Clinical interpretation of signs and lab trends",
      "Rapid differentiation of similar disorders",
      "Case-based recall for licensure and practicum readiness",
    ],
    quote:
      "The active recall strategy for Pathophysiology helped me bridge the gap between theory and clinical practice in a way lectures never did.",
  },
  pharmacology: {
    exam: "Pharmacology",
    category: "nursing",
    price: 9700,
    title: "Pharmacology Mastery",
    definition:
      "Pharmacology focuses on drug classes, mechanisms of action, adverse effects, contraindications, and safe administration principles. The course helps students organize medication reasoning instead of memorizing disconnected facts. It supports both exam performance and stronger bedside confidence.",
    pillars: [
      "Drug class frameworks for fast recall",
      "Side effect and interaction prioritization",
      "Nursing implications and patient safety checkpoints",
      "High-yield memory anchors for exam stems",
    ],
    quote:
      "The pharmacology sessions made difficult drug classes feel organized, memorable, and immediately usable during clinical reviews.",
  },
  hesi: {
    exam: "HESI A2",
    category: "nursing",
    price: 9700,
    title: "HESI A2 / TEAS Readiness",
    definition:
      "HESI A2 and TEAS preparation strengthens the science, math, reading, and test-taking precision needed for nursing entry success. The learning path combines targeted remediation with strategic pacing to improve confidence across sections. It is designed for students who want both score growth and stronger academic readiness.",
    pillars: [
      "Targeted remediation by tested subdomain",
      "Timed pacing and accuracy control",
      "Science reinforcement for nursing readiness",
      "Confidence-building mock assessments",
    ],
    quote:
      "My HESI score jumped because the prep focused on the exact weak points I kept missing and gave me a clear strategy for every section.",
  },
  lsat: {
    exam: "LSAT",
    category: "law",
    price: 14700,
    title: "LSAT Essentials",
    definition:
      "LSAT preparation sharpens logical reasoning, reading precision, and analytical structure under timed pressure. The course is built to strengthen the habits that law-school admissions exams reward most. It combines rigorous breakdowns with repeatable test-day strategy.",
    pillars: [
      "Logical reasoning pattern recognition",
      "Reading precision under time pressure",
      "Analytical structure and argument mapping",
      "Timed exam control and pacing",
    ],
    quote:
      "The LSAT sessions finally made logic feel trainable instead of mysterious, and that changed how I approached every section.",
  },
  ube: {
    exam: "UBE",
    category: "law",
    price: 14700,
    title: "UBE Performance Track",
    definition:
      "UBE preparation at Sleek Academia combines doctrinal mastery with practical writing discipline and exam structure. The course helps candidates manage the Multistate Bar Examination with more precision and control. It is designed for serious performance under high cognitive load.",
    pillars: [
      "Doctrinal consolidation and recall",
      "Essay structure under pressure",
      "MBE strategy and elimination discipline",
      "Performance test organization and timing",
    ],
    quote:
      "What stood out was how the UBE prep made the exam feel structured and manageable instead of overwhelming.",
  },
  lpc: {
    exam: "LPC",
    category: "law",
    price: 14700,
    title: "LPC Preparation",
    definition:
      "LPC preparation focuses on practical legal application, professional competence, and structured exam readiness. The course supports learners who need both technical legal understanding and execution discipline. It is tailored for students aiming to move with confidence into solicitor-track training.",
    pillars: [
      "Professional skills application",
      "Transactional and drafting confidence",
      "Practical reasoning under exam conditions",
      "Structured revision planning",
    ],
    quote:
      "The LPC guidance felt practical from day one, and that made the legal concepts easier to use rather than just remember.",
  },
  atp: {
    exam: "ATP",
    category: "law",
    price: 14700,
    title: "ATP Advocacy Path",
    definition:
      "ATP preparation develops legal thinking, advocacy readiness, and structured exam discipline for advanced professional entry. The course is designed for learners who need sharper application, not just passive review. It combines legal rigor with focused performance coaching.",
    pillars: [
      "Advocacy reasoning and structure",
      "Issue spotting and legal application",
      "Revision strategy for dense legal content",
      "Confidence under formal assessment pressure",
    ],
    quote:
      "The ATP prep gave me a much clearer way to organize my legal thinking and present it with more confidence.",
  },
  cfa: {
    exam: "CFA Level I",
    category: "finance",
    price: 19700,
    title: "CFA Levels I-III",
    definition:
      "CFA preparation at Sleek Academia is built around disciplined investment reasoning, ethics, valuation, and portfolio thinking. The course helps candidates master both breadth and depth across the curriculum. It is structured for professionals who need serious analytical clarity at every level.",
    pillars: [
      "Ethics and standards fluency",
      "Valuation and financial statement analysis",
      "Portfolio construction reasoning",
      "Exam pacing and multi-topic integration",
    ],
    quote:
      "The CFA track gave me a framework for thinking across topics, which made the material feel connected instead of fragmented.",
  },
  cpa: {
    exam: "CPA",
    category: "finance",
    price: 19700,
    title: "CPA Pathway",
    definition:
      "CPA preparation strengthens accounting judgment, reporting accuracy, and exam discipline across core professional domains. The course is designed to make complex material feel more systematic and usable. It supports candidates aiming for both pass performance and long-term technical confidence.",
    pillars: [
      "Accounting principle consolidation",
      "Reporting accuracy and interpretation",
      "Structured question approach",
      "Revision systems for complex standards",
    ],
    quote:
      "The CPA prep brought order to material that used to feel too broad, and that gave me real momentum.",
  },
  acca: {
    exam: "ACCA",
    category: "finance",
    price: 19700,
    title: "ACCA / CIFA Professional Track",
    definition:
      "ACCA and CIFA preparation at Sleek Academia supports learners pursuing financial analysis, reporting, and professional advancement. The learning path blends technical rigor with exam strategy so knowledge translates into results. It is ideal for candidates who need credibility, clarity, and consistency.",
    pillars: [
      "Financial reporting precision",
      "Analytical interpretation and control",
      "Structured revision and retention planning",
      "Exam execution under time pressure",
    ],
    quote:
      "The ACCA support made the workload feel manageable and helped me focus on what actually moves exam performance.",
  },
  comptia_a: {
    exam: "CompTIA A+",
    category: "ict",
    price: 9700,
    title: "CompTIA A+ Foundation",
    definition:
      "CompTIA A+ preparation covers essential systems knowledge, troubleshooting logic, and support-ready technical thinking. The course is built for candidates who want a practical and well-structured start in IT. It emphasizes usable understanding, not just checklist memorization.",
    pillars: [
      "Core hardware and system fluency",
      "Troubleshooting workflow discipline",
      "Support-oriented decision making",
      "Foundational exam confidence",
    ],
    quote:
      "The A+ path made entry-level IT feel approachable and practical, which gave me the confidence to keep building.",
  },
  security_plus: {
    exam: "CompTIA Security+",
    category: "ict",
    price: 9700,
    title: "Security+ Readiness",
    definition:
      "Security+ preparation develops security reasoning across risk, controls, threats, and defensive operations. The course is structured to help candidates see how concepts connect in real environments. It is ideal for learners who want both certification progress and applied security confidence.",
    pillars: [
      "Threat and control alignment",
      "Security operations foundations",
      "Risk and governance interpretation",
      "Exam scenario reasoning",
    ],
    quote:
      "The Security+ coaching helped me stop memorizing isolated terms and start understanding how security decisions actually fit together.",
  },
  aws: {
    exam: "AWS Architect",
    category: "ict",
    price: 12700,
    title: "AWS Architect",
    definition:
      "AWS Architect preparation strengthens cloud design judgment, architecture tradeoffs, and scalable infrastructure thinking. The course helps learners move beyond service recall into solution reasoning. It is built for candidates who want confidence in both architecture questions and practical design logic.",
    pillars: [
      "Architecture pattern fluency",
      "Service selection and tradeoff reasoning",
      "Scalability and resilience planning",
      "Scenario-based exam decision making",
    ],
    quote:
      "The AWS prep finally made architecture questions feel like real design conversations instead of random cloud trivia.",
  },
  ccna: {
    exam: "CCNA",
    category: "ict",
    price: 9700,
    title: "CCNA / CEH Technical Track",
    definition:
      "CCNA and CEH preparation blends networking depth with security-focused thinking for modern technical careers. The course is designed to build practical confidence as well as certification readiness. It supports learners who want stronger command over infrastructure and cyber fundamentals.",
    pillars: [
      "Network behavior and routing logic",
      "Security awareness and technical control",
      "Configuration reasoning under pressure",
      "Hands-on mental models for exams",
    ],
    quote:
      "The CCNA and CEH prep gave me a clearer technical picture of how networks and security fit together in the real world.",
  },
};

function initCoursesPage() {
  const root = document.documentElement;
  const searchInput = document.getElementById("exam-search");
  const results = document.getElementById("exam-results");
  const launchButton = document.getElementById("launch-onboard");
  const modal = document.getElementById("modal-wrapper");
  const modalExam = document.getElementById("course-modal-exam");
  const modalTitle = document.getElementById("course-modal-title");
  const modalDefinition = document.getElementById("course-modal-definition");
  const modalPillars = document.getElementById("course-modal-pillars");
  const modalQuote = document.getElementById("course-modal-quote");
  const modalCta = document.getElementById("course-modal-cta");
  const modalEnroll = document.getElementById("course-modal-enroll");
  const modalScroll = document.getElementById("course-modal-scroll");
  const transition = document.getElementById("funnel-transition");
  const closeModalButton = document.getElementById("close-course-modal");

  let activeCategory = "nursing";
  let selectedExam = "";

  function applyTheme(category) {
    const theme = categoryThemes[category] || categoryThemes.nursing;
    activeCategory = category;
    root.style.setProperty("--category-primary", theme.primary);
    root.style.setProperty("--category-secondary", theme.secondary);
    root.style.setProperty("--category-text", theme.text);
    root.style.setProperty("--category-surface", theme.surface);
  }

  function renderResults(query = "") {
    const normalized = query.trim().toLowerCase();
    const filtered = exams.filter((exam) => exam.name.toLowerCase().includes(normalized));

    results.innerHTML = "";
    results.classList.remove("hidden");

    filtered.forEach((exam) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className =
        "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition-colors hover:bg-[var(--category-surface)]";
      button.innerHTML = `
        <span>
          <span class="block text-sm font-bold text-slate-900">${escapeHtml(exam.name)}</span>
          <span class="block text-xs uppercase tracking-[0.25em] text-slate-500">${escapeHtml(formatLabel(exam.category))}</span>
        </span>
        <span class="material-symbols-outlined theme-text">south</span>
      `;
      button.addEventListener("click", () => {
        selectedExam = exam.name;
        searchInput.value = exam.name;
        applyTheme(exam.category);
        launchButton.classList.remove("hidden");
        results.classList.add("hidden");
      });
      results.appendChild(button);
    });

    if (!filtered.length) {
      results.innerHTML =
        '<div class="rounded-2xl px-4 py-3 text-sm text-slate-500">No matching exams found.</div>';
    }
  }

  function toggleModal(key) {
    console.log("toggleModal called with key:", key);
    const content = courseModalContent[key];
    if (!content) {
      console.log("No content found for key:", key);
      return;
    }

    applyTheme(content.category);
    modalExam.textContent = content.exam;
    modalTitle.textContent = content.title;
    modalDefinition.textContent = content.definition;
    modalQuote.textContent = `"${content.quote}"`;
    modalPillars.innerHTML = "";

    content.pillars.forEach((pillar) => {
      const item = document.createElement("li");
      item.className = "flex items-start gap-3";
      item.innerHTML = `
        <span class="mt-1 inline-block h-2.5 w-2.5 flex-none rounded-full theme-bg"></span>
        <span>${escapeHtml(pillar)}</span>
      `;
      modalPillars.appendChild(item);
    });

    const params = new URLSearchParams({
      exam: content.exam,
      category: content.category,
    });
    modalCta.href = `/onboard.html?${params.toString()}`;
    if (modalEnroll) {
      modalEnroll.dataset.enrollCourse = content.title;
      modalEnroll.dataset.enrollPrice = String(content.price);
      const dollars = Math.round(content.price / 100);
      modalEnroll.textContent = `Enroll — $${dollars}`;
    }

    console.log("Modal opened. Viewport height:", window.innerHeight);
    modal.classList.add("active");
    document.body.classList.add("modal-open");
    modal.scrollTop = 0;
    if (modalScroll) {
      modalScroll.scrollTop = 0;
    }
  }

  function closeModal() {
    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
  }

  function launchFunnel() {
    if (!selectedExam) return;
    const category = exams.find((exam) => exam.name === selectedExam)?.category || activeCategory;
    if (transition) {
      transition.classList.remove("pointer-events-none");
      transition.classList.add("opacity-100");
    }
    window.setTimeout(() => {
      const params = new URLSearchParams({
        exam: selectedExam,
        category,
      });
      window.location.href = `/onboard.html?${params.toString()}`;
    }, 240);
  }

  applyTheme(activeCategory);
  renderResults("");

  searchInput.addEventListener("focus", () => {
    renderResults(searchInput.value);
  });

  searchInput.addEventListener("click", () => {
    renderResults(searchInput.value);
  });

  searchInput.addEventListener("input", (event) => {
    const typedValue = event.target.value.trim();
    const exactMatch = exams.find((exam) => exam.name.toLowerCase() === typedValue.toLowerCase());
    if (exactMatch) {
      selectedExam = exactMatch.name;
      applyTheme(exactMatch.category);
      launchButton.classList.remove("hidden");
    } else {
      selectedExam = "";
      launchButton.classList.add("hidden");
    }
    renderResults(event.target.value);
  });

  document.addEventListener("click", (event) => {
    if (!results.contains(event.target) && event.target !== searchInput) {
      results.classList.add("hidden");
    }
  });

  launchButton.addEventListener("click", launchFunnel);

  document.querySelectorAll("[data-learn-more]").forEach((button) => {
    button.addEventListener("click", () => {
      toggleModal(button.dataset.learnMore);
    });
  });

  closeModalButton.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });
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

window.addEventListener("DOMContentLoaded", initCoursesPage);
