/* Sleek Academia adaptive quiz — shared client engine.
 *
 * Drives every quiz page. The page supplies its identity in `window.QUIZ_CONFIG`
 * before this script loads:
 *
 *   window.QUIZ_CONFIG = {
 *     apiBase: "/api/patho-quiz",                        // route the router is mounted on
 *     storeKey: "sleek.renalcardiac.attempt.v1",         // localStorage key for progress
 *     entitlementKey: "sleek.renalcardiac.entitlement.v1" // localStorage key for the unlock
 *   };
 *
 * The keys must be distinct per quiz: sharing them would let one quiz's progress
 * or unlock leak into another. The defaults below are the antimicrobial quiz's
 * original values, so that page keeps working even if its config were missing —
 * the safe failure direction for a page with paying learners.
 *
 * The browser deliberately knows very little. It never holds the answer key:
 * questions arrive without it, grading happens on the server, and option ids are
 * opaque per-attempt hashes. This file drives presentation, persistence and the
 * remediation flow.
 *
 * Interactive flow per question:
 *   render → submit → server grades → feedback
 *   → if missed: AI notes → two open-ended probes → AI evaluation → resume
 */
(function () {
  "use strict";

  var CFG = window.QUIZ_CONFIG || {};
  var STORE_KEY = CFG.storeKey || "sleek.antimicrobial.attempt.v1";
  var ENTITLEMENT_KEY = CFG.entitlementKey || "sleek.antimicrobial.entitlement.v1";
  var API = CFG.apiBase || "/api/quiz";

  // ── DOM ────────────────────────────────────────────────────────────────
  var $ = function (id) { return document.getElementById(id); };

  var screens = {
    loading: $("screen-loading"),
    start: $("screen-start"),
    quiz: $("screen-quiz"),
    paywall: $("screen-paywall"),
    results: $("screen-results"),
    error: $("screen-error")
  };

  // ── State ──────────────────────────────────────────────────────────────
  var config = null;
  var state = null;      // { salt, history, current, phase, probes }
  var entitlement = null;
  var submitting = false;
  var paypalRendered = false;

  function newSalt() {
    var bytes = new Uint8Array(16);
    (window.crypto || window.msCrypto).getRandomValues(bytes);
    var out = "";
    for (var i = 0; i < bytes.length; i++) {
      out += "abcdefghijklmnopqrstuvwxyz0123456789"[bytes[i] % 36];
    }
    return out;
  }

  function freshState() {
    return { salt: newSalt(), history: [], current: null, phase: "question", probes: null };
  }

  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* private mode */ }
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed.salt !== "string" || !Array.isArray(parsed.history)) return null;
      return parsed;
    } catch (e) { return null; }
  }

  function clearSaved() {
    try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ }
  }

  function loadEntitlement() {
    try { return localStorage.getItem(ENTITLEMENT_KEY) || null; } catch (e) { return null; }
  }

  function saveEntitlement(token) {
    entitlement = token;
    try { localStorage.setItem(ENTITLEMENT_KEY, token); } catch (e) { /* ignore */ }
  }

  // ── Networking ─────────────────────────────────────────────────────────
  function api(path, body, timeoutMs) {
    var headers = { "Content-Type": "application/json" };
    if (entitlement) headers["X-Quiz-Entitlement"] = entitlement;

    // Abort rather than hang: a stalled tutor call must hand over to the local
    // fallback quickly instead of leaving the learner staring at a spinner.
    var controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    var timer = null;
    if (controller && timeoutMs) {
      timer = setTimeout(function () { controller.abort(); }, timeoutMs);
    }

    return fetch(API + path, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body || {}),
      signal: controller ? controller.signal : undefined
    }).then(function (res) {
      if (timer) clearTimeout(timer);
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (!res.ok) {
          var err = new Error(data.error || "Request failed (" + res.status + ")");
          err.status = res.status;
          err.data = data;
          throw err;
        }
        return data;
      });
    }).catch(function (err) {
      if (timer) clearTimeout(timer);
      throw err;
    });
  }

  function apiGet(path) {
    var headers = {};
    if (entitlement) headers["X-Quiz-Entitlement"] = entitlement;
    return fetch(API + path, { headers: headers }).then(function (res) { return res.json(); });
  }

  // ── Screens ────────────────────────────────────────────────────────────
  function show(name) {
    Object.keys(screens).forEach(function (key) {
      if (screens[key]) screens[key].hidden = key !== name;
    });
    if (name === "loading") {
      screens.loading.setAttribute("aria-busy", "true");
    } else {
      screens.loading.removeAttribute("aria-busy");
    }
  }

  function fail(message) {
    $("error-message").textContent = message || "The challenge could not be loaded.";
    show("error");
  }

  function text(el, value) { if (el) el.textContent = value; }

  // ── Start screen ───────────────────────────────────────────────────────
  function renderStart() {
    text($("start-student"), config.student);
    text($("start-total"), config.totalQuestions);
    text($("start-free"), config.freeQuestions);
    text($("start-price"), String(config.unlockPriceUsd).replace(/\.00$/, ""));

    apiGet("/health").then(function (health) {
      if (health && health.bank) text($("start-points"), health.bank.totalPoints);
    }).catch(function () { /* non-essential */ });

    // Curated per quiz in QUIZ_CONFIG rather than derived from the bank: the bank
    // has far more topics than belong in a start-screen cloud. Plain strings set
    // via textContent, so an ampersand needs no entity and no markup can slip in.
    var topics = CFG.topics || [
      "Mechanisms of action", "Stewardship", "Culture & susceptibility", "Pregnancy safety",
      "Penicillins & cephalosporins", "Vancomycin", "Aminoglycosides", "Tetracyclines",
      "Fluoroquinolones", "Macrolides", "Sulfonamides", "Metronidazole", "Clindamycin",
      "Linezolid", "Rifampin", "Antifungals", "Antivirals", "Tuberculosis", "Drug interactions",
      "Organ toxicity", "Severe cutaneous reactions", "Prioritisation"
    ];
    var cloud = $("start-topics");
    cloud.innerHTML = "";
    topics.forEach(function (t) {
      var chip = document.createElement("span");
      chip.className = "topic-chip";
      chip.textContent = t;
      cloud.appendChild(chip);
    });

    var saved = load();
    var canResume = saved && saved.history.length > 0;
    $("btn-resume").hidden = !canResume;
    $("btn-start").textContent = canResume ? "Start a new attempt" : "Begin the challenge";

    var notes = [];
    if (canResume) notes.push("You have an attempt in progress with " + saved.history.length + " question(s) answered.");
    if (config.entitled) notes.push("Full access is active — all " + config.totalQuestions + " questions are unlocked.");
    if (!config.tutor.configured) notes.push("The AI tutor is offline; remediation will use the built-in notes.");
    text($("start-note"), notes.join(" "));

    show("start");
  }

  // ── Question rendering ─────────────────────────────────────────────────
  /* Score and progress are recomputed from history so they stay correct after a
   * submission, not only when the next question renders. */
  function updateScoreDisplay(total) {
    var points = state.history.reduce(function (sum, h) { return sum + (h.correct ? (h.points || 1) : 0); }, 0);
    var possible = state.history.reduce(function (sum, h) { return sum + (h.points || 1); }, 0);
    text($("status-score"), points);
    text($("status-accuracy"), possible
      ? Math.round((points / possible) * 100) + "% so far"
      : "no answers yet");

    var cap = total || Number($("status-total").textContent) || config.totalQuestions;
    var pct = Math.min(100, Math.round((state.history.length / cap) * 100));
    $("progress-fill").style.width = pct + "%";
    $("progress").setAttribute("aria-valuenow", String(pct));
  }

  function renderStatus(payload) {
    var q = payload.question;
    var total = payload.available || config.totalQuestions;

    text($("status-index"), state.history.length + 1);
    text($("status-total"), total);
    text($("status-topic"), q.topic);
    text($("status-level"), "Level " + q.difficulty);
    $("status-remediation").hidden = !payload.isRemediation;

    updateScoreDisplay(total);
  }

  function renderQuestion(payload) {
    var q = payload.question;
    state.current = payload;
    state.phase = "question";
    save();

    renderStatus(payload);

    text($("question-stem"), q.stem);

    var isSata = q.type === "sata";
    var hint = $("sata-hint");
    hint.hidden = !isSata;
    if (isSata) {
      hint.textContent = "Select all that apply — this item requires " + q.selectionCount +
        " selections and is worth " + q.points + " points.";
    }

    var box = $("options");
    box.innerHTML = "";
    q.options.forEach(function (opt) {
      var label = document.createElement("label");
      label.className = "option";

      var input = document.createElement("input");
      input.type = isSata ? "checkbox" : "radio";
      input.name = "answer";
      input.value = opt.id;

      var span = document.createElement("span");
      span.className = "option-text";
      span.textContent = opt.text;

      label.appendChild(input);
      label.appendChild(span);
      box.appendChild(label);
    });

    $("form-error").hidden = true;
    $("btn-submit").disabled = false;
    $("btn-submit").textContent = "Submit answer";
    $("question-form").hidden = false;
    $("feedback").hidden = true;
    $("remediation").hidden = true;

    show("quiz");
    $("question-stem").scrollIntoView({ block: "nearest" });
  }

  function nextQuestion() {
    show("loading");
    return api("/next", { salt: state.salt, history: state.history })
      .then(function (payload) {
        if (payload.complete) {
          if (payload.paywalled) return renderPaywall();
          return renderResults();
        }
        renderQuestion(payload);
      })
      .catch(function (err) { fail(err.message); });
  }

  // ── Submit ─────────────────────────────────────────────────────────────
  function selectedIds() {
    return Array.prototype.slice
      .call(document.querySelectorAll('#options input:checked'))
      .map(function (i) { return i.value; });
  }

  function onSubmit(event) {
    event.preventDefault();
    if (submitting || !state.current) return;

    var q = state.current.question;
    var selected = selectedIds();
    var errorEl = $("form-error");

    if (selected.length === 0) {
      errorEl.textContent = "Select an answer before submitting.";
      errorEl.hidden = false;
      return;
    }
    if (q.type === "sata" && selected.length !== q.selectionCount) {
      errorEl.textContent = "This item requires exactly " + q.selectionCount +
        " selections. You have chosen " + selected.length + ".";
      errorEl.hidden = false;
      return;
    }

    // Guard against double submission.
    submitting = true;
    errorEl.hidden = true;
    $("btn-submit").disabled = true;
    $("btn-submit").textContent = "Checking…";

    api("/answer", { salt: state.salt, questionId: q.id, selected: selected })
      .then(function (result) {
        Array.prototype.slice.call(document.querySelectorAll("#options input"))
          .forEach(function (i) { i.disabled = true; });

        state.history.push({
          questionId: q.id,
          correct: result.isCorrect,
          isRemediation: state.current.isRemediation === true,
          partialUnderstanding: result.partialUnderstanding,
          points: result.pointsPossible
        });
        save();
        updateScoreDisplay();

        renderFeedback(q, result, selected);
      })
      .catch(function (err) {
        errorEl.textContent = err.message;
        errorEl.hidden = false;
        $("btn-submit").disabled = false;
        $("btn-submit").textContent = "Submit answer";
      })
      .finally(function () { submitting = false; });
  }

  // ── Feedback ───────────────────────────────────────────────────────────
  function renderFeedback(question, result, selected) {
    var verdict = $("verdict");
    if (result.isCorrect) {
      verdict.textContent = "Correct — " + result.pointsEarned + " of " +
        result.pointsPossible + " point" + (result.pointsPossible === 1 ? "" : "s");
      verdict.className = "verdict verdict-correct";
    } else if (result.partialUnderstanding > 0) {
      verdict.textContent = "Not quite — you identified " + result.hitCount + " of " +
        result.correctCount + " correct options. Select-all items score no partial credit.";
      verdict.className = "verdict verdict-partial";
    } else {
      verdict.textContent = "Incorrect";
      verdict.className = "verdict verdict-incorrect";
    }

    text($("feedback-rationale"), result.rationale);
    text($("feedback-clue"), result.keyClue);
    text($("feedback-takeaway"), result.clinicalTakeaway);

    $("option-review").innerHTML = "";
    result.options.forEach(function (opt) {
      $("option-review").appendChild(optionReviewItem(opt));
    });

    $("question-form").hidden = true;
    $("feedback").hidden = false;
    $("btn-next").textContent = result.isCorrect ? "Next question" : "Continue to remediation";
    $("feedback").focus();
    $("feedback").scrollIntoView({ behavior: "smooth", block: "start" });

    state.phase = "feedback";
    // Keep the bank's own teaching text. If the AI tutor is unreachable later in
    // the remediation flow we render this instead of an apology.
    state.lastResult = {
      isCorrect: result.isCorrect,
      questionId: question.id,
      remediationConcept: result.remediationConcept,
      clinicalTakeaway: result.clinicalTakeaway,
      keyClue: result.keyClue
    };
    state.lastChosenText = result.options
      .filter(function (o) { return o.wasSelected; })
      .map(function (o) { return o.text; })
      .join(" | ");
    save();
  }

  function optionReviewItem(opt) {
    var li = document.createElement("li");
    if (opt.isCorrect) li.className = "is-correct";
    else if (opt.wasSelected) li.className = "is-incorrect-selected";

    var head = document.createElement("div");
    head.className = "review-head";

    var textSpan = document.createElement("span");
    textSpan.className = "review-option-text";
    textSpan.textContent = opt.text;
    head.appendChild(textSpan);

    function badge(cls, label) {
      var b = document.createElement("span");
      b.className = "review-badge " + cls;
      b.textContent = label;
      head.appendChild(b);
    }
    if (opt.isCorrect && opt.wasSelected) badge("badge-correct", "Correct · your choice");
    else if (opt.isCorrect) badge("badge-missed", "Correct · missed");
    else if (opt.wasSelected) badge("badge-chosen", "Your choice · incorrect");

    li.appendChild(head);

    if (opt.explanation) {
      var why = document.createElement("p");
      why.className = "review-why";
      why.textContent = opt.explanation;
      li.appendChild(why);
    }
    return li;
  }

  function onNext() {
    if (state.lastResult && !state.lastResult.isCorrect) return startRemediation();
    nextQuestion();
  }

  // ── Remediation loop ───────────────────────────────────────────────────
  function startRemediation() {
    var questionId = state.lastResult.questionId;
    state.phase = "remediation-notes";
    save();

    $("feedback").hidden = true;
    var panel = $("remediation");
    panel.hidden = false;
    $("remediation-notes").hidden = false;
    $("remediation-probes").hidden = true;
    $("remediation-result").hidden = true;

    $("notes-body").innerHTML =
      '<p class="loading-text">Your tutor is preparing notes<span class="ellipsis"></span></p>';
    text($("notes-heading"), "Reviewing the concept");
    $("notes-pitfall").hidden = true;
    $("btn-to-probes").disabled = true;

    panel.focus();
    panel.scrollIntoView({ behavior: "smooth", block: "start" });

    api("/tutor/notes", { questionId: questionId, chosenText: state.lastChosenText || "" }, 30000)
      .then(function (notes) {
        text($("notes-heading"), notes.heading || "Reviewing the concept");

        var list = document.createElement("ul");
        list.className = "notes-list";
        (notes.notes || []).forEach(function (n) {
          var li = document.createElement("li");
          li.textContent = n;
          list.appendChild(li);
        });
        $("notes-body").innerHTML = "";
        $("notes-body").appendChild(list);

        if (notes.pitfall) {
          text($("notes-pitfall"), notes.pitfall);
          $("notes-pitfall").hidden = false;
        }
        $("btn-to-probes").disabled = false;
      })
      .catch(function () {
        // Fall back to the bank's own teaching text rather than an apology.
        var last = state.lastResult || {};
        var bullets = [last.remediationConcept, last.clinicalTakeaway].filter(Boolean);
        $("notes-body").innerHTML = "";
        var list = document.createElement("ul");
        list.className = "notes-list";
        bullets.forEach(function (b) {
          var li = document.createElement("li");
          li.textContent = b;
          list.appendChild(li);
        });
        $("notes-body").appendChild(list);
        if (last.keyClue) {
          text($("notes-pitfall"), last.keyClue);
          $("notes-pitfall").hidden = false;
        }
        $("btn-to-probes").disabled = false;
      });
  }

  function showProbes() {
    var questionId = state.lastResult.questionId;
    state.phase = "remediation-probes";
    save();

    $("remediation-notes").hidden = true;
    var form = $("remediation-probes");
    form.hidden = false;
    $("probe-error").hidden = true;
    $("btn-submit-probes").disabled = true;
    $("probe-fields").innerHTML =
      '<p class="loading-text">Writing two questions for you<span class="ellipsis"></span></p>';
    form.scrollIntoView({ behavior: "smooth", block: "start" });

    api("/tutor/probes", { questionId: questionId }, 30000)
      .then(function (data) {
        var qs = (data.questions || []).filter(function (q) { return String(q || "").trim(); });
        buildProbeFields(qs.length >= 2 ? qs : defaultProbes());
      })
      .catch(function () { buildProbeFields(defaultProbes()); });
  }

  function defaultProbes() {
    return [
      "In your own words, explain the principle this question was testing.",
      "How would you recognise and respond to this issue in a patient, and who would you notify?"
    ];
  }

  function buildProbeFields(questions) {
    state.probes = questions;
    save();

    var wrap = $("probe-fields");
    wrap.innerHTML = "";
    questions.forEach(function (q, i) {
      var field = document.createElement("div");
      field.className = "probe-field";

      var id = "probe-answer-" + i;
      var label = document.createElement("label");
      label.setAttribute("for", id);
      label.textContent = (i + 1) + ". " + q;

      var area = document.createElement("textarea");
      area.id = id;
      area.name = id;
      area.rows = 3;
      area.setAttribute("maxlength", "1500");
      area.placeholder = "Two or three sentences.";

      field.appendChild(label);
      field.appendChild(area);
      wrap.appendChild(field);
    });
    $("btn-submit-probes").disabled = false;
  }

  function onSubmitProbes(event) {
    event.preventDefault();
    var answers = Array.prototype.slice
      .call(document.querySelectorAll("#probe-fields textarea"))
      .map(function (t) { return t.value.trim(); });

    if (answers.every(function (a) { return a.length === 0; })) {
      var err = $("probe-error");
      err.textContent = "Answer at least one question, or choose Skip.";
      err.hidden = false;
      return;
    }
    evaluateProbes(answers);
  }

  function evaluateProbes(answers) {
    state.phase = "remediation-result";
    save();

    $("remediation-probes").hidden = true;
    var panel = $("remediation-result");
    panel.hidden = false;
    $("btn-resume-quiz").disabled = true;
    $("evaluation-body").innerHTML =
      '<p class="loading-text">Reviewing your answers<span class="ellipsis"></span></p>';
    panel.scrollIntoView({ behavior: "smooth", block: "start" });

    api("/tutor/evaluate", {
      questionId: state.lastResult.questionId,
      probes: state.probes || [],
      answers: answers
    }, 30000)
      .then(function (evaluation) { renderEvaluation(evaluation); })
      .catch(function () {
        // The tutor is unreachable. Grade locally against effort and show the
        // bank's own reasoning, so the learner still gets a real close-out.
        renderEvaluation(localEvaluation(answers));
      });
  }

  /* Client-side stand-in for the AI evaluation, built from the teaching text the
   * grading response already delivered. Same shape as the server payload. */
  function localEvaluation(answers) {
    var substantive = (answers || []).filter(function (a) {
      return String(a || "").trim().length >= 15;
    }).length;
    var last = state.lastResult || {};

    return {
      understood: substantive >= 2,
      verdict: substantive >= 2
        ? "Your answers were recorded. Compare your reasoning against the summary below."
        : "Your answers were brief. Work through the reasoning below before continuing.",
      feedback: [],
      corrected: [last.remediationConcept, last.clinicalTakeaway].filter(Boolean).join(" "),
      source: "fallback"
    };
  }

  function renderEvaluation(evaluation) {
    var body = $("evaluation-body");
    body.innerHTML = "";

    if (evaluation.verdict) {
      var v = document.createElement("p");
      v.className = "eval-verdict";
      v.textContent = (evaluation.understood ? "Understood. " : "Needs another look. ") + evaluation.verdict;
      body.appendChild(v);
    }

    if (evaluation.feedback && evaluation.feedback.length) {
      var list = document.createElement("ul");
      list.className = "eval-list";
      evaluation.feedback.forEach(function (f) {
        var li = document.createElement("li");
        li.textContent = f;
        list.appendChild(li);
      });
      body.appendChild(list);
    }

    if (evaluation.corrected) {
      var box = document.createElement("p");
      box.className = "eval-corrected";
      box.textContent = evaluation.corrected;
      body.appendChild(box);
    }

    $("btn-resume-quiz").disabled = false;
  }

  function skipProbes() { evaluateProbes(["", ""]); }

  function resumeAfterRemediation() {
    state.phase = "question";
    state.probes = null;
    save();
    nextQuestion();
  }

  // ── Paywall ────────────────────────────────────────────────────────────
  function renderPaywall() {
    text($("paywall-price"), String(config.unlockPriceUsd).replace(/\.00$/, ""));

    var answered = state.history.length;
    var correct = state.history.filter(function (h) { return h.correct; }).length;
    // Deliberately says "material", not "classes": this engine serves a
    // pathophysiology quiz as well as a pharmacology one.
    text($("paywall-summary"),
      "You have answered " + answered + " question(s) with " + correct + " correct. " +
      "The remaining " + (config.totalQuestions - config.freeQuestions) +
      " questions cover the material most likely to appear on your exam.");

    $("paywall-error").hidden = true;

    if (!config.paypal.configured) {
      var err = $("paywall-error");
      err.textContent = "Card checkout is not configured on this server. Use an access code, or contact Sleek Academia.";
      err.hidden = false;
      text($("paywall-mode"), "");
    } else {
      text($("paywall-mode"), config.paypal.live
        ? "Secure checkout by PayPal. This is a live payment."
        : "Secure checkout by PayPal (sandbox test mode — no real money moves).");
      mountPayPal();
    }

    show("paywall");
  }

  function mountPayPal() {
    if (paypalRendered) return;

    var container = $("paypal-container");
    container.innerHTML = '<p class="loading-text">Loading secure checkout<span class="ellipsis"></span></p>';

    loadPayPalSdk()
      .then(function () {
        container.innerHTML = "";
        paypalRendered = true;
        window.paypal.Buttons({
          style: { layout: "vertical", shape: "pill", label: "pay", height: 45 },
          createOrder: function () {
            return api("/unlock/paypal/create", {}).then(function (d) { return d.orderId; });
          },
          onApprove: function (data) {
            container.innerHTML = '<p class="loading-text">Confirming your payment<span class="ellipsis"></span></p>';
            return api("/unlock/paypal/capture", { orderId: data.orderID })
              .then(function (res) {
                saveEntitlement(res.entitlement);
                config.entitled = true;
                paypalRendered = false;
                nextQuestion();
              })
              .catch(function (err) {
                paypalRendered = false;
                container.innerHTML = "";
                var e = $("paywall-error");
                e.textContent = err.message +
                  " If you were charged, contact Sleek Academia with your PayPal receipt and access will be restored.";
                e.hidden = false;
                mountPayPal();
              });
          },
          onError: function () {
            var e = $("paywall-error");
            e.textContent = "PayPal reported a problem. Please try again, or use an access code.";
            e.hidden = false;
          }
        }).render("#paypal-container");
      })
      .catch(function () {
        container.innerHTML = "";
        var e = $("paywall-error");
        e.textContent = "Could not load PayPal. Check your connection, or use an access code.";
        e.hidden = false;
      });
  }

  function loadPayPalSdk() {
    if (window.paypal) return Promise.resolve();
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = "https://www.paypal.com/sdk/js?client-id=" +
        encodeURIComponent(config.paypal.clientId) + "&currency=USD&intent=capture";
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function onSubmitCode(event) {
    event.preventDefault();
    var code = $("access-code").value.trim();
    var err = $("code-error");
    err.hidden = true;

    if (!code) {
      err.textContent = "Enter your access code.";
      err.hidden = false;
      return;
    }

    api("/unlock/code", { code: code })
      .then(function (res) {
        saveEntitlement(res.entitlement);
        config.entitled = true;
        nextQuestion();
      })
      .catch(function (e) {
        err.textContent = e.message;
        err.hidden = false;
      });
  }

  // ── Results ────────────────────────────────────────────────────────────
  function renderResults() {
    show("loading");
    return api("/results", { history: state.history })
      .then(function (r) {
        text($("results-band"), r.band);
        text($("results-percent"), r.percentage + "%");
        text($("results-score"), r.totalScore);
        text($("results-possible"), r.pointsPossible);
        text($("results-completed"), r.questionsCompleted);

        renderMetrics(r);
        renderBuckets(r);
        renderBars($("results-topics"), r.topics.map(function (t) {
          return {
            label: t.topic, accuracy: t.accuracy,
            detail: t.correct + "/" + t.answered, mastered: t.mastered
          };
        }));
        // `categories` is the canonical field; `medicationClasses` is the older
        // name the antimicrobial quiz shipped with and is still sent alongside it.
        renderBars($("results-classes"), (r.categories || r.medicationClasses).map(function (c) {
          return {
            label: c.category || c.medicationClass,
            accuracy: c.accuracy,
            detail: c.correct + "/" + c.answered
          };
        }));
        renderBars($("results-difficulty"), r.difficultyPerformance.map(function (d) {
          return { label: "Level " + d.difficulty, accuracy: d.accuracy, detail: d.correct + "/" + d.answered };
        }));
        renderRecommendations(r);
        renderMissed(r);

        // "Remaining" counts only accessible questions, so an unentitled learner
        // who finished the free 50 has 0 remaining yet still has 50 to unlock.
        $("btn-continue-quiz").hidden = !r.entitled || r.questionsRemaining === 0;
        $("btn-unlock-from-results").hidden =
          r.entitled || r.questionsAvailable >= config.totalQuestions;

        show("results");
        window.scrollTo(0, 0);
      })
      .catch(function (err) { fail(err.message); });
  }

  function renderMetrics(r) {
    var pct = function (v) { return v === null || v === undefined ? "—" : Math.round(v * 100) + "%"; };
    var metrics = [
      ["First-attempt accuracy", pct(r.firstAttemptAccuracy)],
      ["Remediation accuracy", pct(r.remediationAccuracy)],
      ["Questions remaining", r.questionsRemaining],
      ["Avg difficulty mastered", r.averageDifficultyMastered === null ? "—" : r.averageDifficultyMastered],
      ["Strongest topic", r.strongestTopics[0] || "—"],
      ["Weakest topic", r.weakestTopics[0] || "—"]
    ];

    var grid = $("results-metrics");
    grid.innerHTML = "";
    metrics.forEach(function (m) {
      var cell = document.createElement("div");
      cell.className = "metric";
      var label = document.createElement("span");
      label.className = "metric-label";
      label.textContent = m[0];
      var value = document.createElement("span");
      value.className = "metric-value";
      value.textContent = m[1];
      cell.appendChild(label);
      cell.appendChild(value);
      grid.appendChild(cell);
    });
  }

  function renderBuckets(r) {
    var wrap = $("results-buckets");
    wrap.innerHTML = "";
    Object.keys(r.buckets).forEach(function (key) {
      var b = r.buckets[key];
      var row = document.createElement("div");
      row.className = "bucket";

      var left = document.createElement("div");
      var name = document.createElement("span");
      name.className = "bucket-name";
      name.textContent = b.label;
      var sub = document.createElement("span");
      sub.className = "bucket-sub";
      sub.textContent = b.answered
        ? b.correct + " of " + b.answered + " correct"
        : "not yet assessed";
      left.appendChild(name);
      left.appendChild(sub);

      var score = document.createElement("span");
      if (b.accuracy === null) {
        score.className = "bucket-score score-none";
        score.textContent = "—";
      } else {
        score.className = "bucket-score " + (b.accuracy >= 0.8 ? "score-good" : "score-weak");
        score.textContent = Math.round(b.accuracy * 100) + "%";
      }

      row.appendChild(left);
      row.appendChild(score);
      wrap.appendChild(row);
    });
  }

  function renderBars(container, rows) {
    container.innerHTML = "";
    if (!rows.length) {
      container.innerHTML = '<p class="stage-note">Not enough data yet.</p>';
      return;
    }
    rows.forEach(function (row) {
      var wrap = document.createElement("div");
      wrap.className = "bar-row";

      var head = document.createElement("div");
      head.className = "bar-head";

      var label = document.createElement("span");
      label.className = "bar-label";
      label.textContent = row.label;
      if (row.mastered) {
        var pill = document.createElement("span");
        pill.className = "mastery-pill";
        pill.textContent = "Mastered";
        label.appendChild(pill);
      }

      var value = document.createElement("span");
      value.className = "bar-value";
      value.textContent = Math.round(row.accuracy * 100) + "% · " + row.detail;

      head.appendChild(label);
      head.appendChild(value);

      var track = document.createElement("div");
      track.className = "bar-track";
      var fill = document.createElement("div");
      fill.className = "bar-fill " + (row.accuracy >= 0.8 ? "is-good" : row.accuracy < 0.7 ? "is-weak" : "");
      fill.style.width = Math.round(row.accuracy * 100) + "%";
      track.appendChild(fill);

      wrap.appendChild(head);
      wrap.appendChild(track);
      container.appendChild(wrap);
    });
  }

  function renderRecommendations(r) {
    var list = $("results-recs");
    list.innerHTML = "";

    var items = r.recommendations.slice();
    // The label comes from /config, so a pharmacology quiz says "medication
    // classes" and a pathophysiology quiz says "body systems".
    var weak = r.weakCategories || r.weakMedicationClasses || [];
    if (weak.length) {
      var label = (config.categoryLabelPlural || "medication classes").toLowerCase();
      items.push({
        area: "Weak " + label,
        advice: "Revisit " + weak.join(", ") + "."
      });
    }
    if (r.expertChallengeUnlocked) {
      items.push({
        area: "Expert challenge",
        advice: "You scored 90% or above — you have earned the optional 20-question expert challenge. Ask your tutor to release it."
      });
    }
    if (!items.length) {
      items.push({ area: "Well placed", advice: "No area fell below 80%. Keep cycling through mixed practice to hold the gains." });
    }

    items.forEach(function (item) {
      var li = document.createElement("li");
      var strong = document.createElement("strong");
      strong.textContent = item.area + ": ";
      li.appendChild(strong);
      li.appendChild(document.createTextNode(item.advice));
      list.appendChild(li);
    });
  }

  function renderMissed(r) {
    var wrap = $("results-missed");
    wrap.innerHTML = "";

    text($("results-missed-count"), r.missedQuestions.length
      ? r.missedQuestions.length + " question(s) to review. Each opens to the full rationale."
      : "You did not miss any questions in this attempt.");

    r.missedQuestions.forEach(function (q) {
      var details = document.createElement("details");
      details.className = "missed-item";

      var summary = document.createElement("summary");
      summary.className = "missed-summary";
      var strong = document.createElement("strong");
      strong.textContent = "Q" + q.number + " · " + q.topic;
      var meta = document.createElement("span");
      meta.className = "missed-meta";
      meta.textContent = (q.category || q.medicationClass) + " · Level " + q.difficulty +
        (q.type === "sata" ? " · select all that apply" : "");
      summary.appendChild(strong);
      summary.appendChild(meta);
      details.appendChild(summary);

      var body = document.createElement("div");
      body.className = "missed-body";

      var stem = document.createElement("p");
      stem.textContent = q.stem;
      body.appendChild(stem);

      var ul = document.createElement("ul");
      ul.className = "option-review";
      q.options.forEach(function (opt) {
        ul.appendChild(optionReviewItem({
          text: opt.text,
          isCorrect: q.correct.indexOf(opt.id) !== -1,
          wasSelected: false,
          explanation: q.distractorRationales ? q.distractorRationales[opt.id] : null
        }));
      });
      body.appendChild(ul);

      [["Why", q.rationale], ["Key clue", q.keyClue],
       ["Clinical takeaway", q.clinicalTakeaway], ["Remediation", q.remediationConcept]
      ].forEach(function (pair) {
        if (!pair[1]) return;
        var h = document.createElement("h3");
        h.textContent = pair[0];
        var p = document.createElement("p");
        p.textContent = pair[1];
        body.appendChild(h);
        body.appendChild(p);
      });

      details.appendChild(body);
      wrap.appendChild(details);
    });
  }

  // ── Restart ────────────────────────────────────────────────────────────
  function askRestart() { $("confirm-backdrop").hidden = false; $("btn-confirm-restart").focus(); }
  function cancelRestart() { $("confirm-backdrop").hidden = true; }

  function doRestart() {
    $("confirm-backdrop").hidden = true;
    clearSaved();
    state = freshState();
    save();
    nextQuestion();
  }

  // ── Resume a saved attempt ─────────────────────────────────────────────
  function resumeSaved(saved) {
    state = saved;
    // Mid-remediation states are not resumed: the question is already graded and
    // recorded, so continuing from the next question loses nothing but the notes.
    state.phase = "question";
    state.probes = null;
    save();
    nextQuestion();
  }

  // ── Wire up ────────────────────────────────────────────────────────────
  function bind() {
    $("btn-start").addEventListener("click", function () {
      clearSaved();
      state = freshState();
      save();
      nextQuestion();
    });
    $("btn-resume").addEventListener("click", function () {
      var saved = load();
      if (saved) resumeSaved(saved); else nextQuestion();
    });

    $("question-form").addEventListener("submit", onSubmit);
    $("btn-next").addEventListener("click", onNext);

    $("btn-to-probes").addEventListener("click", showProbes);
    $("remediation-probes").addEventListener("submit", onSubmitProbes);
    $("btn-skip-probes").addEventListener("click", skipProbes);
    $("btn-resume-quiz").addEventListener("click", resumeAfterRemediation);

    $("code-form").addEventListener("submit", onSubmitCode);
    $("btn-see-results").addEventListener("click", renderResults);
    $("btn-unlock-from-results").addEventListener("click", renderPaywall);
    $("btn-continue-quiz").addEventListener("click", nextQuestion);

    $("btn-restart").addEventListener("click", askRestart);
    $("btn-restart-results").addEventListener("click", askRestart);
    $("btn-confirm-restart").addEventListener("click", doRestart);
    $("btn-cancel-restart").addEventListener("click", cancelRestart);
    $("confirm-backdrop").addEventListener("click", function (e) {
      if (e.target === $("confirm-backdrop")) cancelRestart();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !$("confirm-backdrop").hidden) cancelRestart();
    });

    $("btn-print").addEventListener("click", function () { window.print(); });
    $("btn-reload").addEventListener("click", function () { window.location.reload(); });
  }

  // ── Boot ───────────────────────────────────────────────────────────────
  entitlement = loadEntitlement();

  apiGet("/config")
    .then(function (data) {
      config = data;
      // A stored token the server rejects (expired, or secret rotated) is dropped
      // so the learner sees the paywall rather than silent 402s mid-quiz.
      if (entitlement && !config.entitled) {
        try { localStorage.removeItem(ENTITLEMENT_KEY); } catch (e) { /* ignore */ }
        entitlement = null;
      }
      bind();
      state = freshState();
      renderStart();
    })
    .catch(function () {
      fail("Could not reach the quiz service. Please reload in a moment.");
    });
})();
