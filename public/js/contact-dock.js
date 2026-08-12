// Contact dock — the "talk to a human now" path on every public page.
//
// Why this exists: every route into the business used to be the four-step order
// wizard, which ends in an account and a quote that arrives later. A visitor
// with a deadline and one question had nowhere to go, so they left without
// leaving a trace. This puts WhatsApp and a two-field message form on every
// page, and the message form reports to the owner-alert mailer, so a lead is
// captured even when nobody is awake to answer.
//
// The chat widget owns the bottom-right corner, so this sits bottom-left.
(function () {
  "use strict";

  // The single place these details are defined. Changing the number here
  // changes it on every page.
  var CONTACT = {
    whatsapp: "254724543489",
    whatsappDisplay: "+254 724 543 489",
    email: "info@sleekacademia.com",
    replyWindow: "Most messages are answered within a few hours.",
  };

  var PREFILL = "Hi Sleek Academia — I need help with ";

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function track(name, params) {
    try {
      if (typeof window.gtag === "function") window.gtag("event", name, params || {});
      if (typeof window.fbq === "function") window.fbq("trackCustom", name, params || {});
      if (window.ttq && typeof window.ttq.track === "function") window.ttq.track(name, params || {});
    } catch (error) {
      // Analytics must never break the contact path.
    }
  }

  function whatsappHref() {
    return "https://wa.me/" + CONTACT.whatsapp + "?text=" + encodeURIComponent(PREFILL);
  }

  function buildPanel() {
    var panel = el("div", "sa-dock__panel");
    panel.id = "sa-dock-panel";
    panel.hidden = true;

    panel.append(el("h2", "sa-dock__title", "Talk to us first"));
    panel.append(el("p", "sa-dock__lead", "No account needed. Ask about price, deadline, or whether we can help at all."));

    var whatsapp = el("a", "sa-dock__whatsapp", "Chat on WhatsApp");
    whatsapp.href = whatsappHref();
    whatsapp.target = "_blank";
    whatsapp.rel = "noopener noreferrer";
    whatsapp.addEventListener("click", function () {
      track("contact_whatsapp_click", { page: location.pathname });
    });
    panel.append(whatsapp);

    var divider = el("p", "sa-dock__divider", "or send a message");
    panel.append(divider);

    var form = el("form", "sa-dock__form");
    form.noValidate = true;

    var name = el("input");
    name.name = "name";
    name.placeholder = "Your name";
    name.autocomplete = "name";
    name.setAttribute("aria-label", "Your name");

    var email = el("input");
    email.name = "email";
    email.type = "email";
    email.required = true;
    email.placeholder = "Email";
    email.autocomplete = "email";
    email.setAttribute("aria-label", "Your email");

    var message = el("textarea");
    message.name = "message";
    message.required = true;
    message.rows = 3;
    message.placeholder = "What do you need help with, and by when?";
    message.setAttribute("aria-label", "Your message");

    var submit = el("button", "sa-dock__submit", "Send message");
    submit.type = "submit";

    var status = el("p", "sa-dock__status");
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");

    form.append(name, email, message, submit, status);
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      void sendMessage({ form: form, submit: submit, status: status, name: name, email: email, message: message });
    });
    panel.append(form);

    var mail = el("a", "sa-dock__mail", CONTACT.email);
    mail.href = "mailto:" + CONTACT.email;
    panel.append(mail);
    panel.append(el("p", "sa-dock__note", CONTACT.replyWindow));
    return panel;
  }

  function sendMessage(parts) {
    var email = parts.email.value.trim();
    var message = parts.message.value.trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      parts.status.textContent = "Add an email so we can reply.";
      parts.email.focus();
      return Promise.resolve();
    }
    if (message.length < 5) {
      parts.status.textContent = "Tell us a little about what you need.";
      parts.message.focus();
      return Promise.resolve();
    }

    parts.submit.disabled = true;
    parts.submit.textContent = "Sending...";
    parts.status.textContent = "";

    return fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: parts.name.value.trim(),
        email: email,
        message: message,
        page: location.pathname,
      }),
    })
      .then(function (response) {
        return response.json().catch(function () { return {}; }).then(function (payload) {
          if (!response.ok) throw new Error(payload.error || "The message could not be sent.");
          return payload;
        });
      })
      .then(function () {
        track("contact_message_sent", { page: location.pathname });
        parts.form.reset();
        parts.status.textContent = "Sent. We will reply to " + email + ".";
      })
      .catch(function (error) {
        // A failed form must not be a dead end — WhatsApp is always there.
        parts.status.textContent = error.message + " You can reach us on WhatsApp instead.";
      })
      .finally(function () {
        parts.submit.disabled = false;
        parts.submit.textContent = "Send message";
      });
  }

  function mount() {
    if (document.querySelector(".sa-dock")) return;

    var dock = el("div", "sa-dock");
    var panel = buildPanel();

    var toggle = el("button", "sa-dock__toggle");
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "sa-dock-panel");
    toggle.append(el("span", "sa-dock__toggle-icon", "💬"));
    toggle.append(el("span", "sa-dock__toggle-text", "Talk to us"));

    function setOpen(open) {
      panel.hidden = !open;
      dock.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      if (open) track("contact_dock_opened", { page: location.pathname });
    }

    toggle.addEventListener("click", function () { setOpen(panel.hidden); });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !panel.hidden) { setOpen(false); toggle.focus(); }
    });
    document.addEventListener("click", function (event) {
      if (panel.hidden) return;
      if (dock.contains(event.target)) return;
      setOpen(false);
    });

    dock.append(panel, toggle);
    document.body.append(dock);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
}());
