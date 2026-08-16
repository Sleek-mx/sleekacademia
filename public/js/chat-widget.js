/* Sleek Academia — floating site assistant ("Sleekie").
 *
 * Loaded on every public page except the three paid quiz pages.
 *
 * Design notes worth keeping:
 * - The system prompt lives on the server. This file posts messages only, so nobody can rewrite
 *   the bot's rules from the console (the previous widget shipped its whole prompt).
 * - The conversation is kept in sessionStorage so moving between pages does not restart intake.
 * - Every asset URL carries ?v=SA_CHAT_VERSION. Static CSS/JS is served max-age=14400, so an
 *   unversioned URL leaves returning visitors on the old file for up to four hours.
 */
(function () {
  'use strict';

  var VERSION = '20260802';
  var STORE_KEY = 'sleek.chat.v1';
  var WHATSAPP_NUMBER = '254742836835';
  var MARK = '/images/brand/sleek-academia-mark.webp';
  var MAX_TURNS = 12;

  var GREETING =
    "Hi, I'm Sleekie. I can explain how guidance works, help you find study tools, " +
    'or pass a question to the team. What brings you in today?';

  var SUGGESTIONS = [
    'How does guidance work?',
    'Show me study tools',
    'I need exam prep help'
  ];

  var root, panel, launcher, log, input, sendBtn, chipsEl;
  var history = [];
  var busy = false;
  var readyToSend = false;
  var opened = false;

  /* ── storage ─────────────────────────────────────────────────────── */

  function load() {
    try {
      var raw = sessionStorage.getItem(STORE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      return parsed && Array.isArray(parsed.history) ? parsed : null;
    } catch (err) {
      return null;
    }
  }

  function save() {
    try {
      sessionStorage.setItem(
        STORE_KEY,
        JSON.stringify({ history: history.slice(-MAX_TURNS), readyToSend: readyToSend, opened: opened })
      );
    } catch (err) {
      /* private mode — the widget still works, it just forgets on navigation */
    }
  }

  /* ── build ───────────────────────────────────────────────────────── */

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function build() {
    root = el('div', null);
    root.id = 'sa-chat-root';
    root.setAttribute('data-open', 'false');

    panel = el('div', 'sa-panel');
    panel.id = 'sa-chat-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'false');
    panel.setAttribute('aria-label', 'Chat with Sleek Academia');

    var head = el('div', 'sa-head');
    var avatar = el('div', 'sa-head-avatar');
    var avatarImg = new Image();
    avatarImg.src = MARK;
    avatarImg.alt = '';
    avatar.appendChild(avatarImg);

    var headText = el('div', 'sa-head-text');
    headText.appendChild(el('strong', null, 'Sleekie'));
    var status = el('span');
    status.appendChild(el('i', 'sa-dot'));
    status.appendChild(document.createTextNode('Sleek Academia assistant'));
    headText.appendChild(status);

    var headClose = el('button', 'sa-head-close', '×');
    headClose.type = 'button';
    headClose.setAttribute('aria-label', 'Close chat');

    head.appendChild(avatar);
    head.appendChild(headText);
    head.appendChild(headClose);

    log = el('div', 'sa-log');
    log.id = 'sa-chat-log';
    log.setAttribute('role', 'log');
    log.setAttribute('aria-live', 'polite');

    chipsEl = el('div', 'sa-chips');

    var composer = el('div', 'sa-composer');
    input = el('textarea', 'sa-input');
    input.rows = 1;
    input.placeholder = 'Ask Sleekie…';
    input.setAttribute('aria-label', 'Message');
    sendBtn = el('button', 'sa-send');
    sendBtn.type = 'button';
    sendBtn.setAttribute('aria-label', 'Send message');
    sendBtn.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>';
    composer.appendChild(input);
    composer.appendChild(sendBtn);

    var legal = el(
      'div',
      'sa-legal',
      'Sleekie gives general guidance, not academic, clinical or legal advice.'
    );

    panel.appendChild(head);
    panel.appendChild(log);
    panel.appendChild(chipsEl);
    panel.appendChild(composer);
    panel.appendChild(legal);

    launcher = el('button', 'sa-launcher');
    launcher.type = 'button';
    launcher.id = 'sa-chat-launcher';
    launcher.setAttribute('aria-label', 'Chat with Sleek Academia');
    launcher.setAttribute('aria-expanded', 'false');
    launcher.setAttribute('aria-controls', 'sa-chat-panel');
    var markImg = new Image();
    markImg.src = MARK;
    markImg.alt = '';
    markImg.width = 38;
    markImg.height = 38;
    launcher.appendChild(markImg);
    launcher.appendChild(el('span', 'sa-close-glyph', '×'));

    root.appendChild(panel);
    root.appendChild(launcher);
    document.body.appendChild(root);

    launcher.addEventListener('click', toggle);
    headClose.addEventListener('click', close);
    sendBtn.addEventListener('click', function () { submit(input.value); });
    input.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        submit(input.value);
      }
    });
    input.addEventListener('input', autosize);
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && root.getAttribute('data-open') === 'true') close();
    });
  }

  function autosize() {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 92) + 'px';
  }

  /* ── open / close ────────────────────────────────────────────────── */

  function toggle() {
    if (root.getAttribute('data-open') === 'true') close();
    else open();
  }

  function open() {
    root.setAttribute('data-open', 'true');
    root.setAttribute('data-nudge', 'false');
    launcher.setAttribute('aria-expanded', 'true');
    opened = true;
    save();
    if (!history.length) start();
    window.setTimeout(function () { if (!readyToSend) input.focus(); }, 260);
  }

  function close() {
    root.setAttribute('data-open', 'false');
    launcher.setAttribute('aria-expanded', 'false');
    launcher.focus();
  }

  /* ── rendering ───────────────────────────────────────────────────── */

  var LINK_LABELS = {
    '/onboard.html': 'start a request',
    '/store.html': 'the store',
    '/blog.html': 'the blog',
    '/about.html': 'about us',
    '/nclex-prep.html': 'the NCLEX-RN guide',
    '/ube-bar-exam-prep.html': 'the UBE bar exam guide',
    '/cfa-level-1-prep.html': 'the CFA Level I guide',
    '/comptia-security-plus-prep.html': 'the Security+ guide',
    '/sign-up.html': 'sign up',
    '/login.html': 'log in',
    '/dashboard.html': 'your dashboard'
  };

  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* Model output only — bold, italics, line breaks, and site paths turned into real links. */
  function render(text) {
    var html = escapeHtml(text)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*])\*(?!\s)([^*]+?)\*/g, '$1<em>$2</em>')
      .replace(/\n/g, '<br>');

    Object.keys(LINK_LABELS).forEach(function (path) {
      var pattern = new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      html = html.replace(pattern, '<a href="' + path + '">' + LINK_LABELS[path] + '</a>');
    });

    return html;
  }

  function formatTime(date) {
    try {
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    } catch (err) {
      return '';
    }
  }

  function addMessage(role, text) {
    var wrap = el('div', 'sa-msg-group sa-msg-group-' + (role === 'user' ? 'user' : 'ai'));
    var label = el('div', 'sa-msg-label', (role === 'user' ? 'You' : 'Sleekie') + ' · ' + formatTime(new Date()));
    var node = el('div', 'sa-msg sa-msg-' + (role === 'user' ? 'user' : 'ai'));
    if (role === 'user') node.textContent = text;
    else node.innerHTML = render(text);
    wrap.appendChild(label);
    wrap.appendChild(node);
    log.appendChild(wrap);
    scroll();
    return node;
  }

  function addNote(text) {
    var node = el('div', 'sa-msg sa-msg-note', text);
    log.appendChild(node);
    scroll();
    return node;
  }

  function scroll() {
    log.scrollTop = log.scrollHeight;
  }

  function clearChips() {
    chipsEl.innerHTML = '';
  }

  function setChips(items) {
    clearChips();
    items.forEach(function (item, index) {
      var chip = el('button', 'sa-chip' + (item.primary ? ' sa-chip-primary' : ''), item.label);
      chip.type = 'button';
      chip.style.animationDelay = index * 60 + 'ms';
      chip.addEventListener('click', item.onClick);
      chipsEl.appendChild(chip);
    });
  }

  function showTyping() {
    var node = el('div', 'sa-typing');
    node.appendChild(el('i'));
    node.appendChild(el('i'));
    node.appendChild(el('i'));
    log.appendChild(node);
    scroll();
    return node;
  }

  function setBusy(value) {
    busy = value;
    input.disabled = value;
    sendBtn.disabled = value;
  }

  /* ── conversation ────────────────────────────────────────────────── */

  function start() {
    history.push({ role: 'assistant', content: GREETING });
    addMessage('assistant', GREETING);
    save();
    setChips(
      SUGGESTIONS.map(function (label) {
        return { label: label, onClick: function () { submit(label); } };
      })
    );
  }

  function submit(raw) {
    var text = String(raw || '').trim();
    if (!text || busy || readyToSend) return;

    input.value = '';
    autosize();
    clearChips();
    addMessage('user', text);
    history.push({ role: 'user', content: text });
    if (history.length > MAX_TURNS) history = history.slice(-MAX_TURNS);
    save();

    setBusy(true);
    var typing = showTyping();

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history })
    })
      .then(function (response) {
        if (!response.ok) throw new Error('status ' + response.status);
        return response.json();
      })
      .then(function (data) {
        typing.remove();
        var reply = String(data.reply || '').trim();
        if (!reply) throw new Error('empty reply');
        history.push({ role: 'assistant', content: reply });
        addMessage('assistant', reply);
        save();
        if (data.ready || wantsHandoff(reply)) enterHandoff();
      })
      .catch(function () {
        typing.remove();
        addMessage(
          'assistant',
          'I could not reach the team just now. You can still start a request at /onboard.html, ' +
            'or send your details straight to a person below.'
        );
        offerHandoff();
      })
      .finally(function () {
        if (!readyToSend) {
          setBusy(false);
          input.focus();
        }
      });
  }

  /* ── handoff ─────────────────────────────────────────────────────── */

  function transcript() {
    return history
      .map(function (message) {
        return (message.role === 'user' ? 'Student' : 'Sleekie') + ': ' + message.content;
      })
      .join('\n\n');
  }

  function summary() {
    var answers = history.filter(function (m) { return m.role === 'user'; });
    var lastSleekie = '';
    for (var i = history.length - 1; i >= 0; i--) {
      if (history[i].role === 'assistant') { lastSleekie = history[i].content; break; }
    }
    // Positional: these line up with the four intake questions only when the
    // visitor answered them in order. Someone who asks a question first shifts
    // them, so the block says "in the order given" and the full transcript is
    // always attached underneath.
    var labels = ['Name', 'Studying', 'Timing', 'Needs'];
    var lines = labels.map(function (label, index) {
      return label + ': ' + (answers[index] ? answers[index].content.trim() : 'not given');
    });
    lines.push('Page: ' + window.location.pathname);
    return 'First answers, in the order given\n' + lines.join('\n') +
      '\n\n' + lastSleekie + '\n\n--- Full conversation ---\n' + transcript();
  }

  /* The model is meant to close intake with the READY marker, but it does not
   * emit it every time — it sometimes just says "shall I pass this on?" in
   * prose. When that happens the visitor is offered a route with no button to
   * take it, which is the one failure this widget cannot afford. So the reply
   * text is checked too: if it offers to hand over, show the chips anyway. */
  var HANDOFF_INTENT = /(pass|send|forward)(ing)?\s+(this|these|your|it)\b[^.?!]{0,40}\b(to\s+)?the\s+team|open\s+a?\s*whatsapp|shall i (send|pass)|would you like me to (send|pass)|how would you like to send/i;

  function wantsHandoff(reply) {
    return HANDOFF_INTENT.test(reply);
  }

  function enterHandoff() {
    readyToSend = true;
    setBusy(true);
    input.placeholder = 'Choose how to send your enquiry';
    save();
    offerHandoff();
  }

  function offerHandoff() {
    readyToSend = true;
    setBusy(true);
    // WhatsApp leads: it is now the site's only direct line to a human, and the
    // details collected above are attached to the message.
    setChips([
      { label: 'Continue on WhatsApp', primary: true, onClick: sendWhatsApp },
      { label: 'Send to the team', onClick: sendEmail },
      { label: 'Start a request', onClick: function () { window.location.href = '/onboard.html'; } },
      { label: 'Start over', onClick: reset }
    ]);
  }

  function sendEmail() {
    clearChips();
    var note = addNote('Sending your enquiry…');

    fetch('/api/chat/send-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ summary: summary() })
    })
      .then(function (response) {
        if (!response.ok) throw new Error('status ' + response.status);
        return response.json();
      })
      .then(function () {
        note.textContent = 'Sent. The team will follow up shortly.';
        setChips([{ label: 'Start over', onClick: reset }]);
      })
      .catch(function () {
        note.textContent = 'That did not go through. WhatsApp is the fastest route right now.';
        setChips([
          { label: 'Open WhatsApp', primary: true, onClick: sendWhatsApp },
          { label: 'Try again', onClick: sendEmail },
          { label: 'Start over', onClick: reset }
        ]);
      });
  }

  function sendWhatsApp() {
    var message = 'Sleek Academia enquiry\n\n' + summary();
    window.open(
      'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message),
      '_blank',
      'noopener,noreferrer'
    );
    addNote('Opening WhatsApp with your details.');
    setChips([{ label: 'Start over', onClick: reset }]);
  }

  function reset() {
    history = [];
    readyToSend = false;
    log.innerHTML = '';
    clearChips();
    input.placeholder = 'Ask Sleekie…';
    setBusy(false);
    save();
    start();
    input.focus();
  }

  /* ── restore ─────────────────────────────────────────────────────── */

  function restore() {
    var saved = load();
    if (!saved) {
      // First page of the visit — nudge once, after the page has settled.
      window.setTimeout(function () {
        if (root.getAttribute('data-open') !== 'true') root.setAttribute('data-nudge', 'true');
      }, 4000);
      return;
    }

    opened = Boolean(saved.opened);
    history = saved.history.slice(-MAX_TURNS);
    history.forEach(function (message) { addMessage(message.role, message.content); });
    if (saved.readyToSend && history.length) offerHandoff();
    if (!opened) root.setAttribute('data-nudge', 'true');
  }

  /* ── init ────────────────────────────────────────────────────────── */

  function init() {
    if (document.getElementById('sa-chat-root')) return;
    build();
    restore();

    // The floating contact dock and the standalone WhatsApp links were removed;
    // Sleekie is now the single route to a human, and it only hands off to
    // WhatsApp once it has collected the student's details. Any element marked
    // data-open-sleekie opens the panel.
    document.querySelectorAll('[data-open-sleekie]').forEach(function (trigger) {
      trigger.addEventListener('click', function (event) {
        event.preventDefault();
        open();
      });
    });
  }

  window.SleekieChat = { open: open, close: close, toggle: toggle };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.SA_CHAT_VERSION = VERSION;
})();
