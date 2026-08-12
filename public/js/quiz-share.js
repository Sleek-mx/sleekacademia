// Classmate share block for the quiz pages.
//
// The quizzes are the only thing on the site a student will hand to another
// student unprompted, and nursing cohorts run on group chats. This renders a
// WhatsApp share and a copy-link into any `[data-quiz-share]` container, with
// UTM tags so the traffic shows up in GA as shares rather than "direct".
//
// Deliberately standalone: quiz-engine.js is large, stateful and covered by its
// own tests, and none of that needs to know about sharing.
(function () {
  "use strict";

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function shareUrl(medium) {
    var url = new URL(window.location.pathname, window.location.origin);
    url.searchParams.set("utm_source", "student_share");
    url.searchParams.set("utm_medium", medium);
    url.searchParams.set("utm_campaign", "quiz_share");
    return url.toString();
  }

  function track(name, medium) {
    try {
      if (typeof window.gtag === "function") {
        window.gtag("event", name, { method: medium, page: window.location.pathname });
      }
    } catch (error) {
      // Sharing must work with or without analytics.
    }
  }

  function render(container) {
    var title = container.dataset.shareTitle || document.title;
    var message = container.dataset.shareMessage
      || "Free practice questions with full rationales, no signup needed:";

    container.replaceChildren();
    container.append(el("h2", "", "Know someone in your cohort?"));
    container.append(el("p", "stage-note", "Send them the free half. They do not need an account, and nothing is charged to start."));

    var actions = el("div", "actions");

    var whatsapp = el("a", "btn btn-primary", "Share on WhatsApp");
    whatsapp.href = "https://wa.me/?text=" + encodeURIComponent(message + " " + title + " — " + shareUrl("whatsapp"));
    whatsapp.target = "_blank";
    whatsapp.rel = "noopener noreferrer";
    whatsapp.addEventListener("click", function () { track("quiz_shared", "whatsapp"); });
    actions.append(whatsapp);

    var copy = el("button", "btn btn-ghost", "Copy link");
    copy.type = "button";
    copy.addEventListener("click", function () {
      var link = shareUrl("copy");
      var done = function () {
        copy.textContent = "Link copied";
        track("quiz_shared", "copy");
        window.setTimeout(function () { copy.textContent = "Copy link"; }, 2500);
      };
      // Clipboard access needs a secure context and can be refused outright;
      // fall back to showing the link so the share never simply fails.
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(link).then(done, function () { window.prompt("Copy this link", link); });
      } else {
        window.prompt("Copy this link", link);
      }
    });
    actions.append(copy);

    container.append(actions);
  }

  function mount() {
    var containers = document.querySelectorAll("[data-quiz-share]");
    for (var i = 0; i < containers.length; i += 1) render(containers[i]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
}());
